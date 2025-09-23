import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { GradientBackground } from "@/components/ui/gradient-background";
import { GradientCard } from "@/components/ui/gradient-card";
import { CronogramaForm } from "@/components/cronograma/cronograma-form";
import { CronogramaGenerator } from "@/components/cronograma/cronograma-generator";
import { CronogramaResults } from "@/components/cronograma/cronograma-results";
import { ApiKeyModal } from "@/components/cronograma/api-key-modal";
import { CronogramaPost, FormData } from "@/types/cronograma";
import { checkApiKey, callGeminiAPI, gerarPromptInteligente, removeApiKey } from "@/lib/gemini";
import { segmentDatabase } from "@/lib/segmentDatabase";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [cronogramaInput, setCronogramaInput] = useState("");
  const [currentCronograma, setCurrentCronograma] = useState<CronogramaPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setApiConfigured(checkApiKey());
  }, []);

  const gerarTextoDoFormulario = (formData: FormData): string => {
    let texto = '';

    if (formData.nomeEmpresa) {
      texto += `Empresa: ${formData.nomeEmpresa}. `;
    }

    if (formData.ramoNegocio) {
      texto += `Ramo: ${formData.ramoNegocio}. `;
    }

    if (formData.publicoAlvo) {
      texto += `Público-alvo: ${formData.publicoAlvo}. `;
    }

    // Objetivos
    const objetivos = [];
    if (formData.objetivos.venderMais) objetivos.push('vender mais');
    if (formData.objetivos.aumentarSeguidores) objetivos.push('aumentar seguidores');
    if (formData.objetivos.criarRelacionamento) objetivos.push('criar relacionamento');
    if (formData.objetivos.divulgarNovidades) objetivos.push('divulgar novidades');
    
    if (objetivos.length > 0) {
      texto += `Objetivos: ${objetivos.join(', ')}. `;
    }

    // Tipos de conteúdo
    const tiposConteudo = [];
    if (formData.conteudo.produtosServicos) tiposConteudo.push('produtos/serviços');
    if (formData.conteudo.promocoesDescontos) tiposConteudo.push('promoções');
    if (formData.conteudo.bastidores) tiposConteudo.push('bastidores');
    if (formData.conteudo.depoimentos) tiposConteudo.push('depoimentos');
    if (formData.conteudo.dicasCuriosidades) tiposConteudo.push('dicas e curiosidades');
    
    if (tiposConteudo.length > 0) {
      texto += `Tipos de conteúdo: ${tiposConteudo.join(', ')}. `;
    }

    if (formData.frequenciaSemanal) {
      texto += `Frequência: ${formData.frequenciaSemanal} vezes por semana. `;
    }

    if (formData.horariosPreferencia) {
      texto += `Horários: ${formData.horariosPreferencia}. `;
    }

    if (formData.datasImportantes) {
      texto += `Datas importantes: ${formData.datasImportantes}. `;
    }

    if (formData.detalhesExtras) {
      texto += `Observações: ${formData.detalhesExtras}.`;
    }

    return texto || 'Cronograma personalizado baseado nas informações do formulário.';
  };

  const processarSolicitacao = (input: string): CronogramaPost[] => {
    const inputLower = input.toLowerCase();
    let segmento = 'generico';
    let dadosSegmento = null;

    // Detectar número de postagens solicitadas
    const numeroMatch = input.match(/(\d+)\s*(post|postag)/i);
    const numPostagens = numeroMatch ? parseInt(numeroMatch[1]) : 15;

    // Detectar segmento
    if (inputLower.includes('odonto') || inputLower.includes('dent') || inputLower.includes('bucal')) {
      segmento = 'odontologia';
      dadosSegmento = segmentDatabase.odontologia;
    } else if (inputLower.includes('acade') || inputLower.includes('treino') || inputLower.includes('fitness') || inputLower.includes('muscula')) {
      segmento = 'academia';
      dadosSegmento = segmentDatabase.academia;
    } else if (inputLower.includes('restaurante') || inputLower.includes('gastrono') || inputLower.includes('comida') || inputLower.includes('prato')) {
      segmento = 'restaurante';
      dadosSegmento = segmentDatabase.restaurante;
    } else if (inputLower.includes('salao') || inputLower.includes('beleza') || inputLower.includes('cabelo') || inputLower.includes('corte')) {
      segmento = 'salao';
      dadosSegmento = segmentDatabase.salao;
    } else if (inputLower.includes('moda') || inputLower.includes('roupa') || inputLower.includes('fashion') || inputLower.includes('look')) {
      segmento = 'moda';
      dadosSegmento = segmentDatabase.moda;
    }

    return gerarCronogramaInteligente(numPostagens, dadosSegmento, segmento);
  };

  const gerarCronogramaInteligente = (numPostagens: number, dadosSegmento: any, segmento: string): CronogramaPost[] => {
    const cronograma: CronogramaPost[] = [];
    const diasDoMes = Array.from({length: 30}, (_, i) => i + 1);
    const horariosComerciais = [
      '09:00 - 11:00 (Manhã)',
      '12:00 - 14:00 (Horário de Almoço)',
      '15:00 - 17:00 (Tarde)',
      '18:00 - 20:00 (Final do dia)',
      '19:00 - 21:00 (Noite)'
    ];

    // Se temos dados específicos do segmento
    if (dadosSegmento) {
      for (let i = 0; i < numPostagens; i++) {
        const dia = diasDoMes[Math.floor(i * 30 / numPostagens)];
        const tema = dadosSegmento.temas[i % dadosSegmento.temas.length];
        const emoji = dadosSegmento.emojis[Math.floor(Math.random() * dadosSegmento.emojis.length)];
        const horario = horariosComerciais[Math.floor(Math.random() * horariosComerciais.length)];

        cronograma.push({
          dia: dia,
          tema: tema,
          conteudo: `${emoji} ${tema}! Descubra como isso pode transformar sua experiência conosco. Agende já sua consulta e veja a diferença! 🌟`,
          horario: horario,
          hashtags: dadosSegmento.hashtags
        });
      }
    } else {
      // Cronograma genérico
      const temasGenericos = [
        'Novidades e tendências do setor',
        'Dicas profissionais exclusivas',
        'Qualidade que faz a diferença',
        'Atendimento personalizado',
        'Resultados que surpreendem',
        'Inovação e tradição juntas',
        'Equipe especializada',
        'Promoções especiais',
        'Cases de sucesso',
        'Tecnologia de ponta',
        'Satisfação garantida',
        'Experiência única',
        'Soluções personalizadas',
        'Excelência em serviços',
        'Compromisso com você'
      ];

      for (let i = 0; i < numPostagens; i++) {
        const dia = diasDoMes[Math.floor(i * 30 / numPostagens)];
        const tema = temasGenericos[i % temasGenericos.length];
        const horario = horariosComerciais[Math.floor(Math.random() * horariosComerciais.length)];

        cronograma.push({
          dia: dia,
          tema: tema,
          conteudo: `✨ ${tema}! Venha conhecer nosso trabalho e se surpreenda com os resultados. Estamos aqui para você! 🚀`,
          horario: horario,
          hashtags: '#Qualidade #Profissionalismo #Atendimento #Resultados #Confianca #Excelencia'
        });
      }
    }

    return cronograma;
  };

  const handleFillCronograma = (formData: FormData) => {
    const textoGerado = gerarTextoDoFormulario(formData);
    setCronogramaInput(textoGerado);
    
    // Scroll suave para o campo de texto
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

  const handleGenerate = async (input: string): Promise<CronogramaPost[]> => {
    setIsLoading(true);
    
    try {
      // Verificar se API está configurada
      if (!checkApiKey()) {
        setShowApiModal(true);
        setIsLoading(false);
        return [];
      }

      // Tentar usar a API Gemini primeiro
      const prompt = gerarPromptInteligente(input);
      console.log('Chamando API Gemini...');
      
      const aiResponse = await callGeminiAPI(prompt);
      console.log('Resposta da API:', aiResponse);
      
      // Tentar fazer parse do JSON
      let cronograma: CronogramaPost[];
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          cronograma = jsonData.cronograma || jsonData;
        } else {
          throw new Error('JSON não encontrado na resposta');
        }
      } catch (parseError) {
        console.warn('Erro ao fazer parse do JSON, usando fallback:', parseError);
        cronograma = processarSolicitacao(input);
      }
      
      setCurrentCronograma(cronograma);
      setIsLoading(false);
      
      // Scroll para os resultados
      setTimeout(() => {
        const elemento = document.getElementById('cronograma-results');
        if (elemento) {
          elemento.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      return cronograma;
      
    } catch (error) {
      console.error('Erro na API, usando sistema local:', error);
      
      // Fallback para sistema local em caso de erro
      try {
        const cronograma = processarSolicitacao(input);
        setCurrentCronograma(cronograma);
        setIsLoading(false);
        
        // Avisar sobre o fallback
        toast({
          title: "Sistema Local",
          description: "⚠️ Usando sistema local. Verifique sua chave da API para usar a IA completa.",
        });
        
        return cronograma;
        
      } catch (fallbackError) {
        console.error('Erro no fallback:', fallbackError);
        setIsLoading(false);
        throw new Error('Erro ao gerar cronograma. Tente novamente.');
      }
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

    let exportText = "📅 CRONOGRAMA PERSONALIZADO (Criado com IA Gemini)\n";
    exportText += "=" + "=".repeat(60) + "\n\n";

    currentCronograma.forEach((post, index) => {
      exportText += `📅 DIA ${post.dia} - POST ${index + 1}\n`;
      exportText += `${post.conteudo}\n`;
      exportText += `⏰ Melhor horário: ${post.horario}\n`;
      exportText += `🏷️ ${post.hashtags}\n`;
      exportText += "\n" + "-".repeat(60) + "\n\n";
    });

    exportText += "🤖 Cronograma criado com IA Gemini!\n";
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
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfigureApi = () => {
    removeApiKey();
    setApiConfigured(false);
    setShowApiModal(true);
  };

  return (
    <GradientBackground>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <GradientCard className="relative mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-secondary" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] animate-float" />
          
          {/* API Config Button */}
          <Button
            onClick={handleConfigureApi}
            variant="outline"
            size="sm"
            className="absolute top-4 right-4 z-20 bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Settings className="w-4 h-4 mr-2" />
            🔑 Configurar IA
          </Button>
          
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
            {!apiConfigured && (
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-100 text-sm">
                ⚠️ Configure a IA para melhor resultado
              </div>
            )}
          </div>
        </GradientCard>

        {/* Formulário de Configuração */}
        <div className="mb-8">
          <CronogramaForm onFillCronograma={handleFillCronograma} />
        </div>

        {/* Gerador Principal */}
        <div id="cronograma-generator" className="mb-8">
          <CronogramaGenerator 
            input={cronogramaInput}
            onInputChange={setCronogramaInput}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
        </div>

        {/* Resultados */}
        <div id="cronograma-results">
          <CronogramaResults
            cronograma={currentCronograma}
            onExport={exportCronograma}
            onNewCronograma={novoCronograma}
          />
        </div>

        {/* Modal de Configuração da API */}
        <ApiKeyModal 
          open={showApiModal} 
          onOpenChange={(open) => {
            setShowApiModal(open);
            if (!open) {
              setApiConfigured(checkApiKey());
            }
          }} 
        />
      </div>
    </GradientBackground>
  );
};

export default Index;
