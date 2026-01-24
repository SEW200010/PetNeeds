import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FilterCard from "./FilterCard";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [petType, setPetType] = useState('All Pets');
  const [price, setPrice] = useState(5500);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category && ['Dog', 'Cat', 'Bird', 'Fish'].includes(category)) {
      setPetType(category);
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = '/placeholder-image.png'; // Fallback image
                                      e.target.alt = 'Image not available';
                                    }}
                                  />
                                </div>

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
                                      {product.stock} in stock
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
