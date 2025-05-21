"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../components/ui/admin/Table";
import Button from "../../components/ui/admin/Button";
import Input from "../../components/ui/admin/Input";
import Modal from "../../components/ui/admin/Modal";
import { Dropdown, DropdownItem, DropdownDivider } from "../../components/ui/admin/Dropdown";
import { Search, Plus, Folder, Edit, Trash2, PlusCircle, Loader2, AlertCircle, MoreHorizontal } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description: string;
  slug: string;
  isDeleted: boolean;
  parentCategory: string | null;
  adminId: string;
  created_at?: string;
  updated_at?: string;
  children?: Category[];
}

const CategoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddSubcategoryModalOpen, setIsAddSubcategoryModalOpen] =
    useState(false);
  const [isSubcategoriesModalOpen, setIsSubcategoriesModalOpen] =
    useState(false);
  const [
    selectedCategoryForSubcategories,
    setSelectedCategoryForSubcategories,
  ] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [subcategoryError, setSubcategoryError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Trạng thái cho modal thêm/sửa danh mục
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [parentCategory, setParentCategory] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  // Phân trang (mỗi trang hiển thị 10 mục)
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/category/get",
        {
          withCredentials: true,
        }
      );
      if (response.data && !response.data.error) {
        setCategories(response.data.data || []);
        setTotalPages(
          Math.ceil((response.data.data?.length || 0) / itemsPerPage)
        );
      } else {
        setError(response.data.message || "Có lỗi khi tải danh mục");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
      setError("Đã xảy ra lỗi khi tải dữ liệu danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/category/create",
        {
          categoryName,
          description: categoryDescription,
          parentCategory: parentCategory || null,
        },
        {
          withCredentials: true,
        }
      );

      // Làm mới danh sách
      fetchCategories();

      // Đóng modal và reset form
      setIsModalOpen(false);
      setCategoryName("");
      setCategoryDescription("");
      setParentCategory("");
    } catch (err: unknown) {
      console.error("Lỗi khi tạo danh mục:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || "Không thể tạo danh mục");
      } else {
        setError("Không thể tạo danh mục");
      }
    }
  };

  const handleUpdateCategory = async () => {
    if (!currentCategory) return;

    try {
      await axios.put(
        `http://localhost:5000/api/admin/category/${currentCategory._id}/update`,
        {
          categoryName,
          description: categoryDescription,
          parentCategory: parentCategory || null,
        },
        {
          withCredentials: true,
        }
      );

      // Làm mới danh sách
      fetchCategories();

      // Đóng modal và reset form
      setIsEditModalOpen(false);
      setCategoryName("");
      setCategoryDescription("");
      setParentCategory("");
      setCurrentCategory(null);
    } catch (err: unknown) {
      console.error("Lỗi khi cập nhật danh mục:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || "Không thể cập nhật danh mục");
      } else {
        setError("Không thể cập nhật danh mục");
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/category/${categoryId}/delete`,
        {
          withCredentials: true,
        }
      );

      // Làm mới danh sách
      fetchCategories();
    } catch (err: unknown) {
      console.error("Lỗi khi xóa danh mục:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || "Không thể xóa danh mục");
      } else {
        setError("Không thể xóa danh mục");
      }
    }
  };

  const openEditModal = (category: Category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setParentCategory(category.parentCategory || "");
    setIsEditModalOpen(true);
  };

  const openAddSubcategoryModal = (parentId: string) => {
    setParentCategory(parentId);
    setCategoryName("");
    setCategoryDescription("");
    setIsAddSubcategoryModalOpen(true);
  };

  // Hàm lấy danh sách danh mục con của một danh mục
  const fetchSubcategories = async (categoryId: string) => {
    setLoadingSubcategories(true);
    setSubcategoryError(null);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/category/subcategories/${categoryId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data && !response.data.error) {
        return response.data.subcategories || [];
      } else {
        setSubcategoryError(
          response.data.message || "Có lỗi khi tải danh mục con"
        );
        return [];
      }
    } catch (err: unknown) {
      console.error("Lỗi khi tải danh mục con:", err);
      if (axios.isAxiosError(err) && err.response) {
        setSubcategoryError(
          err.response.data?.message || "Không thể tải danh mục con"
        );
      } else {
        setSubcategoryError("Không thể tải danh mục con");
      }
      return [];
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Mở modal hiển thị danh mục con
  const openSubcategoriesModal = async (category: Category) => {
    setSelectedCategoryForSubcategories(category);
    setIsSubcategoriesModalOpen(true);

    // Lấy danh sách danh mục con từ API
    const subCategories = await fetchSubcategories(category._id);
    setSubcategories(subCategories);
  };

  // Xử lý xóa danh mục con
  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục con này?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/category/${subcategoryId}/delete`,
        {
          withCredentials: true,
        }
      );

      // Cập nhật lại danh sách danh mục con
      if (selectedCategoryForSubcategories) {
        const updatedSubcategories = await fetchSubcategories(
          selectedCategoryForSubcategories._id
        );
        setSubcategories(updatedSubcategories);
      }

      // Cũng cần cập nhật danh sách danh mục chính
      fetchCategories();
    } catch (err: unknown) {
      console.error("Lỗi khi xóa danh mục con:", err);
      if (axios.isAxiosError(err) && err.response) {
        setSubcategoryError(
          err.response.data?.message || "Không thể xóa danh mục con"
        );
      } else {
        setSubcategoryError("Không thể xóa danh mục con");
      }
    }
  };

  // Lọc danh mục theo từ khóa tìm kiếm
  const filteredCategories = categories.filter(
    (category) =>
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Đếm số lượng danh mục con trong mỗi danh mục
  const getCategoryStats = (category: Category) => {
    const childCount = category.children?.length || 0;

    return { childCount };
  };

  return (
    <div className="space-y-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <p className="text-gray-500 mt-1">
          Quản lý các danh mục dịch vụ cho nền tảng của bạn.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="search"
            placeholder="Tìm kiếm danh mục..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Button
          onClick={() => {
            setCategoryName("");
            setCategoryDescription("");
            setParentCategory("");
            setIsModalOpen(true);
          }}
          icon={<Plus className="h-4 w-4" />}
        >
          Thêm danh mục
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Danh mục con</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {" "}
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map((category) => {
                    const { childCount } = getCategoryStats(category);
                    return (
                      <TableRow key={category._id}>
                        <TableCell className="font-medium max-w-[100px] truncate">
                          {category._id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Folder className="h-5 w-5 text-gray-400" />
                            <span>{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {category.description || "Không có mô tả"}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {category.slug}
                        </TableCell>
                        <TableCell>{childCount}</TableCell>
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
                            <DropdownItem
                              onClick={() => openEditModal(category)}
                            >
                              <div className="flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                openAddSubcategoryModal(category._id)
                              }
                            >
                              <div className="flex items-center">
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Thêm danh mục con
                              </div>
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => openSubcategoriesModal(category)}
                            >
                              <div className="flex items-center">
                                <Folder className="h-4 w-4 mr-2" />
                                Xem danh mục con
                              </div>
                            </DropdownItem>
                            <DropdownDivider />
                            <DropdownItem
                              className="text-red-600"
                              onClick={() => handleDeleteCategory(category._id)}
                            >
                              <div className="flex items-center">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                              </div>
                            </DropdownItem>
                          </Dropdown>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell>
                      <div className="text-center py-6">
                        {searchTerm ? (
                          <p>
                            Không tìm thấy danh mục phù hợp với từ khóa "
                            {searchTerm}"
                          </p>
                        ) : (
                          <p>Không có danh mục nào</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{""}</TableCell>
                    <TableCell>{""}</TableCell>
                    <TableCell>{""}</TableCell>
                    <TableCell>{""}</TableCell>
                    <TableCell>{""}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Phân trang */}
          {filteredCategories.length > itemsPerPage && (
            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Trước
              </Button>
              <span className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal thêm danh mục */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm danh mục mới"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên danh mục
            </label>
            <Input
              id="name"
              placeholder="VD: Phát triển web"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mô tả
            </label>
            <Input
              id="description"
              placeholder="Mô tả ngắn về danh mục"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="parent"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Danh mục cha (Tùy chọn)
            </label>
            <select
              id="parent"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
            >
              <option value="">Không có (Đây là danh mục gốc)</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateCategory}>Lưu danh mục</Button>
          </div>
        </div>
      </Modal>

      {/* Modal chỉnh sửa danh mục */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa danh mục"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="edit-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên danh mục
            </label>
            <Input
              id="edit-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mô tả
            </label>
            <Input
              id="edit-description"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="edit-parent"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Danh mục cha (Tùy chọn)
            </label>
            <select
              id="edit-parent"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
            >
              <option value="">Không có (Đây là danh mục gốc)</option>
              {categories
                .filter((cat) => cat._id !== currentCategory?._id)
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateCategory}>Cập nhật</Button>
          </div>
        </div>
      </Modal>

      {/* Modal thêm danh mục con */}
      <Modal
        isOpen={isAddSubcategoryModalOpen}
        onClose={() => setIsAddSubcategoryModalOpen(false)}
        title="Thêm danh mục con"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="sub-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên danh mục con
            </label>
            <Input
              id="sub-name"
              placeholder="VD: Frontend Development"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="sub-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mô tả
            </label>
            <Input
              id="sub-description"
              placeholder="Mô tả ngắn về danh mục con"
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <p className="text-sm text-gray-600">
              Danh mục này sẽ được thêm vào bên dưới danh mục cha đã chọn.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsAddSubcategoryModalOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleCreateCategory}>Thêm danh mục con</Button>
          </div>
        </div>
      </Modal>

      {/* Modal danh sách danh mục con */}
      <Modal
        isOpen={isSubcategoriesModalOpen}
        onClose={() => setIsSubcategoriesModalOpen(false)}
        title={`Danh mục con của: ${
          selectedCategoryForSubcategories?.name || ""
        }`}
      >
        <div className="space-y-4">
          {subcategoryError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-1.5" />
              <span>{subcategoryError}</span>
            </div>
          )}

          {loadingSubcategories ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">
                Đang tải danh mục con...
              </span>
            </div>
          ) : (
            <>
              {subcategories.length > 0 ? (
                <div className="overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tên
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Mô tả
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Slug
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subcategories.map((subcategory) => (
                        <tr key={subcategory._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <Folder className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {subcategory.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                            {subcategory.description || "Không có mô tả"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {subcategory.slug}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIsSubcategoriesModalOpen(false);
                                  openEditModal(subcategory);
                                }}
                                icon={<Edit className="h-3.5 w-3.5" />}
                              >
                                Sửa
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() =>
                                  handleDeleteSubcategory(subcategory._id)
                                }
                                icon={<Trash2 className="h-3.5 w-3.5" />}
                              >
                                Xóa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500">
                    Danh mục này chưa có danh mục con nào.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setIsSubcategoriesModalOpen(false);
                      openAddSubcategoryModal(
                        selectedCategoryForSubcategories?._id || ""
                      );
                    }}
                    icon={<PlusCircle className="h-4 w-4 mr-1" />}
                  >
                    Thêm danh mục con
                  </Button>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            {subcategories.length > 0 && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubcategoriesModalOpen(false);
                  openAddSubcategoryModal(
                    selectedCategoryForSubcategories?._id || ""
                  );
                }}
                icon={<PlusCircle className="h-4 w-4" />}
              >
                Thêm danh mục con
              </Button>
            )}
            <Button onClick={() => setIsSubcategoriesModalOpen(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
