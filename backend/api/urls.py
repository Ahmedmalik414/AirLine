from django.urls import path
from .views import (
    AirportList, AirportDetail,
    AirlineList, AirlineDetail,
    AircraftList, AircraftDetail,
    FlightList, FlightDetail,
    PassengerList, PassengerDetail,
    BookingList, BookingDetail,
    FlightSearch,
    RegisterView, LoginView, LogoutView, ProfileView, CreateBooking
)


urlpatterns = [


    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),

    path('flights/search/', FlightSearch.as_view(), name='flight-search'),

    path('bookings/create/', CreateBooking.as_view(), name='create-booking'),

    path('airports/', AirportList.as_view(), name='airport-list'),
    path('airports/<int:pk>/', AirportDetail.as_view(), name='airport-detail'),
    
    path('airlines/', AirlineList.as_view(), name='airline-list'),
    path('airlines/<int:pk>/', AirlineDetail.as_view(), name='airline-detail'),
    
    path('aircraft/', AircraftList.as_view(), name='aircraft-list'),
    path('aircraft/<int:pk>/', AircraftDetail.as_view(), name='aircraft-detail'),
    
    path('flights/', FlightList.as_view(), name='flight-list'),
    path('flights/<int:pk>/', FlightDetail.as_view(), name='flight-detail'),
    
    path('passengers/', PassengerList.as_view(), name='passenger-list'),
    path('passengers/<int:pk>/', PassengerDetail.as_view(), name='passenger-detail'),
    
    path('bookings/', BookingList.as_view(), name='booking-list'),
    path('bookings/<int:pk>/', BookingDetail.as_view(), name='booking-detail'),
]