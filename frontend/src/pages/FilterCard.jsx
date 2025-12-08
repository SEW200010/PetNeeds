import React from "react";
import { FiSearch } from "react-icons/fi";

const FilterCard = ({ search, setSearch, petType, setPetType, price, setPrice }) => {
  const petTypes = ['All Pets', 'Dog', 'Cat', 'Fish', 'Bird'];

  const resetFilters = () => {
    setSearch('');
    setPetType('All Pets');
    setPrice(5500);
  };

  return (
    <div className="sticky top-24 w-[550px] bg-black  shadow-xl rounded-2xl p-8 h-fit">
      <h2 className="text-xl font-semibold text-center text-white mb-6">Filter</h2>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm text-white mb-1">Search</label>
        <div className="flex items-center bg-white w-full px-4 py-3 rounded-lg">
          <FiSearch className="text-black" />
          <input
            type="text"
            className="w-full text-black ml-2 outline-none"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Pet Type */}
      <div className="mb-6">
        <label className="block text-sm text-white mb-1">Pet Type</label>
        <select
          className="w-full bg-gray-100 px-4 py-3 rounded-lg outline-none"
          value={petType}
          onChange={(e) => setPetType(e.target.value)}
        >
          {petTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <label className="block text-sm text-white mb-1">
          Price Range: 0 - {price}
        </label>
        <input
          type="range"
          min="0"
          max="5500"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full accent-purple-600"
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full border border-gray-300 py-3 hover:scale-110 rounded-lg font-semibold text-white hover:bg-purple-500"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterCard;
