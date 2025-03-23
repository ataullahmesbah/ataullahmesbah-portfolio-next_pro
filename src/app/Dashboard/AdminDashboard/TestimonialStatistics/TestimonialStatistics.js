'use client';

import { useEffect, useState } from 'react';
import { FaStar, FaUsers, FaList } from 'react-icons/fa';
import ReactApexChart from 'react-apexcharts';

const TestimonialStatistics = () => {
  const [stats, setStats] = useState({
    totalTestimonials: 0,
    averageRating: 0,
    categoryCount: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/testimonials');
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        
        const data = await response.json();
        const total = data.length;
        const avgRating = (data.reduce((acc, t) => acc + (t.rating || 0), 0) / total || 0).toFixed(1);
        const categoryCount = data.reduce((acc, t) => {
          const category = t.categories || 'Uncategorized';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        setStats({ totalTestimonials: total, averageRating: avgRating, categoryCount });
      } catch (error) {
        console.error('Failed to fetch testimonial statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Pie Chart Configuration
  const pieChartData = {
    series: Object.values(stats.categoryCount),
    options: {
      chart: {
        type: 'pie',
        height: 300,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      labels: Object.keys(stats.categoryCount),
      colors: ['#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#14b8a6'],
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ['#fff'],
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 1,
          opacity: 0.45,
        },
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '14px',
        labels: {
          colors: '#9CA3AF',
        },
        markers: {
          width: 12,
          height: 12,
          radius: 12,
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${val} testimonials`,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 250,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-900 rounded-xl">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-semibold text-white mb-6">Testimonial Statistics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-800 rounded-lg p-2">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Category Distribution</h3>
          <ReactApexChart
            options={pieChartData.options}
            series={pieChartData.series}
            type="pie"
            height={300}
          />
        </div>

        {/* Summary Stats */}
        <div className="flex flex-col space-y-4">
          {[
            {
              title: 'Total Testimonials',
              value: stats.totalTestimonials.toLocaleString(),
              icon: <FaUsers className="text-blue-500 text-2xl" />,
              color: 'bg-blue-500/10 border-blue-500/20',
            },
            {
              title: 'Average Rating',
              value: `${stats.averageRating} / 5`,
              icon: <FaStar className="text-yellow-500 text-2xl" />,
              color: 'bg-yellow-500/10 border-yellow-500/20',
            },
            {
              title: 'Categories',
              value: Object.keys(stats.categoryCount).length,
              icon: <FaList className="text-purple-500 text-2xl" />,
              color: 'bg-purple-500/10 border-purple-500/20',
            },
          ].map(({ title, value, icon, color }, index) => (
            <div
              key={index}
              className={`flex items-center p-4 rounded-lg border ${color}`}
            >
              <div className="mr-4">{icon}</div>
              <div>
                <h3 className="text-sm font-medium text-gray-300">{title}</h3>
                <p className="text-lg font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialStatistics;