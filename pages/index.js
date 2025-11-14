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
            className="text-2xl font-bold text-emerald-800 mt-8 mb-4 first:mt-0"
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
            className="ml-6 mb-2 text-gray-700 leading-relaxed list-disc"
          >
            {text}
          </li>
        );
      }

      return (
        <p key={idx} className="text-gray-700 leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-4xl font-bold text-emerald-800 text-center mb-2">
            NOURISH
          </h1>
          <p className="text-center text-emerald-600">
            Your Anti-Inflammatory Recipe Assistant
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-emerald-100">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What would you like to cook? (e.g., turmeric smoothie, ginger salmon)"
              className="flex-1 px-6 py-4 border-2 border-emerald-200 rounded-full focus:outline-none focus:border-emerald-400 text-lg text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? "Creating..." : "Get Recipe"}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-emerald-100">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mb-4"></div>
            <p className="text-emerald-700 text-lg">Crafting your recipe...</p>
          </div>
        )}

        {/* Recipe Article */}
        {recipe && !loading && (
          <article className="bg-white rounded-2xl shadow-lg p-12 border border-emerald-100">
            {/* Recipe Title */}
            <h1 className="text-4xl font-bold text-emerald-800 mb-6 capitalize">
              {recipe.title}
            </h1>

            <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-emerald-600 mb-8"></div>

            {/* Recipe Content */}
            <div className="prose prose-lg max-w-none">
              {formatRecipeContent(recipe.content)}
            </div>

            {/* New Recipe Button */}
            <div className="mt-12 pt-8 border-t border-emerald-100 text-center">
              <button
                onClick={() => {
                  setRecipe(null);
                  setInput("");
                }}
                className="text-emerald-600 hover:text-emerald-700 font-semibold underline transition-colors"
              >
                ← Create another recipe
              </button>
            </div>
          </article>
        )}

        {/* Welcome State */}
        {!recipe && !loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-emerald-100">
            <div className="text-6xl mb-6">🥗</div>
            <h2 className="text-2xl font-bold text-emerald-800 mb-4">
              Welcome to NOURISH
            </h2>
            <p className="text-emerald-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Get personalized anti-inflammatory recipes tailored to your
              preferences. Just tell me what you'd like to cook, and I'll create
              a delicious, health-conscious recipe for you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => setInput("turmeric smoothie")}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-4 py-3 rounded-lg transition-colors border border-emerald-200 hover:border-emerald-300"
              >
                🥤 Turmeric Smoothie
              </button>
              <button
                onClick={() => setInput("ginger salmon")}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-4 py-3 rounded-lg transition-colors border border-emerald-200 hover:border-emerald-300"
              >
                🐟 Ginger Salmon
              </button>
              <button
                onClick={() => setInput("quinoa salad")}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-4 py-3 rounded-lg transition-colors border border-emerald-200 hover:border-emerald-300"
              >
                🥗 Quinoa Salad
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-emerald-600 text-sm">
        Powered by AI • Recipes for wellness
      </footer>
    </div>
  );
}
