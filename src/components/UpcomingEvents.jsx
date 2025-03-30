import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const events = [
  { id: 1, image: "/event1.jpg", title: "Event One", description: "Brief description of event one." },
  { id: 2, image: "/event2.jpg", title: "Event Two", description: "Brief description of event two." },
  { id: 3, image: "/event3.jpg", title: "Event Three", description: "Brief description of event three." },
  { id: 4, image: "/event4.jpg", title: "Event Four", description: "Brief description of event four." },
  { id: 5, image: "/event5.jpg", title: "Event Five", description: "Brief description of event five." },
];

const UpcomingEvents = () => {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="p-10 bg-gray-300 relative">
      <h2 className="text-3xl font-bold text-center mb-6">
        Upcoming <span className="text-green-500">Events</span>
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
        <div ref={sliderRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar p-2">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-4 shadow-md rounded-lg min-w-[250px]">
              <img src={event.image} alt={event.title} className="w-full h-40 object-cover rounded-md" />
              <h3 className="text-lg font-bold mt-2">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.description}</p>
              <button className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
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
    </section>
  );
};

export default UpcomingEvents;