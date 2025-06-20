import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import img1 from "../assets/Home_images/flyer1.jpg";
import img2 from "../assets/Home_images/flyer2.jpg";
import img3 from "../assets/Home_images/flyer3.jpg";
import img4 from "../assets/Home_images/flyer4.jpg";

const events = [
  { id: 1, image: img1, title: "Event One", description: "Brief description of event one." },
  { id: 2, image: img2, title: "Event Two", description: "Brief description of event two." },
  { id: 3, image: img3, title: "Event Three", description: "Brief description of event three." },
  { id: 4, image: img4, title: "Event Four", description: "Brief description of event four." },
  { id: 5, image: img1, title: "Event Five", description: "Brief description of event five." },
  { id: 6, image: img2, title: "Event Six", description: "Brief description of event six." },
];

const UpcomingEvents = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState(events.slice(0, 4)); // Show only 4

  const scrollLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  const scrollRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nextEvents = [
      ...events.slice(currentIndex),
      ...events.slice(0, currentIndex),
    ];
    setVisibleEvents(nextEvents.slice(0, 4)); // Show only 4
  }, [currentIndex]);

  return (
    <section className="p-10 bg-gray-300 relative">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center underline underline-offset-8 mb-4 md:mb-6">
        Upcoming <span className="text-emerald-600">Events</span>
      </h2>

      <div className="relative">
        {/* Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full shadow-md hover:bg-green-700 z-10"
        >
          <FaChevronLeft size={20} />
        </button>

        {/* Event Slider */}
        <div ref={sliderRef} className="flex gap-4 overflow-hidden p-2 justify-center">

          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white p-3 shadow-md rounded-lg min-w-[220px] sm:min-w-[250px] md:min-w-[280px] lg:min-w-[300px]"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-base font-semibold mt-2">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.description}</p>
              <button className="mt-3 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm">
                Join
              </button>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full shadow-md hover:bg-green-700 z-10"
        >
          <FaChevronRight size={20} />
        </button>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default UpcomingEvents;
