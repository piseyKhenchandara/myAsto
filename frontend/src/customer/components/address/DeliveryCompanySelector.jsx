import React from 'react'

const DeliveryCompanySelector = ({isPhnomPenh, isProvince,handleDeliveryCompanySelect,selectedDeliveryCompany,vet_logo,jnt_logo,grab_logo, orderNotes,  setOrderNotes}) => {
  return (
    <section>
      {(isPhnomPenh || isProvince) && (
        <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Choose Delivery Company</h4>
            
            {/* Province Delivery Options */}
            {isProvince && (
            <section className="space-y-4">
                <p className="text-sm text-gray-600 mb-3">Available for province delivery:</p>
                <div className="grid grid-cols-2 gap-4">
                <label 
                    onClick={() => handleDeliveryCompanySelect('Vireak Buntham')}
                    required
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedDeliveryCompany === 'Vireak Buntham'
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <span className="flex flex-col items-center text-center">
                    <img src={vet_logo} alt="VET Express" className="h-12 w-auto mb-2" />
                    <span className="text-sm font-medium text-gray-700">VET Express</span>
                    <span className="text-xs text-gray-500 mt-1">2-3 days delivery</span>
                    </span>
                </label>

                {/* J&T Option */}
                <label 
                    onClick={() => handleDeliveryCompanySelect('J&T')}
                    required
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedDeliveryCompany === 'J&T'
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <span className="flex flex-col items-center text-center">
                    <img src={jnt_logo} alt="J&T Express" className="h-12 w-auto mb-2" />
                    <span className="text-sm font-medium text-gray-700">J&T Express</span>
                    <span className="text-xs text-gray-500 mt-1">2-3 days delivery</span>
                    </span>
                </label>
                </div>
            </section>
            )}

            {/* Phnom Penh Delivery Option */}
            {isPhnomPenh && (
            <section className="space-y-4">
                <p className="text-sm text-gray-600 mb-3">Available for Phnom Penh delivery:</p>
                <label 
                onClick={() => handleDeliveryCompanySelect('Phnom Penh delivery')}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md max-w-xs ${
                    selectedDeliveryCompany === 'Phnom Penh delivery'
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                >
                <span className="flex flex-col items-center text-center">
                    <img src={grab_logo} alt="Grab Express" className="h-12 w-auto mb-2" />
                    <span className="text-sm font-medium text-gray-700">Grab Express</span>
                    <span className="text-xs text-gray-500 mt-1">Same day delivery</span>
                </span>
                </label>
            </section>
            )}

            {/* Selected Company Confirmation */}
            {selectedDeliveryCompany && (
            <aside className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md">
                <p className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 font-medium">
                    {selectedDeliveryCompany === 'Vireak Buntham' && 'VET Express selected'}
                    {selectedDeliveryCompany === 'J&T' && 'J&T Express selected'}
                    {selectedDeliveryCompany === 'Phnom Penh delivery' && 'Grab Express selected'}
                </span>
                </p>
            </aside>
            )}

            <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes <span className='text-gray-500'>-(optional)</span></label>
            <textarea 
                placeholder="Enter your full address (street, building, etc.)"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                
            />
            </div>
        </div>
        )}
    </section>
  )
}

export default DeliveryCompanySelector