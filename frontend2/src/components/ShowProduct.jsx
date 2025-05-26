import { useNavigate, useParams } from 'react-router-dom';
import Loader from './common/Loader';
import { useGetRandomProductsQuery } from '../redux/productApi';
import { ShoppingCart } from 'lucide-react';
import { useAddToCartMutation } from '../redux/cartApi';
import { toast } from 'react-hot-toast';
import { useGetProfileQuery } from '../redux/authApi';
import { useEffect } from 'react';

const ShowProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();
  const { data: userData, refetch, isLoading: profileLoading } = useGetProfileQuery();
  const { data: products, error, isError, isLoading } = useGetRandomProductsQuery();

  const productList = products?.products || [];
  const singleProduct = productList.find((product) => product.id === Number(id));
  const isAuthenticated = !!userData;

  // Get similar products by category and gender
  const similarProducts = singleProduct
    ? productList
      .filter(
        (product) =>
          product.id !== singleProduct.id &&
          product.category === singleProduct.category &&
          product.gender?.toLowerCase() === singleProduct.gender?.toLowerCase()
      )
      .slice(0, 4)
    : [];



  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const res = await addToCart(id).unwrap();
      toast.success(res.message || "Added to cart!");
    } catch (err) {
      toast.error(err.data?.error || err.error || "Failed to add to cart");
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);


  if (isLoading) return <Loader />;

  if (error || isError) {
    return (
      <p className="w-full text-2xl flex h-screen justify-center items-center text-red-500">
        Error: {error?.message || 'Something went wrong'}
      </p>
    );
  }

  return (
    <>
      {singleProduct ? (
        <div className="p-6 md:p-10 max-w-[1200px] mx-auto mt-[80px]">
          {/* Product Info */}
          <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden">
            {/* Image */}
            <div className="md:w-1/2 p-4 flex items-center justify-center bg-gray-100">
              <img
                src={singleProduct.image}
                alt={singleProduct.title}
                className="object-contain h-96 rounded-lg shadow-md transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Details */}
            <div className="md:w-1/2 flex flex-col justify-between p-6 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{singleProduct.title}</h1>
                <p className="text-xl text-green-600 font-semibold mt-2">${singleProduct.price}</p>
                <p className="text-gray-700 text-md mt-4">{singleProduct.description}</p>
              </div>
              <div className="flex gap-4 pt-4">
                <button className="bg-black hover:bg-gray-800 font-semibold text-white px-6 py-2 rounded-lg shadow-md transition"
                  onClick={handleAddToCart}
                  disabled={adding}
                >
                  Add to Cart
                </button>
                <button className="bg-blue-700 hover:bg-blue-600 font-semibold text-white px-6 py-2 rounded-lg shadow-md transition"
                  onClick={async () => {
                    if (!isAuthenticated) {
                      navigate("/login");
                      return;
                    }
                    try {
                      const res = await addToCart(id).unwrap();
                      toast.success(res.message || "Added to cart!");
                      navigate("/cart");
                    } catch (err) {
                      toast.error(err.data?.error || err.error || "Failed to add to cart");
                    }
                  }}
                  disabled={adding}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Similar Products Header */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mt-12 mb-6">
            Checkout Similar Products
          </h2>

          {/* Similar Products List */}
          <div className="max-w-[1280px] mx-auto flex flex-wrap justify-center gap-6 px-4  rounded-lg py-6">
            {similarProducts.map((product) => (
              <a
                href={`/product/${product.id}`}
                key={product.id}
                className="group bg-white rounded shadow-md md:w-[230px] sm:w-48 w-[169px] overflow-hidden relative">
                {/* Image Section */}
                <div className="bg-gray-200 md:h-[300px] sm:h-60 h-44 flex items-center justify-center relative overflow-hidden">
                  {product?.image ? (
                    <img
                      src={product?.image}
                      alt={product?.title}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}

                  {/* Hover Cart Section */}
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-10">
                    <div className="flex items-center bg-black">
                      <button
                        onClick={(e) => {
                          e.preventDefault();     // Prevent anchor navigation
                          e.stopPropagation();    // Stop event bubbling to anchor
                          try {
                            if (!isAuthenticated) {
                              navigate("/login");
                              return;
                            }
                            addToCart(product.id).unwrap()
                              .then((res) => {
                                toast.success(res.message || "Added to cart!");
                                refetch();
                              })
                              .catch((error) => {
                                toast.error(error.data?.error || error.error || "Failed to add to cart");
                              });
                          } catch (error) {
                            toast.error(error.data?.error || error.error || "Failed to add to cart");
                          }
                        }}
                        disabled={adding}
                        className="flex-1 text-white flex items-center justify-center gap-2 py-3 hover:bg-gray-900 transition"
                      >
                        <ShoppingCart size={16} />
                        {adding ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Title and Price */}
                <div className="text-center py-3 space-y-1">
                  <p className="text-xs md:text-sm text-gray-800 font-bold">{product?.title}</p>
                  <p className="text-xs md:text-sm text-gray-800">
                    {product?.description.length > 100 ? `${product?.description.slice(0, 20)}...` : description}
                  </p>
                  <p className="text-sm md:text-base font-semibold">₹{product?.price}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className="w-full text-2xl flex h-screen justify-center items-center text-gray-500">
          Product not found
        </p>
      )}
    </>
  );
};

export default ShowProduct;
