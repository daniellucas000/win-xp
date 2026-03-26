export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.GROQ_API_KEY) {
    throw createError({ statusCode: 500, message: 'GROQ_API_KEY não configurada no servidor' })
  }

  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
  })

  const { message, systemPrompt } = await readBody(event)

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 120,
      temperature: 0.7
    })
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('Erro Groq API:', data)
    const errorMessage = data?.error?.message || 'Erro desconhecido'
    return {
      reply: `Erro: ${errorMessage}`,
      error: errorMessage
    }
  }

  const reply = data?.choices?.[0]?.message?.content

  return {
    reply: reply || 'Sem resposta'
  }
})
