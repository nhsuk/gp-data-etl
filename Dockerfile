FROM node:7.9-alpine

RUN apk add --no-cache git

ENV USERNAME nodeuser

RUN adduser -D "$USERNAME" && \
    mkdir -p /code/output  && \
    chown "$USERNAME":"$USERNAME" /code

USER $USERNAME
WORKDIR /code

ARG SYNDICATION_API_KEY=production
ENV SYNDICATION_API_KEY=${SYNDICATION_API_KEY}

COPY yarn.lock package.json /code/
RUN  yarn install --ignore-optional

COPY . /code

USER root
RUN  chown "$USERNAME":"$USERNAME" /code/output
USER $USERNAME

CMD [ "yarn", "start" ]
