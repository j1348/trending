FROM mhart/alpine-node:8.11

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
RUN yarn --production

COPY . /usr/src/app
EXPOSE 3000
CMD ["node", "src/index.js"]
