"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/admin/Table";
import Button from "../../components/ui/admin/Button";
import Input from "../../components/ui/admin/Input";
import Badge from "../../components/ui/admin/Badge";
import Modal from "../../components/ui/admin/Modal";
import { 
  Search, 
  Plus, 
  Calendar, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal
} from "lucide-react";
import { 
  hotJobAds, 
  HotJobAd, 
  formatCurrency 
} from "../../lib/hotJobData";
import { Link } from "react-router-dom";
import { Dropdown, DropdownItem } from "../../components/ui/admin/Dropdown";

const HotJobAds: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Lọc các quảng cáo theo từ khóa tìm kiếm
  const filteredAds = hotJobAds.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lấy badge tương ứng với trạng thái quảng cáo
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Đang hoạt động</Badge>;
      case "pending":
        return <Badge variant="warning">Chờ duyệt</Badge>;
      case "expired":
        return <Badge variant="secondary">Hết hạn</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format ngày tháng
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="space-y-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold">Quảng Cáo Job Hot</h1>
        <p className="text-gray-500 mt-1">
          Quản lý các quảng cáo job nổi bật trên trang chủ và trang tìm kiếm
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Tìm kiếm quảng cáo..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link to="/admin/hot-job-ads/create">
          <Button
            icon={<Plus className="h-4 w-4" />}
          >
            Thêm Quảng Cáo
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề quảng cáo</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAds.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden">
                      <img
                        src={ad.bannerImage}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{ad.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {ad.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-900">{ad.job.title}</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(ad.job.price)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-1.5" />
                    <span className="text-sm">
                      {formatDate(ad.startDate)} - {formatDate(ad.endDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(ad.status)}</TableCell>
                <TableCell className="text-right">
                  <Dropdown
                    trigger={
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<MoreHorizontal className="h-4 w-4" />}
                      >
                        <span className="sr-only">Hành động</span>
                      </Button>
                    }
                    align="right"
                  >
                    <DropdownItem>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </div>
                    </DropdownItem>
                    <DropdownItem>
                      <div className="flex items-center">
                        <Edit className="h-4 w-4 mr-2" />
                        Chỉnh sửa
                      </div>
                    </DropdownItem>
                    <DropdownItem>
                      <div className="flex items-center text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </div>
                    </DropdownItem>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
            {filteredAds.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="text-gray-500">Không tìm thấy quảng cáo nào</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HotJobAds;