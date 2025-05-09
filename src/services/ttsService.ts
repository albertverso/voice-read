export async function gerarAudio(texto: string): Promise<Blob> {
    const response = await fetch("https://backend-gerador-texto-voz.onrender.com/api/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "text": texto }),
    });
  
    if (!response.ok) {
      throw new Error("Erro ao gerar áudio.");
    }
  
    const audioBlob = await response.blob();
    return audioBlob;
  }
  