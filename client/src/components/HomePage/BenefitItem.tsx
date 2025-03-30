import type React from "react";

// Define the benefit item type
interface BenefitItemProps {
  icon: string;
  text: string;
  alt: string;
}

// Benefit Item Component
const BenefitItem: React.FC<BenefitItemProps> = ({ icon, text, alt }) => {
  return (
    <div className="flex flex-col items-start space-y-4 p-4 sm:p-6">
      <div className="w-12 h-12 relative">
        <img
          src={icon || "/placeholder.svg"}
          alt={alt}
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#404145] font-medium leading-tight">
        {text}
      </p>
    </div>
  );
};

export default BenefitItem;
