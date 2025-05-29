import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSearchData } from '../redux/productSlice';
import { FaBars, FaTimes, FaShoppingBag, FaUser, FaSearch } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import toast from 'react-hot-toast';
import { cartApi, useClearCartMutation, useFetchCartItemsQuery } from '../redux/cartApi';
import { authApi, useGetProfileQuery, useLogoutMutation } from '../redux/authApi';

const Navbar = () => {
  const menuItems = [
    { label: 'HOME', path: '/' },
    { label: 'SHOP', path: '/shop' },
    { label: "MEN'S", path: '/mens' },
    { label: "WOMEN'S", path: '/womens' },
    { label: 'CART', path: '/cart' },
    { label: 'ABOUT US', path: '/about' },
  ];

  const menLinks = [
    { label: "Shirts", path: "/mens/shirts" },
    { label: "T-Shirts", path: "/mens/t-shirts" },
    { label: "Casual Trousers", path: "/mens/casual-trousers" },
  ];

  const womenLinks = [
    { label: "Jeans", path: "/womens/jeans" },
    { label: "T-Shirts", path: "/womens/t-shirts" },
  ];

  const [logout] = useLogoutMutation();
  const { data: User, refetch } = useGetProfileQuery();
  const { data: cartData, isLoading: cartLoading, refetch: cartRefetch } = useFetchCartItemsQuery();
  const [clearcart] = useClearCartMutation()

  const cartItemsArray = cartData?.cart || [];
  const subtotal = cartData?.total || 0;
  const tax = Math.round(subtotal * 0.14);
  const total = subtotal + tax;

  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hovered, setHovered] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMenDropdown, setShowMenDropdown] = useState(false);
  const [showWomenDropdown, setShowWomenDropdown] = useState(false);

  const userMenuRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(addSearchData(search));
    navigate('/search');
    setShowSearch(false);
  };

  const isAuthenticated = !!User;
  console.log('isAuthenticated', isAuthenticated)


  // const handleLogout = async () => {
  //   try {
  //     await logout().unwrap();
  //     console.log('User logged out successfully');
  //     await refetch(); // ensure user data is refreshed
  //     console.log('Cart cleared');
  //     await cartRefetch(); // refetch cart items
  //     console.log('Cart refetched');
  //     toast.success("Logout successful");
  //     navigate('/'); // redirect to home after logout
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //   }
  // };


  const handleLogout = async () => {
    try {
      await logout().unwrap(); // Important: calls the Flask logout route to clear cookie

      dispatch(cartApi.util.resetApiState());
      dispatch(authApi.util.resetApiState());

      toast.success("Logout successful");
      navigate('/'); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 font-medium text-black transition-all duration-300 ${isActive ? 'underline underline-offset-8' : ''
    } hover:underline hover:underline-offset-8`;


  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header
      className="w-full fixed z-50 bg-white text-black shadow-sm"
    >
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        {/* Hamburger */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="md:hidden text-2xl"
        >
          {showMenu ? <FaTimes /> : <FaBars />}
        </button>

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="text-center flex-grow md:flex-grow-0 md:w-1/3 cursor-pointer">
          <h1 className="text-xl font-serif tracking-widest">Fashion Ease</h1>
          <p className="text-xs">The best place for fashion</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 relative">
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setShowUserMenu((prev) => !prev)}>
              <FaUser size={24} />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-md z-50">
                {!isAuthenticated && (
                  <div>
                    <NavLink
                      to="/signup"
                      className="block px-4 py-2 hover:bg-rose-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Sign Up
                    </NavLink>
                    <NavLink
                      to="/login"
                      className="block px-4 py-2 hover:bg-rose-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Log In
                    </NavLink>
                  </div>
                )}
                {isAuthenticated && (
                  <div
                    onClick={() => {
                      navigate('/profile');
                      setShowUserMenu(false);
                    }}
                    className="block px-4 py-2 hover:bg-rose-100">
                    profile
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='flex items-center justify-center gap-4'>
            <button
              onClick={() => setShowSearch(true)}
              className="text-lg  items-center gap-1 hidden md:flex"
            >
              <FaSearch size={20} />
              SEARCH
            </button>
            <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
              <FaShoppingBag size={20} />

              {isAuthenticated && cartItemsArray.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsArray.length}
                </span>
              )}
            </div>

          </div>
        </div>



      </div>


      {/* Nav Links */}
      <nav className="hidden md:flex justify-center gap-6 py-2 relative z-40">
        {menuItems.map((item) => {
          const isDropdown = item.label === "MEN'S" || item.label === "WOMEN'S";
          const links = item.label === "MEN'S" ? menLinks : womenLinks;

          return (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => isDropdown && setHovered(item.label)}
              onMouseLeave={() => isDropdown && setHovered('')}
            >
              <NavLink to={item.path} className={linkClass}>
                {item.label}
              </NavLink>

              {/* Single dropdown shown only for hovered item */}
              {hovered === item.label && isDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-lg shadow-xl mt-2 p-4 space-y-2 z-50 transition-all duration-200">
                  {links.map((link) => (
                    <NavLink
                      key={link.label}
                      to={link.path}
                      className="block px-3 py-2 hover:bg-rose-100 rounded-md transition"
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>


      {/* Mobile Menu */}
      {
        showMenu && (
          <div className="md:hidden px-4 py-3 bg-white shadow-lg space-y-2">
            {menuItems.map((item) => {
              if (item.label === "MEN'S") {
                return (
                  <div key="MEN'S">
                    <button
                      className="w-full text-left py-1 font-medium"
                      onClick={() => setShowMenDropdown((prev) => !prev)}
                    >
                      MEN'S <IoIosArrowDown className='float-right' size={20} />
                    </button>
                    {showMenDropdown && (
                      <div className="pl-4 space-y-1">
                        {menLinks.map((link) => (
                          <NavLink
                            key={link.label}
                            to={link.path}
                            className="block py-1 text-sm text-gray-700"
                            onClick={() => {
                              setShowMenu(false);
                              setShowMenDropdown(false);
                            }}
                          >
                            {link.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.label === "WOMEN'S") {
                return (
                  <div key="WOMEN'S">
                    <button
                      className="w-full text-left py-1 font-medium"
                      onClick={() => setShowWomenDropdown((prev) => !prev)}
                    >
                      WOMEN'S<IoIosArrowDown className='float-right' size={20} />
                    </button>
                    {showWomenDropdown && (
                      <div className="pl-4 space-y-1">
                        {womenLinks.map((link) => (
                          <NavLink
                            key={link.label}
                            to={link.path}
                            className="block py-1 text-sm text-gray-700"
                            onClick={() => {
                              setShowMenu(false);
                              setShowWomenDropdown(false);
                            }}
                          >
                            {link.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className="block py-1"
                  onClick={() => setShowMenu(false)}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        )
      }


      {/* Search Overlay */}
      {
        showSearch && (
          <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 p-4">
            <button onClick={() => setShowSearch(false)} className="absolute top-6 right-6 text-2xl">
              <FaTimes />
            </button>
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center w-full max-w-4xl border border-gray-300"
            >
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 outline-none text-lg"
              />
              <button
                type="submit"
                className="bg-rose-300 text-white px-6 h-full text-sm tracking-wide"
              >
                SEARCH
              </button>
            </form>
          </div>
        )
      }
    </header >
  );
};

export default Navbar;