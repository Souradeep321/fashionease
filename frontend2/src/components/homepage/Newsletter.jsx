import React from 'react';

const Newsletter = () => {
  return (
    <section className="py-16 bg-gray-50 overflow-auto hide-scrollbar">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="mb-4 text-3xl font-light text-gray-900 md:text-4xl">
            Join Our Newsletter
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
          </p>
          
          <form className="mb-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 transition-all bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                  aria-label="Email address for newsletter subscription"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
              </div>
              <button 
                type="submit" 
                className="px-8 py-3 text-white transition-colors duration-300 transform bg-black rounded-lg hover:bg-gray-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Subscribe
              </button>
            </div>
          </form>
          
          <p className="text-sm text-gray-500">
            By signing up, you agree to our{' '}
            <a href="#" className="underline transition-colors hover:text-gray-700">
              Privacy Policy
            </a>{' '}
            and to receive marketing emails.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;