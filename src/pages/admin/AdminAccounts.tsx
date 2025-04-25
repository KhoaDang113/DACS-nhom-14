"use client";

import type React from "react";
import { useState } from "react";
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
import Avatar from "../../components/ui/admin/Avatar";
import Modal from "../../components/ui/admin/Modal";
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "../../components/ui/admin/Dropdown";
import {
  Search,
  Plus,
  Shield,
  Mail,
  Key,
  Trash2,
  MoreHorizontal,
  User,
} from "lucide-react";

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
        <h1 className="text-2xl font-bold">Admin Accounts</h1>
        <p className="text-gray-500 mt-1">
          Manage administrator accounts for your platform.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search admins..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Admin
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                    {admin.status}
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
                        <span className="sr-only">Actions</span>
                      </Button>
                    }
                    align="right"
                  >
                    <DropdownItem>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Edit profile
                      </div>
                    </DropdownItem>
                    <DropdownItem>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        Send email
                      </div>
                    </DropdownItem>
                    <DropdownItem>
                      <div className="flex items-center">
                        <Key className="h-4 w-4 mr-2" />
                        Reset password
                      </div>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem className="text-red-600">
                      <div className="flex items-center">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete account
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
          Previous
        </Button>
        <Button variant="outline" size="sm">
          Next
        </Button>
      </div>

      {/* Add Admin Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Admin"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <Input id="name" placeholder="John Smith" />
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
              placeholder="john.smith@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <Input id="password" type="password" />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Admin Role
            </label>
            <Input id="role" placeholder="e.g. Content Moderator" />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button>Create Admin</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAccounts;
