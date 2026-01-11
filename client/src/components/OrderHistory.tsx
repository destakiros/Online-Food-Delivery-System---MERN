
import React from 'react';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import '../styles/OrderHistory.css';

const OrderHistory = () => {
  const { orders } = useOrders();
  const { user } = useAuth();

  // Show only orders for the logged-in user
  const myOrders = orders.filter(o => o.user === user?.id || (o as any).user?._id === user?.id);

  return (
    <div className="history-container py-24 px-6 min-h-screen">
      <h2 className="text-center text-ino-red mb-10 font-black uppercase tracking-tighter text-3xl">Your Order History</h2>
      
      {myOrders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/20 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-gray-800">
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No orders found in your timeline.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myOrders.map((order) => (
            <div key={order._id} className="order-card p-6 bg-white dark:bg-gray-800 border-l-[6px] border-ino-red rounded-2xl shadow-sm transition-all hover:shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-black text-ino-red uppercase text-sm">ORDER #{order._id.slice(-6).toUpperCase()}</h4>
                <div className={`px-3 py-1 rounded text-[9px] font-black uppercase ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-ino-yellow/10 text-ino-yellow'
                }`}>
                  {order.status}
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                  <span className="text-gray-400 mr-2 uppercase text-[9px]">Items:</span>
                  {order.orderItems?.map((item: any) => `${item.qty}x ${item.name}`).join(', ')}
                </p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                  <span className="text-gray-400 mr-2 uppercase text-[9px]">Total:</span>
                  {order.totalPrice} ETB
                </p>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                  <span className="text-gray-400 mr-2 uppercase text-[9px]">Date:</span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="pt-4 border-t dark:border-gray-700 flex justify-between items-center">
                 <p className="text-[9px] font-black text-gray-400 uppercase">Paid via {order.bankName || 'Bank'}</p>
                 <button className="text-[9px] font-black uppercase text-ino-red hover:underline">Track Realtime</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
