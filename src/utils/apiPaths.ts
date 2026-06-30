export const API = {
  GET_EMPLOYEES: "/employees",

  // Location APIs
  GET_COUNTRIES: "/locations/countries",
  GET_STATES: (countryCode: string) => `/locations/countries/${countryCode}/states`,
  GET_CITIES: (countryCode: string, stateCode: string) => `/locations/countries/${countryCode}/states/${stateCode}/cities`,

  // Auth APIs
  GET_TOKEN: "/auth/token",

  // Skills
  GET_DEPARTMENT_SKILLS: "/employees/skills/department",
};
