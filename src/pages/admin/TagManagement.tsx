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
import Modal from "../../components/ui/admin/Modal";
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "../../components/ui/admin/Dropdown";
import { Search, Plus, Tag, Edit, Trash2, MoreHorizontal } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  category: string;
  gigs: number;
  created: string;
}

const tags: Tag[] = [
  {
    id: "T001",
    name: "responsive",
    category: "Web Development",
    gigs: 120,
    created: "Jan 15, 2023",
  },
  {
    id: "T002",
    name: "minimalist",
    category: "Graphic Design",
    gigs: 85,
    created: "Feb 3, 2023",
  },
  {
    id: "T003",
    name: "seo-friendly",
    category: "Digital Marketing",
    gigs: 95,
    created: "Mar 20, 2023",
  },
  {
    id: "T004",
    name: "blog-writing",
    category: "Writing & Translation",
    gigs: 75,
    created: "Apr 12, 2023",
  },
  {
    id: "T005",
    name: "animation",
    category: "Video & Animation",
    gigs: 60,
    created: "May 5, 2023",
  },
  {
    id: "T006",
    name: "voice-over",
    category: "Music & Audio",
    gigs: 45,
    created: "Jun 18, 2023",
  },
  {
    id: "T007",
    name: "business-plan",
    category: "Business",
    gigs: 30,
    created: "Jul 22, 2023",
  },
];

const TagManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tag Management</h1>
        <p className="text-gray-500 mt-1">
          Manage tags for gigs on your platform.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search tags..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Tag
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Related Category</TableHead>
              <TableHead>Gigs</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.id}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1 font-normal">
                    <Tag className="h-3 w-3" />
                    {tag.name}
                  </Badge>
                </TableCell>
                <TableCell>{tag.category}</TableCell>
                <TableCell>{tag.gigs}</TableCell>
                <TableCell>{tag.created}</TableCell>
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
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </div>
                    </DropdownItem>
                    <DropdownItem>View gigs</DropdownItem>
                    <DropdownDivider />
                    <DropdownItem className="text-red-600">
                      <div className="flex items-center">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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

      {/* Add Tag Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Tag"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tag Name
            </label>
            <Input id="name" placeholder="e.g. responsive" />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Related Category
            </label>
            <Input id="category" placeholder="e.g. Web Development" />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description (Optional)
            </label>
            <Input
              id="description"
              placeholder="Brief description of the tag"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save Tag</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TagManagement;
