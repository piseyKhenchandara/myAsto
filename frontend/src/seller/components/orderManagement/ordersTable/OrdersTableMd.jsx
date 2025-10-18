import React from 'react'

const OrdersTableMd = ({ 
  orders, 
  setOpen, 
  fetchTheReceipt, 
  handleDeliveryToggle,
  isNewOrder,
  createdAt 
}) => {
  return (
    <div className="hidden lg:block bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gradient-to-r from-green-500 to-emerald-600 border-b border-green-600">
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Ordered At
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Order #
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Delivered
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-sm mt-1">Orders will appear here once placed</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order, i) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {createdAt(order.Payment.paid_at)}
                    </div>
                  </td>
                  <td 
                    className="px-6 py-4 whitespace-nowrap cursor-pointer group" 
                    onClick={() => {
                      setOpen(true)
                      fetchTheReceipt(order.user_id, order.order_number)
                    }}
                  >
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 group-hover:text-green-700 transition-colors">
                      #{order.order_number}
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ${order.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.User ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={order.User.profile_picture}
                          alt={order.User.name}
                          className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {order.User.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {order.User.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm italic text-gray-400">No user info</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={order.delivery_check === true || false}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleDeliveryToggle(order.id, e.target.checked)
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                      {isNewOrder(order.Payment.paid_at) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse">
                          NEW
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrdersTableMd