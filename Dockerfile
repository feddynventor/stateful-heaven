FROM node:lts-alpine

WORKDIR /usr/share/app

COPY package*.json ./
RUN npm install

RUN npm install typescript -g

COPY . .
RUN npm run build

CMD ["node","./dist/index.js"]