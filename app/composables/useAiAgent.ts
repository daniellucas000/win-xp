export const useAiAgent = () => {
  async function sendMessage(message: string, prompt: string) {
    const response = await $fetch<{ reply: string }>('/api/chat', {
      method: 'POST',
      body: {
        message,
        systemPrompt: prompt,
      },
    });

    return response.reply;
  }

  return { sendMessage };
};
