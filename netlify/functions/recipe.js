// Use CommonJS require instead of ES modules
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    console.log('Making request to Groq API for prompt:', prompt);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
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

    if (!response.ok) {
      throw new Error(`Groq API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const answer = data.choices[0].message.content;
    console.log('Successfully generated recipe');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer })
    };
  } catch (error) {
    console.error('Error in recipe function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate recipe: ' + error.message })
    };
  }
};
