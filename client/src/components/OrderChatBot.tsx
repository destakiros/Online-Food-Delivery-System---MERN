
import React, { useState } from 'react';
import '../styles/OrderChatBot.css';

const OrderChatBot = () => {
  const [messages, setMessages] = useState([{ text: "Hi! How can I help with your order?", sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { text: "Sorry, I'm having trouble connecting.", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">In-N-Out Assistant</div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
            {m.text}
          </div>
        ))}
        {isTyping && <div className="msg bot-msg">Thinking...</div>}
      </div>
      <div className="chat-input-area">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask something..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default OrderChatBot;
