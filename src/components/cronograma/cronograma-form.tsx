import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormData } from "@/types/cronograma";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CronogramaFormProps {
  onFillCronograma: (formData: FormData, mesSelecionado: string) => void;
}

export function CronogramaForm({ onFillCronograma }: CronogramaFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nomeEmpresa: "",
    ramoNegocio: "",
    instagramAtivo: "",
    publicoAlvo: "",
    percepcaoMarca: "",
    objetivos: {
      venderMais: false,
      aumentarSeguidores: false,
      criarRelacionamento: false,
      divulgarNovidades: false,
    },
    estiloVisual: "",
    perfilInspiracao: "",
    conteudo: {
      produtosServicos: false,
      promocoesDescontos: false,
      bastidores: false,
      depoimentos: false,
      dicasCuriosidades: false,
    },
    materiais: {
      temFotos: false,
      precisaFotos: false,
    },
    frequenciaSemanal: "",
    horariosPreferencia: "",
    diasSemana: {
      segunda: false,
      terca: false,
      quarta: false,
      quinta: false,
      sexta: false,
      sabado: false,
      domingo: false,
    },
    extras: {
      incluirStories: false,
      incluirReels: false,
    },
    datasImportantes: "",
    formato: {
      formatoTexto: false,
      formatoPlanilha: false,
    },
    detalhesExtras: "",
  });

  const [mesSelecionado, setMesSelecionado] = useState<string>("Janeiro");

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (section: keyof FormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...(prev[section] as any), [field]: value }
    }));
  };

  const handleSubmit = () => {
    onFillCronograma(formData, mesSelecionado);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          📋 Configure Seu Cronograma
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Preencha as informações abaixo para criar um cronograma ainda mais personalizado
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* 1. Sobre a marca */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">1. Sobre a sua marca</h3>
          
          <div className="space-y-2">
            <Label>Qual é o nome da sua empresa ou perfil no Instagram?</Label>
            <Input 
              placeholder="Digite o nome da sua empresa"
              value={formData.nomeEmpresa}
              onChange={(e) => updateField('nomeEmpresa', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Qual é o ramo do seu negócio?</Label>
            <Input 
              placeholder="Ex: pizzaria, moda, estética, tatuagem, bebidas"
              value={formData.ramoNegocio}
              onChange={(e) => updateField('ramoNegocio', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Você já tem Instagram ativo? Se sim, qual o @?</Label>
            <Input 
              placeholder="@seuinstagram"
              value={formData.instagramAtivo}
              onChange={(e) => updateField('instagramAtivo', e.target.value)}
            />
          </div>
        </div>

        {/* 2. Público-alvo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">2. Público-alvo</h3>
          
          <div className="space-y-2">
            <Label>Quem são as pessoas que você quer atingir?</Label>
            <Textarea 
              placeholder="Ex: Mulheres de 25-45 anos, interessadas em moda, região de São Paulo"
              value={formData.publicoAlvo}
              onChange={(e) => updateField('publicoAlvo', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Como você gostaria que essas pessoas enxergassem a sua marca?</Label>
            <Textarea 
              placeholder="Ex: Confiável, moderna, acessível, exclusiva"
              value={formData.percepcaoMarca}
              onChange={(e) => updateField('percepcaoMarca', e.target.value)}
            />
          </div>
        </div>

        {/* 3. Objetivos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">3. Objetivos das postagens</h3>
          <Label>O que você mais deseja com o Instagram?</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'venderMais', label: 'Vender mais' },
              { key: 'aumentarSeguidores', label: 'Aumentar seguidores' },
              { key: 'criarRelacionamento', label: 'Criar relacionamento' },
              { key: 'divulgarNovidades', label: 'Divulgar novidades/promoções' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox 
                  id={key}
                  checked={formData.objetivos[key as keyof typeof formData.objetivos]}
                  onCheckedChange={(checked) => 
                    updateNestedField('objetivos', key, checked)
                  }
                />
                <Label htmlFor={key}>{label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Identidade e estilo */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">4. Identidade e estilo</h3>
          
          <div className="space-y-2">
            <Label>Tem alguma cor, fonte ou estilo visual que precisa ser seguido?</Label>
            <Textarea 
              placeholder="Ex: Cores azul e branco, estilo minimalista"
              value={formData.estiloVisual}
              onChange={(e) => updateField('estiloVisual', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Algum concorrente ou perfil que você admira?</Label>
            <Input 
              placeholder="@perfil_inspiracao"
              value={formData.perfilInspiracao}
              onChange={(e) => updateField('perfilInspiracao', e.target.value)}
            />
          </div>
        </div>

        {/* 5. Conteúdo das postagens */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">5. Conteúdo das postagens</h3>
          <Label>Que tipo de conteúdo você gostaria de postar mais?</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'produtosServicos', label: 'Produtos/serviços' },
              { key: 'promocoesDescontos', label: 'Promoções e descontos' },
              { key: 'bastidores', label: 'Bastidores e dia a dia' },
              { key: 'depoimentos', label: 'Depoimentos/clientes' },
              { key: 'dicasCuriosidades', label: 'Dicas e curiosidades' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox 
                  id={key}
                  checked={formData.conteudo[key as keyof typeof formData.conteudo]}
                  onCheckedChange={(checked) => 
                    updateNestedField('conteudo', key, checked)
                  }
                />
                <Label htmlFor={key}>{label}</Label>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Label>Você tem fotos ou materiais próprios para usar?</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="temFotos"
                  checked={formData.materiais.temFotos}
                  onCheckedChange={(checked) => 
                    updateNestedField('materiais', 'temFotos', checked)
                  }
                />
                <Label htmlFor="temFotos">Sim, tenho materiais próprios</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="precisaFotos"
                  checked={formData.materiais.precisaFotos}
                  onCheckedChange={(checked) => 
                    updateNestedField('materiais', 'precisaFotos', checked)
                  }
                />
                <Label htmlFor="precisaFotos">Preciso de sugestões de conteúdo visual</Label>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Frequência e horários */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">6. Frequência e horários</h3>
          
          <div className="space-y-2">
            <Label>Quantas vezes por semana gostaria de postar?</Label>
            <Input 
              type="number"
              placeholder="Ex: 3"
              min="1"
              max="7"
              value={formData.frequenciaSemanal}
              onChange={(e) => updateField('frequenciaSemanal', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Quais dias da semana prefere postar?</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'segunda', label: 'Segunda' },
                { key: 'terca', label: 'Terça' },
                { key: 'quarta', label: 'Quarta' },
                { key: 'quinta', label: 'Quinta' },
                { key: 'sexta', label: 'Sexta' },
                { key: 'sabado', label: 'Sábado' },
                { key: 'domingo', label: 'Domingo' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox 
                    id={key}
                    checked={formData.diasSemana[key as keyof typeof formData.diasSemana]}
                    onCheckedChange={(checked) => 
                      updateNestedField('diasSemana', key, checked)
                    }
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tem horários específicos que prefere?</Label>
            <Textarea 
              placeholder="Ex: Terças e quintas às 18h"
              value={formData.horariosPreferencia}
              onChange={(e) => updateField('horariosPreferencia', e.target.value)}
            />
          </div>
        </div>

        {/* 7. Mês do Cronograma */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">7. Mês do Cronograma</h3>
          <div className="space-y-2">
            <Label>Para qual mês você deseja o cronograma?</Label>
            <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o mês" />
              </SelectTrigger>
              <SelectContent>
                {meses.map(mes => (
                  <SelectItem key={mes} value={mes}>{mes}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 8. Extras */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">8. Extras</h3>
          
          <div className="space-y-2">
            <Label>Você gostaria de incluir Stories e Reels além dos posts?</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirStories"
                  checked={formData.extras.incluirStories}
                  onCheckedChange={(checked) => 
                    updateNestedField('extras', 'incluirStories', checked)
                  }
                />
                <Label htmlFor="incluirStories">Incluir Stories</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="incluirReels"
                  checked={formData.extras.incluirReels}
                  onCheckedChange={(checked) => 
                    updateNestedField('extras', 'incluirReels', checked)
                  }
                />
                <Label htmlFor="incluirReels">Incluir Reels</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Alguma data importante ou promoção especial?</Label>
            <Textarea 
              placeholder="Ex: Black Friday em novembro, aniversário da empresa em março"
              value={formData.datasImportantes}
              onChange={(e) => updateField('datasImportantes', e.target.value)}
            />
          </div>
        </div>

        {/* 9. Detalhes finais */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">9. Detalhes finais</h3>
          
          <div className="space-y-2">
            <Label>Como prefere receber o cronograma?</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="formatoTexto"
                  checked={formData.formato.formatoTexto}
                  onCheckedChange={(checked) => 
                    updateNestedField('formato', 'formatoTexto', checked)
                  }
                />
                <Label htmlFor="formatoTexto">Arquivo de texto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="formatoPlanilha"
                  checked={formData.formato.formatoPlanilha}
                  onCheckedChange={(checked) => 
                    updateNestedField('formato', 'formatoPlanilha', checked)
                  }
                />
                <Label htmlFor="formatoPlanilha">Planilha</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Algo importante que não foi citado?</Label>
            <Textarea 
              placeholder="Qualquer detalhe adicional que considere importante"
              value={formData.detalhesExtras}
              onChange={(e) => updateField('detalhesExtras', e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full"
          variant="gradient"
          size="lg"
        >
          📝 PREENCHER CRONOGRAMA COM ESTAS INFORMAÇÕES
        </Button>
      </CardContent>
    </Card>
  );
}
