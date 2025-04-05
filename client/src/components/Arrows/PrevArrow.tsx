import { GrFormPrevious } from 'react-icons/gr';

interface PrevArrowProps {
  onClick?: () => void;
}

const PrevArrow: React.FC<PrevArrowProps> = ({ onClick }) => {
  return (
    <GrFormPrevious
      className="bg-white border border-gray-300 h-10 w-10 rounded-full shadow-lg p-2 cursor-pointer absolute z-20 top-1/2 -translate-y-1/2 left"
      onClick={onClick}
    />
  );
};

export default PrevArrow;
