import React, { useState } from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fallback?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  className = "",
  fallback,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const [imgError, setImgError] = useState(!src);

  const handleError = () => {
    setImgError(true);
  };

  return (
    <div
      className={`relative inline-block rounded-full overflow-hidden bg-gray-100 ${sizeClasses[size]} ${className}`}
    >
      {!imgError && src ? (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className="h-full w-full object-cover"
          onError={handleError}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium">
          {fallback || alt.substring(0, 2)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
