FROM node:latest

RUN npm install -g json-server@0.17.4

WORKDIR /data
VOLUME /data

EXPOSE 80
ENTRYPOINT ["json-server","--port","80", "--host","0.0.0.0","/data/db.json"]
