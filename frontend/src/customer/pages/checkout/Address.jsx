import React, { useState, useEffect } from 'react'
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
  setSelectedLocation: setParentSelectedLocation,
  whoami,
  orderNotes,
  selectedDeliveryCompany,
  setSelectedDeliveryCompany,
  setOrderNotes,
}) => {

  // ===== Phone number persistence =====
  const [localPhone, setLocalPhone] = useState(() => {
    return localStorage.getItem('phoneNumber') || whoami?.phone || ''
  })
  useEffect(() => {
    localStorage.setItem('phoneNumber', localPhone)
    setPhoneNumber(localPhone)
  }, [localPhone, setPhoneNumber])

  // ===== Location persistence =====
  const [localLocation, setLocalLocation] = useState(() => {
    return localStorage.getItem('selectedLocation') || ''
  })
  useEffect(() => {
    localStorage.setItem('selectedLocation', localLocation)
    setParentSelectedLocation(localLocation)
  }, [localLocation, setParentSelectedLocation])

  // ===== Delivery company persistence =====
  const [localSelectDelivery, setLocalSelectDelivery] = useState(() => {
    return localStorage.getItem('selectDeliveryCompany') || ''
  })
  useEffect(() => {
    localStorage.setItem('selectDeliveryCompany', localSelectDelivery)
    setSelectedDeliveryCompany(localSelectDelivery)
  }, [localSelectDelivery, setSelectedDeliveryCompany])

  // ===== Handlers =====
  const handleLocationChange = (e) => {
    const value = e.target.value
    setLocalLocation(value)
    setLocalSelectDelivery('') // reset delivery company when location changes
  }

  const handleDeliveryCompanySelect = (company) => {
    setLocalSelectDelivery(company)
  }

  const isPhnomPenh = localLocation === 'Phnom Penh'
  const isProvince = localLocation && localLocation !== 'Phnom Penh'

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-3">
        Delivery Address
      </h2>

      <form className="space-y-4">
        <CustomerInfo whoami={whoami} />

        <PhoneInput
          phoneNumber={localPhone}
          setPhoneNumber={setLocalPhone}
        />

        <LocationSelector 
          selectedLocation={localLocation} 
          handleLocationChange={handleLocationChange} 
        />

        <DeliveryCompanySelector
          isPhnomPenh={isPhnomPenh}
          isProvince={isProvince}
          handleDeliveryCompanySelect={handleDeliveryCompanySelect}
          selectedDeliveryCompany={localSelectDelivery}
          vet_logo={vet_logo}
          jnt_logo={jnt_logo}
          grab_logo={grab_logo}
          orderNotes={orderNotes}
          setAddress={setAddress}
          setOrderNotes={setOrderNotes}
        />
      </form>
    </section>
  )
}

export default Address
