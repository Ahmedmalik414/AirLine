import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { flightAPI, airportAPI } from '../api';

const FlightContext = createContext(null);

// Airline logo/color defaults since the backend Airline model doesn't store these
const AIRLINE_VISUALS = {
  default: { logo: '✈️', color: '#1e3a8a' },
};

// Normalise a backend flight object into the shape the UI components expect
function normaliseFlight(f) {
  if (!f) return f;
  const airline = {
    ...f.airline,
    logo: f.airline?.logo || AIRLINE_VISUALS.default.logo,
    color: f.airline?.color || AIRLINE_VISUALS.default.color,
  };

  // Duration comes back as "HH:MM:SS" string from Django DurationField
  let durationMinutes = 0;
  if (typeof f.duration === 'string') {
    const parts = f.duration.split(':');
    durationMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  } else if (typeof f.duration === 'number') {
    durationMinutes = f.duration;
  }

  return {
    ...f,
    airline,
    from: f.departure_airport,
    to: f.arrival_airport,
    departureTime: f.departure_time,
    arrivalTime: f.arrival_time,
    flightNumber: f.flight_number,
    duration: durationMinutes,
    prices: {
      economy: parseFloat(f.price_economy),
      business: parseFloat(f.price_business),
      first: parseFloat(f.price_business) * 2, // approximation; backend has no first-class price
    },
    seats: {
      economy: { available: 50, total: 150 },
      business: { available: 20, total: 30 },
      first: { available: 5, total: 10 },
    },
  };
}

export function FlightProvider({ children }) {
  const [flights, setFlights] = useState([]);
  const [airports, setAirports] = useState([]);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy',
  });

  const [filters, setFilters] = useState({
    airlines: [],
    maxPrice: 5000,
    departureTime: 'all',
    stops: 'all',
  });

  const [selectedFlight, setSelectedFlight] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch airports on mount
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await airportAPI.getAirports();
        setAirports(response.data);
      } catch (error) {
        console.error('Error fetching airports:', error);
      }
    };
    fetchAirports();
  }, []);

  const searchFlights = async (criteria) => {
    setLoading(true);
    try {
      const params = {};
      if (criteria.from) params.origin = criteria.from;
      if (criteria.to) params.destination = criteria.to;
      if (criteria.departureDate) params.departure_date = criteria.departureDate;

      const response = await flightAPI.searchFlights(params);
      const normalised = (response.data || []).map(normaliseFlight);
      setFlights(normalised);
      setSearchParams(criteria);
      return { success: true };
    } catch (error) {
      console.error('Error searching flights:', error);
      return { success: false, error: 'Failed to search flights' };
    } finally {
      setLoading(false);
    }
  };

  // Client-side filter on top of server results
  const filteredFlights = useMemo(() => {
    return flights.filter((f) => {
      const price = f.prices?.[searchParams.class] ?? 0;
      if (price > filters.maxPrice) return false;
      if (filters.airlines.length > 0 && !filters.airlines.includes(f.airline?.id)) return false;

      if (filters.departureTime !== 'all') {
        const hour = new Date(f.departureTime).getHours();
        if (filters.departureTime === 'morning' && (hour < 5 || hour >= 12)) return false;
        if (filters.departureTime === 'afternoon' && (hour < 12 || hour >= 18)) return false;
        if (filters.departureTime === 'evening' && (hour < 18 || hour >= 24)) return false;
        if (filters.departureTime === 'night' && (hour >= 5)) return false;
      }
      return true;
    });
  }, [flights, filters, searchParams.class]);

  const getFlightById = (id) => flights.find((f) => f.id === parseInt(id));

  // Helper consumed by FlightResults
  const getAirports = () => airports;

  const value = {
    flights,
    filteredFlights,
    airports,
    searchParams,
    setSearchParams,
    filters,
    setFilters,
    selectedFlight,
    setSelectedFlight,
    searchFlights,
    getFlightById,
    getAirports,
    loading,
  };

  return <FlightContext.Provider value={value}>{children}</FlightContext.Provider>;
}

export function useFlights() {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlights must be used within a FlightProvider');
  }
  return context;
}
