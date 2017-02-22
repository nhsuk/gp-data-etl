function selectFields(source, prefix, fields) {
  return fields.reduce((o, field) => {
    // eslint-disable-next-line no-param-reassign
    o[field] = source[`${prefix}:${field}`];
    return o;
  }, {});
}

module.exports = { selectFields };
