import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { EmployeeForm } from './components/EmployeeForm/EmployeeForm';
import { EmployeeList } from './components/EmployeeList/EmployeeList';
import { api } from './utils/api';
import { API } from './utils/apiPaths';
import { MESSAGES } from './lang/messages';
/**
 * Main Application Component
 * Manages the global state for switching between the Employee List and Employee Form views.
 */
function App() {
  // State to track which view is currently active
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  
  // State to hold employee data when editing an existing employee
  const [editEmployee, setEditEmployee] = useState<any>(null);

  const [isTokenReady, setIsTokenReady] = useState(false);

  useEffect(() => {
    const fetchInitialToken = async () => {
      try {
        const response = await api.get(API.GET_TOKEN);
        if (response?.data?.token) {
          localStorage.setItem('authToken', response.data.token);
        }
      } catch (error) {
        console.error('Failed to fetch initial token:', error);
      } finally {
        setIsTokenReady(true);
      }
    };

    fetchInitialToken();
  }, []);

  /**
   * Handles transitioning to the form view for creating a new employee.
   * Clears any existing employee data being edited.
   */
  const handleAdd = () => {
    setEditEmployee(null);
    setCurrentView('form');
  };

  /**
   * Handles transitioning to the form view to edit an existing employee.
   * @param employee - The employee object to be edited
   */
  const handleEdit = (employee: any) => {
    setEditEmployee(employee);
    setCurrentView('form');
  };

  /**
   * Callback fired upon successful form submission (create or update).
   * Returns the user to the list view.
   */
  const handleSuccess = () => {
    setCurrentView('list');
  };

  /**
   * Callback fired when the user cancels the form submission.
   * Returns the user to the list view.
   */
  const handleCancel = () => {
    setCurrentView('list');
  };

  if (!isTokenReady) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-primary)' }}>
        {MESSAGES.APP.LOADING}
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            color: '#f8fafc',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <main style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {MESSAGES.APP.TITLE}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {MESSAGES.APP.SUBTITLE}
          </p>
        </div>

        {currentView === 'list' ? (
          <EmployeeList onAdd={handleAdd} onEdit={handleEdit} />
        ) : (
          <EmployeeForm 
            initialData={editEmployee} 
            onSuccess={handleSuccess} 
            onCancel={handleCancel} 
          />
        )}
      </main>
    </>
  );
}

export default App;
