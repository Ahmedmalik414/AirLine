import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Calendar, 
  Clock, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RotateCcw
} from 'lucide-react';
import { formatTime, formatDate, formatPrice } from '../utils/formatters';
import { bookingStatus } from '../data/mockData';

export function MyBookings() {
  const navigate = useNavigate();
  const { getUserBookings, cancelBooking, canCancel } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const bookings = getUserBookings();

  const handleCancel = async () => {
    if (!selectedBooking) return;
    setIsCancelling(true);
    await cancelBooking(selectedBooking.id);
    setIsCancelling(false);
    setShowCancelModal(false);
    setSelectedBooking(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = bookingStatus[status] || { color: 'slate', label: status };
    return (
      <Badge variant={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    );
  };

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-12 h-12 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">No Bookings Yet</h1>
          <p className="text-slate-600 mb-6">
            You haven't made any bookings yet. Start exploring flights and plan your next adventure!
          </p>
          <Button onClick={() => navigate('/')} size="lg">
            <Plane className="w-5 h-5 mr-2" />
            Search Flights
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Bookings</h1>
          <p className="text-slate-600">
            Manage your upcoming and past trips
          </p>
        </div>

        <div className="space-y-4">
          {bookings.map((booking, index) => {
            const flight = booking.flight;
            if (!flight) return null; // safety guard
            const departureTime = flight.departureTime || flight.departure_time;
            const isUpcoming = new Date(departureTime) > new Date();
            const canBeCancelled = canCancel(booking);


            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Status Bar */}
                    <div className={`px-6 py-2 ${
                      booking.status === 'confirmed' ? 'bg-success-50' :
                      booking.status === 'cancelled' ? 'bg-danger-50' :
                      'bg-amber-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(booking.status)}
                          <span className="text-sm text-slate-600">
                            Booking ID: <span className="font-mono font-medium">{booking.id}</span>
                          </span>
                        </div>
                        <span className="text-sm text-slate-500">
                          Booked on {formatDate(booking.bookingDate)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Flight Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                              style={{ backgroundColor: flight.airline.color + '20' }}
                            >
                              {flight.airline.logo}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{flight.airline.name}</div>
                              <div className="text-sm text-slate-500">{flight.flightNumber}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div>
                              <div className="text-xl font-bold">{formatTime(departureTime)}</div>
                              <div className="text-sm text-slate-500">{(flight.from || flight.departure_airport)?.code}</div>
                              <div className="text-xs text-slate-400">{(flight.from || flight.departure_airport)?.city}</div>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                              <div className="text-xs text-slate-400">{flight.duration} min</div>
                              <div className="w-full h-px bg-slate-300 my-1 relative">
                                <Plane className="w-4 h-4 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold">{formatTime(flight.arrivalTime || flight.arrival_time)}</div>
                              <div className="text-sm text-slate-500">{(flight.to || flight.arrival_airport)?.code}</div>
                              <div className="text-xs text-slate-400">{(flight.to || flight.arrival_airport)?.city}</div>
                            </div>
                          </div>

                          <div className="mt-4 text-sm text-slate-500">
                            {formatDate(departureTime)} • {(booking.passengers || []).length} Passenger{(booking.passengers || []).length > 1 ? 's' : ''} • {(booking.class || booking.cabin_class || 'Economy').charAt(0).toUpperCase() + (booking.class || booking.cabin_class || 'economy').slice(1)}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 lg:w-48">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">{formatPrice(booking.totalPrice)}</div>
                            <div className="text-sm text-slate-500">Total paid</div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {isUpcoming && booking.status === 'confirmed' && (
                              <>
                                {canBeCancelled ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-danger-600 border-danger-200 hover:bg-danger-50"
                                    onClick={() => {
                                      setSelectedBooking(booking);
                                      setShowCancelModal(true);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    title="Cannot cancel within 24 hours of departure"
                                  >
                                    <AlertCircle className="w-4 h-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={!!selectedBooking && !showCancelModal}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Booking Reference</div>
                <div className="text-xl font-mono font-bold">{selectedBooking.id}</div>
              </div>
              {getStatusBadge(selectedBooking.status)}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-semibold mb-3">Flight Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-500">Airline</div>
                  <div className="font-medium">{selectedBooking.flight?.airline?.name}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Flight Number</div>
                  <div className="font-medium">{selectedBooking.flight?.flightNumber || selectedBooking.flight?.flight_number}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Departure</div>
                  <div className="font-medium">{formatDate(selectedBooking.flight?.departureTime || selectedBooking.flight?.departure_time)} {formatTime(selectedBooking.flight?.departureTime || selectedBooking.flight?.departure_time)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Arrival</div>
                  <div className="font-medium">{formatDate(selectedBooking.flight?.arrivalTime || selectedBooking.flight?.arrival_time)} {formatTime(selectedBooking.flight?.arrivalTime || selectedBooking.flight?.arrival_time)}</div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-semibold mb-3">Passengers</h4>
              <div className="space-y-2">
                {(selectedBooking.passengers || []).map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-slate-500">Age: {p.age}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-600">Seat {p.seat}</div>
                      <div className="text-xs text-slate-400">{p.mealPreference}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-xl font-bold text-primary-600">{formatPrice(selectedBooking.totalPrice ?? selectedBooking.total_price ?? 0)}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Booking"
        size="sm"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setShowCancelModal(false)}>
              Keep Booking
            </Button>
            <Button 
              variant="danger" 
              className="flex-1" 
              onClick={handleCancel}
              loading={isCancelling}
            >
              Yes, Cancel
            </Button>
          </div>
        }
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-danger-500 flex-shrink-0" />
          <div>
            <p className="text-slate-700 mb-2">
              Are you sure you want to cancel this booking?
            </p>
            <p className="text-sm text-slate-500">
              This action cannot be undone. Refund will be processed according to our cancellation policy.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
