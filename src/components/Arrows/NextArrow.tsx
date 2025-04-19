import { GrFormNext } from "react-icons/gr";

interface NextArrowProps {
  onClick?: () => void;
}

const NextArrow: React.FC<NextArrowProps> = ({ onClick }) => {
  return (
    <GrFormNext
      className="bg-white border border-gray-300 h-10 w-10 rounded-full shadow-lg p-2 cursor-pointer absolute z-20 top-1/2 -translate-y-1/2 right-0"
      onClick={onClick}
    />
  );
};

export default NextArrow;
