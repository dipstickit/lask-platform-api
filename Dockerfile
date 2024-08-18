FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g @nestjs/cli

COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start:dev", "start:prod"]
