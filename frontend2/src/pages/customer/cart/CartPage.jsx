import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/common/Loader';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import {
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useDeleteFromCartMutation,
  useFetchCartItemsQuery,
} from '../../../redux/cartApi';
import { useGetProfileQuery } from '../../../redux/authApi';
import { toast } from 'react-hot-toast';
import Footer from '../../../components/Footer';

const CartPage = () => {
  const navigate = useNavigate();
  const { data: user } = useGetProfileQuery();
  const {
    data: cartData,
    isLoading: cartLoading,
    refetch,
  } = useFetchCartItemsQuery();
  console.log('cartData', cartData)

  const isAuthenticated = !!user;

  const [addToCart, { isLoading: adding }] = useAddToCartMutation();
  const [updateCartItem, { isLoading: updating }] = useUpdateCartItemMutation();
  const [deleteFromCart, { isLoading: deleting }] = useDeleteFromCartMutation();


  useEffect(() => {
    refetch();
  }, [refetch]);

  // cartData is [ {cartItems}, {cart}, {total} ]
  const cartItemsArray = cartData?.cart || [];
  const subtotal = cartData?.total || 0;
  const tax = Math.round(subtotal * 0.14);
  const total = subtotal + tax;

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-poppins flex flex-col items-center justify-center">
        <p className="text-3xl font-playfair font-bold text-gray-900 mb-2 flex items-center justify-center gap-4">
          <ShoppingBag size={24} />
          Login to view your cart
        </p>
        <button
          className="bg-black hover:bg-gray-800 text-white py-2.5 px-12 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md mt-2"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </div>
    );
  }

  if (cartLoading) return <Loader />;


  if (cartItemsArray.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-poppins flex flex-col items-center justify-center">
        <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2 flex items-center justify-center gap-4">
          <ShoppingBag size={24} />
          YOUR SHOPPING BAG IS EMPTY
        </h1>
        <p className="text-gray-500 mb-4">Looks like you haven't added anything to your cart yet.</p>
        <button
          className="bg-black hover:bg-gray-800 text-white py-3.5 px-6 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
          onClick={() => navigate('/shop')}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-[70px] px-4 sm:px-6 lg:px-8 font-poppins lg:py-[130px]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-2">YOUR SHOPPING BAG</h1>
              <button
                className="hidden lg:block bg-black hover:bg-gray-800 text-white py-3.5 px-6 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
                onClick={() => navigate('/shop')}
              >
                Continue Shopping
              </button>
            </div>
            <div className="flex items-center mt-2">
              <span className="text-gray-500 text-sm">{cartItemsArray.length} items in your cart</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gray-100">
                  <div className="col-span-5 font-medium text-gray-500 uppercase text-sm">Product</div>
                  <div className="col-span-2 font-medium text-gray-500 uppercase text-sm text-center">Price</div>
                  <div className="col-span-2 font-medium text-gray-500 uppercase text-sm text-center">Quantity</div>
                  <div className="col-span-2 font-medium text-gray-500 uppercase text-sm text-center">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Cart Item Rows */}
                {cartItemsArray.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 border-b border-gray-100 last:border-0">
                    {/* Product Info */}
                    <div className="md:col-span-5 flex items-start space-x-4">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={item.product?.image || "/placeholder.jpg"}
                          alt={item.product?.title || "Product"}
                          className="w-full h-full object-cover"
                          onClick={() => navigate(`/product/${item.product.id}`)}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.product?.title}</h3>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="md:col-span-2 flex md:items-center justify-center">
                      <span className="font-medium text-gray-900">₹{item.product?.price}</span>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-2 flex md:items-center justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          disabled={updating}
                          onClick={async () => {
                            try {
                              await updateCartItem(item.id).unwrap();
                              toast.success('Removed one');
                            } catch {
                              toast.error('Error updating quantity');
                            }
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 text-gray-900">{item.quantity}</span>
                        <button
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          disabled={adding}
                          onClick={async () => {
                            try {
                              await addToCart(item.product.id).unwrap();
                              toast.success('Added one');
                            } catch {
                              toast.error('Error adding item');
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="md:col-span-2 flex md:items-center justify-center">
                      <span className="font-medium text-gray-900">₹{(item.product?.price * item.quantity).toFixed(2)}</span>
                    </div>

                    {/* Remove */}
                    <div className="md:col-span-1 flex md:items-center justify-end">
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        disabled={deleting}
                        onClick={async () => {
                          try {
                            await deleteFromCart(item.id).unwrap();
                            toast.success('Item removed');
                          } catch {
                            toast.error('Error removing item');
                          }
                        }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-96 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h3 className="text-lg font-playfair font-bold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax 14%</span>
                    <span className="font-medium">₹{tax}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">₹{total}</span>
                  </div>
                </div>

                <button className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-3.5 px-6 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </button>

                <p className="mt-4 text-center text-sm text-gray-500">
                  Free returns · Secure payment · Satisfaction guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;