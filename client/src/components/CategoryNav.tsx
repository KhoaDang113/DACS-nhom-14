import { ChevronRight } from "lucide-react";

const categories = [
  "Graphics & Design",
  "Programming & Tech",
  "Digital Marketing",
  "Video & Animation",
  "Writing & Translation",
  "Music & Audio",
  "Business",
  "Finance",
  "AI Services",
  "Personal Growth",
];

export default function CategoryNav() {
  return (
    <div className="border-b border-gray-200 overflow-x-auto">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 py-3 whitespace-nowrap">
          {categories.map((category, index) => (
            <button
              key={index}
              className="text-gray-600 hover:text-gray-900 text-sm md:text-base"
            >
              {category}
            </button>
          ))}
          <button className="text-gray-600">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
