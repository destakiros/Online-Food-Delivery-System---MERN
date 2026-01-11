
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';

// --- MOCK DATA ---
const INITIAL_PRODUCTS = [
  { id: 1, name: "Double-Double", desc: "Two cheese, two beef patties, toasted bun.", price: 5.85, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60" },
  { id: 2, name: "Cheeseburger", desc: "Beef patty, American cheese, lettuce, tomato.", price: 3.95, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=500&q=60" },
  { id: 3, name: "Hamburger", desc: "The classic. Beef patty, fresh onions, lettuce.", price: 3.50, image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=500&q=60" },
  { id: 4, name: "Animal Fries", desc: "Fries topped with cheese, spread, onions.", price: 4.80, image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=500&q=60" },
  { id: 5, name: "French Fries", desc: "Fresh, hand-cut potatoes.", price: 2.30, image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=500&q=60" },
  { id: 6, name: "Strawberry Shake", desc: "Real ice cream shake. Thick and creamy.", price: 2.95, image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=500&q=60" }
];

const INITIAL_USERS = [
  { id: 101, name: "John Doe", email: "john@example.com", password: "password123", orders: 2, status: 'Suspended', suspensionEnd: '12/25/2025', notifications: [{ id: 1, time: "3:45 PM", message: "Your account has been suspended.", read: false }] },
  { id: 102, name: "Sarah Smith", email: "sarah@test.com", password: "password123", orders: 5, status: 'Active', suspensionEnd: null, notifications: [{ id: 2, time: "4:00 PM", message: "Thanks for the review!", read: true }] },
  { id: 999, name: "Guest User", email: "guest@ino.com", password: "N/A", orders: 0, status: 'Active', suspensionEnd: null, notifications: [] } // Guest
];

const INITIAL_ORDERS = [
  { 
    id: "ORD-995", customer: "Alice W", items: "Burger", total: 12.50, status: "Delivered", time: "10:00 AM", date: "2023-10-22", userId: 106, rating: 5,
    history: [
      { status: 'Pending', time: '09:30 AM', date: '2023-10-22' },
      { status: 'Approved', time: '09:35 AM', date: '2023-10-22' },
      { status: 'Delivered', time: '10:00 AM', date: '2023-10-22' }
    ]
  },
  { 
    id: "ORD-996", customer: "Bob B", items: "Fries", total: 4.50, status: "Delivered", time: "11:00 AM", date: "2023-10-22", userId: 107,
    history: [
      { status: 'Pending', time: '10:40 AM', date: '2023-10-22' },
      { status: 'Delivered', time: '11:00 AM', date: '2023-10-22' }
    ]
  },
  { 
    id: "ORD-997", customer: "Charlie C", items: "Shake", total: 5.00, status: "Delivered", time: "1:00 PM", date: "2023-10-23", userId: 108,
    history: [
       { status: 'Pending', time: '12:45 PM', date: '2023-10-23' },
       { status: 'Delivered', time: '1:00 PM', date: '2023-10-23' }
    ]
  },
  { 
    id: "ORD-998", customer: "Sarah Smith", items: "Double-Double (x2), Fries", total: 16.00, status: "Approved", time: "10:30 AM", date: "2023-10-24", userId: 102, rating: 5, reviewComment: "Amazing!", adminFeedback: 'Like', instructions: "Extra pickles.",
    history: [
      { status: 'Pending', time: '10:15 AM', date: '2023-10-24' },
      { status: 'Approved', time: '10:30 AM', date: '2023-10-24' }
    ]
  },
  { 
    id: "ORD-999", customer: "John Doe", items: "Cheeseburger", total: 6.90, status: "Cancelled", time: "11:15 AM", date: "2023-10-24", userId: 101, rating: 1, reviewComment: "Cold food.", adminFeedback: null, instructions: null,
    history: [
      { status: 'Pending', time: '11:00 AM', date: '2023-10-24' },
      { status: 'Cancelled', time: '11:15 AM', date: '2023-10-24' }
    ]
  },
  { 
    id: "ORD-1000", customer: "Mike Ross", items: "Animal Fries", total: 4.80, status: "Pending", time: "12:00 PM", date: "2023-10-25", userId: 103, rating: null, instructions: null,
    history: [
      { status: 'Pending', time: '12:00 PM', date: '2023-10-25' }
    ]
  }
];

const CHART_COLORS = ['#FFCA3A', '#4CAF50', '#EF4444', '#3B82F6', '#8884d8'];

// --- HELPER COMPONENTS ---
const StarRating = ({ rating }) => {
  return (
    <div className="text-ino-yellow text-lg">
      {[1, 2, 3, 4, 5].map(star => (
        <i key={star} className={star <= rating ? "ph-fill ph-star" : "ph ph-star"}></i>
      ))}
    </div>
  );
};

const SimpleMarkdown = ({ text }) => {
  // Simple MD renderer for AI reports
  if(!text) return null;
  const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .split('\n').map(line => {
          if (line.startsWith('# ')) return `<h1 class="text-2xl font-bold mt-4 mb-2">${line.substring(2)}</h1>`;
          if (line.startsWith('## ')) return `<h2 class="text-xl font-semibold mt-3 mb-1">${line.substring(3)}</h2>`;
          if (line.startsWith('* ')) return `<li class="ml-6 list-disc">${line.substring(2)}</li>`;
          return line;
      }).join('<br />');
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// --- MAIN APP COMPONENT ---
function App() {
  // State
  const [view, setView] = useState('customer'); // 'customer', 'auth', 'adminLogin', 'admin'
  const [authMode, setAuthMode] = useState('sign-in');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Data State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // null = Guest/Logged Out

  // Admin State
  const [adminTab, setAdminTab] = useState('dashboard');
  const [adminUser, setAdminUser] = useState(null);
  const [aiReport, setAiReport] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // Admin Filter State
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDateStart, setFilterDateStart] = useState('');
  const [filterDateEnd, setFilterDateEnd] = useState('');

  // Modals State
  const [ratingModalOrder, setRatingModalOrder] = useState(null);
  const [instructionModalOrder, setInstructionModalOrder] = useState(null);
  const [suspendModalUser, setSuspendModalUser] = useState(null);
  const [historyModalOrder, setHistoryModalOrder] = useState(null);
  
  // Refs
  const specialInstructionsRef = useRef('');

  // Effects
  useEffect(() => {
    // Theme Loader
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  // --- ACTIONS ---

  // Auth Actions
  const handleCustomerLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (user) {
      setCurrentUser(user);
      setView('customer');
    } else {
      alert("Invalid credentials");
    }
  };

  const handleCustomerSignup = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    if (users.some(u => u.email === email)) return alert("User exists");

    const newUser = {
      id: Date.now(),
      name, email, password,
      orders: 0, status: 'Active',
      notifications: [{ id: Date.now(), message: `Welcome ${name}!`, read: false, time: new Date().toLocaleTimeString() }]
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setView('customer');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (email === "admin@gmail.com" && password === "admin123") {
      setAdminUser({ name: "Admin" });
      setView('admin');
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  // Cart Actions
  const addToCart = (product) => {
    if (!currentUser) {
        alert("Please login to order.");
        setAuthMode('sign-in');
        setView('auth');
        return;
    }
    if (currentUser.status === 'Suspended') {
        alert("Your account is suspended.");
        return;
    }

    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.qty + delta;
        return newQty > 0 ? { ...c, qty: newQty } : null;
      }
      return c;
    }).filter(Boolean));
  };

  const placeOrder = () => {
    if (cart.length === 0) return alert("Empty cart");
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const itemStr = cart.map(i => `${i.name} (x${i.qty})`).join(', ');
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      customer: currentUser.name,
      items: itemStr,
      total,
      status: 'Pending',
      time: timeStr,
      date: dateStr, 
      userId: currentUser.id,
      rating: null,
      instructions: specialInstructionsRef.current.value,
      adminFeedback: null,
      history: [
          { status: 'Pending', date: dateStr, time: timeStr }
      ]
    };
    
    setOrders([newOrder, ...orders]);
    setUsers(users.map(u => u.id === currentUser.id ? {...u, orders: u.orders + 1} : u));
    setCart([]);
    setIsCartOpen(false);
    setRatingModalOrder(newOrder); // Show rating modal immediately for demo
    specialInstructionsRef.current.value = "";
  };

  // Admin Actions
  const updateOrderStatus = (oid, status) => {
    if (confirm(`Set order ${oid} to ${status}?`)) {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setOrders(orders.map(o => {
            if (o.id === oid) {
                const newHistory = [...(o.history || []), { status, date: dateStr, time: timeStr }];
                return { ...o, status, history: newHistory };
            }
            return o;
        }));
    }
  };

  const toggleAdminFeedback = (orderId, type) => {
    setOrders(orders.map(o => {
        if (o.id === orderId) {
            return { ...o, adminFeedback: o.adminFeedback === type ? null : type };
        }
        return o;
    }));
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
        const response = await axios.post('http://localhost:5000/api/report/generate', {}, {
             headers: { 'Authorization': 'Bearer mock_admin_token' } 
        });
        setAiReport(response.data.report);
    } catch (e) {
        setAiReport("**Error generating report.** Please ensure server is running.");
        console.error(e);
    } finally {
        setIsGeneratingReport(false);
    }
  };
  
  // --- CHART DATA AGGREGATION ---
  const { trendData, pieData } = useMemo(() => {
    const dataMap = {};
    const statusMap = {};

    orders.forEach(order => {
        // Daily Stats
        const date = order.date || 'Unknown';
        if (!dataMap[date]) dataMap[date] = { date, revenue: 0, count: 0 };
        if (order.status !== 'Cancelled') {
            dataMap[date].revenue += order.total;
        }
        dataMap[date].count += 1;

        // Status Stats
        const status = order.status || 'Unknown';
        statusMap[status] = (statusMap[status] || 0) + 1;
    });

    const trendData = Object.values(dataMap).sort((a, b) => a.date.localeCompare(b.date));
    
    const pieData = Object.keys(statusMap).map(status => ({
        name: status,
        value: statusMap[status]
    }));

    return { trendData, pieData };
  }, [orders]);

  // --- FILTERED ORDERS ---
  const filteredOrders = useMemo(() => {
      return orders.filter(order => {
          const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
          const orderDate = new Date(order.date);
          // Only compare if dates are valid
          const start = filterDateStart ? new Date(filterDateStart) : null;
          const end = filterDateEnd ? new Date(filterDateEnd) : null;
          
          const matchesStart = !start || orderDate >= start;
          const matchesEnd = !end || orderDate <= end;
          
          return matchesStatus && matchesStart && matchesEnd;
      });
  }, [orders, filterStatus, filterDateStart, filterDateEnd]);

  // --- RENDER HELPERS ---

  const renderProducts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map(p => (
        <div key={p.id} className="card-menu group">
          <div className="first-content" style={{ backgroundImage: `url(${p.image})` }}>
            <div className="w-full bg-gradient-to-t from-black/90 to-transparent p-4 text-center rounded-b-[15px] pt-12">
              <h3 className="font-black text-2xl text-white tracking-tight">{p.name}</h3>
              <span className="font-bold text-xl text-ino-yellow">${p.price.toFixed(2)}</span>
            </div>
          </div>
          <div className="second-content bg-gray-900">
            <h3 className="text-ino-yellow font-bold text-xl mb-2">{p.name}</h3>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">{p.desc}</p>
            <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} 
                    className="px-6 py-3 bg-ino-red text-white rounded-full font-bold shadow-lg hover:bg-red-600 hover:scale-105 transition transform flex items-center gap-2">
                <i className="ph-bold ph-plus"></i> Add to Order
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // --- VIEW RENDERING ---

  if (view === 'auth') {
    return (
        <div className="h-screen relative overflow-hidden flex items-center justify-center p-4 bg-black">
            <div className="login-bg-animation"></div>
            <div className="card-auth w-full max-w-md relative z-10">
                <div className="card-inner">
                    <button onClick={() => setView('customer')} className="absolute top-4 left-4 text-ino-yellow hover:text-ino-red"><i className="ph-bold ph-x text-2xl"></i></button>
                    {authMode === 'sign-in' ? (
                        <form onSubmit={handleCustomerLogin}>
                            <p className="text-center text-ino-yellow text-lg mb-6">CUSTOMER SIGN IN</p>
                            <div className="field"><i className="ph-fill ph-envelope-simple"></i><input name="email" className="input-field" placeholder="Email" required /></div>
                            <div className="field"><i className="ph-fill ph-lock-key"></i><input name="password" type="password" className="input-field" placeholder="Password" required /></div>
                            <button className="login-button mt-4">Sign In</button>
                            <p className="text-center text-gray-400 mt-4 text-sm cursor-pointer" onClick={() => setAuthMode('sign-up')}>No account? <span className="underline">Sign Up</span></p>
                        </form>
                    ) : (
                        <form onSubmit={handleCustomerSignup}>
                            <p className="text-center text-ino-yellow text-lg mb-6">CUSTOMER SIGN UP</p>
                            <div className="field"><i className="ph-fill ph-user"></i><input name="name" className="input-field" placeholder="Full Name" required /></div>
                            <div className="field"><i className="ph-fill ph-envelope-simple"></i><input name="email" className="input-field" placeholder="Email" required /></div>
                            <div className="field"><i className="ph-fill ph-lock-key"></i><input name="password" type="password" className="input-field" placeholder="Password" required /></div>
                            <button className="login-button mt-4">Register</button>
                            <p className="text-center text-gray-400 mt-4 text-sm cursor-pointer" onClick={() => setAuthMode('sign-in')}>Has account? <span className="underline">Sign In</span></p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
  }

  if (view === 'adminLogin') {
      return (
        <div className="h-screen relative overflow-hidden flex items-center justify-center p-4 bg-black">
            <div className="login-bg-animation"></div>
            <div className="card-auth w-full max-w-md relative z-10">
                <div className="card-inner">
                    <form onSubmit={handleAdminLogin}>
                        <p className="text-center text-ino-yellow text-lg mb-6">ADMIN PORTAL</p>
                        <div className="field"><i className="ph-fill ph-envelope-simple"></i><input name="email" className="input-field" placeholder="Email" required /></div>
                        <div className="field"><i className="ph-fill ph-lock-key"></i><input name="password" type="password" className="input-field" placeholder="Password" required /></div>
                        <button className="login-button mt-4">Access Dashboard</button>
                        <button type="button" onClick={() => setView('customer')} className="w-full text-center text-gray-400 mt-4 text-sm">Back to Home</button>
                    </form>
                </div>
            </div>
        </div>
      );
  }

  if (view === 'admin') {
      const pendingCount = orders.filter(o => o.status === 'Pending').length;
      return (
          <div className="min-h-screen bg-gray-100 flex dark:bg-gray-900 dark:text-gray-100">
              <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-20">
                  <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                      <span className="font-black text-xl text-ino-yellow">ADMIN</span>
                      <label className="ui-switch scale-75">
                          <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                          <div className="slider"><div className="circle"></div></div>
                      </label>
                  </div>
                  <nav className="flex-1 p-4 space-y-2">
                      {['dashboard', 'orders', 'menu', 'reviews', 'users'].map(tab => (
                          <button key={tab} onClick={() => setAdminTab(tab)} 
                            className={`admin-nav-btn w-full text-left p-3 rounded flex items-center gap-2 ${adminTab === tab ? 'active' : 'text-gray-400 hover:bg-gray-800'}`}>
                              <i className="ph ph-circles-four"></i> {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                      ))}
                  </nav>
                  <div className="p-4 border-t border-gray-800">
                      <button onClick={() => setView('customer')} className="w-full py-2 bg-red-900/50 text-red-200 rounded hover:bg-red-900">Logout</button>
                  </div>
              </aside>

              <main className="flex-1 ml-64 p-8 overflow-y-auto">
                  {adminTab === 'dashboard' && (
                      <div>
                          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
                          
                          {/* Stats Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-yellow-400">
                                  <div className="text-gray-500">Pending Orders</div>
                                  <div className="text-3xl font-bold">{pendingCount}</div>
                              </div>
                              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                                  <div className="text-gray-500">Total Revenue</div>
                                  <div className="text-3xl font-bold">${orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0).toFixed(2)}</div>
                              </div>
                              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                                  <div className="text-gray-500">Cancelled Orders</div>
                                  <div className="text-3xl font-bold">{orders.filter(o => o.status === 'Cancelled').length}</div>
                              </div>
                          </div>

                          {/* Charts Section */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                <h3 className="font-bold text-lg mb-4 text-gray-700 dark:text-gray-200">Revenue & Volume Trend</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={trendData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                                            <XAxis dataKey="date" tick={{fontSize: 12}} stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} />
                                            <YAxis yAxisId="left" tick={{fontSize: 12}} stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} />
                                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} stroke={isDarkMode ? '#9CA3AF' : '#4B5563'} />
                                            <RechartsTooltip 
                                                contentStyle={{backgroundColor: isDarkMode ? '#1f2937' : '#fff', borderColor: isDarkMode ? '#374151' : '#ccc', color: isDarkMode ? '#fff' : '#000'}} 
                                            />
                                            <Legend />
                                            <Bar yAxisId="right" dataKey="count" name="Orders" fill="#FFCA3A" barSize={20} radius={[4, 4, 0, 0]} />
                                            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#4CAF50" strokeWidth={2} dot={{r: 4}} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                                <h3 className="font-bold text-lg mb-4 text-gray-700 dark:text-gray-200">Order Status Distribution</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                          </div>
                          
                          {/* AI Report Section */}
                          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8 border-l-4 border-blue-500">
                              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                  <i className="ph-fill ph-robot text-blue-500"></i> Gemini Intelligence
                              </h3>
                              <p className="text-gray-500 text-sm mb-4">Generate AI-powered logistics reports from current order data.</p>
                              <button onClick={handleGenerateReport} disabled={isGeneratingReport} 
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2">
                                  {isGeneratingReport ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-lightning"></i>}
                                  Generate Report
                              </button>
                              {aiReport && (
                                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                                      <SimpleMarkdown text={aiReport} />
                                  </div>
                              )}
                          </div>
                      </div>
                  )}

                  {adminTab === 'orders' && (
                      <div>
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <h2 className="text-2xl font-bold">Order Management</h2>
                            {/* Filter Bar */}
                            <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                                <select 
                                    className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 text-sm"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="All">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">From:</span>
                                    <input 
                                        type="date" 
                                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-2 text-sm"
                                        value={filterDateStart}
                                        onChange={(e) => setFilterDateStart(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">To:</span>
                                    <input 
                                        type="date" 
                                        className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-2 py-2 text-sm"
                                        value={filterDateEnd}
                                        onChange={(e) => setFilterDateEnd(e.target.value)}
                                    />
                                </div>
                                {(filterStatus !== 'All' || filterDateStart || filterDateEnd) && (
                                    <button 
                                        onClick={() => { setFilterStatus('All'); setFilterDateStart(''); setFilterDateEnd(''); }}
                                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded text-sm font-bold"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                              <table className="w-full text-left">
                                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 text-sm">
                                      <tr><th className="p-4">ID</th><th className="p-4">Customer</th><th className="p-4">Items</th><th className="p-4">Date</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                      {filteredOrders.length > 0 ? (
                                          filteredOrders.map(o => (
                                              <tr key={o.id}>
                                                  <td className="p-4 font-mono text-sm">{o.id}</td>
                                                  <td className="p-4 font-bold">{o.customer}</td>
                                                  <td className="p-4 text-sm">{o.items}</td>
                                                  <td className="p-4 text-sm text-gray-500">{o.date}</td>
                                                  <td className="p-4">
                                                      <div className="flex items-center gap-2">
                                                          <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : o.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{o.status}</span>
                                                          <button onClick={() => setHistoryModalOrder(o)} className="text-gray-400 hover:text-blue-500 transition" title="View History">
                                                              <i className="ph-bold ph-clock-counter-clockwise"></i>
                                                          </button>
                                                      </div>
                                                  </td>
                                                  <td className="p-4 flex gap-2">
                                                      {o.status === 'Pending' && (
                                                          <>
                                                          <button onClick={() => updateOrderStatus(o.id, 'Approved')} className="text-green-500 hover:bg-green-100 p-2 rounded"><i className="ph-bold ph-check"></i></button>
                                                          <button onClick={() => updateOrderStatus(o.id, 'Cancelled')} className="text-red-500 hover:bg-red-100 p-2 rounded"><i className="ph-bold ph-x"></i></button>
                                                          </>
                                                      )}
                                                      {o.status === 'Approved' && (
                                                           <button onClick={() => updateOrderStatus(o.id, 'Delivered')} className="text-blue-500 hover:bg-blue-100 p-2 rounded text-xs font-bold border border-blue-200">Deliver</button>
                                                      )}
                                                      {o.instructions && <button onClick={() => setInstructionModalOrder(o)} className="text-red-500"><i className="ph-fill ph-warning"></i></button>}
                                                  </td>
                                              </tr>
                                          ))
                                      ) : (
                                          <tr><td colSpan="6" className="p-8 text-center text-gray-500">No orders found matching filters.</td></tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}
                  
                  {adminTab === 'reviews' && (
                      <div>
                          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                              <table className="w-full text-left">
                                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 text-sm">
                                      <tr>
                                          <th className="p-4">Order ID</th>
                                          <th className="p-4">Customer</th>
                                          <th className="p-4">Rating</th>
                                          <th className="p-4">Comment</th>
                                          <th className="p-4 text-right">Feedback</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                      {orders.filter(o => o.rating).length > 0 ? (
                                          orders.filter(o => o.rating).map(o => (
                                              <tr key={o.id}>
                                                  <td className="p-4 font-mono text-sm">{o.id}</td>
                                                  <td className="p-4 font-bold">{o.customer}</td>
                                                  <td className="p-4"><StarRating rating={o.rating} /></td>
                                                  <td className="p-4 text-sm italic text-gray-600 dark:text-gray-300">
                                                      "{o.reviewComment || "No comment"}"
                                                  </td>
                                                  <td className="p-4 text-right flex justify-end gap-2">
                                                      <button 
                                                          onClick={() => toggleAdminFeedback(o.id, 'Like')} 
                                                          className={`p-2 rounded hover:bg-green-100 ${o.adminFeedback === 'Like' ? 'text-green-600 bg-green-50' : 'text-gray-400'}`}
                                                          title="Like"
                                                      >
                                                          <i className={o.adminFeedback === 'Like' ? "ph-fill ph-thumbs-up" : "ph ph-thumbs-up"}></i>
                                                      </button>
                                                      <button 
                                                          onClick={() => toggleAdminFeedback(o.id, 'Dislike')} 
                                                          className={`p-2 rounded hover:bg-red-100 ${o.adminFeedback === 'Dislike' ? 'text-red-600 bg-red-50' : 'text-gray-400'}`}
                                                          title="Dislike"
                                                      >
                                                          <i className={o.adminFeedback === 'Dislike' ? "ph-fill ph-thumbs-down" : "ph ph-thumbs-down"}></i>
                                                      </button>
                                                  </td>
                                              </tr>
                                          ))
                                      ) : (
                                          <tr><td colSpan="5" className="p-8 text-center text-gray-500">No reviews found.</td></tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  )}

                  {/* Additional tabs (Menu, Users) can be implemented similarly using state */}
                  {adminTab === 'menu' && <div className="p-10 text-center text-gray-500">Menu Management Placeholder</div>}
                  {adminTab === 'users' && <div className="p-10 text-center text-gray-500">User Management Placeholder</div>}
              </main>

              {/* Instruction Modal */}
              {instructionModalOrder && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
                          <h3 className="text-xl font-bold mb-4 text-red-600">Special Instructions</h3>
                          <p className="p-4 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-100 border border-yellow-200 dark:border-yellow-900/50 rounded">{instructionModalOrder.instructions}</p>
                          <button onClick={() => setInstructionModalOrder(null)} className="mt-4 w-full bg-gray-200 dark:bg-gray-700 py-2 rounded font-bold">Close</button>
                      </div>
                  </div>
              )}

              {/* Status History Modal */}
              {historyModalOrder && (
                  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full shadow-2xl">
                          <div className="flex justify-between items-center mb-6">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Order History</h3>
                              <button onClick={() => setHistoryModalOrder(null)} className="text-gray-400 hover:text-gray-600"><i className="ph-bold ph-x text-lg"></i></button>
                          </div>
                          
                          <div className="mb-4">
                              <p className="text-sm text-gray-500">Order ID: <span className="font-mono font-bold text-gray-700 dark:text-gray-300">{historyModalOrder.id}</span></p>
                              <p className="text-sm text-gray-500">Customer: <span className="font-bold text-gray-700 dark:text-gray-300">{historyModalOrder.customer}</span></p>
                          </div>

                          <div className="space-y-6 relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-2">
                              {(historyModalOrder.history || []).map((h, idx) => (
                                  <div key={idx} className="relative">
                                      <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${idx === historyModalOrder.history.length -1 ? 'bg-blue-500 border-blue-500' : 'bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600'}`}></div>
                                      <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{h.status}</p>
                                      <p className="text-xs text-gray-500">{h.date} at {h.time}</p>
                                  </div>
                              ))}
                              {(!historyModalOrder.history || historyModalOrder.history.length === 0) && (
                                  <p className="text-sm text-gray-400 italic">No history recorded.</p>
                              )}
                          </div>

                          <button onClick={() => setHistoryModalOrder(null)} className="mt-6 w-full bg-ino-red text-white py-2 rounded font-bold hover:bg-red-700 transition">Close</button>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // --- CUSTOMER VIEW ---
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark-mode' : ''}`}>
        {/* NAV */}
        <nav className="bg-white shadow-sm fixed w-full z-40 top-0 transition duration-300">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                    <div className="w-10 h-10 bg-ino-red rounded-full flex items-center justify-center text-ino-yellow font-bold text-xl border-2 border-ino-yellow shadow-sm">
                        <i className="ph-fill ph-arrow-fat-right"></i>
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-ino-red">IN-N-OUT <span className="text-gray-800">EATS</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <label className="ui-switch mr-2">
                        <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
                        <div className="slider"><div className="circle"></div></div>
                    </label>
                    
                    <div className="relative">
                        <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 hover:bg-gray-100 rounded-full transition relative">
                            <i className="ph ph-bell text-2xl text-gray-700"></i>
                            {currentUser && currentUser.notifications.some(n => !n.read) && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">!</span>
                            )}
                        </button>
                        {isNotifOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-lg border p-4 z-50">
                                <h4 className="font-bold border-b pb-2 mb-2">Notifications</h4>
                                {currentUser?.notifications.map(n => (
                                    <div key={n.id} className="text-sm p-2 border-b last:border-0">{n.message}</div>
                                )) || <p className="text-sm text-gray-400">No notifications</p>}
                            </div>
                        )}
                    </div>

                    {currentUser ? (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-green-600">Hi, {currentUser.name.split(' ')[0]}</span>
                            <button onClick={() => { setCurrentUser(null); setCart([]); }} className="text-sm text-gray-500 hover:text-red-500">Logout</button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={() => { setAuthMode('sign-in'); setView('auth'); }} className="text-sm font-bold text-ino-red">Sign In</button>
                            <button onClick={() => setView('adminLogin')} className="text-xs text-gray-400 hover:text-gray-600">Admin</button>
                        </div>
                    )}

                    <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-gray-100 rounded-full transition">
                        <i className="ph ph-shopping-cart text-2xl text-gray-700"></i>
                        {cart.length > 0 && <span className="absolute top-0 right-0 bg-ino-red text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cart.reduce((a,b)=>a+b.qty,0)}</span>}
                    </button>
                </div>
            </div>
        </nav>

        {/* HERO */}
        <header className="palm-bg h-96 mt-16 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative text-center text-white px-4">
                <h1 className="text-5xl md:text-7xl font-black mb-4 drop-shadow-lg text-ino-yellow">QUALITY FIRST</h1>
                <p className="text-xl font-semibold mb-8 text-white/90">Freshness you can taste, delivered.</p>
                <a href="#menu" className="bg-ino-red text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg border-2 border-white/20">Order Now</a>
            </div>
        </header>

        {/* MENU */}
        <main id="menu" className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                <i className="ph-fill ph-hamburger text-ino-red"></i> Menu
            </h2>
            {renderProducts()}
        </main>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-4 text-center">
                <div className="font-black text-2xl mb-4 text-ino-yellow">IN-N-OUT EATS</div>
                <button onClick={() => setIsTermsOpen(true)} className="text-sm text-ino-yellow hover:text-white mb-6">Terms and Conditions</button>
                <div className="border-t border-gray-700 pt-4 text-sm text-gray-500">
                    &copy; 2025 In N Out. All rights reserved.
                </div>
            </div>
        </footer>

        {/* CART SIDEBAR */}
        <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-[60] flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 bg-ino-red text-white flex justify-between items-center shadow-md">
                <h2 className="text-xl font-bold flex items-center gap-2"><i className="ph ph-shopping-bag"></i> Your Order</h2>
                <button onClick={() => setIsCartOpen(false)} className="hover:bg-white/20 rounded-full p-1"><i className="ph ph-x text-2xl"></i></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">Cart is empty</div>
                ) : (
                    cart.map(item => (
                        <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border">
                            <img src={item.image} className="w-14 h-14 rounded-lg object-cover" />
                            <div className="flex-1">
                                <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                                <div className="text-ino-red font-bold text-sm">${(item.price * item.qty).toFixed(2)}</div>
                            </div>
                            <div className="flex items-center gap-2 bg-white rounded-lg px-2 border">
                                <button onClick={() => updateQty(item.id, -1)} className="text-gray-500 px-1">-</button>
                                <span className="font-bold text-sm">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="text-gray-500 px-1">+</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 bg-gray-50 border-t">
                <label className="font-bold text-sm mb-2 block text-gray-800 flex items-center gap-2">
                    <i className="ph-fill ph-warning text-ino-red"></i> Special Instructions
                </label>
                <textarea ref={specialInstructionsRef} className="w-full border p-2 rounded-lg text-sm resize-none" rows="2" placeholder="Allergies, etc..."></textarea>
            </div>
            <div className="p-6 bg-gray-50 border-t">
                <div className="flex justify-between mb-4 text-xl font-black text-gray-900">
                    <span>Total</span>
                    <span>${cart.reduce((sum, i) => sum + (i.price * i.qty), 0).toFixed(2)}</span>
                </div>
                <button onClick={placeOrder} className="w-full bg-ino-yellow text-red-900 py-3 rounded-xl font-black text-lg hover:bg-yellow-400 transition shadow-lg flex items-center justify-center gap-2">
                    Checkout <i className="ph-bold ph-arrow-right"></i>
                </button>
            </div>
        </div>
        {isCartOpen && <div onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/50 z-[55]"></div>}

        {/* TERMS MODAL */}
        {isTermsOpen && (
            <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-gray-800">
                    <h3 className="text-2xl font-bold mb-4 text-ino-red">Terms & Conditions</h3>
                    <ul className="list-disc ml-5 space-y-2 mb-6">
                        <li>Users must create an account to order.</li>
                        <li>Suspended users cannot place orders.</li>
                        <li>Payments are processed securely.</li>
                        <li>Inform us of any allergies via Special Instructions.</li>
                    </ul>
                    <button onClick={() => setIsTermsOpen(false)} className="bg-ino-red text-white px-6 py-2 rounded font-bold w-full">I Agree</button>
                </div>
            </div>
        )}

        {/* DEMO RATING MODAL */}
        {ratingModalOrder && (
            <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg text-center">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Order Placed!</h3>
                    <p className="text-gray-600 mb-6">Your Order ID is {ratingModalOrder.id}</p>
                    <p className="mb-6">How would you rate your experience?</p>
                    <div className="flex justify-center gap-2 text-3xl text-gray-300 mb-4 cursor-pointer">
                        {[1,2,3,4,5].map(s => <i key={s} className="ph ph-star hover:text-ino-yellow" onClick={() => { alert("Thanks for rating!"); setRatingModalOrder(null); }}></i>)}
                    </div>
                    <button onClick={() => setRatingModalOrder(null)} className="text-gray-400 underline text-sm">Skip</button>
                </div>
            </div>
        )}
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
