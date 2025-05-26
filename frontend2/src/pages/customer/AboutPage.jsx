import { FaTruck, FaShieldAlt, FaSmile } from 'react-icons/fa';
import ment1 from "../../assets/mens/ment1.png"
import Footer from '../../components/Footer';

const AboutPage = () => {

    const teamMembers = [
        {
            name: 'John Doe',
            role: 'CEO',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
        },
        {
            name: 'Jane Smith',
            role: 'COO',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
        },
        {
            name: 'Bob Johnson',
            role: 'CTO',
            image: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
    ]

  return (
    <div className="min-h-screen pt-20 bg-gray-50 mt-[2%] overflow-auto hide-scrollbar">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gray-900">
        <div className="max-w-6xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">About Our Company</h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-300">
            Dedicated to providing exceptional quality and service since our founding
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="md:w-1/2">
              <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
              <p className="mb-4 text-gray-600">
                Founded in 2025, we started as a small team passionate about bringing 
                high-quality products to our community. What began as a local boutique 
                has grown into a trusted international ecommerce platform serving 
                millions of customers worldwide.
              </p>
              <p className="text-gray-600">
                Our commitment to quality, sustainability, and customer satisfaction 
                has remained at the core of everything we do.
              </p>
            </div>
            <div className="md:w-1/2">
              <img 
                src={ment1} 
                alt="Our Team" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaTruck className="text-4xl text-blue-600" />
              </div>
              <h3 className="mb-4 text-xl font-semibold">Fast Shipping</h3>
              <p className="text-gray-600">We deliver products quickly and reliably</p>
            </div>
            
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaShieldAlt className="text-4xl text-green-600" />
              </div>
              <h3 className="mb-4 text-xl font-semibold">Secure Shopping</h3>
              <p className="text-gray-600">100% protected transactions and data security</p>
            </div>

            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <FaSmile className="text-4xl text-yellow-600" />
              </div>
              <h3 className="mb-4 text-xl font-semibold">Customer Happiness</h3>
              <p className="text-gray-600">Dedicated 24/7 support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {teamMembers.map(member => (
              <div key={member.id} className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="object-cover w-full h-64"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 text-white bg-gray-900">
        <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            <div className="p-4">
              <div className="mb-2 text-4xl font-bold">10M+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div className="p-4">
              <div className="mb-2 text-4xl font-bold">150+</div>
              <div className="text-gray-300">Brand Partners</div>
            </div>
            <div className="p-4">
              <div className="mb-2 text-4xl font-bold">50+</div>
              <div className="text-gray-300">Countries Served</div>
            </div>
            <div className="p-4">
              <div className="mb-2 text-4xl font-bold">24/7</div>
              <div className="text-gray-300">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-3xl font-bold">Join Our Journey</h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-600">
            We're always looking for passionate individuals to join our team and help 
            shape the future of ecommerce.
          </p>
          <button className="px-8 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            View Career Opportunities
          </button>
        </div>
      </section> */}
      <Footer />
    </div>
  );
};

export default AboutPage;
