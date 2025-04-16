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
const Services = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <main className="bg-gray-100 pt-[75px]">
        <section
          className="relative h-[500px] bg-cover bg-center flex flex-col items-center justify-center text-center"
          style={{ backgroundImage: `url(${HeroImage})`, transition: "background-image 1s ease-in-out" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10">
            <h1 className="text-5xl text-white font-bold">Services</h1>
            <p className="mt-4 text-3xl text-[#27987A]">Empower. Lead. Transform.</p>
            <p className="text-white mt-4 text-center mx-auto max-w-6xl">At the 'வார்ப்பு' (Varppu) Life Skills Development Programme, we are committed to providing impactful services that empower Sri Lankan youth, particularly in the Northern Province. Our services include comprehensive life skills training, mental health support through the 'Manohari' module, leadership development, and educational workshops focused on resilience, problem-solving, and emotional intelligence. We tailor our services to address pressing issues like peer pressure, substance abuse, and stress management, offering a safe space for youth to grow, learn, and become leaders in their communities. By fostering self-awareness and empowering individuals, we aim to create a lasting impact on youth, society, and the future of Sri Lanka.</p>
            <button className="mt-6 bg-black text-white px-6 py-3 flex rounded-full hover:bg-green-600 hover:scale-110 mx-auto">
              Explore about Us →
            </button>
          </div>
        </section>



        <section className="p-15 flex mx-auto">

          <img src="src\assets\Services_page\women.png" alt="About" className="w-150 rounded-lg mx-20 my-20" />
          <div className="w-1/2 my-20 mx-10">

            <h2 className="text-3xl font-bold">
              Empowering{" "}
              <span className="text-[#27987A]">Growth Through Learning</span>
            </h2>

            <p className="mt-4 text-xl">
              We are dedicated to empowering individuals through<br />skill-based learning and personal
              development. Our<br /> services include interactive workshops.
            </p>

            <p className="mt-4 text-xl">
              From resilience and decision-making to mental health<br /> support and problem-solving,
              we provide the tools<br /> needed to navigate challenges and grow with<br /> confidence.
            </p>

            <p className="mt-4 font-semibold text-xl text-[#27987A]">
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


        <section className="p-8">
          <h2 className="text-center text-4xl font-bold underline decoration-gray-500 underline-offset-8 decoration-3 p-6">
            Our <span className="text-[#27987A]">Services</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mx-50">
            {[
              {
                title: (<>Life Skills<br /> Development</>),
                icon: lifeSkillIcon,
                description: (<>Training on decision-making,<br /> problem-solving, and emotional<br /> intelligence.</>)
              },
              {
                title: (<>Leadership & <br />Mentorship</>),
                icon: mentorshipIcon,
                description: (<>Guidance and mentorship<br /> programs to develop confident<br /> future leaders.</>)
              },
              {
                title: (<>Mental Health & <br /> Well-being</>),
                icon: healthIcon,
                description: (<>Support sessions focusing on<br /> stress management, peer<br /> pressure, and resilience.</>)
              },
              {
                title: (<>Community<br /> Engagement</>),
                icon: communityIcon,
                description: (<>Outreach programs aimed at<br /> fostering social responsibility and<br /> positive change.</>)
              },
              {
                title: (<>Interactive<br /> Workshops</>),
                icon: workshopIcon,
                description: (<>Engaging, hands-on sessions<br /> designed to enhance practical<br /> skills and personal growth.</>)
              },
              {
                title: (<>Career & Personal<br /> Development</>),
                icon: careerIcon,
                description: (<>Sessions on goal setting,<br /> communication, and preparing for<br /> future challenges.</>)
              },
            ].map(({ title, icon, description }) => (
              <div key={title} className="bg-[#CFE8DF] rounded-3xl shadow-md p-10 text-center transition hover:scale-105 duration-300 w-[350px] h-[380px] mx-auto">
                <h3 className="text-[#27987A] font-semibold text-3xl">
                  {title}
                </h3>
                <div className="w-6 h-[2px] bg-gray-400 mx-auto my-2 rounded-full"></div>
                <div className="flex justify-center my-4">
                  <img src={icon} alt={title} className="w-15 h-15 object-contain" />
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>



        </section>




      </main>
      <Footer />
    </div>

  );
};
export default Services;


