# GP Data ETL

[![Build Status](https://travis-ci.org/nhsuk/gp-data-etl.svg?branch=master)](https://travis-ci.org/nhsuk/gp-data-etl)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/gp-data-etl/badge.svg)](https://coveralls.io/github/nhsuk/gp-data-etl)

ETL to retrieve GP surgery information from [NHS Choices Syndication](http://www.nhs.uk/aboutNHSChoices/professionals/syndication/Pages/Webservices.aspx)
and store as JSON.

## Run process

In order for the process to access the syndication feed an API key is required.
Details of registration are available on [NHS Choices](http://www.nhs.uk/aboutNHSChoices/professionals/syndication/Pages/Webservices.aspx).
The application needs the api key available within the environment as the
variable `SYNDICATION_API_KEY`.

Running `scripts/start` will bring up a docker container and initiate the scrape at a scheduled time.
The default is 11pm. To test locally set an environment variable `ETL_SCHEDULE` to a new time, i.e. `export ETL_SCHEDULE='25 15 * * *'` to start the processing a 3:25pm.
Further details available [here](https://www.npmjs.com/package/node-schedule)

A successful scrape will result in the file `gp-data.json` being written to the `output` folder. This file may be downloaded from the web-server available at `http://localhost/json/gp-data.json`. Summary json is available at `http://localhost/json/summary.json`

The ETL may also be run locally with `yarn start`

The ETL is re-entrant - if the process is interrupted via `ctrl + c` while the ID list is being built, it will skip the pages or records it has already scanned. State is also persisted every 100 records in case of system failure.

To clear the state before starting when running locally run `yarn run start-clear`. 
When running in a container The `start` command will always clear the volumes and start again.

To run the ETL end to end, but with only 3 pages of 90 surgeries, rather than the full 320+ pages run `scripts/start-small`. 
The small ETL can be run locally with the command `yarn run start-small` or `yarn run start-small-clear` to remove any in progress files.

The output JSON will be an array of objects in the format shown in the [Sample GP Data](sample-gp-data.json)
A full description of the schema is available in the profiles-db [README.md](https://github.com/nhsuk/profiles-db/blob/master/README.md)
