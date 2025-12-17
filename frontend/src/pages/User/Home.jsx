import Footer from "../../components/Footer";
import Header from "../../components/Header";
import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { GiSittingDog, GiCat, GiBirdTwitter, GiTropicalFish } from "react-icons/gi";
import { Link } from "react-router-dom";
const img1 = "/Home_images/image1.png";
const img2 = "/Home_images/image2.png";

import icon1 from "../../assets/Home_images/icon1.png";
import icon2 from "../../assets/Home_images/icon2.png";
import icon3 from "../../assets/Home_images/icon3.png";
import icon5 from "../../assets/Home_images/icon5.png";
import icon4 from "../../assets/Home_images/icon4.png";
import icon6 from "../../assets/Home_images/icon6.png";
import icon7 from "../../assets/Home_images/icon7.png";
import icon8 from "../../assets/Home_images/icon8.png";


const images = [img2,img1,];

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
<section className="relative min-h-[750px] md:min-h-[950px] overflow-hidden">
  {/* Background Images */}
  {images.map((img, index) => (
    <div
      key={index}
      className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out
        ${index === currentImage ? "opacity-100" : "opacity-0"}
      `}
      style={{ backgroundImage: `url(${img})` }}
    />
  ))}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"/>

          {/* Hero Content Container */}
          <div className="relative z-10 w-full flex justify-between items-center py-35 px-35">
            {/* Text Container */}
            <div className="flex flex-col items-left text-left w-1/2">
              <h1 className="lg:text-8xl text-6xl text-white leading-tight drop-shadow-lg mt-20" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                Everything Your Pet Needs
              </h1>

              <p className="text-white mt-8 lg:text-3xl text-lg leading-relaxed max-w-5xl">
                Enjoy curated food, toys, and supplies tailored for your furry friends.
                <br />
                Keep them happy, healthy, and pampered with personalized recommendations delivered right to your door!
              </p>

              {/* Shop Now Button */}
              <div className="mt-10 flex flex-wrap gap-5">
                <Link to="/product">
                  <button className="text-white font-bold bg-red-600 px-14 py-6 text-2xl  hover:scale-110 transition">
                    Shop Now
                  </button>
                </Link>

                {/* Your Pet Button */}
                <Link to="/profile">
                  <button className="text-white font-bold bg-black px-14 py-6 text-2xl  hover:scale-110 transition">
                    Your Pet
                  </button>
                </Link>
              </div>
            </div>

            {/* Polygon */}
            <div className="w-96 h-96 flex justify-center items-center bg-red-600" style={{
              clipPath: 'polygon(50% 0%, 65% 35%, 100% 35%, 70% 60%, 80% 95%, 50% 75%, 20% 95%, 30% 60%, 0% 35%, 35% 35%)'
            }}>
              <div className="flex flex-col justify-center items-center text-center px-3">
                <h1 className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  Free Delivery for<br /> orders above <br />Rs 7500
                </h1>
              </div>
            </div>
          </div>
                  </section>
          {/* Shop by Pet Type Section */}
     <section className="p-2 md:p-10 bg-white text-center text-black">
  <h2 className="text-2xl sm:text-3xl lg:text-6xl font-bold text-center mb-4 md:mb-6">
    <span className="text-black">Collection</span>
  </h2>
  <br />
  <div className="grid grid-cols-2 md:grid-cols-4 mt-6 justify-items-center">
    {[
      {icon: <GiSittingDog className="text-white" />,  label: "Dog"},
      {icon: <GiCat className="text-white" />,         label: "Cat"},
      {icon: <GiBirdTwitter className="text-white" />, label: "Bird"},
      { icon: <GiTropicalFish className="text-white" />, label: "Fish" },

    ].map((item, index) => {
      const linkTo = `/product?category=${item.label}`;
      return (
        <Link key={index} to={linkTo}>
          <div
            className="bg-black rounded-full flex flex-col items-center justify-center border- border-white shadow-md hover:scale-105 transition-transform cursor-pointer"
            style={{ width: "290px", height: "290px" }} // reduced circle size
          >
            <div className="flex justify-center my-2">
              {React.cloneElement(item.icon, { size: "8.5em" })} {/* smaller icon */}
            </div>
            <p className="text-white text-2xl sm:text-3xl lg:text-4xl text-base mt-2">{item.label}</p> {/* smaller text */}
          </div>
        </Link>
      );
    })}
  </div>
</section>
       {/* Featured Product */}
<section className="mt-8 p-2 md:p-10 bg-white text-center text-black">
  <div className="flex flex-col items-center mb-4 md:mb-6 gap-4">
    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold">
      Featured Products
    </h2>               
         <Link to="/product">
         <button className="text-white font-bold px-6 py-3 text-lg hover:scale-110 transition bg-red-600 flex items-center gap-2">
         View All <FaArrowRight />
    </button></Link>
  </div>

  <div className="grid grid-cols-6 sm:grid-cols-5 justify-items-center mt-6">
    {[
      { icon: icon1, label: "Dog.Food", info: "Premium dog food 5kg", price: "Rs.2500" },
      { icon: icon2, label: "Dog.Toy", info: "Dog Chew Toys set", price: "Rs.1000" },
      { icon: icon3, label: "Dog.Medicine", info: "Dog Joint Supplement", price: "Rs.1500" },
      { icon: icon4, label: "Dog.Accessories", info: "Dog Collar", price: "Rs.1500" },
      { icon: icon4, label: "Dog.Accessories", info: "Dog Collar", price: "Rs.1500" },

    ].map((item, index) => (
      <div
        key={index}
        className="bg-white hover:scale-105 shadow-xl rounded-2xl border border-black h-96 flex flex-col items-center"
      >
        <div className="h-3/4 w-full">
          <img src={item.icon} alt="icon" className="w-full h-full object-cover rounded-t-2xl" />
        </div>
        <div className="h-1/4 flex flex-col justify-center items-center p-4 text-center">
          <p className="text-lg md:text-2xl font-bold">{item.label}</p>
          <p className="text-md md:text-lg">{item.info}</p>
          <p className="text-md md:text-lg">{item.price}</p>
        </div>
      </div>
    ))}
  </div>
</section>

{/* Recommended for you */}
<section className="p-2 md:p-10 bg-white text-center text-black">
  <div className="flex flex-col items-center mb-4 md:mb-6 gap-4">
    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold">Recommended for you</h2>
         <Link to="/product">
         <button className="text-white font-bold px-6 py-3 text-lg hover:scale-110 transition bg-red-600 flex items-center gap-2">
         View All <FaArrowRight />
    </button></Link>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center mt-6">
    {[
      { icon: icon5, info1: "Royal Canin Maxi Adult", info2: "Supports bone & joint health", price: "Rs.7500" },
      { icon: icon6, info1: "Me-O Tuna Dry Food", info2: "Taurine enriched for eye health", price: "Rs.3800" },
      { icon: icon7, info1: "Petslife Fruit-Mix", info2: "Better balanced diet than seeds", price: "Rs.3200" },
      { icon: icon8, info1: "Altech Coppens Feed", info2: "Pellet food for tropical fish", price: "Rs.2150" },
      { icon: icon8, info1: "Altech Coppens Feed", info2: "Pellet food for tropical fish", price: "Rs.2150" },

    ].map((item, index) => (
      <div
        key={index}
        className="bg-white hover:scale-105 shadow-xl rounded-2xl border border-black h-96 flex flex-col items-center"
      >
        <div className="h-3/5 w-full">
          <img src={item.icon} alt="icon" className="w-full h-full object-cover rounded-t-2xl" />
        </div>
        <div className="h-2/5 flex flex-col justify-center items-center p-4 text-center">
          <p className="text-lg md:text-2xl font-bold">{item.info1}</p>
          <p className="text-md md:text-lg">{item.info2}</p>
          <p className="text-md md:text-lg">{item.price}</p>
        </div>
      </div>
    ))}
  </div>
</section>


      </main>
      <Footer />
    </div>
  );
};

export default Home;
