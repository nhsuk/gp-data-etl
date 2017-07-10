# GP Data ETL

[![Greenkeeper badge](https://badges.greenkeeper.io/nhsuk/gp-data-etl.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/nhsuk/gp-data-etl.svg?branch=master)](https://travis-ci.org/nhsuk/gp-data-etl)
[![Coverage Status](https://coveralls.io/repos/github/nhsuk/gp-data-etl/badge.svg)](https://coveralls.io/github/nhsuk/gp-data-etl)

ETL to retrieve GP surgery information from [NHS Choices Syndication](http://www.nhs.uk/aboutNHSChoices/professionals/syndication/Pages/Webservices.aspx)
and store as JSON.

## Run process

In order for the process to access the syndication feed an API key is required.
Details of registration are available on
[NHS Choices](http://www.nhs.uk/aboutNHSChoices/professionals/syndication/Pages/Webservices.aspx).
The application needs the API key available within the environment as the variable `SYNDICATION_API_KEY`.

The ETL retrieves the Syndication IDs for all GPs, then visits the `Overview`, `Facilities` and `Services` page for each to gather the required information.

Once the initial scan is complete, failed IDs will be revisited. 404 errors on `Facilities` and `Services` are not considered errors as
they represent GPs with no information in those areas. The GPs missing facilities and services are listed in a `summary.json` file.

Running `scripts/start` will bring up a docker container and initiate the scrape at a scheduled time.
The default is 11pm. To test locally set an environment variable `ETL_SCHEDULE` to a new time,
i.e. `export ETL_SCHEDULE='25 15 * * *'` to start the processing a 3:25pm. Note: the container time is GMT and does not take account of daylight saving, you may need to subtract an hour from the time if it is currently BST.

Further details available [here](https://www.npmjs.com/package/node-schedule)

A successful scrape will result in the file `gp-data.json` being written to the `output` folder.
Two files are also written to Azure storage: `gp-data.json` and a time stamped version of the same data named `gp-data-YYYYMMDD.json` where `YYYYMMDD` is the current year, day and month. Summary JSON is available at `output/summary.json`.

Files are not present until the scheduler has run and may return a 404 error prior to then.

The ETL may also be run locally with `yarn start`.

The ETL is re-entrant - if the process is interrupted via `ctrl + c` while the ID list is being built, it will skip the pages or records it has already scanned. State is also persisted every 100 records in case of system failure.

To clear the state before starting when running locally, run `yarn run start-clear`. 
When running in a container the `start` command will always clear the volumes and start again.

To run the ETL end to end, but with only 3 pages of 90 surgeries, rather than the full 320+ pages run `scripts/start-small`. 
The small ETL can be run locally with the command `yarn run start-small` or `yarn run start-small-clear` to remove any in progress files.

The output JSON will be an array of objects in the format shown in the [Sample GP Data](sample-gp-data.json)
A full description of the schema is available in the profiles-db [README.md](https://github.com/nhsuk/profiles-db/blob/master/README.md)

If the recommended environment variables are used the JSON file created will be available in Azure storage at `https://nhsukgpdataetl.blob.core.windows.net/etl-output/gp-data.json`.

## Azure Blob Storage

No facility is provided to interrogate the contents of the blob storage. However, if the recommended environment variables are used
all uploaded files are available at the address `https://nhsukgpdataetl.blob.core.windows.net/etl-output`,
i.e. [https://nhsukgpdataetl.blob.core.windows.net/etl-output/gp-data.json](https://nhsukgpdataetl.blob.core.windows.net/etl-output/gp-data.json).

## Architecture Decision Records
 
This repo uses
[Architecture Decision Records](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions)
to record architectural decisions for this project.
They are stored in [doc/architecture/decisions](doc/architecture/decisions).
