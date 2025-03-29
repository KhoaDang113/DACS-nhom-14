import type { ReactNode } from "react";

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
}

export default function CategoryCard({ icon, title }: CategoryCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-gray-600 mb-3">{icon}</div>
      <h3 className="text-sm text-center font-medium text-gray-800">{title}</h3>
    </div>
  );
}
