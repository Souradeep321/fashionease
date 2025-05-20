import { useState, useEffect } from 'react';
import { useGetProfileQuery } from '../../redux/authApi';
import { useFetchCartItemsQuery } from '../../redux/cartApi';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        shippingName: '',
        shippingAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'INDIA',
        phone: '',
        totalAmount: ''
    });

    const [paymentError, setPaymentError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: userData, refetch, loading, isLoading, isError, error } = useGetProfileQuery();
    const {
        data: cartData,
        isLoading: cartLoading,
        refetch: cartRefetch,
    } = useFetchCartItemsQuery();

    const user = userData;

    const subtotal = cartData?.[2]?.total || 0;
    const tax = Math.round(subtotal * 0.14);
    const total = subtotal + tax;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentError('');
        setIsProcessing(true);

        try {
            const payload = {
                totalAmount: Number(total),
                shippingName: formData.shippingName,
                phoneNumber: formData.phone,
                shippingAddress: formData.shippingAddress,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                country: formData.country
            };

            console.log('Sending payload:', payload);

            // Add timeout to fetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch('http://localhost:5000/api/v1/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // This is important for sending cookies
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await response.json();
            console.log('Response:', data); // Debug response

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create order');
            }

            // Handle Razorpay integration
            const options = {
                key: 'rzp_test_cqROlN8BJ3b6C5', // Replace with your Razorpay key
                amount: data.amount,
                currency: data.currency,
                name: 'Your Store Name',
                description: 'Order Payment',
                order_id: data.razorpayOrderId,
                handler: async function (response) {
                    try {
                        // Handle successful payment
                        console.log('Payment successful:', response);
                        const body = {
                            razorpayOrderId: response.razorpay_order_id,      // Changed from orderId
                            razorpayPaymentId: response.razorpay_payment_id,  // Changed from paymentId
                            razorpaySignature: response.razorpay_signature,   // Changed from signature
                            shippingName: formData.shippingName,
                            shippingAddress: formData.shippingAddress,
                            city: formData.city,
                            state: formData.state,
                            postalCode: formData.postalCode,
                            country: formData.country,
                            phoneNumber: formData.phone,
                            totalAmount: Number(total)
                        };

                        const validateResponse = await fetch('http://localhost:5000/api/v1/order/validate', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            credentials: 'include',
                            body: JSON.stringify(body)
                        });

                        const validateData = await validateResponse.json();
                        console.log('Validate Response:', validateData);


                        if (!validateResponse.ok) {
                            throw new Error(validateData.error || 'Failed to validate payment');
                        }
                        // Show success message
                        alert('Payment successful! Thank you for your order.');


                        // Optionally clear the cart or refresh the page
                        if (validateData.status === 'paid') {
                            toast.success('Payment successful! Thank you for your order.');
                            await cartRefetch();
                        }
                    } catch (err) {
                        console.error('Payment validation error:', err);
                        setPaymentError(err.message || 'Payment validation failed');
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: formData.shippingName,
                    contact: formData.phone
                },
                notes: {
                    shipping_address: formData.shippingAddress
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error('Error:', err);
            if (err.name === 'AbortError') {
                setPaymentError('Request timed out. Please try again.');
            } else {
                setPaymentError(err.message || 'Something went wrong');
            }
            setIsProcessing(false);
        }
        finally {
            setFormData({
                shippingName: '',
                shippingAddress: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'INDIA',
                phone: ''
            });
        }
    };


    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                shippingName: userData.name || '',
                shippingAddress: userData.address || '',
                city: userData.city || '',
                state: userData.state || '',
                postalCode: userData.postalCode || '',
                country: userData.country || 'INDIA',
                phone: userData.phone || ''
            }));
        }
    }, [userData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        refetch();
        cartRefetch();
    }, [refetch, cartRefetch]);



    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4  sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Checkout
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="shippingName"
                            value={formData.shippingName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            pattern="[0-9]{10}"
                            title="Enter a valid 10-digit phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            type="text"
                            name="shippingAddress"
                            value={formData.shippingAddress}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                State
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Postal Code
                            </label>
                            <input
                                type="text"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Total Amount (INR)
                        </label>
                        <input
                            type="number"
                            name="totalAmount"
                            value={total}
                            readOnly
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    {paymentError && (
                        <div className="text-red-600 text-sm">{paymentError}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                    >
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
