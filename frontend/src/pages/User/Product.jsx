import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FilterCard from "./FilterCard";
import image1 from "../../assets/Product/image1.png";
import image2 from "../../assets/Product/image2.jpeg";
import image3 from "../../assets/Product/image3.jpeg";
import image4 from "../../assets/Product/image4.jpeg";
import image5 from "../../assets/Product/image5.webp";
import image6 from "../../assets/Product/image6.jpeg";
import image7 from "../../assets/Product/image7.jpeg";
import image8 from "../../assets/Product/image8.jpeg";
import image9 from "../../assets/Product/image9.jpeg";
import image10 from "../../assets/Product/image10.webp";
import image11 from "../../assets/Product/image11.webp";
import image12 from "../../assets/Product/image12.jpeg";
import image13 from "../../assets/Product/image13.jpeg";
import image14 from "../../assets/Product/image14.jpg";
import image15 from "../../assets/Product/image15.jpg";
import image16 from "../../assets/Product/image16.jpeg";
import image17 from "../../assets/Product/image17.jpeg";
import image18 from "../../assets/Product/image18.jpg";
import image19 from "../../assets/Product/image19.jpeg";
import image20 from "../../assets/Product/image20.jpeg";
import image21 from "../../assets/Product/image21.jpeg";
import image22 from "../../assets/Product/image22.jpeg";
import image23 from "../../assets/Product/image23.jpeg";
import image24 from "../../assets/Product/image24.png";



  const products = [
    { id: 1, name: "Premium Dog Food", price: "Rs.1000", image:image1, category: "Dog" },
    { id: 2, name: "Dog Leash", price: "Rs.800", image:image2, category: "Dog" },
    { id: 3, name: "Dog Chew Toy", price: "Rs.1200", image:image3, category: "Dog" },
    { id: 4, name: "WaterCup", price: "Rs.500",image:image4, category: "Dog" },
    { id: 5, name: "Comb", price: "Rs.300", image:image5, category: "Dog" },
    { id: 6, name: "Premium puppy", price: "Rs.2500", image:image6, category: "Dog" },
    { id: 7, name: "Proplan", price: "Rs.1800", image:image7, category: "Cat" },
    { id: 8, name: "Bascket",price: "Rs.2000", image:image8, category: "Cat" },
    { id: 9, name: "Bed", price: "Rs.3000", image:image9, category: "Cat" },
    { id: 10, name: "Toy", price: "Rs.1200", image:image10, category: "Cat" },
    { id: 11, name: "Toy", price: "Rs.1500", image:image11, category: "Cat" },
    { id: 12, name: "Bonoat", price: "Rs.4100", image:image12, category: "Cat" },
    { id: 13, name: "Gem Paharam", price: "Rs.2600", image:image13, category: "Bird" },
    { id: 14, name: "Birds Care", price: "Rs.1300", image:image14, category: "Bird" },
    { id: 15, name: "Bird Toy",price: "Rs.700", image:image15, category: "Bird" },
    { id: 16, name: "Bird Toy Set", price: "Rs.800",image:image16, category: "Bird" },
    { id: 17, name: "Peckish Complete", price: "Rs.3600", image:image17, category: "Bird" },
    { id: 18, name: "Cracked Corne", price: "Rs.2300", image:image18, category: "Bird" },
    { id: 19, name: "Fish Tank", price: "Rs.2000", image:image19, category: "Fish" },
    { id: 20, name: "Aquarium Filter", price: "Rs.5000", image:image20, category: "Fish" },
    { id: 21, name: "Fish Food", price: "Rs.1000", image:image21, category: "Fish" },
    { id: 22, name: "Seeds", price: "Rs.1000", image:image22, category: "Fish" },
    { id: 23, name: "Blue salt", price: "Rs.230", image:image23, category: "Fish" },
    { id: 24, name: "Bettafix", price: "Rs.500", image:image24, category: "Fish" },

  ];

const Product = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [petType, setPetType] = useState('All Pets');
  const [price, setPrice] = useState(5500);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && ['Dog', 'Cat', 'Bird', 'Fish'].includes(category)) {
      setPetType(category);
    }
  }, [searchParams]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesPetType = petType === 'All Pets' || product.category === petType;
    const productPrice = parseFloat(product.price.replace('Rs.', ''));
    const matchesPrice = productPrice <= price;
    return matchesSearch && matchesPetType && matchesPrice;
  });

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const handleQuickAdd = (product) => {
    const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
    existingOrders.push(product);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    alert('Product added to order!');
  };

  return (
    <div>
      <Header />
      <main className="min-h-screen">
        <section className="py-20 px-4">
          <div className="container mx-auto px-0">
            <h1 className="text-6xl font-bold text-center mb-12">Our Products</h1>
            <div className="mb-12 flex justify-center">
              <FilterCard search={search} setSearch={setSearch} petType={petType} setPetType={setPetType} price={price} setPrice={setPrice} />
            </div>
            <div>
                {Object.keys(groupedProducts).map((category) => (
                  <div key={category} className="mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">{category} Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {groupedProducts[category].map((product) => (
                        <div
                                key={product.id}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col items-center hover:scale-105 transition-transform"
                              >
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-48 object-cover"
                                />

                                {/* CONTENT */}
                                <div className="p-4 flex flex-col gap-2 w-full">


                                  {/* Name */}
                                  <h3 className="text-sm md:text-lg font-semibold text-center">
                                    {product.name}
                                  </h3>

                                  {/* Price + Stock */}
                                  <div className="flex items-center justify-between mt-2">
                                    <p className="text-lg md:text-xl font-bold text-gray-900">
                                      {product.price}
                                    </p>

                                    <p className="text-blue-500 text-xs md:text-sm font-medium">
                                      50 in stock
                                    </p>
                                  </div>
                                  {/* Quick Add Button */}
                                  <button
                                    onClick={() => handleQuickAdd(product)}
                                    className="mt-3 w-full py-2 text-white font-medium bg-red-600 hover:bg-red-700 transition-colors rounded-md"
                                  >
                                    Quick Add
                                  </button>
                                </div>
                              </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
