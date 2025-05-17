import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, XCircle, X } from "lucide-react";

type NotificationType = "success" | "error" | "warning";

interface NotificationProps {
  message: string;
  type: NotificationType;
  duration?: number;
  onClose?: () => void;
}

const Notification = ({
  message,
  type,
  duration = 3000,
  onClose,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border border-green-200";
      case "error":
        return "bg-red-100 border border-red-200";
      case "warning":
        return "bg-yellow-100 border border-yellow-200";
      default:
        return "bg-gray-100 border border-gray-200";
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 flex items-center gap-2 rounded-lg p-4 shadow-lg ${getBgColor()} ${getTextColor()} animate-fade-in backdrop-blur-sm`}
    >
      {getIcon()}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Notification;
