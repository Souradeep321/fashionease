import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-gray-100 border-t border-gray-200 px-6 md:px-20 py-12 text-sm text-gray-700 w-full">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Newsletter Section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-6 md:space-y-0">
                    <div className="text-2xl font-semibold text-black">
                        Stay in the loop with <br /> our latest listings
                    </div>
                    <button className="flex items-center border border-black px-5 py-2 rounded-full hover:bg-black hover:text-white transition duration-300">
                        Subscribe
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </button>
                </div>

                {/* Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* India Address */}
                    <div>
                        <h3 className="font-bold text-black mb-2">India</h3>
                        <p>T: (+91) 98765 43210</p>
                        <p>123 Park Street,</p>
                        <p>Kolkata, West Bengal 700016</p>
                    </div>

                    {/* Office 2 Address */}
                    <div>
                        <h3 className="font-bold text-black mb-2">Corporate Office</h3>
                        <p>T: (+91) 98300 12345</p>
                        <p>Salt Lake Sector V,</p>
                        <p>Kolkata, West Bengal 700091</p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap justify-between gap-6">
                        <div>
                            <h3
                                onClick={() => navigate('/shop')}
                                className="font-bold text-black mb-2 cursor-pointer">
                                Products
                            </h3>
                            <p
                                onClick={() => navigate('/shop')}
                                className="hover:underline cursor-pointer">
                                Shop
                            </p>
                            <p
                                onClick={() => navigate('/about')}
                                className="hover:underline cursor-pointer">
                                Latest News
                            </p>
                        </div>
                        <div className="flex flex-col gap-1"> 
                            <h3 className="font-bold text-black mb-2">Social</h3>
                            <a
                                href="https://github.com/Souradeep321/fashionease/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline cursor-pointer">Instagram
                            </a>
                            <a
                                href="https://github.com/Souradeep321/fashionease/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline cursor-pointer">Pinterest
                            </a>
                            <a
                                href="https://github.com/Souradeep321/fashionease/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline cursor-pointer">YouTube
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 mt-10 border-t pt-6">
                    <p>© 2025 All Rights Reserved</p>
                    <div className="flex gap-4 mt-2 md:mt-0">
                        <Link to={"#"} className="hover:underline">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
