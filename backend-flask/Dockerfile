FROM python:3.10-slim-buster

WORKDIR /backend-flask

COPY requirements.txt requirements.txt
RUN apt-get update && \
    apt-get install -y curl && \
    pip3 install -r requirements.txt

COPY . .

ENV FLASK_ENV=app.py

EXPOSE ${PORT}

# Run flask when the container launches using external script
CMD ["/bin/bash", "start_server.sh"]

# CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]