FROM keymetrics/pm2:8-alpine

RUN mkdir -p /code
WORKDIR /code
ADD . /code

RUN yarn --production --ignore-optional && \
    yarn run build && \
    yarn cache clean

CMD [ "pm2-runtime", "process.yml" ]

EXPOSE 3000
