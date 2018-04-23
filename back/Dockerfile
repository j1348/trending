FROM node:8.11.1-alpine

RUN mkdir -p /code
WORKDIR /code
ADD . /code


RUN yarn && \
    yarn run build && \
    yarn cache clean
CMD [ "yarn", "start" ]
EXPOSE 3000
