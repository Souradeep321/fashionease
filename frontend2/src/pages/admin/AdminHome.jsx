import React from 'react'
import { 
  ShoppingBag, Users, DollarSign, Package, 
  CreditCard, BarChart2, Activity, TrendingUp,
  AlertCircle, MessageSquare, Settings, LogOut
} from 'lucide-react';

const AdminHome = () => {

  const stats = [
    { title: "Total Sales", value: "$24,780", change: "+12%", icon: <ShoppingBag className="h-6 w-6" />, trend: "up" },
    { title: "New Customers", value: "1,254", change: "+8%", icon: <Users className="h-6 w-6" />, trend: "up" },
    { title: "Total Revenue", value: "$48,520", change: "+23%", icon: <DollarSign className="h-6 w-6" />, trend: "up" },
    { title: "Pending Orders", value: "124", change: "-3%", icon: <Package className="h-6 w-6" />, trend: "down" }
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "John Doe", date: "12 May 2023", amount: "$125.00", status: "completed" },
    { id: "#ORD-002", customer: "Jane Smith", date: "11 May 2023", amount: "$89.50", status: "processing" },
    { id: "#ORD-003", customer: "Robert Johnson", date: "10 May 2023", amount: "$245.75", status: "shipped" },
    { id: "#ORD-004", customer: "Emily Davis", date: "09 May 2023", amount: "$67.30", status: "pending" },
    { id: "#ORD-005", customer: "Michael Wilson", date: "08 May 2023", amount: "$199.99", status: "completed" }
  ];

  const topProducts = [
    { name: "Wireless Headphones", sales: "1,245", revenue: "$24,900" },
    { name: "Smart Watch", sales: "987", revenue: "$19,740" },
    { name: "Bluetooth Speaker", sales: "756", revenue: "$15,120" },
    { name: "Laptop Backpack", sales: "654", revenue: "$13,080" },
    { name: "Phone Case", sales: "543", revenue: "$5,430" }
  ];


  return (
    <>
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button className="md:hidden mr-4 text-gray-500 focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Admin" />
                  <span className="hidden md:block text-sm font-medium text-gray-700">Admin User</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Stats Cards */}
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

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Sales Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-md">Monthly</button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md">Weekly</button>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Sales chart will appear here</p>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Revenue Sources</h3>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Revenue chart will appear here</p>
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Top Selling Products</h3>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">View all</a>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} sold • {product.revenue} revenue</p>
                    </div>
                    <div>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

    </>
  )
}

export default AdminHome