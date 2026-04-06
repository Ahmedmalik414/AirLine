import { useState } from 'react';
import { useFlights } from '../../context/FlightContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { formatTime, formatDate, formatPrice } from '../../utils/formatters';
import { flightStatus } from '../../data/mockData';

export function AdminFlights() {
  const { flights, getAirports } = useFlights();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const airports = getAirports();

  const filteredFlights = flights.filter(flight => {
    const matchesSearch = 
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.airline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.from.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.to.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || flight.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }).slice(0, 50);

  const handleAddFlight = (e) => {
    e.preventDefault();
    // In a real app, this would add the flight
    setShowAddModal(false);
  };

  const handleEditFlight = (e) => {
    e.preventDefault();
    // In a real app, this would update the flight
    setEditingFlight(null);
  };

  const handleDeleteFlight = (flightId) => {
    if (confirm('Are you sure you want to delete this flight?')) {
      // In a real app, this would delete the flight
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Manage Flights</h1>
              <p className="text-slate-500">Add, edit, or remove flights</p>
            </div>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Flight
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search flights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="on_time">On Time</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Flights Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Flight</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Route</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Schedule</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Seats</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFlights.map((flight, index) => (
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
                        <div className="text-sm">
                          <div className="font-medium">{flight.from.code} → {flight.to.code}</div>
                          <div className="text-slate-500">{flight.from.city} to {flight.to.city}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div>{formatDate(flight.departureTime)}</div>
                          <div className="text-slate-500">
                            {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium">{formatPrice(flight.prices.economy)}</div>
                          <div className="text-slate-500 text-xs">Economy from</div>
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
                          E: {flight.seats.economy.available}/{flight.seats.economy.total}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingFlight(flight)}
                            className="p-2 rounded-lg hover:bg-slate-200 text-slate-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFlight(flight.id)}
                            className="p-2 rounded-lg hover:bg-danger-100 text-danger-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredFlights.length === 0 && (
              <div className="text-center py-12">
                <Plane className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No flights found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Flight Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Flight"
        size="lg"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAddFlight}>
              Add Flight
            </Button>
          </div>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="From Airport"
              options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))}
            />
            <Select
              label="To Airport"
              options={airports.map(a => ({ value: a.code, label: `${a.city} (${a.code})` }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Departure Date" type="datetime-local" />
            <Input label="Arrival Date" type="datetime-local" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Economy Price" type="number" placeholder="0.00" />
            <Input label="Business Price" type="number" placeholder="0.00" />
            <Input label="First Class Price" type="number" placeholder="0.00" />
          </div>
        </form>
      </Modal>

      {/* Edit Flight Modal */}
      <Modal
        isOpen={!!editingFlight}
        onClose={() => setEditingFlight(null)}
        title="Edit Flight"
        size="lg"
        footer={
          <div className="flex gap-3 w-full">
            <Button variant="outline" className="flex-1" onClick={() => setEditingFlight(null)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleEditFlight}>
              Save Changes
            </Button>
          </div>
        }
      >
        {editingFlight && (
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Status"
                options={[
                  { value: 'on_time', label: 'On Time' },
                  { value: 'delayed', label: 'Delayed' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'boarding', label: 'Boarding' },
                  { value: 'departed', label: 'Departed' },
                ]}
                value={editingFlight.status}
              />
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  Changing flight status will notify all affected passengers via email.
                </p>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
