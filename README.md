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

Running `npm start` will initiate the scrape. A successful scrape will result
in a file written to the root of the repository called `gp-data.json`

The output JSON will be an arary of objects in the following format:
```
{
  "choicesId" : 36931,
  "name" : "Croft Medical Centre",
  "phone" : "0121 270 7180",
  "odsCode" : "M89012",
  "location" : {
    "address" : [
      "Croft Medical centre",
      "1 Pomeroy Way",
      "Chelmsley Wood",
      "Birmingham",
      "West Midlands"
    ],
    "postcode" : "B37 7WB",
    "latitude" : 52.4778633117676,
    "longitude" : -1.72773551940918
  }
}
```

