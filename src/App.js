import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [isSet, setIsSet] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const now = new Date();
      const msgObj = {
        user: username,
        text: message,
        time: now.toLocaleTimeString('fa-IR'),
        date: now.toLocaleDateString('fa-IR'),
      };
      socket.emit('chat message', msgObj);
      setMessage('');
    }
  };

  if (!isSet) {
    return (
      <div className="container">
        <div className="chat-card">
          <h2 className="chat-title">👤 نام خود را وارد کنید</h2>
          <form onSubmit={() => setIsSet(true)}>
            <input
              className="chat-input"
              placeholder="نام شما..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button className="chat-button" type="submit">ورود</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="chat-card">
        <h2 className="chat-title">💬 چت آنلاین</h2>
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, i) => (
            <div key={i} className="chat-message">
              <strong>{msg.user}</strong>: {msg.text}
              <div className="timestamp">{msg.date} - {msg.time}</div>
            </div>
          ))}
        </div>
        <form className="chat-form" onSubmit={sendMessage}>
          <input
            className="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="پیام بنویس..."
            required
          />
          <button className="chat-button" type="submit">📤 ارسال</button>
        </form>
      </div>
    </div>
  );
}

export default App;
