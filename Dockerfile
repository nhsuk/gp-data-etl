FROM node:7.9-alpine

RUN apk --no-cache add nginx supervisor && mkdir -p /run/nginx/

WORKDIR /code

ARG SYNDICATION_API_KEY=production
ENV SYNDICATION_API_KEY=${SYNDICATION_API_KEY}
ENV ETL_SCHEDULE=${ETL_SCHEDULE}

COPY yarn.lock package.json /code/
RUN  yarn install --ignore-optional

COPY . /code

EXPOSE 80

RUN ln -s /code/output/ /code/html/json

CMD [ "supervisord", "-n", "-c", "/code/supervisord.conf" ]
