import React from 'react';
import { CompletedOrder, formatDate, formatPrice } from '../../lib/reviewData';

interface OrderSummaryProps {
  order: CompletedOrder;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-3 md:mb-0">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <img 
                src={order.sellerAvatar} 
                alt={order.sellerName}
                className="w-12 h-12 rounded-full object-cover" 
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800">{order.gigTitle}</h3>
              <p className="text-sm text-gray-600">Người bán: {order.sellerName}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-x-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-1">Hoàn thành:</span>
              <span className="text-sm font-medium">{formatDate(order.completedDate)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-1">Giá:</span>
              <span className="text-sm font-medium">{formatPrice(order.price)}</span>
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Đã hoàn thành
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;