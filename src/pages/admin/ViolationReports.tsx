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
import { Dropdown, DropdownItem } from "../../components/ui/admin/Dropdown";
import { Search, Filter, ArrowUpDown, Eye, Check, X } from "lucide-react";

interface Violation {
  id: string;
  gig: string;
  reportedBy: string;
  reason: string;
  date: string;
  status: "pending" | "resolved" | "dismissed";
}

const violations: Violation[] = [
  {
    id: "V001",
    gig: "Professional Logo Design",
    reportedBy: "John Smith",
    reason: "Copyright infringement - using stolen designs",
    date: "Apr 15, 2023",
    status: "pending",
  },
  {
    id: "V002",
    gig: "Website Development with React",
    reportedBy: "Sarah Johnson",
    reason: "Misleading description - service doesn't match what's advertised",
    date: "Apr 18, 2023",
    status: "pending",
  },
  {
    id: "V003",
    gig: "SEO Optimization Service",
    reportedBy: "Michael Brown",
    reason: "Fake reviews - seller is using fake accounts to boost ratings",
    date: "Apr 20, 2023",
    status: "resolved",
  },
  {
    id: "V004",
    gig: "Content Writing for Blogs",
    reportedBy: "Emily Davis",
    reason: "Plagiarism - content is copied from other sources",
    date: "Apr 22, 2023",
    status: "pending",
  },
  {
    id: "V005",
    gig: "Social Media Management",
    reportedBy: "David Wilson",
    reason: "Inappropriate content - contains offensive material",
    date: "Apr 25, 2023",
    status: "resolved",
  },
  {
    id: "V006",
    gig: "Mobile App UI Design",
    reportedBy: "Jessica Taylor",
    reason: "Scam - seller took payment but never delivered work",
    date: "Apr 28, 2023",
    status: "pending",
  },
  {
    id: "V007",
    gig: "Video Editing Service",
    reportedBy: "Robert Martinez",
    reason: "Poor quality - work is significantly below advertised quality",
    date: "Apr 30, 2023",
    status: "dismissed",
  },
];

const ViolationReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredViolations = violations.filter(
    (violation) =>
      violation.gig.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "resolved":
        return "success";
      case "dismissed":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Violation Reports</h1>
        <p className="text-gray-500 mt-1">
          Review and manage reported violations on your platform.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search reports..."
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
            <DropdownItem>Severity (High to Low)</DropdownItem>
            <DropdownItem>Severity (Low to High)</DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Reported Gig</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredViolations.map((violation) => (
              <TableRow key={violation.id}>
                <TableCell className="font-medium">{violation.id}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {violation.gig}
                </TableCell>
                <TableCell>{violation.reportedBy}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {violation.reason}
                </TableCell>
                <TableCell>{violation.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(violation.status)}
                    className="capitalize"
                  >
                    {violation.status}
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
                      <span className="sr-only">Dismiss</span>
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

export default ViolationReports;
