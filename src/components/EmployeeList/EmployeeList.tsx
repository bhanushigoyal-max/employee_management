import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '../../utils/api';
import { API } from '../../utils/apiPaths';
import { getFileUrl } from '../../utils/fileUtils';
import { MESSAGES } from '../../lang/messages';
import styles from './EmployeeList.module.css';

/**
 * Props for the EmployeeList component.
 * @property onAdd - Callback fired when the "Add Employee" button is clicked.
 * @property onEdit - Callback fired when the edit button for a specific employee is clicked.
 */
interface EmployeeListProps {
  onAdd: () => void;
  onEdit: (employee: any) => void;
}

export const EmployeeList: React.FC<EmployeeListProps> = ({ onAdd, onEdit }) => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Pagination & Sorting State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // State for View and Delete Modals
  const [viewEmployee, setViewEmployee] = useState<any | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  /**
   * Fetches the list of employees from the backend API.
   * Handles loading states and error toast notifications.
   */
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const params: any = { page, limit };
      if (searchTerm) params.search = searchTerm;
      if (sortBy) {
        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
      }
      const response = await api.get(API.GET_EMPLOYEES, params);

      const data = response?.data;
      if (data && data.success) {
        setEmployees(data.result || []);
        setTotalPages(data.totalPages || 1);
      } else {
        const fallbackData = response?.data?.data || response?.data || [];
        if (Array.isArray(fallbackData)) {
          setEmployees(fallbackData);
        }
      }
    } catch (error: any) {
      if (error?.message) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch employees when dependencies change, with debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [page, limit, searchTerm, sortBy, sortOrder]);

  /**
   * Handles the deletion of an employee after confirmation.
   * @param id - The unique identifier of the employee to delete.
   */
  const handleDeleteConfirm = async (id: string) => {
    try {
      const response = await api.delete(`${API.GET_EMPLOYEES}/${id}`);
      if (response?.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.success(MESSAGES.LIST.DELETE_SUCCESS_FALLBACK);
      }
      fetchEmployees();
    } catch (error: any) {
      if (error?.message) {
        toast.error(error.message);
      }
    } finally {
      setEmployeeToDelete(null);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1); // Reset to first page on sort
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <span className={styles.sortIcon}>↕</span>;
    return <span className={`${styles.sortIcon} ${styles.active}`}>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{MESSAGES.LIST.TITLE}</h2>
        <div className={styles.actions}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder={MESSAGES.LIST.SEARCH_PLACEHOLDER}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>
          <button className={styles.addBtn} onClick={onAdd}>
            <Plus size={20} />
            {MESSAGES.LIST.ADD_BTN}
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{MESSAGES.LIST.TABLE_HEADERS.PROFILE}</th>
              <th onClick={() => handleSort('firstName')} className={styles.sortableHeader}>
                {MESSAGES.LIST.TABLE_HEADERS.NAME} {getSortIcon('firstName')}
              </th>
              <th onClick={() => handleSort('email')} className={styles.sortableHeader}>
                {MESSAGES.LIST.TABLE_HEADERS.EMAIL} {getSortIcon('email')}
              </th>
              <th onClick={() => handleSort('department')} className={styles.sortableHeader}>
                {MESSAGES.LIST.TABLE_HEADERS.DEPARTMENT} {getSortIcon('department')}
              </th>
              <th>{MESSAGES.LIST.TABLE_HEADERS.MOBILE}</th>
              <th>{MESSAGES.LIST.TABLE_HEADERS.ACTIONS}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>{MESSAGES.LIST.LOADING}</td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>{MESSAGES.LIST.NO_DATA}</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id || emp.id}>
                  <td>
                    {emp.profileImage ? (
                      <img
                        src={getFileUrl(emp.profileImage)}
                        alt={`${emp.firstName} ${emp.lastName}`}
                        className={styles.profileImage}
                        style={{ width: '40px', height: '40px' }}
                      />
                    ) : (
                      <div className={styles.profileImage} style={{ width: '40px', height: '40px', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {emp.firstName?.[0]}{emp.lastName?.[0]}
                      </div>
                    )}
                  </td>
                  <td>{emp.firstName} {emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.mobile}</td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={`${styles.iconBtn} ${styles.view}`} onClick={() => setViewEmployee(emp)} title="View">
                        <Eye size={18} />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.edit}`} onClick={() => onEdit(emp)} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className={`${styles.iconBtn} ${styles.delete}`} onClick={() => setEmployeeToDelete(emp._id || emp.id)} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          {MESSAGES.LIST.PAGINATION.PREVIOUS}
        </button>
        <span className={styles.pageInfo}>{MESSAGES.LIST.PAGINATION.PAGE} {page} {MESSAGES.LIST.PAGINATION.OF} {totalPages}</span>
        <button
          className={styles.pageBtn}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          {MESSAGES.LIST.PAGINATION.NEXT}
        </button>
      </div>

      {/* View Modal */}
      {viewEmployee && (
        <div className={styles.modalOverlay} onClick={() => setViewEmployee(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{MESSAGES.LIST.VIEW_MODAL.TITLE}</h3>
              <button className={styles.closeBtn} onClick={() => setViewEmployee(null)}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.viewGrid}>
              <div className={styles.viewItem}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.FULL_NAME}</div>
                <div className={styles.viewValue}>{viewEmployee.firstName} {viewEmployee.lastName}</div>
              </div>
              <div className={styles.viewItem}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.EMAIL}</div>
                <div className={styles.viewValue}>{viewEmployee.email}</div>
              </div>
              <div className={styles.viewItem}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.MOBILE}</div>
                <div className={styles.viewValue}>{viewEmployee.mobile}</div>
              </div>
              <div className={styles.viewItem}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.DOB}</div>
                <div className={styles.viewValue}>{viewEmployee.dateOfBirth?.substring(0, 10)}</div>
              </div>
              <div className={styles.viewItem}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.GENDER}</div>
                <div className={styles.viewValue}>{viewEmployee.gender}</div>
              </div>
              <div className={styles.viewItem}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.DEPARTMENT}</div>
                <div className={styles.viewValue}>{viewEmployee.department}</div>
              </div>
              <div className={styles.viewItem}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.COUNTRY}</div>
                <div className={styles.viewValue}>{viewEmployee.country}</div>
              </div>
              <div className={styles.viewItem}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.STATE}</div>
                <div className={styles.viewValue}>{viewEmployee.state}</div>
              </div>
              <div className={styles.viewItem}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.CITY}</div>
                <div className={styles.viewValue}>{viewEmployee.city}</div>
              </div>
              <div className={`${styles.viewItem} ${styles.fullWidth}`}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.ADDRESS}</div>
                <div className={styles.viewValue}>{viewEmployee.address}</div>
              </div>
              <div className={`${styles.viewItem} ${styles.fullWidth}`}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.SKILLS}</div>
                <div className={styles.viewValue}>{Array.isArray(viewEmployee.skills) ? viewEmployee.skills.join(', ') : viewEmployee.skills}</div>
              </div>
              <div className={`${styles.viewItem} ${styles.fullWidth}`}>
                <div className={styles.viewLabel}>{MESSAGES.LIST.VIEW_MODAL.LABELS.PREFERRED_MODE}</div>
                <div className={styles.viewValue}>{Array.isArray(viewEmployee.preferredMode) ? viewEmployee.preferredMode.join(', ') : viewEmployee.preferredMode}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
        <div className={styles.modalOverlay} onClick={() => setEmployeeToDelete(null)}>
          <div className={styles.deleteModalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.deleteHeader}>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{MESSAGES.LIST.DELETE_MODAL.TITLE}</h3>
              <button className={styles.closeBtn} onClick={() => setEmployeeToDelete(null)}>
                <X size={24} />
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {MESSAGES.LIST.DELETE_MODAL.CONFIRMATION}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                className={styles.cancelBtn}
                onClick={() => setEmployeeToDelete(null)}
              >
                {MESSAGES.LIST.DELETE_MODAL.CANCEL}
              </button>
              <button
                className={styles.confirmDeleteBtn}
                onClick={() => handleDeleteConfirm(employeeToDelete)}
              >
                {MESSAGES.LIST.DELETE_MODAL.DELETE}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
