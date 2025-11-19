import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import heroImage from "../assets/Aboutus/aboutus-image.png";
import { FaArrowRight } from "react-icons/fa";
import Keyvalues from "../components/Keyvalues";
import WhatWeOfferBgImage from "../assets/Aboutus/What-we-offer-bgimage.png";
import memberImage from "../assets/Aboutus/memberImage.jpeg";
import correctIcon from "../assets/Aboutus/correct-icon.png";
import WhatWeOfferImg from "../assets/Aboutus/What-we-offer-image.png";
import video from "../assets/Aboutus/video.mp4";

const Aboutus = () => {

  const services = [
    "Life Skills Training",
    "Psychosocial Support",
    "Leadership & Personal Development",
    "Educational & Activity-Based Learning",
    "Peer Pressure & Substance Abuse Awareness",
    "Sustainable Societal Impact",
  ];

  const teamMembers = [
    { name: "John Doe", title: "Senior Lead", image: memberImage },
    { name: "John Doe", title: "Senior Lead", image: memberImage },
    { name: "John Doe", title: "Senior Lead", image: memberImage },
    { name: "John Doe", title: "Senior Lead", image: memberImage },
  ];
  return (
    <div className="bg-gray-100 ">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[420px] sm:min-h-[500px]  md:min-h-[620px] bg-cover bg-center text-center text-white flex flex-col items-center justify-center" style={{ backgroundImage: `url(${heroImage})` }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto
                  px-4
                  max-w-md sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold">
            Who We Are
          </h1>
          <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-[#27987A] font-semibold">
            Empower. Lead. Transform.
          </p>
              <p className="text-white mt-4 text-sm sm:text-base md:text-lg leading-relaxed">
          

The "வார்ப்பு" (Varppu) Life Skills Development Programme, by the University of Jaffna, empowers youth in the Northern Province through educational and activity-based training. It supports university and school students facing substance abuse, peer pressure, and mental health challenges using the "Manohari" psychosocial module. Varppu builds problem-solving, emotional intelligence, and leadership skills, fostering resilient young leaders who drive positive social change and sustainable community development.

          </p>
          <Link to="/Aboutus">
            <button className="mt-6 text-white px-6 py-3 text-sm sm:text-base md:text-lg rounded-full hover:bg-green-600 hover:scale-110 transition mx-auto"style={{ backgroundColor: "#27987A" }}>
              Explore about Us →
            </button>
          </Link>
        </div>

      </section>


      {/* Welcome Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:p-10 lg:p-20 bg-white items-center">

        <div className="flex justify-center">
          <iframe className="w-120 h-80" src={video} ><img src="../assets/Aboutus/aboutus-image.png" alt="" /></iframe>
        </div>

        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Welcome to <span className="text-emerald-600">Varppu</span></h2>
          
          <p className="mt-4 text-base sm:text-lg lg:text-xl text-center lg:text-left">
              We are dedicated to empowering individuals through<br className="hidden sm:block" />
              skill-based learning and personal development. Our<br className="hidden sm:block" />
              services include interactive workshops.
            </p>

            <p className="mt-4 text-base sm:text-lg lg:text-xl text-center lg:text-left">
              From resilience and decision-making to mental health<br className="hidden sm:block" />
              support and problem-solving, we provide the tools<br className="hidden sm:block" />
              needed to navigate challenges and grow with<br className="hidden sm:block" />
              confidence.
            </p>
          <p className="mt-4 font-semibold text-base sm:text-lg lg:text-xl text-[#27987A] text-center lg:text-left">
            Empower. Lead. Transform.
          </p>
        </div>

      </section>

      {/*Key Values Section*/}
      <section className="flex">
        <Keyvalues />
      </section>

      {/*What we offer */}

      <section className="  bg-gradient-to-r from-teal-500 to-teal-600 text-white py-10 pl-4" style={{ backgroundImage: `url(${WhatWeOfferBgImage})` }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-60">
          <div className="pl-15">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold  underline underline-offset-8 mb-4 md:mb-6">
              What <span className="text-[#27987A]">We Offer</span>
            </h2>
            <br />


            <ul className="space-y-2 text-sm md:text-base">
              {services.map((service, index) => (
                <li key={index} className="flex items-start py-2 space-x-2 ">
                  <span className="text-green-400"><img src={correctIcon} alt="" /></span>
                  <span className="text-xl">{service}</span>
                </li>
              ))}
            </ul>

            <Link to="/Services">
              <button className="mt-6 inline-flex text-white px-6 py-3 text-sm sm:text-base md:text-lg flex rounded-full hover:bg-green-600 hover:scale-110 transition duration-300 mx-auto" style={{ backgroundColor: "#27987A" }}>
                Explore services  →
              </button>
            </Link>

          </div>

          <div className="flex justify-center">
            <img
              src={WhatWeOfferImg}
              alt="About Varppu Counselling"
              className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 text-center">

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center underline underline-offset-8 mb-4 md:mb-6">
          Our <span className="text-[#27987A]">Team</span>
        </h2>
        <br />
        <div className="flex flex-wrap justify-center gap-24">
          {teamMembers.map((member, index) => (
            <div key={index} className="m-5">
              <img
                src={member.image}
                alt={member.name}
                className=" object-cover rounded-full border-4 border-teal-600 mx-auto"
              />
              <p className="mt-6 text-xl font-semibold text-center">{member.title}</p>
              <p className="text-md text-gray-600 text-center">{member.name}</p>
            </div>
          ))}
        </div>


        <Link to="/Aboutus">
          <button className="mt-6 inline-flex text-white px-6 py-3 text-sm sm:text-base md:text-lg flex rounded-full hover:bg-green-600 hover:scale-110 transition duration-300 mx-auto" style={{ backgroundColor: "#27987A" }}>
            Explore about Us →
          </button>
        </Link>
      </section>
      <Footer />
    </div>
  )
};


export default Aboutus;
