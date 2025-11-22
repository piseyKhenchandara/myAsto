import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Recipts from '../../../customer/pages/checkout/Recipts'
import { getUserByIdAPI } from '../../../api/Auth.api'


const ViewAuthProfile = () => {
  const { user_id } = useParams();
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        setLoading(true);
        const user = await getUserByIdAPI(user_id); // ✅ Fetch target user
        setTargetUser(user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchTargetUser();
    }
  }, [user_id]);

  if (loading) return <p>Loading...</p>;
  if (!targetUser) return <p>User not found</p>;

  return (
    <section>
      <header className="bg-white shadow p-4 mb-4 border-b-2 border-green-600">
        <h4 className="text-xl font-bold">
          Viewing Receipts for: {targetUser.name}
        </h4>
        <p className="text-gray-600">{targetUser.email}</p>
      </header>
      
      <Recipts whoami={targetUser} />
    </section>
  )
}

export default ViewAuthProfile