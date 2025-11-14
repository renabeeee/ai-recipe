import Groq from "groq-sdk";

export default async function handler(req, context) {
  console.log("Function called - checking API key...");
  console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);

  // Handle OPTIONS for CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not set!");
      return new Response(
        JSON.stringify({
          error: "API key not configured",
          answer: "⚠️ Server configuration error: API key missing",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const body = await req.json();
    const { prompt } = body;
    console.log("Prompt received:", prompt);

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a chef who creates anti-inflammatory recipes with clear instructions. You're concise and helpful, and kind.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    console.log("Recipe generated successfully");
    return new Response(
      JSON.stringify({
        answer: completion.choices[0].message.content,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Recipe API Error:", err.message);
    console.error("Error details:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to generate recipe",
        answer: `⚠️ Error: ${err.message}`,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
