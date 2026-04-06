from django.db import models


class Airport(models.Model):
    code = models.CharField(max_length=3, unique=True)
    name = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.name} ({self.code})"


class Airline(models.Model):
    code = models.CharField(max_length=2, unique=True)
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    
    def __str__(self):
        return f"{self.name} ({self.code})"        


class Aircraft(models.Model):
    tail_number = models.CharField(max_length=20, unique=True)
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='aircraft')
    model = models.CharField(max_length=100)
    total_seats = models.PositiveIntegerField()
    
    def __str__(self):
        return f"{self.airline.code} - {self.tail_number}"

class Flight(models.Model):
    flight_number = models.CharField(max_length=10)
    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='flights')
    departure_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='departures')
    arrival_airport = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='arrivals')
    aircraft = models.ForeignKey(Aircraft, on_delete=models.CASCADE, related_name='flights')
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    duration = models.DurationField()
    price_economy = models.DecimalField(max_digits=10, decimal_places=2)
    price_business = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[
            ('scheduled', 'Scheduled'),
            ('boarding', 'Boarding'),
            ('departed', 'Departed'),
            ('in_air', 'In Air'),
            ('landed', 'Landed'),
            ('arrived', 'Arrived'),
            ('cancelled', 'Cancelled'),
            ('delayed', 'Delayed'),
        ],
        default='scheduled'
    )
    
    def __str__(self):
        return f"{self.flight_number}: {self.departure_airport.code} → {self.arrival_airport.code}"

class Passenger(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='passenger_profile')
    phone = models.CharField(max_length=20)
    passport_number = models.CharField(max_length=50, blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"



class Booking(models.Model):
    passenger = models.ForeignKey(Passenger, on_delete=models.CASCADE, related_name='bookings')
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, related_name='bookings')
    booking_reference = models.CharField(max_length=10, unique=True)
    cabin_class = models.CharField(
        max_length=20,
        choices=[('economy', 'Economy'), ('business', 'Business')]
    )
    seat_number = models.CharField(max_length=10)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[
            ('confirmed', 'Confirmed'),
            ('pending', 'Pending'),
            ('cancelled', 'Cancelled'),
        ],
        default='confirmed'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.booking_reference} - {self.passenger}"        