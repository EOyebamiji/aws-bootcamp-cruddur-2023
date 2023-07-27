# Week X - Cleanup 

## Implemented Sync Tool For Frontend Static Web Hosting
I created the ``sync`` and ``static-build`` scripts in the ``bin/frontend`` dir and configured them to build the application and deploy the built application to a predefined ``s3-bucket`` while updating the ``CloudFront invalidation`` on every deployment.
![CloudFront Invalidation](assets/Week-X/Sync%20Invalidation%20Evidence.png)

## Reconnect DB (RDS) and Update Postgres Post Confirmation Lambda
I inserted data into the CFN deployed Db via ``schema-load`` and new users are inserted by the post-confirmation lambda

## Implemented Create Activity and Replies 
Added a feature to create an activity based on a user profile authenticated by ``cognito``, allowing each individual to post ``Cruds``. Also, implemented the reply feature allowing replies to posted ``Cruds``

![Activity Feed Pro](assets/Week-X/Activity%20Feed.png)

## Refactored Backend Routes
I implemented the refactoring of ``App.py`` and broke the modules from a cluster into individual modules

![Refactored Routes](assets/Week-X/Refactored%20Routes.png)

## Implemented Messaging and Reconnect DDB (DynamoDb)
I inserted data into the CFN deployed Ddb and implemented changes which allow for authenticated users to send a DM to each other.

![Ddb Messaging](assets/Week-X/Logged%20Message%20DDB.png)

![Ddb Messaging](assets/Week-X/DDB%20Conversation%20Prod%201.png)

![Ddb Messaging](assets/Week-X/DDB%20Conversation%20Prod%202.png)

## Created a Dedicated user role for CFN
I created a dedicated user role to manage and handle our CFN stack, this was done using CFN to create the user and stack ``CrdMachineUser``

![Machine User](assets/Week-X/Machine%20User.png)

## Confirmed all CFN Stacks Operational
After the deployment of new features and implementation, I confirmed the CFN stacks are all up and deployed resources are functional.

![CFN Stack](assets/Week-X/CFN%20Stacks%20.png)

![CFN CodePipeline](assets/Week-X/CFN%20CodeBuild.png)

![CFN CodeBuild](assets/Week-X/CFN%20CodePipeline.png)

## Additional Cleanup
I refactored my codebase to render images in production, and also the included image rendering the activity feed to be displayed on the homepage.

![HomeFeed Page](assets/Week-X/HomeFeed%20Image%20Render.png)

![Status Page](assets/Week-X/ProfileInfo%20Status.png)
