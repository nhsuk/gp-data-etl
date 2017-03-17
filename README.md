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

Running `npm start` will initiate the scrape. A successful scrape will result in the file `gp-data.json` being written to the `output` folder.

The ETL is now re-entrant - if the process is interrupted via `ctrl + c` while the ID list is being built, it will skip the pages or records it has already scanned. State is also persisted every 100 records in case of system failure.

When the ETL has completed state information will remain in the output directory. Restarting will revisit any failed records that may have errored due to availabilty issues.
To clear the state before starting run `npm run start-clear`.

To run the ETL end to end, but with only 3 pages of 90 surgeries, rather than the full 320+ pages run `npm run start-small`. Currenty these contain one record that returns
a `500` error, so the retry behaviour can be observed.
The small ETL can be run with the command `npm run start-small-clear` to remove any in progress files.

The output JSON will be an array of objects in the format shown in the [Sample GP Data](sample-gp-data.json)
A full description of the schema is available in the profiles-db [README.md](https://github.com/nhsuk/profiles-db/blob/master/README.md)
