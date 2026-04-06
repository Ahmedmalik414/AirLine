export const airlines = [
  { id: 1, name: 'Sky Airways', code: 'SA', logo: '✈️', color: '#1e3a8a' },
  { id: 2, name: 'Global Airlines', code: 'GA', logo: '🌐', color: '#0ea5e9' },
  { id: 3, name: 'Premium Fly', code: 'PF', logo: '💎', color: '#f59e0b' },
  { id: 4, name: 'Express Air', code: 'EA', logo: '⚡', color: '#10b981' },
  { id: 5, name: 'Luxury Jets', code: 'LJ', logo: '👑', color: '#8b5cf6' },
];

export const airports = [
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', timezone: 'America/New_York' },
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK', timezone: 'Europe/London' },
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', timezone: 'Europe/Berlin' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', timezone: 'Europe/Amsterdam' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { code: 'ORD', name: 'O\'Hare International', city: 'Chicago', country: 'USA', timezone: 'America/Chicago' },
  { code: 'DFW', name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', timezone: 'America/Chicago' },
  { code: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA', timezone: 'America/Denver' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA', timezone: 'America/New_York' },
];

export const aircraftTypes = [
  { type: 'Boeing 737-800', capacity: 160, classes: { economy: 120, business: 30, first: 10 } },
  { type: 'Boeing 777-300ER', capacity: 396, classes: { economy: 300, business: 70, first: 26 } },
  { type: 'Airbus A320', capacity: 150, classes: { economy: 120, business: 24, first: 6 } },
  { type: 'Airbus A350-900', capacity: 325, classes: { economy: 240, business: 70, first: 15 } },
  { type: 'Boeing 787-9', capacity: 290, classes: { economy: 210, business: 60, first: 20 } },
];

export const generateFlights = () => {
  const flights = [];
  const today = new Date();
  
  const routes = [
    { from: 'JFK', to: 'LHR', duration: 420 },
    { from: 'LHR', to: 'JFK', duration: 480 },
    { from: 'JFK', to: 'DXB', duration: 780 },
    { from: 'DXB', to: 'JFK', duration: 840 },
    { from: 'LHR', to: 'DXB', duration: 420 },
    { from: 'DXB', to: 'LHR', duration: 450 },
    { from: 'JFK', to: 'SIN', duration: 1080 },
    { from: 'SIN', to: 'JFK', duration: 1140 },
    { from: 'LHR', to: 'HND', duration: 720 },
    { from: 'HND', to: 'LHR', duration: 780 },
    { from: 'DXB', to: 'SIN', duration: 420 },
    { from: 'SIN', to: 'DXB', duration: 450 },
    { from: 'JFK', to: 'CDG', duration: 480 },
    { from: 'CDG', to: 'JFK', duration: 510 },
    { from: 'LAX', to: 'HND', duration: 720 },
    { from: 'HND', to: 'LAX', duration: 600 },
    { from: 'SIN', to: 'SYD', duration: 480 },
    { from: 'SYD', to: 'SIN', duration: 510 },
    { from: 'FRA', to: 'JFK', duration: 510 },
    { from: 'JFK', to: 'FRA', duration: 480 },
    { from: 'AMS', to: 'JFK', duration: 495 },
    { from: 'JFK', to: 'AMS', duration: 465 },
    { from: 'HKG', to: 'LHR', duration: 780 },
    { from: 'LHR', to: 'HKG', duration: 720 },
    { from: 'LAX', to: 'SYD', duration: 900 },
    { from: 'SYD', to: 'LAX', duration: 810 },
    { from: 'ORD', to: 'LHR', duration: 480 },
    { from: 'LHR', to: 'ORD', duration: 510 },
    { from: 'DFW', to: 'DXB', duration: 900 },
    { from: 'DXB', to: 'DFW', duration: 960 },
    { from: 'MIA', to: 'CDG', duration: 540 },
    { from: 'CDG', to: 'MIA', duration: 570 },
  ];

  let flightId = 1;
  
  for (let day = 0; day < 30; day++) {
    const date = new Date(today);
    date.setDate(date.getDate() + day);
    
    routes.forEach((route, routeIndex) => {
      airlines.forEach((airline, airlineIndex) => {
        const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
        const basePrice = 200 + Math.random() * 800;
        
        const departureTime = new Date(date);
        departureTime.setHours(6 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 60));
        
        const arrivalTime = new Date(departureTime);
        arrivalTime.setMinutes(arrivalTime.getMinutes() + route.duration);
        
        const economyPrice = Math.round(basePrice);
        const businessPrice = Math.round(basePrice * 2.5);
        const firstPrice = Math.round(basePrice * 5);
        
        const economyBooked = Math.floor(Math.random() * aircraft.classes.economy * 0.7);
        const businessBooked = Math.floor(Math.random() * aircraft.classes.business * 0.5);
        const firstBooked = Math.floor(Math.random() * aircraft.classes.first * 0.3);
        
        flights.push({
          id: flightId++,
          flightNumber: `${airline.code}${100 + Math.floor(Math.random() * 900)}`,
          airline: airline,
          from: airports.find(a => a.code === route.from),
          to: airports.find(a => a.code === route.to),
          departureTime: departureTime.toISOString(),
          arrivalTime: arrivalTime.toISOString(),
          duration: route.duration,
          aircraft: aircraft,
          prices: {
            economy: economyPrice,
            business: businessPrice,
            first: firstPrice,
          },
          seats: {
            economy: {
              total: aircraft.classes.economy,
              booked: economyBooked,
              available: aircraft.classes.economy - economyBooked,
            },
            business: {
              total: aircraft.classes.business,
              booked: businessBooked,
              available: aircraft.classes.business - businessBooked,
            },
            first: {
              total: aircraft.classes.first,
              booked: firstBooked,
              available: aircraft.classes.first - firstBooked,
            },
          },
          status: Math.random() > 0.9 ? (Math.random() > 0.5 ? 'delayed' : 'cancelled') : 'on_time',
        });
      });
    });
  }
  
  return flights;
};

export const flights = generateFlights();

export const mealOptions = [
  { id: 'standard', name: 'Standard Meal', description: 'Regular in-flight meal', price: 0 },
  { id: 'vegetarian', name: 'Vegetarian', description: 'Plant-based meal options', price: 0 },
  { id: 'vegan', name: 'Vegan', description: '100% plant-based meal', price: 0 },
  { id: 'halal', name: 'Halal', description: 'Prepared according to Islamic dietary laws', price: 0 },
  { id: 'kosher', name: 'Kosher', description: 'Prepared according to Jewish dietary laws', price: 0 },
  { id: 'gluten_free', name: 'Gluten Free', description: 'No gluten-containing ingredients', price: 0 },
  { id: 'child', name: 'Child Meal', description: 'Kid-friendly meal options', price: 0 },
  { id: 'premium', name: 'Premium Meal', description: 'Upgraded dining experience', price: 25 },
];

export const seatPreferences = [
  { id: 'window', name: 'Window', icon: '🪟', description: 'Enjoy the view' },
  { id: 'aisle', name: 'Aisle', icon: '🚶', description: 'Easy access' },
  { id: 'middle', name: 'Middle', icon: '🪑', description: 'Center seat' },
  { id: 'extra_legroom', name: 'Extra Legroom', icon: '🦵', description: 'More space' },
  { id: 'front', name: 'Front Row', icon: '➡️', description: 'First to exit' },
  { id: 'back', name: 'Back Row', icon: '⬅️', description: 'Near restrooms' },
];

export const bookingStatus = {
  confirmed: { label: 'Confirmed', color: 'success', icon: '✓' },
  pending: { label: 'Pending', color: 'warning', icon: '⏳' },
  cancelled: { label: 'Cancelled', color: 'danger', icon: '✕' },
  completed: { label: 'Completed', color: 'secondary', icon: '✓' },
};

export const flightStatus = {
  // Backend status values
  scheduled: { label: 'Scheduled', color: 'secondary', icon: '📅' },
  boarding: { label: 'Boarding', color: 'accent', icon: '🚀' },
  departed: { label: 'Departed', color: 'secondary', icon: '✈️' },
  in_air: { label: 'In Air', color: 'primary', icon: '✈️' },
  landed: { label: 'Landed', color: 'success', icon: '🛬' },
  arrived: { label: 'Arrived', color: 'success', icon: '🛬' },
  cancelled: { label: 'Cancelled', color: 'danger', icon: '✕' },
  delayed: { label: 'Delayed', color: 'warning', icon: '⏱' },
  // Legacy mock values
  on_time: { label: 'On Time', color: 'success', icon: '✓' },
};

export const paymentMethods = [
  { id: 'credit_card', name: 'Credit Card', icon: '💳' },
  { id: 'debit_card', name: 'Debit Card', icon: '💳' },
  { id: 'wallet', name: 'Digital Wallet', icon: '📱' },
];

export const sampleUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '+1-555-0123',
    passport: 'P12345678',
    role: 'passenger',
  },
  {
    id: 2,
    name: 'Admin User',
    email: 'admin@airline.com',
    password: 'admin123',
    phone: '+1-555-0199',
    passport: 'A99999999',
    role: 'admin',
  },
  {
    id: 3,
    name: 'Staff Member',
    email: 'staff@airline.com',
    password: 'staff123',
    phone: '+1-555-0188',
    passport: 'S88888888',
    role: 'staff',
  },
];

export const sampleBookings = [
  {
    id: 'BKABC123',
    userId: 1,
    flight: flights[0],
    passengers: [
      {
        name: 'John Doe',
        age: 30,
        passport: 'P12345678',
        seat: '12A',
        meal: 'standard',
      },
    ],
    class: 'economy',
    totalPrice: 450,
    status: 'confirmed',
    bookingDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    paymentStatus: 'paid',
  },
];
