import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery, useGetRandomProductsQuery } from "../../redux/productApi";
import { useAddToCartMutation } from "../../redux/cartApi";
import { useGetProfileQuery } from "../../redux/authApi";
import { toast } from "react-hot-toast";
import Loader from "../../components/common/Loader";

const TrendingProducts = () => {
  const navigate = useNavigate();
  const { data: products, error, isError, isLoading } = useGetRandomProductsQuery();
  const productList = products?.products?.slice(0, 5) || [];

  const { data: userData, refetch, isLoading: profileLoading } = useGetProfileQuery();
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();
  const isAuthenticated = !!userData;

  useEffect(() => {
    refetch();
  }, [refetch]);


  const themeColors = {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-gray-100 hover:bg-gray-200",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-gray-200",
  };

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div
        className={`w-full ${themeColors.textPrimary} flex h-screen justify-center items-center`}
      >
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center overflow-auto hide-scrollbar">
      <div className="flex flex-col items-start justify-between mb-8 md:flex-row md:items-center ">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Trending Products
          </h1>
          <p className="mt-2 text-gray-600">
            Discover this week's most wanted items
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {productList.map((product) => (
          <div key={product.id} className="relative group">
            <div className="relative mb-4 overflow-hidden h-72 bg-gray-50 rounded-xl">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 cursor-pointer group-hover:scale-105"
                  onClick={() => navigate(`/product/${product.id}`)}
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  <span>Product Image</span>
                </div>
              )}
              <div className="absolute px-2 py-1 text-xs font-medium rounded-full top-3 left-3 bg-white/90 backdrop-blur-sm">
                {product.category}
              </div>
              <button
                onClick={async () => {
                  if (!isAuthenticated) {
                    navigate("/login");
                    return;
                  }
                  try {
                    const res = await addToCart(product?.id).unwrap();
                    toast.success(res.message || "Added to cart!");
                  } catch (error) {
                    toast.error(error.data?.error || error.error || "Failed to add to cart");
                  }
                }}
                className="absolute p-2 text-black transition-all duration-300 rounded-full shadow-sm opacity-0 bottom-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white group-hover:opacity-100"
                aria-label={`Add ${product.name} to cart`}
                disabled={adding}
              >
                <svg
                  className="w-5 h-5 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>

            <div className="px-1">
              <h2 className="font-medium text-gray-900 transition-colors cursor-pointer group-hover:text-gray-600">
                {product.title}
              </h2>
              <p className="text-sm text-gray-500">
                {product.color || "Various colors"}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="font-semibold text-gray-900">${product.price}</p>
                <button
                  onClick={async () => {
                    if (!isAuthenticated) {
                      navigate("/login");
                      return;
                    }
                    try {
                      const res = await addToCart(product?.id).unwrap();
                      toast.success(res.message || "Added to cart!");
                    } catch (error) {
                      toast.error(error.data?.error || error.error || "Failed to add to cart");
                    }
                  }}
                  className="flex items-center justify-center gap-1 px-4 py-2 text-xs font-medium text-white transition-all duration-300 rounded-full shadow-md group lg:hidden bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 hover:shadow-lg active:scale-95"
                  disabled={adding}
                >
                  <span className="transition-all duration-300 ease-in-out transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </span>
                  <span className="transition-all duration-300 ease-in-out group-hover:ml-1">
                    {adding ? "Adding..." : "Add to Cart"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="#"
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-full hover:bg-gray-50"
        >
          Load More Products
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default TrendingProducts;
