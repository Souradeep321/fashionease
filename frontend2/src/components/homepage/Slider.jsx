import { useState, useEffect } from "react";

export default function Slider({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-[500px] md:h-[80vh] overflow-auto hide-scrollbar">
      <div
        className="w-full h-full duration-700 ease-in-out bg-center bg-cover"
        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
      ></div>

      {/* Text Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-white/90 md:w-1/2">
        <h2 className="text-xl font-bold uppercase">{slides[currentIndex].title}</h2>
        <p className="mt-1 text-gray-600">{slides[currentIndex].subtitle}</p>
        <div className="w-10 h-0.5 bg-red-500 mt-3" />
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute text-2xl text-white transform -translate-y-1/2 top-1/2 left-4"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute text-2xl text-white transform -translate-y-1/2 top-1/2 right-4"
      >
        ❯
      </button>
    </div>
  );
}
