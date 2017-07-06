const utils = require('../utils/utils');

function getFacilityGroup(groups, name) {
  return groups.find(g => g.name === name);
}

function mapFacility(facility) {
  return {
    name: facility.name,
    exists: facility.facilityExists,
  };
}

function getFacilities(groups, name) {
  const group = getFacilityGroup(groups, name);
  if (group && group.facilityList && group.facilityList.facility) {
    return utils.asArray(group.facilityList.facility).map(mapFacility);
  }
  return undefined;
}

function getFacilityGroups(facilities) {
  return utils.asArray(facilities.facilityGroups.facilityGroup);
}

function facilitiesValid(facilities) {
  return facilities && facilities.facilityGroups && facilities.facilityGroups.facilityGroup;
}

function mapFacilities(rawFacilities) {
  const facilities = rawFacilities.feed.entry.content.facilities;
  if (facilitiesValid(facilities)) {
    const facilityGroups = getFacilityGroups(facilities);
    return {
      parking: getFacilities(facilityGroups, 'Parking'),
      accessibility: getFacilities(facilityGroups, 'Accessibility'),
    };
  }
  return undefined;
}

module.exports = mapFacilities;
