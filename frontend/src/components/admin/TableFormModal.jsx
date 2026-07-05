import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const TableFormModal = ({ isOpen, onClose, onSubmit, table, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const isEditing = !!table;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        reset({
          tableNumber: table.tableNumber,
          capacity: table.capacity
        });
      } else {
        reset({
          tableNumber: '',
          capacity: ''
        });
      }
    }
  }, [isOpen, table, isEditing, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      tableNumber: Number(data.tableNumber),
      capacity: Number(data.capacity)
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Table' : 'Add New Table'}
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto" disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit(handleFormSubmit)} 
            isLoading={loading}
            className="w-full sm:w-auto mt-3 sm:mt-0"
          >
            {isEditing ? 'Save Changes' : 'Create Table'}
          </Button>
        </>
      }
    >
      <form id="table-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Table Number *"
          type="number"
          min="1"
          {...register('tableNumber', { 
            required: 'Table number is required',
            min: { value: 1, message: 'Must be greater than 0' }
          })}
          error={errors.tableNumber?.message}
        />
        
        <Input
          label="Capacity (Seats) *"
          type="number"
          min="1"
          {...register('capacity', { 
            required: 'Capacity is required',
            min: { value: 1, message: 'Capacity must be greater than 0' }
          })}
          error={errors.capacity?.message}
        />
      </form>
    </Modal>
  );
};

export default TableFormModal;
