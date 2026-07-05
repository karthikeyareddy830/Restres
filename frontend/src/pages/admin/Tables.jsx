import { useState, useEffect, useMemo } from 'react';
import { tableService } from '../../services/tableService';
import TableList from '../../components/admin/TableList';
import TableFormModal from '../../components/admin/TableFormModal';
import Modal from '../../components/ui/Modal';
import SearchBar from '../../components/admin/SearchBar';
import FilterDropdown from '../../components/admin/FilterDropdown';
import LoadingState from '../../components/ui/LoadingState';
import Toast from '../../components/ui/Toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Filtering & Sorting State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('tableNumber');

  // Modals State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    try {
      // The backend returns a standardized JSON object { success, data: [] }
      const responseData = await tableService.getTables();
      setTables(Array.isArray(responseData) ? responseData : (responseData.data || []));
      setError(null);
    } catch (err) {
      setError('Failed to fetch tables.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (msg) => setToastMessage(msg);

  // Derived state: Filtered and Sorted Tables
  const filteredAndSortedTables = useMemo(() => {
    let result = [...tables];

    // Search filter
    if (searchTerm) {
      result = result.filter(t => t.tableNumber.toString().includes(searchTerm));
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      const isActive = statusFilter === 'ACTIVE';
      result = result.filter(t => t.isActive === isActive);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'tableNumber') return a.tableNumber - b.tableNumber;
      if (sortBy === 'capacity') return b.capacity - a.capacity;
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

    return result;
  }, [tables, searchTerm, statusFilter, sortBy]);

  // Handlers
  const handleAddClick = () => {
    setSelectedTable(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (table) => {
    setSelectedTable(table);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (table) => {
    setSelectedTable(table);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (selectedTable) {
        await tableService.updateTable(selectedTable._id, formData);
        showToast('Table updated successfully');
      } else {
        await tableService.createTable(formData);
        showToast('Table created successfully');
      }
      fetchTables();
      setIsFormOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed. This table number may already exist.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedTable) return;
    setActionLoading(true);
    try {
      await tableService.deleteTable(selectedTable._id);
      showToast('Table deleted (marked inactive) successfully');
      fetchTables(); // Refresh to get updated status
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete table');
    } finally {
      setActionLoading(false);
      setIsDeleteOpen(false);
      setSelectedTable(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage('')}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Manage Tables</h1>
          <p className="mt-2 text-neutral-600">Add, edit, or remove physical tables in your restaurant.</p>
        </div>
        <Button onClick={handleAddClick}>
          <svg className="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          Add Table
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Toolbar */}
      <Card className="mb-6 p-4 flex flex-col lg:flex-row gap-4 items-center justify-between">
        <SearchBar onSearch={setSearchTerm} placeholder="Search table number..." />
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <FilterDropdown
            label="Status"
            currentValue={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: 'All Tables', value: 'ALL' },
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' }
            ]}
          />
          <FilterDropdown
            label="Sort By"
            currentValue={sortBy}
            onChange={setSortBy}
            options={[
              { label: 'Table Number', value: 'tableNumber' },
              { label: 'Capacity (High to Low)', value: 'capacity' },
              { label: 'Newest First', value: 'createdAt' }
            ]}
          />
        </div>
      </Card>

      {/* Main Table Area */}
      <Card className="overflow-hidden">
        {loading ? (
          <LoadingState fullHeight />
        ) : (
          <TableList
            tables={filteredAndSortedTables}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      </Card>

      {/* Modals */}
      <TableFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        table={selectedTable}
        loading={actionLoading}
      />

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => !actionLoading && setIsDeleteOpen(false)}
        title="Delete Table"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => !actionLoading && setIsDeleteOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={actionLoading}
            >
              Confirm Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-neutral-500">
          Are you sure you want to delete Table <span className="font-medium text-neutral-900">{selectedTable?.tableNumber}</span>? This will mark it as INACTIVE and prevent future reservations, but keep historical data intact.
        </p>
      </Modal>
    </div>
  );
};

export default AdminTables;
