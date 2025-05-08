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

  // Xử lý trường hợp đã là số
  if (typeof value === "number") return value;
  
  // Xử lý trường hợp là chuỗi số
  if (typeof value === "string") {
    const parsedValue = parseFloat(value);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }
  
  // Trả về 0 nếu không xử lý được
  return 0;
};
