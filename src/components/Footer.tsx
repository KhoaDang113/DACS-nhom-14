"use client";

import { useEffect } from "react";

interface FooterSection {
  title: string;
  items: string[];
}

const Footer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const footerSections: FooterSection[] = [
    {
      title: "Categories",
      items: [
        "Graphic & Design",
        "Digital Marketing",
        "Writing & Translation",
        "Video & Animation",
        "Music & Audio",
        "Programming & Tech",
        "Data",
        "Business",
        "Lifestyle",
        "Photography",
        "Sitemap",
      ],
    },
    {
      title: "About",
      items: [
        "Careers",
        "Press & News",
        "Partnership",
        "Privacy Policy",
        "Terms of Service",
        "Intellectual Property Claims",
        "Investor Relations",
      ],
    },
    {
      title: "Support",
      items: [
        "Help & Support",
        "Trust & Safety",
        "Selling on Fiverr",
        "Buying on Fiverr",
      ],
    },
    {
      title: "Community",
      items: [
        "Events",
        "Blog",
        "Forum",
        "Community Standards",
        "Podcast",
        "Affiliates",
        "Invite a Friend",
      ],
    },
    {
      title: "More From Fiverr",
      items: [
        "Fiverr Business",
        "Fiverr Pro",
        "Fiverr Studios",
        "Fiverr Logo Maker",
        "Fiverr Guild",
        "Get Inspired",
        "Fiverr Select",
        "Clear Voice",
        "Fiverr Workspace",
        "Learn",
        "Working Not Working",
      ],
    },
  ];

  const socialIcons = [
    "twitter.png",
    "facebook.png",
    "linkedin.png",
    "pinterest.png",
    "instagram.png",
  ];

  return (
    <footer className="w-full text-gray-500 my-12">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12">
          {footerSections.map((section, index) => (
            <div key={index} className="flex flex-col gap-5">
              <h1 className="text-lg text-gray-800 font-semibold">
                {section.title}
              </h1>
              <div className="flex flex-col gap-3">
                {section.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-gray-600 font-normal hover:text-gray-800 cursor-pointer transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <hr className="w-full border border-gray-300" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center py-5 gap-5">
          <div className="flex items-center gap-5">
            <h2 className="text-xl font-bold">fiverr</h2>
            <span className="text-sm">
              © Fiverr International Ltd. {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-5">
            <div className="flex items-center gap-3">
              {socialIcons.map((icon, index) => (
                <img
                  key={index}
                  src={`./media/${icon}`}
                  alt={`Social media icon ${index + 1}`}
                  className="w-6 h-6 hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <button className="flex items-center gap-2 hover:text-gray-800 transition-colors  bg-gray-600 text-white">
                <img
                  src="./media/language.png"
                  alt="Language selector"
                  className="w-5 h-5"
                />
                <span>English</span>
              </button>
              <button className="flex items-center gap-2 hover:text-gray-800 transition-colors  bg-gray-600 text-white">
                <img
                  src="./media/coin.png"
                  alt="Currency selector"
                  className="w-5 h-5"
                />
                <span>USD</span>
              </button>
              <button className="flex items-center gap-2 hover:text-gray-800 transition-colors  bg-gray-600 text-white">
                <img
                  src="./media/accessibility.png"
                  alt="Accessibility"
                  className="w-5 h-5"
                />
                <span>Accessibility</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
