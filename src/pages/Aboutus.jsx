
import Footer from "../components/Footer";
import Header from "../components/Header";
import heroImage from "../assets/Aboutus/aboutus-image.png";
import { FaArrowRight } from "react-icons/fa";
import Keyvalues from "../components/Keyvalues";
import WhatWeOfferBgImage from "../assets/Aboutus/What-we-offer-bgimage.png";
import memberImage from "../assets/Aboutus/memberImage.jpeg";
import correctIcon from "../assets/Aboutus/correct-icon.png";
import WhatWeOfferImg from "../assets/Aboutus/What-we-offer-image.png";

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
      { name: "John Doe", title: "Senior Lead", image: memberImage},
      { name: "John Doe", title: "Senior Lead", image: memberImage},
      { name: "John Doe", title: "Senior Lead", image: memberImage },
    ];
    return (
        <div className="bg-gray-100 pt-[75px] font-poppins">
          <Header />

          {/* Hero Section */}
          <section className="relative h-[500px] bg-cover bg-center text-center text-white flex flex-col items-center justify-center" style={{backgroundImage: `url(${heroImage})`}}>
            {/* Dark overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>

            <h1 className="text-5xl font-bold relative z-10">Who We Are</h1>
            <br />
            <h2 className="text-2xl font-bold mb-8">
              <span className="text-green-500">Empower. Lead. Transform.</span>
            </h2>
            <p className="mt-4 relative z-10">The "வார்ப்பு" (Varppu) Life Skills Development Programme, launched by the University of Jaffna, empowers Sri Lankan youth, especially in the Northern Province, through educational training and activity-based learning. Targeting university and school students, it addresses issues like substance abuse, peer pressure, and mental health struggles using the "Manohari" module, a psychosocial support system. By fostering problem-solving, emotional intelligence, and leadership, Varppu nurtures resilient young leaders, driving sustainable societal development and positive social change.</p>
            <button className="mt-6 bg-black text-white align-middle px-6 py-3 flex rounded-md hover:bg-green-600 hover:scale-110 relative z-10">
              Explore about Us
              <FaArrowRight className="w-10 h-5 transform translate-y-1"/>
            </button>
          </section>


          {/* Welcome Section */}
          <section className="container flex  mx-auto my-12 p-12">
            <div className="mt-12  pr-18 flex items-start">
              <iframe className="w-100 h-60" src="https://youtu.be/eIho2S0ZahI?si=rBzXdraAo7C2bZgK" ><img src="../assets/Aboutus/aboutus-image.png" alt="" /></iframe>
            </div>
            <div className="mt-6 ml-3 mr-3 text-justify text-base/10">
              <h2 className="text-4xl font-bold">Welcome to <span className="text-green-500">Varppu counselling</span></h2>
              <p className="mt-4 text-gray-600 ">The 'வார்ப்பு' (Varppu) Life Skills Development Programme equips Sri Lankan youth with essential skills to navigate challenges like peer pressure,<br/>mental health, and leadership. Through interactive learning and the 'Manohari' module, it fosters resilience and positive social change.</p>
              <h2 className="text-2xl font-semibold mb-8">
                <br />
              <span className="text-green-500">Empower. Lead. Transform.</span>
            </h2>
            </div>
      
          </section>

          {/*Key Values Section*/}
          <section className="flex mt-4">
              <Keyvalues/>
          </section>

          {/*What we offer */}

          <section className="  bg-gradient-to-r from-teal-500 to-teal-600 text-white py-6 pl-4" style={{backgroundImage: `url(${WhatWeOfferBgImage})`}}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-60">
              <div className="pl-15">
                <h2 className="text-2xl font-semibold mb-6">
                  <span className="text-gray-200">What </span>
                  <span className="text-green-300">We Offer</span>
                </h2>
                <hr className="w-80 pb-5"/>
                <ul className="space-y-2 text-sm md:text-base">
                  {services.map((service, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-400"><img src={correctIcon} alt="" /></span>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-6 bg-teal-600 hover:bg-green-600 text-white px-5 py-2 rounded-full transition">
                  Explore services →
                </button>
              </div>
              <div className="pl-20">
                <img
                  src={WhatWeOfferImg}
                  alt="Therapy session"
                  className=" rounded-xl shadow-lg w-80 h-60"
                />
              </div>
            </div>
          </section>
          
          <section className="py-12 px-4 text-center">
            <h2 className="text-2xl font-semibold mb-8">
              Our <span className="text-teal-900">Team</span>
              <hr className="w-30 ml-149 mt-3"/>
            </h2>

            <div className="flex flex-wrap justify-center gap-20">
              {teamMembers.map((member, index) => (
                <div key={index} className=" p-4 w-40">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="  rounded-full border-4 border-teal-600 "
                  />
                  <p className="mt-4 text-sm font-medium">{member.title}</p>
                  <p className="text-xs text-gray-500">{member.name}</p>
                </div>
              ))}
            </div>

            <button className="mt-6 bg-teal-600 hover:bg-green-600 text-white px-5 py-2 rounded-full transition">
              Explore the team →
            </button>
          </section>
          <Footer />
        </div>
    )
};


export default Aboutus;
