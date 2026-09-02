import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../services/aiService';

function Chatbot({ destination }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: destination
        ? `Hello! I'm your AI Travel Assistant for ${destination.name}. Ask me anything about sightseeing, food, or duration!`
        : 'Hello! I am your AI Travel Assistant. Ask me anything about destination planning or travel tips!',
    },
  ]);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customText) => {
    const textToSend = customText || inputMessage;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userText = textToSend.trim();
    if (!customText) setInputMessage('');

    // Special quick action: Plan my trip
    if (userText.toLowerCase() === 'plan my trip' && destination) {
      navigate(`/plan?destination=${encodeURIComponent(destination.name)}`);
      return;
    }

    // Append user message
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const payload = {
        message: userText,
        destination: destination?.name || '',
        country: destination?.country || '',
        continent: destination?.continent || '',
        category: destination?.category || '',
        bestTimeToVisit: destination?.bestTimeToVisit || '',
        description: destination?.description || '',
        famousPlaces: destination?.places ? destination.places.map(p => p.name).join(', ') : '',
      };

      const res = await sendChatMessage(payload);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: "Sorry, I couldn't get an answer right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (q) => {
    if (q === 'Plan my trip' && destination) {
      navigate(`/plan?destination=${encodeURIComponent(destination.name)}`);
    } else {
      handleSend(q);
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          className="chatbot-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Travel Assistant"
        >
          💬 AI Travel Assistant
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="chatbot-panel" role="dialog" aria-label="AI Travel Assistant">
          {/* Header */}
          <div className="chatbot-header">
            <div>
              <div className="chatbot-header-title">🌍 Travel Assistant</div>
              <div className="chatbot-header-sub">
                {destination ? `Planning for ${destination.name}` : 'Ask me anything about your trip'}
              </div>
            </div>
            <button
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chatbot"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble ai-bubble thinking-bubble">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span style={{ marginLeft: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Thinking…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="chatbot-quick-questions">
            <button onClick={() => handleQuickQuestion('How many days should I spend here?')}>
              How many days?
            </button>
            <button onClick={() => handleQuickQuestion('Best time to visit?')}>
              Best time?
            </button>
            <button onClick={() => handleQuickQuestion('What are the must-see places?')}>
              Must-see places
            </button>
            <button onClick={() => handleQuickQuestion('What food should I try?')}>
              Local food
            </button>
            <button onClick={() => handleQuickQuestion('Plan my trip')}>
              ✈️ Plan my trip
            </button>
          </div>

          {/* Input Box */}
          <div className="chatbot-input-row">
            <input
              type="text"
              className="chatbot-input"
              placeholder={destination ? `Ask about ${destination.name}…` : 'Ask about a destination…'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading}
              aria-label="Chat input"
            />
            <button
              className="btn btn-primary chatbot-send-btn"
              onClick={() => handleSend()}
              disabled={loading || !inputMessage.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
