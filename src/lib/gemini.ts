import { CronogramaPost, FormData } from "@/types/cronograma";

export interface GeminiConfig {
  apiUrl: string;
  apiKey: string;
  initialized: boolean;
}

const GEMINI_CONFIG: GeminiConfig = {
  apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
  apiKey: process.env.VITE_GEMINI_API_KEY || '',
  initialized: !!process.env.VITE_GEMINI_API_KEY
};

export function checkApiKey(): boolean {
  return GEMINI_CONFIG.initialized;
}

export async function callGeminiAPI(prompt: string): Promise<string> {
  if (!GEMINI_CONFIG.initialized) {
    throw new Error('API não configurada. Verifique seu arquivo .env.');
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
      maxOutputTokens: 4096, // Aumentado para acomodar cronogramas maiores
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
    const text = data.candidates[0].content.parts[0].text;
    // Extração mais robusta do JSON
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1];
    } 
    // Fallback para caso o JSON não esteja no bloco de código
    const plainJsonMatch = text.match(/\{[\s\S]*\}/);
    if (plainJsonMatch) {
      return plainJsonMatch[0];
    }
    return text; // Retorna o texto se nenhum JSON for encontrado
  } else if (data.promptFeedback && data.promptFeedback.blockReason) {
    // Tratar casos de bloqueio de conteúdo
    throw new Error(`A solicitação foi bloqueada pela API: ${data.promptFeedback.blockReason.reason}`);
  }else {
    throw new Error('Resposta inesperada ou vazia da API');
  }
}

export function gerarPromptInteligente(formData: FormData, mesSelecionado: string): string {
  const diasSemanaSelecionados = Object.entries(formData.diasSemana)
    .filter(([, selecionado]) => selecionado)
    .map(([dia]) => dia)
    .join(', ');

  const ano = 2025; // Definindo o ano fixo para o calendário

  const prompt = `
    Você é um especialista em marketing digital e criação de conteúdo para redes sociais. Sua tarefa é criar um cronograma mensal de postagens para o Instagram, personalizado e profissional, com base nas informações fornecidas.

    **Informações do Cliente:**
    - **Nome da Empresa/Perfil:** ${formData.nomeEmpresa}
    - **Ramo do Negócio:** ${formData.ramoNegocio}
    - **Perfil no Instagram:** ${formData.instagramAtivo}
    - **Público-Alvo:** ${formData.publicoAlvo}
    - **Percepção de Marca Desejada:** ${formData.percepcaoMarca}
    - **Principais Objetivos:** ${Object.entries(formData.objetivos).filter(([, v]) => v).map(([k]) => k).join(', ')}
    - **Identidade Visual:** ${formData.estiloVisual}
    - **Perfis de Inspiração:** ${formData.perfilInspiracao}
    - **Tipos de Conteúdo Desejados:** ${Object.entries(formData.conteudo).filter(([, v]) => v).map(([k]) => k).join(', ')}
    - **Materiais Disponíveis:** ${Object.entries(formData.materiais).filter(([, v]) => v).map(([k]) => k).join(', ')}
    - **Frequência Semanal de Postagens:** ${formData.frequenciaSemanal}
    - **Dias da Semana Preferenciais:** ${diasSemanaSelecionados || 'Não especificado'}
    - **Horários Preferenciais:** ${formData.horariosPreferencia}
    - **Formatos Extras:** ${Object.entries(formData.extras).filter(([, v]) => v).map(([k]) => k).join(', ')}
    - **Datas Importantes:** ${formData.datasImportantes}
    - **Formato de Entrega:** ${Object.entries(formData.formato).filter(([, v]) => v).map(([k]) => k).join(', ')}
    - **Detalhes Adicionais:** ${formData.detalhesExtras}
    - **Ano do Cronograma:** ${ano}
    - **Mês do Cronograma:** ${mesSelecionado}

    **INSTRUÇÕES DETALHADAS E OBRIGATÓRIAS:**
    1.  **Análise Estratégica:** Analise TODAS as informações do cliente para entender profundamente o negócio, o público e os objetivos.
    2.  **Calendário Preciso (Ano ${ano}):** Crie o cronograma para o mês de **${mesSelecionado}** do ano de **${ano}**. As postagens devem ser agendadas **exclusivamente** nos dias da semana selecionados (${diasSemanaSelecionados}). É fundamental que a data e o dia da semana correspondam corretamente ao calendário de ${ano}. Por exemplo, se 01/${mesSelecionado}/${ano} for uma quarta-feira, a postagem deve refletir isso.
    3.  **Formato da Data:** Use o formato **"DD/MM - Dia da Semana"** para o campo "dia".
    4.  **Quantidade de Postagens:** O número de postagens deve ser consistente com a frequência semanal solicitada (${formData.frequenciaSemanal} vezes por semana).
    5.  **Conteúdo Criativo e Relevante:** Desenvolva temas e textos de postagem que sejam autênticos, engajadores e alinhados com a marca e os objetivos do cliente.
    6.  **Estrutura da Postagem:** Para CADA postagem, defina OBRIGATORIAMENTE:
        *   **dia:** A data exata da postagem no formato "DD/MM - Dia da Semana", respeitando o calendário de ${ano}.
        *   **tema:** Um título curto e chamativo para a postagem.
        *   **conteudo:** O texto completo da postagem, incluindo uma chamada para ação (CTA) clara e emojis que façam sentido com o conteúdo.
        *   **horario:** O melhor horário para postar, considerando o público e os horários de preferência.
        *   **hashtags:** Uma seleção de 5 a 10 hashtags relevantes para o negócio e o conteúdo da postagem.

    **FORMATO DE RESPOSTA OBRIGATÓRIO (JSON):**
    A sua resposta deve ser **APENAS** um objeto JSON válido, sem nenhum texto, comentário ou formatação adicional. O JSON deve seguir RIGOROSAMENTE a estrutura abaixo:

    \`\`\`json
    {
      "cronograma": [
        {
          "dia": "DD/MM - Dia da Semana",
          "tema": "Título Criativo da Postagem",
          "conteudo": "Texto completo e envolvente da sua postagem aqui. Use emojis e termine com uma chamada para ação forte!",
          "horario": "18:00 - 20:00 (Noite)",
          "hashtags": "#marketingdigital #conteudodevalor #suamarca #dicas #negocios"
        }
      ]
    }
    \`\`\`

    **DIRETRIZES ADICIONAIS:**
    -   **Linguagem:** Use português do Brasil.
    -   **Variedade:** Alterne entre os diferentes tipos de conteúdo solicitados (vendas, dicas, bastidores, etc.).
    -   **Autenticidade:** Crie conteúdo que soe genuíno e conecte-se com o público.
    -   **Consistência:** Mantenha o tom de voz e a identidade visual da marca em todas as postagens.

    Agora, gere o cronograma de postagens em formato JSON para ${mesSelecionado} de ${ano} conforme especificado.
    `;
    return prompt;
}
