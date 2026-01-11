
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders } = useOrders();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-admas-blue text-white rounded-full flex items-center justify-center text-2xl font-bold">
          {user?.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Total Orders</p>
          <p className="text-2xl font-black text-admas-blue">{orders.length}</p>
        </div>
        <div className="p-4 bg-red-50 rounded-xl">
          <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-black text-ino-red">
            {orders.filter(o => o.status === 'Pending').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
