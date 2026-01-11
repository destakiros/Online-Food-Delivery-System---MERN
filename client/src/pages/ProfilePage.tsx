
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/formatPrice';
import Button from '../components/common/Button';
import BackButton from '../components/common/BackButton';

interface Props {
  onBack: () => void;
  onNavigate: (page: any) => void;
}

const ProfilePage: React.FC<Props> = ({ onBack, onNavigate }) => {
  const { user, updateUser, updatePassword } = useAuth();
  const { orders } = useOrders();
  const { showToast } = useToast();

  const [info, setInfo] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [pass, setPass] = useState({ new: '', confirm: '' });

  const myOrders = orders.filter(o => o.user === user?.id || (o as any).user?._id === user?.id);

  const isValidPhone = (p: string) => {
    return /^09\d{8}$/.test(p);
  };

  const saveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone(info.phone)) {
      return showToast('Phone must be 10 digits starting with 09', 'error');
    }
    if (user) updateUser(user.id, info);
    showToast('Saved', 'success');
  };

  const savePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.new !== pass.confirm) return showToast('Passwords mismatch', 'error');
    if (pass.new.length < 6) return showToast('Min 6 characters', 'error');
    if (user) updatePassword(user.id, pass.new);
    showToast('Changed', 'success');
    setPass({ new: '', confirm: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen bg-white dark:bg-ino-dark relative">
      <BackButton onClick={onBack} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-12">
        <div className="space-y-8">
            <section className="bg-gray-50 dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-black uppercase mb-6">Edit Profile</h3>
                <form onSubmit={saveInfo} className="space-y-4">
                    <input type="text" placeholder="Name" className="w-full p-4 rounded-xl bg-white dark:bg-gray-900 border text-sm font-bold" value={info.name} onChange={e => setInfo({...info, name: e.target.value})} />
                    <input type="email" placeholder="Email" className="w-full p-4 rounded-xl bg-white dark:bg-gray-900 border text-sm font-bold" value={info.email} onChange={e => setInfo({...info, email: e.target.value})} />
                    <input type="text" placeholder="Phone" className="w-full p-4 rounded-xl bg-white dark:bg-gray-900 border text-sm font-bold" value={info.phone} onChange={e => setInfo({...info, phone: e.target.value})} />
                    <Button type="submit" className="w-full py-4 text-xs uppercase font-black">Save</Button>
                </form>
            </section>

            <section className="bg-ino-dark text-white p-8 rounded-3xl border border-white/5">
                <h3 className="text-xs font-black uppercase text-ino-yellow mb-6">Change Password</h3>
                <form onSubmit={savePass} className="space-y-4">
                    <input type="password" placeholder="New Password" className="w-full p-4 rounded-xl bg-gray-900 border border-white/5 text-xs font-bold" required value={pass.new} onChange={e => setPass({...pass, new: e.target.value})} />
                    <input type="password" placeholder="Confirm" className="w-full p-4 rounded-xl bg-gray-900 border border-white/5 text-xs font-bold" required value={pass.confirm} onChange={e => setPass({...pass, confirm: e.target.value})} />
                    <Button type="submit" className="w-full py-4 text-xs uppercase font-black bg-white text-ino-dark">Update</Button>
                </form>
            </section>
        </div>

        <div className="xl:col-span-2 space-y-8">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Orders</h3>
            <div className="space-y-4">
                {myOrders.length === 0 ? (
                   <div className="p-20 text-center border-2 border-dashed rounded-3xl">
                      <p className="text-xs font-bold text-gray-400 uppercase">No orders yet</p>
                      <Button variant="outline" className="mt-6 mx-auto text-xs font-black" onClick={() => onNavigate('menu')}>View Menu</Button>
                   </div>
                ) : (
                  myOrders.map(order => (
                    <div key={order._id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                       <div>
                          <p className="text-xs font-black uppercase">Order #{order._id.slice(-4).toUpperCase()}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                       </div>
                       <div className="text-right">
                          <p className="font-black text-ino-red">{formatPrice(order.totalPrice)}</p>
                          <span className="text-[8px] font-black uppercase">{order.status}</span>
                       </div>
                    </div>
                  ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
