import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Plane, 
  Users, 
  MapPin, 
  Calendar,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const monthlyRevenue = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 67000 },
];

const bookingsByClass = [
  { name: 'Economy', value: 65, color: '#3b82f6' },
  { name: 'Business', value: 25, color: '#0ea5e9' },
  { name: 'First', value: 10, color: '#f59e0b' },
];

const recentBookings = [
  { id: 'BK123456', customer: 'John Doe', route: 'JFK → LHR', amount: 1250, status: 'confirmed' },
  { id: 'BK123457', customer: 'Jane Smith', route: 'LAX → HND', amount: 2100, status: 'pending' },
  { id: 'BK123458', customer: 'Bob Johnson', route: 'CDG → DXB', amount: 890, status: 'confirmed' },
  { id: 'BK123459', customer: 'Alice Brown', route: 'SIN → SYD', amount: 750, status: 'cancelled' },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$328,000', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      color: 'primary'
    },
    { 
      title: 'Total Bookings', 
      value: '1,234', 
      change: '+8.2%', 
      trend: 'up',
      icon: Calendar,
      color: 'success'
    },
    { 
      title: 'Active Flights', 
      value: '156', 
      change: '+3.1%', 
      trend: 'up',
      icon: Plane,
      color: 'secondary'
    },
    { 
      title: 'Registered Users', 
      value: '5,678', 
      change: '+15.3%', 
      trend: 'up',
      icon: Users,
      color: 'accent'
    },
  ];

  const quickActions = [
    { label: 'Manage Flights', icon: Plane, href: '/admin/flights', color: 'primary' },
    { label: 'Manage Airports', icon: MapPin, href: '/admin/airports', color: 'secondary' },
    { label: 'Manage Users', icon: Users, href: '/admin/users', color: 'accent' },
    { label: 'View Analytics', icon: TrendingUp, href: '/admin/analytics', color: 'success' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500">Welcome back, {user?.name}</p>
            </div>
            <Badge variant="primary" className="text-sm px-3 py-1">
              Administrator
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <div className={`flex items-center gap-1 text-sm mt-1 ${
                        stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {stat.change}
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-100 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate(action.href)}
                >
                  <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  <span className="text-sm">{action.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bookings by Class */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings by Class</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={bookingsByClass}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {bookingsByClass.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {bookingsByClass.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Booking ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Route</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-3 px-4 font-mono text-sm">{booking.id}</td>
                      <td className="py-3 px-4">{booking.customer}</td>
                      <td className="py-3 px-4">{booking.route}</td>
                      <td className="py-3 px-4 font-medium">${booking.amount}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          variant={
                            booking.status === 'confirmed' ? 'success' :
                            booking.status === 'pending' ? 'warning' :
                            'danger'
                          }
                          size="sm"
                        >
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
