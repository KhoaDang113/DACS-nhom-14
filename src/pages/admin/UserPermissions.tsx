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
import { Dropdown, DropdownItem } from "../../components/ui/admin/Dropdown";
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  UserCircle2,
  Shield,
  Key,
  Trash2,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  permissions: string[];
  lastUpdated: string;
}

const users: User[] = [
  {
    id: "U001",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "admin",
    permissions: [
      "manage_users",
      "approve_gigs",
      "edit_categories",
      "manage_tags",
      "view_reports",
      "handle_violations",
      "view_transactions",
      "manage_feedback",
    ],
    lastUpdated: "Apr 15, 2023",
  },
  {
    id: "U002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "moderator",
    permissions: [
      "approve_gigs",
      "view_reports",
      "handle_violations",
      "manage_feedback",
    ],
    lastUpdated: "Apr 18, 2023",
  },
  {
    id: "U003",
    name: "Michael Brown",
    email: "michael.b@example.com",
    role: "moderator",
    permissions: ["approve_gigs", "edit_categories", "manage_tags"],
    lastUpdated: "Apr 20, 2023",
  },
  {
    id: "U004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    role: "user",
    permissions: ["view_reports"],
    lastUpdated: "Apr 22, 2023",
  },
  {
    id: "U005",
    name: "David Wilson",
    email: "david.w@example.com",
    role: "admin",
    permissions: [
      "manage_users",
      "approve_gigs",
      "edit_categories",
      "manage_tags",
      "view_reports",
      "handle_violations",
      "view_transactions",
      "manage_feedback",
    ],
    lastUpdated: "Apr 25, 2023",
  },
];

const allPermissions = [
  "manage_users",
  "approve_gigs",
  "edit_categories",
  "manage_tags",
  "view_reports",
  "handle_violations",
  "view_transactions",
  "manage_feedback",
];

const UserPermissions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default";
      case "moderator":
        return "secondary";
      case "user":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            User Permissions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure and manage user roles and permissions.
          </p>
        </div>
        <Button size="sm">Add New User</Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Tìm kiếm người dùng..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Filter className="h-4 w-4" />}
          >
            Filter
          </Button>
          <Dropdown
            trigger={
              <Button
                variant="outline"
                size="sm"
                icon={<ArrowUpDown className="h-4 w-4" />}
              >
                Sort
              </Button>
            }
            align="right"
          >
            <DropdownItem>Tên (A-Z)</DropdownItem>
            <DropdownItem>Tên (Z-A)</DropdownItem>
            <DropdownItem>Vai trò</DropdownItem>
            <DropdownItem>Mới nhất</DropdownItem>
            <DropdownItem>Cũ nhất</DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Quyền hạn</TableHead>
              <TableHead>Cập nhật lần cuối</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                      <UserCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={getRoleBadgeVariant(user.role)}
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.slice(0, 2).map((permission) => (
                      <Badge
                        key={permission}
                        variant="secondary"
                        className="capitalize text-xs"
                      >
                        {permission.replace("_", " ")}
                      </Badge>
                    ))}
                    {user.permissions.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{user.permissions.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">
                  {user.lastUpdated}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditPermissions(user)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Permissions Modal */}
      {selectedUser && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          title="Edit User Permissions"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{selectedUser.name}</h3>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Role</label>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <select
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    defaultValue={selectedUser.role}
                  >
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Permissions</label>
                <div className="flex items-center gap-2 mt-1">
                  <Key className="h-4 w-4 text-gray-400" />
                  <div className="mt-2 space-y-2">
                    {allPermissions.map((permission) => (
                      <label
                        key={permission}
                        className="inline-flex items-center gap-2 mr-4"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          defaultChecked={selectedUser.permissions.includes(
                            permission
                          )}
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {permission.replace("_", " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserPermissions;
