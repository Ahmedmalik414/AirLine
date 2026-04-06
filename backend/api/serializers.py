from rest_framework import serializers
from .models import Airport, Airline, Aircraft, Flight, Passenger, Booking


class AirportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airport
        fields = ['id', 'code', 'name', 'city', 'country']


class AirlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Airline
        fields = ['id', 'code', 'name', 'country']


class AircraftSerializer(serializers.ModelSerializer):
    airline = AirlineSerializer(read_only=True)
    
    class Meta:
        model = Aircraft
        fields = ['id', 'tail_number', 'airline', 'model', 'total_seats']


class FlightSerializer(serializers.ModelSerializer):
    airline = AirlineSerializer(read_only=True)
    departure_airport = AirportSerializer(read_only=True)
    arrival_airport = AirportSerializer(read_only=True)
    
    class Meta:
        model = Flight
        fields = [
            'id', 'flight_number', 'airline', 'departure_airport', 
            'arrival_airport', 'departure_time', 'arrival_time', 
            'duration', 'price_economy', 'price_business', 'status'
        ]



class PassengerSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Passenger
        fields = ['id', 'user', 'phone', 'passport_number']


class BookingSerializer(serializers.ModelSerializer):
    passenger = PassengerSerializer(read_only=True)
    flight = FlightSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'passenger', 'flight', 'booking_reference', 
            'cabin_class', 'seat_number', 'total_price', 'status', 'created_at'
        ]        


from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser']