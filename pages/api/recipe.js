export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ API key not configured' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // or 'mixtral-8x7b-32768' for better quality
        messages: [
          {
            role: 'system',
            content: `You are a nutritionist and chef specializing in anti-inflammatory recipes. 
            Create detailed, easy-to-follow recipes with clear formatting using markdown. 
            Always include these sections: Recipe Name, Ingredients, Instructions, and Anti-Inflammatory Benefits.`
          },
          {
            role: 'user',
            content: `Create an anti-inflammatory recipe for: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const answer = data.choices[0].message.content;
    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error generating recipe:', error);
    res.status(500).json({ error: 'Failed to generate recipe: ' + error.message });
  }
}
