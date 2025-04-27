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
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "../../components/ui/admin/Dropdown";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  User,
  Mail,
  Key,
  Trash2,
} from "lucide-react";

interface Seller {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gigs: number;
  joined: string;
  status: "Active" | "Blocked";
}

const sellers: Seller[] = [
  {
    id: "S001",
    name: "John Smith",
    email: "john.smith@example.com",
    avatar: "https://via.placeholder.com/150",
    gigs: 12,
    joined: "Jan 15, 2023",
    status: "Active",
  },
  {
    id: "S002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    avatar: "https://via.placeholder.com/150",
    gigs: 8,
    joined: "Feb 3, 2023",
    status: "Active",
  },
  {
    id: "S003",
    name: "Michael Brown",
    email: "michael.b@example.com",
    avatar: "https://via.placeholder.com/150",
    gigs: 5,
    joined: "Mar 20, 2023",
    status: "Blocked",
  },
  {
    id: "S004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    avatar: "https://via.placeholder.com/150",
    gigs: 15,
    joined: "Dec 10, 2022",
    status: "Active",
  },
  {
    id: "S005",
    name: "David Wilson",
    email: "david.w@example.com",
    avatar: "https://via.placeholder.com/150",
    gigs: 7,
    joined: "Apr 5, 2023",
    status: "Active",
  },
];

const SellerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 overflow-visible w-full">
      <div>
        <h1 className="text-2xl font-bold">Seller Management</h1>
        <p className="text-gray-500 mt-1">
          Manage and moderate sellers on your platform.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search sellers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
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
            <DropdownItem>Name (A-Z)</DropdownItem>
            <DropdownItem>Name (Z-A)</DropdownItem>
            <DropdownItem>Status</DropdownItem>
            <DropdownItem>Newest</DropdownItem>
            <DropdownItem>Oldest</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Gigs</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell className="font-medium">{seller.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={seller.avatar}
                      alt={seller.name}
                      size="sm"
                      fallback={seller.name.substring(0, 2)}
                    />
                    <span>{seller.name}</span>
                  </div>
                </TableCell>
                <TableCell>{seller.email}</TableCell>
                <TableCell>{seller.gigs}</TableCell>
                <TableCell>{seller.joined}</TableCell>
                <TableCell>
                  <Badge
                    variant={seller.status === "Active" ? "success" : "danger"}
                    className="capitalize"
                  >
                    {seller.status}
                  </Badge>
                </TableCell>
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
                        View profile
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
    </div>
  );
};

export default SellerManagement;
