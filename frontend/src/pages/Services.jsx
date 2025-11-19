import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroImage from "../assets/Services_page/man-with-problems.png";
import lifeSkillIcon from "../assets/Services_page/life-skill.png";
import mentorshipIcon from "../assets/Services_page/mentorship.png";
import healthIcon from "../assets/Services_page/health.png";
import communityIcon from "../assets/Services_page/community.png";
import workshopIcon from "../assets/Services_page/workshop.png";
import careerIcon from "../assets/Services_page/career.png";
import leadershipIcon from "../assets/Services_page/leadership.png";
import skillIcon from "../assets/Services_page/skill.png";
import impactIcon from "../assets/Services_page/impact.png";
import { Link } from "react-router-dom";
import women from "../assets/Services_page/women.png";

const Services = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <main className="bg-gray-100">


        <section
          className="relative h-[420px] sm:min-h-[500px] md:min-h-[620px] bg-cover bg-center text-center text-white flex flex-col items-center justify-center px-4 overflow-hidden"
          style={{ backgroundImage: `url(${HeroImage})` }}
        >
          <div className="absolute inset-0 bg-black/60" />

         <div className="relative z-10 mx-auto
                  px-4
                  max-w-md sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              Services
            </h1>
            <p className="mt-4 text-xl sm:text-2xl md:text-3xl text-[#27987A] font-semibold">
              Empower. Lead. Transform.
            </p>
            <p className="text-white mt-4 text-sm sm:text-base md:text-lg leading-relaxed">
             At the 'வார்ப்பு' (Varppu) Life Skills Development Programme, we empower Sri Lankan youth—especially in the Northern Province—through life skills training, mental health support, leadership development, and educational workshops. Our programs address challenges such as peer pressure, substance abuse, and stress, helping youth grow with confidence and become future leaders of their communities.
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



        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 p-6 md:p-10 lg:p-20 bg-white items-center">

          <div className="flex justify-center">
            <img
              src={women}
              alt="About Varppu Counselling"
              className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center lg:text-left">
              Empowering{" "}
              <span className="text-[#27987A]">Growth Through Learning</span>
            </h2>

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


        <section className="bg-[url('src/assets/Services_page/background2.png')] bg-cover bg-center py-16">
          <h2 className="text-center text-3xl font-bold text-gray-800">
            Why <span className="text-[#27987A]">Choose US</span>
          </h2>
          <div className="mt-12 flex flex-col md:flex-row justify-around items-center gap-10 px-8">
            {/* Skill Development */}
            <div className="max-w-xs text-center">
              <div className="flex justify-center mb-4 rounded-full bg-white items-center shadow w-20 h-20 opacity-80 mx-auto" >
                <img
                  src={skillIcon}
                  alt="Skill Icon"
                  className="w-14 h-14"
                />
              </div>
              <h3 className="text-[#27987A] font-semibold text-xl">
                Comprehensive Skill Development
              </h3>
              <p className="text-m text-[#EAF3F1] mt-2">
                We offer well-structured programs that focus on essential life skills,
                leadership, and personal growth to help individuals navigate challenges
                with confidence.
              </p>
            </div>

            {/* Mentorship */}
            <div className="max-w-xs text-center">
              <div className="flex justify-center mb-4 rounded-full bg-white items-center shadow w-20 h-20 opacity-80 mx-auto">
                <img
                  src={leadershipIcon}
                  alt="Leadership Icon"
                  className="w-14 h-14"
                />
              </div>
              <h3 className="text-[#27987A] font-semibold text-xl">
                Expert Guidance & Mentorship
              </h3>
              <p className="text-m text-[#EAF3F1] mt-2">
                Our experienced trainers and mentors provide hands-on learning and
                support, ensuring participants receive valuable insights and practical
                knowledge.
              </p>
            </div>

            {/* Impact-Driven */}
            <div className="max-w-xs text-center">
              <div className="flex justify-center mb-4 rounded-full bg-white items-center shadow w-20 h-20 opacity-80 mx-auto">
                <img
                  src={impactIcon}
                  alt="Impact Icon"
                  className="w-14 h-14"
                />
              </div>
              <h3 className="text-[#27987A] font-semibold text-xl">
                Impact-Driven Approach
              </h3>
              <p className="text-m text-[#EAF3F1] mt-2">
                We focus on real-world impact by engaging with communities, fostering
                resilience, and empowering individuals to create lasting positive
                change.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
          {[
            {
              title: (<>Life Skills<br /> Development</>),
              icon: lifeSkillIcon,
              description: "Training on decision-making, problem-solving, and emotional intelligence."
            },
            {
              title: (<>Leadership &<br /> Mentorship</>),
              icon: mentorshipIcon,
              description: "Guidance and mentorship programs to develop confident future leaders."
            },
            {
              title: (<>Mental Health &<br /> Well-being</>),
              icon: healthIcon,
              description: "Support sessions focusing on stress management, peer pressure, and resilience."
            },
            {
              title: (<>Community<br /> Engagement</>),
              icon: communityIcon,
              description: "Outreach programs aimed at fostering social responsibility and positive change."
            },
            {
              title: (<>Interactive<br /> Workshops</>),
              icon: workshopIcon,
              description: "Engaging, hands-on sessions designed to enhance practical skills and personal growth."
            },
            {
              title: (<>Career & Personal<br /> Development</>),
              icon: careerIcon,
              description: "Sessions on goal setting, communication, and preparing for future challenges."
            },
          ].map(({ title, icon, description }, index) => (
            <div
              key={index}
              className="bg-[#CFE8DF] rounded-2xl shadow-xl px-6 py-8 text-center w-full max-w-xs mx-auto hover:shadow-lg transition duration-300"
            >
              <h3 className="text-[#27987A] font-semibold text-xl sm:text-2xl mb-1">
                {title}
              </h3>
              <div className="w-8 h-[2px] bg-gray-400 mx-auto my-2 rounded-full" />
              <div className="flex justify-center my-4">
                <img src={icon} alt="icon" className="w-15 h-15 object-contain" />
              </div>
              <p className="text-m text-gray-700 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </div>

  );
};
export default Services;


