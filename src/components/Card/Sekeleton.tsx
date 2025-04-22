// components/Skeleton.tsx

"use client";
import React from "react";

const Skeleton: React.FC = () => {
  return (
    <div>
      <div className="w-full rounded-lg overflow-hidden shadow-md bg-gray-50 transition-transform">
        <div className="relative aspect-[4/3] w-full group animate-pulse bg-gray-200"></div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
