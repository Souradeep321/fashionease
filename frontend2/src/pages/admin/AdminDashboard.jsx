import { Outlet } from 'react-router-dom'
import AdminSidebar from '../../components/common/AdminSidebar'

const AdminDashboard = () => {

    return (
        <div className="flex h-screen bg-gray-50 relative ">
            <AdminSidebar />
            <Outlet />
        </div>
    )
}

export default AdminDashboard