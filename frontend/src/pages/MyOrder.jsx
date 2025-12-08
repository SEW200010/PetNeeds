import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(saved);
  }, []);

  const updateLocalStorage = (updated) => {
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  // Increase quantity
  const increaseQty = (index) => {
    const updated = [...orders];
    updated[index].quantity = (updated[index].quantity || 1) + 1;
    setOrders(updated);
    updateLocalStorage(updated);
  };

  // Decrease quantity
  const decreaseQty = (index) => {
    const updated = [...orders];
    if ((updated[index].quantity || 1) > 1) {
      updated[index].quantity -= 1;
      setOrders(updated);
      updateLocalStorage(updated);
    }
  };

  // Remove item
  const deleteItem = (index) => {
    const updated = orders.filter((_, i) => i !== index);
    setOrders(updated);
    updateLocalStorage(updated);
  };

  // Calculate subtotal
  const subtotal = orders.reduce((total, item) => {
    const priceNumber = parseFloat(item.price.replace("$", ""));
    return total + priceNumber * (item.quantity || 1);
  }, 0);

  return (
    <div>
      <Header />

      <main className="min-h-screen p-30 bg-gradient-to-b from-purple-50 to-pink-50">
        <h1 className="text-4xl font-bold text-purple-800 mb-10">Shopping Cart</h1>

        {orders.length === 0 ? (
          <p className="text-center text-xl text-gray-600">
            Your cart is empty.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT — Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {orders.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between"
                >
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />

                  {/* Name */}
                  <div className="flex-1 px-5">
                    <h2 className="text-lg font-semibold">{item.name}</h2>

                    {/* Quantity Controller */}
                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => decreaseQty(index)}
                        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                      >
                        <FaMinus size={12} />
                      </button>

                      <span className="text-lg font-medium">
                        {item.quantity || 1}
                      </span>

                      <button
                        onClick={() => increaseQty(index)}
                        className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <p className="text-xl font-bold text-purple-700">
                    {item.price}
                  </p>

                  {/* Delete */}
                  <button
                    onClick={() => deleteItem(index)}
                    className="text-red-500 ml-5 hover:text-red-700"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* RIGHT — Order Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-xl h-fit">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-3 text-lg">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-3 text-lg">
                <span className="text-gray-700">Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-2xl font-bold mb-6">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <button className="w-full py-3 rounded-xl text-white font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90">
                Proceed to Checkout
              </button>

              <button className="w-full mt-4 py-2 border border-gray-300 rounded-xl">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyOrder;
