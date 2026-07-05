import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { reservationService } from '../../services/reservationService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const CreateReservation = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const timeSlots = ['12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];

  const getTodayString = () => {
    const today = new Date();
    const tzOffset = today.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(today.getTime() - tzOffset)).toISOString().split('T')[0];
    return localISOTime;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      // Cast guests to number
      const payload = {
        ...data,
        guests: Number(data.guests)
      };
      const response = await reservationService.createReservation(payload);
      setSuccessData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 text-center border-neutral-100 shadow-xl">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-neutral-900 mb-4">Reservation Created Successfully!</h2>
          <p className="text-lg text-neutral-600 mb-8">We look forward to seeing you. Here are your booking details:</p>
          
          <div className="bg-neutral-50 rounded-xl p-6 mb-8 text-left max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-y-4">
              <div className="text-sm font-medium text-neutral-500">Date</div>
              <div className="text-sm font-semibold text-neutral-900">{new Date(successData.reservationDate).toLocaleDateString()}</div>
              
              <div className="text-sm font-medium text-neutral-500">Time</div>
              <div className="text-sm font-semibold text-neutral-900">{successData.timeSlot}</div>
              
              <div className="text-sm font-medium text-neutral-500">Guests</div>
              <div className="text-sm font-semibold text-neutral-900">{successData.guests}</div>
              
              <div className="text-sm font-medium text-neutral-500">Assigned Table</div>
              <div className="text-sm font-semibold text-primary-600">Table {successData.tableNumber || 'N/A'}</div>
            </div>
          </div>
          
          <div className="space-x-4 flex justify-center">
            <Button
              as={Link}
              to="/reservations"
              variant="primary"
            >
              View My Reservations
            </Button>
            <Button
              as={Link}
              to="/dashboard"
              variant="outline"
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center">
        <Link to="/dashboard" className="text-neutral-500 hover:text-neutral-900 mr-4 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Book a Table</h1>
          <p className="mt-2 text-neutral-600">Fill in the details below to secure your reservation.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md flex items-start">
          <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <Card className="border-neutral-100 shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Reservation Date *"
              type="date"
              id="reservationDate"
              min={getTodayString()}
              error={errors.reservationDate?.message}
              {...register('reservationDate', { required: 'Date is required' })}
            />

            <Input
              label="Time Slot *"
              type="select"
              id="timeSlot"
              error={errors.timeSlot?.message}
              {...register('timeSlot', { required: 'Time slot is required' })}
            >
              <option value="">Select a time</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </Input>
          </div>

          <Input
            label="Number of Guests *"
            type="number"
            id="guests"
            min="1"
            max="20"
            wrapperClassName="md:w-1/2"
            error={errors.guests?.message}
            {...register('guests', { 
              required: 'Number of guests is required',
              min: { value: 1, message: 'Minimum 1 guest required' },
              max: { value: 20, message: 'Maximum 20 guests allowed' }
            })}
          />

          <div className="pt-4 border-t border-neutral-100 flex justify-end gap-3">
            <Button
              as={Link}
              to="/dashboard"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              {loading ? 'Confirming...' : 'Create Reservation'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateReservation;
