import React from 'react'

const LocationSelector = ({
  selectedLocation, 
  handleLocationChange, 
  label = "Province/City",
  placeholder = "Select delivery location",
  required = true,
  className = ""
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-green-600 mb-2">
        {label}
      </label>
      <select 
        value={selectedLocation}
        onChange={handleLocationChange}
        className={`w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white ${className}`}
        required={required}
      >
        <option value="">{placeholder}</option>
        <option value="Phnom Penh">Phnom Penh</option>
        <option value="Kandal">Kandal</option>
        <option value="Siem Reap">Siem Reap</option>
        <option value="Battambang">Battambang</option>
        <option value="Kampong Cham">Kampong Cham</option>
        <option value="Kampong Speu">Kampong Speu</option>
        <option value="Kampong Thom">Kampong Thom</option>
        <option value="Kampot">Kampot</option>
        <option value="Kep">Kep</option>
        <option value="Koh Kong">Koh Kong</option>
        <option value="Kratie">Kratie</option>
        <option value="Mondulkiri">Mondulkiri</option>
        <option value="Oddar Meanchey">Oddar Meanchey</option>
        <option value="Pailin">Pailin</option>
        <option value="Preah Vihear">Preah Vihear</option>
        <option value="Prey Veng">Prey Veng</option>
        <option value="Pursat">Pursat</option>
        <option value="Ratanakiri">Ratanakiri</option>
        <option value="Sihanoukville">Sihanoukville</option>
        <option value="Stung Treng">Stung Treng</option>
        <option value="Svay Rieng">Svay Rieng</option>
        <option value="Takeo">Takeo</option>
        <option value="Tbong Khmum">Tbong Khmum</option>
        <option value="Kampong Chhnang">Kampong Chhnang</option>
        <option value="Banteay Meanchey">Banteay Meanchey</option>
      </select>
    </div>
  )
}

export default LocationSelector