import { API } from '../../src/utils/apiPaths';

describe('API Paths', () => {
  it('should have correct GET_EMPLOYEES path', () => {
    expect(API.GET_EMPLOYEES).toBe('/employees');
  });

  it('should generate GET_STATES path with countryCode', () => {
    expect(API.GET_STATES('US')).toBe('/locations/countries/US/states');
  });

  it('should generate GET_CITIES path with countryCode and stateCode', () => {
    expect(API.GET_CITIES('US', 'CA')).toBe('/locations/countries/US/states/CA/cities');
  });

  it('should have correct GET_TOKEN path', () => {
    expect(API.GET_TOKEN).toBe('/auth/token');
  });
});
