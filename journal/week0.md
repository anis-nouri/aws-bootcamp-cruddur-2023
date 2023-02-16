# Week 0 — Billing and Architecture

## Required Homework

### Conceptual Diagram in Lucid Charts or on a Napkin

### Logical Architectual Diagram in Lucid Charts

### Setting up The Root account and Admin user
The root account is the most privileged account with all the access, hence protecting it is a necessity.
It is strongly recommend that we do not use the root user account for everyday tasks, even the administrative ones. Root user credentials are only used to perform a few account and service management tasks.
In order to protect my root user account I did the following:
#### Enable MFA:
AWS multi-factor authentication (MFA) is an AWS Identity and Access Management (IAM) best practice that requires a second authentication factor in addition to user name and password sign-in credentials.  

Steps followed:  
1. Log in to the AWS Management Console using your root account credentials.
2. Go to "My Security Credentials" page and select "Activate MFA."
3. :Choose the type of MFA device you want to use.
4. :Follow the setup instructions for the MFA device type you selected.

![Enable MFA](assets/Week0-MFA.PNG)


**insert image**

#### Create Admin User:


### Create a Billing Alarm


### Create Budgets
I set up a two cost budgets in the AWS Billing Console using **AWS Budgets**.
One to track my dollar spending , and the other one for tracking my credits spending.

![Create Budgets](assets/Week0-Create_Budgets.PNG) 

#### Using AWS CLI to create a bugdet:
To create a budget using AWS CLI I used the example from the [AWS CLI Command Reference - AWS Documentation](https://docs.aws.amazon.com/cli/latest/reference/budgets/create-budget.html).  
* Set an environment variable named **AWS_ACCOUNT_ID**, export it to the global environment:
```
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
```
* Create the json files "budget-notifications-with-subscribers.json" and "budget.json" both ound on the refrenced link.
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
![Create Bugdet](assets/Week0-Create-budget-CLI.png)

 
### Use CloudShell
AWS CloudShell is a browser-based shell, you can quickly run scripts with the AWS Command Line Interface (CLI), experiment with service APIs using the AWS CLI, and use other tools to increase your productivity. The CloudShell icon appears in AWS Regions where CloudShell is available.

The AWS Command Line Interface (AWS CLI) includes a bash-compatible command-completion feature that enables you to use the Tab key to complete a partially entered command, thus improving your productivity.

To configure auto-prompt I used this command in the CloudShell:
```
aws --cli-auto-prompt
```

![Use CloudShell](assets/Week0-Use-CloudShell.PNG)

### Install AWS CLI

## Homework Challenges

