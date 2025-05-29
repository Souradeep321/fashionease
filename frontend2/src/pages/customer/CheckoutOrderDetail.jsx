import { useNavigate } from 'react-router-dom';
import { useGetProfileQuery } from '../../redux/authApi';
import { useGetAllOrderItemsQuery, useGetOrderDetailsQuery } from '../../redux/orderApi';

const CheckOrderDetail = () => {
  const navigate = useNavigate();
  const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useGetProfileQuery();
  const { data: orders, isLoading: isLoadingOrders, isError: isErrorOrders } = useGetOrderDetailsQuery();
  const { data: orderItems, isLoading: isLoadingItems, isError: isErrorItems } = useGetAllOrderItemsQuery();
  console.log('orders', orders)
  console.log('orderItems', orderItems)
  const orderConfirm = !!orders
  console.log('orderConfirm', orderConfirm)




  const userOrders = orders?.filter(order => order.userId === user.id);
  console.log('userOrders', userOrders)

  return (
    <div className="min-h-screen bg-[#f6f6f4] text-[#111] flex flex-col lg:flex-row justify-between px-6 py-12 lg:px-20 gap-12 mt-[70px] md:mt-[117px]">

      {/* LEFT SIDE: Thank You Message */}
      <div className="lg:w-[50%]">
        <h1 className="text-3xl lg:text-4xl font-semibold mb-6">
          Thank you for shopping with <span className="font-bold">Fashionease</span>.
          <br className="hidden lg:block" /> You’ve made a great choice
        </h1>

        {orderConfirm ? (
          <div>
            <p className="text-base text-gray-700 mb-4">
              Confirmation email has been sent to your email with order and shipping details.
            </p>
            <div className="text-sm text-gray-700 mb-10 space-y-4 leading-relaxed">
              <p>Hello,</p>
              <p>
                Your order has been successfully completed and will be delivered to you in the near future.
                You can track the delivery status in your account. You will also receive a notification with a
                link to track the parcel from our partner courier.
              </p>
              <p>— Fashionease</p>
            </div>
          </div>
        ) : null}
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2 border border-black text-black rounded hover:bg-black hover:text-white transition">
          Back to store
        </button>
      </div>

      {/* RIGHT SIDE: Order Summary */}
      <div className="lg:w-[50%] bg-white rounded-xl shadow-md p-6 h-fit">
        <h2 className="text-xl font-semibold mb-6 border-b pb-2">Order Summary</h2>
        {isLoadingUser || isLoadingOrders || isLoadingItems ?
          (
            <p className="text-gray-500">Loading order details...</p>
          ) : null}
        {isErrorUser || isErrorOrders || isErrorItems ?
          (
            <div>
              <p className="text-gray-500 lg:text-xl text-base">You have no orders yet.</p>
              <button
                onClick={() => navigate('/shop')}
                className="mt-4 px-6 py-1 border border-black text-black rounded hover:bg-black hover:text-white transition"
              >shop</button>
            </div>
          ) :
          null}

        {userOrders?.length === 0 ? (
          <p className="text-gray-500">You have no orders yet.</p>
        ) : (
          userOrders?.map((order) => {
            const items = orderItems?.filter(item => item.orderId === order.id);

            return (
              <div key={order.id} className="mb-10 space-y-6">
                <div className="text-sm text-gray-700 space-y-1">
                  <p><span className="font-semibold">Order No:</span> #{order.id}</p>
                  <p><span className="font-semibold">Est Delivery Date:</span> {(new Date(order.createdAt)).toLocaleDateString()}</p>
                  <p><span className="font-semibold">Shipping details:</span> {order.shippingName}</p>
                  <p>
                    {order.shippingAddress}, {order.city}, {order.state}, {order.country} - {order.postalCode}
                  </p>
                </div>

                <div className="space-y-4 border-t pt-4">
                  {items?.map((item) => (
                    <div key={item?.id} className="flex items-center gap-4">
                      <img
                        src={item?.image}
                        alt={item?.title}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="text-sm">
                        <p className="font-medium">{item?.title}</p>
                        <p className="text-gray-500">₹{item?.price} × {item?.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-right font-semibold text-base pt-4 border-t">
                  Total: ₹{order?.totalAmount}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div >
  );
};

export default CheckOrderDetail;
