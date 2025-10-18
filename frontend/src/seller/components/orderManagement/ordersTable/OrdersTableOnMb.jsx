import React from 'react'

const OrdersTableOnMb = ({ 
  orders, 
  setOpen, 
  fetchTheReceipt, 
  handleDeliveryToggle,
  isNewOrder,
  createdAt 
}) => {
  return (
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
            
            {/* Mobile Delivery Checkbox */}
            <div className="pt-3 mt-3 border-t border-gray-200 flex items-center gap-2">
              <input 
                type="checkbox"
                checked={order.delivery_check === true || false}
                onChange={(e) => {
                  e.stopPropagation();
                  handleDeliveryToggle(order.id, e.target.checked);
                }}
              />
              <span className="text-sm text-gray-600">Mark as delivered</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default OrdersTableOnMb