import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AdminProduct = () => {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white p-6">
        <h1>Admin Product Page</h1>
        {/* Add your admin product content here */}
      </div>
      <Footer />
    </div>
  );
};

export default AdminProduct;
