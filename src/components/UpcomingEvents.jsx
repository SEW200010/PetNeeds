import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const events = [
  { id: 1, image: "/event1.jpg", title: "Event One", description: "Brief description of event one." },
  { id: 2, image: "/event2.jpg", title: "Event Two", description: "Brief description of event two." },
  { id: 3, image: "/event3.jpg", title: "Event Three", description: "Brief description of event three." },
  { id: 4, image: "/event4.jpg", title: "Event Four", description: "Brief description of event four." },
  { id: 5, image: "/event5.jpg", title: "Event Five", description: "Brief description of event five." },
  { id: 6, image: "/event6.jpg", title: "Event Six", description: "Brief description of event six." },
];

const UpcomingEvents = () => {
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the index of the first visible event
  const [visibleEvents, setVisibleEvents] = useState(events.slice(0, 5)); // Initially show the first 5 events

  const scrollLeft = () => {
    // Update the currentIndex to move to the previous set of 5 events
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  };

  const scrollRight = () => {
    // Update the currentIndex to move to the next set of 5 events
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  // Automatically update the index every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight();
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);

  // Update the visible events based on current index
  useEffect(() => {
    const nextEvents = [
      ...events.slice(currentIndex),
      ...events.slice(0, currentIndex),
    ];
    setVisibleEvents(nextEvents.slice(0, 5)); // Show only 5 events at a time
  }, [currentIndex]);

  return (
    <section className="p-10 bg-gray-300 relative">
      <h2 className="text-3xl font-bold text-center mb-6">
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
        <div ref={sliderRef} className="flex gap-6 overflow-hidden p-2">
          {visibleEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white p-4 shadow-md rounded-lg min-w-[250px] sm:min-w-[300px] md:min-w-[400px] lg:min-w-[430px]"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover rounded-md"
              />
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

      <style jsx>{`
        /* Hide the scrollbar for Webkit browsers */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide the scrollbar for Firefox */
        .no-scrollbar {
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default UpcomingEvents;
