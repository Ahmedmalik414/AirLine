import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { useFlights } from '../context/FlightContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Plane, 
  ArrowRight, 
  Clock, 
  User, 
  Utensils,
  Armchair,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatTime, formatDuration, formatPrice } from '../utils/formatters';
import { mealOptions, seatPreferences } from '../data/mockData';

export function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchParams } = useFlights();
  const { createBooking, setBookingStep } = useBookings();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  
  const flight = location.state?.flight;
  
  if (!flight) {
    navigate('/flights');
    return null;
  }

  const [passengers, setPassengers] = useState(
    Array.from({ length: searchParams.passengers }, (_, i) => ({
      name: '',
      age: '',
      passport: '',
      seatPreference: 'window',
      mealPreference: 'standard',
    }))
  );

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    passengers.forEach((passenger, index) => {
      if (!passenger.name.trim()) {
        newErrors[`name_${index}`] = 'Name is required';
      }
      if (!passenger.age || passenger.age < 1 || passenger.age > 120) {
        newErrors[`age_${index}`] = 'Valid age is required';
      }
      if (!passenger.passport.trim() || passenger.passport.length < 6) {
        newErrors[`passport_${index}`] = 'Valid passport number is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
    if (errors[`${field}_${index}`]) {
      setErrors({ ...errors, [`${field}_${index}`]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setBookingError('');
    const result = await createBooking(flight, passengers, searchParams.class);
    
    if (result.success) {
      setBookingStep(2);
      navigate('/payment', { state: { booking: result.booking } });
    } else {
      setBookingError(result.error || 'Failed to create booking. Please try again.');
    }
    setIsLoading(false);
  };

  const totalPrice = (flight.prices?.[searchParams.class] ?? flight.price_economy ?? 0) * searchParams.passengers;


  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium">
                1
              </div>
              <span className="ml-2 text-sm font-medium text-primary-600">Passenger Details</span>
            </div>
            <div className="w-24 h-1 bg-slate-200 mx-4" />
            <div className="flex items-center opacity-50">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-slate-600">Payment</span>
            </div>
            <div className="w-24 h-1 bg-slate-200 mx-4" />
            <div className="flex items-center opacity-50">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-slate-600">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Passenger Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Passenger Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {passengers.map((passenger, index) => (
                      <div key={index} className="p-4 bg-slate-50 rounded-xl">
                        <h3 className="font-semibold text-slate-900 mb-4">
                          Passenger {index + 1}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Full Name"
                            placeholder="As per passport"
                            value={passenger.name}
                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                            error={errors[`name_${index}`]}
                            required
                          />
                          <Input
                            label="Age"
                            type="number"
                            placeholder="Years"
                            value={passenger.age}
                            onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                            error={errors[`age_${index}`]}
                            required
                          />
                          <Input
                            label="Passport Number"
                            placeholder="Passport number"
                            value={passenger.passport}
                            onChange={(e) => handlePassengerChange(index, 'passport', e.target.value)}
                            error={errors[`passport_${index}`]}
                            required
                          />
                          <Select
                            label="Seat Preference"
                            options={seatPreferences.map(s => ({ value: s.id, label: s.name }))}
                            value={passenger.seatPreference}
                            onChange={(e) => handlePassengerChange(index, 'seatPreference', e.target.value)}
                          />
                          <div className="md:col-span-2">
                            <Select
                              label="Meal Preference"
                              options={mealOptions.map(m => ({ 
                                value: m.id, 
                                label: `${m.name}${m.price > 0 ? ` (+$${m.price})` : ''}` 
                              }))}
                              value={passenger.mealPreference}
                              onChange={(e) => handlePassengerChange(index, 'mealPreference', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        Please ensure all passenger details match their passport exactly. 
                        Name changes may not be permitted after booking.
                      </p>
                    </div>

                    {bookingError && (
                      <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                        {bookingError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      loading={isLoading}
                    >
                      Continue to Payment
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Flight Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: flight.airline.color + '20' }}
                    >
                      {flight.airline.logo}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{flight.airline.name}</div>
                      <div className="text-sm text-slate-500">{flight.flightNumber}</div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center justify-between py-2">
                    <div className="text-center">
                      <div className="text-lg font-bold">{formatTime(flight.departureTime)}</div>
                      <div className="text-sm text-slate-500">{flight.from.code}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-4">
                      <Plane className="w-4 h-4 text-slate-400 rotate-90" />
                      <div className="text-xs text-slate-400">{formatDuration(flight.duration)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{formatTime(flight.arrivalTime)}</div>
                      <div className="text-sm text-slate-500">{flight.to.code}</div>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        {searchParams.class.charAt(0).toUpperCase() + searchParams.class.slice(1)} Class
                      </span>
                      <span className="font-medium">{formatPrice(flight.prices?.[searchParams.class] ?? flight.price_economy ?? 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Passengers</span>
                      <span className="font-medium">x {searchParams.passengers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Taxes & Fees</span>
                      <span className="font-medium">Included</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-slate-100">
                      <span className="font-semibold text-slate-900">Total</span>
                      <span className="text-xl font-bold text-primary-600">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      Free cancellation within 24h
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      Instant confirmation
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                          24/7 support
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
