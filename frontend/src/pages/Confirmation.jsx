import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Plane, 
  CheckCircle, 
  Download, 
  Share2, 
  Calendar,
  MapPin,
  Clock,
  User,
  Armchair,
  Utensils,
  ArrowRight,
  Home
} from 'lucide-react';
import { formatTime, formatDate, formatPrice } from '../utils/formatters';

export function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) {
      navigate('/');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const flight = booking.flight;

  const handleDownloadTicket = () => {
    // In a real app, this would generate a PDF
    alert('Ticket download started!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Flight Booking',
        text: `I'm flying from ${(flight.from || flight.departure_airport)?.city} to ${(flight.to || flight.arrival_airport)?.city} on ${formatDate(flight.departureTime || flight.departure_time)}`,
      });
    } else {
      alert('Share link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-success-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-slate-600">
            Your booking has been confirmed. We've sent a confirmation email to you.
          </p>
        </motion.div>

        {/* Booking Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <div className="text-white/70 text-sm mb-1">Booking Reference</div>
                  <div className="text-3xl font-bold font-mono">{booking.booking_reference || booking.id}</div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-white/70 text-sm mb-1">Ticket Number</div>
                  <div className="text-xl font-mono">{booking.ticketNumber || booking.booking_reference || booking.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Flight Ticket */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card className="overflow-hidden">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                    {flight.airline.logo}
                  </div>
                  <div>
                    <div className="font-semibold">{flight.airline.name}</div>
                    <div className="text-white/70 text-sm">{flight.flightNumber}</div>
                  </div>
                </div>
                <Badge variant="success" className="bg-white/20 text-white border-0">
                  Confirmed
                </Badge>
              </div>
            </div>

            {/* Ticket Body */}
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Departure */}
                <div className="text-center md:text-left">
                  <div className="text-sm text-slate-500 mb-1">Departure</div>
                  <div className="text-3xl font-bold text-slate-900">{formatTime(flight.departureTime || flight.departure_time)}</div>
                  <div className="text-lg font-medium text-slate-700">{(flight.from || flight.departure_airport)?.code}</div>
                  <div className="text-sm text-slate-500">{(flight.from || flight.departure_airport)?.city}</div>
                  <div className="text-sm text-slate-500">{formatDate(flight.departureTime || flight.departure_time)}</div>
                </div>

                {/* Flight Path */}
                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm text-slate-400 mb-2">{flight.duration || 0} min</div>
                  <div className="w-full flex items-center">
                    <div className="h-px flex-1 bg-slate-300" />
                    <Plane className="w-6 h-6 text-primary-600 mx-3 rotate-90" />
                    <div className="h-px flex-1 bg-slate-300" />
                  </div>
                  <div className="text-xs text-slate-400 mt-2">Direct Flight</div>
                </div>

                {/* Arrival */}
                <div className="text-center md:text-right">
                  <div className="text-sm text-slate-500 mb-1">Arrival</div>
                  <div className="text-3xl font-bold text-slate-900">{formatTime(flight.arrivalTime || flight.arrival_time)}</div>
                  <div className="text-lg font-medium text-slate-700">{(flight.to || flight.arrival_airport)?.code}</div>
                  <div className="text-sm text-slate-500">{(flight.to || flight.arrival_airport)?.city}</div>
                  <div className="text-sm text-slate-500">{formatDate(flight.arrivalTime || flight.arrival_time)}</div>
                </div>
              </div>

              <div className="border-t border-slate-100 mt-6 pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Class</div>
                    <div className="font-medium text-slate-900 capitalize">{booking.class || booking.cabin_class || 'economy'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Aircraft</div>
                    <div className="font-medium text-slate-900">{flight.aircraft?.type || flight.aircraft?.model || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Passengers</div>
                    <div className="font-medium text-slate-900">{(booking.passengers || []).length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Total Paid</div>
                    <div className="font-medium text-primary-600">{formatPrice(booking.totalPrice ?? booking.total_price ?? 0)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Passenger Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-4">Passenger Details</h2>
          <div className="space-y-4">
            {(booking.passengers || []).map((passenger, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{passenger.name}</div>
                      <div className="text-sm text-slate-500">Age: {passenger.age} years</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Armchair className="w-4 h-4" />
                        Seat {passenger.seat}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                        <Utensils className="w-4 h-4" />
                        {passenger.mealPreference}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleDownloadTicket}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Ticket
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            className="flex-1"
            onClick={() => navigate('/my-bookings')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            View My Bookings
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
