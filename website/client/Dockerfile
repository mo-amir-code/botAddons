FROM node:20-alpine

WORKDIR /app

COPY packages.json /

RUN npm install

COPY . . 

RUN npm build

EXPOSE 3000

CMD [ "npm", "run", "start"]