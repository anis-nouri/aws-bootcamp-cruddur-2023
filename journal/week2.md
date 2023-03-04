# Week 2 — Distributed Tracing
## Summery:
1. [Introduction](#Introduction)
2. Honeycomb.io(#Honeycomb.io)
3. Rollbar(#Rollbar)
4. [AWS X-Ray](#AWS X-Ray)
5. WatchTower(#WatchTower)

## Introduction:

## Honeycomb.io:

## Rollbar:
![Bug Tracking](https://uploads-ssl.webflow.com/615af81f65d1ab72d2969269/6176011ed02509f4285f2595_bug-reports-750x365.jpg)

**Rollbar** is a cloud-based error tracking and monitoring tool that helps developers identify, diagnose, and debug software errors in real-time. It can be integrated into web and mobile applications, as well as other software products, to capture and report errors and exceptions that occur during runtime.

I used Rollbar to monitor and track Flask backend errors, here are the steps I followed to configure rollbar:  

1. Create a project in Rollbar:
Once the project created, an access token will be provided in the Rollbar dashboard.    
2. Add Rollbar access token the environment variables:
```
export ROLLBAR_ACCESS_TOKEN="<access-token>"
gp env ROLLBAR_ACCESS_TOKEN="<access-token>"
```
3. Install `rollbar` and  `blinker` dependencies, by adding them to `requirements.txt`
```
blinker
rollbar
```
4. Install dependencies:
 ```
pip install -r requirements.txt
```
5. Since am running my application in a container, I added rollbar access token to the `docker-compose.yml`:

```
environment:
      ROLLBAR_ACCESS_TOKEN: "${ROLLBAR_ACCESS_TOKEN}"
```
6. Import the Rollbar library inside the `app.py` and configure it with your Rollbar access token :
```
import os
import rollbar
import rollbar.contrib.flask
from flask import got_request_exception
```
```
rollbar_access_token = os.getenv('ROLLBAR_ACCESS_TOKEN')
@app.before_first_request
def init_rollbar():
    """init rollbar module"""
    rollbar.init(
        # access token
        rollbar_access_token,
        # environment name
        'production',
        # server root directory, makes tracebacks prettier
        root=os.path.dirname(os.path.realpath(__file__)),
        # flask already sets up logging
        allow_logging_basic_config=False)

    # send exceptions from `app` to rollbar, using flask's signal system.
    got_request_exception.connect(rollbar.contrib.flask.report_exception, app)

```
That's it! With these steps, the Flask backend is now set up to report errors to Rollbar. 

To test it I added an end point that will raise a warning :
```
@app.route('/rollbar/test')
def rollbar_test():
    rollbar.report_message('Hello World!', 'warning')
    return "Hello World!"
```
![Rollbar](assets/week2-Rollbar-TEST.PNG)


## AWS X-Ray:
AWS X-Ray is a service that collects data about requests that the application serves, and provides tools that to view, filter, and gain insights into that data to identify issues and opportunities for optimization.
To configure the AWS X-RAY I did the following:
### Instrument AWS X-Ray for the backend application:
#### Add `aws-xray-sdk` library in requirement.txt.
#### Install python dependencies `pip install -r requirements.txt`.
#### Add this code to app.py
```
from aws_xray_sdk.core import xray_recorder
from aws_xray_sdk.ext.flask.middleware import XRayMiddleware

xray_url = os.getenv("AWS_XRAY_URL")
xray_recorder.configure(service='Cruddur', dynamic_naming=xray_url)
XRayMiddleware(app, xray_recorder)

```
this code is for the configuration of the AWS X-Ray SDK for **Python** to trace requests for the backend Flask application and send the resulting trace data to the AWS X-Ray service for visualization and analysis.

### Set AWS X-Ray resources:
#### Create an AWS X-Ray Group:
```
aws xray create-group \
   --group-name "Cruddur" \
   --filter-expression "service(\"$FLASK_ADDRESS\")"
```

#### Create an AWS X-Ray Sampling Rule :
```
aws xray create-sampling-rule --cli-input-json file://aws/json/xray.json
```
### Add Daemon Service to Docker Compose
* In order to collect and trace data on the application's performance and behavior, it is necessary to ensure that the AWS X-Ray daemon is running and properly configured to collect data from the application. Once the daemon is operational, it will capture and transmit data to the X-Ray service, where it can be analyzed and visualized using the AWS X-Ray console.

![X-ray daemon](https://docs.aws.amazon.com/images/xray/latest/devguide/images/architecture-dataflow.png)

```
 xray-daemon:
    image: "amazon/aws-xray-daemon"
    environment:
      AWS_ACCESS_KEY_ID: "${AWS_ACCESS_KEY_ID}"
      AWS_SECRET_ACCESS_KEY: "${AWS_SECRET_ACCESS_KEY}"
      AWS_REGION: "us-east-1"
    command:
      - "xray -o -b xray-daemon:2000"
    ports:
      - 2000:2000/udp
```
* Start and run the docker container:
```
Docker compose up 
```

Let's test this, to do that we can send a request to the backend server:
1. Start the backend application , using `docker compose up`.
2. Open the AWS X-Ray console.
3. Send a request to the backend server, in my case I sent an HTTP request using the `/api/activities/home` link.  

![Response Error](assets/week2-X-RAY-TEST-0.PNG)

I got an error as a response, and it,s visible in the captured traces with a response code 500.  

![X-ray traces](assets/week2-X-RAY-TEST-1.PNG)

After fixing the error in my code I can finally see the trace with a 200 response code, which is success status code that indicates that the HTTP request has been successfully processed.

![X-ray traces](assets/week2-X-RAY-TEST-2.PNG)

### Instrumenting X-RAY Segments and Subsegments:
#### Instrumenting Segments:

**@xray_recorder.capture** is a decorator that can be applied to a function or method to capture a segment around that function's execution. It creates a custom segment in the X-Ray trace with the specified name or label and automatically starts and ends the segment around the function's execution.  
```
@xray_recorder.capture('notifications-activities')
def data_notifications():
  data = NotificationsActivities.run()
  return data, 200
```
#### Instrumenting Subsegments:
To manage subsegments, I used the begin_subsegment and end_subsegment methods.
```
subsegment = xray_recorder.begin_subsegment('mock_data')
    dict={
      "now":now.isoformat(),
      "results":len(results)
    }
    subsegment.put_metadata('key', dict, 'namespace')
    xray_recorder.end_subsegment()
```
Here is the trace with the segment and subsegment in AWS X-RAY:
![X-ray traces](assets/week2-X-RAY-TEST-3.PNG)


## WatchTower:


