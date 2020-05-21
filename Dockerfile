FROM node:12

WORKDIR /home/node/app

RUN npm install

EXPOSE 6666