import { type ClassValue, clsx } from "clsx"; // cho sai cac prop nhu: chuỗi, mảng, đối tượng, điều kiện logic
import { twMerge } from "tailwind-merge"; // code toi uu hon (loai bo cac thang trung nhau trong tailwind)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
