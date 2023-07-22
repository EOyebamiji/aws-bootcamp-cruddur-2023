# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy

In this week, we configured a CI/CD pipeline for our project using CodeBuild and CodePipeline.

I configured the CodePipeline and integrated the CodeBuild project just configured.

I edited my ```buildspec.yml``` file after consitent error in Codebuild ```YAML_FILE_ERROR Message: Unknown runtime named 'docker'. This build image has the following runtimes: dotnet, golang, java, nodejs, php, python, ruby```

![CodeBuild](assets/Week-9/CodeBuild%20Error.png)

I updated the ```buildspec.yml``` file  to resolve the thrown error

```yaml
# Buildspec runs in the build stage of your pipeline.
version: 0.2
phases:
  pre_build:
    commands:
      - echo "cd into $CODEBUILD_SRC_DIR/backend"
      - cd $CODEBUILD_SRC_DIR/backend-flask
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $IMAGE_URL
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...          
      - docker build -t backend-flask .
      - "docker tag $REPO_NAME $IMAGE_URL/$REPO_NAME"
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker image..
      - docker push $IMAGE_URL/$REPO_NAME
      - cd $CODEBUILD_SRC_DIR
      - echo "imagedefinitions.json > [{\"name\":\"$CONTAINER_NAME\",\"imageUri\":\"$IMAGE_URL/$REPO_NAME\"}]" > imagedefinitions.json
      - printf "[{\"name\":\"$CONTAINER_NAME\",\"imageUri\":\"$IMAGE_URL/$REPO_NAME\"}]" > imagedefinitions.json

env:
  variables:
    AWS_ACCOUNT_ID: 57289131xxxx
    AWS_DEFAULT_REGION: us-east-1
    CONTAINER_NAME: backend-flask
    IMAGE_URL: 57289131xxxx.dkr.ecr.us-east-1.amazonaws.com
    REPO_NAME: backend-flask:latest
artifacts:
  files:
    - imagedefinitions.json
```

![CodeBuild Success](assets/Week-9/CodeBuild%20Success.png)

Below is the image that captures successful integraion of the CodeBuild and CodePipeline

![CodeBuild Success](assets/Week-9/CodeBuild%20Success%20II.png)

![CodePipeline Success](assets/Week-9/CodePipeline%20Success.png)

![ECS Health](assets/Week-9/ECS%20Health%20Check.png)

![ECS Health Check](assets/Week-9/ECS%20Health%20Check%20Test.png)