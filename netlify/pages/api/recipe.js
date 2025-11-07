// pages/api/recipe.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY is not set" });
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert chef who creates detailed recipes made with real food, no preservatives, no refined sugars. Always format with HTML tags.",
            },
            {
              role: "user",
              content: `Create a healthy, anti-inflammatory recipe for: ${prompt}

Format with:
- <h2> for the recipe name
- <h3>Ingredients:</h3> followed by <ul> with <li> for each ingredient
- <h3>Instructions:</h3> followed by <ol> with <li> for each numbered step
- End with a health-focused quote said by health leaders in <p><em> tags`,
            },
          ],
          max_tokens: 1500,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API error:", data);
      return res
        .status(response.status)
        .json({ error: data.error?.message || "API error" });
    }

    const answer = data.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
