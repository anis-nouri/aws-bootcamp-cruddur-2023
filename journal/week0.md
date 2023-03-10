# Week 0 — Billing and Architecture

## Required Homework

### Conceptual Diagram in Lucid Charts:
![Crudder Conceptual Diagram](assets/Week0-Conceptual-Diagram.png)

Here is the [lucidchart link](https://lucid.app/lucidchart/ebbacdae-2e94-416d-93f4-5e51b69b7ce6/edit?viewport_loc=-516%2C12%2C1208%2C616%2C0_0&invitationId=inv_23720390-1bdf-4196-a52b-bb8583679420) for my conceptual diagram.

### Logical Architectural Diagram in Lucid Charts

![Crudder Architectural Diagram](assets/Week0-Crudder-Logical-Diagram.png)

I added a CI/CD pipeline in the diagram using these services:
* **AWS CodePipeline**: To create the pipeline.
* **S3 bucket**: For artifact storage. 
* **AWS CodeBuild**: To build the application code and generate the artifacts, then output the generated artifacts to the S3 bucket.
* **AWS CodeDeploy**: To deploy the artifacts to the target environment, in this case ECS clusters.

here is the [lucidchart link](https://lucid.app/lucidchart/a40d3982-f035-471c-bede-2b6694b84140/edit?viewport_loc=-267%2C-56%2C3623%2C1848%2C0_0&invitationId=inv_ed90e67a-ae8b-4761-8bcf-7e635c2c714e) for my architectural diagram.

### Setting up The Root account and Admin user
The root account is the most privileged account with all the access, hence protecting it is a necessity.
It is strongly recommend that we do not use the root user account for everyday tasks, even the administrative ones. Root user credentials are only used to perform a few account and service management tasks.
In order to protect my root user account I did the following:
#### Enable MFA:
AWS multi-factor authentication (MFA) is an AWS Identity and Access Management (IAM) best practice that requires a second authentication factor in addition to user name and password sign-in credentials.  

Steps followed:  
1. Log in to the AWS Management Console using your root account credentials.
2. Go to "My Security Credentials" page and select "Activate MFA."
3. Choose the type of MFA device you want to use.
4. Follow the setup instructions for the MFA device type you selected.

![Enable MFA](assets/Week0-MFA.PNG)

#### Create Admin User:
IAM (Identity and Access Management) admin user is a type of user in AWS that has full administrative access to the AWS Management Console and all AWS services and resources.

1. Log in to the **AWS Management Console** using your root account credentials.
2. Go to the **IAM dashboard** and click on **Users**.
3. Click on **Add User** and enter a name for the new user.
4. click on **Provide user access to the AWS Management Console**.
5. Set a password or have AWS generate one for you.
6. Add the user to the **Administrators** group or attach the **AdministratorAccess** policy.
7. Review and click on **Create User**.

![Create admin](assets/week0-Create-admin.PNG)

Enable MFA for the admin user created, to ensure the security of your AWS resources.

### Install AWS CLI
* Configure the AWS CLI on the GitPod, by configuring `.gitpod.yml`, It is a YAML  configuration file that allows you to define the environment for your Gitpod workspace, and is placed in the root directory of your project allowing you to specify dependencies, environment variables, editor extensions, and more.

Here is the code written in the YAML file:
```
tasks:
  - name: aws-cli
    env:
      AWS_CLI_AUTO_PROMPT: on-partial
    init: |
      cd /workspace
      curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
      unzip awscliv2.zip
      sudo ./aws/install
      cd $THEIA_WORKSPACE_ROOT
```
  * [Get AWS Account access key ID and secret access key](https://docs.aws.amazon.com/powershell/latest/userguide/pstools-appendix-sign-up.html).
  * Set up environment variables.
```
gp env AWS_ACCESS_KEY_ID=""
gp env AWS_SECRET_ACCESS_KEY=""
gp env AWS_DEFAULT_REGION=us-""
```
* To check that the environment variables are set correctly:
```
env | grep AWS
```
![Check envirement variable](assets/Week0-envirement-variables.PNG) 


### Create Budgets
Using AWS Management Console, I set up a two cost budgets in the AWS Billing Console using **AWS Budgets**.
One to track my dollar spending , and the other one for tracking my credits spending.

![Create Budgets](assets/Week0-Create_Budgets.PNG) 

#### Using AWS CLI to create a budget:
To create a budget using AWS CLI I followed the example from the [AWS CLI Command Reference - AWS Documentation](https://docs.aws.amazon.com/cli/latest/reference/budgets/create-budget.html).  
* Set an environment variable named **AWS_ACCOUNT_ID**, export it to the global environment:
```
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
```
* Create the json files "budget-notifications-with-subscribers.json" and "budget.json" both found on the referenced link.
* Create the budget: To create a budget in AWS, you will need to run the create-budget command using the AWS CLI.
```
aws budgets create-budget \
    --account-id $AWS_ACCOUNT_ID \
    --budget file://aws/json/budget.json \
    --notifications-with-subscribers file://aws/json/budget-notifications-with-subscribers.json
```
* Run the following command to list all budgets in your AWS account:
```
aws budgets describe-budgets --account-id
```
![Create Budget](assets/Week0-Create-budget-CLI.png)

 
### Use CloudShell
AWS CloudShell is a browser-based shell, you can quickly run scripts with the AWS Command Line Interface (CLI), experiment with service APIs using the AWS CLI, and use other tools to increase your productivity. The CloudShell icon appears in AWS Regions where CloudShell is available.

The AWS Command Line Interface (AWS CLI) includes a bash-compatible command-completion feature that enables you to use the Tab key to complete a partially entered command, thus improving your productivity.

To configure auto-prompt I used this command in the CloudShell:
```
aws --cli-auto-prompt
```
![Use CloudShell](assets/Week0-Use-CloudShell.PNG)



## Homework Challenges
### Use EventBridge to hookup Health Dashboard to SNS and send notification when there is a service health issue:
#### Description
AWS Health generates an event when there is a service health issue. The event contains information about the affected AWS services, the region in which the issue occurred, and the status of the issue. When this event is sent to EventBridge, it can be used to trigger actions in our case sending notifications to an SNS topic.

To set this up we need to do the following steps:

1. Create an SNS Topic:
![SNS topic](assets/Week0-SNS-topic.PNG)

2. Create an EventBridge Rule:
![event bridge rule](assets/Week0-eventbridge-rule.png)

3. Subscribe to the SNS Topic:
![SNS create Sub](assets/Week0-SNS-CreateSub.png)


That's it! Now, when there is a service health issue, EventBridge will send a notification to the SNS topic created, and the subscribers to the topic will receive the notification via email.

Here are some helpful AWS documentation sources:  
[Creating an Amazon SNS topic](https://docs.aws.amazon.com/sns/latest/dg/sns-tutorial-create-topic.html).  
[Creating an Amazon EventBridge rule](https://docs.aws.amazon.com/eventbridge/latest/userguide/create-eventbridge-rule.html).  
[Subscribing to an Amazon SNS topic](https://docs.aws.amazon.com/sns/latest/dg/SubscribeTopic.html).  

