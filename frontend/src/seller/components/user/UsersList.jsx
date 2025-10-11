import React from 'react'
import UserCart from './UserCart'

const UsersList = ({visible,users}) => {
  return (
    <div>
    
        <div className={`grid  ${visible ? 'grid-cols-1  ': 'grid-cols-1 lg:grid-cols-2' } gap-6`}>
            {users.length > 0 ? (
            users.map((user) => (
                <div
                key={user.id}
                className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-gray-100"
                >
                    
                    <UserCart user={user}/>

                </div>
            ))
            ) : (
            <p className="text-gray-600 col-span-full text-center py-10">
                No users found
            </p>
            )}
        </div>

  
        
    </div>
  )
}

export default UsersList
