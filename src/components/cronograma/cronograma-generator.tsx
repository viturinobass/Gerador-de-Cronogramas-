import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { CronogramaPost } from "@/types/cronograma";
import { useToast } from "@/hooks/use-toast";

interface CronogramaGeneratorProps {
  input: string;
  onInputChange: (value: string) => void;
  onGenerate: (input: string) => Promise<CronogramaPost[]>;
  isLoading: boolean;
}

export function CronogramaGenerator({ 
  input, 
  onInputChange, 
  onGenerate, 
  isLoading 
}: CronogramaGeneratorProps) {
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, descreva seu cronograma!",
        variant: "destructive"
      });
      return;
    }

    try {
      await onGenerate(input.trim());
    } catch (error) {
      console.error('Erro ao gerar cronograma:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/80 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <Textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="DIGITE AQUI A SUA IDEIA DE CRONOGRAMA"
            className="min-h-[200px] text-lg resize-none bg-background/50 border-white/20"
          />
          <p className="text-sm text-muted-foreground mt-2">
            💡 Dica: Use Ctrl+Enter para gerar rapidamente
          </p>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          onClick={handleGenerate}
          disabled={isLoading}
          variant="hero"
          size="lg"
          className="px-12 py-6 text-lg font-bold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Gerando...
            </>
          ) : (
            "✨ GERAR CRONOGRAMA INTELIGENTE"
          )}
        </Button>
      </div>

      {isLoading && (
        <Card className="bg-card/80 backdrop-blur-sm border-white/20">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-lg">🤖 Nossa IA está criando seu cronograma personalizado...</p>
              <p className="text-sm opacity-80">Aguarde alguns segundos</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}