import { Link } from "react-router-dom";

const DashboardCard = ({ to, icon, title, gradientColors }) => {
  // gradientColors is an array, e.g. ['#f43f5e', '#8b5cf6']
  const gradientStyle = {
    border: "3px solid",
    borderRadius: "9999px",
    borderImageSlice: 1,
    borderImageSource: `linear-gradient(to right, ${gradientColors.join(", ")})`, 
  };

  return (
    <Link to={to} className="flex flex-col items-center m-10 w-40 m-4">
      <div
        style={gradientStyle}
        className="w-40 h-40 rounded-full flex justify-center items-center"
      >
        <img src={icon} alt={title} className="w-20 h-20" />
      </div>
      <p className="mt-2 font-medium text-black">{title}</p>
    </Link>
  );
};

export default DashboardCard;
