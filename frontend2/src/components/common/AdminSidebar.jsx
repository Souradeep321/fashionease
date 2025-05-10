import React from 'react';
import {
    BarChart2, ShoppingBag, Users, CreditCard, Activity,
    LogOut, PlusSquare, Edit
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/authSlice';

const AdminSidebar = () => {
    const dispatch = useDispatch();

    return (
        <div className="hidden md:flex md:flex-shrink-0 h-[100%] ">
            <div className="flex flex-col w-64 bg-white border-r border-gray-200">
                <div className="px-4 py-4 overflow-y-auto">
                    <nav className="flex-1 space-y-2">
                        <NavLink to="/adminDashboard"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm font-medium ${isActive
                                    ? "bg-gray-800 text-white font-semibold"
                                    : "text-gray-500 hover:bg-gray-700 hover:text-white"
                                }`
                            }>
                            <BarChart2 className="h-5 w-5 mr-3" />
                            Dashboard
                        </NavLink>
                        <NavLink to="/adminDashboard/products"
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm font-medium ${isActive
                                    ? "bg-purple-100 rounded-lg text-purple-700 font-semibold"
                                    : "text-zinc-600 hover:bg-zinc-100"}`
                            }>
                            <ShoppingBag className="h-5 w-5 mr-3" />
                            Products
                        </NavLink>
                        <NavLink to="/adminDashboard/createProduct"
                            className={({ isActive }) =>
                                `flex items-center  px-4 py-3 text-sm font-medium ${isActive
                                    ? "bg-purple-100 rounded-lg text-purple-700 font-semibold"
                                    : "text-zinc-600 hover:bg-zinc-100"
                                }`
                            }
                        >
                            <PlusSquare className="h-5 w-5 mr-3" />
                            Create Product
                        </NavLink>
                        <NavLink to="/adminDashboard/customers"
                            className={({ isActive }) =>
                                `flex items-center  px-4 py-3 text-sm font-medium ${isActive
                                    ? "bg-purple-100 rounded-lg text-purple-700 font-semibold"
                                    : "text-zinc-600 hover:bg-zinc-100"
                                }`
                            }
                        >
                            <Users className="h-5 w-5 mr-3" />
                            Customers
                        </NavLink>
                        <NavLink to="/adminDashboard/orders"
                            className={({ isActive }) =>
                                `flex items-center  px-4 py-3 text-sm font-medium ${isActive
                                    ? "bg-purple-100 rounded-lg text-purple-700 font-semibold"
                                    : "text-zinc-600 hover:bg-zinc-100"
                                }`
                            }
                        >
                            <CreditCard className="h-5 w-5 mr-3" />
                            Orders
                        </NavLink>
                        {/* <NavLink to="#"
                            className={({ isActive }) =>
                                `flex items-center  px-4 py-3 text-sm font-medium ${isActive
                                     ? "bg-purple-100 rounded-lg text-purple-700 font-semibold"
  : "text-zinc-600 hover:bg-zinc-100"
                                }`
                            }
                        >
                            <Activity className="h-5 w-5 mr-3" />
                            Analytics
                        </NavLink> */}


                    </nav>
                    <div className="mt-auto space-y-2">
                        <button
                            className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                            onClick={() => dispatch(logout())}
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
