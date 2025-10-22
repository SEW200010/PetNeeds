import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logoNew.png";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
   className={`shadow-md fixed top-0 left-0 w-full z-50 ${hasScrolled ? "bg-green-300 shadow-lg" : ""}`}
style={{ backgroundColor: "#083636" }}

    >
      <div className="container mx-auto flex items-center justify-between p-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="h-10" />
          <span className="text-lg font-semibold text-white">Varppu Life Skill Development </span>
        </Link>
        
        {/* Navigation Links for desktop */}
        <nav className="hidden md:flex gap-10 text-bold text-lg">
          <Link to="/" className="text-white hover:text-black hover:scale-120 hover:font-bold">
            Home
          </Link>
          <Link to="/Aboutus" className="text-white hover:text-black hover:scale-120 hover:font-bold">
            About Us
          </Link>
          <Link to="/services" className="text-white hover:text-black hover:scale-120 hover:font-bold">
            Services
          </Link>
          <Link to="/team" className="text-white hover:text-black hover:scale-120 hover:font-bold">
            Team
          </Link>
        </nav>

        {/* Login Button */}
        <Link
          to="/Login"
          className="bg-[#27987A] text-white px-8 py-2 rounded-full hover:bg-green-600 hover:scale-110 hover:border"
        >
          Login
        </Link>
        

        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-gray-700 text-center shadow-md p-4" onClick={() => setIsMobileMenuOpen(false)}>
          <Link
            to="/"
            className="block text-white hover:text-green-500 hover:scale-120 py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block text-white hover:text-green-500 hover:scale-120 py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/services"
            className="block text-white hover:text-green-500 hover:scale-120 py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            to="/team"
            className="block text-white hover:text-green-500 hover:scale-120 py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Team
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Header;

