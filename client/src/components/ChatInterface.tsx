
import React, { useState } from 'react';
import '../styles/ChatInterfaceStyles.css';

const ChatInterface = () => {
  const [msgList, setMsgList] = useState([
    { text: "Hello! I'm the In-N-Out helper. Ask me anything!", role: 'bot' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMsg = { text: userInput, role: 'user' };
    setMsgList((prev) => [...prev, newMsg]);
    const savedInput = userInput;
    setUserInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-help/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: savedInput })
      });

      const data = await response.json();
      setMsgList((prev) => [...prev, { text: data.reply, role: 'bot' }]);
    } catch (err) {
      setMsgList((prev) => [...prev, { text: "Connection error. Try again?", role: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      <div className="chat-header-bar">Support Chat</div>
      <div className="message-display-area">
        {msgList.map((m, index) => (
          <div key={index} className={`chat-bubble ${m.role === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="chat-bubble bot-bubble" style={{opacity: 0.6}}>Typing...</div>}
      </div>
      <div className="chat-input-row">
        <input 
          placeholder="Ask a question..." 
          value={userInput} 
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button className="chat-send-button" onClick={handleSendMessage}>Go</button>
      </div>
    </div>
  );
};

export default ChatInterface;
