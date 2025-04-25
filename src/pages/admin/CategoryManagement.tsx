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
import Modal from "../../components/ui/admin/Modal";
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "../../components/ui/admin/Dropdown";
import {
  Search,
  Plus,
  Folder,
  Edit,
  Trash2,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  gigs: number;
  subcategories: number;
}

const categories: Category[] = [
  {
    id: "C001",
    name: "Graphic Design",
    description:
      "Logo design, branding, illustrations, and other visual design services",
    gigs: 245,
    subcategories: 8,
  },
  {
    id: "C002",
    name: "Web Development",
    description:
      "Website creation, web applications, and frontend/backend development",
    gigs: 320,
    subcategories: 12,
  },
  {
    id: "C003",
    name: "Digital Marketing",
    description:
      "SEO, social media marketing, content marketing, and PPC advertising",
    gigs: 180,
    subcategories: 10,
  },
  {
    id: "C004",
    name: "Writing & Translation",
    description:
      "Content writing, copywriting, translation, and proofreading services",
    gigs: 210,
    subcategories: 6,
  },
  {
    id: "C005",
    name: "Video & Animation",
    description:
      "Video editing, animation, motion graphics, and visual effects",
    gigs: 150,
    subcategories: 7,
  },
  {
    id: "C006",
    name: "Music & Audio",
    description:
      "Music production, voice overs, sound effects, and audio editing",
    gigs: 120,
    subcategories: 5,
  },
  {
    id: "C007",
    name: "Business",
    description:
      "Business planning, financial consulting, legal services, and market research",
    gigs: 95,
    subcategories: 9,
  },
];

const CategoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold">Category Management</h1>
        <p className="text-gray-500 mt-1">
          Manage service categories for your platform.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Category
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Gigs</TableHead>
              <TableHead>Subcategories</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-gray-400" />
                    <span>{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {category.description}
                </TableCell>
                <TableCell>{category.gigs}</TableCell>
                <TableCell>{category.subcategories}</TableCell>
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
                    <DropdownItem>
                      <div className="flex items-center">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add subcategory
                      </div>
                    </DropdownItem>
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

      {/* Add Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Category"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category Name
            </label>
            <Input id="name" placeholder="e.g. Web Development" />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <Input
              id="description"
              placeholder="Brief description of the category"
            />
          </div>
          <div>
            <label
              htmlFor="parent"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Parent Category (Optional)
            </label>
            <Input
              id="parent"
              placeholder="Leave empty for top-level category"
            />
          </div>
          <div>
            <label
              htmlFor="icon"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Icon
            </label>
            <Input id="icon" placeholder="Icon name or URL" />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button>Save Category</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
