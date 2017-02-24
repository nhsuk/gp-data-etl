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

To run the ETL end to end, but with only 3 pages of 90 surgeries, rather than the full 320+ pages run `npm run start-small`

The output JSON will be an arary of objects in the following format:
```
{
    "_id": 40081,
    "choicesId": 40081,
    "syndicationId": 15429,
    "name": "Abington Park Surgery",
    "odsCode": "K83029",
    "address": {
        "addressLines": [
            "Christchurch Medical Centre",
            "Ardington Road",
            "Northampton",
            "Northamptonshire"
        ],
        "postcode": "NN1 5LT"
    },
    "location": {
        "type": "Point",
        "latitude": 52.2412185668945,
        "longitude": -0.867926597595215
    },
    "contact": {
        "telephone": "01604 630396",
        "fax": "01604 603524",
        "email": "aps.patients@gp-k83029.nhs.uk"
    }
}
```

