FROM node:7.9-alpine

RUN apk add --no-cache git

ENV USERNAME nodeuser

RUN adduser -D "$USERNAME" && \
    mkdir /code && \
    chown "$USERNAME":"$USERNAME" /code

USER $USERNAME
WORKDIR /code

ARG SYNDICATION_API_KEY=production
ENV SYNDICATION_API_KEY=${SYNDICATION_API_KEY}

COPY yarn.lock package.json /code/
RUN  yarn install --ignore-optional

COPY . /code

USER root
RUN find /code/output -user 0 -print0 | xargs -0 chown "$USERNAME":"$USERNAME"
USER $USERNAME

CMD [ "yarn", "start" ]
