
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

  const [info, setInfo] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    phone: user?.phone || '' 
  });
  
  const [passwords, setPasswords] = useState({ 
    old: '', 
    new: '', 
    confirm: '' 
  });

  const myOrders = orders.filter(o => o.user === user?.id || (o as any).user?._id === user?.id);

  // Requirement Rule: Min 6 characters and must contain a number
  const validateStrongPassword = (p: string) => {
    return p.length >= 6 && /\d/.test(p);
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser(user.id, info);
      showToast('Profile updated', 'success');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check old password
    if (passwords.old !== user?.password) {
      showToast('Wrong old password.', 'error');
      return;
    }

    // Check match
    if (passwords.new !== passwords.confirm) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    // Check strength
    if (!validateStrongPassword(passwords.new)) {
      showToast('Password needs 6 letters and a number.', 'error');
      return;
    }

    if (user) {
      updatePassword(user.id, passwords.new);
      showToast('Password changed', 'success');
      setPasswords({ old: '', new: '', confirm: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen bg-white dark:bg-ino-dark relative">
      <BackButton onClick={onBack} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 pt-12">
        <div className="space-y-8">
            <section className="bg-gray-50 dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-ino-red mb-6">Settings</h3>
                <form onSubmit={handleSaveInfo} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-gray-400 pl-2">Full Name</label>
                      <input type="text" className="w-full p-4 rounded-2xl bg-white dark:bg-gray-900 border dark:border-gray-700 text-sm font-bold" value={info.name} onChange={e => setInfo({...info, name: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black uppercase text-gray-400 pl-2">Email</label>
                      <input type="email" className="w-full p-4 rounded-2xl bg-white dark:bg-gray-900 border dark:border-gray-700 text-sm font-bold" value={info.email} onChange={e => setInfo({...info, email: e.target.value})} required />
                    </div>
                    <Button type="submit" className="w-full py-4 text-[10px] uppercase font-black tracking-widest mt-4">Save Changes</Button>
                </form>
            </section>

            <section className="bg-ino-dark text-white p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-ino-yellow mb-6">Security</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <input 
                      type="password" placeholder="Old Password" 
                      className="w-full p-4 rounded-2xl bg-gray-900 border border-white/5 text-xs font-bold outline-none focus:border-ino-yellow transition-all" 
                      required value={passwords.old} onChange={e => setPasswords({...passwords, old: e.target.value})} 
                    />
                    <input 
                      type="password" placeholder="New Password" 
                      className="w-full p-4 rounded-2xl bg-gray-900 border border-white/5 text-xs font-bold outline-none focus:border-ino-yellow transition-all" 
                      required value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} 
                    />
                    <Button type="submit" className="w-full py-4 text-[10px] uppercase font-black tracking-widest bg-ino-yellow text-admas-blue hover:bg-yellow-400 border-none mt-4">Change Password</Button>
                </form>
            </section>
        </div>

        <div className="xl:col-span-2 space-y-8">
            <h3 className="text-3xl font-black uppercase tracking-tighter">Orders</h3>
            <div className="space-y-4">
                {myOrders.length === 0 ? (
                   <div className="p-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[3rem]">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No orders yet</p>
                      <Button variant="outline" className="mt-6 mx-auto text-[10px] font-black uppercase tracking-widest" onClick={() => onNavigate('menu')}>See Menu</Button>
                   </div>
                ) : (
                  myOrders.map(order => (
                    <div key={order._id} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:shadow-xl transition-all">
                       <div>
                          <p className="text-[10px] font-black uppercase text-ino-red">Order #{order._id.slice(-4).toUpperCase()}</p>
                          <p className="text-xs font-bold text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-black text-gray-900 dark:text-white">{formatPrice(order.totalPrice)}</p>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' : 'bg-ino-yellow/10 text-ino-yellow'}`}>{order.status}</span>
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
