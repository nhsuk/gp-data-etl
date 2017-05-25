FROM node:7.9-alpine

ENV USERNAME nodeuser

RUN adduser -D "$USERNAME" && \
    mkdir -p /code/output && \
    chown "$USERNAME":"$USERNAME" /code

RUN apk --no-cache add nginx supervisor && mkdir -p /run/nginx/

USER $USERNAME
WORKDIR /code

ARG SYNDICATION_API_KEY=${SYNDICATION_API_KEY}
ENV SYNDICATION_API_KEY=${SYNDICATION_API_KEY}
ENV ETL_SCHEDULE=${ETL_SCHEDULE}

COPY yarn.lock package.json /code/
RUN if [ "$NODE_ENV" == "production" ]; then yarn install --production --ignore-optional; else yarn install --ignore-optional; fi

COPY . /code

USER root
RUN find /code -user 0 -print0 | xargs -0 chown "$USERNAME":"$USERNAME"

EXPOSE 80

RUN ln -s /code/output/ /code/html/json

CMD [ "supervisord", "-n", "-c", "/code/supervisord.conf" ]
