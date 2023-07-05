# Week 8 — Serverless Image Processing

Welcome to Week 8, where we covered the following:
- Implemented CDK Stack
- Served Avatars via CloudFront
- Did a DB Migration
- Implemented Uploading of Avatar 

## Preparation
This week, we need to use a CDK (Cloud Development Kit) to create S3 buckets, Lambda functions, SNS topics, etc., which allowed users to upload their avatars (display pictures) to update their profiles.
I implemented some scripts to make our lives easier. The scipt prepares our enviroment and launch our application locally. To be done more efficiently, i created a script as seen in ./bin/init [code](https://github.com/EOyebamiji/aws-bootcamp-cruddur-2023/blob/d141a6ee727a5b35ac175374a459fa967c2579ad/bin/init) for this purpose.

## Implemented CDK Stack
Firstly, we manually created an S3 bucket named ```assets.<domain_name>.com``` (n my own case, ```assets.eoyebamiji.com```) and programmed our CDK implementation stack to automatically create another S3 bucket ```eoyebamiji-uploaded-avatars``` to store processed images, which will be used for serving the processed images in the profile page. In this bucket, we created a folder named banners to store the upload of our prefered banner in a specified file format, in this case jpg/jpeg.

![S3-Buckets](assets/Week%208/List-Created-S3.png)