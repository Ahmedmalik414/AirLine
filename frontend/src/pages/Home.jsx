import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlights } from '../context/FlightContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Plane, 
  Calendar, 
  Users, 
  ArrowRight, 
  Shield, 
  Clock, 
  Headphones,
  Star,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export function Home() {
  const navigate = useNavigate();
  const { searchParams, setSearchParams, airports, searchFlights } = useFlights();
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const airportOptions = airports.map(a => ({
    value: a.code,
    label: `${a.city} (${a.code}) - ${a.name}`,
  }));


  const classOptions = [
    { value: 'economy', label: 'Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' },
  ];

  const passengerOptions = Array.from({ length: 9 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} Passenger${i > 0 ? 's' : ''}`,
  }));

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchError('');
    const result = await searchFlights(searchParams);
    setIsSearching(false);
    if (result.success) {
      navigate('/flights');
    } else {
      setSearchError(result.error || 'Failed to search flights');
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your data is protected with industry-leading encryption',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all your travel needs',
    },
    {
      icon: Headphones,
      title: 'Best Price Guarantee',
      description: 'Find a lower price? We will match it instantly',
    },
  ];

  const popularDestinations = [
    { city: 'Paris', country: 'France', code: 'CDG', price: 450, image: '🗼' },
    { city: 'Tokyo', country: 'Japan', code: 'HND', price: 850, image: '🗾' },
    { city: 'Dubai', country: 'UAE', code: 'DXB', price: 650, image: '🏙️' },
    { city: 'London', country: 'UK', code: 'LHR', price: 380, image: '🏰' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-700">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {/* Animated Planes */}
        <motion.div
          className="absolute top-20 left-10 text-white/10"
          animate={{ x: [0, 100, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Plane className="w-32 h-32" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-20 text-white/10"
          animate={{ x: [0, -80, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Plane className="w-24 h-24" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
              ✈️ Welcome to SkyBooker
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-accent-300">
                Adventure
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Book flights to over 5,000 destinations worldwide. Best prices guaranteed with 24/7 support.
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="glass max-w-5xl mx-auto shadow-2xl">
              <form onSubmit={handleSearch} className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <div className="lg:col-span-2">
                    <Select
                      label="From"
                      options={airportOptions}
                      value={searchParams.from}
                      onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                      leftIcon={<MapPin className="w-5 h-5" />}
                      required
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Select
                      label="To"
                      options={airportOptions}
                      value={searchParams.to}
                      onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                      leftIcon={<MapPin className="w-5 h-5" />}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Departure"
                      type="date"
                      value={searchParams.departureDate}
                      onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
                      leftIcon={<Calendar className="w-5 h-5" />}
                      min={formatDate(new Date())}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Return (Optional)"
                      type="date"
                      value={searchParams.returnDate}
                      onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                      leftIcon={<Calendar className="w-5 h-5" />}
                      min={searchParams.departureDate}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Select
                      label="Passengers"
                      options={passengerOptions}
                      value={searchParams.passengers}
                      onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) })}
                      leftIcon={<Users className="w-5 h-5" />}
                    />
                  </div>
                  <div>
                    <Select
                      label="Class"
                      options={classOptions}
                      value={searchParams.class}
                      onChange={(e) => setSearchParams({ ...searchParams, class: e.target.value })}
                      leftIcon={<Star className="w-5 h-5" />}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    loading={isSearching}
                  >
                    <Plane className="w-5 h-5 mr-2" />
                    Search Flights
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose SkyBooker?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We make air travel simple, affordable, and enjoyable
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full text-center p-8 hover:shadow-card-hover transition-shadow">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-6 text-white">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Popular Destinations
              </h2>
              <p className="text-lg text-slate-600">
                Explore our most booked destinations
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/flights')}>
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, index) => (
              <motion.div
                key={dest.city}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  hover 
                  className="overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSearchParams({
                      ...searchParams,
                      to: dest.code,
                      departureDate: formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
                    });
                    navigate('/flights');
                  }}
                >
                  <div className="h-40 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-6xl">
                    {dest.image}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-slate-900">{dest.city}</h3>
                    <p className="text-slate-500 text-sm">{dest.country}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm text-slate-500">From</span>
                      <span className="text-xl font-bold text-primary-600">${dest.price}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Airlines' },
              { value: '5,000+', label: 'Destinations' },
              { value: '10M+', label: 'Happy Travelers' },
              { value: '24/7', label: 'Customer Support' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-white"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Take Off?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join millions of travelers who trust SkyBooker for their journeys. Sign up now and get exclusive deals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="accent"
                  onClick={() => navigate('/register')}
                >
                  Create Free Account
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate('/flights')}
                >
                  Browse Flights
                </Button>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/70">
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  No hidden fees
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Free cancellation
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Price match guarantee
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
