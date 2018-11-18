FROM node:8.12.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json yarn.lock /usr/src/app/
RUN yarn --production --pure-lockfile --ignore-optional

COPY . /usr/src/app
EXPOSE 3000
CMD ["node", "src/index.js"]
