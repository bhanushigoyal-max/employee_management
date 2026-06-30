import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { EmployeeList } from '../../../src/components/EmployeeList/EmployeeList';
import { MESSAGES } from '../../../src/lang/messages';
import { api } from '../../../src/utils/api';

jest.mock('../../../src/utils/api', () => ({
  api: {
    get: jest.fn(),
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
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        success: true,
        result: [
          { _id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com', department: 'HR' }
        ],
        totalPages: 1,
        total: 1
      }
    });

    render(<EmployeeList onAdd={mockOnAdd} onEdit={mockOnEdit} />);
    
    // We can use a regex because the title also includes the record count now (e.g. "Employee List (1 Record)")
    expect(screen.getByText(new RegExp(MESSAGES.LIST.TITLE))).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('alice@test.com')).toBeInTheDocument();
    });
  });

  it('handles fallback API response structure correctly', async () => {
    // API returns direct array inside data instead of success/result wrapper
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [
        { _id: '2', firstName: 'Bob', lastName: 'Jones', email: 'bob@test.com', department: 'IT' }
      ]
    });

    render(<EmployeeList onAdd={mockOnAdd} onEdit={mockOnEdit} />);
    
    await waitFor(() => {
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
      expect(screen.getByText('bob@test.com')).toBeInTheDocument();
      // Should show "(1 Record)"
      expect(screen.getByText('(1 Record)')).toBeInTheDocument();
    });
  });

  it('performs local search without calling API when records are <= limit', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: {
        success: true,
        result: [
          { _id: '1', firstName: 'Alice', lastName: 'Smith', email: 'alice@test.com', department: 'HR' },
          { _id: '2', firstName: 'Bob', lastName: 'Jones', email: 'bob@test.com', department: 'IT' }
        ],
        totalPages: 1,
        total: 2 // <= 10 limit
      }
    });

    render(<EmployeeList onAdd={mockOnAdd} onEdit={mockOnEdit} />);
    
    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });

    // Clear mock calls to verify api.get is not called again for local search
    (api.get as jest.Mock).mockClear();

    // Type in search box
    const searchInput = screen.getByPlaceholderText(MESSAGES.LIST.SEARCH_PLACEHOLDER);
    fireEvent.change(searchInput, { target: { value: 'alice' } });

    await waitFor(() => {
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument();
      // Total records should update to 1 for the filtered list
      expect(screen.getByText('(1 Record)')).toBeInTheDocument();
    });

    expect(api.get).not.toHaveBeenCalled();
  });
});

