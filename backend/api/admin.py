from django.contrib import admin
from .models import Airport, Airline, Aircraft, Flight, Passenger, Booking


@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'city', 'country']
    search_fields = ['code', 'name', 'city']


@admin.register(Airline)
class AirlineAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'country']
    search_fields = ['code', 'name']


@admin.register(Aircraft)
class AircraftAdmin(admin.ModelAdmin):
    list_display = ['tail_number', 'airline', 'model', 'total_seats']
    list_filter = ['airline']


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ['flight_number', 'departure_airport', 'arrival_airport', 'departure_time', 'status']
    list_filter = ['status', 'airline']
    search_fields = ['flight_number']


@admin.register(Passenger)
class PassengerAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'passport_number']
    search_fields = ['user__username', 'user__email']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_reference', 'passenger', 'flight', 'cabin_class', 'status', 'created_at']
    list_filter = ['status', 'cabin_class']
    search_fields = ['booking_reference', 'passenger__user__username']