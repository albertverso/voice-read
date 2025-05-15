const API_URL = import.meta.env.VITE_API_URL;

export const extractTextFromUrl = async (url: string): Promise<string> => {
  const response = await fetch(`${API_URL}/api/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao extrair conteúdo: ${response.statusText}`);
  }

  const data = await response.json();
  return data; // depende da estrutura do seu backend
};