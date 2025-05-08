import React, { useState, useRef, useEffect, ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  width?: string;
  className?: string;
  sideOffset?: number;
  side?: "top" | "bottom";
  avoidCollisions?: boolean;
  alignOffset?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = "left",
  width = "w-48",
  className = "",
  sideOffset = 2,
  side = "bottom",
  avoidCollisions = true, // Mặc định là true để luôn tránh va chạm
  alignOffset = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">(side);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Điều chỉnh vị trí hiển thị của dropdown khi mở
  useEffect(() => {
    if (isOpen && dropdownRef.current && triggerRef.current && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Kiểm tra không gian phía trên và phía dưới
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      
      // Thêm khoảng cách đệm để tránh bị sát cạnh màn hình
      const padding = 20;

      // Cải thiện kiểm tra: Ưu tiên hiển thị ở trên nếu không gian phía dưới không đủ
      const shouldShowOnTop = spaceBelow < (menuRect.height + padding);
      
      // Nếu không đủ không gian phía dưới HOẶC không gian phía trên đủ để hiển thị và được yêu cầu hiển thị ở trên
      if (shouldShowOnTop) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    } else {
      setPosition(side);
    }
  }, [isOpen, side, avoidCollisions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Xử lý khi nhấn Escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  // Xử lý việc đóng dropdown khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`
            absolute z-[9999] ${width} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden
            ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"}
            ${align === "right" ? "right-0" : "left-0"}
            ${className}
          `}
          style={{
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto"
          }}
        >
          <div className="py-1">{children}</div>
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${className}`}
      onClick={(e) => {
        if (onClick) {
          onClick();
          // Ngăn sự kiện click lan đến phần tử cha
          e.stopPropagation();
        }
      }}
    >
      {children}
    </button>
  );
};

export const DropdownDivider: React.FC = () => {
  return <div className="border-t border-gray-100 my-1"></div>;
};
