import { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FButton from '../../components/Button';

import AOS from "aos";
import "aos/dist/aos.css";
import { useGetProfileQuery, useLoginMutation } from '../../redux/authApi';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const navigate = useNavigate();
    const [login, { data: loginResponse, isLoading, error }] = useLoginMutation();
    const { data: user, refetch } = useGetProfileQuery();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData).unwrap();
            await refetch(); // fetch user info again after login
        } catch (err) {
            console.error('Login failed', err);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/adminDashboard');
        } else if (user?.role === 'customer') {
            navigate('/');
        }
    }, [user, navigate]);

    const goToSignup = () => {
        navigate('/signup');
    };


    // AOS animation setup
    useEffect(() => {
        AOS.init({
            offset: 100,
            duration: 600,
            easing: "ease-in-out",
            delay: 50,
        });
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-full max-w-md p-8 space-y-6 rounded-lg border border-gray-200 shadow-sm" data-aos="fade-up">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-black flex items-center justify-center">
                        <ShoppingBag size={20} className="text-white" />
                    </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Email Field */}
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
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-black text-gray-900"
                                placeholder="Email address"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={formData.password}
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

                    {/* Error message */}
                    {error && (
                        <div className="text-red-600 text-sm mt-2 text-center">
                            {error?.data?.message || "Login failed. Please try again."}
                        </div>
                    )}

                    {/* Submit button */}
                    <div className="flex justify-center">
                        <FButton type="submit" disabled={isLoading}>
                            <span className="flex items-center justify-center">
                                {isLoading ? "Logging in..." : (
                                    <>
                                        Login <ArrowRight className="h-5 w-5 ml-2" />
                                    </>
                                )}
                            </span>
                        </FButton>
                    </div>

                    {/* Signup link */}
                    <div className="text-center mt-6">
                        <button
                            type="button"
                            className="text-sm font-medium text-gray-600 hover:text-black"
                            onClick={goToSignup}
                        >
                            Need an account? Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
