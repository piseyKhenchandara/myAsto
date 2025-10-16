import React from 'react';

const DisplayTheOrder = ({ orders, setOpen }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl w-[500px] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-xl font-bold text-white tracking-wide">Order Details</h3>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 border border-gray-100">
                {/* Customer Info */}
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <p className="text-base font-semibold text-gray-900 mb-1">{order.customer_name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {order.phone_number}
                    </span>
                  </div>
                </div>

                {/* Order Meta */}
                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div className="bg-blue-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-blue-600 font-medium mb-0.5">Order Number</p>
                    <p className="font-semibold text-gray-900">#{order.order_number}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-green-600 font-medium mb-0.5">Total Amount</p>
                    <p className="font-bold text-gray-900 text-lg">${order.amount}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  <span className="font-medium">Ordered:</span> {new Date(order.createdAt).toLocaleString()}
                </p>

                {/* Order Items */}
                {order.OrderItems && order.OrderItems.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Items Ordered
                    </p>
                    <div className="space-y-2">
                      {order.OrderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-white rounded-md px-3 py-2 shadow-sm">
                          <span className="text-gray-800 font-medium text-sm flex-1">{item.name}</span>
                          <span className="text-gray-600 text-sm font-semibold mx-3">×{item.quantity}</span>
                          <span className="text-blue-600 font-bold text-sm">${item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-400 font-medium">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <button
          onClick={() => setOpen(false)}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DisplayTheOrder;