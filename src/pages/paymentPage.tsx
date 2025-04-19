"use client";

import { useState } from "react";
import { CreditCard, Wallet, DollarSign } from "lucide-react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Thanh toán</h2>
              <p className="text-gray-500 mt-1">
                Nhập thông tin thanh toán của bạn để hoàn tất đơn hàng
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Phương thức thanh toán
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <label
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-gray-50 
                  ${
                    paymentMethod === "card"
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="sr-only"
                    />
                    <CreditCard className="mb-3 h-6 w-6 text-gray-600" />
                    <span className="text-sm">Thẻ</span>
                  </label>

                  <label
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-gray-50 
                  ${
                    paymentMethod === "wallet"
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === "wallet"}
                      onChange={() => setPaymentMethod("wallet")}
                      className="sr-only"
                    />
                    <Wallet className="mb-3 h-6 w-6 text-gray-600" />
                    <span className="text-sm">Ví điện tử</span>
                  </label>

                  <label
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-gray-50 
                  ${
                    paymentMethod === "cash"
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="sr-only"
                    />
                    <DollarSign className="mb-3 h-6 w-6 text-gray-600" />
                    <span className="text-sm">Tiền mặt</span>
                  </label>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tên chủ thẻ
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Số thẻ
                    </label>
                    <input
                      id="number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label
                        htmlFor="month"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tháng
                      </label>
                      <select
                        id="month"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Tháng</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="year"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Năm
                      </label>
                      <select
                        id="year"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Năm</option>
                        {Array.from(
                          { length: 10 },
                          (_, i) => new Date().getFullYear() + i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="cvc"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CVC
                      </label>
                      <input
                        id="cvc"
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="example@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Tóm tắt đơn hàng
                </h3>
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng tiền sản phẩm</span>
                    <span className="font-medium">1,200,000₫</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">30,000₫</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-medium">
                    <span>Tổng thanh toán</span>
                    <span className="text-blue-600">1,230,000₫</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center">
                <div className="mr-2 h-4 w-4" /> Hoàn tất thanh toán
              </button>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
