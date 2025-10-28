import React from 'react'

const DisplayFileNameSelected = ({fileName}) => {
  return (
    <div>
   
            {fileName&& (
                <div className="mt-2 p-2 bg-gray-100 rounded-lg">
                <p className="text-xs  truncate">
                    You selected: <span className='text-green-700'>{fileName}</span>
                </p>
                </div>
            )}
            
    </div>
  )
}

export default DisplayFileNameSelected
