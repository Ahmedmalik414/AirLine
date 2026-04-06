from django.core.management.base import BaseCommand
from api.models import Airport, Airline, Aircraft, Flight
from django.utils import timezone
from datetime import timedelta, datetime
import random
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seed 10 Islamic countries with 4 airports each, plus Airlines, Aircraft, and Flights'

    def handle(self, *args, **options):
        # 1. AIRPORTS
        data = [
            {'code': 'JED', 'name': 'King Abdulaziz International Airport', 'city': 'Jeddah', 'country': 'Saudi Arabia'},
            {'code': 'RUH', 'name': 'King Khalid International Airport', 'city': 'Riyadh', 'country': 'Saudi Arabia'},
            {'code': 'DMM', 'name': 'King Fahd International Airport', 'city': 'Dammam', 'country': 'Saudi Arabia'},
            {'code': 'MED', 'name': 'Prince Mohammad Bin Abdulaziz Airport', 'city': 'Medina', 'country': 'Saudi Arabia'},
            {'code': 'IKA', 'name': 'Imam Khomeini International Airport', 'city': 'Tehran', 'country': 'Iran'},
            {'code': 'THR', 'name': 'Tehran Mehrabad Airport', 'city': 'Tehran', 'country': 'Iran'},
            {'code': 'SYZ', 'name': 'Shiraz International Airport', 'city': 'Shiraz', 'country': 'Iran'},
            {'code': 'TBZ', 'name': 'Tabriz International Airport', 'city': 'Tabriz', 'country': 'Iran'},
            {'code': 'IST', 'name': 'Istanbul Airport', 'city': 'Istanbul', 'country': 'Turkey'},
            {'code': 'SAW', 'name': 'Sabiha Gökçen International Airport', 'city': 'Istanbul', 'country': 'Turkey'},
            {'code': 'ESB', 'name': 'Ankara Esenboğa Airport', 'city': 'Ankara', 'country': 'Turkey'},
            {'code': 'ADB', 'name': 'Adnan Menderes Airport', 'city': 'Izmir', 'country': 'Turkey'},
            {'code': 'CAI', 'name': 'Cairo International Airport', 'city': 'Cairo', 'country': 'Egypt'},
            {'code': 'HBE', 'name': 'Borg El Arab Airport', 'city': 'Alexandria', 'country': 'Egypt'},
            {'code': 'HRG', 'name': 'Hurghada International Airport', 'city': 'Hurghada', 'country': 'Egypt'},
            {'code': 'LXR', 'name': 'Luxor International Airport', 'city': 'Luxor', 'country': 'Egypt'},
            {'code': 'KHI', 'name': 'Jinnah International Airport', 'city': 'Karachi', 'country': 'Pakistan'},
            {'code': 'LHE', 'name': 'Allama Iqbal International Airport', 'city': 'Lahore', 'country': 'Pakistan'},
            {'code': 'ISB', 'name': 'Islamabad International Airport', 'city': 'Islamabad', 'country': 'Pakistan'},
            {'code': 'PEW', 'name': 'Peshawar International Airport', 'city': 'Peshawar', 'country': 'Pakistan'},
            {'code': 'CGK', 'name': 'Soekarno–Hatta International Airport', 'city': 'Jakarta', 'country': 'Indonesia'},
            {'code': 'DPS', 'name': 'Ngurah Rai International Airport', 'city': 'Denpasar', 'country': 'Indonesia'},
            {'code': 'KNO', 'name': 'Kualanamu International Airport', 'city': 'Medan', 'country': 'Indonesia'},
            {'code': 'BTH', 'name': 'Banda Aceh Airport', 'city': 'Banda Aceh', 'country': 'Indonesia'},
            {'code': 'KUL', 'name': 'Kuala Lumpur International Airport', 'city': 'Kuala Lumpur', 'country': 'Malaysia'},
            {'code': 'LGK', 'name': 'Langkawi International Airport', 'city': 'Langkawi', 'country': 'Malaysia'},
            {'code': 'PEN', 'name': 'Penang International Airport', 'city': 'Penang', 'country': 'Malaysia'},
            {'code': 'BKI', 'name': 'Kota Kinabalu International Airport', 'city': 'Kota Kinabalu', 'country': 'Malaysia'},
            {'code': 'DAC', 'name': 'Hazrat Shahjalal International Airport', 'city': 'Dhaka', 'country': 'Bangladesh'},
            {'code': 'CGP', 'name': 'Shah Amanat International Airport', 'city': 'Chittagong', 'country': 'Bangladesh'},
            {'code': 'ZYL', 'name': 'Sylhet International Airport', 'city': 'Sylhet', 'country': 'Bangladesh'},
            {'code': 'CXB', 'name': 'Coxs Bazar Airport', 'city': 'Coxs Bazar', 'country': 'Bangladesh'},
            {'code': 'DXB', 'name': 'Dubai International Airport', 'city': 'Dubai', 'country': 'UAE'},
            {'code': 'AUH', 'name': 'Abu Dhabi International Airport', 'city': 'Abu Dhabi', 'country': 'UAE'},
            {'code': 'SHJ', 'name': 'Sharjah International Airport', 'city': 'Sharjah', 'country': 'UAE'},
            {'code': 'DWC', 'name': 'Al Maktoum International Airport', 'city': 'Dubai', 'country': 'UAE'},
            {'code': 'DOH', 'name': 'Hamad International Airport', 'city': 'Doha', 'country': 'Qatar'},
            {'code': 'DIA', 'name': 'Doha International Airport', 'city': 'Doha', 'country': 'Qatar'},
            {'code': 'XJD', 'name': 'Al Khor Airport', 'city': 'Al Khor', 'country': 'Qatar'},
            {'code': 'RKT', 'name': 'Ras Al Khaimah Airport', 'city': 'Ras Al Khaimah', 'country': 'Qatar'},
        ]

        airports = []
        for entry in data:
            obj, _ = Airport.objects.get_or_create(**entry)
            airports.append(obj)
        self.stdout.write(self.style.SUCCESS(f"Airports verified: {len(airports)}"))

        # 2. AIRLINES
        airlines_data = [
            {'code': 'SV', 'name': 'Saudia', 'country': 'Saudi Arabia'},
            {'code': 'IR', 'name': 'Iran Air', 'country': 'Iran'},
            {'code': 'TK', 'name': 'Turkish Airlines', 'country': 'Turkey'},
            {'code': 'MS', 'name': 'Egyptair', 'country': 'Egypt'},
            {'code': 'PK', 'name': 'PIA', 'country': 'Pakistan'},
            {'code': 'GA', 'name': 'Garuda Indonesia', 'country': 'Indonesia'},
            {'code': 'MH', 'name': 'Malaysia Airlines', 'country': 'Malaysia'},
            {'code': 'BG', 'name': 'Biman Bangladesh', 'country': 'Bangladesh'},
            {'code': 'EK', 'name': 'Emirates', 'country': 'UAE'},
            {'code': 'QR', 'name': 'Qatar Airways', 'country': 'Qatar'},
        ]
        airlines = []
        for a_data in airlines_data:
            obj, _ = Airline.objects.get_or_create(code=a_data['code'], defaults={'name': a_data['name'], 'country': a_data['country']})
            airlines.append(obj)
        self.stdout.write(self.style.SUCCESS(f"Airlines verified: {len(airlines)}"))

        # 3. AIRCRAFT
        aircraft_list = []
        for _, al in enumerate(airlines):
            for i in range(2): # 2 planes per airline
                ac, _ = Aircraft.objects.get_or_create(
                    tail_number=f"{al.code}-{random.randint(100,999)}",
                    defaults={'airline': al, 'model': random.choice(['Boeing 777', 'Airbus A330', 'Boeing 787']), 'total_seats': random.randint(200, 350)}
                )
                aircraft_list.append(ac)
        self.stdout.write(self.style.SUCCESS(f"Aircraft verified: {len(aircraft_list)}"))

        # 4. FLIGHTS
        # Generate tons of flights for upcoming 30 days
        base_date = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        flight_count = 0
        
        for _ in range(500):
            dep_airport = random.choice(airports)
            arr_airport = random.choice([a for a in airports if a != dep_airport])
            airline = random.choice(airlines)
            aircraft = random.choice([ac for ac in aircraft_list if ac.airline == airline])
            if not aircraft:
                 aircraft = random.choice(aircraft_list)
            
            day_offset = random.randint(0, 30)
            dep_time = base_date + timedelta(days=day_offset, hours=random.randint(0,23), minutes=random.randint(0,59))
            dur_hours = random.randint(2, 8)
            arr_time = dep_time + timedelta(hours=dur_hours, minutes=random.randint(0,59))
            
            f_num = f"{airline.code}{random.randint(100, 9999)}"
            base_p = Decimal(str(random.uniform(200, 800))).quantize(Decimal('0.01'))
            bus_p = Decimal(str(float(base_p) * random.uniform(2.0, 3.5))).quantize(Decimal('0.01'))
            
            Flight.objects.get_or_create(
                flight_number=f_num,
                airline=airline,
                departure_airport=dep_airport,
                arrival_airport=arr_airport,
                aircraft=aircraft,
                departure_time=dep_time,
                arrival_time=arr_time,
                duration=timedelta(hours=dur_hours),
                price_economy=base_p,
                price_business=bus_p,
                status='scheduled'
            )
            flight_count += 1

        self.stdout.write(self.style.SUCCESS(f"Created {flight_count} flights across the Islamic Countries network"))
