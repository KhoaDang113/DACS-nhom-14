const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // null nghĩa là danh mục gốc (top-level category)
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
categorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD") // Chuẩn hóa ký tự có dấu
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/[^a-z0-9 ]/g, "") // Xóa ký tự đặc biệt
      .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu '-'
  }
  next();
});
module.exports = mongoose.model("Category", categorySchema);
