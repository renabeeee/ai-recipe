import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/.netlify/functions/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      const aiMessage = {
        role: "assistant",
        content: data.answer || "Sorry, I couldn’t create that recipe.",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error generating recipe:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(to bottom right, #fff7ed, #fef3c7)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1rem",
          textAlign: "center",
          background: "white",
          borderBottom: "1px solid #facc15",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <h1 style={{ color: "#92400e", marginBottom: "0.25rem" }}>NOURISH</h1>
        <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
          Your Anti-Inflammatory Recipe Chat
        </p>
      </header>

      {/* Chat messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#fbbf24" : "white",
              color: msg.role === "user" ? "black" : "#111827",
              padding: "1rem",
              borderRadius:
                msg.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
              maxWidth: "80%",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              lineHeight: 1.5,
            }}
            dangerouslySetInnerHTML={{ __html: msg.content }}
          />
        ))}

        {loading && (
          <div
            style={{
              background: "white",
              color: "#9ca3af",
              padding: "1rem",
              borderRadius: "16px 16px 16px 0",
              alignSelf: "flex-start",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              fontStyle: "italic",
            }}
          >
            Generating recipe...
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          background: "white",
          borderTop: "1px solid #facc15",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for a recipe (e.g. turmeric smoothie)..."
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            borderRadius: "9999px",
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginLeft: "0.75rem",
            background: "#f59e0b",
            color: "white",
            border: "none",
            borderRadius: "9999px",
            padding: "0.75rem 1.25rem",
            fontWeight: "bold",
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
