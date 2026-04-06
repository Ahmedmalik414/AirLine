import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBookings } from '../context/BookingContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  Plane, 
  ArrowRight, 
  Clock, 
  CreditCard,
  Wallet,
  Smartphone,
  CheckCircle,
  Shield,
  Lock
} from 'lucide-react';
import { formatTime, formatPrice } from '../utils/formatters';
import { validateCreditCard, validateExpiryDate, validateCVV } from '../utils/validators';

export function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmPayment, setBookingStep } = useBookings();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [errors, setErrors] = useState({});
  
  const booking = location.state?.booking;
  
  if (!booking) {
    navigate('/flights');
    return null;
  }

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const validateForm = () => {
    const newErrors = {};
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!validateCreditCard(cardData.number)) {
        newErrors.number = 'Valid 16-digit card number required';
      }
      if (!cardData.name.trim()) {
        newErrors.name = 'Cardholder name is required';
      }
      if (!validateExpiryDate(cardData.expiry)) {
        newErrors.expiry = 'Valid expiry date required (MM/YY)';
      }
      if (!validateCVV(cardData.cvv)) {
        newErrors.cvv = 'Valid CVV required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await confirmPayment(booking.id, paymentMethod);
    
    if (result.success) {
      setBookingStep(3);
      navigate('/confirmation', { state: { booking: result.booking } });
    }
    setIsLoading(false);
  };

  const flight = booking.flight;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center opacity-50">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="ml-2 text-sm font-medium text-primary-600">Passenger Details</span>
            </div>
            <div className="w-24 h-1 bg-primary-600 mx-4" />
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium">
                2
              </div>
              <span className="ml-2 text-sm font-medium text-primary-600">Payment</span>
            </div>
            <div className="w-24 h-1 bg-slate-200 mx-4" />
            <div className="flex items-center opacity-50">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-medium">
                3
              </div>
              <span className="ml-2 text-sm font-medium text-slate-600">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === 'credit_card'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <CreditCard className={`w-8 h-8 mb-2 ${
                          paymentMethod === 'credit_card' ? 'text-primary-600' : 'text-slate-400'
                        }`} />
                        <div className="font-medium text-slate-900">Credit Card</div>
                        <div className="text-xs text-slate-500">Visa, Mastercard</div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('debit_card')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === 'debit_card'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <CreditCard className={`w-8 h-8 mb-2 ${
                          paymentMethod === 'debit_card' ? 'text-primary-600' : 'text-slate-400'
                        }`} />
                        <div className="font-medium text-slate-900">Debit Card</div>
                        <div className="text-xs text-slate-500">All banks supported</div>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('wallet')}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          paymentMethod === 'wallet'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Smartphone className={`w-8 h-8 mb-2 ${
                          paymentMethod === 'wallet' ? 'text-primary-600' : 'text-slate-400'
                        }`} />
                        <div className="font-medium text-slate-900">Digital Wallet</div>
                        <div className="text-xs text-slate-500">Apple Pay, Google Pay</div>
                      </button>
                    </div>

                    {/* Card Details Form */}
                    {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <Input
                          label="Card Number"
                          placeholder="1234 5678 9012 3456"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          error={errors.number}
                          leftIcon={<CreditCard className="w-5 h-5" />}
                          maxLength={19}
                        />
                        
                        <Input
                          label="Cardholder Name"
                          placeholder="Name as on card"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          error={errors.name}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Expiry Date"
                            placeholder="MM/YY"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            error={errors.expiry}
                            maxLength={5}
                          />
                          <Input
                            label="CVV"
                            placeholder="123"
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            error={errors.cvv}
                            maxLength={4}
                            rightIcon={<Lock className="w-4 h-4" />}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Wallet Payment Info */}
                    {paymentMethod === 'wallet' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-6 bg-slate-50 rounded-xl text-center"
                      >
                        <Wallet className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600">
                          You will be redirected to complete payment with your digital wallet
                        </p>
                      </motion.div>
                    )}

                    {/* Security Notice */}
                    <div className="flex items-center gap-3 p-4 bg-success-50 rounded-lg">
                      <Shield className="w-5 h-5 text-success-600 flex-shrink-0" />
                      <p className="text-sm text-success-800">
                        Your payment information is encrypted and secure. We never store your full card details.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      loading={isLoading}
                    >
                      Pay {formatPrice(booking.totalPrice ?? booking.total_price ?? 0)}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Booking Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Flight Info */}
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: flight.airline.color + '20' }}
                    >
                      {flight.airline.logo}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{flight.airline.name}</div>
                      <div className="text-sm text-slate-500">{flight.flightNumber}</div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex items-center justify-between py-2">
                    <div className="text-center">
                      <div className="text-lg font-bold">{formatTime(flight.departureTime || flight.departure_time)}</div>
                      <div className="text-sm text-slate-500">{(flight.from || flight.departure_airport)?.code}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-4">
                      <Plane className="w-4 h-4 text-slate-400 rotate-90" />
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{formatTime(flight.arrivalTime || flight.arrival_time)}</div>
                      <div className="text-sm text-slate-500">{(flight.to || flight.arrival_airport)?.code}</div>
                    </div>
                  </div>

                  {/* Passengers */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-sm font-medium text-slate-900 mb-2">Passengers</div>
                    {(booking.passengers || []).map((p, i) => (
                      <div key={i} className="text-sm text-slate-600">{p.name}</div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900">Total Amount</span>
                      <span className="text-xl font-bold text-primary-600">{formatPrice(booking.totalPrice ?? booking.total_price ?? 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
