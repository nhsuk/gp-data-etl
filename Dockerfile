FROM node:8.8.0-alpine

ENV USERNAME nodeuser

RUN adduser -D "$USERNAME" && \
    mkdir -p /code/output && \
    chown "$USERNAME":"$USERNAME" /code

USER $USERNAME
WORKDIR /code

ARG SYNDICATION_API_KEY=${SYNDICATION_API_KEY}
ENV SYNDICATION_API_KEY=${SYNDICATION_API_KEY}
ENV ETL_SCHEDULE=${ETL_SCHEDULE}

COPY yarn.lock package.json /code/
RUN if [ "$NODE_ENV" == "production" ]; then yarn install --production --pure-lockfile; else yarn install --pure-lockfile; fi

COPY . /code

USER root
RUN find /code -user 0 -print0 | xargs -0 chown "$USERNAME":"$USERNAME"
USER $USERNAME

CMD [ "node", "schedule.js" ]
