from django.core.management.base import BaseCommand
from api.models import Airport, Airline, Aircraft, Flight, Passenger, Booking
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from decimal import Decimal
import random


class Command(BaseCommand):
    help = 'Seed the database with large amount of sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating airports...')
        
        airports_data = [
            {'code': 'JFK', 'name': 'John F. Kennedy International Airport', 'city': 'New York', 'country': 'USA'},
            {'code': 'LAX', 'name': 'Los Angeles International Airport', 'city': 'Los Angeles', 'country': 'USA'},
            {'code': 'ORD', 'name': "O'Hare International Airport", 'city': 'Chicago', 'country': 'USA'},
            {'code': 'MIA', 'name': 'Miami International Airport', 'city': 'Miami', 'country': 'USA'},
            {'code': 'SFO', 'name': 'San Francisco International Airport', 'city': 'San Francisco', 'country': 'USA'},
            {'code': 'SEA', 'name': 'Seattle-Tacoma International Airport', 'city': 'Seattle', 'country': 'USA'},
            {'code': 'BOS', 'name': 'Logan International Airport', 'city': 'Boston', 'country': 'USA'},
            {'code': 'LHR', 'name': 'Heathrow Airport', 'city': 'London', 'country': 'UK'},
            {'code': 'MAN', 'name': 'Manchester Airport', 'city': 'Manchester', 'country': 'UK'},
            {'code': 'CDG', 'name': 'Charles de Gaulle Airport', 'city': 'Paris', 'country': 'France'},
            {'code': 'ORY', 'name': 'Orly Airport', 'city': 'Paris', 'country': 'France'},
            {'code': 'FRA', 'name': 'Frankfurt Airport', 'city': 'Frankfurt', 'country': 'Germany'},
            {'code': 'MUC', 'name': 'Munich Airport', 'city': 'Munich', 'country': 'Germany'},
            {'code': 'AMS', 'name': 'Amsterdam Airport Schiphol', 'city': 'Amsterdam', 'country': 'Netherlands'},
            {'code': 'MAD', 'name': 'Adolfo Suárez Madrid-Barajas Airport', 'city': 'Madrid', 'country': 'Spain'},
            {'code': 'BCN', 'name': 'Barcelona-El Prat Airport', 'city': 'Barcelona', 'country': 'Spain'},
            {'code': 'FCO', 'name': 'Leonardo da Vinci-Fiumicino Airport', 'city': 'Rome', 'country': 'Italy'},
            {'code': 'DXB', 'name': 'Dubai International Airport', 'city': 'Dubai', 'country': 'UAE'},
            {'code': 'AUH', 'name': 'Abu Dhabi International Airport', 'city': 'Abu Dhabi', 'country': 'UAE'},
            {'code': 'HND', 'name': 'Tokyo Haneda Airport', 'city': 'Tokyo', 'country': 'Japan'},
            {'code': 'NRT', 'name': 'Narita International Airport', 'city': 'Tokyo', 'country': 'Japan'},
            {'code': 'KIX', 'name': 'Kansai International Airport', 'city': 'Osaka', 'country': 'Japan'},
            {'code': 'ICN', 'name': 'Incheon International Airport', 'city': 'Seoul', 'country': 'South Korea'},
            {'code': 'SIN', 'name': 'Singapore Changi Airport', 'city': 'Singapore', 'country': 'Singapore'},
            {'code': 'BKK', 'name': 'Suvarnabhumi Airport', 'city': 'Bangkok', 'country': 'Thailand'},
            {'code': 'SYD', 'name': 'Sydney Kingsford Smith Airport', 'city': 'Sydney', 'country': 'Australia'},
            {'code': 'MEL', 'name': 'Melbourne Airport', 'city': 'Melbourne', 'country': 'Australia'},
            {'code': 'YYZ', 'name': 'Toronto Pearson International Airport', 'city': 'Toronto', 'country': 'Canada'},
            {'code': 'YVR', 'name': 'Vancouver International Airport', 'city': 'Vancouver', 'country': 'Canada'},
            {'code': 'GRU', 'name': 'São Paulo/Guarulhos International Airport', 'city': 'São Paulo', 'country': 'Brazil'},
            {'code': 'TXL', 'name': 'Berlin Tegel Airport', 'city': 'Berlin', 'country': 'Germany'},
            {'code': 'BER', 'name': 'Berlin Brandenburg Airport', 'city': 'Berlin', 'country': 'Germany'},
            {'code': 'ZRH', 'name': 'Zurich Airport', 'city': 'Zurich', 'country': 'Switzerland'},
            {'code': 'VIE', 'name': 'Vienna International Airport', 'city': 'Vienna', 'country': 'Austria'},
            {'code': 'CPH', 'name': 'Copenhagen Airport', 'city': 'Copenhagen', 'country': 'Denmark'},
            {'code': 'ARN', 'name': 'Stockholm Arlanda Airport', 'city': 'Stockholm', 'country': 'Sweden'},
            {'code': 'OSL', 'name': 'Oslo Airport', 'city': 'Oslo', 'country': 'Norway'},
            {'code': 'HEL', 'name': 'Helsinki Airport', 'city': 'Helsinki', 'country': 'Finland'},
            {'code': 'DUB', 'name': 'Dublin Airport', 'city': 'Dublin', 'country': 'Ireland'},
            {'code': 'LIS', 'name': 'Lisbon Airport', 'city': 'Lisbon', 'country': 'Portugal'},
            {'code': 'ATH', 'name': 'Athens International Airport', 'city': 'Athens', 'country': 'Greece'},
            {'code': 'IST', 'name': 'Istanbul Airport', 'city': 'Istanbul', 'country': 'Turkey'},
            {'code': 'DOH', 'name': 'Hamad International Airport', 'city': 'Doha', 'country': 'Qatar'},
            {'code': 'BOM', 'name': 'Chhatrapati Shivaji Maharaj International Airport', 'city': 'Mumbai', 'country': 'India'},
            {'code': 'DEL', 'name': 'Indira Gandhi International Airport', 'city': 'Delhi', 'country': 'India'},
            {'code': 'PEK', 'name': 'Beijing Capital International Airport', 'city': 'Beijing', 'country': 'China'},
            {'code': 'PVG', 'name': 'Shanghai Pudong International Airport', 'city': 'Shanghai', 'country': 'China'},
            {'code': 'HKG', 'name': 'Hong Kong International Airport', 'city': 'Hong Kong', 'country': 'Hong Kong'},
            {'code': 'TPE', 'name': 'Taiwan Taoyuan International Airport', 'city': 'Taipei', 'country': 'Taiwan'},
            {'code': 'MNL', 'name': 'Ninoy Aquino International Airport', 'city': 'Manila', 'country': 'Philippines'},
            {'code': 'CGK', 'name': 'Soekarno-Hatta International Airport', 'city': 'Jakarta', 'country': 'Indonesia'},
            {'code': 'KUL', 'name': 'Kuala Lumpur International Airport', 'city': 'Kuala Lumpur', 'country': 'Malaysia'},
            {'code': 'MEX', 'name': 'Mexico City International Airport', 'city': 'Mexico City', 'country': 'Mexico'},
            {'code': 'EZE', 'name': 'Ezeiza International Airport', 'city': 'Buenos Aires', 'country': 'Argentina'},
            {'code': 'LIM', 'name': 'Jorge Chávez International Airport', 'city': 'Lima', 'country': 'Peru'},
            {'code': 'BOG', 'name': 'El Dorado International Airport', 'city': 'Bogotá', 'country': 'Colombia'},
            {'code': 'JNB', 'name': 'O.R. Tambo International Airport', 'city': 'Johannesburg', 'country': 'South Africa'},
            {'code': 'CAI', 'name': 'Cairo International Airport', 'city': 'Cairo', 'country': 'Egypt'},
            {'code': 'NBO', 'name': 'Jomo Kenyatta International Airport', 'city': 'Nairobi', 'country': 'Kenya'},
            # Pakistan Airports
            {'code': 'KHI', 'name': 'Jinnah International Airport', 'city': 'Karachi', 'country': 'Pakistan'},
            {'code': 'LHE', 'name': 'Allama Iqbal International Airport', 'city': 'Lahore', 'country': 'Pakistan'},
            {'code': 'ISB', 'name': 'Islamabad International Airport', 'city': 'Islamabad', 'country': 'Pakistan'},
            {'code': 'PEW', 'name': 'Peshawar International Airport', 'city': 'Peshawar', 'country': 'Pakistan'},
            {'code': 'QUA', 'name': 'Quetta International Airport', 'city': 'Quetta', 'country': 'Pakistan'},
            {'code': 'SKT', 'name': 'Sialkot International Airport', 'city': 'Sialkot', 'country': 'Pakistan'},
            {'code': 'MUX', 'name': 'Multan International Airport', 'city': 'Multan', 'country': 'Pakistan'},
            {'code': 'FSD', 'name': 'Faisalabad International Airport', 'city': 'Faisalabad', 'country': 'Pakistan'},
        ]
        
        for airport_data in airports_data:
            Airport.objects.get_or_create(**airport_data)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(airports_data)} airports'))
        
        self.stdout.write('Creating airlines...')
        
        airlines_data = [
            {'code': 'AA', 'name': 'American Airlines', 'country': 'USA'},
            {'code': 'DL', 'name': 'Delta Air Lines', 'country': 'USA'},
            {'code': 'UA', 'name': 'United Airlines', 'country': 'USA'},
            {'code': 'WN', 'name': 'Southwest Airlines', 'country': 'USA'},
            {'code': 'BA', 'name': 'British Airways', 'country': 'UK'},
            {'code': 'VS', 'name': 'Virgin Atlantic', 'country': 'UK'},
            {'code': 'AF', 'name': 'Air France', 'country': 'France'},
            {'code': 'LH', 'name': 'Lufthansa', 'country': 'Germany'},
            {'code': 'KL', 'name': 'KLM Royal Dutch Airlines', 'country': 'Netherlands'},
            {'code': 'IB', 'name': 'Iberia', 'country': 'Spain'},
            {'code': 'AZ', 'name': 'ITA Airways', 'country': 'Italy'},
            {'code': 'EK', 'name': 'Emirates', 'country': 'UAE'},
            {'code': 'EY', 'name': 'Etihad Airways', 'country': 'UAE'},
            {'code': 'QR', 'name': 'Qatar Airways', 'country': 'Qatar'},
            {'code': 'JL', 'name': 'Japan Airlines', 'country': 'Japan'},
            {'code': 'NH', 'name': 'All Nippon Airways', 'country': 'Japan'},
            {'code': 'KE', 'name': 'Korean Air', 'country': 'South Korea'},
            {'code': 'SQ', 'name': 'Singapore Airlines', 'country': 'Singapore'},
            {'code': 'TG', 'name': 'Thai Airways', 'country': 'Thailand'},
            {'code': 'QF', 'name': 'Qantas', 'country': 'Australia'},
            {'code': 'AC', 'name': 'Air Canada', 'country': 'Canada'},
            {'code': 'LA', 'name': 'LATAM Airlines', 'country': 'Chile'},
        ]
        
        for airline_data in airlines_data:
            Airline.objects.get_or_create(**airline_data)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(airlines_data)} airlines'))
        
        self.stdout.write('Creating aircraft...')
        
        airlines = list(Airline.objects.all())
        aircraft_models = [
            ('Boeing 737-800', 160),
            ('Boeing 737 MAX 8', 172),
            ('Airbus A320', 150),
            ('Airbus A320neo', 165),
            ('Airbus A321', 180),
            ('Airbus A321neo', 206),
            ('Boeing 777-200', 375),
            ('Boeing 777-300ER', 381),
            ('Airbus A330-300', 335),
            ('Airbus A350-900', 325),
            ('Boeing 787-8', 242),
            ('Boeing 787-9', 290),
            ('Airbus A380', 517),
            ('Boeing 747-8', 467),
        ]
        
        aircraft_count = 0
        for i in range(60):
            airline = airlines[i % len(airlines)]
            model_name, seats = aircraft_models[i % len(aircraft_models)]
            tail_number = f'{airline.code}{random.randint(1000, 9999)}'
            
            Aircraft.objects.get_or_create(
                tail_number=tail_number,
                defaults={
                    'airline': airline,
                    'model': model_name,
                    'total_seats': seats
                }
            )
            aircraft_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {aircraft_count} aircraft'))
        
        self.stdout.write('Creating flights...')
        
        airports = list(Airport.objects.all())
        aircraft_list = list(Aircraft.objects.all())
        flight_statuses = ['scheduled', 'boarding', 'departed', 'in_air', 'landed', 'arrived', 'cancelled', 'delayed']
        
        # Create popular route pairs to ensure good coverage
        popular_routes = [
            ('JFK', 'LHR'), ('JFK', 'CDG'), ('JFK', 'BER'), ('JFK', 'FCO'), ('JFK', 'MAD'),
            ('LAX', 'LHR'), ('LAX', 'CDG'), ('LAX', 'NRT'), ('LAX', 'ICN'), ('LAX', 'SYD'),
            ('LHR', 'CDG'), ('LHR', 'BER'), ('LHR', 'FCO'), ('LHR', 'DXB'), ('LHR', 'SIN'),
            ('CDG', 'BER'), ('CDG', 'FCO'), ('CDG', 'DXB'), ('CDG', 'BKK'), ('CDG', 'YUL'),
            ('DXB', 'BOM'), ('DXB', 'DEL'), ('DXB', 'SIN'), ('DXB', 'BKK'), ('DXB', 'LHR'),
            ('SIN', 'BKK'), ('SIN', 'HKG'), ('SIN', 'SYD'), ('SIN', 'NRT'), ('SIN', 'BOM'),
            ('FRA', 'BER'), ('FRA', 'MUC'), ('FRA', 'JFK'), ('FRA', 'DXB'), ('FRA', 'SIN'),
            ('AMS', 'LHR'), ('AMS', 'CDG'), ('AMS', 'JFK'), ('AMS', 'BKK'), ('AMS', 'SIN'),
            ('IST', 'LHR'), ('IST', 'FRA'), ('IST', 'DXB'), ('IST', 'JFK'), ('IST', 'SIN'),
            ('HND', 'LAX'), ('HND', 'JFK'), ('HND', 'LHR'), ('HND', 'SIN'), ('HND', 'SYD'),
            ('ORD', 'LHR'), ('ORD', 'FRA'), ('ORD', 'NRT'), ('ORD', 'PEK'), ('ORD', 'MEX'),
            ('MIA', 'LHR'), ('MIA', 'CDG'), ('MIA', 'GRU'), ('MIA', 'EZE'), ('MIA', 'MEX'),
            ('SFO', 'LHR'), ('SFO', 'CDG'), ('SFO', 'NRT'), ('SFO', 'HKG'), ('SFO', 'SYD'),
            ('YYZ', 'LHR'), ('YYZ', 'CDG'), ('YYZ', 'FRA'), ('YYZ', 'NRT'), ('YYZ', 'MEX'),
            ('SYD', 'LHR'), ('SYD', 'LAX'), ('SYD', 'NRT'), ('SYD', 'SIN'), ('SYD', 'HKG'),
            # Pakistan routes
            ('KHI', 'DXB'), ('KHI', 'LHR'), ('KHI', 'JFK'), ('KHI', 'BKK'), ('KHI', 'IST'),
            ('LHE', 'DXB'), ('LHE', 'LHR'), ('LHE', 'JFK'), ('LHE', 'BKK'), ('LHE', 'ISB'),
            ('ISB', 'DXB'), ('ISB', 'LHR'), ('ISB', 'JFK'), ('ISB', 'BKK'), ('ISB', 'PEW'),
            ('PEW', 'DXB'), ('PEW', 'KHI'), ('PEW', 'LHE'), ('PEW', 'ISB'),
        ]
        
        base_date = datetime.now()
        flight_count = 0
        
        # Generate flights for popular routes
        for day_offset in range(7):
            current_date = base_date + timedelta(days=day_offset)
            
            # Add popular routes
            for origin_code, dest_code in popular_routes:
                departure_airport = next((a for a in airports if a.code == origin_code), None)
                arrival_airport = next((a for a in airports if a.code == dest_code), None)
                
                if not departure_airport or not arrival_airport:
                    continue
                
                airline = random.choice(airlines)
                aircraft = random.choice(aircraft_list)
                
                # Calculate realistic duration based on distance (simplified)
                duration_hours = random.randint(2, 16)
                departure_time = current_date.replace(
                    hour=random.randint(6, 22),
                    minute=random.choice([0, 15, 30, 45])
                )
                arrival_time = departure_time + timedelta(hours=duration_hours)
                
                # Generate unique flight number
                flight_number = f'{airline.code}{random.randint(100, 9999)}'
                
                # Realistic pricing based on route length
                base_price = random.uniform(200, 1200)
                price_economy = Decimal(str(base_price)).quantize(Decimal('0.01'))
                price_business = Decimal(str(base_price * random.uniform(2.5, 4))).quantize(Decimal('0.01'))
                
                Flight.objects.create(
                    flight_number=flight_number,
                    airline=airline,
                    departure_airport=departure_airport,
                    arrival_airport=arrival_airport,
                    aircraft=aircraft,
                    departure_time=departure_time,
                    arrival_time=arrival_time,
                    duration=timedelta(hours=duration_hours),
                    price_economy=price_economy,
                    price_business=price_business,
                    status='scheduled' if day_offset >= 3 else random.choice(flight_statuses)
                )
                flight_count += 1
            
            # Add some random routes too
            for _ in range(100):
                departure_airport = random.choice(airports)
                arrival_airport = random.choice([a for a in airports if a != departure_airport])
                airline = random.choice(airlines)
                aircraft = random.choice(aircraft_list)
                
                duration_hours = random.randint(1, 16)
                departure_time = current_date.replace(
                    hour=random.randint(6, 22),
                    minute=random.choice([0, 15, 30, 45])
                )
                arrival_time = departure_time + timedelta(hours=duration_hours)
                
                flight_number = f'{airline.code}{random.randint(100, 9999)}'
                price_economy = Decimal(str(random.uniform(150, 1500))).quantize(Decimal('0.01'))
                price_business = Decimal(str(random.uniform(800, 5000))).quantize(Decimal('0.01'))
                
                Flight.objects.create(
                    flight_number=flight_number,
                    airline=airline,
                    departure_airport=departure_airport,
                    arrival_airport=arrival_airport,
                    aircraft=aircraft,
                    departure_time=departure_time,
                    arrival_time=arrival_time,
                    duration=timedelta(hours=duration_hours),
                    price_economy=price_economy,
                    price_business=price_business,
                    status='scheduled' if day_offset >= 3 else random.choice(flight_statuses)
                )
                flight_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {flight_count} flights'))
        
        self.stdout.write('Creating users and passengers...')
        
        first_names = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 
                      'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
                      'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Lisa', 'Daniel', 'Nancy',
                      'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
                      'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
                      'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
                      'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca', 'Jason', 'Sharon']
        
        last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
                     'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
                     'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
                     'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
                     'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
                     'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell']
        
        passenger_count = 0
        for i in range(100):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            email = f'{first_name.lower()}.{last_name.lower()}{i}@email.com'
            
            user, created = User.objects.get_or_create(
                username=email,
                defaults={
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'password': 'pbkdf2_sha256$600000$dummy$hash='
                }
            )
            
            if created:
                Passenger.objects.create(
                    user=user,
                    phone=f'+1-{random.randint(200, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}',
                    passport_number=f'{random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ")}{random.randint(100000000, 999999999)}'
                )
                passenger_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {passenger_count} passengers'))
        
        self.stdout.write('Creating bookings...')
        
        passengers = list(Passenger.objects.all())
        flights = list(Flight.objects.all())
        cabin_classes = ['economy', 'business']
        booking_statuses = ['confirmed', 'pending', 'cancelled']
        
        booking_count = 0
        for i in range(200):
            passenger = random.choice(passengers)
            flight = random.choice(flights)
            cabin_class = random.choice(cabin_classes)
            
            seat_letter = random.choice(['A', 'B', 'C', 'D', 'E', 'F'])
            seat_number = f'{random.randint(1, 35)}{seat_letter}'
            
            price = float(flight.price_economy) if cabin_class == 'economy' else float(flight.price_business)
            total_price = Decimal(str(price * random.uniform(0.9, 1.1))).quantize(Decimal('0.01'))
            
            booking_reference = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=8))
            
            Booking.objects.get_or_create(
                booking_reference=booking_reference,
                defaults={
                    'passenger': passenger,
                    'flight': flight,
                    'cabin_class': cabin_class,
                    'seat_number': seat_number,
                    'total_price': total_price,
                    'status': random.choice(booking_statuses)
                }
            )
            booking_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {booking_count} bookings'))
        
        self.stdout.write(self.style.SUCCESS('\n✅ Successfully seeded large dataset!'))
        self.stdout.write(self.style.SUCCESS(f'\n📊 Summary:'))
        self.stdout.write(self.style.SUCCESS(f'   - 30 Airports'))
        self.stdout.write(self.style.SUCCESS(f'   - 22 Airlines'))
        self.stdout.write(self.style.SUCCESS(f'   - 60 Aircraft'))
        self.stdout.write(self.style.SUCCESS(f'   - ~350 Flights (7 days)'))
        self.stdout.write(self.style.SUCCESS(f'   - 100 Passengers'))
        self.stdout.write(self.style.SUCCESS(f'   - 200 Bookings'))
        self.stdout.write(self.style.WARNING('\n🌐 View your API endpoints:'))
        self.stdout.write(self.style.WARNING('   - http://127.0.0.1:8000/api/airports/'))
        self.stdout.write(self.style.WARNING('   - http://127.0.0.1:8000/api/flights/'))
        self.stdout.write(self.style.WARNING('   - http://127.0.0.1:8000/api/bookings/'))
