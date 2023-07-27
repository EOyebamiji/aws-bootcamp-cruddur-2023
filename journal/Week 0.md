# Week 0 — Billing and Architecture
## Journal Entry - Week 0: AWS Billings and Architectural Designs

In Week 0, a range of topics that will be useful for this boot camp was covered during the live stream, such as creating a good business pitch deck to Technical (CTO, COO) and Non-Technical Stakeholders (CFO), Project Members, Users and Testers with the use of conceptual (Napkin) and logical architectural diagrams.
The Live stream demonstrated how to design a conceptual and logical diagram using Lucid Chart.

One of the key areas focused on was managing access to AWS resources using AWS Identity and Access Management (IAM). I learned about the different IAM policies that can be used to grant or restrict access to different AWS services and resources. Emphasis on proper IAM management is crucial for maintaining the security and integrity of my AWS account, as covered in the Cloud Security session held by Ashiah Rajan, where he also mentioned the importance of having accounts grouped/structured in an AWS Organization and using proper logging and monitoring using AWS Cloud Trail.

I learned about AWS Organizations, a service that enables me to manage multiple AWS accounts from a single AWS account. An important feature useful for organizations with complex cloud architectures or large teams is as it allows us to centralize our billing and set up policies to enforce security and compliance standards across all accounts. It also helps organizations create ready-to-use user accounts and be activated on demand.

Another important service I learned is AWS Billings, which is an important feature of AWS for setting up and managing budgets. I learned how to create and customize budgets using the GUI and CLI via JSON codes, to track my AWS costs, set alerts when certain thresholds are reached, and prevent unexpected spikes in my bills. This is particularly important as I work on this (boot camp) project development as I am looking to keep my bills as minimal as possible, it also allows me to monitor my AWS usage and make adjustments where necessary to stay within my budget.

Finally, I learned about using AWS CloudWatch Alarms to monitor key performance metrics for my AWS resources and receive notifications when certain thresholds are met or exceeded. This is an important part of my security considerations, as it helps me detect and respond to potential security threats or other issues that could impact my progress throughout this boot camp and the project development.

Overall, Week-0 was a great introduction to the AWS service and tools that will be used throughout the boot camp. I'm looking forward to continuing to learn and explore how we can best leverage these services to build secure and scalable cloud architectures for our project.

The Solution to the Assignment of week 0 is as follows:

# Required Homework

## Recreate Conceptual Diagram in Lucid Charts

![Conceptual Diagram in Lucid Charts](assets/Week-0/Lucid%20Conceptual%20sketch.PNG)
You can view here >>> [Conceptual Diagram in Lucid Charts](https://lucid.app/lucidchart/455fe163-12c5-4d1a-aa2f-50814ada8bbc/edit?viewport_loc=-1156%2C-710%2C3288%2C1674%2C0_0&invitationId=inv_bbc21a1a-a061-43ac-a224-a9b128c733dd)

## Recreate Logical Architectural Diagram in Lucid Charts

![Logical Diagram in Lucid Charts](assets/Week-0/Lucid%20Logical%20Diagram.PNG)
You can view here >>> [Logical Diagram in Lucid Charts](https://lucid.app/lucidchart/8f2f06b6-1e26-4b83-ae98-ef7d4fcd81f6/edit?view_items=8zPxB~y6JEtN&invitationId=inv_df154176-32fb-453c-a1b1-7b7341f868e4)

## Create a Billing Alarm
In order to create a billing alarm, a few requirements need to be checked, such as creating an SNS Topic with a designated billing name. SNS Topic was created using the below code via the CLI.
```
aws sns create-topic --name billing-alarm
```
![SNS Topic](assets/Week-0/SNS%20Topic.PNG)

On creation of the SNS Topic, a TopicARN is generated which is required to create the next requirement for this task which is the subscription. This was created using the below code via the CLI.
```
aws sns subscribe \
    --topic-arn TopicARN \
    --protocol email \
    --notification-endpoint your@email.com
```
![SNS Subscription](assets/Week-0/Billing%20Alarm.PNG)

AWS requires confirmation via mail (preferably) or via the AWS GUI before the Subscription created is activated. I confirmed the subscription creation notice via mail.

![AWS SNS](assets/Week-0/AWS%20SNS.PNG)

The next requirement is to create the alarm via aws CloudWatch, for this step, a JSON file was adopted to make the creation process easier and faster. The below code is used via the CLI with the path to the JSON configuration file where I created an alarm which will send me a notification when I cross the $1 limit I configured.
You can view here >>> [Json Configuration File](https://github.com/EOyebamiji/aws-bootcamp-cruddur-2023/blob/main/aws/json/alarm_config.json)
```
aws cloudwatch put-metric-alarm --cli-input-json file://aws/json/alarm_config.json
```
![CLI COnfig for CloudWatch](assets/Week-0/CloudWatch.PNG)

Once the above step is completed, the Billing Alarm is created

![Billing Alarm](assets/Week-0/CloudWatch%20Overview.PNG)

## Create a Budget
I created a $1 budget limit using the GUI to keep my spending under the free tier as much as possible except in situations I cannot control. I created an alert with an 80% threshold which allows me to review running/active services to avoid incurring any unwanted bills. I avoided creating multiple budgets to stay within the AWS Freee tier of two budgets.

![Budget](assets/Week-0/Budget-Alarm.PNG)

# Homework Challenges

