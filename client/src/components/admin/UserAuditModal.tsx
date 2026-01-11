import React from 'react';
import Modal from '../common/Modal';
import { User, Order } from '../../types';
import { formatPrice } from '../../utils/formatPrice';

interface UserAuditModalProps {
  user: User | null;
  orders: Order[];
  onClose: () => void;
}

const UserAuditModal = ({ user, orders, onClose }: UserAuditModalProps) => {
  if (!user) return null;

  return (
    <Modal isOpen={!!user} onClose={onClose} title="User Profile Details">
      <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2 custom-scroll">
        {/* Basic Info */}
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl">
          <div className="w-12 h-12 bg-ino-red rounded-full flex items-center justify-center font-bold text-white">
            {user.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-lg">{user.name}</h4>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Order History */}
        <div>
          <h5 className="text-xs font-black uppercase tracking-widest text-ino-yellow mb-4">Past Orders</h5>
          <div className="space-y-3">
            {orders.length > 0 ? orders.map((order) => (
              <div key={order._id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <p className="text-xs font-bold">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-ino-red">{formatPrice(order.totalPrice)}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400">{order.status}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 italic">This person hasn't ordered anything yet.</p>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h5 className="text-xs font-black uppercase tracking-widest text-ino-yellow mb-4">Messages Sent</h5>
          <div className="space-y-3">
            {user.notifications.length > 0 ? user.notifications.map((notif) => (
              <div key={notif.id} className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-sm leading-relaxed mb-2">{notif.text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500">{new Date(notif.timestamp).toLocaleDateString()}</span>
                  <span className={`text-[10px] font-bold uppercase ${notif.isRead ? 'text-gray-600' : 'text-ino-red'}`}>
                    {notif.isRead ? 'Seen' : 'New'}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 italic">No messages have been sent to this person.</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UserAuditModal;