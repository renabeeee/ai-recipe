import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "I'm here to help you create anti-inflammatory recipes. What would you like to make today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMessage,
        }),
      });

      const data = await response.json();

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || data.error || "Sorry, something went wrong.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Unable to generate recipe. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div className="header-content">
            <h1 className="brand">NOURISH</h1>
            <p className="subtitle">Anti-Inflammatory Recipe AI</p>
          </div>
        </header>

        {/* Messages Area */}
        <div className="messages-container">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-content">
                  {message.role === "assistant" ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: message.content }}
                      className="assistant-text"
                    />
                  ) : (
                    <p className="user-text">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="input-container">
          <div className="input-wrapper">
            {messages.length === 1 && !loading && (
              <div className="suggestions">
                <button
                  className="suggestion"
                  onClick={() => setInput("golden turmeric latte")}
                >
                  Golden turmeric latte
                </button>
                <button
                  className="suggestion"
                  onClick={() => setInput("salmon bowl with avocado")}
                >
                  Salmon bowl with avocado
                </button>
                <button
                  className="suggestion"
                  onClick={() => setInput("berry smoothie")}
                >
                  Berry smoothie
                </button>
              </div>
            )}

            <div className="input-box">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Message Nourish..."
                className="chat-input"
                rows="1"
                disabled={loading}
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !input.trim()}
                className="send-btn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 11L12 6L17 11M12 18V7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .chat-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0a0a0a;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        /* Header */
        .chat-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #2a2a2a;
          background: #0f0f0f;
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .brand {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 3px;
          color: #ffffff;
        }

        .subtitle {
          font-size: 0.75rem;
          color: #666666;
          margin-top: 0.25rem;
          letter-spacing: 1px;
        }

        /* Messages Container */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 2rem 1rem;
        }

        .messages {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Message Bubbles */
        .message {
          margin-bottom: 1.5rem;
          display: flex;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.assistant {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 85%;
          padding: 1rem 1.25rem;
          border-radius: 1rem;
          line-height: 1.6;
        }

        .message.user .message-content {
          background: #2a2a2a;
          border-bottom-right-radius: 0.25rem;
        }

        .message.assistant .message-content {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-bottom-left-radius: 0.25rem;
        }

        .user-text {
          color: #ffffff;
          font-size: 0.95rem;
        }

        .assistant-text {
          color: #cccccc;
          font-size: 0.95rem;
        }

        /* Assistant Text Styling */
        :global(.assistant-text h2) {
          color: #ffffff;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        :global(.assistant-text h3) {
          color: #ffffff;
          font-size: 1.1rem;
          margin: 1.5rem 0 0.75rem;
          font-weight: 600;
        }

        :global(.assistant-text ul),
        :global(.assistant-text ol) {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }

        :global(.assistant-text li) {
          margin-bottom: 0.5rem;
          color: #cccccc;
        }

        :global(.assistant-text p) {
          color: #cccccc;
          margin-bottom: 1rem;
        }

        :global(.assistant-text em) {
          display: block;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #2a2a2a;
          font-style: italic;
          color: #888888;
        }

        /* Typing Indicator */
        .typing-indicator {
          display: flex;
          gap: 0.4rem;
          padding: 0.5rem 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #666666;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%,
          60%,
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-8px);
          }
        }

        /* Input Container */
        .input-container {
          padding: 1rem;
          border-top: 1px solid #2a2a2a;
          background: #0f0f0f;
        }

        .input-wrapper {
          max-width: 800px;
          margin: 0 auto;
        }

        /* Suggestions */
        .suggestions {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .suggestion {
          padding: 0.625rem 1rem;
          background: transparent;
          border: 1px solid #2a2a2a;
          border-radius: 1.5rem;
          color: #888888;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .suggestion:hover {
          background: #1a1a1a;
          border-color: #3a3a3a;
          color: #cccccc;
        }

        /* Input Box */
        .input-box {
          display: flex;
          align-items: flex-end;
          gap: 0.75rem;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 1.5rem;
          padding: 0.75rem 1rem;
          transition: border-color 0.2s;
        }

        .input-box:focus-within {
          border-color: #3a3a3a;
        }

        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.95rem;
          font-family: inherit;
          resize: none;
          max-height: 200px;
          line-height: 1.5;
        }

        .chat-input:focus {
          outline: none;
        }

        .chat-input::placeholder {
          color: #555555;
        }

        .chat-input:disabled {
          opacity: 0.5;
        }

        .send-btn {
          width: 32px;
          height: 32px;
          border-radius: 0.5rem;
          background: #ffffff;
          color: #0a0a0a;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          background: #e0e0e0;
        }

        .send-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Scrollbar */
        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: #0a0a0a;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: #2a2a2a;
          border-radius: 4px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #3a3a3a;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .message-content {
            max-width: 90%;
          }

          .suggestions {
            flex-direction: column;
          }

          .suggestion {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
