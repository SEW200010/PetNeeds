import React, { useState } from "react";
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
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
      {members.map((member, i) => (
        <div key={i} className="flex flex-col w-full sm:w-50 ml-7">
          <div className="h-30 bg-[url('/Team_images/rec2.png')] bg-cover bg-center"></div>
          <div className="bg-[#CFE8DF] p-4 text-center">
            <img
              src={member.img}
              alt={member.name}
              className="w-30 h-30 mx-auto -mt-23 rounded-full"
            />
            <h3 className="text-lg font-semibold">{member.title}</h3>
            <p className="text-sm">{member.name}</p>
            <p className="text-sm">{member.degree}</p>
            <p className="text-sm">{member.qualification}</p>
            <p className="text-green-600 mt-2 cursor-pointer">details</p>
            <div className="mt-4 flex justify-center gap-2">
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
      <main className="bg-gray-100 pt-[75px]">
        {/* Hero Section */}
        <section className="relative w-full h-[500px] flex flex-col items-center justify-center text-center overflow-hidden pt-30">
          <div
            className="absolute inset-0 bg-cover bg-center brightness-[70%] z-[1]"
            style={{ backgroundImage: "url('/Team_images/man.png')" }}
          ></div>
                    <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="relative z-10 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold">
              Meet The Team
            </h1>
            <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-[#27987A]">
              Empower. Lead. Transform.
            </p>
            <div className="max-w-5xl text-white text-center md:text-justify mx-auto">
              <p className="text-white mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-left mx-auto max-w-6xl px-2">
                The success of the 'வார்ப்பு' (Varppu) Life Skills Development
                Programme is driven by a dedicated team of educators, mentors,
                and professionals committed to shaping the future of Sri Lankan
                youth. With expertise in education, psychology, and leadership
                development, our team works tirelessly to equip students with
                essential life skills. Through interactive learning, mentorship,
                and the 'Manohari' module, we provide the support and guidance
                needed to navigate challenges like peer pressure, mental health
                struggles, and decision-making. Together, we are building a
                resilient and empowered generation ready to lead positive change
                in society
              </p>
            </div>
            <button className="mt-6 bg-black text-white px-6 py-3 text-sm sm:text-base md:text-lg flex rounded-full hover:bg-green-600 hover:scale-110 transition duration-300 mx-auto">
              Explore about Us →
            </button>
          </div>
        </section>

        {/* Founder Section */}
        <section
          className="relative py-16 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/Team_images/rec.png')" }}
        >
          <div className="relative z-10 max-w-2xl mx-auto p-6 rounded-lg flex flex-col md:flex-row items-center gap-6 text-white">
            <div className="p-1 rounded-lg ">
              <img
                src="Team_images/image1.png"
                alt="Founder"
                className="w-70 h-60 rounded-lg"
              />
            </div>
            <div className="text-center md:text-left mt-4">
              <h2 className="text-black mt-4 font-semibold text-base lg:text-xl font-bold">
                Founder -{" "}
                <span className="text-green-600">Person Name</span>
              </h2>
              <p className="text-black text-justify max-w-md mt-4 text-base lg:text-xl">
                The 'வார்ப்பு' (Varppu) Life Skills Development Programme equips
                Sri Lankan youth with essential skills to navigate challenges
                like peer pressure,
              </p>
              <p className="text-black text-justify max-w-md mt-2 text-base lg:text-xl">
                mental health, and leadership. Through interactive learning and
                the 'Manohari' module, it fosters resilience and positive social
                change.
              </p>
              <p className="text-green-600 mt-4 font-semibold text-base lg:text-xl">
                Since 2029
              </p>
            </div>
          </div>
        </section>

        {/* Specialists Section */}
        <section className="py-12 relative">
          <h2 className="text-center text-4xl font-bold">
            Our <span className="text-green-600">Specialists</span>
          </h2>
          <div className="flex justify-center mt-8 relative">
            <button
              onClick={handleSpecialistsSort}
              className="absolute z-20 top-0 bg-black text-white px-8 py-1 text-sm rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition duration-300"
            >
              Sort
            </button>
          </div>
          <MemberGrid members={specialists} />
        </section>

        {/* Trainers Section */}
        <section className="py-12 relative">
          <h2 className="text-center text-4xl font-bold">
            Our <span className="text-green-600">Trainers</span>
          </h2>
          <div className="flex justify-center mt-8 relative">
            <button
              onClick={handleTrainersSort}
              className="absolute z-20 top-0 bg-black text-white px-8 py-1 text-sm rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition duration-300"
            >
              Sort
            </button>
          </div>
          <MemberGrid members={trainers} />
        </section>

        {/* Mentors Section */}
        <section className="py-12 relative">
          <h2 className="text-center text-4xl font-bold">
            Our <span className="text-green-600">Mentors</span>
          </h2>
          <div className="flex justify-center mt-8 relative">
            <button
              onClick={handleMentorsSort}
              className="absolute z-20 top-0 bg-black text-white flex justify-center px-8 py-1 text-sm rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition duration-300"
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
