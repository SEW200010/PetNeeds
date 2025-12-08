import { Link } from "react-router-dom";
import { BiLogoFacebook, BiLogoInstagram, BiLogoWhatsapp, BiLogoTwitter } from "react-icons/bi";

const Footer = () => {
  return (
    <footer className="bg-blue text-white py-6" style={{ backgroundColor: "#000000" }}>
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Column 1 - Quick Links */}
          <div>
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              <li><Link to="/" className="hover:text-black">Home</Link></li>
              <li><Link to="/Product" className="hover:text-black">Product</Link></li>
              <li><Link to="/MyOrder" className="hover:text-black">MyOrder</Link></li>
              <li><Link to="/Profile" className="hover:text-black hover:font-semibold">Profile</Link></li>

            </ul>
          </div>

          {/* Column 2 - Contact Info */}
          <div>
            <h3 className="text-xl font-semibold">Contacts</h3>
            <ul className="mt-2 space-y-2">
                <p>📧 support@petstore.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p className="mt-2">📍 123 Pet Street, Animal City</p>
                <button className="mt-6 bg-[#ffffff] text-black px-6 py-3 font-bold rounded-full hover:scale-110 hover:border">Join the community</button>
                </ul>
          </div>

          {/* Column 3 - Newsletter */}
          <div className="grid grid-rows-2">
            {/* Subscription Section */}
                <div className="mb-6 text-xl font-semibold">Follow Us
                </div>
                <div className="grid grid-cols-4 md:flex gap-5">
                    <BiLogoFacebook size={40} className="border-2 rounded-3xl hover:scale-110"/>
                    <BiLogoWhatsapp size={40} className="border-2 rounded-3xl hover:scale-110"/>
                    <BiLogoTwitter size={40} className="border-2 rounded-3xl hover:scale-110"/>
                    <BiLogoInstagram size={40} className="border-2 rounded-3xl hover:scale-110"/>
                </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black my-4"></div>

        {/* Bottom Footer */}
        <div className="text-center text-white text-sm">
          &copy; {new Date().getFullYear()}All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
