import { useState, useEffect } from "react";
import { GradientBackground } from "@/components/ui/gradient-background";
import { GradientCard } from "@/components/ui/gradient-card";
import { CronogramaForm } from "@/components/cronograma/cronograma-form";
import { CronogramaGenerator } from "@/components/cronograma/cronograma-generator";
import { CronogramaResults } from "@/components/cronograma/cronograma-results";
import { CronogramaPost, FormData } from "@/types/cronograma";
import { checkApiKey, callGeminiAPI, gerarPromptInteligente } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [cronogramaInput, setCronogramaInput] = useState("");
  const [currentCronograma, setCurrentCronograma] = useState<CronogramaPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setApiConfigured(checkApiKey());
  }, []);

  const handleFillCronograma = (formData: FormData, mesSelecionado: string) => {
    const prompt = gerarPromptInteligente(formData, mesSelecionado);
    setCronogramaInput(prompt);
    
    setTimeout(() => {
      const elemento = document.getElementById('cronograma-generator');
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    
    toast({
      title: "Sucesso! ✅",
      description: "Informações preenchidas! Agora clique em 'GERAR CRONOGRAMA INTELIGENTE'",
    });
  };

  const handleGenerate = async (prompt: string): Promise<CronogramaPost[]> => {
    setIsLoading(true);
    
    try {
      if (!checkApiKey()) {
        toast({
          title: "Erro de Configuração",
          description: "A chave da API do Gemini não foi encontrada. Verifique seu arquivo .env.",
          variant: "destructive",
        });
        setIsLoading(false);
        return [];
      }

      const aiResponse = await callGeminiAPI(prompt);
      
      let cronograma: CronogramaPost[];
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          cronograma = jsonData.cronograma || jsonData;
        } else {
          throw new Error('JSON não encontrado na resposta da API.');
        }
      } catch (parseError) {
        console.error('Erro ao processar a resposta da IA:', parseError);
        toast({
          title: "Erro",
          description: "A resposta da IA não estava no formato esperado. Tente novamente.",
          variant: "destructive",
        });
        setIsLoading(false);
        return [];
      }
      
      setCurrentCronograma(cronograma);
      
      setTimeout(() => {
        const elemento = document.getElementById('cronograma-results');
        if (elemento) {
          elemento.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      return cronograma;
      
    } catch (error) {
      console.error('Erro ao chamar a API Gemini:', error);
      toast({
        title: "Erro na API",
        description: (error as Error).message || "Ocorreu um erro ao gerar o cronograma. Tente novamente.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const exportCronograma = () => {
    if (currentCronograma.length === 0) {
      toast({
        title: "Atenção",
        description: "Nenhum cronograma para exportar!",
        variant: "destructive"
      });
      return;
    }

    let exportText = "📅 CRONOGRAMA PERSONALIZADO (Criado com IA Gemini)\\n";
    exportText += "=" + "=".repeat(60) + "\\n\\n";

    currentCronograma.forEach((post, index) => {
      exportText += `📅 DIA ${post.dia} - POST ${index + 1}\\n`;
      exportText += `💡 TEMA: ${post.tema}\\n\\n`;
      exportText += `${post.conteudo}\\n\\n`;
      exportText += `⏰ Melhor horário: ${post.horario}\\n`;
      exportText += `🏷️ ${post.hashtags}\\n`;
      exportText += "\\n" + "-".repeat(60) + "\\n\\n";
    });

    exportText += "🤖 Cronograma criado com IA Gemini!\\n";
    exportText += "Esperamos que tenha um ótimo resultado! 🚀";

    try {
      const element = document.createElement('a');
      const file = new Blob([exportText], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = 'cronograma-ia-gemini.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: "Sucesso! 📱",
        description: "Cronograma exportado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: "Erro",
        description: "Erro ao exportar. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const novoCronograma = () => {
    setCronogramaInput("");
    setCurrentCronograma([]);
    setIsLoading(false);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <GradientCard className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-secondary" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] animate-float" />
          
          <div className="relative z-10 text-center py-16 px-8">
            <h1 className="text-5xl font-bold mb-4 text-white">
              🚀 Cronograma Inteligente
            </h1>
            <p className="text-xl text-white/95">
              Gerador automático de conteúdo para qualquer segmento
            </p>
            {apiConfigured && (
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-100 text-sm">
                🤖 IA Gemini Ativa
              </div>
            )}
          </div>
        </GradientCard>

        <div className="mb-8">
          <CronogramaForm onFillCronograma={handleFillCronograma} />
        </div>

        <div id="cronograma-generator" className="mb-8">
          <CronogramaGenerator 
            input={cronogramaInput}
            onInputChange={setCronogramaInput}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        <div id="cronograma-results">
          <CronogramaResults
            cronograma={currentCronograma}
            onExport={exportCronograma}
            onNewCronograma={novoCronograma}
          />
        </div>
      </div>
    </GradientBackground>
  );
};

export default Index;
