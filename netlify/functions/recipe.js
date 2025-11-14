import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  // CORS (optional)
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
    const { prompt } = req.body;

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile", // or "mixtral-8x7b-32768"
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

    return res.status(200).json({
      answer: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("Recipe API Error:", err);
    return res.status(500).json({ error: "Failed to generate recipe." });
  }
}
