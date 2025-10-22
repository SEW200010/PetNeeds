import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import defaultImg from "../assets/Home_images/varrpu_flyer.png";
import { useNavigate } from "react-router-dom";

const UpcomingEvents = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/upcoming-events"); // if logged in
    } else {
      navigate("/login"); // if not logged in
    }
  };

  const sliderRef = useRef(null);
  const [events, setEvents] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState([]);

  const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  // optional (if your API requires auth)
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  // ✅ Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API}/upcoming-events`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: userId ? { user_id: userId } : {},
        });

        // If no image provided, assign a default image
        const updatedEvents = res.data.map((event) => ({
          ...event,
          image: event.image ? event.image : defaultImg,
        }));

        setEvents(updatedEvents);
        setVisibleEvents(updatedEvents.slice(0, 4));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Scroll left
  const scrollLeft = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
  };

  // ✅ Scroll right
  const scrollRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  // ✅ Auto scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(scrollRight, 5000);
    return () => clearInterval(interval);
  }, [events]);

  // ✅ Update visible events on index change
  useEffect(() => {
    if (events.length > 0) {
      const nextEvents = [
        ...events.slice(currentIndex),
        ...events.slice(0, currentIndex),
      ];
      setVisibleEvents(nextEvents.slice(0, 4));
    }
  }, [currentIndex, events]);

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
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-hidden p-2 justify-center"
        >
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
              <button
                onClick={handleJoinClick}
                className="mt-3 bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 text-sm"
              >
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
