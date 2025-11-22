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
    <section className="lg:hidden space-y-4 mt-4">
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          No orders found.
        </div>
      ) : (
        orders.map((order) => (
          <article
            key={order.id}
            className="bg-white shadow-md rounded-lg border border-gray-200 p-4 hover:shadow-xl transition relative"
          >
            <button 
              onClick={() => {s
                setOpen(true)
                fetchTheReceipt(order.user_id, order.order_number)
              }}
              className="w-full text-left"
            >
              <div className="flex justify-between items-start mb-3">
                <div className='relative'>
                  {isNewOrder(order.Payment.paid_at) && (
                    <span className="absolute -top-1 left-18 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      NEW
                    </span>
                  )}
                  <p className="text-xs text-gray-500 uppercase">Order #</p>
                  <p className="text-sm font-semibold text-gray-800">{order.order_number}</p>
                </div>
                <p className="text-base font-bold text-green-600">{order.amount} $</p>
              </div>

              <div className="text-sm text-gray-700 space-y-1 mb-2">
                <p><span className="text-gray-500">Ordered:</span> <time>{createdAt(order.Payment.paid_at)}</time></p>
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
            </button>
            
            {/* Enhanced Mobile Delivery Checkbox */}
            <footer 
              className="pt-3 mt-3 border-t border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox"
                    checked={order.delivery_check === true || false}
                    onChange={(e) => {
                      handleDeliveryToggle(order.id, e.target.checked);
                    }}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded transition-all peer-checked:bg-green-500 peer-checked:border-green-500 flex items-center justify-center group-hover:border-green-400">
                    <svg 
                      className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className={`text-sm transition-colors ${
                  order.delivery_check 
                    ? 'text-green-600 font-medium' 
                    : 'text-gray-600 group-hover:text-gray-800'
                }`}>
                  {order.delivery_check ? 'Delivered ✓' : 'Mark as delivered'}
                </span>
              </label>
            </footer>
          </article>
        ))
      )}
    </section>
  )
}

export default OrdersTableOnMb