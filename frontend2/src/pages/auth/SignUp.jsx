import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, ShoppingBag, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FButton from '../../components/Button';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/authSlice';
import AOS from "aos";
import "aos/dist/aos.css";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    // confirmPassword: '',
  })

  console.log('formState', formState)

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value, });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formState));
    navigate("/")
  }


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 700,
      easing: "ease-in-out",
      delay: 50,
    });
  }, []);


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

        <form className="space-y-5"
          onSubmit={handleSubmit}
        >
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
                value={formState.username || ""}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                placeholder="username"
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
          </div>

          <div className='flex justify-center'>
            <FButton type="submit">
              <span className="flex items-center justify-center">
                Sign Up
                <ArrowRight className="h-5 w-7 ml-2" />
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