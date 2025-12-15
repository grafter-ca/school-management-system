'use client';

import { School, Users, CheckCircle, Clock, TrendingUp, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export function AdminDashboardHome() {
  // Mock statistics data
  const stats = [
    {
      title: 'Total Schools',
      value: '156',
      change: '+12%',
      icon: School,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Schools',
      value: '142',
      change: '+8%',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Pending Approval',
      value: '14',
      change: '-5%',
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
    },
    {
      title: 'Total Users',
      value: '28',
      change: '+3',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  // Schools by level data
  const schoolsByLevel = [
    { name: 'Nursery', value: 35, color: '#3B82F6' },
    { name: 'Primary', value: 62, color: '#8B5CF6' },
    { name: 'Secondary', value: 45, color: '#10B981' },
    { name: 'TVET', value: 14, color: '#F59E0B' },
  ];

  // Schools by district data
  const schoolsByDistrict = [
    { district: 'Gasabo', schools: 42 },
    { district: 'Kicukiro', schools: 38 },
    { district: 'Nyarugenge', schools: 35 },
    { district: 'Kayonza', schools: 18 },
    { district: 'Huye', schools: 23 },
  ];

  // Monthly registration trend
  const monthlyTrend = [
    { month: 'Jul', schools: 12 },
    { month: 'Aug', schools: 15 },
    { month: 'Sep', schools: 18 },
    { month: 'Oct', schools: 22 },
    { month: 'Nov', schools: 25 },
    { month: 'Dec', schools: 28 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-green-600 ${stat.change.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schools by Level - Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-4">Schools by Level</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={schoolsByLevel}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {schoolsByLevel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {schoolsByLevel.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schools by District - Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-gray-900 mb-4">Schools by District</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={schoolsByDistrict}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="schools" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6">
        {/* Monthly Registration Trend - Line Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Monthly Registration Trend</h3>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-5 h-5" />
              <span>+18% this month</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="schools"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New school registered', school: 'Green Valley Primary', time: '2 hours ago', type: 'success' },
            { action: 'School activated', school: 'Bright Future Secondary', time: '5 hours ago', type: 'info' },
            { action: 'User created', school: 'John Doe (Onboarding Officer)', time: '1 day ago', type: 'purple' },
            { action: 'School approved', school: 'Little Stars Nursery', time: '2 days ago', type: 'success' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === 'success'
                      ? 'bg-green-500'
                      : activity.type === 'purple'
                      ? 'bg-purple-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div>
                  <p className="text-gray-900">{activity.action}</p>
                  <p className="text-gray-600">{activity.school}</p>
                </div>
              </div>
              <span className="text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
