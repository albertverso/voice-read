import { getApiUrl } from "./apiService";

interface ApiResponse {
  [x: string]: any;
  status: number;
  message?: string;
  data?: any; // Substitua `any` pelo tipo real esperado, se souber
}

export const sendImage = async (file: File): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${getApiUrl}/api/gemini`, {
    method: 'POST',
    body: formData,
  });

  const responseData = await response.json();

  return {
    status: response.status,
    ...responseData,
  };
};