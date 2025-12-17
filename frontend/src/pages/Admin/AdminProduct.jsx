import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const initialProducts = [
  { id: 1, name: "Premium Dog Food 5kg", pet: "Dog", price: "Rs 4999", stock: 50 },
  { id: 2, name: "Dog Chew Toys Set", pet: "Dog", price: "Rs 2499", stock: 100 },
  { id: 3, name: "Dog Joint Supplement", pet: "Dog", price: "Rs 3999", stock: 30, rx: true },
  { id: 4, name: "Luxury Dog Bed", pet: "Dog", price: "Rs 7999", stock: 25 },
  { id: 5, name: "Premium Cat Food 3kg", pet: "Cat", price: "Rs 3499", stock: 60 },
  { id: 6, name: "Interactive Cat Toys", pet: "Cat", price: "Rs 1999", stock: 80 },
  { id: 7, name: "Cat Hairball Control", pet: "Cat", price: "Rs 2999", stock: 40, rx: true },
  { id: 8, name: "Cat Scratching Post", pet: "Cat", price: "Rs 4499", stock: 35 },
];

export default function ProductManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", pet: "", price: "", stock: "" });
  const [search, setSearch] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.pet || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all fields!");
      return;
    }

    const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;

    setProducts([
      ...products,
      {
        id: nextId,
        ...newProduct,
        price: newProduct.price.startsWith("Rs") ? newProduct.price : `Rs ${newProduct.price}`,
        stock: parseInt(newProduct.stock),
      },
    ]);

    setNewProduct({ name: "", pet: "", price: "", stock: "" });
    setShowForm(false);
  };

  // Filter products based on search query (name or pet)
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.pet.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="bg-gradient-to-b min-h-screen from-pink-50 to-white p-6">
        <div className="max-w-7xl mx-auto mt-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-700">Product Management</h1>
            <button
              className="bg-black text-white px-4 py-2 transition-all"
              onClick={() => setShowForm(!showForm)}
            >
              + Add Product
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 mb-6 rounded-xl shadow">
              <h2 className="text-xl font-bold mb-4 text-purple-700">Add New Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg"
                />
                <input
                  type="text"
                  name="pet"
                  placeholder="Pet Type (Dog/Cat/Fish/Bird)"
                  value={newProduct.pet}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg"
                />
                <input
                  type="text"
                  name="price"
                  placeholder="Price (e.g., Rs 2000)"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg"
                />
              </div>
              <button
                onClick={handleAddProduct}
                className="mt-4 bg-purple-700 text-white px-4 py-2 hover:bg-purple-800 transition-all"
              >
                Add Product
              </button>
            </div>
          )}

          <div className="mb-6 mt-8">
            <input
              type="text"
              placeholder="Search products by name or pet type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border rounded-xl shadow focus:ring focus:ring-purple-200"
            />
          </div>

          <table className="w-full bg-white shadow rounded-xl overflow-hidden">
            <thead className="bg-black/20 text-left">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Pet Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-b hover:bg-purple-50">
                  <td className="p-4 font-medium text-gray-700">{p.id}</td>
                  <td className="p-4 font-medium text-gray-700">{p.name}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                      {p.pet}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-gray-700">{p.price}</td>
                  <td className="p-4 font-semibold text-green-600">{p.stock}</td>
                  <td className="p-4 flex gap-3">
                    <button className="p-2 bg-gray-100 rounded hover:bg-gray-200">
                      <FiEdit className="text-gray-700" />
                    </button>
                    <button className="p-2 bg-red-100 rounded hover:bg-red-200">
                      <FiTrash2 className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
