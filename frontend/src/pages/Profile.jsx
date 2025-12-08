import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Heart, Plus, Trash2, Key, Bell, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Profile = () => {



  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 555-0101",
    address: "123 Main St, City, State 12345"
  });
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [pets, setPets] = useState([
    { id: 1, name: "Max", breed: "Golden Retriever", type: "Dog", age: 3 },
    { id: 2, name: "Bella", breed: "Persian", type: "Cat", age: 2 }
  ]);

  const handleAddPet = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPet = {
      id: pets.length + 1,
      name: formData.get('name'),
      breed: formData.get('breed'),
      age: parseInt(formData.get('age')),
      type: formData.get('type')
    };
    setPets([...pets, newPet]);
    setIsAddingPet(false);
    e.target.reset();
  };

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-white">
        <section className="py-20 px-4">
    <h1 className="text-6xl font-bold text-center mb-12 text-black">
      My Profile
    </h1>

    <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-3 gap-8  ">

      {/* LEFT PROFILE CARD */}
      <div className=" shadow-xl rounded-2xl p-8 flex flex-col items-center gap-4 bg-black/10">
        <div
          className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-purple-600
          flex items-center justify-center text-white text-3xl font-bold"
        >
          J
        </div>

        {!isEditing ? (
          <>
            <h2 className="text-2xl font-semibold text-black">{profile.name}</h2>
            <span className="bg-purple-100 px-4 py-1 rounded-full text-sm text-black font-medium">
              Premium Member
            </span>

            <div className="mt-6 space-y-3 w-full">
              <p className="flex items-center gap-3 text-black">
                <Mail size={18} /> {profile.email}
              </p>
              <p className="flex items-center gap-3 text-black">
                <Phone size={18} /> {profile.phone}
              </p>
              <p className="flex items-center gap-3 text-black">
                <MapPin size={18} /> {profile.address}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full py-3 rounded-xl font-medium text-white hover:scale-110 bg-gradient-to-r from-pink-500 to-purple-600"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <div className="w-full">
            <h2 className="text-2xl font-semibold text-black mb-4">Edit Profile</h2>
            <form className="space-y-4">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="Name"
              />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="Email"
              />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="Phone"
              />
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="Address"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full py-3 rounded-xl font-medium text-white bg-gray-500 hover:scale-110"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-full py-3 rounded-xl font-medium text-white hover:scale-110 bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-8">

            {/* MY PETS */}
            <div className="p-8 bg-black/10 rounded-2xl  drop-shadow-lg">
              <div className="flex justify-between items-center mb-6 drop-shadow-lg">
                <h3 className="text-xl font-semibold text-purple-800">My Pets</h3>
                <button
                  onClick={() => setIsAddingPet(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600
                  text-white px-4 py-2 rounded-lg text-sm hover:scale-110 font-medium"
                >
                  <Plus size={16} /> Add Pet
                </button>
              </div>

              {!isAddingPet ? (
                <div className="grid lg:grid-cols-2 gap-6">
                  {pets.map((pet) => (
                    <div key={pet.id} className="bg-yellow-50 border border-orange-200 p-6 rounded-xl shadow-sm">
                      <div className="flex justify-between items-center drop-shadow-lg">
                        <div>
                          <h4 className="text-lg font-semibold">{pet.name}</h4>
                          <p className="text-sm text-black">{pet.breed} • {pet.type}</p>
                        </div>
                        <Trash2 size={18} className="text-red-500 cursor-pointer" />
                      </div>
                      <p className="mt-3 text-black text-sm">
                        Breed: {pet.breed} <br />
                        Age: {pet.age} years
                      </p>
                      <button className="w-full mt-4 border hover:scale-110 border-purple-300 rounded-lg py-2 text-sm text-black font-medium">
                        View Recommendations
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full">
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">Add New Pet</h3>
                  <form onSubmit={handleAddPet} className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      className="w-full p-3 border rounded-lg"
                      placeholder="Pet Name"
                      required
                    />
                    <input
                      type="text"
                      name="breed"
                      className="w-full p-3 border rounded-lg"
                      placeholder="Breed"
                      required
                    />
                    <input
                      type="number"
                      name="age"
                      className="w-full p-3 border rounded-lg"
                      placeholder="Age (years)"
                      required
                    />
                    <select
                      name="type"
                      className="w-full p-3 border rounded-lg"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingPet(false)}
                        className="w-full py-3 rounded-xl font-medium text-white bg-gray-500 hover:scale-110"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl font-medium text-white hover:scale-110 bg-gradient-to-r from-pink-500 to-purple-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* ACCOUNT SETTINGS */}
            <div className="p-8 rounded-2xl shadow-lg bg-black/10">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Account Settings</h3>

              <div className="space-y-4">
                <button className="flex items-center gap-4 w-full border rounded-xl py-3 px-4 text-black">
                  <Key size={18} /> Change Password
                </button>

                <button className="flex items-center gap-4 w-full border rounded-xl py-3 px-4 text-black">
                  <Bell size={18} /> Email Preferences
                </button>

                <button className="flex items-center gap-4 w-full border rounded-xl py-3 px-4 text-black">
                  <AlertCircle size={18} /> Delete Account
                </button>
              </div>
            </div>

            {/* SUBSCRIPTIONS */}
            <div className="p-8 rounded-2xl shadow-lg bg-black/10">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-purple-800 mb-4">
                <Heart className="text-pink-500 " size={20} /> Active Subscriptions
              </h3>

              <p className="text-lg font-medium">3 Products</p>
              <p className="text-black text-sm mt-1">Next delivery in 5 days</p>

              <button className="mt-14 w-100 hover:scale-110 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-sm text-white font-medium">
                Manage Subscriptions
              </button>
            </div>
          </div>
        </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
