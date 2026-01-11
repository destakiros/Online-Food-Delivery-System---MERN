import React from 'react';
import { useOrders } from '../context/OrderContext';
import Button from './common/Button';

const AdminPanel: React.FC = () => {
  const { orders, updateStatus } = useOrders();

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <i className="ph-fill ph-gear text-admas-blue"></i> System Controls
      </h3>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-mono text-xs font-bold">{order._id}</p>
              <p className="text-sm text-gray-500">{order.status}</p>
            </div>
            <div className="flex gap-2">
              {order.status === 'Pending' && (
                <Button 
                  onClick={() => updateStatus(order._id, 'Preparing')}
                  className="px-3 py-1 text-xs"
                >
                  Approve
                </Button>
              )}
              {order.status === 'Preparing' && (
                <Button 
                  variant="secondary"
                  onClick={() => updateStatus(order._id, 'Out for Delivery')}
                  className="px-3 py-1 text-xs"
                >
                  Dispatch
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;