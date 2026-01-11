
import React, { useState, useEffect } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatPrice';
import { Order, Food, OrderItem } from '../../types';
import Modal from '../../components/common/Modal';
import ProfilePage from '../ProfilePage';
import '../../styles/admin.css';

const AdminDashboard: React.FC<{ onBack: () => void; onNavigate: (page: any) => void }> = ({ onBack, onNavigate }) => {
  const { orders, fetchOrders, updateStatus } = useOrders();
  const { allUsers, logout, toggleUserStatus, deleteUser, addAdmin } = useAuth();
  const { menuItems, addFood, updateFood, deleteFood } = useMenu();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  
  const [menuFormData, setMenuFormData] = useState({ 
    name: '', 
    price: 0, 
    description: '', 
    category: 'Burger', 
    imageUrl: '', 
    ingredients: '' 
  });
  const [adminFormData, setAdminFormData] = useState({ name: '', email: '', password: '' });
  const [editingItem, setEditingItem] = useState<Food | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    onBack();
    showToast("Logged out.", "success");
  };

  const handleMenuSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientsArray = menuFormData.ingredients.split(',').map(i => i.trim()).filter(i => i !== '');
    
    // Default size options based on category
    let defaultSizes = [{ name: 'Regular', priceOffset: 0 }];
    
    if (menuFormData.category === 'Drinks') {
      defaultSizes = [
        { name: 'Small', priceOffset: 0 }, 
        { name: 'Medium', priceOffset: 15 }, 
        { name: 'Large', priceOffset: 30 }
      ];
    } else if (menuFormData.category === 'Pizza') {
      defaultSizes = [
        { name: 'Medium', priceOffset: 0 }, 
        { name: 'Large', priceOffset: 250 }
      ];
    } else if (menuFormData.category === 'Burger') {
      defaultSizes = [
        { name: 'Single', priceOffset: 0 }, 
        { name: 'Double', priceOffset: 120 }
      ];
    }

    const payload = {
      ...menuFormData,
      ingredients: ingredientsArray,
      sizeOptions: defaultSizes,
      spicyLevel: 'None' as const,
      availableToppings: [],
      availableSauces: [],
      isAvailable: true
    };

    if (editingItem) {
      updateFood(editingItem._id, payload);
      showToast("Item Updated", "success");
    } else {
      addFood(payload as any);
      showToast("Item Added", "success");
    }
    setIsMenuModalOpen(false);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAdmin(adminFormData.name, adminFormData.email, adminFormData.password);
    showToast("New Admin Created!", "success");
    setIsAdminModalOpen(false);
    setAdminFormData({ name: '', email: '', password: '' });
  };

  const stats = {
    total: orders.length,
    today: orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length,
    users: allUsers.length,
    items: menuItems.length
  };

  const renderModifiers = (item: OrderItem) => {
    if (!item.config || !item.config.modifiers) return null;
    const mods = item.config.modifiers as Record<string, any>;
    return Object.entries(mods).map(([key, val]) => {
      if (val === 'Standard' || val === 'Normal') return null;
      return (
        <span key={key} className={`inline-block mr-2 text-[8px] font-black uppercase px-2 py-0.5 rounded ${val === 'Remove' || val === 'No' || val === 'RemoveNo' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
          {val}: {key}
        </span>
      );
    }).filter(Boolean);
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="stat-card">
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{stats.total}</p>
              </div>
              <div className="stat-card border-ino-yellow/20">
                <p className="stat-label">Today Orders</p>
                <p className="stat-value text-ino-yellow">{stats.today}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Total Users</p>
                <p className="stat-value">{stats.users}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Menu Items</p>
                <p className="stat-value">{stats.items}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="portal-animate">
            <h2 className="text-3xl font-black uppercase mb-8">Order Management</h2>
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr className="text-[10px] font-black uppercase text-gray-400">
                      <th className="p-6">Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                      <th className="text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {orders.map(o => (
                      <tr key={o._id} className="text-sm">
                        <td className="p-6 font-mono text-[10px]">#{o._id.slice(-6).toUpperCase()}</td>
                        <td className="font-bold">{o.customerName || 'Guest'}</td>
                        <td className="font-black text-ino-red">{formatPrice((o.totalPrice || 0) + (o.deliveryFee || 50))}</td>
                        <td>
                          <select 
                            value={o.status} 
                            onChange={(e) => updateStatus(o._id, e.target.value)}
                            className="bg-gray-50 dark:bg-gray-900 p-2 rounded-xl border border-gray-100 dark:border-gray-700 text-[10px] font-black uppercase outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button onClick={() => setViewingOrder(o)} className="text-[10px] font-black uppercase text-ino-yellow hover:underline">See Details</button>
                        </td>
                        <td className="text-center">
                          {o.paymentReceipt && (
                            <button onClick={() => setViewingReceipt(o.paymentReceipt!)} className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-[9px] font-black uppercase hover:bg-ino-red hover:text-white transition-all">View</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="portal-animate">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase">Menu Manager</h2>
              <button 
                onClick={() => { 
                  setEditingItem(null); 
                  setMenuFormData({ name: '', price: 0, description: '', category: 'Burger', imageUrl: '', ingredients: '' }); 
                  setIsMenuModalOpen(true); 
                }}
                className="bg-ino-red text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
              >
                Add Item
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <div key={item._id} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700">
                  <img src={item.imageUrl} className="w-full h-32 object-cover rounded-2xl mb-4" alt={item.name} />
                  <h3 className="font-black uppercase text-sm">{item.name}</h3>
                  <p className="text-ino-red font-black text-xs">{formatPrice(item.price)}</p>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => { 
                      setEditingItem(item); 
                      setMenuFormData({
                        name: item.name,
                        price: item.price,
                        description: item.description,
                        category: item.category,
                        imageUrl: item.imageUrl,
                        ingredients: item.ingredients.join(', ')
                      }); 
                      setIsMenuModalOpen(true); 
                    }} className="flex-1 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl text-[8px] font-black uppercase">Edit</button>
                    <button onClick={() => deleteFood(item._id)} className="flex-1 py-2 bg-red-50 text-red-500 rounded-xl text-[8px] font-black uppercase">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="portal-animate">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black uppercase">Users</h2>
              <button onClick={() => setIsAdminModalOpen(true)} className="bg-ino-red text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Create Admin</button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-700">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr className="text-[10px] font-black uppercase text-gray-400">
                    <th className="p-6">Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                  {allUsers.map(u => (
                    <tr key={u.id} className="text-sm">
                      <td className="p-6 font-bold">{u.name}</td>
                      <td className="text-gray-500">{u.email}</td>
                      <td><span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${u.isAdmin ? 'bg-ino-red text-white' : 'bg-gray-100 text-gray-500'}`}>{u.isAdmin ? 'Admin' : 'Customer'}</span></td>
                      <td><span className={`text-[9px] font-black uppercase ${u.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>{u.status}</span></td>
                      <td className="flex gap-2 p-6">
                        <button onClick={() => toggleUserStatus(u.id)} className="text-[9px] font-black uppercase text-ino-yellow hover:underline">{u.status === 'Active' ? 'Suspend' : 'Activate'}</button>
                        {!u.isAdmin && <button onClick={() => deleteUser(u.id)} className="text-[9px] font-black uppercase text-red-500 hover:underline">Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="portal-animate">
            <h2 className="text-3xl font-black uppercase mb-8">Admin Settings</h2>
            <ProfilePage onBack={() => setActiveTab('dashboard')} onNavigate={onNavigate} />
          </div>
        )}
      </main>

      {/* MODALS */}
      <Modal isOpen={isMenuModalOpen} onClose={() => setIsMenuModalOpen(false)} title={editingItem ? 'Edit Item' : 'New Item'}>
        <form onSubmit={handleMenuSubmit} className="space-y-4">
          <div className="space-y-1">
             <label className="text-[8px] font-black uppercase text-gray-400 ml-2">Display Name</label>
             <input type="text" placeholder="e.g. Double Beef Stack" className="w-full p-4 rounded-xl border dark:bg-gray-900 dark:border-gray-700 text-sm font-bold" value={menuFormData.name} onChange={e => setMenuFormData({...menuFormData, name: e.target.value})} required />
          </div>
          
          <div className="space-y-1">
             <label className="text-[8px] font-black uppercase text-gray-400 ml-2">Image Link</label>
             <input type="text" placeholder="https://images.unsplash.com/..." className="w-full p-4 rounded-xl border dark:bg-gray-900 dark:border-gray-700 text-sm font-bold" value={menuFormData.imageUrl} onChange={e => setMenuFormData({...menuFormData, imageUrl: e.target.value})} required />
          </div>

          <div className="flex gap-4">
             <div className="w-1/2 space-y-1">
                <label className="text-[8px] font-black uppercase text-gray-400 ml-2">Price (ETB)</label>
                <input type="number" placeholder="280" className="w-full p-4 rounded-xl border dark:bg-gray-900 dark:border-gray-700 text-sm font-bold" value={menuFormData.price} onChange={e => setMenuFormData({...menuFormData, price: Number(e.target.value)})} required />
             </div>
             <div className="w-1/2 space-y-1">
                <label className="text-[8px] font-black uppercase text-gray-400 ml-2">Category</label>
                <select className="w-full p-4 rounded-xl border dark:bg-gray-900 dark:border-gray-700 text-sm font-black uppercase" value={menuFormData.category} onChange={e => setMenuFormData({...menuFormData, category: e.target.value})}>
                   <option value="Burger">Burger</option>
                   <option value="Pizza">Pizza</option>
                   <option value="Drinks">Drinks</option>
                   <option value="Chicken">Chicken</option>
                </select>
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-[8px] font-black uppercase text-gray-400 ml-2">Modifier Components (Separate with commas)</label>
             <input type="text" placeholder="Salt, Spice, Beef, Tomato, Cheese..." className="w-full p-4 rounded-xl border dark:bg-gray-900 dark:border-gray-700 text-sm font-bold" value={menuFormData.ingredients} onChange={e => setMenuFormData({...menuFormData, ingredients: e.target.value})} required />
          </div>

          <div className="space-y-1">
             <label className="text-[8px] font-black uppercase text-gray-400 ml-2">Description</label>
             <textarea placeholder="Tell us about this dish..." className="w-full p-4 rounded-xl border dark:bg-gray-900 dark:border-gray-700 text-sm font-bold h-24" value={menuFormData.description} onChange={e => setMenuFormData({...menuFormData, description: e.target.value})} required />
          </div>

          <button type="submit" className="w-full py-5 bg-ino-red text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-red-700 transition-all">
            {editingItem ? 'Update Dispatch Catalog' : 'Add to Dispatch Catalog'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} title="New Admin Profile">
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-4 rounded-xl border dark:bg-gray-900 dark:border-gray-700" value={adminFormData.name} onChange={e => setAdminFormData({...adminFormData, name: e.target.value})} required />
          <input type="email" placeholder="Email Address" className="w-full p-4 rounded-xl border dark:bg-gray-900 dark:border-gray-700" value={adminFormData.email} onChange={e => setAdminFormData({...adminFormData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full p-4 rounded-xl border dark:bg-gray-900 dark:border-gray-700" value={adminFormData.password} onChange={e => setAdminFormData({...adminFormData, password: e.target.value})} required />
          <button type="submit" className="w-full py-4 bg-ino-red text-white rounded-xl font-black uppercase text-[10px] tracking-widest">Confirm Creation</button>
        </form>
      </Modal>

      <Modal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)} title="Order Manifest">
        {viewingOrder && (
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Customer Info</p>
              <p className="font-bold">{viewingOrder.customerName}</p>
              <p className="text-xs text-gray-500">{viewingOrder.customerEmail} | {viewingOrder.customerPhone}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Location</p>
              <p className="text-xs font-bold leading-relaxed">{viewingOrder.destination}</p>
            </div>
            <div className="space-y-4">
              <p className="text-[9px] font-black text-ino-red uppercase">Items & Ingredients</p>
              {viewingOrder.orderItems.map((item, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-black">{item.qty}x {item.name}</span>
                    <span className="font-bold">{formatPrice(item.price * item.qty)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {renderModifiers(item)}
                    {item.config?.notes && (
                      <span className="inline-block bg-gray-100 dark:bg-gray-900 text-[8px] font-bold px-2 py-0.5 rounded text-gray-500 italic">
                        Note: {item.config.notes}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t dark:border-gray-700 flex justify-between items-center">
              <p className="text-xs font-black uppercase">Grand Total</p>
              <p className="text-2xl font-black text-ino-red">{formatPrice((viewingOrder.totalPrice || 0) + (viewingOrder.deliveryFee || 50))}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!viewingReceipt} onClose={() => setViewingReceipt(null)} title="Payment Receipt">
        <div className="flex flex-col items-center">
          <img src={viewingReceipt!} className="w-full h-auto object-contain rounded-2xl mb-6 max-h-[50vh]" alt="Receipt" />
          <button onClick={() => setViewingReceipt(null)} className="w-full bg-ino-dark text-white py-4 rounded-xl font-black uppercase text-[10px]">Close</button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
