import Footer from "../components/Footer";
import Header from "../components/Header";
import UpcomingEvents from "../components/UpcomingEvents";
import { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import MovingGallery from "../components/MovingGallery";
import img1 from "../assets/Home_images/image1.jpg";
import img2 from "../assets/Home_images/image2.jpg";
import img3 from "../assets/Home_images/image3.png";
import icon1 from "../assets/Home_images/icon1.png";
import icon2 from "../assets/Home_images/icon2.png";
import icon3 from "../assets/Home_images/icon3.png";
import icon4 from "../assets/Home_images/icon4.png";


const images = [img2, img1, img3,];

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
      <main className="bg-gray-100">

        {/* Hero Section */}
        <section className=" relative  h-[420px] sm:min-h-[500px] md:min-h-[620px] flex items-center justify-center text-center px-4 py-10 md:py-16 overflow-hidden ">
          {/* Background Images */}
          {images.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${image})`,
                opacity: currentImage === index ? 1 : 0,
              }}
            />
          ))}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Text Container */}
          <div className="relative z-10 mx-auto
                  px-4
                  max-w-md sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold leading-tight">
              Your Journey Begins Here
            </h1>

            <p className="mt-3 text-lg sm:text-xl md:text-2xl text-[#25d6a4] font-semibold">
              Empower. Lead. Transform.
            </p>

            <p className="text-white mt-4 text-sm sm:text-base md:text-lg leading-relaxed">
              The "வார்ப்பு" (Varppu) Life Skills Development Programme, launched by the University
              of Jaffna, empowers Sri Lankan youth, especially in the Northern Province, through
              educational training and activity-based learning. It addresses issues such as substance
              abuse, peer pressure, and mental health challenges through the "Manohari" psychosocial
              support system, fostering emotionally resilient and socially responsible young leaders.
            </p>

            <Link to="/Aboutus">
              <button
                className="mt-6 text-white px-6 py-3 text-sm sm:text-base md:text-lg rounded-full hover:bg-green-600 hover:scale-110 transition mx-auto"
                style={{ backgroundColor: "#27987A" }}
              >
                Explore about Us →
              </button>
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:p-10 lg:p-20 bg-white items-center">

          {/* Text Content */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
              Welcome to <span className="text-[#27987A]">Varppu Counselling</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg lg:text-xl text-center lg:text-left leading:relaxed">
              The "வார்ப்பு" (Varppu) Life Skills Development Programme is a comprehensive initiative
              launched by the University of Jaffna to address the social challenges faced by Sri Lankan
              youth, particularly in the Northern Province. This community-centered initiative focuses
              on educational training and activity-based learning to nurture responsible, resilient young
              leaders who are capable of contributing to sustainable societal development.
            </p>

            <Link to="/Aboutus">
              <button className="mt-6 inline-flex text-white px-6 py-3 text-sm sm:text-base md:text-lg flex rounded-full hover:bg-green-600 hover:scale-110 transition duration-300 mx-auto" style={{ backgroundColor: "#27987A" }}>
                Explore about Us →
              </button>
            </Link>
          </div>

          {/* Image Section */}
          <div className="flex justify-center">
            <img
              src="src/assets/Home_images/imagesec.jpg"
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
            Featured <span className="text-[#27987A]">Events</span>
          </h2>
          <div>
            <MovingGallery />
          </div>
        </section>

        {/* Impact Section */}
        <section className="p-2 md:p-10 bg-white text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center underline underline-offset-8 mb-4 md:mb-6">
            Our <span className="text-[#27987A]">Impact at a Glance</span>
          </h2>
          <br />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {[
              { number: "20+", icon: icon1, label: "Events Conducted" },
              { number: "15+", icon: icon2, label: "Student Mentored" },
              { number: "10+", icon: icon3, label: "Years of Experience" },
              { number: "10+", icon: icon4, label: "Areas Covered" },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 md:p-10 bg-[#CFE8DF] hover:scale-105 shadow-md rounded-2xl"
              >
                <h3 className="text-3xl md:text-5xl font-bold text-green-700">{item.number}</h3>
                <div className="flex justify-center my-4">
                  <img src={item.icon} alt="icon" className="w-15 h-15 object-contain" />
                </div>
                <p className="text-lg md:text-2xl font-bold text-green-700">{item.label}</p>
                <p className="text-black">Total workshops & Sessions</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Link to="/Aboutus">
              <button className="mt-6  text-white px-6 py-3 text-sm sm:text-base md:text-lg flex rounded-full hover:bg-green-600 hover:scale-110 transition duration-300 mx-auto" style={{ backgroundColor: "#27987A" }}>
                Explore about Us →
              </button>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Home;
