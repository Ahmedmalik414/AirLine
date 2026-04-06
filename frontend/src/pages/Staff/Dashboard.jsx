import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFlights } from '../../context/FlightContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Plane, 
  Users, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit3,
  Eye
} from 'lucide-react';
import { formatTime, formatDate, formatDuration } from '../../utils/formatters';
import { flightStatus } from '../../data/mockData';

export function StaffDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { flights } = useFlights();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showPassengersModal, setShowPassengersModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Get today's flights
  const today = new Date().toDateString();
  const todaysFlights = flights.filter(f => 
    new Date(f.departureTime).toDateString() === today
  ).slice(0, 10);

  const handleUpdateStatus = () => {
    // In a real app, this would update the flight status
    setShowUpdateStatusModal(false);
    setSelectedFlight(null);
  };

  const stats = [
    { title: "Today's Flights", value: todaysFlights.length, icon: Plane, color: 'primary' },
    { title: 'On Time', value: todaysFlights.filter(f => f.status === 'on_time').length, icon: CheckCircle, color: 'success' },
    { title: 'Delayed', value: todaysFlights.filter(f => f.status === 'delayed').length, icon: Clock, color: 'warning' },
    { title: 'Cancelled', value: todaysFlights.filter(f => f.status === 'cancelled').length, icon: XCircle, color: 'danger' },
  ];

  // Mock passenger list
  const mockPassengers = [
    { name: 'John Doe', seat: '12A', class: 'Economy', checkIn: true },
    { name: 'Jane Smith', seat: '12B', class: 'Economy', checkIn: false },
    { name: 'Bob Johnson', seat: '5A', class: 'Business', checkIn: true },
    { name: 'Alice Brown', seat: '5B', class: 'Business', checkIn: true },
    { name: 'Charlie Wilson', seat: '1A', class: 'First', checkIn: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Staff Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Staff Dashboard</h1>
              <p className="text-slate-500">Welcome back, {user?.name}</p>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Airline Staff
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Today's Flights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today's Flights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Flight</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Route</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Passengers</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysFlights.map((flight, index) => (
                    <motion.tr
                      key={flight.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                            style={{ backgroundColor: flight.airline.color + '20' }}
                          >
                            {flight.airline.logo}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{flight.flightNumber}</div>
                            <div className="text-sm text-slate-500">{flight.airline.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium">
                          {flight.from.code} → {flight.to.code}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          {formatTime(flight.departureTime)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant={flightStatus[flight.status]?.color || 'slate'}
                          size="sm"
                        >
                          {flightStatus[flight.status]?.label || flight.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-slate-600">
                          {flight.seats.economy.booked + flight.seats.business.booked + flight.seats.first.booked}
                          {' / '}
                          {flight.aircraft.capacity}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedFlight(flight);
                              setShowPassengersModal(true);
                            }}
                            className="p-2 rounded-lg hover:bg-slate-200 text-slate-600"
                            title="View Passengers"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedFlight(flight);
                              setNewStatus(flight.status);
                              setShowUpdateStatusModal(true);
                            }}
                            className="p-2 rounded-lg hover:bg-primary-100 text-primary-600"
                            title="Update Status"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {todaysFlights.length === 0 && (
              <div className="text-center py-12">
                <Plane className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No flights scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Passengers Modal */}
      <Modal
        isOpen={showPassengersModal}
        onClose={() => setShowPassengersModal(false)}
        title={`Passengers - ${selectedFlight?.flightNumber}`}
        size="lg"
      >
        {selectedFlight && (
          <div>
            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{selectedFlight.from.code} → {selectedFlight.to.code}</div>
                  <div className="text-sm text-slate-500">
                    {formatDate(selectedFlight.departureTime)} {formatTime(selectedFlight.departureTime)}
                  </div>
                </div>
                <Badge variant={flightStatus[selectedFlight.status]?.color || 'slate'}>
                  {flightStatus[selectedFlight.status]?.label || selectedFlight.status}
                </Badge>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-2 px-4 text-sm font-medium text-slate-500">Passenger</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-slate-500">Seat</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-slate-500">Class</th>
                  <th className="text-left py-2 px-4 text-sm font-medium text-slate-500">Check-in</th>
                </tr>
              </thead>
              <tbody>
                {mockPassengers.map((passenger, index) => (
                  <tr key={index} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 px-4">{passenger.name}</td>
                    <td className="py-3 px-4 font-mono">{passenger.seat}</td>
                    <td className="py-3 px-4">
                      <Badge size="sm" variant={
                        passenger.class === 'First' ? 'accent' :
                        passenger.class === 'Business' ? 'secondary' : 'slate'
                      }>
                        {passenger.class}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {passenger.checkIn ? (
                        <span className="flex items-center gap-1 text-success-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Checked In
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-400 text-sm">
                          <XCircle className="w-4 h-4" />
                          Not Checked In
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={showUpdateStatusModal}
        onClose={() => setShowUpdateStatusModal(false)}
        title="Update Flight Status"
        size="md"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setShowUpdateStatusModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </div>
        }
      >
        {selectedFlight && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="font-medium">{selectedFlight.flightNumber}</div>
              <div className="text-sm text-slate-500">
                {selectedFlight.from.code} → {selectedFlight.to.code}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="on_time">On Time</option>
                <option value="delayed">Delayed</option>
                <option value="boarding">Boarding</option>
                <option value="departed">Departed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  This will notify all passengers of the status change via email and SMS.
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
