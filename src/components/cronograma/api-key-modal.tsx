import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Key } from "lucide-react";
import { saveApiKey } from "@/lib/gemini";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyModal({ open, onOpenChange }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, digite uma chave válida.",
        variant: "destructive"
      });
      return;
    }

    saveApiKey(apiKey.trim());
    onOpenChange(false);
    setApiKey("");
    
    toast({
      title: "Sucesso! ✅",
      description: "Chave salva com sucesso! Agora você pode usar a IA.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configurar API Gemini
          </DialogTitle>
          <DialogDescription>
            Para usar a IA, você precisa de uma chave da API do Google Gemini (gratuita).
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">📋 Como obter sua chave:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>
                Acesse:{" "}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  Google AI Studio
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Clique em "Create API Key"</li>
              <li>Copie a chave gerada</li>
              <li>Cole aqui abaixo</li>
            </ol>
          </div>
          
          <Input 
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Sua chave da API Gemini"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              ✅ Salvar
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              ❌ Cancelar
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Sua chave é salva apenas no seu navegador e nunca compartilhada.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}