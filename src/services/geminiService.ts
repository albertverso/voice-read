interface ApiResponse {
  [x: string]: any;
  status: number;
  message?: string;
  data?: any; // Substitua `any` pelo tipo real esperado, se souber
}

export const sendImage = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://backend-gerador-texto-voz.onrender.com/api/gemini`, {
    method: 'POST',
    body: formData,
  });

  const responseData = await response.json();

  return {
    status: response.status,
    ...responseData,
  };
};