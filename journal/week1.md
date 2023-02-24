# App Containerization:
Anna, a software developer, just finished developing a new application that she believes it's ready for production. She hands the program files over to the operations team for deployment on the production servers.

However, when the operations team attempts to launch the application on the production servers, it doesn't seem to work. After troubleshooting, the ops team realizes that the application was developed and tested on Anna's personal computer, which has a different environment and configurations than the production servers.

The operations team reaches out to Anna, who initially responds with frustration, saying *It works on my computer!* But after realizing the issue, Anna works with the operations team to identify the discrepancies between her development environment and the production environment. Together, they make the necessary adjustments to the application's configuration and dependencies to ensure it runs properly in the production environment.

![It works](assets/week1-it-works.png)

That's how app containerization comes to use.
During this week, I learned about app containerization and its benefits. I learned how to create, manage, and deploy a containerized applications using Docker.

## What's app containerization :
Application containerization is the process of packaging an application and its dependencies into a single container image that can run consistently across different computing environments, making application deployment faster, more reliable, and more efficient.

## Push and tag an image to DockerHub :
Docker Hub is a cloud-based repository service provided by Docker that allows users to store, manage, and share Docker container images. 
To push and tag an image to DockerHub, I followed these steps:

### From DockerHub side :
1. Login to DockerHub.
2. Create a public repository.
3. Create an access token.
![Create access token](assets/week1-dockerhub-AccessToken-0.PNG)
![Create access token](assets/week1-dockerhub-AccessToken-1.PNG)
![Create access token](assets/week1-dockerhub-AccessToken-2.PNG)
### From the Gitpod envirement  side :
1. Save access token to gitpod envirement variables:
```
gp env DOCKER_ACCESS_TOKEN =""
```
2. Login to DockerHub.
```
docker login -u <username> -p <password>
```
3. Tag  Docker image with DockerHub username and the repository name:

```
docker tag <image-name> <docker-hub-username>/<repository-name>:<tag>
```
Here is the tagged docker image.
![tag Docker image](assets/week1-Docker-tagImage-2.PNG)
  
4. Push the tagged image to the docker hub.
```
docker push <docker-hub-username>/<repository-name>:<tag>
```
![push image Dockerhub ](assets/week1-Docker-pushImage-2.PNG)
That's all, now the docker image is pushed to the Dockerhub repository.
![image Dockerhub ](assets/week1-Dockerhub-Image-2.PNG)


## Deploy a Docker App to AWS EC2:
So here is the workflow, I followed :

1. Build the Docker image.
2. Tag the image with DockerHub repository name.
3. Push the image to DockerHub.
4. Launch an EC2 instance.
5. Install Docker on the EC2 instance.
6. Pull the Docker image from DockerHub.
7. Run the Docker container on the EC2 instance. 
8. Clean up the EC2 instance and related resources.
![push image Dockerhub ](assets/week1-Workflow-app-cont.png)
  
Since I have already pushed the Docker image to DockerHub, the next step is to create and set up an EC2 instance to pull that image and run the container.  
### Launch AWS EC2 instance :
I used the AWS CLI to launch the EC2 instance, here are the steps I followed:
1. Login to the AWS CLI (Covered in week 0).
2. Create a key pair:
```
aws ec2 create-key-pair --key-name Backend-server-key-pair  --query KeyMaterial --output text > Backend-server-key-pair.pem

```
3. Create a security group:
```
aws ec2 create-security-group --group-name Backend-server-SG --description "Backend server security group"
```
4. Add rules to the security group:
    1. Authorize incoming TCP traffic on port 80:
    ```
    aws ec2 authorize-security-group-ingress --group-name Backend-server-SG --protocol tcp --port 80 --cidr --cidr 0.0.0./0
    ```
    2. Authorize incoming TCP traffic on port 22 (the default SSH port):
    ```
    aws ec2 authorize-security-group-ingress --group-name Backend-server-SG --protocol tcp --port 22 --cidr 0.0.0.0/0
    ```
5. Run EC2 instance with the created key pair and security group :
```
aws ec2 run-instances --image-id ami-099effcf516c942b7 --count 1 --instance-type t2.micro --key-name Backend-server-key-pair --security-groups Backend-server-SG 

```
![EC2 instance](assets/week1-ec2.PNG)

### Install Docker on the EC2 instance :
1. Connect to the EC2 instance using the key pair:
```
ssh -i Backend-server-key-pair.pem ec2-user@<PUBLIC-IP-@>

```
Follow the instructions from AWS Documentation to [Install Docker on Amazon Linux 2](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-container-image.html).

###  Run the Docker container on the EC2 instance :
```
docker run -p "80:4567" -e FRONTEND_URL="*" -e BACKEND_URL="*" --rm -d nouurianis/aws-bootcamp-cruddur-2023-backend-flask
```

Check that the Docker container is up and running :
```
Docker ps
```
![Container Running](assets/week1-container-running.PNG)

### Clean up the EC2 instance and related resources :

1. Terminate the EC2 instance: `aws ec2 terminate-instances`.
2. Delete the associated security group(s): `aws ec2 delete-security-group`. 
3. Delete the associated key pair: `aws ec2 delete-key-pair`. 




## Docker best practices:
### Use official docker image as base image.
### Use specific Image version
Just typing the name of the version without tags  will automatically set the tag of the image to latest.
This will make u the version o of the docker image when u build it, be different from build to another causing inconsistencies.

*The more specific the better*
### Use small sized official images 
lots of tools install ==> security issues larger attack surface to your image.

### Order docker commands from least to most most frequently changing  
each command or instruction in the docker file create an image layer 

### use dockerignore file :
Do not ignore .dockerignore:
Some of
* reduce image size 
* prevent unintended secret exposure


## Container security best practices:
is the practice of protecting your applications hosted on compute services like containers.
application like (SPAs), Microservices , apis etc.
why container security is important:




# Create notification features
## editing the open api :
### what is open api and why we use it:
## editing backend and front end 















