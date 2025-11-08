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

    console.log('Generating recipe for:', prompt);

    // Mock recipes - no external API calls
    const mockRecipes = {
      'anti-inflammatory berry smoothie': `## 🍴 Anti-Inflammatory Berry Smoothie

### 🛒 Ingredients
- 1 cup mixed berries (frozen)
- 1 cup spinach
- ½ banana
- 1 tbsp flax seeds
- 1 cup almond milk
- 1 tsp chia seeds

### 👩‍🍳 Instructions
1. Combine all ingredients in a blender
2. Blend until smooth and creamy
3. Add more liquid if needed for desired consistency
4. Pour into glass and enjoy immediately

### 🌟 Anti-Inflammatory Benefits
- Berries are rich in antioxidants that combat inflammation
- Spinach provides magnesium and anti-inflammatory flavonoids
- Flax seeds are high in omega-3 fatty acids
- Chia seeds offer fiber and additional omega-3s`,

      'golden turmeric latte': `## 🍴 Golden Turmeric Latte

### 🛒 Ingredients
- 1 cup almond milk (unsweetened)
- 1 tsp turmeric powder
- ½ tsp cinnamon
- ¼ tsp ginger powder
- 1 tbsp maple syrup
- Pinch of black pepper

### 👩‍🍳 Instructions
1. Heat almond milk in a small saucepan over medium heat
2. Whisk in turmeric, cinnamon, ginger, and black pepper
3. Simmer for 3-4 minutes, stirring frequently
4. Stir in maple syrup and whisk until frothy
5. Pour into mug and enjoy warm

### 🌟 Anti-Inflammatory Benefits
- Turmeric contains curcumin, a powerful anti-inflammatory compound
- Ginger helps reduce inflammation and soothe digestion
- Black pepper enhances curcumin absorption
- Cinnamon has antioxidant properties that fight inflammation`,

      'salmon avocado bowl': `## 🍴 Salmon Avocado Bowl

### 🛒 Ingredients
- 4 oz wild-caught salmon
- ½ avocado, sliced
- 1 cup quinoa, cooked
- 1 cup kale, chopped
- 1 tbsp olive oil
- Lemon wedges for serving

### 👩‍🍳 Instructions
1. Season salmon with salt and pepper
2. Pan-sear salmon in olive oil for 4-5 minutes per side
3. Massage kale with a bit of olive oil to soften
4. Assemble bowl with quinoa, kale, salmon, and avocado
5. Squeeze fresh lemon juice over top

### 🌟 Anti-Inflammatory Benefits
- Salmon is rich in omega-3 fatty acids that reduce inflammation
- Avocado provides healthy monounsaturated fats
- Quinoa is a complete protein with anti-inflammatory properties
- Kale is packed with antioxidants and vitamins`,

      'quinoa vegetable stir fry': `## 🍴 Quinoa Vegetable Stir Fry

### 🛒 Ingredients
- 1 cup quinoa, cooked
- 2 cups mixed vegetables (broccoli, bell peppers, carrots)
- 2 cloves garlic, minced
- 1 tbsp ginger, grated
- 2 tbsp tamari or coconut aminos
- 1 tbsp sesame oil

### 👩‍🍳 Instructions
1. Heat sesame oil in a large pan or wok
2. Sauté garlic and ginger until fragrant
3. Add vegetables and stir-fry until tender-crisp
4. Add cooked quinoa and tamari, stir to combine
5. Cook for 2-3 more minutes and serve

### 🌟 Anti-Inflammatory Benefits
- Quinoa provides complete protein and fiber
- Garlic and ginger have potent anti-inflammatory properties
- Colorful vegetables offer a range of antioxidants
- Healthy fats support reduced inflammation`,

      'berry smoothie': `## 🍴 Anti-Inflammatory Berry Smoothie

### 🛒 Ingredients
- 1 cup mixed berries (frozen)
- 1 cup spinach
- ½ banana
- 1 tbsp flax seeds
- 1 cup almond milk
- 1 tsp chia seeds

### 👩‍🍳 Instructions
1. Combine all ingredients in a blender
2. Blend until smooth and creamy
3. Add more liquid if needed for desired consistency
4. Pour into glass and enjoy immediately

### 🌟 Anti-Inflammatory Benefits
- Berries are rich in antioxidants that combat inflammation
- Spinach provides magnesium and anti-inflammatory flavonoids
- Flax seeds are high in omega-3 fatty acids
- Chia seeds offer fiber and additional omega-3s`,

      'turmeric latte': `## 🍴 Golden Turmeric Latte

### 🛒 Ingredients
- 1 cup almond milk (unsweetened)
- 1 tsp turmeric powder
- ½ tsp cinnamon
- ¼ tsp ginger powder
- 1 tbsp maple syrup
- Pinch of black pepper

### 👩‍🍳 Instructions
1. Heat almond milk in a small saucepan over medium heat
2. Whisk in turmeric, cinnamon, ginger, and black pepper
3. Simmer for 3-4 minutes, stirring frequently
4. Stir in maple syrup and whisk until frothy
5. Pour into mug and enjoy warm

### 🌟 Anti-Inflammatory Benefits
- Turmeric contains curcumin, a powerful anti-inflammatory compound
- Ginger helps reduce inflammation and soothe digestion
- Black pepper enhances curcumin absorption
- Cinnamon has antioxidant properties that fight inflammation`
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowercasePrompt = prompt.toLowerCase();
    let answer;

    // Find matching recipe
    for (const [key, recipe] of Object.entries(mockRecipes)) {
      if (lowercasePrompt.includes(key) || key.includes(lowercasePrompt)) {
        answer = recipe;
        break;
      }
    }

    // If no match found, create a generic recipe
    if (!answer) {
      answer = `## 🍴 Recipe for: ${prompt}

### 🛒 Ingredients
- Customize with your preferred anti-inflammatory ingredients
- Include leafy greens, healthy fats, and colorful vegetables
- Add herbs and spices like turmeric, ginger, or garlic

### 👩‍🍳 Instructions
1. Prepare your ingredients with anti-inflammatory principles in mind
2. Use healthy cooking methods like steaming, baking, or sautéing
3. Combine ingredients to maximize nutritional benefits
4. Enjoy your nourishing meal!

### 🌟 Anti-Inflammatory Benefits
- Focus on whole, unprocessed foods
- Include omega-3 rich ingredients when possible
- Use herbs and spices known for their anti-inflammatory properties
- Stay hydrated and listen to your body's needs`;
    }

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
      body: JSON.stringify({ error: 'Failed to generate recipe' })
    };
  }
};
