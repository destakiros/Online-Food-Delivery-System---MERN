
import React, { useState, useEffect } from 'react';
import '../styles/AdminControlPanel.css';

const AdminMenuManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');

  const loadMenu = () => {
    fetch('/api/food')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch(err => console.error("Error loading menu:", err));
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = { 
      name, 
      price: Number(price), 
      description: desc, 
      category: 'Burger' // Default category for student project
    };

    try {
      const res = await fetch('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (res.ok) {
        setName('');
        setPrice('');
        setDesc('');
        loadMenu();
        alert("New item added to the menu!");
      }
    } catch (err) {
      alert("Failed to add item");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        const res = await fetch(`/api/food/${id}`, { method: 'DELETE' });
        if (res.ok) {
          loadMenu();
        }
      } catch (err) {
        alert("Failed to delete item");
      }
    }
  };

  return (
    <div className="admin-menu-box">
      <h2>Menu Management</h2>
      
      <form className="add-item-form" onSubmit={handleAdd}>
        <h3>Add New Food Item</h3>
        <input 
          placeholder="Food Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
        />
        <input 
          placeholder="Price (ETB)" 
          type="number" 
          value={price} 
          onChange={e => setPrice(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Short Description" 
          value={desc} 
          onChange={e => setDesc(e.target.value)} 
          required 
        />
        <button type="submit" className="save-btn">Save to Menu</button>
      </form>

      <div className="current-items">
        <h3>Current Menu Items</h3>
        {items.length === 0 ? <p>No items found.</p> : items.map(item => (
          <div key={item._id} className="menu-item-row">
            <div>
              <strong>{item.name}</strong> - {item.price} ETB
            </div>
            <button className="delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMenuManager;
