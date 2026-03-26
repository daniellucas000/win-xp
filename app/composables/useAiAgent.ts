export const useAiAgent = () => {
  async function sendMessage(message: string, prompt: string) {
    const res = await $fetch<{ reply: string }>('/api/chat', {
      method: 'POST',
      body: {
        message,
        systemPrompt: prompt
      }
    })

    return res.reply
  }

  return { sendMessage }
}
