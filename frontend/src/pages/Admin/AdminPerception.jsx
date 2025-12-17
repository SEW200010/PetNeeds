import React from "react";
import { Eye, Check, X, AlertCircle } from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const prescriptions = [
  {
    id: "ORD-001",
    name: "John Doe",
    product: "Dog Joint Supplement",
    date: "2025-11-20",
    medicines: ["Glucosamine", "Chondroitin"],
    status: "Pending",
  },
  {
    id: "ORD-002",
    name: "John Doe",
    product: "Cat Hairball Control",
    date: "2025-11-21",
    medicines: ["Petroleum jelly", "Mineral oil"],
    status: "Pending",
  },
];

const PrescriptionApproval = () => {
  return (
    <div>
      <Header />

      <main className="bg-gradient-to-b min-h-screen from-pink-50 to-white p-6">
        <div className="max-w-7xl mx-auto mt-12">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">
            Prescription Approval
          </h1>

          {/* Status Badge */}
          <div className="flex justify-end mb-4">
            <span className="bg-orange-500 text-white px-4 py-2  shadow text-sm font-semibold hover:scale-110">
              {prescriptions.length} Pending
            </span>
          </div>

          {/* Prescription Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            {prescriptions.map((item, index) => (
              <div
                key={item.id ?? index}
                className="bg-white shadow-lg rounded-xl p-6 border relative overflow-hidden "
              >
                {/* Top Color Border */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-400" />

                {/* Pending Badge */}
                <span className="absolute top-3 right-3 bg-yellow-100 text-yellow-600 px-3 py-1 text-xs font-medium border">
                  {item.status}
                </span>

                <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                <p className="text-gray-500 text-sm mt-1">Order ID: {item.id}</p>

                <div className="mt-3">
                  <p className="text-gray-400 text-sm">Product</p>
                  <p className="font-medium text-gray-700">{item.product}</p>
                </div>

                <div className="mt-3">
                  <p className="text-gray-400 text-sm">Upload Date</p>
                  <p className="font-medium text-gray-700">{item.date}</p>
                </div>

                {/* OCR Labels */}
                <div className="mt-3">
                  <p className="text-gray-400 text-sm mb-2">Detected Medicines (OCR)</p>
                  <div className="flex flex-wrap gap-2">
                    {item.medicines.map((m, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-xs"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* View Prescription */}
                <button
                  type="button"
                  aria-label={`View prescription ${item.id}`}
                  className="w-full flex items-center justify-between mt-5 px-4 py-3 border bg-gray-50 hover:bg-gray-100 transition"
                >
                  <span className="text-gray-700 font-medium">View Prescription</span>
                  <Eye size={18} className="text-gray-600" />
                </button>

                {/* Buttons */}
                <div className="flex gap-4 mt-5">
                  <button
                    type="button"
                    aria-label={`Approve ${item.id}`}
                    className="flex-1 bg-green-600 hover:scale-110 text-white py-2.5 flex items-center justify-center gap-2 hover:bg-green-700 transition"
                  >
                    <Check size={18} /> Approve
                  </button>

                  <button
                    type="button"
                    aria-label={`Reject ${item.id}`}
                    className="flex-1 border border-red-400 hover:scale-110 text-red-500 py-2.5 flex items-center justify-center gap-2 hover:bg-red-50 transition"
                  >
                    <X size={18} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Guidelines Section */}
          <div className="mt-10 p-6 bg-pink-50 border rounded-xl shadow">
            <div className="flex items-center gap-2 text-purple-700 font-semibold text-lg">
              <AlertCircle size={22} />
              Prescription Review Guidelines
            </div>

            <ul className="mt-3 text-gray-700 leading-relaxed space-y-2 list-disc list-inside">
              <li>Verify the prescription is from a licensed veterinarian</li>
              <li>Check that the prescribed medication matches the ordered product</li>
              <li>Ensure the prescription is current and not expired</li>
              <li>Confirm the pet owner's name matches the order</li>
              <li>Look for proper dosage and administration instructions</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrescriptionApproval;
