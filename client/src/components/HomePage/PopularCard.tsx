import { Link } from "react-router-dom";
interface PopularCardProps {
  title: string;
  image: string;
  bgColor: string;
}

export default function PopularCard({
  title,
  image,
  bgColor,
}: PopularCardProps) {
  return (
    <Link to="#">
      <div
        className={
          "rounded-lg overflow-hidden min-w-[200px]  min-h-[266px] flex flex-col"
        }
        style={{ backgroundColor: `${bgColor}` }}
      >
        <div className="p-4 text-white">
          <h3 className="text-xl font-medium">{title}</h3>
        </div>
        <div className="mt-auto bg-opacity-20 bg-white rounded-lg m-2">
          <div className="relative h-full w-full">
            <img src={image} alt="" className="rounded-lg" />
          </div>
        </div>
      </div>
    </Link>
  );
}
