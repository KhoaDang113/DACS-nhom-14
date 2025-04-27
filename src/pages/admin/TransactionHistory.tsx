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
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "../../components/ui/admin/Dropdown";
import {
  Search,
  Filter,
  Calendar,
  Download,
  MoreHorizontal,
  Eye,
  DollarSign,
} from "lucide-react";

interface Transaction {
  id: string;
  user: string;
  gig: string;
  date: string;
  amount: string;
  status: "Completed" | "Pending" | "Refunded" | "Failed";
}

const transactions: Transaction[] = [
  {
    id: "TRX001",
    user: "John Smith",
    gig: "Professional Logo Design",
    date: "Apr 15, 2023",
    amount: "120.00",
    status: "Completed",
  },
  {
    id: "TRX002",
    user: "Sarah Johnson",
    gig: "Website Development with React",
    date: "Apr 18, 2023",
    amount: "450.00",
    status: "Completed",
  },
  {
    id: "TRX003",
    user: "Michael Brown",
    gig: "SEO Optimization Service",
    date: "Apr 20, 2023",
    amount: "200.00",
    status: "Pending",
  },
  {
    id: "TRX004",
    user: "Emily Davis",
    gig: "Content Writing for Blogs",
    date: "Apr 22, 2023",
    amount: "85.00",
    status: "Completed",
  },
  {
    id: "TRX005",
    user: "David Wilson",
    gig: "Social Media Management",
    date: "Apr 25, 2023",
    amount: "150.00",
    status: "Failed",
  },
  {
    id: "TRX006",
    user: "Jessica Taylor",
    gig: "Mobile App UI Design",
    date: "Apr 28, 2023",
    amount: "300.00",
    status: "Refunded",
  },
  {
    id: "TRX007",
    user: "Robert Martinez",
    gig: "Video Editing Service",
    date: "Apr 30, 2023",
    amount: "180.00",
    status: "Completed",
  },
];

const TransactionHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.gig.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Refunded":
        return "secondary";
      case "Failed":
        return "danger";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-gray-500 mt-1">
          View and manage all user transactions on your platform.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Calendar className="h-4 w-4" />}
          >
            Date Range
          </Button>
          <Dropdown
            trigger={
              <Button
                variant="outline"
                size="sm"
                icon={<Filter className="h-4 w-4" />}
              >
                Status
              </Button>
            }
            align="right"
          >
            <DropdownItem>All Statuses</DropdownItem>
            <DropdownItem>Completed</DropdownItem>
            <DropdownItem>Pending</DropdownItem>
            <DropdownItem>Refunded</DropdownItem>
            <DropdownItem>Failed</DropdownItem>
          </Dropdown>
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="h-4 w-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Gig</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.user}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {transaction.gig}
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                    {transaction.amount}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(transaction.status)}>
                    {transaction.status}
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
                        <Eye className="h-4 w-4 mr-2" />
                        View details
                      </div>
                    </DropdownItem>
                    <DropdownItem>View user</DropdownItem>
                    <DropdownItem>View gig</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem>Download receipt</DropdownItem>
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

export default TransactionHistory;
