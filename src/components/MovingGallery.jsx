import { useState, useEffect } from "react";

const featuredImages = [
  "/Home_images/image1.jpg",
  "/Home_images/image2.jpg",
  "/Home_images/image3.jpg",
  "/Home_images/image1.jpg",
  "/Home_images/image2.jpg",
  "/Home_images/image3.jpg",
];

const MovingGallery = () => {
  const [images, setImages] = useState(featuredImages);  // Set the initial images
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Move the first image to the end to create the circular effect
      setImages((prevImages) => {
        const firstImage = prevImages[0];
        const newImages = prevImages.slice(1);
        return [...newImages, firstImage];  // Move the first image to the end
      });
      
      // Increment position for smooth transition
      setPosition((prev) => (prev + 1) % 3);  // We have 3 visible images, so we cycle through 0, 1, 2
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden w-full max-w-5xl mx-auto">
      <div
        className="grid grid-cols-3 gap-4 transition-transform duration-700"
        style={{
          transform: `translateX(-${position * 100}%)`, // Moves the entire grid left to show the next set of images
        }}
      >
        {/* Render the images in a 3-image visible format */}
        {images.map((img, index) => (
          <div key={index} className="p-2">
            <img
              src={img}
              alt={`Event ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovingGallery;
