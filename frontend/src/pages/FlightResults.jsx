import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlights } from '../context/FlightContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { motion } from 'framer-motion';
import { 
  Plane, 
  ArrowRight, 
  Clock, 
  Users, 
  Filter,
  ChevronDown,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { formatTime, formatDuration, formatPrice } from '../utils/formatters';
import { flightStatus } from '../data/mockData';

export function FlightResults() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { filteredFlights, searchParams, setSearchParams, filters, setFilters, airports } = useFlights();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('price');


  const sortedFlights = [...filteredFlights].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.prices[searchParams.class] - b.prices[searchParams.class];
      case 'duration':
        return a.duration - b.duration;
      case 'departure':
        return new Date(a.departureTime) - new Date(b.departureTime);
      case 'arrival':
        return new Date(a.arrivalTime) - new Date(b.arrivalTime);
      default:
        return 0;
    }
  });

  const handleBookFlight = (flight) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/flights', flightId: flight.id } });
      return;
    }
    setSelectedFlight(flight);
  };

  const confirmBooking = () => {
    navigate('/booking', { state: { flight: selectedFlight } });
  };

  const airlines = [...new Set(filteredFlights.map(f => f.airline))];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Available Flights
          </h1>
          <p className="text-slate-600">
            {airports.find(a => a.code === searchParams.from)?.city} to {airports.find(a => a.code === searchParams.to)?.city}
            {' '}• {searchParams.passengers} Passenger{searchParams.passengers > 1 ? 's' : ''}
            {' '}• {searchParams.class.charAt(0).toUpperCase() + searchParams.class.slice(1)}
          </p>
        </div>

        {/* Search Summary & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="price">Sort by Price</option>
              <option value="duration">Sort by Duration</option>
              <option value="departure">Sort by Departure</option>
              <option value="arrival">Sort by Arrival</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-primary-50 border-primary-300' : ''}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          <div className="text-sm text-slate-500">
            {sortedFlights.length} flights found
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Airlines</label>
                    <div className="space-y-2">
                      {airlines.map(airline => (
                        <label key={airline.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.airlines.includes(airline.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({ ...filters, airlines: [...filters.airlines, airline.id] });
                              } else {
                                setFilters({ ...filters, airlines: filters.airlines.filter(id => id !== airline.id) });
                              }
                            }}
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm text-slate-600">{airline.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Max Price</label>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-sm text-slate-600 mt-1">{formatPrice(filters.maxPrice)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Departure Time</label>
                    <select
                      value={filters.departureTime}
                      onChange={(e) => setFilters({ ...filters, departureTime: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    >
                      <option value="all">Any Time</option>
                      <option value="morning">Morning (5AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 6PM)</option>
                      <option value="evening">Evening (6PM - 12AM)</option>
                      <option value="night">Night (12AM - 5AM)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Flight Results */}
        {sortedFlights.length === 0 ? (
          <Card className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Plane className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No flights found</h3>
            <p className="text-slate-600 mb-6">Try adjusting your search criteria or dates</p>
            <Button onClick={() => navigate('/')}>Modify Search</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedFlights.map((flight, index) => (
              <motion.div
                key={flight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card hover className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Airline Info */}
                        <div className="flex items-center gap-3 lg:w-48">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: flight.airline.color + '20' }}
                          >
                            {flight.airline.logo}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{flight.airline.name}</div>
                            <div className="text-sm text-slate-500">{flight.flightNumber}</div>
                          </div>
                        </div>

                        {/* Flight Times */}
                        <div className="flex-1 flex items-center justify-between gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">
                              {formatTime(flight.departureTime)}
                            </div>
                            <div className="text-sm text-slate-500">{flight.from.code}</div>
                          </div>
                          
                          <div className="flex-1 flex flex-col items-center px-4">
                            <div className="text-sm text-slate-500 mb-1">
                              {formatDuration(flight.duration)}
                            </div>
                            <div className="w-full h-px bg-slate-300 relative">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                                <Plane className="w-4 h-4 text-slate-400 rotate-90" />
                              </div>
                            </div>
                            <div className="text-xs text-slate-400 mt-1">Direct</div>
                          </div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold text-slate-900">
                              {formatTime(flight.arrivalTime)}
                            </div>
                            <div className="text-sm text-slate-500">{flight.to.code}</div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:w-48">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-600">
                              {formatPrice(flight.prices[searchParams.class])}
                            </div>
                            <div className="text-sm text-slate-500">per person</div>
                          </div>
                          <Button 
                            onClick={() => handleBookFlight(flight)}
                            disabled={flight.status === 'cancelled'}
                          >
                            {flight.status === 'cancelled' ? 'Unavailable' : 'Select'}
                          </Button>
                        </div>
                      </div>

                      {/* Flight Details */}
                      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-sm">
                        <Badge 
                          variant={flightStatus[flight.status]?.color || 'slate'}
                          size="sm"
                        >
                          {flightStatus[flight.status]?.label || flight.status}
                        </Badge>
                        <span className="text-slate-500">{flight.aircraft?.type || flight.aircraft?.model || ''}</span>
                        <span className="text-slate-500">
                          {flight.seats?.[searchParams.class]?.available ?? 'N/A'} seats available
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Flight Selection Modal */}
        <Modal
          isOpen={!!selectedFlight}
          onClose={() => setSelectedFlight(null)}
          title="Confirm Flight Selection"
          size="md"
          footer={
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={() => setSelectedFlight(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={confirmBooking}>
                Continue to Booking
              </Button>
            </div>
          }
        >
          {selectedFlight && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: selectedFlight.airline.color + '20' }}
                >
                  {selectedFlight.airline.logo}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{selectedFlight.airline.name}</div>
                  <div className="text-sm text-slate-500">{selectedFlight.flightNumber}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-4 border-y border-slate-100">
                <div className="text-center">
                  <div className="text-xl font-bold">{formatTime(selectedFlight.departureTime)}</div>
                  <div className="text-sm text-slate-500">{selectedFlight.from.code}</div>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <Plane className="w-5 h-5 text-slate-400 rotate-90" />
                  <div className="text-xs text-slate-400">{formatDuration(selectedFlight.duration)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{formatTime(selectedFlight.arrivalTime)}</div>
                  <div className="text-sm text-slate-500">{selectedFlight.to.code}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Fare ({searchParams.class})</span>
                  <span className="font-medium">{formatPrice(selectedFlight.prices[searchParams.class])}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Passengers</span>
                  <span className="font-medium">x {searchParams.passengers}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary-600">
                    {formatPrice(selectedFlight.prices[searchParams.class] * searchParams.passengers)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
