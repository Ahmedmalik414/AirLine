import { createContext, useContext, useState, useEffect } from 'react';
import { bookingAPI } from '../api';
import { useAuth } from './AuthContext';
import { generateBookingId, generateTicketNumber, generateSeatNumber } from '../utils/formatters';

const BookingContext = createContext(null);

// Normalise a backend booking to the shape UI components expect
function normaliseBooking(b) {
  if (!b) return b;
  const flight = b.flight
    ? {
        ...b.flight,
        from: b.flight.departure_airport,
        to: b.flight.arrival_airport,
        departureTime: b.flight.departure_time,
        arrivalTime: b.flight.arrival_time,
        flightNumber: b.flight.flight_number,
        airline: {
          ...b.flight.airline,
          logo: b.flight.airline?.logo || '✈️',
          color: b.flight.airline?.color || '#1e3a8a',
        },
        duration: (() => {
          const d = b.flight.duration;
          if (!d) return 0;
          if (typeof d === 'string') {
            const parts = d.split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
          }
          return d;
        })(),
        prices: {
          economy: parseFloat(b.flight.price_economy),
          business: parseFloat(b.flight.price_business),
          first: parseFloat(b.flight.price_business) * 2,
        },
      }
    : null;

  return {
    ...b,
    flight,
    bookingDate: b.created_at,
    totalPrice: parseFloat(b.total_price),
    class: b.cabin_class,
    passengers: b.passengers || [
      {
        name: b.passenger?.user || 'Passenger',
        age: '-',
        passport: '-',
        seat: b.seat_number,
        mealPreference: 'standard',
      },
    ],
    ticketNumber: b.booking_reference,
  };
}

export function BookingProvider({ children }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setBookings([]);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getBookings();
      setBookings((response.data || []).map(normaliseBooking));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * createBooking(flight, passengers, cabinClass)
   *
   * Called by Booking.jsx with the full normalised flight object and an array
   * of passenger detail objects.  We send one booking to the backend and build
   * a rich local booking object for navigation state.
   */
  const createBooking = async (flight, passengers, cabinClass) => {
    try {
      const seatNumber = generateSeatNumber(
        Math.floor(Math.random() * 30) + 1,
        Math.floor(Math.random() * 6)
      );

      const response = await bookingAPI.createBooking({
        flight: flight.id,
        cabin_class: cabinClass || 'economy',
        seat_number: seatNumber,
        passenger_from_user: true,
      });

      const price = flight.prices?.[cabinClass] ?? parseFloat(flight.price_economy ?? 0);
      const bookingId = response.data?.id || generateBookingId();
      const ticketNumber = response.data?.booking_reference || generateTicketNumber();

      const localBooking = {
        ...normaliseBooking(response.data),
        id: bookingId,
        ticketNumber,
        flight,
        passengers: passengers.map((p, i) => ({
          ...p,
          seat: generateSeatNumber(Math.floor(Math.random() * 30) + 1, i % 6),
          mealPreference: p.mealPreference || 'standard',
        })),
        class: cabinClass,
        totalPrice: price * passengers.length,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
      };

      setCurrentBooking(localBooking);
      return { success: true, booking: localBooking };
    } catch (error) {
      console.error('Error creating booking:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create booking',
      };
    }
  };

  const confirmPayment = async (bookingId, paymentMethod) => {
    const confirmedBooking = { ...currentBooking, paymentMethod, status: 'confirmed' };
    setCurrentBooking(null);
    setBookingStep(1);
    fetchBookings();
    return { success: true, booking: confirmedBooking };
  };

  const cancelBooking = async (bookingId) => {
    try {
      await bookingAPI.cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === parseInt(bookingId) ? { ...b, status: 'cancelled' } : b
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return { success: false, error: 'Failed to cancel booking' };
    }
  };

  const getUserBookings = () => bookings;

  const getBookingById = (id) =>
    bookings.find((b) => b.id === parseInt(id)) || currentBooking;

  const canCancel = (booking) => {
    if (booking.status !== 'confirmed') return false;
    const flightTime = new Date(
      booking.flight?.departureTime || booking.flight?.departure_time
    );
    const now = new Date();
    const hoursUntilFlight = (flightTime - now) / (1000 * 60 * 60);
    return hoursUntilFlight > 24;
  };

  const value = {
    bookings,
    currentBooking,
    bookingStep,
    setBookingStep,
    createBooking,
    confirmPayment,
    cancelBooking,
    getUserBookings,
    getBookingById,
    canCancel,
    loading,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}
