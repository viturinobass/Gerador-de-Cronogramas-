export interface CronogramaPost {
  dia: string;
  tema: string;
  conteudo: string;
  horario: string;
  hashtags: string;
}

export interface FormData {
  nomeEmpresa: string;
  ramoNegocio: string;
  instagramAtivo: string;
  publicoAlvo: string;
  percepcaoMarca: string;
  objetivos: {
    venderMais: boolean;
    aumentarSeguidores: boolean;
    criarRelacionamento: boolean;
    divulgarNovidades: boolean;
  };
  estiloVisual: string;
  perfilInspiracao: string;
  conteudo: {
    produtosServicos: boolean;
    promocoesDescontos: boolean;
    bastidores: boolean;
    depoimentos: boolean;
    dicasCuriosidades: boolean;
  };
  materiais: {
    temFotos: boolean;
    precisaFotos: boolean;
  };
  frequenciaSemanal: string;
  horariosPreferencia: string;
  diasSemana: {
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
    domingo: boolean;
  };
  extras: {
    incluirStories: boolean;
    incluirReels: boolean;
  };
  datasImportantes: string;
  formato: {
    formatoTexto: boolean;
    formatoPlanilha: boolean;
  };
  detalhesExtras: string;
}

export interface SegmentData {
  temas: string[];
  emojis: string[];
  hashtags: string;
}
