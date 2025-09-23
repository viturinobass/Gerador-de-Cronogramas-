import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, Calendar, Clock, Hash } from "lucide-react";
import { CronogramaPost } from "@/types/cronograma";

interface CronogramaResultsProps {
  cronograma: CronogramaPost[];
  onExport: () => void;
  onNewCronograma: () => void;
}

export function CronogramaResults({ 
  cronograma, 
  onExport, 
  onNewCronograma 
}: CronogramaResultsProps) {
  if (!cronograma.length) return null;

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            📅 Seu Cronograma Personalizado
          </CardTitle>
          <p className="text-muted-foreground">
            Criado especialmente para o seu negócio
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {cronograma.map((post, index) => (
            <Card key={index} className="border-white/10 bg-background/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Dia {post.dia} do mês</span>
                    </div>
                    
                    <div className="text-base leading-relaxed">
                      {post.conteudo}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{post.horario}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <Hash className="w-4 h-4" />
                      <span className="break-all">{post.hashtags}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-card text-center border-white/20">
        <CardContent className="p-8">
          <h4 className="text-xl font-bold mb-4 text-white">
            🎉 Pronto! Seu cronograma está completo!
          </h4>
          <p className="text-white/90 leading-relaxed">
            Esperamos que este cronograma ajude muito no crescimento do seu negócio! 
            Se precisar de ajustes, alterações ou tiver sugestões de melhorias, 
            ficaremos felizes em ajudar. Seu sucesso é nossa prioridade! 💪✨
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={onExport}
          variant="success"
          size="lg"
          className="flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          📱 Exportar Cronograma
        </Button>
        <Button 
          onClick={onNewCronograma}
          variant="gradient"
          size="lg"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          🆕 Criar Novo Cronograma
        </Button>
      </div>
    </div>
  );
}