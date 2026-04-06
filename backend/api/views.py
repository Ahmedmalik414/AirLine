from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .models import Airport, Airline, Aircraft, Flight, Passenger, Booking
from .serializers import (
    AirportSerializer, AirlineSerializer, AircraftSerializer,
    FlightSerializer, PassengerSerializer, BookingSerializer,
    RegisterSerializer, UserSerializer,
)

from django.utils import timezone
from datetime import datetime
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from typing import cast


class AirportList(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        airports = Airport.objects.all()
        serializer = AirportSerializer(airports, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = AirportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AirportDetail(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            airport = Airport.objects.get(pk=pk)
            serializer = AirportSerializer(airport)
            return Response(serializer.data)
        except Airport.DoesNotExist:
            return Response({'error': 'Airport not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        try:
            airport = Airport.objects.get(pk=pk)
            serializer = AirportSerializer(airport, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Airport.DoesNotExist:
            return Response({'error': 'Airport not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            airport = Airport.objects.get(pk=pk)
            airport.delete()
            return Response({'message': 'Airport deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Airport.DoesNotExist:
            return Response({'error': 'Airport not found'}, status=status.HTTP_404_NOT_FOUND)


class AirlineList(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        airlines = Airline.objects.all()
        serializer = AirlineSerializer(airlines, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = AirlineSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AirlineDetail(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            airline = Airline.objects.get(pk=pk)
            serializer = AirlineSerializer(airline)
            return Response(serializer.data)
        except Airline.DoesNotExist:
            return Response({'error': 'Airline not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        try:
            airline = Airline.objects.get(pk=pk)
            serializer = AirlineSerializer(airline, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Airline.DoesNotExist:
            return Response({'error': 'Airline not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            airline = Airline.objects.get(pk=pk)
            airline.delete()
            return Response({'message': 'Airline deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Airline.DoesNotExist:
            return Response({'error': 'Airline not found'}, status=status.HTTP_404_NOT_FOUND)



class AircraftList(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        aircraft = Aircraft.objects.all()
        serializer = AircraftSerializer(aircraft, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = AircraftSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AircraftDetail(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            aircraft = Aircraft.objects.get(pk=pk)
            serializer = AircraftSerializer(aircraft)
            return Response(serializer.data)
        except Aircraft.DoesNotExist:
            return Response({'error': 'Aircraft not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        try:
            aircraft = Aircraft.objects.get(pk=pk)
            serializer = AircraftSerializer(aircraft, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Aircraft.DoesNotExist:
            return Response({'error': 'Aircraft not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            aircraft = Aircraft.objects.get(pk=pk)
            aircraft.delete()
            return Response({'message': 'Aircraft deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Aircraft.DoesNotExist:
            return Response({'error': 'Aircraft not found'}, status=status.HTTP_404_NOT_FOUND)


class FlightList(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        flights = Flight.objects.all()
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = FlightSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FlightDetail(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            flight = Flight.objects.get(pk=pk)
            serializer = FlightSerializer(flight)
            return Response(serializer.data)
        except Flight.DoesNotExist:
            return Response({'error': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        try:
            flight = Flight.objects.get(pk=pk)
            serializer = FlightSerializer(flight, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Flight.DoesNotExist:
            return Response({'error': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            flight = Flight.objects.get(pk=pk)
            flight.delete()
            return Response({'message': 'Flight deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Flight.DoesNotExist:
            return Response({'error': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)


class PassengerList(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        passengers = Passenger.objects.all()
        serializer = PassengerSerializer(passengers, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = PassengerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PassengerDetail(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            passenger = Passenger.objects.get(pk=pk)
            serializer = PassengerSerializer(passenger)
            return Response(serializer.data)
        except Passenger.DoesNotExist:
            return Response({'error': 'Passenger not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        try:
            passenger = Passenger.objects.get(pk=pk)
            serializer = PassengerSerializer(passenger, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Passenger.DoesNotExist:
            return Response({'error': 'Passenger not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            passenger = Passenger.objects.get(pk=pk)
            passenger.delete()
            return Response({'message': 'Passenger deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Passenger.DoesNotExist:
            return Response({'error': 'Passenger not found'}, status=status.HTTP_404_NOT_FOUND)


class BookingList(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        # If authenticated, return only this user's bookings
        if request.user and request.user.is_authenticated:
            try:
                passenger = Passenger.objects.get(user=request.user)
                bookings = Booking.objects.filter(passenger=passenger).select_related(
                    'passenger__user', 'flight__airline',
                    'flight__departure_airport', 'flight__arrival_airport'
                ).order_by('-created_at')
            except Passenger.DoesNotExist:
                bookings = Booking.objects.none()
        else:
            bookings = Booking.objects.none()
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingDetail(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            serializer = BookingSerializer(booking)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            serializer = BookingSerializer(booking, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            # Soft-cancel instead of hard-delete so history is preserved
            booking.status = 'cancelled'
            booking.save()
            return Response({'message': 'Booking cancelled successfully'}, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

class CreateBooking(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        import random
        import string
        
        try:
            flight_id = request.data.get('flight')
            cabin_class = request.data.get('cabin_class', 'economy')
            seat_number = request.data.get('seat_number')
            
            if not flight_id or not seat_number:
                return Response(
                    {'error': 'Flight and seat number are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            flight = Flight.objects.get(id=flight_id)
            
            # Resolve passenger from the authenticated user
            if request.user and request.user.is_authenticated:
                passenger, _ = Passenger.objects.get_or_create(
                    user=request.user,
                    defaults={'phone': '', 'passport_number': ''}
                )
            else:
                # Fallback: try explicit passenger id (admin use-case)
                passenger_id = request.data.get('passenger')
                if not passenger_id:
                    return Response(
                        {'error': 'Authentication required to book a flight'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                passenger = Passenger.objects.get(id=passenger_id)
            
            # Check if seat is already taken
            existing_booking = Booking.objects.filter(
                flight=flight,
                seat_number=seat_number,
                status='confirmed'
            ).exists()
            
            if existing_booking:
                # Auto-generate a different seat
                import random as rnd
                seat_number = ''.join([str(rnd.randint(1, 30)), rnd.choice('ABCDEF')])
            
            # Calculate price based on cabin class
            price = flight.price_economy if cabin_class == 'economy' else flight.price_business
            
            # Generate booking reference
            booking_reference = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            
            booking = Booking.objects.create(
                passenger=passenger,
                flight=flight,
                cabin_class=cabin_class,
                seat_number=seat_number,
                total_price=price,
                status='confirmed',
                booking_reference=booking_reference
            )
            
            serializer = BookingSerializer(booking)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Flight.DoesNotExist:
            return Response({'error': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)
        except Passenger.DoesNotExist:
            return Response({'error': 'Passenger not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = cast(User, serializer.save())
            
            # Create passenger profile for new user
            Passenger.objects.create(
                user=user,
                phone=request.data.get('phone', ''),
                passport_number=request.data.get('passport', '')
            )
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Authenticate using username (email is used as username in our system)
        user = cast(User | None, authenticate(request, username=email, password=password))
        
        if user is not None:
            login(request, user)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Login successful'
            })
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            logout(request)
            return Response({'message': 'Logout successful'})
        except Exception as e:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(UserSerializer(request.user).data)
    
    def put(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





class FlightSearch(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        origin = request.query_params.get('origin')
        destination = request.query_params.get('destination')
        departure_date = request.query_params.get('departure_date')
        
        flights = Flight.objects.select_related(
            'airline', 'departure_airport', 'arrival_airport', 'aircraft'
        ).all()
        
        if origin:
            flights = flights.filter(departure_airport__code=origin.upper())
        
        if destination:
            flights = flights.filter(arrival_airport__code=destination.upper())
        
        if departure_date:
            try:
                date = datetime.fromisoformat(departure_date).date()
                flights = flights.filter(departure_time__date=date)
            except ValueError:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = FlightSerializer(flights, many=True)
        return Response(serializer.data)                    
