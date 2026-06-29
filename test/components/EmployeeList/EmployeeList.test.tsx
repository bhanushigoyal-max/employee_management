import { render, screen, waitFor } from '@testing-library/react';
import { EmployeeList } from '../../../src/components/EmployeeList/EmployeeList';
import { MESSAGES } from '../../../src/lang/messages';

jest.mock('../../../src/utils/api', () => ({
  api: {
    get: jest.fn().mockResolvedValue({
      data: {
        success: true,
        result: [
          { _id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com', department: 'HR' }
        ],
        totalPages: 1
      }
    }),
    delete: jest.fn().mockResolvedValue({ data: { message: 'Deleted' } })
  }
}));

describe('EmployeeList', () => {
  const mockOnAdd = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders employee list correctly and fetches data', async () => {
    render(<EmployeeList onAdd={mockOnAdd} onEdit={mockOnEdit} />);
    
    expect(screen.getByText(MESSAGES.LIST.TITLE)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    });
  });
});
