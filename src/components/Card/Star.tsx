import { Star } from "lucide-react";

// Component hiển thị đánh giá sao
export const StarRating: React.FC<{ rating: number; count: number }> = ({
  rating,
  count,
}) => {
  // Tạo mảng 5 sao
  const stars = Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1;
    const filled = rating >= starValue;
    const halfFilled = !filled && rating > i && rating < starValue;

    return (
      <span key={i} className="inline-block">
        {filled ? (
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ) : halfFilled ? (
          <span className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <Star
              className="absolute top-0 left-0 w-4 h-4 text-yellow-400 fill-yellow-400 overflow-hidden"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </span>
        ) : (
          <Star className="w-4 h-4 text-gray-300" />
        )}
      </span>
    );
  });

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      <span className="text-xs text-gray-500 ml-1">({count})</span>
    </div>
  );
};
