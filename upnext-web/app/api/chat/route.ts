const geminiResponse = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ 
        role: "user", 
        parts: [{ text: `You are a high-end noir tactical strategist. ${text}` }] 
      }]
    })
  }
);