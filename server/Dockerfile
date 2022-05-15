FROM node:lts-alpine3.15

WORKDIR /usr/src/churros-app-server

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 9090

CMD ["npm", "run", "dev"]