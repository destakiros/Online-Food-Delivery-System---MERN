
import React, { useState, useEffect } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import { Order, Food, OrderItem } from '../../types';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import '../../styles/admin.css';

const AdminDashboard: React.FC<{ onBack: () => void; onNavigate: (page: any) => void }> = ({ onBack, onNavigate }) => {
  const { orders, fetchOrders, updateStatus } = useOrders();
  const { allUsers, user, logout, updateUser, updatePassword, toggleUserStatus } = useAuth();
  const { menuItems, addFood, updateFood, deleteFood } = useMenu();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  
  // Settings State
  const [settingsData, setSettingsData] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passData, setPassData] = useState({ old: '', new: '', confirm: '' });

  // Menu Management State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Food | null>(null);
  const [menuFormData, setMenuFormData] = useState({ name: '', price: 0, description: '', category: 'Burger', imageUrl: '' });

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    onBack(); // Redirect to home
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      updateUser(user.id, settingsData);
      showToast("Profile updated", "success");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) return showToast("Passwords mismatch", "error");
    if (passData.new.length < 6) return showToast("Min 6 characters", "error");
    if (user) {
      updatePassword(user.id, passData.new);
      showToast("Password changed", "success");
      setPassData({ old: '', new: '', confirm: '' });
    }
  };

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateFood(editingItem._id, menuFormData);
      showToast("Item Updated", "success");
    } else {
      addFood(menuFormData as any);
      showToast("Item Added", "success");
    }
    setIsMenuModalOpen(false);
    setEditingItem(null);
  };

  const openMenuModal = (item?: Food) => {
    if (item) {
      setEditingItem(item);
      setMenuFormData({ name: item.name, price: item.price, description: item.description, category: item.category, imageUrl: item.imageUrl });
    } else {
      setEditingItem(null);
      setMenuFormData({ name: '', price: 0, description: '', category: 'Burger', imageUrl: '' });
    }
    setIsMenuModalOpen(true);
  };

  return (
    <div className="admin-layout bg-gray-50 dark:bg-ino-dark min-h-screen">
      <aside className="admin-sidebar bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800">
          <h1 className="font-black text-2xl text-ino-red uppercase tracking-tighter">Admin <span className="text-gray-900 dark:text-white">Panel</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {['dashboard', 'orders', 'menu', 'users', 'settings'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`w-full text-left px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-ino-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleLogout} className="w-full py-4 text-[10px] font-black uppercase text-gray-400 hover:text-ino-red transition-colors flex items-center justify-center gap-2">
            <i className="ph ph-power"></i> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <div className="portal-animate">
            <h2 className="text-3xl font-black uppercase mb-8">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-black text-gray-400 uppercase">Total Orders</p>
                <p className="text-4xl font-black mt-1">{orders.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-black text-gray-400 uppercase">Registered Users</p>
                <p className="text-4xl font-black mt-1 text-ino-yellow">{allUsers.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                <p className="text-[10px] font-black text-gray-400 uppercase">Menu Count</p>
                <p className="text-4xl font-black mt-1">{menuItems.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="portal-animate">
            <h2 className="text-3xl font-black uppercase mb-8">Order Management</h2>
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr className="text-[10px] font-black uppercase text-gray-400">
                    <th className="p-6">ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {orders.map(o => (
                    <tr key={o._id} className="text-sm">
                      <td className="p-6 font-mono text-xs">#{o._id.slice(-6)}</td>
                      <td className="font-bold">{o.customerName}</td>
                      <td className="font-black text-ino-red">{formatPrice(o.totalPrice)}</td>
                      <td>
                         <select 
                            value={o.status} 
                            onChange={(e) => updateStatus(o._id, e.target.value)}
                            className="bg-gray-50 dark:bg-gray-900 p-2 rounded-xl text-[10px] font-black uppercase border border-gray-100 dark:border-gray-700"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                      </td>
                      <td>
                        <button onClick={() => setViewingOrder(o)} className="text-ino-yellow font-black uppercase text-[10px]">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="portal-animate">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase">Menu Manager</h2>
              <Button onClick={() => openMenuModal()}>Add Food</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
                  <h3 className="font-black text-lg uppercase mb-2">{item.name}</h3>
                  <p className="text-ino-red font-black mb-4">{formatPrice(item.price)}</p>
                  <div className="flex gap-2">
                    <button onClick={() => openMenuModal(item)} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-[10px] font-black uppercase">Edit</button>
                    <button onClick={() => deleteFood(item._id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="portal-animate">
            <h2 className="text-3xl font-black uppercase mb-8">User Directory</h2>
            <div className="bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr className="text-[10px] font-black uppercase text-gray-400">
                    <th className="p-6">Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {allUsers.map(u => (
                    <tr key={u.id} className="text-sm">
                      <td className="p-6 font-bold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td>
                        {!u.isAdmin && (
                          <button 
                            onClick={() => toggleUserStatus(u.id)}
                            className="text-[10px] font-black uppercase text-ino-red underline"
                          >
                            {u.status === 'Active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="portal-animate max-w-2xl">
            <h2 className="text-3xl font-black uppercase mb-8">Account Settings</h2>
            
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
              <h3 className="text-xs font-black uppercase text-ino-red mb-6">Profile Information</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={settingsData.name} 
                    onChange={e => setSettingsData({...settingsData, name: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={settingsData.email} 
                    onChange={e => setSettingsData({...settingsData, email: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-sm font-bold"
                  />
                </div>
                <Button type="submit">Save Changes</Button>
              </form>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm">
              <h3 className="text-xs font-black uppercase text-ino-red mb-6">Security</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Old Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={passData.old}
                    onChange={e => setPassData({...passData, old: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={passData.new}
                    onChange={e => setPassData({...passData, new: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 block mb-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={passData.confirm}
                    onChange={e => setPassData({...passData, confirm: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-sm font-bold"
                  />
                </div>
                <Button type="submit">Change Password</Button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Menu Form Modal */}
      <Modal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} title={editingItem ? 'Edit Food Item' : 'Add New Food'}>
        <form onSubmit={handleMenuSubmit} className="space-y-4 dark:text-white">
          <input 
            placeholder="Food Name" 
            className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700" 
            value={menuFormData.name} 
            onChange={e => setMenuFormData({...menuFormData, name: e.target.value})} 
            required 
          />
          <input 
            type="number" 
            placeholder="Price" 
            className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700" 
            value={menuFormData.price} 
            onChange={e => setMenuFormData({...menuFormData, price: Number(e.target.value)})} 
            required 
          />
          <textarea 
            placeholder="Description" 
            className="w-full p-4 rounded-2xl border dark:bg-gray-900 dark:border-gray-700" 
            value={menuFormData.description} 
            onChange={e => setMenuFormData({...menuFormData, description: e.target.value})} 
            required 
          />
          <Button type="submit" className="w-full">Save Food</Button>
        </form>
      </Modal>

      {/* Order Details Modal */}
      <Modal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} title="Order Summary">
        {viewingOrder && (
          <div className="space-y-4 dark:text-white">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-gray-400">Customer</p>
              <p className="font-bold">{viewingOrder.customerName}</p>
              <p className="text-xs text-gray-500">{viewingOrder.customerEmail}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-gray-400">Location</p>
              <p className="text-sm">{viewingOrder.destination}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 mb-2">Items</p>
              {viewingOrder.orderItems.map((item, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>{item.qty}x {item.name}</span>
                  <span className="font-black">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t flex justify-between">
              <span className="font-black uppercase text-xs">Total</span>
              <span className="font-black text-ino-red">{formatPrice(viewingOrder.totalPrice)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
