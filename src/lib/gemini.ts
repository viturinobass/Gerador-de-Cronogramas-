import { CronogramaPost } from "@/types/cronograma";

export interface GeminiConfig {
  apiUrl: string;
  apiKey: string;
  initialized: boolean;
}

const GEMINI_CONFIG: GeminiConfig = {
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
  apiKey: '',
  initialized: false
};

export function checkApiKey(): boolean {
  const savedKey = localStorage.getItem('gemini_api_key');
  if (savedKey) {
    GEMINI_CONFIG.apiKey = savedKey;
    GEMINI_CONFIG.initialized = true;
    return true;
  }
  return false;
}

export function saveApiKey(key: string): void {
  localStorage.setItem('gemini_api_key', key);
  GEMINI_CONFIG.apiKey = key;
  GEMINI_CONFIG.initialized = true;
}

export function removeApiKey(): void {
  localStorage.removeItem('gemini_api_key');
  GEMINI_CONFIG.apiKey = '';
  GEMINI_CONFIG.initialized = false;
}

export async function callGeminiAPI(prompt: string): Promise<string> {
  if (!GEMINI_CONFIG.initialized) {
    throw new Error('API não configurada');
  }

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    }
  };

  const response = await fetch(`${GEMINI_CONFIG.apiUrl}?key=${GEMINI_CONFIG.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Erro da API: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  if (data.candidates && data.candidates[0] && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  } else {
    throw new Error('Resposta inesperada da API');
  }
}

export function gerarPromptInteligente(input: string): string {
  return `
Você é um especialista em marketing digital e criação de conteúdo para redes sociais. Sua tarefa é criar um cronograma mensal de postagens personalizado e profissional.

SOLICITAÇÃO DO USUÁRIO:
"${input}"

INSTRUÇÕES:
1. Analise o segmento do negócio mencionado
2. Identifique quantas postagens foram solicitadas (se não especificado, use 15 postagens)
3. Crie um cronograma com postagens distribuídas ao longo do mês
4. Para cada postagem, inclua:
   - Dia sugerido do mês (1-30)
   - Texto da postagem (atrativo, com emojis e call-to-action)
   - Melhor horário para postar
   - Hashtags relevantes do segmento

FORMATO DE RESPOSTA (JSON):
{
  "cronograma": [
    {
      "dia": 1,
      "tema": "Nome do tema da postagem",
      "conteudo": "Texto completo da postagem com emojis e call-to-action",
      "horario": "09:00 - 11:00 (Manhã)",
      "hashtags": "#hashtag1 #hashtag2 #hashtag3"
    }
  ]
}

DIRETRIZES:
- Use linguagem brasileira e emojis atrativos
- Varie os tipos de conteúdo (produtos, dicas, bastidores, promoções)
- Inclua call-to-actions efetivos
- Adapte hashtags para o segmento específico
- Distribua as postagens estrategicamente ao longo do mês
- Crie conteúdo engajador e autêntico

Responda APENAS com o JSON solicitado, sem texto adicional.
  `;
}