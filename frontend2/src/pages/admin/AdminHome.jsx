import React from 'react';
import {
  ShoppingBag, Users, DollarSign, Package,
} from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement
);

const AdminHome = () => {
  const stats = [
    { title: "Total Sales", value: "$24,780", change: "+12%", icon: <ShoppingBag className="h-6 w-6" />, trend: "up" },
    { title: "New Customers", value: "1,254", change: "+8%", icon: <Users className="h-6 w-6" />, trend: "up" },
    { title: "Total Revenue", value: "$48,520", change: "+23%", icon: <DollarSign className="h-6 w-6" />, trend: "up" },
    { title: "Pending Orders", value: "124", change: "-3%", icon: <Package className="h-6 w-6" />, trend: "down" }
  ];

  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Sales',
      data: [3000, 5000, 4000, 6000, 7000, 9000],
      borderColor: '#3b82f6',
      tension: 0.4
    }]
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (ctx) => `$${ctx.raw}` }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };

  const pieData = {
    labels: ['Men', 'Women', 'Kids'],
    datasets: [{
      data: [40, 35, 25],
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
      hoverOffset: 4
    }]
  };

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = pieData.labels[tooltipItem.dataIndex];
            const value = pieData.datasets[0].data[tooltipItem.dataIndex];
            return `${label}: $${value}k`;
          }
        }
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-2 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.trend === "up" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h3>
          <Line data={salesData} options={salesOptions} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
