import Groq from "groq-sdk";

export default async function handler(req, res) {
  console.log("Function called - checking API key...");
  console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set!");
      return res.status(500).json({
        error: "API key not configured",
        answer: "⚠️ Server configuration error: API key missing",
      });
    }

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { prompt } = req.body;
    console.log("Prompt received:", prompt);

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a chef who creates anti-inflammatory recipes with clear instructions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("Recipe generated successfully");
    return res.status(200).json({
      answer: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("Recipe API Error:", err.message);
    console.error("Error details:", err);
    return res.status(500).json({
      error: "Failed to generate recipe",
      answer: `⚠️ Error: ${err.message}`,
    });
  }
}
