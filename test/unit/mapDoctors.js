const chai = require('chai');
const mapDoctors = require('../../app/lib/mappers/mapDoctors');

const expect = chai.expect;

describe('Doctors mapper', () => {
  it('should map array of doctors', () => {
    const rawDoctors = {
      's:doctor': [
        'Dr Manhattan',
        'Dr Strange',
      ],
    };
    const doctors = mapDoctors(rawDoctors);
    // eslint-disable-next-line no-unused-expressions
    expect(doctors).to.exist;
    expect(doctors.length).to.equal(2);
    expect(doctors[0]).to.equal('Dr Manhattan');
    expect(doctors[1]).to.equal('Dr Strange');
  });

  it('should map field of doctors', () => {
    const rawDoctors = { 's:doctor': 'Dr Strange' };
    const doctors = mapDoctors(rawDoctors);
    // eslint-disable-next-line no-unused-expressions
    expect(doctors).to.exist;
    expect(doctors.length).to.equal(1);
    expect(doctors[0]).to.equal('Dr Strange');
  });

  it('should gracefully handle undefined doctors', () => {
    const doctors = mapDoctors(undefined);
    // eslint-disable-next-line no-unused-expressions
    expect(doctors).to.exist;
    expect(doctors.length).to.equal(0);
  });

  it('should gracefully handle empty doctors', () => {
    const rawDoctors = {};
    const doctors = mapDoctors(rawDoctors);
    // eslint-disable-next-line no-unused-expressions
    expect(doctors).to.exist;
    expect(doctors.length).to.equal(0);
  });

  it('should gracefully handle empty doctors field', () => {
    const rawDoctors = { 's:doctor': undefined };
    const doctors = mapDoctors(rawDoctors);
    // eslint-disable-next-line no-unused-expressions
    expect(doctors).to.exist;
    expect(doctors.length).to.equal(0);
  });
});
