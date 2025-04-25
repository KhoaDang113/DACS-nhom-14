import { type ClassValue, clsx } from "clsx"; // cho sai cac prop nhu: chuỗi, mảng, đối tượng, điều kiện logic
import { twMerge } from "tailwind-merge"; // code toi uu hon (loai bo cac thang trung nhau trong tailwind)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Chuyển đổi giá trị MongoDB Decimal128 thành số JavaScript
 * @param value Giá trị cần chuyển đổi
 * @returns Số JavaScript
 */
export const parseMongoDecimal = (value: any): number => {
  if (!value) return 0;

  // Xử lý đối tượng Decimal128 từ MongoDB
  if (typeof value === "object" && value.$numberDecimal) {
    return parseFloat(value.$numberDecimal);
  }

  // Xử lý trường hợp đã là số hoặc chuỗi số
  if (typeof value === "number") return value;
  if (typeof value === "string") return parseFloat(value) || 0;

  return 0;
};
