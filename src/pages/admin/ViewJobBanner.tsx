"use client";

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import Button from "../../components/ui/admin/Button";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";

interface ApiResponse {
  status: string;
  message?: string;
  data: {
    _id: string;
    title: string;
    description: string;
    image: {
      type: string;
      url: string;
    };
    cta: string;
    ctaLink: string;
    createdAt: string;
    updatedAt: string;
  };
}

const ViewJobBanner: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<ApiResponse["data"] | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Lấy thông tin banner
  const fetchBannerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();

      if (!token) {
        throw new Error("Không thể lấy token xác thực");
      }

      const response = await axios.get<ApiResponse>(
        `http://localhost:5000/api/admin/job-banner/get/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setBanner(response.data.data);
      } else {
        throw new Error(
          response.data.message || "Không thể lấy thông tin banner"
        );
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin banner:", error);
      setError(
        error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải dữ liệu"
      );
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa banner
  const handleDeleteBanner = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa banner này không?")) {
      try {
        setIsDeleting(true);
        const token = await getToken();

        if (!token) {
          throw new Error("Không thể lấy token xác thực");
        }

        const response = await axios.delete(
          `http://localhost:5000/api/admin/job-banner/delete/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === "success") {
          alert("Xóa banner thành công");
          navigate("/admin/job-banners");
        } else {
          throw new Error(response.data.message || "Xóa banner thất bại");
        }
      } catch (error) {
        console.error("Lỗi khi xóa banner:", error);
        alert(
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi khi xóa banner"
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (err) {
      console.error("Lỗi khi định dạng ngày tháng:", err);
      return "Không xác định";
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    if (id) {
      fetchBannerDetails();
    }
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Chi tiết Job Banner</h1>
          <p className="text-gray-500 mt-1">
            Xem thông tin chi tiết của banner việc làm
          </p>
        </div>
        <Button
          variant="outline"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/admin/job-banners")}
        >
          Quay lại
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
        </div>
      ) : banner ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Banner Image */}
          <div className="relative w-full h-48 md:h-64 bg-gray-100">
            <img
              src={banner.image?.url || "/placeholder.svg"}
              alt={banner.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>

          {/* Banner Info */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">{banner.title}</h2>
            <p className="mt-2 text-gray-700">{banner.description}</p>

            <div className="mt-6 space-y-4">
              {/* CTA */}
              <div className="flex">
                <div className="w-1/3 text-sm font-medium text-gray-500">
                  CTA:
                </div>
                <div className="w-2/3">
                  <div className="flex items-center">
                    <span className="font-medium">{banner.cta}</span>
                    <LinkIcon className="h-4 w-4 text-gray-400 ml-2" />
                    <a
                      href={banner.ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline ml-2"
                    >
                      {banner.ctaLink}
                    </a>
                  </div>
                </div>
              </div>

              {/* Created At */}
              <div className="flex">
                <div className="w-1/3 text-sm font-medium text-gray-500">
                  Thời gian tạo:
                </div>
                <div className="w-2/3 flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                  <span>{formatDate(banner.createdAt)}</span>
                </div>
              </div>

              {/* Updated At */}
              <div className="flex">
                <div className="w-1/3 text-sm font-medium text-gray-500">
                  Cập nhật lần cuối:
                </div>
                <div className="w-2/3 flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                  <span>{formatDate(banner.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <Button
                variant="outline"
                icon={<Edit className="h-4 w-4" />}
                onClick={() => navigate(`/admin/job-banners/edit/${id}`)}
              >
                Chỉnh sửa
              </Button>
              <Button
                variant="danger"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={handleDeleteBanner}
                disabled={isDeleting}
              >
                {isDeleting ? "Đang xóa..." : "Xóa banner"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p>Không tìm thấy thông tin banner</p>
        </div>
      )}
    </div>
  );
};

export default ViewJobBanner;
