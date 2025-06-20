import { FaArrowRight } from "react-icons/fa";

const images = [
  "/Home_images/image1.jpg",
  "/Home_images/image2.jpg",
  "/Home_images/image3.jpg",
  "/Home_images/image4.jpg",
  "/Home_images/image5.jpg",
  "/Home_images/image6.jpg",
  "/Home_images/image7.jpg",
  "/Home_images/image8.jpg",
];

const FeaturedEventsSlider = () => {
  return (
    <section className="relative p-10 bg-gray-100 overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-10 text-emerald-700 underline underline-offset-8">
        Featured <span className="text-black">Events</span>
      </h2>

      <div className="space-y-8">
        {/* Top Row - Move Left */}
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-left-scroll">
            {[...images.slice(0, 4), ...images.slice(0, 4)].map((src, idx) => (
              <img
                key={`top-${idx}`}
                src={src}
                alt={`event-${idx}`}
                className="h-56 w-80 object-cover rounded-xl shadow-md"
              />
            ))}
          </div>
        </div>

        {/* Bottom Row - Also Move Left (slightly slower or delayed) */}
        <div className="overflow-hidden">
          <div className="flex gap-4 animate-left-scroll-slow">
            {[...images.slice(4, 8), ...images.slice(4, 8)].map((src, idx) => (
              <img
                key={`bottom-${idx}`}
                src={src}
                alt={`event-${idx}`}
                className="h-56 w-80 object-cover rounded-xl shadow-md"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <h3 className="text-lg text-gray-700">Join us for exciting upcoming events!</h3>
        <button className="mt-6 bg-emerald-600 text-white px-6 py-3 flex items-center rounded-md hover:bg-green-600 hover:scale-110 transition-all">
          Explore More
          <FaArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-left-scroll {
          animation: scroll-left 20s linear infinite;
          width: max-content;
        }

        .animate-left-scroll-slow {
          animation: scroll-left 25s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
};

export default FeaturedEventsSlider;
