import { useState } from "react";

export default function Home() {
  const [recipe, setRecipe] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!input.trim()) return;

    setLoading(true);
    setRecipe(null);

    try {
      const response = await fetch("/.netlify/functions/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();
      setRecipe({
        title: input,
        content: data.answer || "Sorry, I couldn't create that recipe.",
      });
    } catch (err) {
      console.error("Error generating recipe:", err);
      setRecipe({
        title: input,
        content: "⚠️ Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  function formatRecipeContent(content) {
    const paragraphs = content.split("\n").filter((p) => p.trim());

    return paragraphs.map((paragraph, idx) => {
      if (
        paragraph.match(/^\*\*.*\*\*:?/) ||
        paragraph.match(/^[A-Z][^.!?]*:/)
      ) {
        const text = paragraph.replace(/\*\*/g, "").replace(":", "");
        return (
          <h2
            key={idx}
            className="text-xl font-bold text-gray-900 mt-6 mb-3"
            style={{ fontFamily: "Verdana" }}
          >
            {text}
          </h2>
        );
      }

      if (paragraph.match(/^[\d]+\./) || paragraph.match(/^[•\-\*]/)) {
        const text = paragraph
          .replace(/^[\d]+\.\s*/, "")
          .replace(/^[•\-\*]\s*/, "");
        return (
          <li
            key={idx}
            className="ml-6 mb-1 text-gray-800"
            style={{ fontFamily: "Verdana" }}
          >
            {text}
          </li>
        );
      }

      return (
        <p
          key={idx}
          className="text-gray-800 mb-3 leading-relaxed"
          style={{ fontFamily: "Verdana" }}
        >
          {paragraph}
        </p>
      );
    });
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #eef2f5, #d9e1e8)",
        fontFamily: "Tahoma, Verdana, sans-serif",
        color: "#111",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(to bottom, #fff, #e8ecf0)",
          borderBottom: "1px solid #b7c3cf",
          padding: "20px 0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          className="text-center"
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            color: "#003366",
            textShadow: "1px 1px 0 #fff",
          }}
        >
          NOURISH
        </h1>
        <p
          className="text-center"
          style={{ color: "#335577", marginTop: "4px", fontSize: "14px" }}
        >
          Your Anti-Inflammatory Recipe Assistant
        </p>
      </header>

      <main
        className="mx-auto"
        style={{
          width: "90%",
          maxWidth: "900px",
          marginTop: "40px",
        }}
      >
        {/* Search Box */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #b7c3cf",
            padding: "20px",
            boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter recipe idea (e.g., turmeric smoothie)"
            style={{
              width: "75%",
              padding: "10px",
              border: "1px solid #7e8fa3",
              fontFamily: "Tahoma",
              fontSize: "14px",
              boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.15)",
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginLeft: "10px",
              padding: "10px 18px",
              background: "linear-gradient(to bottom, #5ba3ff, #1a6ad9)",
              color: "#fff",
              border: "1px solid #004a99",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
            }}
          >
            {loading ? "Loading..." : "Generate"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              background: "#fff",
              padding: "30px",
              marginTop: "30px",
              border: "1px solid #b7c3cf",
              textAlign: "center",
              boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
            }}
          >
            <p style={{ color: "#003366", fontSize: "16px" }}>
              Generating recipe…
            </p>
          </div>
        )}

        {/* Recipe */}
        {recipe && !loading && (
          <div
            style={{
              background: "#fff",
              padding: "30px",
              marginTop: "30px",
              border: "1px solid #b7c3cf",
              boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
            }}
          >
            <h1
              style={{
                fontSize: "26px",
                color: "#003366",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {recipe.title}
            </h1>

            <hr style={{ margin: "12px 0 20px", borderColor: "#c3cfdb" }} />

            <div>{formatRecipeContent(recipe.content)}</div>

            <button
              onClick={() => {
                setRecipe(null);
                setInput("");
              }}
              style={{
                display: "inline-block",
                marginTop: "30px",
                color: "#003399",
                textDecoration: "underline",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ← Create Another Recipe
            </button>
          </div>
        )}

        {/* Welcome State */}
        {!recipe && !loading && (
          <div
            style={{
              background: "#fff",
              padding: "30px",
              marginTop: "30px",
              border: "1px solid #b7c3cf",
              textAlign: "center",
              boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
            }}
          >
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                color: "#003366",
                marginBottom: "10px",
              }}
            >
              Welcome to NOURISH
            </h2>
            <p style={{ color: "#335577", lineHeight: "1.4" }}>
              Tell me what you want to cook and I’ll generate an
              anti-inflammatory recipe just for you.
            </p>
          </div>
        )}
      </main>

      <footer
        className="text-center"
        style={{
          padding: "20px",
          marginTop: "40px",
          color: "#335577",
          fontSize: "12px",
        }}
      >
        © 2003 NOURISH • Powered by AI
      </footer>
    </div>
  );
}
