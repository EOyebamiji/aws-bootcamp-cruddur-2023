# Week 6 — Deploying Containers

Test RDS Connecetion
  Add this test script into db so we can easily check our connection from our container.

Implemented health check
  We added the following endpoint for our flask app
```python
#!/usr/bin/env python3

import urllib.request

response = urllib.request.urlopen('http://localhost:4567/api/health-check')
if response.getcode() == 200:
  print("Flask server is running")
else:
  print("Flask server is not running")
```

Create CloudWatch Log Group
Created a cruddur fargate cluster and set a 1day retention for our logs. However,
```sh
aws logs create-log-group --log-group-name "/cruddur/fargate-cluster"
aws logs put-retention-policy --log-group-name "/cruddur/fargate-cluster" --retention-in-days 1

reverted the retention period of our initial cruddur log to "never expire"
aws logs delete-retention-policy --log-group-name cruddur

```

Create ECS Cluster
Created an ECS cluster 

```sh
aws ecs create-cluster \
--cluster-name cruddur \
--service-connect-defaults namespace=cruddur
```

Create ECR repo and push image
Created an image for our base image application "cuddur-python"

```sh
aws ecr create-repository \
  --repository-name cruddur-python \
  --image-tag-mutability MUTABLE
```

After creating the repo, we need to login to ECR so we can push our image to the created repository
We used the env var we have set for our aws credentials

```sh
aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```

before building our image, we set the path for our image as an env var

```sh
export ECR_PYTHON_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/cruddur-python"
echo $ECR_PYTHON_URL
```

next step, we pull the pythn alpine image from dockerhub

```sh
docker pull python:3.10-slim-buster
```

we tag our image and prepare it to be pushed to our ECR repo

```sh
docker tag python:3.10-slim-buster $ECR_PYTHON_URL:3.10-slim-buster
```

we then push our tagged image to ECR

```sh
docker push $ECR_PYTHON_URL:3.10-slim-buster
```

Next, we updated our flask app to use our new image from our ECR repo

We then ran a docker-compose up select services to test our new image and confirm health check

```sh
docker compose up backend-flask db
```


Create ECR repo and push image
Created an image for our backend-flask image application backend-flask"
```sh
aws ecr create-repository \
  --repository-name backend-flask \
  --image-tag-mutability MUTABLE
```


before building our image, we set the path for our image as an env var
```sh
export ECR_BACKEND_FLASK_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/backend-flask"
echo $ECR_BACKEND_FLASK_URL
```

we now build the image

```sh
cd backend-flask/
docker build -t backend-flask .
```

we now tag the image and get it ready to be pushed to our created ECR repo

```sh
docker tag backend-flask:latest $ECR_BACKEND_FLASK_URL:latest
```

we then pushed our image to the "backend-flask" ECR repo

```sh
docker push $ECR_BACKEND_FLASK_URL:latest
```

Now, we Create Task and Exection Roles for Task Defintion

Before creating the task and definitions, we need to setup parameters from the AWS Systems Manager

```sh
aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/AWS_ACCESS_KEY_ID" --value $AWS_ACCESS_KEY_ID
aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/AWS_SECRET_ACCESS_KEY" --value $AWS_SECRET_ACCESS_KEY
aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/CONNECTION_URL" --value $PROD_CONNECTION_URL
aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/ROLLBAR_ACCESS_TOKEN" --value $ROLLBAR_ACCESS_TOKEN
aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/OTEL_EXPORTER_OTLP_HEADERS" --value $OTEL_EXPORTER_OTLP_HEADERS

```

First, we create executionrole

create a json file named service-execution-policy in the aws/policies directory

```json
{
  "Version":"2012-10-17",
  "Statement":[{
    "Action":["sts:AssumeRole"],
    "Effect":"Allow",
    "Principal":{
      "Service":["ecs-tasks.amazonaws.com"]
    }
  }]
}
```
then we run the aws command

```sh
aws iam create-role \
    --role-name CruddurServiceExecutionRole \
    --assume-role-policy-document file://aws/policies/service-assume-execution-policy.json
```

then we create the service-assume-execution-policy in the aws/policies directory

```json
{
  "Version":"2012-10-17",
  "Statement":[{
    "Effect": "Allow",
    "Action": [
      "ssm:GetParameters",
      "ssm:GetParameter"
    ],
    "Resource": "arn:aws:ssm:us-east-1:572891318033:parameter/cruddur/backend-flask/*"
  }]
}
```

then we run the aws command

```sh
aws iam put-role-policy \
    --policy-name CruddurServiceExecutionPolicy \
    --role-name CruddurServiceExecutionRole \
    --policy-document file://aws/policies/service-execution-policy.json
```

we then create task role

```sh
aws iam create-role \
    --role-name CruddurTaskRole \
    --assume-role-policy-document "{
  \"Version\":\"2012-10-17\",
  \"Statement\":[{
    \"Action\":[\"sts:AssumeRole\"],
    \"Effect\":\"Allow\",
    \"Principal\":{
      \"Service\":[\"ecs-tasks.amazonaws.com\"]
    }
  }]
}"

```
We grant permission to the task role we created for access for CloudWatch and X-Ray Deamon

```sh
aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/CloudWatchFullAccess --role-name CruddurTaskRole
aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess --role-name CruddurTaskRole
```

Now, we progress to create our task-definition ```aws/task-definition``` directory and create a file ```backend-flask.json```

```json
{
  "family": "backend-flask",
  "executionRoleArn": "arn:aws:iam::AWS_ACCOUNT_ID:role/CruddurServiceExecutionRole",
  "taskRoleArn": "arn:aws:iam::AWS_ACCOUNT_ID:role/CruddurTaskRole",
  "networkMode": "awsvpc",
  "containerDefinitions": [
    {
      "name": "backend-flask",
      "image": "BACKEND_FLASK_IMAGE_URL",
      "cpu": 256,
      "memory": 512,
      "essential": true,
      "portMappings": [
        {
          "name": "backend-flask",
          "containerPort": 4567,
          "protocol": "tcp", 
          "appProtocol": "http"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
            "awslogs-group": "cruddur",
            "awslogs-region": "ca-central-1",
            "awslogs-stream-prefix": "backend-flask"
        }
      },
      "environment": [
        {"name": "OTEL_SERVICE_NAME", "value": "backend-flask"},
        {"name": "OTEL_EXPORTER_OTLP_ENDPOINT", "value": "https://api.honeycomb.io"},
        {"name": "AWS_COGNITO_USER_POOL_ID", "value": ""},
        {"name": "AWS_COGNITO_USER_POOL_CLIENT_ID", "value": ""},
        {"name": "FRONTEND_URL", "value": ""},
        {"name": "BACKEND_URL", "value": ""},
        {"name": "AWS_DEFAULT_REGION", "value": ""}
      ],
      "secrets": [
        {"name": "AWS_ACCESS_KEY_ID"    , "valueFrom": "arn:aws:ssm:AWS_REGION:AWS_ACCOUNT_ID:parameter/cruddur/backend-flask/AWS_ACCESS_KEY_ID"},
        {"name": "AWS_SECRET_ACCESS_KEY", "valueFrom": "arn:aws:ssm:AWS_REGION:AWS_ACCOUNT_ID:parameter/cruddur/backend-flask/AWS_SECRET_ACCESS_KEY"},
        {"name": "CONNECTION_URL"       , "valueFrom": "arn:aws:ssm:AWS_REGION:AWS_ACCOUNT_ID:parameter/cruddur/backend-flask/CONNECTION_URL" },
        {"name": "ROLLBAR_ACCESS_TOKEN" , "valueFrom": "arn:aws:ssm:AWS_REGION:AWS_ACCOUNT_ID:parameter/cruddur/backend-flask/ROLLBAR_ACCESS_TOKEN" },
        {"name": "OTEL_EXPORTER_OTLP_HEADERS" , "valueFrom": "arn:aws:ssm:AWS_REGION:AWS_ACCOUNT_ID:parameter/cruddur/backend-flask/OTEL_EXPORTER_OTLP_HEADERS" }
        
      ]
    }
  ]
}
```

after ceating the file, we register the created task definition

```sh
aws ecs register-task-definition --cli-input-json file://aws/task-definitions/backend-flask.json
```

Next step is to add the backend-flask service to the ECS "cruddur" cluster, 
However, we need to get our default VPC_ID to progress 

```sh
export DEFAULT_SUBNET_IDS=$(aws ec2 describe-subnets  \
 --filters Name=vpc-id,Values=$DEFAULT_VPC_ID \
 --query 'Subnets[*].SubnetId' \
 --output json | jq -r 'join(",")')
echo $DEFAULT_SUBNET_IDS
```

Then we progress to create a security group for the ECS cluster

```sh
export CRUD_SERVICE_SG=$(aws ec2 create-security-group \
  --group-name "crud-srv-sg" \
  --description "Security group for Cruddur services on ECS" \
  --vpc-id $DEFAULT_VPC_ID \
  --query "GroupId" --output text)
echo $CRUD_SERVICE_SG
```

After creating the SG, we need to grant ingress permission for access to the cluster

```sh
aws ec2 authorize-security-group-ingress \
  --group-id $CRUD_SERVICE_SG \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0
```

After creating the security group, we can use the below script to echo it.

```sh
export CRUD_SERVICE_SG=$(aws ec2 describe-security-groups \
  --filters Name=group-name,Values=crud-srv-sg \
  --query 'SecurityGroups[*].GroupId' \
  --output text)
```
We can confirm our service has been created in our cluster




```json

{
    "cluster": "cruddur",
    "launchType": "FARGATE",
    "desiredCount": 1,
    "enableECSManagedTags": true,
    "enableExecuteCommand": true,
    "networkConfiguration": {
      "awsvpcConfiguration": {
        "assignPublicIp": "ENABLED",
        "securityGroups": [
          "sg-0b44f3ea78f368bdc"
        ],
        "subnets": [
            "subnet-0b16b33182837edc3",
            "subnet-02de565effbff4ca4",
            "subnet-0bc279f0bb085dbaf",
            "subnet-0c15346fbfeb68753",
            "subnet-0322792782d28b241",
            "subnet-0e5dc607822a004a8"
        ]
      }
    },
    "propagateTags": "SERVICE",
    "serviceName": "backend-flask",
    "taskDefinition": "backend-flask",
    "serviceConnectConfiguration": {
      "enabled": true,
      "namespace": "cruddur",
      "services": [
        {
          "portName": "backend-flask",
          "discoveryName": "backend-flask",
          "clientAliases": [{"port": 4567}]
        }
      ]
    }
  }

```

After creating the Json file, we use the below code to provision the services described in the json document in our ECS Cluster

```sh
aws ecs create-service --cli-input-json file://aws/json/service-backend-flask.json
```

We then confirm the health-check of our app via the deployed container


Now, We set up Load Balancer

Application Load Balancer




aws ecs create-service --generate-cli-skeleton


```json
{
    "cluster": "cruddur",
    "launchType": "FARGATE",
    "desiredCount": 1,
    "enableECSManagedTags": true,
    "enableExecuteCommand": true,
    "loadBalancers": [
      {
        "targetGroupArn": "arn:aws:elasticloadbalancing:us-east-1:572891318033:targetgroup/cruddur-backend-flask-tg/677b3b86b4e67989",
        "loadBalancerName": "arn:aws:elasticloadbalancing:us-east-1:572891318033:loadbalancer/app/cruddur-alb/cb40a8cd01ba6367",
        "containerName": "backend-flask",
        "containerPort": 4567
      }
    ],
    "networkConfiguration": {
      "awsvpcConfiguration": {
        "assignPublicIp": "ENABLED",
        "securityGroups": [
          "sg-0b44f3ea78f368bdc"
        ],
        "subnets": [
            "subnet-0b16b33182837edc3",
            "subnet-02de565effbff4ca4",
            "subnet-0bc279f0bb085dbaf",
            "subnet-0c15346fbfeb68753",
            "subnet-0322792782d28b241",
            "subnet-0e5dc607822a004a8"
        ]
      }
    },
    "propagateTags": "SERVICE",
    "serviceName": "backend-flask",
    "taskDefinition": "backend-flask",
    "serviceConnectConfiguration": {
      "enabled": true,
      "namespace": "cruddur",
      "services": [
        {
          "portName": "backend-flask",
          "discoveryName": "backend-flask",
          "clientAliases": [{"port": 4567}]
        }
      ]
    }
  }
```