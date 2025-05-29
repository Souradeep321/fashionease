import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useNavigate } from 'react-router-dom';

export default function CustomSwiper({ className, slides }) {
    const navigate = useNavigate();
    return (
        <Swiper
            className={`${className} max-w-[1280px] h-screen`}
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            loop={true}
            pagination={{ clickable: true }}
        >
            {slides.map((slide, index) => (
                <SwiperSlide key={index}>
                    <div className="flex flex-col md:flex-row h-screen w-full">
                        {/* Left Section - Image */}
                        <div
                            className="w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        ></div>

                        {/* Right Section - Text */}
                        <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-start px-10 bg-[#f5f5f5] text-black relative">

                            <h2 className="text-4xl md:text-6xl font-serif uppercase leading-tight">
                                {slide.title}
                            </h2>
                            <p className="mt-6 text-base md:text-lg max-w-md">{slide.description}</p>

                            <div className="mt-8 flex gap-4">
                                <button 
                                onClick={() => navigate('/mens')}
                                className="bg-black text-white px-4 py-2 text-sm hover:bg-white hover:text-black border border-black transition">
                                    MENS
                                </button>

                                <button
                                  onClick={() => navigate('/womens')}
                                 className="bg-transparent text-black px-4 py-2 text-sm border border-black hover:bg-black hover:text-white transition">
                                    WOMENS
                                </button>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
