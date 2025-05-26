import { useEffect, useState } from 'react';
import { CogIcon, LockClosedIcon, BellIcon } from '@heroicons/react/24/outline';
import { FaUserCircle } from 'react-icons/fa';
import { authApi, useGetProfileQuery, useLogoutMutation } from '../../redux/authApi';
import { cartApi } from '../../redux/cartApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

// Random Color Generator
const getRandomColor = () => {
  const colors = ['#7C3AED', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#3B82F6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: user, isLoading: userLoading, error: userError, refetch } = useGetProfileQuery();
  const [logout] = useLogoutMutation();

  const [emailNotif, setEmailNotif] = useState(true);
  const [promoNotif, setPromoNotif] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [randomColor] = useState(getRandomColor()); // Set once on mount

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout().unwrap();
      dispatch(cartApi.util.resetApiState());
      dispatch(authApi.util.resetApiState());
      toast.success("Logout successful");
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!user) refetch();
  }, [user, refetch]);

  if (userLoading) return <p className="mt-10 text-center">Loading profile...</p>;
  if (userError) return <p className="mt-10 text-center text-red-500">Failed to load profile</p>;

  return (
    <div className="min-h-screen py-8 bg-gray-50 mt-[8%]">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow">
          <div className="flex items-center flex-wrap gap-6">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User avatar"
                className="object-cover w-20 h-20 rounded-full border-2"
                style={{ borderColor: randomColor }}
              />
            ) : (
              <FaUserCircle className="w-20 h-20" style={{ color: randomColor }} />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              {user?.createdAt && (
                <p className="text-sm text-gray-500">
                  Member since {formatDate(user.createdAt)}
                </p>
              )}
            </div>

            {user && (
              <div className="ml-auto flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => navigate('/check-orders')}
                  className="px-4 py-2 font-semibold text-white rounded-lg shadow"
                  style={{ backgroundColor: randomColor }}
                >
                  Check Order Details
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 font-semibold text-white rounded-lg shadow"
                  style={{ backgroundColor: randomColor }}
                >
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold" style={{ color: randomColor }}>
            <CogIcon className="w-6 h-6" />
            Account Settings
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Security Settings */}
            <div className="p-4 border rounded-lg">
              <h3 className="flex items-center gap-2 mb-2 font-medium">
                <LockClosedIcon className="w-5 h-5" />
                Security
              </h3>
              <ul className="space-y-2">
                <li>
                  <button className="hover:underline" style={{ color: randomColor }}>
                    Change Password
                  </button>
                </li>
                <li>
                  <button className="hover:underline" style={{ color: randomColor }}>
                    Two-Factor Authentication
                  </button>
                </li>
              </ul>
            </div>

            {/* Notification Settings */}
            <div className="p-4 border rounded-lg">
              <h3 className="flex items-center gap-2 mb-2 font-medium">
                <BellIcon className="w-5 h-5" />
                Notifications
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={emailNotif}
                      onChange={() => setEmailNotif(!emailNotif)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span>Promotional Offers</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={promoNotif}
                      onChange={() => setPromoNotif(!promoNotif)}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* end container */}
    </div>
  );
};

export default UserProfile;
