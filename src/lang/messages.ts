export const MESSAGES = {
  // App.tsx
  APP: {
    LOADING: 'Loading application...',
    TITLE: 'Employee Management System',
    SUBTITLE: 'A modern, responsive, and secure platform for managing employee records.',
  },

  // EmployeeForm.tsx
  FORM: {
    BACK_TO_LIST: 'Back to List',
    TITLE_EDIT: 'Edit Employee',
    TITLE_ADD: 'Employee Registration',
    SUBTITLE_EDIT: 'Update the details for this employee',
    SUBTITLE_ADD: 'Enter employee details to create a new profile',
    SUBMITTING: 'Saving...',
    SUBMIT: 'Submit Application',
    PLACEHOLDERS: {
      FIRST_NAME: 'e.g. John',
      LAST_NAME: 'e.g. Doe',
      EMAIL: 'john.doe@company.com',
      MOBILE: '10 digit mobile number',
      ADDRESS: 'Enter full residential address...',
    },
    LABELS: {
      FIRST_NAME: 'First Name',
      LAST_NAME: 'Last Name',
      EMAIL: 'Email Address',
      MOBILE: 'Mobile Number',
      DOB: 'Date of Birth',
      GENDER: 'Gender',
      DEPARTMENT: 'Department',
      SKILLS: 'Skills (Select at least one)',
      COUNTRY: 'Country',
      STATE: 'State',
      CITY: 'City',
      ADDRESS: 'Address',
      PROFILE_IMAGE: 'Profile Image',
      RESUME: 'Resume',
      PREFERRED_MODE: 'Preferred Working Mode',
    }
  },

  // EmployeeList.tsx
  LIST: {
    TITLE: 'Employee List',
    SEARCH_PLACEHOLDER: 'Search by name, email...',
    ADD_BTN: 'Add Employee',
    LOADING: 'Loading employees...',
    NO_DATA: 'No employees found.',
    DELETE_SUCCESS_FALLBACK: 'Employee deleted successfully',
    TABLE_HEADERS: {
      PROFILE: 'Profile',
      NAME: 'Name',
      EMAIL: 'Email',
      DEPARTMENT: 'Department',
      MOBILE: 'Mobile',
      ACTIONS: 'Actions',
    },
    PAGINATION: {
      PREVIOUS: 'Previous',
      NEXT: 'Next',
      PAGE: 'Page',
      OF: 'of',
    },
    VIEW_MODAL: {
      TITLE: 'Employee Details',
      LABELS: {
        FULL_NAME: 'Full Name',
        EMAIL: 'Email Address',
        MOBILE: 'Mobile Number',
        DOB: 'Date of Birth',
        GENDER: 'Gender',
        DEPARTMENT: 'Department',
        COUNTRY: 'Country',
        STATE: 'State',
        CITY: 'City',
        ADDRESS: 'Address',
        SKILLS: 'Skills',
        PREFERRED_MODE: 'Preferred Working Mode',
      }
    },
    DELETE_MODAL: {
      TITLE: 'Delete Employee',
      CONFIRMATION: 'Are you sure you want to delete this employee? This action cannot be undone.',
      CANCEL: 'Cancel',
      DELETE: 'Delete',
    }
  }
};
