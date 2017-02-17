ETL to retrieve GP surgery information from syndication and store as JSON
running `npm start` will store the retrieved json to gp-data.json

The output JSON will be an arary of objects in the following format:

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

