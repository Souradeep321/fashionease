import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, ShoppingBag, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FButton from '../../components/Button';
import AOS from "aos";
import "aos/dist/aos.css";
import { useGetProfileQuery, useRegisterMutation } from '../../redux/authApi';
import { toast } from 'react-hot-toast';

function Signup() {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [register, { isLoading }] = useRegisterMutation();
  const { data: user, refetch } = useGetProfileQuery();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { username, email, password, confirmPassword } = formState;

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await register({ username, email, password }).unwrap();
      await refetch();
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
      const errMsg = error.data?.error || 'Registration failed. Please try again.';
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user?.role === 'admin') {
      navigate('/adminDashboard');
    } else if (user?.role === 'customer') {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 700,
      easing: "ease-in-out",
      delay: 50,
    });
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 mt-12 space-y-6 rounded-lg border border-gray-200 shadow-sm"
        data-aos="fade-up">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-black flex items-center justify-center">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign up to get started
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formState.username}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                placeholder="Username"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formState.email}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formState.password}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                placeholder="Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formState.confirmPassword}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                placeholder="Confirm Password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className='flex justify-center'>
            <FButton type="submit" disabled={isLoading}>
              <span className="flex items-center justify-center">
                {isLoading ? 'Signing up...' : 'Sign Up'}
                {!isLoading && <ArrowRight className="h-5 w-7 ml-2" />}
              </span>
            </FButton>
          </div>

          <div className="text-center mt-6">
            <button
              type="button"
              className="text-sm font-medium text-gray-600 hover:text-black"
              onClick={() => navigate("/login")}
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
