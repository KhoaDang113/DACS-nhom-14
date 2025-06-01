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
      title: "Danh mục",
      items: [
        "Đồ họa & Thiết kế",
        "Lâp trình & Công nghệ",
        "Tiếp thị số",
        "Video & Hoạt hình",
        "Viết lách & Dịch thuật",
        "Âm nhạc & Âm thanh",
        "Kinh doanh",
        "Tài chính",
        "Dịch vụ AI",
        "Kiến trúc & Xây dựng",
        "Tư vấn",
        "Dữ liệu",
        "Nhiếp ánh",
      ],
    },
    {
      title: "Về JopViet",
      items: [
        "Giới thiệu",
        "Cơ hội nghề nghiệp",
        "Tin tức & Báo chí",
        "Quan hệ đối tác",
        "Chính sách bảo mật",
        "Điều khoản sử dụng",
        "Quyền sở hữu trí tuệ",
        "Quan hệ nhà đầu tư",
        "Đội ngũ của chúng tôi",
        "Chính sách chống gian lận",
        "Chính sách bảo mật dữ liệu",
        "Chính sách cookie",
        "Chính sách bảo vệ người dùng",
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        "Trung tâm trợ giúp",
        "An toàn & Tin cậy",
        "Bán hàng trên JopViet",
        "Mua hàng trên JopViet",
        "Câu hỏi thường gặp",
        "Hỗ trợ khách hàng",
        "Vấn đề thanh toán",
        "Hỗ trợ tài khoản",
        "Hỗ trợ kỹ thuật",
        "Gửi phản hồi",
        "Hướng dẫn sử dụng",
        "Hướng dẫn bảo mật",
        "Hướng dẫn bảo vệ người dùng",
      ],
    },
    {
      title: "Cộng đồng",
      items: [
        "Sự kiện JopViet",
        "Blog JopViet",
        "Diễn đàn thảo luận",
        "Tiêu chuẩn cộng đồng",
        "Podcast JopViet",
        "Chương trình tiếp thị liên kết",
        "Mời bạn bè tham gia",
        "Câu chuyện thành công",
        "Hướng dẫn cộng đồng",
        "Tham gia cộng đồng",
        "Chia sẻ ý tưởng",
        "Cộng đồng nhà phát triển",
        "Cộng đồng người dùng",
      ],
    },
    {
      title: "Thêm từ JopViet",
      items: [
        "JopViet Business",
        "JopViet Pro",
        "JopViet Studios",
        "Công cụ tạo Logo",
        "JopViet Guild",
        "Tìm cảm hứng",
        "Chương trình JopViet Select",
        "JopViet Voice",
        "Không gian làm việc",
        "Học tập trên JopViet",
        "JopViet Academy",
        "JopViet Marketplace",
        "JopViet Events",
      ],
    },
  ];

  const socialLinks = [
    {
      icon: "facebook.png",
      url: "https://www.facebook.com",
    },
    {
      icon: "linkedin.png",
      url: "https://linkedin.com",
    },
    {
      icon: "pinterest.png",
      url: "https://pinterest.com",
    },
    {
      icon: "instagram.png",
      url: "https://instagram.com",
    },
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
            <h2 className="text-xl font-bold">JopViet</h2>
            <span className="text-sm">
              © Công ty TNHH 3 Anh Em {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-5">
            <div className="flex items-center gap-3">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`./media/${item.icon}`}
                    alt={`Social media icon ${index + 1}`}
                    className="w-6 h-6 hover:opacity-80 transition-opacity cursor-pointer"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
