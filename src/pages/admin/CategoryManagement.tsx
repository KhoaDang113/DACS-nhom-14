"use client";

import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/ui/admin/Button";
import Input from "../../components/ui/admin/Input";
import Modal from "../../components/ui/admin/Modal";
import { Search, Plus, Folder, Edit, Trash2, PlusCircle, Loader2, AlertCircle, ChevronDown, ChevronRight } from "lucide-react";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Trạng thái cho modal thêm/sửa danh mục
  const [categoryName, setCategoryName] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const [parentCategory, setParentCategory] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState("");
  
  // Trạng thái cho hiển thị cây danh mục
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  // Tự động tạo slug từ tên danh mục
  useEffect(() => {
    if (autoGenerateSlug && categoryName) {
      const slug = categoryName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-");
      setCategorySlug(slug);
    }
  }, [categoryName, autoGenerateSlug]);

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
          description: "",
          slug: categorySlug,
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
      resetForm();
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
    
    // Kiểm tra nếu tên đã thay đổi nhưng slug chưa thay đổi
    if (originalName !== categoryName && currentCategory.slug === categorySlug) {
      setSlugError("Bạn đã đổi tên danh mục, vui lòng cập nhật slug mới");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/admin/category/${currentCategory._id}/update`,
        {
          categoryName,
          description: "",
          slug: categorySlug,
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
      resetForm();
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

  const resetForm = () => {
    setCategoryName("");
    setCategorySlug("");
    setParentCategory("");
    setAutoGenerateSlug(true);
    setCurrentCategory(null);
    setSlugError(null);
    setOriginalName("");
  };

  const openEditModal = (category: Category) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setOriginalName(category.name);
    setCategorySlug(category.slug || "");
    setParentCategory(category.parentCategory || "");
    setAutoGenerateSlug(false);
    setSlugError(null);
    setIsEditModalOpen(true);
  };

  const openAddSubcategoryModal = (parentId: string) => {
    resetForm();
    setParentCategory(parentId);
    setIsModalOpen(true);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Lọc danh mục theo từ khóa tìm kiếm
  const filterCategories = (categories: Category[]): Category[] => {
    if (!searchTerm) return categories;
    
    return categories.filter(category => {
      // Kiểm tra nếu category hiện tại khớp với từ khóa tìm kiếm
      const currentCategoryMatches = 
        category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Nếu category hiện tại khớp, trả về true
      if (currentCategoryMatches) return true;
      
      // Nếu category có children, kiểm tra đệ quy trong children
      if (category.children && category.children.length > 0) {
        const filteredChildren = filterCategories(category.children);
        // Nếu có bất kỳ children nào khớp, trả về true và thay thế children với kết quả đã lọc
        if (filteredChildren.length > 0) {
          category.children = filteredChildren;
          return true;
        }
      }
      
      return false;
    });
  };

  const filteredCategories = filterCategories([...categories]);

  // Hiển thị danh mục dạng cây
  const renderCategoryTree = (categories: Category[], level = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category._id}>
        <div 
          className={`
            flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 
            ${level === 0 ? 'font-medium' : ''}
            ${level === 1 ? 'pl-10 bg-gray-50' : ''}
            ${level === 2 ? 'pl-16 bg-gray-100' : ''}
          `}
        >
          <div className="flex-1 flex items-center overflow-hidden">
            <div style={{ width: `${level * 16}px` }}></div>
            {category.children && category.children.length > 0 ? (
              <button 
                className="p-1 mr-1 rounded-sm hover:bg-gray-200"
                onClick={() => toggleCategoryExpansion(category._id)}
              >
                {expandedCategories[category._id] ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="ml-5"></div>
            )}
            <Folder className="h-5 w-5 text-gray-400 mr-2" />
            <div className="truncate">
              <div className="font-medium">{category.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {level < 2 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openAddSubcategoryModal(category._id)}
                icon={<PlusCircle className="h-3.5 w-3.5" />}
              >
                Thêm
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditModal(category)}
              icon={<Edit className="h-3.5 w-3.5" />}
            >
              Sửa
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleDeleteCategory(category._id)}
              icon={<Trash2 className="h-3.5 w-3.5" />}
            >
              Xóa
            </Button>
          </div>
        </div>
        {category.children && 
         category.children.length > 0 && 
         expandedCategories[category._id] &&
         renderCategoryTree(category.children, level + 1)}
      </React.Fragment>
    ));
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
            resetForm();
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
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-100 p-3 flex items-center font-medium">
            <div className="flex-1">Danh mục</div>
            <div className="w-32 text-right">Hành động</div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredCategories.length > 0 ? (
              renderCategoryTree(filteredCategories)
            ) : (
              <div className="p-6 text-center">
                {searchTerm ? (
                  <p>
                    Không tìm thấy danh mục phù hợp với từ khóa "
                    {searchTerm}"
                  </p>
                ) : (
                  <p>Không có danh mục nào</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal thêm/sửa danh mục */}
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
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="slug"
                className="block text-sm font-medium text-gray-700"
              >
                Slug
              </label>
              <div className="flex items-center">
                <input
                  id="auto-generate"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={autoGenerateSlug}
                  onChange={(e) => setAutoGenerateSlug(e.target.checked)}
                />
                <label
                  htmlFor="auto-generate"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Tự động tạo
                </label>
              </div>
            </div>
            <Input
              id="slug"
              placeholder="vd: phat-trien-web"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              disabled={autoGenerateSlug}
            />
            <p className="text-xs text-gray-500 mt-1">
              Slug là phiên bản URL-friendly của tên danh mục, được sử dụng trong đường dẫn URL.
            </p>
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
                  {cat.name} (Cấp 1)
                </option>
              ))}
              {categories.flatMap(cat => 
                cat.children?.map(subcat => (
                  <option key={subcat._id} value={subcat._id}>
                    {cat.name} &gt; {subcat.name} (Cấp 2)
                  </option>
                )) || []
              )}
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
              onChange={(e) => {
                setCategoryName(e.target.value);
                // Nếu tên thay đổi và slug chưa được thay đổi, hiển thị thông báo
                if (e.target.value !== originalName && currentCategory && currentCategory.slug === categorySlug) {
                  setSlugError("Bạn đã đổi tên danh mục, vui lòng cập nhật slug mới");
                } else {
                  setSlugError(null);
                }
              }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="edit-slug"
                className="block text-sm font-medium text-gray-700"
              >
                Slug
              </label>
              <div className="flex items-center">
                <input
                  id="edit-auto-generate"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={autoGenerateSlug}
                  onChange={(e) => {
                    setAutoGenerateSlug(e.target.checked);
                    if (e.target.checked && categoryName !== originalName) {
                      // Tự động tạo slug mới dựa trên tên mới
                      const newSlug = categoryName
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9 ]/g, "")
                        .replace(/\s+/g, "-");
                      setCategorySlug(newSlug);
                      setSlugError(null);
                    }
                  }}
                />
                <label
                  htmlFor="edit-auto-generate"
                  className="ml-2 block text-sm text-gray-600"
                >
                  Tự động tạo
                </label>
              </div>
            </div>
            <Input
              id="edit-slug"
              value={categorySlug}
              onChange={(e) => {
                setCategorySlug(e.target.value);
                // Nếu slug đã được thay đổi, xóa thông báo lỗi
                if (currentCategory && e.target.value !== currentCategory.slug) {
                  setSlugError(null);
                }
              }}
              disabled={autoGenerateSlug}
              className={slugError ? "border-red-500" : ""}
            />
            {slugError && (
              <p className="text-xs text-red-500 mt-1">{slugError}</p>
            )}
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
                    {cat.name} (Cấp 1)
                  </option>
                ))}
              {categories.flatMap(cat => 
                cat.children?.filter(subcat => subcat._id !== currentCategory?._id)
                  .map(subcat => (
                    <option key={subcat._id} value={subcat._id}>
                      {cat.name} &gt; {subcat.name} (Cấp 2)
                    </option>
                  )) || []
              )}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleUpdateCategory}
              disabled={!!slugError}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
