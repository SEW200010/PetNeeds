import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";

const images = [
  "/Home_images/image1.jpg",
  "/Home_images/image2.jpg",
  "/Home_images/image3.jpg",
  "/Home_images/image1.jpg",
  "/Home_images/image2.jpg",
  "/Home_images/image3.jpg",
];

const FeaturedEventsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Next Slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Previous Slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <section
      className="relative p-10 h-[500px] flex flex-col items-center justify-center text-center text-white bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
      }}
    >

      {/* Left Button */}
      <button
        onClick={prevSlide}
        className="absolute left-5 bg-white text-black p-2 rounded-full shadow-md hover:bg-emerald-600 z-10"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Right Button */}
      <button
        onClick={nextSlide}
        className="absolute right-5 bg-white text-black p-2 rounded-full shadow-md hover:bg-emerald-600 z-10"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-5 flex justify-center space-x-2 z-10">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === currentIndex ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
      <div className="text-center mb-6">
              <h3 className="mt-4 text-lg">Join us for exciting upcoming events!</h3>
                <button className="mt-6 bg-emerald-600 text-white px-6 py-3 flex item-center rounded-md hover:bg-green-600 hover:scale-110">Explore More 
                    <FaArrowRight className="w-10 h-5 transform translate-y-1"/>
                </button>
        </div>
    </section>
  );
};

export default FeaturedEventsSlider;
