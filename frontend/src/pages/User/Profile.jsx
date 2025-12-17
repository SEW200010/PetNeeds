import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Key,
  Bell,
  AlertCircle
} from "lucide-react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Profile = () => {
  const [userId, setUserId] = useState(null);
  const [pets, setPets] = useState([]);
  const [isAddingPet, setIsAddingPet] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 555-0101",
    address: "123 Main St, City, State 12345",
    image: null
  });

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const uid = storedUser?.user_id || "507f1f77bcf86cd799439011";

    localStorage.setItem("user", JSON.stringify({ user_id: uid }));
    setUserId(uid);

    const savedProfile = JSON.parse(localStorage.getItem(`profile_${uid}`));
    if (savedProfile) setProfile(savedProfile);

    const savedPets = JSON.parse(localStorage.getItem(`pets_${uid}`));
    if (savedPets) {
      setPets(savedPets);
    } else {
      const mockPets = [
        { _id: "1", name: "Buddy", breed: "Golden Retriever", age: "3", type: "Dog" },
        { _id: "2", name: "Whiskers", breed: "Persian", age: "2", type: "Cat" }
      ];
      setPets(mockPets);
      localStorage.setItem(`pets_${uid}`, JSON.stringify(mockPets));
    }
  }, []);

  /* ================= PROFILE IMAGE UPLOAD ================= */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedProfile = { ...profile, image: reader.result };
      setProfile(updatedProfile);
      localStorage.setItem(`profile_${userId}`, JSON.stringify(updatedProfile));
    };
    reader.readAsDataURL(file);
  };

  /* ================= SAVE PROFILE ================= */
  const saveProfile = () => {
    localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
    setIsEditing(false);
  };

  /* ================= PET ACTIONS ================= */
  const deletePet = (petId) => {
    const updatedPets = pets.filter((p) => p._id !== petId);
    setPets(updatedPets);
    localStorage.setItem(`pets_${userId}`, JSON.stringify(updatedPets));
  };

  const handleAddPet = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const newPet = {
      _id: Date.now().toString(),
      name: form.get("name"),
      breed: form.get("breed"),
      age: form.get("age"),
      type: form.get("type")
    };

    const updatedPets = [...pets, newPet];
    setPets(updatedPets);
    localStorage.setItem(`pets_${userId}`, JSON.stringify(updatedPets));
    setIsAddingPet(false);
    e.target.reset();
  };

  return (
    <div>
      <Header />

      <main className="min-h-screen bg-white py-20 px-4">
        <h1 className="text-6xl font-bold text-center mb-12 text-black">
          My Profile
        </h1>

        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-3 gap-8">

          {/* ================= LEFT PROFILE ================= */}
          <div className="shadow-xl rounded-2xl p-8 flex flex-col items-center gap-4">

            {/* PROFILE IMAGE */}
            <label className="cursor-pointer">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-black"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-black flex items-center justify-center text-white text-3xl font-bold">
                  {profile.name.charAt(0)}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </label>

            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <span className="font-bold text-sm">Premium Member</span>

                <div className="mt-6 space-y-3 w-full font-bold">
                  <p className="flex gap-3">
                    <Mail size={18} /> {profile.email}
                  </p>
                  <p className="flex gap-3">
                    <Phone size={18} /> {profile.phone}
                  </p>
                  <p className="flex gap-3">
                    <MapPin size={18} /> {profile.address}
                  </p>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 w-full py-3 bg-red-600 text-white font-bold hover:scale-110"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <div className="w-full space-y-4">
                <input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 border rounded"
                />
                <input
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-3 border rounded"
                />
                <input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-3 border rounded"
                />
                <input
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  className="w-full p-3 border rounded"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-full py-3 bg-black text-white font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="w-full py-3 bg-red-600 text-white font-bold"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT SECTION ================= */}
          <div className="lg:col-span-2 space-y-8">

            {/* MY PETS */}
            <div className="p-8 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">My Pets</h3>
                <button
                  onClick={() => setIsAddingPet(true)}
                  className="bg-red-600 text-white px-4 py-2 font-bold flex gap-2"
                >
                  <Plus size={16} /> Add Pet
                </button>
              </div>

              {!isAddingPet ? (
                <div className="grid lg:grid-cols-2 gap-6">
                  {pets.map((pet) => (
                    <div key={pet._id} className="bg-black text-white p-6 rounded-xl">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-bold">{pet.name}</h4>
                          <p>{pet.breed} • {pet.type}</p>
                        </div>
                        <Trash2
                          size={18}
                          className="text-red-500 cursor-pointer"
                          onClick={() => deletePet(pet._id)}
                        />
                      </div>
                      <p className="mt-3">Age: {pet.age} years</p>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleAddPet} className="space-y-4">
                  <input name="name" required className="w-full p-3 border rounded" placeholder="Name" />
                  <input name="breed" required className="w-full p-3 border rounded" placeholder="Breed" />
                  <input name="age" type="number" required className="w-full p-3 border rounded" placeholder="Age" />
                  <select name="type" required className="w-full p-3 border rounded">
                    <option value="">Select Type</option>
                    <option>Dog</option>
                    <option>Cat</option>
                    <option>Bird</option>
                    <option>Other</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingPet(false)}
                      className="w-full py-3 bg-black text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full py-3 bg-red-600 text-white"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ACCOUNT SETTINGS */}
            <div className="p-8 rounded-2xl shadow-xl space-y-4">
              <button className="flex gap-4 w-full border py-3 px-4">
                <Key size={18} /> Change Password
              </button>
              <button className="flex gap-4 w-full border py-3 px-4">
                <Bell size={18} /> Email Preferences
              </button>
              <button className="flex gap-4 w-full border py-3 px-4">
                <AlertCircle size={18} /> Delete Account
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
