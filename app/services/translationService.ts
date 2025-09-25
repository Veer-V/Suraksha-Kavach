

interface TranslationRequest {
  inputs: string;
  parameters?: {
    src_lang?: string;
    tgt_lang?: string;
  };
}

interface STTRequest {
  inputs: string; // base64 audio
  parameters?: {
    return_timestamps?: string;
  };
}

interface OCRRequest {
  inputs: string; // base64 image
}

export const translateText = async (text: string, srcLang: string = 'auto', tgtLang: string): Promise<{ translated: string; detectedLang: string }> => {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcLang}&tl=${tgtLang}&dt=t&q=${encodeURIComponent(text)}`;
  console.log('Google Translate Request:', url);
  const response = await fetch(url);

  console.log('Google Translate Response status:', response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google Translate Error response:', errorText);
    throw new Error(`Translation failed: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Google Translate Response data:', data);
  const translated = data[0][0][0] || 'Translation failed - empty response';
  const detectedLang = data[2] || srcLang;
  return { translated, detectedLang };
};

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
  const response = await fetch('https://api-inference.huggingface.co/models/openai/whisper-large-v3', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: audioBase64 }),
  });

  if (!response.ok) {
    throw new Error(`STT failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.text || 'Transcription failed';
};

export const extractTextFromImage = async (imageBase64: string): Promise<string> => {
  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      'apikey': process.env.OCR_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      base64Image: `data:image/jpeg;base64,${imageBase64}`,
      language: 'eng',
      isOverlayRequired: false,
      isCreateSearchablePdf: false,
      isSearchablePdfHideTextLayer: false,
      scale: true,
      isTable: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OCR Error response:', errorText);
    throw new Error(`OCR failed: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('OCR Response data:', data);
  return data.ParsedResults[0]?.ParsedText || 'OCR failed - no text detected';
};
