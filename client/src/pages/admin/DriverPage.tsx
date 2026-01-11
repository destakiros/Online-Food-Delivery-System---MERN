
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin-simple.css';

const DriverPage = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [vehicle, setVehicle] = useState('Motorcycle');
  const [aiTip, setAiTip] = useState('');

  // 1. Get all drivers from our server
  const getDrivers = async () => {
    try {
      const res = await axios.get('/api/drivers');
      setDrivers(res.data);
    } catch (err) {
      alert('Could not load drivers!');
    }
  };

  useEffect(() => {
    getDrivers();
  }, []);

  // 2. Add a new driver to the list
  const addDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/drivers', { name, vehicleType: vehicle });
      setName('');
      getDrivers(); // Refresh the list
    } catch (err) {
      alert('Error adding driver');
    }
  };

  // 3. Ask Gemini for a quick dispatch tip
  const getAiHelp = async () => {
    setAiTip('Asking the AI...');
    try {
      const res = await axios.post('/api/drivers/recommend', {
        orderDetails: 'Busy Friday night, 5 burger orders pending'
      });
      setAiTip(res.data.recommendation);
    } catch (err) {
      setAiTip('AI is busy right now.');
    }
  };

  return (
    <div className="admin-container">
      <h1>Driver Management</h1>

      {/* Add Driver Form */}
      <form className="add-form" onSubmit={addDriver}>
        <h3>Register New Driver</h3>
        <input 
          placeholder="Driver Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
          <option>Motorcycle</option>
          <option>Sedan</option>
          <option>Van</option>
        </select>
        <button className="btn-add">Save Driver</button>
      </form>

      {/* AI Help Section */}
      <button className="btn-ai" onClick={getAiHelp}>Get Dispatch Tip (AI)</button>
      {aiTip && <div className="ai-box">{aiTip}</div>}

      {/* Driver List Table */}
      <table className="driver-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Vehicle</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d._id}>
              <td>{d.name}</td>
              <td>{d.vehicleType}</td>
              <td>{d.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverPage;
