import React from "react";
import { Link } from "react-router-dom";
interface ServiceCardProps {
  image: string;
  title: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ image, title }) => {
  return (
    <Link to="#">
      <div className="flex flex-col w-[220px] h-[150px] items-center justify-start p-6 bg-white rounded-2xl shadow-md border  border-gray-200 hover:shadow-lg hover:shadow-gray-700 mb-[10px]">
        <div className="flex flex-col items-center gap-y-2 text-gray-800 transition-all duration-300 hover:rounded-xl">
          <img
            src={image}
            alt={title}
            className="w-20 h-[50px] object-contain"
          />
          <h3 className="text-sm text-center font-semibold">{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;