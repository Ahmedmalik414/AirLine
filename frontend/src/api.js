import axios from 'axios';

const API_URL = '/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('airline_user') || '{}');
    if (user.access) {
        config.headers.Authorization = `Bearer ${user.access}`;
    }
    return config;
});

export const authAPI = {
    register: (data) => api.post('auth/register/', data),
    login: (data) => api.post('auth/login/', data),
    logout: (refresh) => api.post('auth/logout/', { refresh }),
    getProfile: () => api.get('auth/profile/'),
    updateProfile: (data) => api.put('auth/profile/', data),
};

export const flightAPI = {
    searchFlights: (params) => api.get('flights/search/', { params }),
    getFlights: () => api.get('flights/'),
    getFlight: (id) => api.get(`flights/${id}/`),
};

export const bookingAPI = {
    createBooking: (data) => api.post('bookings/create/', data),
    getBookings: () => api.get('bookings/'),
    getBooking: (id) => api.get(`bookings/${id}/`),
    cancelBooking: (id) => api.delete(`bookings/${id}/`),
};

export const airportAPI = {
    getAirports: () => api.get('airports/'),
    getAirport: (id) => api.get(`airports/${id}/`),
};

export const airlineAPI = {
    getAirlines: () => api.get('airlines/'),
    getAirline: (id) => api.get(`airlines/${id}/`),
};

export default api;