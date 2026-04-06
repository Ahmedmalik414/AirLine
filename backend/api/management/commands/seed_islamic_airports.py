from django.core.management.base import BaseCommand
from api.models import Airport

class Command(BaseCommand):
    help = 'Seed 10 Islamic countries with 4 airports each'

    def handle(self, *args, **options):
        # Define 10 Islamic countries and 4 major airports per country
        data = [
            # Saudi Arabia
            {'code': 'JED', 'name': 'King Abdulaziz International Airport', 'city': 'Jeddah', 'country': 'Saudi Arabia'},
            {'code': 'RUH', 'name': 'King Khalid International Airport', 'city': 'Riyadh', 'country': 'Saudi Arabia'},
            {'code': 'DMM', 'name': 'King Fahd International Airport', 'city': 'Dammam', 'country': 'Saudi Arabia'},
            {'code': 'MED', 'name': 'Prince Mohammad Bin Abdulaziz Airport', 'city': 'Medina', 'country': 'Saudi Arabia'},
            # Iran
            {'code': 'IKA', 'name': 'Imam Khomeini International Airport', 'city': 'Tehran', 'country': 'Iran'},
            {'code': 'THR', 'name': 'Tehran Mehrabad Airport', 'city': 'Tehran', 'country': 'Iran'},
            {'code': 'SYZ', 'name': 'Shiraz International Airport', 'city': 'Shiraz', 'country': 'Iran'},
            {'code': 'TBZ', 'name': 'Tabriz International Airport', 'city': 'Tabriz', 'country': 'Iran'},
            # Turkey
            {'code': 'IST', 'name': 'Istanbul Airport', 'city': 'Istanbul', 'country': 'Turkey'},
            {'code': 'SAW', 'name': 'Sabiha Gökçen International Airport', 'city': 'Istanbul', 'country': 'Turkey'},
            {'code': 'ESB', 'name': 'Ankara Esenboğa Airport', 'city': 'Ankara', 'country': 'Turkey'},
            {'code': 'ADB', 'name': 'Adnan Menderes Airport', 'city': 'Izmir', 'country': 'Turkey'},
            # Egypt
            {'code': 'CAI', 'name': 'Cairo International Airport', 'city': 'Cairo', 'country': 'Egypt'},
            {'code': 'HBE', 'name': 'Hurghada International Airport', 'city': 'Hurghada', 'country': 'Egypt'},
            {'code': 'HRG', 'name': 'Hurghada International Airport', 'city': 'Hurghada', 'country': 'Egypt'},
            {'code': 'MUC', 'name': 'Marsa Alam Airport', 'city': 'Marsa Alam', 'country': 'Egypt'},
            # Pakistan (already partially present but we add 4 distinct)
            {'code': 'KHI', 'name': 'Jinnah International Airport', 'city': 'Karachi', 'country': 'Pakistan'},
            {'code': 'LHE', 'name': 'Allama Iqbal International Airport', 'city': 'Lahore', 'country': 'Pakistan'},
            {'code': 'ISB', 'name': 'Islamabad International Airport', 'city': 'Islamabad', 'country': 'Pakistan'},
            {'code': 'PEW', 'name': 'Peshawar International Airport', 'city': 'Peshawar', 'country': 'Pakistan'},
            # Indonesia
            {'code': 'CGK', 'name': 'Soekarno–Hatta International Airport', 'city': 'Jakarta', 'country': 'Indonesia'},
            {'code': 'DPS', 'name': 'Ngurah Rai International Airport', 'city': 'Denpasar', 'country': 'Indonesia'},
            {'code': 'KNO', 'name': 'Kualanamu International Airport', 'city': 'Medan', 'country': 'Indonesia'},
            {'code': 'BTH', 'name': 'Banda Aceh Airport', 'city': 'Banda Aceh', 'country': 'Indonesia'},
            # Malaysia
            {'code': 'KUL', 'name': 'Kuala Lumpur International Airport', 'city': 'Kuala Lumpur', 'country': 'Malaysia'},
            {'code': 'LGK', 'name': 'Langkawi International Airport', 'city': 'Langkawi', 'country': 'Malaysia'},
            {'code': 'PEN', 'name': 'Penang International Airport', 'city': 'Penang', 'country': 'Malaysia'},
            {'code': 'BKI', 'name': 'Kota Kinabalu International Airport', 'city': 'Kota Kinabalu', 'country': 'Malaysia'},
            # Bangladesh
            {'code': 'DAC', 'name': 'Hazrat Shahjalal International Airport', 'city': 'Dhaka', 'country': 'Bangladesh'},
            {'code': 'CGP', 'name': 'Shah Amanat International Airport', 'city': 'Chittagong', 'country': 'Bangladesh'},
            {'code': 'ZYL', 'name': 'Sylhet International Airport', 'city': 'Sylhet', 'country': 'Bangladesh'},
            {'code': 'IRD', 'name': 'Ishwardi Airport', 'city': 'Ishwardi', 'country': 'Bangladesh'},
            # United Arab Emirates
            {'code': 'DXB', 'name': 'Dubai International Airport', 'city': 'Dubai', 'country': 'UAE'},
            {'code': 'AUH', 'name': 'Abu Dhabi International Airport', 'city': 'Abu Dhabi', 'country': 'UAE'},
            {'code': 'SHJ', 'name': 'Sharjah International Airport', 'city': 'Sharjah', 'country': 'UAE'},
            {'code': 'RAK', 'name': 'Ras Al Khaimah Airport', 'city': 'Ras Al Khaimah', 'country': 'UAE'},
            # Qatar
            {'code': 'DOH', 'name': 'Hamad International Airport', 'city': 'Doha', 'country': 'Qatar'},
            {'code': 'RAK', 'name': 'Ras Al Khaimah Airport', 'city': 'Ras Al Khaimah', 'country': 'Qatar'},
            {'code': 'MCT', 'name': 'Doha International Airport (old)', 'city': 'Doha', 'country': 'Qatar'},
            {'code': 'LFI', 'name': 'Al Udeid Air Base', 'city': 'Doha', 'country': 'Qatar'},
        ]

        created = 0
        for entry in data:
            obj, was_created = Airport.objects.get_or_create(**entry)
            if was_created:
                created += 1
                self.stdout.write(self.style.SUCCESS(f"Created airport {obj.code} - {obj.city}"))
            else:
                self.stdout.write(f"Airport {obj.code} already exists")
        self.stdout.write(self.style.SUCCESS(f"Total new airports added: {created}"))
