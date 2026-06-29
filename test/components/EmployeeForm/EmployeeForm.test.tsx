import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { EmployeeForm } from '../../../src/components/EmployeeForm/EmployeeForm';
import { MESSAGES } from '../../../src/lang/messages';

jest.mock('../../../src/utils/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: [] }),
    post: jest.fn().mockResolvedValue({ data: { message: 'Success' } }),
    put: jest.fn().mockResolvedValue({ data: { message: 'Success' } })
  }
}));

// Mock react-hot-toast since we don't want to actually show toasts in tests
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  }
}));

describe('EmployeeForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with default title for new employee', async () => {
    render(<EmployeeForm />);
    await waitFor(() => {
      expect(screen.getByText(MESSAGES.FORM.TITLE_ADD)).toBeInTheDocument();
      expect(screen.getByLabelText(MESSAGES.FORM.LABELS.FIRST_NAME)).toBeInTheDocument();
    });
  });

  it('renders the form with edit title when initialData is provided', async () => {
    const initialData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };
    render(<EmployeeForm initialData={initialData} />);
    await waitFor(() => {
      expect(screen.getByText(MESSAGES.FORM.TITLE_EDIT)).toBeInTheDocument();
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    });
  });
});
