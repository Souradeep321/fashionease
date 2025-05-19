import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function CustomSwiper({ className, slides }) {
    return (
        <Swiper
            className={`${className} rounded-sm`}
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            loop={true}
        >
            {slides.map((slide, index) => (
                <SwiperSlide
                    key={index}
                    style={{
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                    }}
                    className="w-full"
                >
                    <div className="h-full w-full md:w-[50%] flex flex-col items-start justify-end gap-5 text-white text-center ">
                        <div className='p-5 bg-white bg-opacity-[.5] text-black w-full flex flex-col items-start justify-center'>
                            <h1 className="text-3xl">{slide.title}</h1>
                            <p className="text-2xl">{slide.description}</p>
                            {/* <button className="relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/40 transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/60 animate-pulse group overflow-hidden">
                                <span className="absolute inset-0 w-full h-full transition-opacity duration-500 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 group-hover:opacity-30 blur-sm"></span>
                                <span className="relative z-10">✨ Fancy Button ✨</span>
                            </button> */}
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

