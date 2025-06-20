import { useState } from "react";

const Subscribe = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      alert(`Subscribed with: ${email}`);
      setEmail(""); // Clear input after subscribing
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold">Subscribe to Our Newsletter</h3>
      <br/>
      {/* Email Input and Subscribe Button */}
      <div className="flex items-center border border-radius-5px rounded-xl overflow-hidden">
        <input type="email"placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white text-black px-3 py-2 outline-none"/>
        <button onClick={handleSubscribe} className="bg-emerald-600 text-white px-6 py-2 hover:bg-green-600 hover:scale-110 transition">Subscribe</button>
      </div>
    </div>
  );
};

export default Subscribe;
