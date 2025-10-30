const EmptyCart = () => (
  <div className="text-center py-12 sm:py-16">
    <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 mx-auto max-w-md">
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Your cart is empty</h2>
      <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Add some products to your cart to get started</p>
      <button
        onClick={() => window.history.back()}
        className="bg-green-600 hover:bg-green-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors w-full sm:w-auto"
      >
        Continue Shopping
      </button>
    </div>
  </div>
);

export default EmptyCart;
