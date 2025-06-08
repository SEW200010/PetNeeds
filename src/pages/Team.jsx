import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { FaWhatsappSquare, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const specialistsData = [
  { name: "K", title: "Senior 2", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image1.png" },
  { name: "H", title: "Senior 1", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image2.png" },
  { name: "N", title: "Senior 4", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image3.png" },
  { name: "A", title: "Senior 3", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image4.png" },
];

const trainersData = [
  { name: "B", title: "Senior 1", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image5.png" },
  { name: "A", title: "Senior 2", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image6.png" },
  { name: "X", title: "Senior 4", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image7.png" },
  { name: "S", title: "Senior 3", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image8.png" },
];

const mentorsData = [
  { name: "F", title: "Senior 3", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image9.png" },
  { name: "C", title: "Senior 2", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image10.png" },
  { name: "J", title: "Senior 1", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image11.png" },
  { name: "P", title: "Senior 4", degree: "Bsc.fghdfgkjdf", qualification: "MBBS,4560", img: "/Team_images/image12.png" },
];

const Team = () => {
  const [specialists, setSpecialists] = useState(specialistsData);
  const [trainers, setTrainers] = useState(trainersData);
  const [mentors, setMentors] = useState(mentorsData);

  const sortByName = (list) => [...list].sort((a, b) => a.name.localeCompare(b.name));

  const handleSpecialistsSort = () => {
    setSpecialists(sortByName(specialists));
  };

  const handleTrainersSort = () => {
    setTrainers(sortByName(trainers));
  };

  const handleMentorsSort = () => {
    setMentors(sortByName(mentors));
  };

  const MemberGrid = ({ members }) => (
    <div className="m-5 grid grid-cols-1 md:grid-cols-2 gap-20 lg:grid-cols-4 max-w-5xl mx-auto">
      {members.map((member, i) => (
        <div
          key={i}
          className="flex flex-col w-full  sm:w-60 m-5 rounded-xl shadow-lg overflow-hidden" // increased width, radius, shadow
          style={{ minHeight: "200px" }} // increase height to make cards bigger
        >
          <div className="h-30 bg-[url('/Team_images/rec2.png')] bg-cover bg-center"></div> {/* increased height */}
          <div className="h-70 bg-[#CFE8DF] p-6 text-center flex flex-col items-center">
            <img
              src={member.img}
              alt={member.name}
              className="w-36 h-36 rounded-full border-4 border-white -mt-20 object-cover"  // bigger image + border
            />
            <h3 className="text-xl font-semibold mt-4">{member.title}</h3> {/* bigger text */}
            <p className="text-md">{member.name}</p>
            <p className="text-md">{member.degree}</p>
            <p className="text-md">{member.qualification}</p>
            <p className="text-green-600 mt-2 cursor-pointer font-semibold">details</p>
            <div className="mt-5 flex justify-center gap-5 text-2xl">
              <FaFacebook className="text-blue-600 cursor-pointer" />
              <FaInstagram className="text-pink-600 cursor-pointer" />
              <FaWhatsappSquare className="text-green-500 cursor-pointer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Header />
      <main className="bg-gray-100 pt-[65px]">
        {/* Hero Section */}

        <section className="relative h-[600px] bg-cover bg-center text-center text-white flex flex-col items-center justify-center" style={{ backgroundImage: "url('/Team_images/man.png')" }}>

          <div className="relative w-full h-[600px] flex flex-col items-center justify-center text-center overflow-hidden pt-8">

            <div className="absolute inset-0 bg-black opacity-60"></div>
            <div className="relative z-10 max-w-7xl w-full">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold">Meet The Team</h1>
              <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-[#27987A] font-semibold">Empower. Lead. Transform.</p>

              <p className="text-white mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-left mx-auto max-w-6xl px-2">
                The success of the 'வார்ப்பு' (Varppu) Life Skills Development Programme is driven by a dedicated team of educators, mentors,
                and professionals committed to shaping the future of Sri Lankan youth. With expertise in education, psychology, and leadership
                development, our team works tirelessly to equip students with essential life skills. Through interactive learning, mentorship,
                and the 'Manohari' module, we provide the support and guidance needed to navigate challenges like peer pressure, mental health
                struggles, and decision-making. Together, we are building a resilient and empowered generation ready to lead positive change
                in society.
              </p>

              <Link to="/Aboutus">
                <button className="mt-6 inline-flex text-white px-6 py-3 text-sm sm:text-base md:text-lg flex rounded-full hover:bg-green-600 hover:scale-110 transition duration-300 mx-auto" style={{ backgroundColor: "#27987A" }}>
                  Explore about Us →
                </button>
              </Link>
            </div></div>
        </section>

        {/* Founder Section */}
        <section className="relative py-16 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/Team_images/rec.png')" }}>
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-20 z-10"></div>
          <div className="relative z-10 max-w-2xl mx-auto p-6 rounded-lg flex flex-col md:flex-row items-center gap-6 text-white">
            <div className="p-1 rounded-lg">
              <img src="Team_images/image1.png" alt="Founder" className="w-70 h-60 rounded-lg" />
            </div>
            <div className="text-center md:text-left mt-4">
              <h2 className="text-black mt-4 font-semibold text-base lg:text-xl font-bold">
                Founder - <span className="text-green-600">Person Name</span>
              </h2>
              <p className="text-black text-justify max-w-md mt-4 text-base lg:text-xl">
                The 'வார்ப்பு' (Varppu) Life Skills Development Programme equips Sri Lankan youth with essential skills to navigate challenges like peer pressure,
              </p>
              <p className="text-black text-justify max-w-md mt-2 text-base lg:text-xl">
                mental health, and leadership. Through interactive learning and the 'Manohari' module, it fosters resilience and positive social change.
              </p>
              <p className="text-green-600 mt-4 font-semibold text-base lg:text-xl">Since 2029</p>
            </div>
          </div>
        </section>

        {/* Specialists Section */}
        <section className="py-12 relative max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-center sm:text-3xl lg:text-4xl font-bold underline underline-offset-8">
              Our <span className="text-[#27987A]">Specialists</span>
            </h2>
            <button
              onClick={handleSpecialistsSort}
              className="px-6 py-1 text-sm rounded-full border border-gray-700 text-gray-700 hover:bg-[#27987A] hover:text-white transition duration-300"
              style={{ backgroundColor: "transparent" }}
            >
              Sort
            </button>
          </div>
          <MemberGrid members={specialists} />
        </section>

        {/* Trainers Section */}

        <section className="py-12 relative max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-center sm:text-3xl lg:text-4xl font-bold underline underline-offset-8">
              Our <span className="text-[#27987A]">Trainers</span>
            </h2>
            <button
              onClick={handleTrainersSort}
              className="px-6 py-1 text-sm rounded-full border border-gray-700 text-gray-700 hover:bg-[#27987A] hover:text-white transition duration-300"
              style={{ backgroundColor: "transparent" }}
            >
              Sort
            </button>
          </div>
          <MemberGrid members={trainers} />
        </section>


        {/* Mentors Section */}
        <section className="py-12 relative max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-center sm:text-3xl lg:text-4xl font-bold underline underline-offset-8">
              Our <span className="text-[#27987A]">Mentors</span>
            </h2>
            <button
              onClick={handleMentorsSort}
              className="px-6 py-1 text-sm rounded-full border border-gray-700 text-gray-700 hover:bg-[#27987A] hover:text-white transition duration-300"
              style={{ backgroundColor: "transparent" }}
            >
              Sort
            </button>
          </div>
          <MemberGrid members={mentors} />
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Team;
