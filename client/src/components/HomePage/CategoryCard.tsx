import { Link } from "react-router-dom";

interface CategoryCardProps {
  icon: string;
  title: string;
}

export default function CategoryCard({ icon, title }: CategoryCardProps) {
  return (
    <Link to="#">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md border border-gray-200 ">
        <div className="flex flex-col items-center h-[90px] gap-y-2 text-gray-800 transition-all duration-300 hover:bg-[rgb(230,255,242)] hover:shadow-xl hover:rounded-xl">
          <img
            src={icon}
            alt={title}
            className="w-10 h-[40px] object-contain"
          />
          <h3 className="text-sm text-center font-semibold">{title}</h3>
        </div>
      </div>
    </Link>
  );
}
