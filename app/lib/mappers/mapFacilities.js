const utils = require('../utils');

const FACILITIES = 'facilities';
const FACILITY_GROUPS = 'facilityGroups';
const FACILITY_GROUP = 'facilityGroup';
const FACILITY_LIST = 'facilityList';
const FACILITY = 'facility';
const NAME = 'name';
const EXISTS = 'facilityExists';

function getFacilityGroup(groups, name) {
  return groups.find(g => g.name === name);
}

function mapFacility(facility) {
  return {
    name: facility[NAME],
    exists: facility[EXISTS],
  };
}

function getFacilities(groups, name) {
  const group = getFacilityGroup(groups, name);
  if (group && group[FACILITY_LIST] && group[FACILITY_LIST][FACILITY]) {
    return utils.asArray(group[FACILITY_LIST][FACILITY]).map(mapFacility);
  }
  return undefined;
}

function getFacilityGroups(facilities) {
  return utils.asArray(facilities[FACILITY_GROUPS][FACILITY_GROUP]);
}

function facilitiesValid(facilities) {
  return facilities && facilities[FACILITY_GROUPS] && facilities[FACILITY_GROUPS][FACILITY_GROUP];
}

function mapFacilities(rawFacilities) {
  const facilities = rawFacilities.feed.entry.content[FACILITIES];
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
