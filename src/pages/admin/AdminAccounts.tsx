"use client";

import type React from "react";
import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/admin/Table";
import Button from "../../components/ui/admin/Button";
import Input from "../../components/ui/admin/Input";
import Badge from "../../components/ui/admin/Badge";
import Avatar from "../../components/ui/admin/Avatar";
import Modal from "../../components/ui/admin/Modal";
import { Dropdown, DropdownItem, DropdownDivider } from "../../components/ui/admin/Dropdown";
import { Search, Plus, Shield, Mail, Key, Trash2, MoreHorizontal, User } from "lucide-react";

interface Admin {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: "Active" | "Inactive";
  lastLogin: string;
}

const admins: Admin[] = [
  {
    id: "A001",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://via.placeholder.com/150",
    role: "Super Admin",
    status: "Active",
    lastLogin: "Today, 10:30 AM",
  },
  {
    id: "A002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "https://via.placeholder.com/150",
    role: "Content Moderator",
    status: "Active",
    lastLogin: "Yesterday, 3:45 PM",
  },
  {
    id: "A003",
    name: "Michael Brown",
    email: "michael.b@example.com",
    avatar: "https://via.placeholder.com/150",
    role: "User Manager",
    status: "Inactive",
    lastLogin: "Apr 20, 2023, 9:15 AM",
  },
  {
    id: "A004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    avatar: "https://via.placeholder.com/150",
    role: "Finance Admin",
    status: "Active",
    lastLogin: "Today, 8:20 AM",
  },
  {
    id: "A005",
    name: "David Wilson",
    email: "david.w@example.com",
    avatar: "https://via.placeholder.com/150",
    role: "Super Admin",
    status: "Active",
    lastLogin: "Yesterday, 11:30 AM",
  },
];

const AdminAccounts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold">Tài khoản quản trị</h1>
        <p className="text-gray-500 mt-1">
          Quản lý tài khoản quản trị viên cho nền tảng của bạn.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Tìm kiếm quản trị viên..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Thêm quản trị viên
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Quản trị viên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Đăng nhập gần đây</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={admin.avatar}
                      alt={admin.name}
                      size="sm"
                      fallback={admin.name.substring(0, 2)}
                    />
                    <span>{admin.name}</span>
                  </div>
                </TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <span>{admin.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      admin.status === "Active" ? "success" : "secondary"
                    }
                    className="capitalize"
                  >
                    {admin.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </TableCell>
                <TableCell>{admin.lastLogin}</TableCell>
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
                        <User className="h-4 w-4 mr-2" />
                        Sửa hồ sơ
                      </div>
                    </DropdownItem>
                    <DropdownItem>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Gửi email
                      </div>
                    </DropdownItem>
                    <DropdownItem>
                      <div className="flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        Đặt lại mật khẩu
                      </div>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem className="text-red-600">
                      <div className="flex items-center">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa tài khoản
                      </div>
                    </DropdownItem>
                  </Dropdown>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm">
          Trước
        </Button>
        <Button variant="outline" size="sm">
          Sau
        </Button>
      </div>

      {/* Add Admin Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm quản trị viên mới"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Họ và tên
            </label>
            <Input id="name" placeholder="Nguyễn Văn A" />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="nguyenvana@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mật khẩu
            </label>
            <Input id="password" type="password" />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Vai trò
            </label>
            <Input id="role" placeholder="VD: Quản lý nội dung" />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button>Tạo quản trị viên</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAccounts;
