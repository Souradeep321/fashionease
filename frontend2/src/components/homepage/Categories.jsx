import { Link } from 'react-router-dom';
import { ShoppingBag, Shirt, Dumbbell } from 'lucide-react'; // Example icons from lucide-react

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Women's Fashion",
      icon: <ShoppingBag className="w-8 h-8 text-white" />,
      image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=687&q=80",
      route: "/womens"
    },
    {
      id: 2,
      name: "Men's Fashion",
      icon: <Shirt className="w-8 h-8 text-white" />,
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=736&q=80",
      route: "/mens"
    },
    {
      id: 3,
      name: "Activewear",
      icon: <Dumbbell className="w-8 h-8 text-white" />,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1170&q=80",
      route: "/womens/jeans"
    }
  ];

  return (
    <section className="px-4 py-16 bg-white sm:px-6 lg:px-8 overflow-auto hide-scrollbar">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="mb-3 text-3xl font-light text-gray-900 md:text-4xl">Shop by Category</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">Explore top categories in fashion</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {categories.map((category) => (
            <Link
              to={category.route}
              key={category.id}
              className="relative overflow-hidden transition-all duration-300 shadow-lg group rounded-xl hover:shadow-2xl"
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="object-cover w-full h-48 transition-transform duration-500 sm:h-56 md:h-72 group-hover:scale-110"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:opacity-100"></div>

              {/* Icon and Name */}
              <div className="absolute bottom-0 left-0 flex flex-col items-start justify-end w-full p-6">
                <div className="mb-2">{category.icon}</div>
                <h3 className="text-2xl font-semibold text-white transition-transform duration-300 group-hover:-translate-y-2">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
