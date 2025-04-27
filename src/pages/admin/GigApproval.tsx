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
import { Dropdown, DropdownItem } from "../../components/ui/admin/Dropdown";
import { Search, Filter, ArrowUpDown, Eye, Check, X } from "lucide-react";

interface PendingGig {
  id: string;
  title: string;
  seller: string;
  sellerAvatar: string;
  category: string;
  submitted: string;
}

const pendingGigs: PendingGig[] = [
  {
    id: "G001",
    title: "Professional Logo Design",
    seller: "John Smith",
    sellerAvatar: "https://via.placeholder.com/150",
    category: "Design",
    submitted: "2 hours ago",
  },
  {
    id: "G002",
    title: "Website Development with React",
    seller: "Sarah Johnson",
    sellerAvatar: "https://via.placeholder.com/150",
    category: "Development",
    submitted: "5 hours ago",
  },
  {
    id: "G003",
    title: "SEO Optimization Service",
    seller: "Michael Brown",
    sellerAvatar: "https://via.placeholder.com/150",
    category: "Marketing",
    submitted: "1 day ago",
  },
  {
    id: "G004",
    title: "Content Writing for Blogs",
    seller: "Emily Davis",
    sellerAvatar: "https://via.placeholder.com/150",
    category: "Writing",
    submitted: "1 day ago",
  },
  {
    id: "G005",
    title: "Social Media Management",
    seller: "David Wilson",
    sellerAvatar: "https://via.placeholder.com/150",
    category: "Marketing",
    submitted: "2 days ago",
  },
];

const GigApproval: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGigs = pendingGigs.filter(
    (gig) =>
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 overflow-visible w-full overflow-x-hidden overflow-y-auto">
      <div>
        <h1 className="text-2xl font-bold">Gig Approval</h1>
        <p className="text-gray-500 mt-1">
          Review and approve gigs submitted by sellers.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search gigs..."
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
            <DropdownItem>Newest</DropdownItem>
            <DropdownItem>Oldest</DropdownItem>
            <DropdownItem>Category</DropdownItem>
            <DropdownItem>Seller Name</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Gig Title</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGigs.map((gig) => (
              <TableRow key={gig.id}>
                <TableCell className="font-medium">{gig.id}</TableCell>
                <TableCell>{gig.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={gig.sellerAvatar}
                      alt={gig.seller}
                      size="sm"
                      fallback={gig.seller.substring(0, 2)}
                    />
                    <span>{gig.seller}</span>
                  </div>
                </TableCell>
                <TableCell>{gig.category}</TableCell>
                <TableCell>{gig.submitted}</TableCell>
                <TableCell>
                  <Badge
                    variant="warning"
                    className="bg-yellow-50 text-yellow-700"
                  >
                    Pending
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Eye className="h-4 w-4" />}
                    >
                      <span className="sr-only">View</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600"
                      icon={<Check className="h-4 w-4" />}
                    >
                      <span className="sr-only">Approve</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      icon={<X className="h-4 w-4" />}
                    >
                      <span className="sr-only">Reject</span>
                    </Button>
                  </div>
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

export default GigApproval;
