import React from 'react'

const OrdersTable = ({ orders, page, handlePageChange, pagination, setOpen, fetchTheReceipt }) => {
  // Helper function to check if order is less than 1 day old
  const isNewOrder = (paidAt) => {
    const paidDate = new Date(paidAt)
    const now = new Date()
    const diffInMs = now - paidDate
    const diffInHours = diffInMs / (1000 * 60 * 60)
    return diffInHours < 24
  }

  const createdAt = (paid_at) => {
     return new Date(paid_at).toLocaleDateString('en-Us', {
                      year : 'numeric',
                      month : '2-digit',
                      day : '2-digit',
                      hour : '2-digit',
                      minute : '2-digit'
                    })
      

  }

  return (
    <div className="max-w-[1920px] px-2 sm:px-4  mx-auto">
      {/* Desktop & Tablet View */}
      <div className="hidden lg:block  shadow-lg rounded-lg border border-gray-200   p-2 w-full">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gradient-to-br from-green-300 via-green-100 to-green-300">
            <tr>
              <th className="px-4 py-3 text-left">Ordered At</th>
              <th className="px-4 py-3 text-left">Order #</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Delivery-Check</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 bg-gray-50">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, i) => (
                <tr
                  key={order.id}
                  className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition cursor-pointer `}
                  onClick={() => {
                    setOpen(true)
                    fetchTheReceipt(order.user_id, order.order_number)
                  }}
                >
                  <td className="border-t px-4 py-3 text-gray-700 truncate max-w-[120px]">
                    {createdAt(order.Payment.paid_at)};
                  </td>
                  <td className="border-t px-4 py-3 text-gray-700">{order.order_number}</td>
                  <td className="border-t px-4 py-3 text-green-600 font-medium">
                    {order.amount} $
                  </td>
                  <td className="border-t px-4 py-3 relative">
                    {order.User ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={order.User.profile_picture}
                          alt="Profile"
                          className="w-8 h-8 rounded-full border border-gray-300 object-cover"
                        />
                        <div className="truncate max-w-[180px]">
                          <p className="font-semibold text-gray-800">{order.User.name}</p>
                          <p className="text-gray-600 text-xs">{order.User.email}</p>
                        </div>
                        
                      </div>
                    ) : (
                      <span className="italic text-gray-400">No user info</span>
                    )}
                    
                  </td>
                  <td className="border-t px-4 py-3 text-gray-700 relative">
                    {order.phone_number}
                    {isNewOrder(order.Payment.paid_at) && (
                      <div className="absolute top-1 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                        NEW
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4 mt-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            No orders found.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-lg border border-gray-200 p-4 hover:shadow-xl transition cursor-pointer relative"
              onClick={() => {
                setOpen(true)
                fetchTheReceipt(order.user_id, order.order_number)
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className='relative'>
                  {isNewOrder(order.Payment.paid_at) && (
                    <div className="absolute -top-1 left-18 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      NEW
                    </div>
                  )}
                  <p className="text-xs text-gray-500 uppercase">Order #</p>
                  <p className="text-sm font-semibold text-gray-800">{order.order_number}</p>
                </div>
                <p className="text-base font-bold text-green-600">{order.amount} $</p>
              </div>

              <div className="text-sm text-gray-700 space-y-1 mb-2">
                <p><span className="text-gray-500">Ordered:</span> {createdAt(order.Payment.paid_at)}</p>
                <p><span className="text-gray-500">Phone:</span> {order.phone_number}</p>
              </div>

              {order.User && (
                <div className="pt-3 border-t border-gray-200 flex items-center gap-3">
                  <img
                    src={order.User.profile_picture}
                    alt="User"
                    className="w-10 h-10 rounded-full border object-cover"
                  />
                  <div>
                    <p className="font-medium">{order.User.name}</p>
                    <p className="text-gray-500 text-xs">{order.User.email}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700 text-sm">
            Page {page} of {pagination.totalPages || 1}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

        <p className="text-gray-600 text-sm">
          Total Orders:{' '}
          <span className="font-semibold">{pagination.totalItems || orders.length}</span>
        </p>
      </div>
    </div>
  )
}

export default OrdersTable