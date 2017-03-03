const LATITUDE = 's:latitude';
const LONGITUDE = 's:longitude';

function createLocation(coordinates) {
  return {
    type: 'Point',
    latitude: Number(coordinates[LATITUDE]),
    longitude: Number(coordinates[LONGITUDE]),
  };
}

function locationValid(coordinates) {
  return coordinates && coordinates[LATITUDE] && coordinates[LONGITUDE];
}

function mapLocation(coordinates) {
  return locationValid(coordinates) ? createLocation(coordinates) : undefined;
}

module.exports = mapLocation;
