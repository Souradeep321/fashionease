import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useGetProfileQuery } from "../../redux/authApi";
import { useFetchCartItemsQuery } from "../../redux/cartApi";
import { useNavigate } from "react-router-dom";
import { useAddOrderItemsMutation, useGetOrderItemsQuery } from "../../redux/orderApi";

const CheckoutPage = () => {
  const [addOrderItems] = useAddOrderItemsMutation();
  // const [getOrderItems] = useGetOrderItemsQuery();

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "INDIA",
    phone: "",
    totalAmount: "",
  });

  const [paymentError, setPaymentError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: userData, refetch } = useGetProfileQuery();
  const { data: cartData, refetch: cartRefetch } = useFetchCartItemsQuery();

  const subtotal = cartData?.total || 0;
  const tax = Math.round(subtotal * 0.14);
  const total = subtotal + tax;

  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        shippingName: userData.name || "",
        shippingAddress: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        postalCode: userData.postalCode || "",
        country: userData.country || "INDIA",
        phone: userData.phone || "",
      }));
    }
  }, [userData]);

  useEffect(() => {
    refetch();
    cartRefetch();
  }, [refetch, cartRefetch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
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
        country: formData.country,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("http://localhost:5000/api/v1/createOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      const options = {
        key: "rzp_test_cqROlN8BJ3b6C5",
        amount: data.amount,
        currency: data.currency,
        name: "FashionEase",
        description: "Order Payment",
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            const body = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              shippingName: formData.shippingName,
              shippingAddress: formData.shippingAddress,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: formData.country,
              phoneNumber: formData.phone,
              totalAmount: Number(total),
            };

            const validateResponse = await fetch(
              "http://localhost:5000/api/v1/order/validate",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body),
              }
            );

            const validateData = await validateResponse.json();

            if (!validateResponse.ok) {
              throw new Error(
                validateData.error || "Failed to validate payment"
              );
            }

            if (validateData.status === "paid") {
              const orderId = validateData.orderId;
              console.log('orderId', orderId)
              try {
                await addOrderItems(orderId).unwrap();
                console.log("Order items added successfully");
                await cartRefetch();
                navigate("/success");
                toast.success("Payment successful! Thank you for your order.");
              } catch (error) {
                toast.error("Failed to add order items. Please try again.");
                toast.error("paymentError", error.message); 
              }
            }
          } catch (err) {
            setPaymentError(err.message || "Payment validation failed");
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
        prefill: {
          name: formData.shippingName,
          contact: formData.phone,
        },
        notes: {
          shipping_address: formData.shippingAddress,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPaymentError(
        err.name === "AbortError"
          ? "Request timed out. Please try again."
          : err.message
      );
    } finally {
      setIsProcessing(false);
      if (paymentError) {
        toast.error(paymentError);
      }
      setFormData((prev) => ({
        ...prev,
        shippingName: userData.name || "",
        shippingAddress: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        postalCode: userData.postalCode || "",
        country: userData.country || "INDIA",
        phone: userData.phone || "",
      }));
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8 mt-[8%]">
      <div className="grid gap-6 mx-auto lg:grid-cols-3 max-w-7xl">
        {/* Form Section */}
        <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-2">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Shipping Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="shippingName"
                  value={formData.shippingName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
                />
              </div>
            </div>

            {paymentError && (
              <div className="text-sm text-red-600">{paymentError}</div>
            )}

            <button
              type="submit"
              //   disabled={isProcessing}
              className="w-full px-4 py-2 text-lg font-semibold text-white bg-black rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="p-6 bg-white rounded-lg shadow-md h-fit">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Order Summary
          </h2>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (14%):</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between pt-2 text-lg font-bold border-t">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Estimated Delivery Date:{" "}
            <span className="font-medium text-gray-800">
              {new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;