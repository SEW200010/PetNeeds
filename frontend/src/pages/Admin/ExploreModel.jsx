import React, { useEffect, useState } from "react";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";

const ExploreModel = () => {
  const [date, setDate] = useState(new Date());
  const [fileUrl, setFileUrl] = useState('');
  const [droppedFile, setDroppedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);

  const eventDates = [
    new Date(2025, 5, 25),
    new Date(2025, 5, 30),
  ];

  const toggleFileOptions = () => {
    setShowFileOptions(!showFileOptions);
  };

  const allowedTypes = [
    'application/json',
    'text/csv',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && allowedTypes.includes(file.type)) {
      setDroppedFile(file);
      console.log('Dropped file:', file);
    } else {
      alert('Only csv, pdf or xlsx files are allowed.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file && allowedTypes.includes(file.type)) {
      setDroppedFile(file);
      console.log('Picked file:', file);
    } else {
      alert('Only csv, pdf or xlsx files are allowed.');
    }
  };

  const handleDownload = (filePath) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowFileOptions(false);
  };

  return (
    <div>
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">
          <AdminSidebar date={date} setDate={setDate} eventDates={eventDates} />

          <div className="w-full md:w-3/4 px-4 py-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-15">Explore Model</h1>

            <div className="bg-gray-200 rounded-md p-4 mb-6 relative">
              <h2 className="text-lg font-semibold text-green-500 mb-2">Export</h2>
              <p className="mb-3">You will be able to select the particular data set to export.</p>
              <button
                onClick={toggleFileOptions}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                New export
              </button>

              {showFileOptions && (
                <div className="absolute mt-2 bg-white shadow-md border rounded w-40 z-10">
                  <button
                    onClick={() => handleDownload('/Model_files/example_CSV.csv')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleDownload('/Model_files/example_XLSX.xlsx')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Export as XLSX
                  </button>
                  <button
                    onClick={() => handleDownload('/Model_files/example_PDF.pdf')}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                </div>
              )}
            </div>

            {/* Import Section */}
            <div className="rounded-md p-4 bg-gray-200 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-green-500">Import</h2>
                <a href="#" className="text-blue-500 text-sm hover:underline">Help</a>
              </div>

              <div
                className={`border-2 border-dashed rounded-md h-32 flex justify-center items-center mb-4 transition-colors ${
                  dragActive ? 'border-green-600 bg-green-50' : 'border-gray-600'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <label className="cursor-pointer bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
                  Add File
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </label>
                {droppedFile && (
                  <p className="ml-4 text-gray-700 text-sm">{droppedFile.name}</p>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="File URL"
                  className="flex-1 border px-3 py-2 rounded"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                />
                <button className=" border border-gray-500 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                  Upload from URL
                </button>
              </div>
            </div>

            {/* Run Button */}
            <div className="flex justify-center">
              <button className="bg-green-700 text-white px-8 py-2 rounded hover:bg-green-800">
                Run
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExploreModel;
