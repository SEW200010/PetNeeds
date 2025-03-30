import Footer from "../components/Footer";
import Header from "../components/Header";
import ImageSlider from "../components/ImageSlider";
import { useState,useEffect } from "react";
import UpcomingEvents from "../components/UpcomingEvents";
import FeaturedEventsSlider from "../components/FeaturedEventSlider";
import { FaArrowRight } from "react-icons/fa";

const images = [
    "/Home_images/image1.jpg",
    "/Home_images/image2.jpg",
    "/Home_images/image3.jpg",
  ];

const Home = () => {
    const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div>
      <Header />
      </div>
      <main className="bg-gray-100 pt-[75px]">
        {/* Hero Section */}
        <section className="relative h-[500px] bg-cover bg-center flex flex-col items-center justify-center text-center" 
        style={{
              backgroundImage: `url(${images[currentImage]})`,
              transition: "background-image 1s ease-in-out",
        }}>
          <h1 className="text-5xl text-white font-bold">Your Journey Begins Here</h1>
          <p className="mt-4 text-3xl text-green-700">Empower. Lead. Transform.</p>
          <button className="mt-6 bg-black text-white px-6 py-3 flex rounded-md hover:bg-green-600 hover:scale-110">Explore about Us
          <FaArrowRight className="w-10 h-5 transform translate-y-1"/>
          </button>
        </section>

        {/* About Section */}
        <section className="grid grid-cols-2 p-20 text-center bg-white">
          <div className="p-5 text-justify text-base/10">
          <h2 className="text-3xl font-bold mb-4">Welcome to <span className="text-green-500">Varppu counselling</span></h2>
          <p>The "வார்ப்பு" (Varppu) Life Skills Development Programme is a comprehensive initiative launched by the University of Jaffna to address the social challenges faced by Sri Lankan youth, particularly in the Northern Province. This community-centered initiative focuses on educational training and activity-based learning to nurture responsible, resilient young leaders who are capable of contributing to sustainable societal development.</p>
          </div>
          <div>
          <ImageSlider />
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="p-10 bg-gray-300">
            <UpcomingEvents />
        </section>


        {/* Featured Events */} 
        <section className="p-10 bg-white relative">
          {/* Content */}
          <h2 className="text-3xl font-bold text-center mb-6">
              Featured <span className="text-green-500">Events</span>
          </h2>
            <div>
              <FeaturedEventsSlider />
            </div>
        </section>


        {/* Impact Section */}
        <section className="p-10 grid-rows-2 bg-white text-center">
          <div className="underline underline-offset-8">
          <h2 className="text-3xl font-bold">Our <span className="text-green-500">Impact at a Glance</span></h2>
          </div>
          <div className="grid grid-cols-4 gap-8 mt-6">
            <div className="grid gap-6 mt-6">
              <div className="p-10 bg-green-200 hover:scale-105 shadow-md rounded-2xl">
                <h3 className="text-5xl font-bold text-green-700">20+</h3>
                <p className="text-2xl font-bold text-green-700">Events Conducted</p>
                <p className="text-black">Total workshops & Sessions</p>
              </div>
            </div>
            <div className="grid gap-6 mt-6">
              <div className="p-10 bg-green-200 hover:scale-105 shadow-md rounded-2xl">
                <h3 className="text-5xl font-bold text-green-700">15+</h3>
                <p className="text-2xl font-bold text-green-700">Student Mentored</p>
                <p className="text-black">Total workshops & Sessions</p>
              </div>
            </div>
            <div className="grid gap-6 mt-6">
              <div className="p-10 bg-green-200 hover:scale-105 shadow-md rounded-2xl">
                <h3 className="text-5xl font-bold text-green-700">10+</h3>
                <p className="text-2xl font-bold text-green-700">Years of Experience</p>
                <p className="text-black">Total workshops & Sessions</p>
              </div>
            </div>
            <div className="grid gap-6 mt-6">
              <div className="p-10 bg-green-200 hover:scale-105 shadow-md rounded-2xl">
                <h3 className="text-5xl font-bold text-green-700">10+</h3>
                <p className="text-2xl font-bold text-green-700">Areas Covered</p>
                <p className="text-black">Total workshops & Sessions</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button className="mt-6 bg-black text-white px-6 py-3 flex rounded-md hover:bg-green-600 hover:scale-110">Explore about Us
            <FaArrowRight className="w-10 h-5 transform translate-y-1"/>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;