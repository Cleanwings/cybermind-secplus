const base = process.env.USE_GEMINI === 'true'
  ? await askGemini(query, snippets)
  : await askChatGPT_raw(query, snippets)

Add Gemini helper and model switch
