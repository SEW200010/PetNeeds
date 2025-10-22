import React, { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { FaWhatsappSquare, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from 'lucide-react';


import img1 from "../assets/Team_images/image1.png";
import img2 from "../assets/Team_images/image2.png";
import img3 from "../assets/Team_images/image3.png";
import img4 from "../assets/Team_images/image4.png";
import img5 from "../assets/Team_images/image5.png";
import img6 from "../assets/Team_images/image6.png";
import img7 from "../assets/Team_images/image7.png";
import img8 from "../assets/Team_images/image8.png";
import img9 from "../assets/Team_images/image9.png";
import rec2 from "../assets/Team_images/rec2.png";
import rec from "../assets/Team_images/rec.png";
import man from "../assets/Team_images/man.png"


const specialistsData = [
  {
    name: "K",
    fullName: "Dr. Kumar",
    title: "Senior 2",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img1,
    description:
      "Dr. Kumar is a leading expert in life skills education with over 10 years of experience specializing in youth empowerment.",
    since: 2019,
  },
  {
    name: "H",
    fullName: "Dr. Harini",
    title: "Senior 1",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img2,
    description: "Dr. Harini focuses on mental health support and counseling for young adults.",
    since: 2015,
  },
  {
    name: "N",
    fullName: "Dr. Nimal",
    title: "Senior 4",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img3,
    description: "Dr. Nimal has been actively involved in community leadership training programs.",
    since: 2012,
  },
  {
    name: "A",
    fullName: "Dr. Anusha",
    title: "Senior 3",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img:img1,
    description: "Dr. Anusha specializes in interactive learning methodologies and life coaching.",
    since: 2022,
  },
  {
    name: "F",
    fullName: "Dr. Fas",
    title: "Senior 9",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img4,
    description: "Dr. Fas specializes in interactive learning methodologies and life coaching.",
    since: 2000,
  },
];

const trainersData = [
  {
    name: "B",
    fullName: "Mr. Bandara",
    title: "Senior 1",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img5,
    description: "Mr. Bandara trains students on leadership and communication skills.",
    since: 2023,
  },
  {
    name: "A",
    fullName: "Ms. Anjali",
    title: "Senior 2",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img:img6,
    description: "Ms. Anjali focuses on personal development and team building exercises.",
    since: 2028,
  },
  {
    name: "X",
    fullName: "Mr. Xavier",
    title: "Senior 4",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img:img7,
    description: "Mr. Xavier specializes in motivational training and goal setting.",
    since: 2022,
  },
  {
    name: "S",
    fullName: "Ms. Saroja",
    title: "Senior 3",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img8,
    description: "Ms. Saroja trains students on conflict resolution and stress management.",
    since: 2026,
  },
  {
    name: "O",
    fullName: "Ms. Oja",
    title: "Senior 13",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img8,
    description: "Ms. Oja trains students on conflict resolution and stress management.",
    since: 2026,
  },
];

const mentorsData = [
  {
    name: "F",
    fullName: "Mr. Fernando",
    title: "Senior 3",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img9,
    description: "Mr. Fernando offers mentorship in career guidance and personal growth.",
    since: 2020,
  },
  {
    name: "C",
    fullName: "Ms. Chandrika",
    title: "Senior 2",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img2,
    description: "Ms. Chandrika mentors students on academic excellence and leadership.",
    since: 2021,
  },
  {
    name: "J",
    fullName: "Mr. Jayasuriya",
    title: "Senior 1",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img:img2,
    description: "Mr. Jayasuriya supports youth in building resilience and decision-making skills.",
    since: 2009,
  },
  {
    name: "P",
    fullName: "Ms. Priyanka",
    title: "Senior 4",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img1,
    description: "Ms. Priyanka focuses on mentoring students in creativity and innovation.",
    since: 2019,
  },
  {
    name: "Q",
    fullName: "Ms. Qyanka",
    title: "Senior 14",
    degree: "BSc. fghdfgkjdf",
    qualification: "MBBS, 4560",
    img: img1,
    description: "Ms. Qyanka focuses on mentoring students in creativity and innovation.",
    since: 2019,
  },
];

const Team = () => {
  const [specialists, setSpecialists] = useState(specialistsData);
  const [trainers, setTrainers] = useState(trainersData);
  const [mentors, setMentors] = useState(mentorsData);

  const [specialistsIndex, setSpecialistsIndex] = useState(0);
  const [trainersIndex, setTrainersIndex] = useState(0);
  const [mentorsIndex, setMentorsIndex] = useState(0);

  const [selectedMember, setSelectedMember] = useState(specialistsData[0]);

  const [specialistsAsc, setSpecialistsAsc] = useState(true);
  const [trainersAsc, setTrainersAsc] = useState(true);
  const [mentorsAsc, setMentorsAsc] = useState(true);

  const sortByName = (list, asc = true) => {
    return [...list].sort((a, b) =>
      asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
  };

  const handleSpecialistsSort = () => {
    const sorted = sortByName(specialists, specialistsAsc);
    setSpecialists(sorted);
    setSpecialistsAsc(!specialistsAsc);
  };

  const handleTrainersSort = () => {
    const sorted = sortByName(trainers, trainersAsc);
    setTrainers(sorted);
    setTrainersAsc(!trainersAsc);
  };

  const handleMentorsSort = () => {
    const sorted = sortByName(mentors, mentorsAsc);
    setMentors(sorted);
    setMentorsAsc(!mentorsAsc);
  };

  const MemberGrid = ({ members }) => (
    <div className="m-5 grid grid-cols-1 md:grid-cols-2 gap-20 lg:grid-cols-4 max-w-5xl mx-auto">
      {members.map((member) => (
        <div
          key={member.name}
          className="flex flex-col w-full sm:w-60 m-5 rounded-xl shadow-lg overflow-hidden"
          style={{ minHeight: "200px" }}
        >
          <div
  className="h-30 bg-cover bg-center"
  style={{ backgroundImage: `url(${rec2})` }}
></div>

          <div className="h-70 bg-[#CFE8DF] p-6 text-center flex flex-col items-center">
            <img
              src={member.img}
              alt={member.fullName}
              className="w-36 h-36 rounded-full border-4 border-white -mt-20 object-cover"
            />
            <h3 className="text-xl font-semibold mt-4">{member.title}</h3>
            <p className="text-md">{member.fullName}</p>
            <p className="text-md">{member.degree}</p>
            <p className="text-md">{member.qualification}</p>
            <p
              className="text-green-600 mt-2 cursor-pointer font-semibold"
              onClick={() => setSelectedMember(member)}
            >
              details
            </p>
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

  const scrollLeft = (type) => {
    if (type === 'specialists') setSpecialistsIndex((prev) => Math.max(0, prev - 1));
    if (type === 'trainers') setTrainersIndex((prev) => Math.max(0, prev - 1));
    if (type === 'mentors') setMentorsIndex((prev) => Math.max(0, prev - 1));
  };

  const scrollRight = (type, dataLength) => {
    if (type === 'specialists') setSpecialistsIndex((prev) => Math.min(prev + 1, dataLength - 4));
    if (type === 'trainers') setTrainersIndex((prev) => Math.min(prev + 1, dataLength - 4));
    if (type === 'mentors') setMentorsIndex((prev) => Math.min(prev + 1, dataLength - 4));
  };

  const getVisibleMembers = (data, index) => data.slice(index, index + 4);

  return (
    <div>
      <Header />
      <main className="bg-gray-100 pt-[65px]">
        <section className="relative h-[600px] bg-cover bg-center text-center text-white flex flex-col items-center justify-center" style={{ backgroundImage: `url(${man})` }}>

          <div className="relative w-full h-[600px] flex flex-col items-center justify-center text-center overflow-hidden pt-8">
            <div className="absolute inset-0 bg-black opacity-60">
            </div>
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
            </div>
          </div>
        </section>

        {/*founder section*/}
        <section
          className="relative min-h-[600px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{ backgroundImage: `url(${rec})` }}
        >
          <div className="text-center px-4">
            <h2 className="mb-10 text-5xl sm:text-6xl font-bold text-black drop-shadow-lg">Founder</h2>

            <div className="flex flex-col items-center gap-4">
              <img
                src={selectedMember.img}
                alt={selectedMember.fullName}
                className="rounded-full w-40 h-40 object-cover border-4 border-[#004D40]"
              />

              <h3 className="text-2xl sm:text-3xl font-semibold text-black">{selectedMember.title}</h3>
              <p className="text-xl sm:text-2xl font-bold text-black">{selectedMember.fullName}</p>
              <p className="text-md sm:text-lg max-w-3xl text-black">{selectedMember.description}</p>
              <p className="text-green-600 text-md sm:text-xl font-medium">Since {selectedMember.since}</p>
            </div>
          </div>
        </section>

        {/* Specialist Section */}
        <section className="mb-20 max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-3xl font-bold underline underline-offset-5 text-gray-800">
              Our <span className="text-[#27987A]">Specialists</span>
            </h2>
            <button
              className="mt-4 sm:mt-5 rounded-md border border-black py-2 px-5 text-sm font-semibold bg-black text-white hover:bg-white hover:text-black"
              onClick={handleSpecialistsSort}
            >
              Sort by Name {specialistsAsc ? "▲" : "▼"}
            </button>
          </div>
          <div className="flex justify-center gap-4 items-center">
            <ChevronLeft className="cursor-pointer" onClick={() => scrollLeft('specialists')} />
            <MemberGrid members={getVisibleMembers(specialists, specialistsIndex)} />
            <ChevronRight className="cursor-pointer" onClick={() => scrollRight('specialists', specialists.length)} />
          </div>
        </section>

        {/* Trainers Section */}
        <section className="mb-20 max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-3xl font-bold underline underline-offset-5 text-gray-800">
              Our <span className="text-[#27987A]">Trainers</span>
            </h2>
            <button
              className="mt-4 sm:mt-5 rounded-md border border-black py-2 px-5 text-sm font-semibold bg-black text-white hover:bg-white hover:text-black"
              onClick={handleTrainersSort}
            >
              Sort by Name {trainersAsc ? "▲" : "▼"}
            </button>
          </div>
          <div className="flex justify-center gap-4 items-center">
            <ChevronLeft className="cursor-pointer" onClick={() => scrollLeft('trainers')} />
            <MemberGrid members={getVisibleMembers(trainers, trainersIndex)} />
            <ChevronRight className="cursor-pointer" onClick={() => scrollRight('trainers', trainers.length)} />
          </div>
        </section>

        {/* Mentors Section */}
        <section className="mb-20 max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-3xl font-bold underline underline-offset-5 text-gray-800">
              Our <span className="text-[#27987A]">Mentors</span>
            </h2>
            <button
              className="mt-4 sm:mt-5 rounded-md border border-black py-2 px-5 text-sm font-semibold bg-black text-white hover:bg-white hover:text-black"
              onClick={handleMentorsSort}
            >
              Sort by Name {mentorsAsc ? "▲" : "▼"}
            </button>
          </div>
          <div className="flex justify-center gap-4 items-center">
            <ChevronLeft className="cursor-pointer" onClick={() => scrollLeft('mentors')} />
            <MemberGrid members={getVisibleMembers(mentors, mentorsIndex)} />
            <ChevronRight className="cursor-pointer" onClick={() => scrollRight('mentors', mentors.length)} />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default Team;