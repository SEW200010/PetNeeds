import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user_id from localStorage (assuming it's stored after login)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.user_id) {
      setUserId(storedUser.user_id);
      loadOrders(storedUser.user_id);
    } else {
      // Fallback to localStorage for orders if no user logged in
      const saved = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(saved);
    }
  }, []);

  const loadOrders = async (uid) => {
    // Use localStorage fallback for orders
    const saved = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(saved);
  };

  const saveOrders = async (updatedOrders) => {
    if (!userId) {
      // Fallback to localStorage if no user logged in
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      return;
    }

    try {
      const total = updatedOrders.reduce((sum, item) => {
        const price = parseFloat((item.price || "").replace(/[^0-9]/g, ""));
        return sum + price * (item.quantity || 1);
      }, 0);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          items: updatedOrders,
          total: total,
          status: "pending",
        }),
      });

      if (!response.ok) {
        console.error("Failed to save order");
      }
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

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

  // Calculate subtotal in LKR (Rs.)
  const subtotal = orders.reduce((total, item) => {
    // Convert price string to number: supports Rs, LKR, commas, spaces
    const priceNumber = parseFloat(
      (item.price || "").replace(/[^0-9]/g, "")
    );

    if (isNaN(priceNumber)) return total;

    return total + priceNumber * (item.quantity || 1);
  }, 0);

  const totalQuantity = orders.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const placeOrder = async () => {
    if (!userId) {
      alert('Please log in to place an order.');
      return;
    }

    if (orders.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          items: orders,
          total: subtotal,
          status: 'pending',
          subscription: 'No',
          prescription: '-',
        }),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        setOrders([]);
        localStorage.removeItem('orders');
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  return (
    <div>
      <Header />

      <main className="min-h-screen bg-white">
      <section className="py-20 px-4">
        <div className="container mx-auto px-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-12">Shopping Cart</h1>

        {orders.length === 0 ? (
          <p className="text-center text-xl text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT — Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {orders.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />

                  <div className="flex-1 px-5">
                    <h2 className="text-lg font-semibold">{item.name}</h2>

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

                  {/* Show actual item price in Rs */}
                  <div className="flex flex-col items-end">
                    <p className="text-xl font-bold text-black">
                      Rs. {parseFloat(item.price.replace(/[^0-9]/g, "")).toLocaleString()}
                    </p>

                    <button
                      onClick={() => deleteItem(index)}
                      className="mt-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT — Order Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-xl h-fit">
              <h2 className="text-2xl font-bold text-black mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-3 text-lg">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between mb-3 text-lg">
                <span className="text-gray-700">Total Quantity</span>
                <span className="font-semibold">{totalQuantity}</span>
              </div>

              <div className="flex justify-between mb-3 text-lg">
                <span className="text-gray-700">Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>

              <hr className="my-4" />

              {/* Total Price in Rs. */}
              <div className="flex justify-between text-2xl font-bold mb-6">
                <span>Total Price</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>

              <button className="w-full py-3 text-white font-semibold text-lg bg-red-600 hover:opacity-90 hover:scale-90">
                Proceed to Checkout
              </button>
              
              <Link to="/Product">
              <button className="w-full mt-4 py-2 border border-gray-300 hover:scale-90">
                Continue Shopping
              </button>
              </Link>
            </div>
          </div>
        )}
        </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrder;
