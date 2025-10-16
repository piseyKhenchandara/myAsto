import React from 'react'

const OrdersTable = ({orders,page,handlePageChange,pagination,setOpen}) => {
  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Total Price</th>
              <th className="px-4 py-3 text-left">Phone Number</th>
              <th className="px-4 py-3 text-left">Order Number</th>
              <th className="px-4 py-3 text-left">User</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 bg-gray-50"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, i) => (
                <tr
                  key={order.id}
                  className={`${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-blue-50 transition cursor-pointer` }
                  onClick={() => setOpen(true)}
                >
                  <td className="border-t px-4 py-3 text-gray-700 font-medium">
                    {order.id}
                  </td>
                  <td className="border-t px-4 py-3 text-gray-700">
                    {order.amount}
                  </td>
                  <td className="border-t px-4 py-3 text-gray-700">
                    {order.phone_number}
                  </td>
                  <td className="border-t px-4 py-3 text-gray-700">
                    {order.order_number}
                  </td>
                  <td className="border-t px-4 py-3">
                    {order.User ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={order.User.profile_picture}
                          alt="Profile"
                          className="w-8 h-8 rounded-full border border-gray-300"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {order.User.name}
                          </p>
                          <p className="text-gray-600">{order.User.email}</p>
                          <p className="text-gray-500">{order.User.phone}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="italic text-gray-400">No user info</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="font-medium text-gray-700">
            Page {page} of {pagination.totalPages || 1}
          </span>
          <button
            disabled={page === pagination.totalPages}
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>

        <p className="text-gray-600">
          Total Orders:{' '}
          <span className="font-semibold">
            {pagination.totalItems || orders.length}
          </span>
        </p>
      </div>
    </div>
  )
}

export default OrdersTable
