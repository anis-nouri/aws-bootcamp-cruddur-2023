FROM python:3.10-slim-buster

WORKDIR /backend-flask

COPY requirements.txt requirements.txt
RUN apt-get update && \
    apt-get install -y curl && \
    pip3 install -r requirements.txt

COPY . .

ENV FLASK_ENV=app.py

EXPOSE ${PORT}
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "--port=4567"]