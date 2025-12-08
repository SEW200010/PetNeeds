import React, { useState } from "react";

const Subscribe = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 rounded-l-lg text-black"
      />
      <button
        type="submit"
        className="bg-blue-600 px-4 py-2 rounded-r-lg text-white"
      >
        Subscribe
      </button>
    </form>
  );
};

export default Subscribe;
