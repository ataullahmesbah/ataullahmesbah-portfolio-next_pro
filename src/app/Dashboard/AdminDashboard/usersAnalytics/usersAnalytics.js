'use client';

import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
  const [state, setState] = useState({
    series: [0, 0, 0, 0, 0, 0],
    options: {
      chart: {
        height: 350,
        type: 'radialBar',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      plotOptions: {
        radialBar: {
          offsetY: -10,
          startAngle: -135,
          endAngle: 135,
          hollow: {
            margin: 10,
            size: '35%',
            background: '#1F2937',
            dropShadow: {
              enabled: true,
              top: 3,
              left: 0,
              blur: 4,
              opacity: 0.24,
            },
          },
          track: {
            background: '#374151',
            strokeWidth: '67%',
            opacity: 0.3,
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: '600',
              color: '#9CA3AF',
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: '700',
              color: '#fff',
              offsetY: 5,
              formatter: (val) => `${val}`,
            },
          },
        },
      },
      colors: ['#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#64748b'],
      labels: ['Total Users', 'Admins', 'Moderators', 'Normal Users', 'Active', 'Inactive'],
      stroke: {
        lineCap: 'round',
      },
      legend: {
        show: true,
        position: 'bottom',
        fontSize: '14px',
        fontWeight: '500',
        labels: {
          colors: '#9CA3AF',
        },
        markers: {
          width: 10,
          height: 10,
          radius: 12,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 5,
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} users`,
        },
        style: {
          fontSize: '12px',
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 280,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        setUsers(data);

        const totalUsers = data.length;
        const admins = data.filter((user) => user.role === 'admin').length;
        const moderators = data.filter((user) => user.role === 'moderator').length;
        const normalUsers = data.filter((user) => user.role === 'user').length;
        const activeUsers = data.filter((user) => user.status === 'active').length;
        const inactiveUsers = data.filter((user) => user.status === 'inactive').length;

        setState((prev) => ({
          ...prev,
          series: [totalUsers, admins, moderators, normalUsers, activeUsers, inactiveUsers],
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-900 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 w-full">
      <h3 className="text-xl font-semibold text-white mb-6">User Statistics Overview</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radial Bar Chart */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="radialBar"
            height={350}
          />
        </div>

        {/* User Summary Boxes */}
        <div className="flex flex-col space-y-4">
          {[
            { title: 'Total Users', value: users.length, color: 'bg-green-500/10 border-green-500/20', iconColor: 'text-green-500' },
            { title: 'Admins', value: users.filter((user) => user.role === 'admin').length, color: 'bg-orange-500/10 border-orange-500/20', iconColor: 'text-orange-500' },
            { title: 'Moderators', value: users.filter((user) => user.role === 'moderator').length, color: 'bg-red-500/10 border-red-500/20', iconColor: 'text-red-500' },
            { title: 'Normal Users', value: users.filter((user) => user.role === 'user').length, color: 'bg-purple-500/10 border-purple-500/20', iconColor: 'text-purple-500' },
            { title: 'Active Users', value: users.filter((user) => user.status === 'active').length, color: 'bg-blue-500/10 border-blue-500/20', iconColor: 'text-blue-500' },
            { title: 'Inactive Users', value: users.filter((user) => user.status === 'inactive').length, color: 'bg-gray-500/10 border-gray-500/20', iconColor: 'text-gray-500' },
          ].map((item, index) => (
            <div key={index} className={`flex items-center p-3 rounded-lg border ${item.color}`}>
              <div className={`mr-3 ${item.iconColor}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs text-gray-300">{item.title}</h4>
                <p className="text-lg font-bold text-white">{item.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApexChart;