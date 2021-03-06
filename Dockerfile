FROM keymetrics/pm2:8-alpine

RUN mkdir -p /code
WORKDIR /code

ADD ./package.json ./yarn.lock /code/

RUN yarn --production --pure-lockfile --ignore-optional

ADD . /code

RUN yarn build && yarn cache clean

CMD [ "pm2-runtime", "process.yml" ]

EXPOSE 3000
