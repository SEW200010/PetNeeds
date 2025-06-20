import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Sample images (Replace these with your actual images)
const images = [
    "/Home_images/image1.jpg",
    "/Home_images/image2.jpg",
    "/Home_images/image3.jpg",
  ];

const ImageSlider = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        className="rounded-lg shadow-lg"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={img} alt={`Slide ${index + 1}`} className="w-full object-cover h-40 sm:h-60 md:h-80 lg:h-96 xl:h-[500px] rounded-lg" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
