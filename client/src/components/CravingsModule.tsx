
import React, { useState } from 'react';
import '../styles/CravingsStyles.css';

const CravingsModule = () => {
  const [craving, setCraving] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const getAIsuggestion = async () => {
    if (!craving) return alert("Tell me what you're craving first!");
    
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/cravings/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cravingText: craving })
      });

      const data = await response.json();
      setResult(data.suggestion);
    } catch (err) {
      setResult("The chef is busy! Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="craving-box">
      <h3>Feeling Hungry?</h3>
      <p style={{fontSize: '12px', color: '#666', marginBottom: '10px'}}>Describe your craving (e.g. "cheesy and warm")</p>
      <input 
        className="craving-input"
        value={craving}
        onChange={(e) => setCraving(e.target.value)}
        placeholder="I want something..."
      />
      <button className="suggest-btn" onClick={getAIsuggestion} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI Chef"}
      </button>

      {result && (
        <div className="ai-suggestion-result">
          <strong>Chef Suggests:</strong> {result}
        </div>
      )}
    </div>
  );
};

export default CravingsModule;
