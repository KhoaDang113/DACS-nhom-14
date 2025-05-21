// components/Skeleton.tsx

"use client";
import React from "react";

const Skeleton: React.FC = () => {
  return (
    <div className="h-full">
      <div className="w-full h-full rounded-lg overflow-hidden shadow-md bg-gray-50 transition-transform flex flex-col">
        <div className="relative aspect-[4/3] w-full group animate-pulse bg-gray-200"></div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-[48px] bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
