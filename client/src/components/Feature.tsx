import { ReactNode, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, Pause, Play } from "lucide-react";
interface FeatureProp {
  children?: ReactNode;
}
const FeaturePage: React.FC<FeatureProp> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current?.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  return (
    <div className="relative z-0 w-full h-[89%] object-cover overflow-hidden">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/test-video.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-y-2/3 z-10 text-start w-full"
        style={{ transform: "translate(-40%, -50%)" }}
      >
        <div className="max-w-3xl">
          <h1 className="text-7xl md:text-7xl font-normal text-white mb-10 leading-tight">
            Our freelancers
            <br />
            will take it from here
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Search for any service..."
              className="w-full py-4 px-4 pr-12 rounded-md text-gray-800 text-lg bg-white"
            />
            <button className="absolute right-0 top-0 bg-[#1dbf73] text-white p-4 rounded-r-md h-full">
              <Search size={24} />
            </button>
          </div>

          {/* Popular Categories */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="#"
              className="flex items-center gap-2 bg-gray-800 bg-opacity-60 text-white px-4 py-2 rounded-full border border-gray-600 hover:bg-opacity-80"
            >
              website development
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 bg-gray-800 bg-opacity-60 text-white px-4 py-2 rounded-full border border-gray-600 hover:bg-opacity-80"
            >
              logo design
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 bg-gray-800 bg-opacity-60 text-white px-4 py-2 rounded-full border border-gray-600 hover:bg-opacity-80"
            >
              video editing
            </Link>
            <Link
              to="#"
              className="flex items-center gap-2 bg-gray-800 bg-opacity-60 text-white px-4 py-2 rounded-full border border-gray-600 hover:bg-opacity-80"
            >
              architecture & interior design
            </Link>
          </div>
        </div>
        {/* Trusted By Section */}
        <div className="container flex flex-row items-center gap-8 w-screen pt-10">
          <span className="text-2xl">Trusted by:</span>
          <div className="flex w-[80vh] items-center gap-8">
            <img
              src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/meta.12b5e5c.png"
              alt=""
              className="w-14 h-14"
            />
            <img
              src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/google2x.4fa6c20.png"
              alt=""
              className="w-14 h-14"
            />
            <img
              src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/netflix2x.887e47e.png"
              alt=""
              className="w-14 h-14"
            />
            <img
              src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/pandg2x.6dc32e4.png"
              alt=""
              className="w-14 h-14"
            />
            <img
              src="https://fiverr-res.cloudinary.com/npm-assets/@fiverr/logged_out_homepage_perseus/apps/paypal2x.22728be.png"
              alt=""
              className="w-14 h-14"
            />
          </div>
        </div>
      </div>

      {/* Pause Button */}
      <button
        onClick={toggleVideo}
        className="absolute bottom-6 right-6 z-20 bg-gray-800 bg-opacity-70 text-white p-3 rounded-full"
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
    </div>
  );
};

export default FeaturePage;
