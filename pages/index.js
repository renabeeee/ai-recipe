import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm Nourish, your anti-inflammatory recipe assistant. Tell me what you'd like to cook, or try one of the examples below!",
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

  // Enhanced formatting function
  const formatRecipe = (text) => {
    if (!text) return '';
    
    let formatted = text
      // Clean up any existing HTML
      .replace(/<[^>]*>/g, '')
      // Headers with icons
      .replace(/^# (.*$)/gim, '<h1>🍴 $1</h1>')
      .replace(/^## (.*$)/gim, '<h2>📝 $1</h2>')
      .replace(/^### (.*$)/gim, '<h3>👩‍🍳 $1</h3>')
      // Ingredients section
      .replace(/ingredients:/gi, '<h2>🛒 Ingredients</h2>')
      // Instructions section  
      .replace(/instructions:/gi, '<h2>👩‍🍳 Instructions</h2>')
      .replace(/steps:/gi, '<h2>👩‍🍳 Instructions</h2>')
      // Benefits section
      .replace(/benefits:/gi, '<h2>🌟 Anti-Inflammatory Benefits</h2>')
      .replace(/anti-inflammatory benefits:/gi, '<h2>🌟 Anti-Inflammatory Benefits</h2>')
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Numbered lists
      .replace(/^\s*(\d+)\.\s+(.*)$/gim, '<li><span class="step-number">$1.</span> $2</li>')
      // Bullet points
      .replace(/^\s*[-*•]\s+(.*)$/gim, '<li>• $1</li>')
      // Line breaks for paragraphs
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, ' ')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ');

    // Wrap consecutive list items
    formatted = formatted.replace(/(<li>.*?<\/li>)+/g, (match) => {
      if (match.includes('step-number')) {
        return '<ol class="instructions">' + match + '</ol>';
      } else {
        return '<ul class="ingredients">' + match + '</ul>';
      }
    });

    // Ensure proper paragraph wrapping
    if (!formatted.startsWith('<h1') && !formatted.startsWith('<h2')) {
      formatted = '<p>' + formatted + '</p>';
    }

    // Add recipe card container
    formatted = '<div class="recipe-card">' + formatted + '</div>';

    return formatted;
  };

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
          prompt: `${userMessage} - Please create a detailed anti-inflammatory recipe with clear sections: Recipe Name, Ingredients, Instructions, and Anti-Inflammatory Benefits. Use bullet points for ingredients and numbered steps for instructions.`,
        }),
      });

      const data = await response.json();
      const formattedRecipe = formatRecipe(data.answer);

      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: formattedRecipe || data.error || "Sorry, something went wrong.",
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

  const handleQuickOption = (option) => {
    setInput(option);
    // Auto-submit after a brief delay so user can see what was selected
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSubmit(fakeEvent);
    }, 100);
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm Nourish, your anti-inflammatory recipe assistant. Tell me what you'd like to cook, or try one of the examples below!",
      },
    ]);
    setInput("");
  };

  return (
    <>
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div className="header-content">
            <h1 className="brand">NOURISH</h1>
            <p className="subtitle">Anti-Inflammatory Recipe Assistant</p>
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
                      className="assistant-text recipe-content"
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
            {/* Quick Options - Always visible but context-aware */}
            <div className="quick-options">
              <p className="options-label">Quick Recipes:</p>
              <div className="options-grid">
                <button
                  className="option-btn"
                  onClick={() => handleQuickOption("anti-inflammatory berry smoothie")}
                  disabled={loading}
                >
                  Berry Smoothie
                </button>
                <button
                  className="option-btn"
                  onClick={() => handleQuickOption("golden turmeric latte")}
                  disabled={loading}
                >
                  Turmeric Latte
                </button>
                <button
                  className="option-btn"
                  onClick={() => handleQuickOption("salmon avocado bowl")}
                  disabled={loading}
                >
                  Salmon Bowl
                </button>
                <button
                  className="option-btn"
                  onClick={() => handleQuickOption("quinoa vegetable stir fry")}
                  disabled={loading}
                >
                  Quinoa Stir Fry
                </button>
              </div>
              
              <div className="modification-options">
                <p className="options-label">Popular Variations:</p>
                <div className="options-grid">
                  <button
                    className="option-btn variation"
                    onClick={() => handleQuickOption("vegan anti-inflammatory smoothie")}
                    disabled={loading}
                  >
                    Vegan Smoothie
                  </button>
                  <button
                    className="option-btn variation"
                    onClick={() => handleQuickOption("mango ginger anti-inflammatory smoothie")}
                    disabled={loading}
                  >
                    Mango Ginger
                  </button>
                  <button
                    className="option-btn variation"
                    onClick={() => handleQuickOption("spicy anti-inflammatory soup")}
                    disabled={loading}
                  >
                    Spicy Soup
                  </button>
                  <button
                    className="option-btn variation"
                    onClick={() => handleQuickOption("gluten-free anti-inflammatory breakfast")}
                    disabled={loading}
                  >
                    Gluten-Free
                  </button>
                </div>
              </div>
            </div>

            {/* Input with clear action */}
            <div className="input-section">
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
                  placeholder="Describe your recipe or dietary needs..."
                  className="chat-input"
                  rows="1"
                  disabled={loading}
                />
                <div className="input-actions">
                  <button
                    onClick={clearChat}
                    className="clear-btn"
                    title="Start over"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M19 7L5 21M5 7L19 21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
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
              <p className="input-hint">
                Each request creates a new recipe. Use the quick options above or type your own idea!
              </p>
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
          text-align: center;
        }

        .brand {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 4px;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .subtitle {
          font-size: 0.8rem;
          color: #4a9c6d;
          letter-spacing: 1px;
        }

        /* Messages Container */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem 1rem;
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
          max-width: 90%;
          padding: 0;
          border-radius: 1rem;
          line-height: 1.6;
          overflow: hidden;
        }

        .message.user .message-content {
          background: #2a2a2a;
          border-bottom-right-radius: 0.25rem;
          padding: 1rem 1.25rem;
        }

        .message.assistant .message-content {
          background: transparent;
          border: none;
        }

        .user-text {
          color: #ffffff;
          font-size: 0.95rem;
        }

        /* Enhanced Recipe Card Styling */
        .recipe-card {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 1rem;
          padding: 2rem;
          margin: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .recipe-content h1 {
          color: #ffffff;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          padding-bottom: 1rem;
          border-bottom: 3px solid #4a9c6d;
          text-align: center;
        }

        .recipe-content h2 {
          color: #4a9c6d;
          font-size: 1.3rem;
          font-weight: 600;
          margin: 2.5rem 0 1.25rem 0;
          padding: 0.75rem 0;
          border-bottom: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .recipe-content h3 {
          color: #e8b959;
          font-size: 1.1rem;
          font-weight: 600;
          margin: 2rem 0 1rem 0;
          padding-left: 0.5rem;
          border-left: 3px solid #e8b959;
        }

        .recipe-content p {
          margin: 1rem 0;
          line-height: 1.7;
          color: #cccccc;
          font-size: 0.95rem;
        }

        /* Ingredients List */
        .recipe-content .ingredients {
          margin: 1rem 0 1.5rem 0;
          padding: 0;
          list-style: none;
        }

        .recipe-content .ingredients li {
          margin: 0.75rem 0;
          padding: 0.75rem 1rem;
          background: #252525;
          border-radius: 0.5rem;
          border-left: 4px solid #4a9c6d;
          color: #e0e0e0;
          font-size: 0.95rem;
          line-height: 1.5;
          transition: all 0.2s ease;
        }

        .recipe-content .ingredients li:hover {
          background: #2a2a2a;
          transform: translateX(4px);
        }

        /* Instructions List */
        .recipe-content .instructions {
          margin: 1rem 0 1.5rem 0;
          padding: 0;
          list-style: none;
          counter-reset: step-counter;
        }

        .recipe-content .instructions li {
          margin: 1.25rem 0;
          padding: 1rem 1rem 1rem 3.5rem;
          background: #252525;
          border-radius: 0.75rem;
          position: relative;
          color: #e0e0e0;
          font-size: 0.95rem;
          line-height: 1.6;
          border: 1px solid #2a2a2a;
          transition: all 0.2s ease;
        }

        .recipe-content .instructions li:hover {
          background: #2a2a2a;
          border-color: #3a3a3a;
        }

        .recipe-content .step-number {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 2rem;
          height: 2rem;
          background: #e8b959;
          color: #0a0a0a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .recipe-content strong {
          color: #ffffff;
          font-weight: 600;
          background: linear-gradient(135deg, #4a9c6d, #e8b959);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .recipe-content em {
          color: #888888;
          font-style: italic;
        }

        /* Quick Options */
        .quick-options {
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: #151515;
          border-radius: 1rem;
          border: 1px solid #2a2a2a;
        }

        .options-label {
          font-size: 0.9rem;
          color: #888888;
          margin-bottom: 1rem;
          text-align: center;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .option-btn {
          padding: 0.75rem 1rem;
          background: #252525;
          border: 1px solid #2a2a2a;
          border-radius: 0.75rem;
          color: #cccccc;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          text-align: center;
        }

        .option-btn:hover:not(:disabled) {
          background: #2a2a2a;
          border-color: #4a9c6d;
          color: #ffffff;
          transform: translateY(-1px);
        }

        .option-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .option-btn.variation {
          background: #1a2a1a;
          border-color: #2a5c2a;
          color: #88cc88;
        }

        .option-btn.variation:hover:not(:disabled) {
          background: #2a3a2a;
          border-color: #4a9c6d;
        }

        .modification-options {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #2a2a2a;
        }

        /* Input Section */
        .input-section {
          background: #151515;
          border-radius: 1rem;
          border: 1px solid #2a2a2a;
          padding: 1.5rem;
        }

        .input-box {
          display: flex;
          align-items: flex-end;
          gap: 0.75rem;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 0.75rem;
          padding: 1rem;
          transition: border-color 0.2s;
          margin-bottom: 0.75rem;
        }

        .input-box:focus-within {
          border-color: #4a9c6d;
        }

        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.95rem;
          font-family: inherit;
          resize: none;
          max-height: 120px;
          line-height: 1.5;
        }

        .chat-input:focus {
          outline: none;
        }

        .chat-input::placeholder {
          color: #666666;
        }

        .chat-input:disabled {
          opacity: 0.5;
        }

        .input-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .clear-btn {
          width: 32px;
          height: 32px;
          border-radius: 0.5rem;
          background: transparent;
          color: #666666;
          border: 1px solid #2a2a2a;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .clear-btn:hover {
          background: #2a2a2a;
          color: #ffffff;
          border-color: #3a3a3a;
        }

        .send-btn {
          width: 32px;
          height: 32px;
          border-radius: 0.5rem;
          background: #4a9c6d;
          color: #ffffff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          background: #5aac7d;
          transform: translateY(-1px);
        }

        .send-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          background: #2a2a2a;
        }

        .input-hint {
          font-size: 0.8rem;
          color: #666666;
          text-align: center;
          line-height: 1.4;
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
            max-width: 95%;
          }

          .options-grid {
            grid-template-columns: 1fr 1fr;
          }

          .recipe-card {
            padding: 1.5rem;
          }

          .recipe-content h1 {
            font-size: 1.5rem;
          }

          .recipe-content h2 {
            font-size: 1.1rem;
          }

          .recipe-content .instructions li {
            padding: 1rem 1rem 1rem 2.5rem;
          }

          .recipe-content .step-number {
            width: 1.5rem;
            height: 1.5rem;
            font-size: 0.75rem;
          }

          .quick-options {
            padding: 1rem;
          }

          .input-section {
            padding: 1rem;
          }
        }

        @media (max-width: 480px) {
          .options-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
