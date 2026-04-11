export default defineEventHandler(async (event) => {
  const { q } = getQuery(event);

  if (!q || typeof q !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Query obrigatória',
    });
  }

  const res = await fetch(
    `https://win-search.danielluccas000.workers.dev/?q=${encodeURIComponent(q)}`
  );

  return await res.json();
});
