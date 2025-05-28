import { useEffect } from 'react'
import { Route, Routes, useLocation } from "react-router-dom";
import { useGetProfileQuery } from '../src/redux/authApi';
import { Toaster } from "react-hot-toast"

import {
  Home,
  SignUp,
  Login,
  AdminDashboard,
  AdminHome,
  AdminProducts,
  UpdateProduct,
  CreateProduct,
  Shop,
  Mens,
  Womens,
  SearchPage,
  CartPage,
  MensAll,
  MensTshirts,
  MensShirts,
  MensCasualTrousers,
  WomensAll,
  WomensJeans,
  WomensTshirts,
  CheckoutPage,
  Navbar,
  AboutPage,
  SuccessPage,
  ShowProduct,
  UserProfile
} from './components/common/index'
import { useFetchCartItemsQuery } from './redux/cartApi';
import CheckOrderDetail from './pages/customer/CheckoutOrderDetail';

function App() {
  const { data: userData, refetch, isLoading } = useGetProfileQuery();
  const { refetch: cartRefetch, isLoading: cartLoading } = useFetchCartItemsQuery();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (userData && isMounted) {
        try {
          await Promise.all([
            refetch(),
            cartRefetch()
          ]);
        } catch (err) {
          console.error('Data fetch error:', err);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [userData, refetch, cartRefetch]); // Add all dependencies


  const user = userData;


   if (isLoading || cartLoading) return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <svg className="animate-spin h-10 w-10 text-emerald-500 mx-auto mb-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <p className="text-lg text-gray-300">Loading your experience...</p>
      </div>
    </div>
  );

  return (
    <>
      {!location.pathname.startsWith("/adminDashboard") && !location.pathname.startsWith("/success") && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='shop' element={<Shop />} />

        <Route path='mens' element={<Mens />} >
          <Route index element={<MensAll />} />
          <Route path='t-shirts' element={<MensTshirts />} />
          <Route path='shirts' element={<MensShirts />} />
          <Route path='casual-trousers' element={<MensCasualTrousers />} />
        </Route>

        <Route path='womens' element={<Womens />}>
          <Route index element={<WomensAll />} />
          <Route path='t-shirts' element={<WomensTshirts />} />
          <Route path='jeans' element={<WomensJeans />} />
        </Route>

        <Route path='search' element={<SearchPage />} />
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='profile' element={<UserProfile />} />
        <Route path='check-orders' element={<CheckOrderDetail />} />

        {/* TODO: in admindashboard no need of the nav component */}
        <Route path='adminDashboard' element={user && user?.role === 'admin' ? <AdminDashboard /> : <Login />}>
          <Route index element={<AdminHome />} />
          <Route path='products' element={<AdminProducts />} />
          <Route path='createProduct' element={<CreateProduct />} />
          <Route path='update/:id' element={<UpdateProduct />} />
        </Route>
        <Route path='about' element={<AboutPage />} />
        <Route path='product/:id' element={<ShowProduct />} />
        <Route path='cart' element={<CartPage />} />
        <Route path='checkout' element={<CheckoutPage />} />
        <Route path='success' element={<SuccessPage />} />
      </Routes>
    
      <Toaster />

    </>

  )
}

export default App