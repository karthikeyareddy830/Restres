import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

const EditReservationModal = ({ isOpen, onClose, onSubmit, reservation, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const timeSlots = ['12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];

  useEffect(() => {
    if (reservation) {
      reset({
        reservationDate: new Date(reservation.reservationDate).toISOString().split('T')[0],
        timeSlot: reservation.timeSlot,
        guests: reservation.guests
      });
    }
  }, [reservation, reset]);

  if (!isOpen || !reservation) return null;

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      guests: Number(data.guests)
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Reservation"
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
            Save Changes
          </Button>
        </>
      }
    >
      <form id="edit-reservation-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Date"
          type="date"
          {...register('reservationDate', { required: 'Date is required' })}
          error={errors.reservationDate?.message}
        />
        
        <Input
          label="Time Slot"
          type="select"
          {...register('timeSlot', { required: 'Time slot is required' })}
          error={errors.timeSlot?.message}
        >
          <option value="">Select a time</option>
          {timeSlots.map(slot => (
            <option key={slot} value={slot}>{slot}</option>
          ))}
        </Input>
        
        <Input
          label="Guests"
          type="number"
          min="1"
          max="20"
          {...register('guests', { 
            required: 'Guests required',
            min: { value: 1, message: 'Min 1' },
            max: { value: 20, message: 'Max 20' }
          })}
          error={errors.guests?.message}
        />
      </form>
    </Modal>
  );
};

export default EditReservationModal;
