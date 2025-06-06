import { useState, useEffect } from "react";
import img1 from "../assets/Home_images/gallery1.jpg";
import img2 from "../assets/Home_images/gallery2.jpg";
import img3 from "../assets/Home_images/gallery3.jpg";
import img4 from "../assets/Home_images/gallery4.jpg";

const featuredImages = [
  img1, img2, img3, img4,
  img1, img2, img3, img4,
  img4, img3, img2, img1,
  img4, img3, img2, img1,
];

const IMAGES_PER_PAGE = 8;

const MovingGallery = () => {
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + IMAGES_PER_PAGE) % featuredImages.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  let visibleImages = featuredImages.slice(startIndex, startIndex + IMAGES_PER_PAGE);

  // If we're near the end and don't have 8 left, wrap around to the start
  if (visibleImages.length < IMAGES_PER_PAGE) {
    visibleImages = visibleImages.concat(featuredImages.slice(0, IMAGES_PER_PAGE - visibleImages.length));
  }

  return (
    <div className="overflow-hidden w-full max-w-6xl mx-auto p-1">
      <div className="grid grid-cols-4 gap-4 transition-all duration-700">
        {visibleImages.map((img, index) => (
          <div key={index} className="p-2">
            <img
              src={img}
              alt={`Gallery ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovingGallery;
