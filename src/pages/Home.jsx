import Footer from "../components/Footer";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import UpcomingEvents from "../components/UpcomingEvents";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import MovingGallery from "../components/MovingGallery";
import img1 from "../assets/Home_images/image1.jpg";
import img2 from "../assets/Home_images/image2.jpg";
import img3 from "../assets/Home_images/image3.png";

const images = [
  img1,img2,img3,
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
      <Header />
      <main className="bg-gray-100 pt-[75px]">
        
        {/* Hero Section */}
        <section
          className="relative h-[400px] md:h-[500px] bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
          style={{
            backgroundImage: `url(${images[currentImage]})`,
            transition: "background-image 1s ease-in-out",
          }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold">
            Your Journey Begins Here
          </h1>
          <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-green-700">
            Empower. Lead. Transform.
          </p>
          <Link
            to="/Aboutus"
            className="mt-4 md:mt-6 bg-black text-white px-5 py-2 md:px-6 md:py-3 flex rounded-md hover:bg-green-600 hover:scale-110 transition-all"
          >
            Explore About Us
            <FaArrowRight className="w-5 h-5 ml-2 transform translate-y-[2px]" />
          </Link>
        </section>

        {/* About Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:p-10 lg:p-20 bg-white items-center">
          
          {/* Text Content */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              Welcome to <span className="text-emerald-600">Varppu Counselling</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg lg:text-xl text-center lg:text-left leading:relaxed">
              The "வார்ப்பு" (Varppu) Life Skills Development Programme is a comprehensive initiative 
              launched by the University of Jaffna to address the social challenges faced by Sri Lankan 
              youth, particularly in the Northern Province. This community-centered initiative focuses 
              on educational training and activity-based learning to nurture responsible, resilient young 
              leaders who are capable of contributing to sustainable societal development.
            </p>
            <Link
              to="/Aboutus"
              className="mt-5 inline-flex items-center bg-black text-white px-5 py-2 md:px-6 md:py-3 rounded-md hover:bg-green-600 hover:scale-105 transition-all"
            >
              Explore About Us
              <FaArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>

          {/* Image Section */}
          <div className="flex justify-center">
            <img
              src="../assets/Home_images/imagesec.jpg"
              alt="About Varppu Counselling"
              className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-lg shadow-lg"
            />
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="p-6 md:p-10 bg-gray-300">
          <UpcomingEvents />
        </section>

        {/* Featured Events */}
        <section className="p-6 md:p-10 bg-white relative">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center underline underline-offset-8 mb-4 md:mb-6">
            Featured <span className="text-emerald-600">Events</span>
          </h2>
          <div>
            <MovingGallery />
          </div>
        </section>

        {/* Impact Section */}
        <section className="p-6 md:p-10 bg-white text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center underline underline-offset-8 mb-4 md:mb-6">
            Our <span className="text-emerald-600">Impact at a Glance</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {[
              { number: "20+", label: "Events Conducted" },
              { number: "15+", label: "Student Mentored" },
              { number: "10+", label: "Years of Experience" },
              { number: "10+", label: "Areas Covered" },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 md:p-10 bg-green-200 hover:scale-105 shadow-md rounded-2xl"
              >
                <h3 className="text-3xl md:text-5xl font-bold text-green-700">{item.number}</h3>
                <p className="text-lg md:text-2xl font-bold text-green-700">{item.label}</p>
                <p className="text-black">Total workshops & Sessions</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Link
              to="/Aboutus"
              className="mt-4 md:mt-6 bg-black text-white px-5 py-2 md:px-6 md:py-3 flex rounded-md hover:bg-green-600 hover:scale-110 transition-all"
            >
              Explore About Us
              <FaArrowRight className="ml-2 w-5 h-5 transform translate-y-[2px]" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
