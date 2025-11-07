import { useState } from "react";

export default function Home() {
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const input = document.getElementById("instructions");
    const userInstructions = input.value;

    if (!userInstructions.trim()) return;

    setLoading(true);
    setRecipe(`<div class="generating">Building your recipe...</div>`);

    try {
      const response = await fetch("/.netlify/functions/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a detailed anti-inflammatory recipe for: ${userInstructions}. Focus on ingredients known for their anti-inflammatory properties like turmeric, ginger, leafy greens, omega-3 rich foods, berries, and healthy fats. Explain the health benefits.`,
        }),
      });

      const data = await response.json();
      setRecipe(data.answer);
    } catch (err) {
      setRecipe("<p class='error'>Try again.</p>");
    } finally {
      setLoading(false);
      input.value = "";
    }
  }

  return (
    <>
      <div className="app">
        {/* Minimal Header */}
        <header className="header">
          <div className="header-content">
            <h1 className="brand">NOURISH</h1>
          </div>
        </header>

        {/* Hero - Direct and Bold */}
        <section className="hero">
          <div className="hero-content">
            <h2 className="hero-title">
              DO HARD THINGS.
              <br />
              EAT REAL FOOD.
            </h2>
            <p className="hero-text">
              Anti-inflammatory recipes crafted to fuel your body and mind.
              <br />
              This is for anyone ready to improve their gut health.
            </p>
          </div>
        </section>

        {/* Generator - Clean and Functional */}
        <section className="generator">
          <div className="gen-content">
            <input
              id="instructions"
              type="text"
              placeholder="What are you making?"
              className="input"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleSubmit();
                }
              }}
            />
            <button onClick={handleSubmit} disabled={loading} className="btn">
              {loading ? "BUILDING..." : "GO"}
            </button>
          </div>

          {/* Quick Start Examples */}
          {!recipe && (
            <div className="examples">
              <p className="examples-label">QUICK START:</p>
              <div className="example-grid">
                <button
                  className="example-btn"
                  onClick={() => {
                    document.getElementById("instructions").value =
                      "golden turmeric latte";
                    handleSubmit();
                  }}
                  disabled={loading}
                >
                  Golden Turmeric Latte
                </button>
                <button
                  className="example-btn"
                  onClick={() => {
                    document.getElementById("instructions").value =
                      "salmon and avocado bowl";
                    handleSubmit();
                  }}
                  disabled={loading}
                >
                  Salmon & Avocado Bowl
                </button>
                <button
                  className="example-btn"
                  onClick={() => {
                    document.getElementById("instructions").value =
                      "berry smoothie with ginger";
                    handleSubmit();
                  }}
                  disabled={loading}
                >
                  Berry Ginger Smoothie
                </button>
                <button
                  className="example-btn"
                  onClick={() => {
                    document.getElementById("instructions").value =
                      "leafy green salad with walnuts";
                    handleSubmit();
                  }}
                  disabled={loading}
                >
                  Leafy Green Salad
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Recipe Display */}
        {recipe && (
          <section className="result">
            <div
              dangerouslySetInnerHTML={{ __html: recipe }}
              className="recipe"
            />
          </section>
        )}

        {/* Story - Raw and Honest */}
        <section className="story">
          <div className="story-content">
            <div className="divider"></div>
            <p className="story-text">
              Living with Raynaud's taught me that your body keeps score.
            </p>
            <p className="story-text">
              Everything you put in matters. Every choice compounds.
            </p>
            <p className="story-text">
              Anti-inflammatory eating isn't a trend. It's the foundation.
            </p>
            <p className="story-text bold">
              Start today. Your future self will thank you.
            </p>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="footer">
          <p>Built with purpose.</p>
        </footer>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app {
          min-height: 100vh;
          background: #0a0a0a;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue",
            Arial, sans-serif;
        }

        /* Header - Ultra Minimal */
        .header {
          padding: 2rem 1.5rem;
          border-bottom: 1px solid #1a1a1a;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .brand {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: 4px;
          color: #ffffff;
        }

        /* Hero - Bold and Direct */
        .hero {
          padding: 8rem 2rem 6rem;
          text-align: center;
          border-bottom: 1px solid #1a1a1a;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 4.5rem;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -2px;
          margin-bottom: 2rem;
          color: #ffffff;
        }

        .hero-text {
          font-size: 1.25rem;
          line-height: 1.8;
          color: #888888;
          font-weight: 400;
        }

        /* Generator - Clean Functionality */
        .generator {
          padding: 6rem 2rem;
          background: #0f0f0f;
        }

        .gen-content {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          gap: 1rem;
        }

        .input {
          flex: 1;
          padding: 1.5rem;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          color: #ffffff;
          font-size: 1.1rem;
          font-family: inherit;
          transition: all 0.2s;
        }

        .input:focus {
          outline: none;
          border-color: #ffffff;
          background: #0a0a0a;
        }

        .input::placeholder {
          color: #555555;
        }

        .btn {
          padding: 1.5rem 3rem;
          background: #ffffff;
          color: #0a0a0a;
          border: none;
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 2px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
        }

        .btn:hover:not(:disabled) {
          background: #e0e0e0;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Examples */
        .examples {
          max-width: 700px;
          margin: 3rem auto 0;
          text-align: center;
        }

        .examples-label {
          font-size: 0.85rem;
          letter-spacing: 2px;
          color: #555555;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .example-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .example-btn {
          padding: 1rem 1.5rem;
          background: transparent;
          border: 1px solid #2a2a2a;
          color: #888888;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          text-align: center;
        }

        .example-btn:hover:not(:disabled) {
          border-color: #ffffff;
          color: #ffffff;
          background: #1a1a1a;
        }

        .example-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        /* Recipe Result */
        .result {
          padding: 6rem 2rem;
          background: #0a0a0a;
          animation: fadeIn 0.4s ease;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .recipe {
          max-width: 800px;
          margin: 0 auto;
          background: #0f0f0f;
          padding: 4rem;
          border: 1px solid #1a1a1a;
        }

        :global(.recipe h2) {
          color: #ffffff;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          font-weight: 900;
          letter-spacing: -1px;
          text-transform: uppercase;
        }

        :global(.recipe h3) {
          color: #ffffff;
          font-size: 1.3rem;
          margin: 3rem 0 1.5rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        :global(.recipe ul),
        :global(.recipe ol) {
          margin-left: 0;
          padding-left: 1.5rem;
          margin-bottom: 2rem;
          list-style-position: outside;
        }

        :global(.recipe li) {
          margin-bottom: 1rem;
          color: #cccccc;
          line-height: 1.8;
          font-size: 1.05rem;
        }

        :global(.recipe p) {
          color: #cccccc;
          line-height: 1.9;
          margin-bottom: 1.5rem;
          font-size: 1.05rem;
        }

        :global(.recipe em) {
          display: block;
          margin-top: 3rem;
          padding-top: 3rem;
          border-top: 1px solid #1a1a1a;
          font-style: italic;
          color: #888888;
          text-align: center;
          font-size: 1.1rem;
        }

        :global(.generating) {
          color: #888888;
          font-size: 1.2rem;
          text-align: center;
          padding: 3rem;
          letter-spacing: 1px;
        }

        :global(.error) {
          color: #ff4444;
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
          letter-spacing: 1px;
        }

        /* Story Section - Raw Truth */
        .story {
          padding: 8rem 2rem;
          background: #0a0a0a;
          border-top: 1px solid #1a1a1a;
        }

        .story-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .divider {
          width: 60px;
          height: 3px;
          background: #ffffff;
          margin: 0 auto 4rem;
        }

        .story-text {
          font-size: 1.4rem;
          line-height: 2;
          color: #cccccc;
          margin-bottom: 2rem;
          text-align: center;
          font-weight: 300;
        }

        .story-text.bold {
          font-weight: 700;
          color: #ffffff;
          margin-top: 3rem;
          font-size: 1.5rem;
        }

        /* Footer */
        .footer {
          padding: 3rem 2rem;
          text-align: center;
          border-top: 1px solid #1a1a1a;
          color: #555555;
          font-size: 0.95rem;
          letter-spacing: 1px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.8rem;
          }

          .hero-text {
            font-size: 1.1rem;
          }

          .gen-content {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }

          .example-grid {
            grid-template-columns: 1fr;
          }

          .recipe {
            padding: 2.5rem;
          }

          :global(.recipe h2) {
            font-size: 2rem;
          }

          .story-text {
            font-size: 1.2rem;
          }

          .story-text.bold {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  );
}
