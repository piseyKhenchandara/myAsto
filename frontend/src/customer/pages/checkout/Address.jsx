import React, { useState } from 'react'
import vet_logo from '../../../assets/logoes/vet_logo.png'
import jnt_logo from '../../../assets/logoes/jnt_logo.png'
import grab_logo from '../../../assets/logoes/grab_logo.png'
import CustomerInfo from '../../components/address/CustomerInfo'
import PhoneInput from '../../components/address/PhoneInput'
import LocationSelector from '../../components/address/LocationSelector'
import DeliveryCompanySelector from '../../components/address/DeliveryCompanySelector'

const Address = ({
  setPhoneNumber,
  setAddress,
  setSelectedLocation,
  whoami,
  phoneNumber,
  orderNotes,
  selectedLocation,
  setSelectedDeliveryCompany,
  selectedDeliveryCompany,
  setOrderNotes,
}) => {


  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value)
    setSelectedDeliveryCompany('') 
  }

  const handleDeliveryCompanySelect = (company) => {
    setSelectedDeliveryCompany(company)
  }

  const isPhnomPenh = selectedLocation === 'Phnom Penh'
  const isProvince = selectedLocation && selectedLocation !== 'Phnom Penh'

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">Delivery Address</h2>

      <div className="space-y-4">
        
        <CustomerInfo whoami = {whoami}/>

        <PhoneInput
          phoneNumber= {phoneNumber}
          setPhoneNumber = {setPhoneNumber}
        />

        {/* Delivery Location */}
        <LocationSelector selectedLocation={selectedLocation} handleLocationChange={handleLocationChange}/>

        {/* Delivery Company Selection */}
        <DeliveryCompanySelector
          isPhnomPenh={isPhnomPenh}
          isProvince={isProvince}
          handleDeliveryCompanySelect={handleDeliveryCompanySelect}
          selectedDeliveryCompany={selectedDeliveryCompany}
          vet_logo={vet_logo}
          jnt_logo={jnt_logo}
          grab_logo={grab_logo}
          orderNotes={orderNotes}
          setAddress={setAddress}
          setOrderNotes = {setOrderNotes}
        />
      </div>
    </div>
  )
}

export default Address