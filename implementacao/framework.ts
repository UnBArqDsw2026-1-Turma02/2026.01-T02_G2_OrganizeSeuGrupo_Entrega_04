interface Arquivo {
    nome: string;
    tamanho: number;
    tipo: string;
}

interface Metadados {
    nomeArquivo: string;
    tamanhoBytes: number;
    tipoMime: string;
    dataUpload: Date;
    extras?: Record<string, unknown>;
}

class Material {
    public id: number;
    public titulo: string;
    public disciplina: string;
    public tags: string[];
    constructor(id: number, titulo: string, disciplina: string, tags: string[]) {
        this.id = id;
        this.titulo = titulo;
        this.disciplina = disciplina;
        this.tags = tags;
    }
}

// 1. FROZEN SPOT - núcleo do framework (Template Method)
abstract class ProcessadorUploadFramework {

    public templateMethod(arquivo: Arquivo): Metadados {
        console.log(`\n[Framework] iniciando upload de ${arquivo.nome}`);
        this.validarConteudo(arquivo);
        const metadados = this.extrairInfo(arquivo);
        this.hook_processamentoEspecifico(arquivo);
        this.salvarCloud(metadados);
        console.log(`[Framework] upload concluído para ${arquivo.nome}`);
        return metadados;
    }

    // FROZEN SPOT - comportamento padrão fornecido pelo núcleo
    protected salvarCloud(metadados: Metadados): void {
        console.log(`[Framework] salvando ${metadados.nomeArquivo} na nuvem...`);
    }

    // HOT SPOT obrigatório - cada tipo de material define sua validação
    protected abstract validarConteudo(arquivo: Arquivo): void;

    // HOT SPOT obrigatório - cada tipo de material extrai seus metadados
    protected abstract extrairInfo(arquivo: Arquivo): Metadados;

    // HOT SPOT opcional (hook) - corpo vazio por padrão
    protected hook_processamentoEspecifico(arquivo: Arquivo): void { }
}

// 2. FROZEN SPOT - núcleo do framework (Strategy)
interface FiltroMaterialStrategy {
    filtrar(materiais: Material[], termoBusca: string): Material[];
}

class BuscadorDeMateriaisFramework {
    private estrategia: FiltroMaterialStrategy;

    constructor(estrategiaInicial: FiltroMaterialStrategy) {
        this.estrategia = estrategiaInicial;
    }

    // FROZEN SPOT - ponto de entrada fixo do framework
    public buscar(materiais: Material[], termoBusca: string): Material[] {
        console.log(`[Framework] buscando materiais com termo="${termoBusca}"`);
        return this.estrategia.filtrar(materiais, termoBusca);
    }

    // HOT SPOT - permite trocar o algoritmo em tempo de execução
    public setEstrategia(estrategia: FiltroMaterialStrategy): void {
        this.estrategia = estrategia;
    }
}

// 3. FROZEN SPOT - estratégia concreta padrão, já fornecida pelo framework
class FiltroPorDisciplinaFramework implements FiltroMaterialStrategy {
    public filtrar(materiais: Material[], termoBusca: string): Material[] {
        const termo = termoBusca.toLowerCase();
        return materiais.filter((m) => m.disciplina.toLowerCase() === termo);
    }
}



// CLIENTE

// HOT SPOT estendido - especialização concreta para upload de PDF
class UploadPdfCliente extends ProcessadorUploadFramework {
    protected validarConteudo(arquivo: Arquivo): void {
        console.log('[Cliente] validando PDF...');
    }
    protected extrairInfo(arquivo: Arquivo): Metadados {
        return {
            nomeArquivo: arquivo.nome,
            tamanhoBytes: arquivo.tamanho,
            tipoMime: arquivo.tipo,
            dataUpload: new Date(),
            extras: { paginas: 10 },
        };
    }
    protected hook_processamentoEspecifico(arquivo: Arquivo): void {
        console.log('[Cliente] PDF aberto com leitor específico aqui');
    }
}

// HOT SPOT estendido - nova especialização criada pelo cliente,
class UploadVideoCliente extends ProcessadorUploadFramework {
    protected validarConteudo(arquivo: Arquivo): void {
        console.log('[Cliente] validando vídeo...');
    }
    protected extrairInfo(arquivo: Arquivo): Metadados {
        return {
            nomeArquivo: arquivo.nome,
            tamanhoBytes: arquivo.tamanho,
            tipoMime: arquivo.tipo,
            dataUpload: new Date(),
            extras: { duracaoSegundos: 754 },
        };
    }

}

// HOT SPOT estendido - estratégia de busca criada pelo cliente,
class FiltroPorTagCliente implements FiltroMaterialStrategy {
    public filtrar(materiais: Material[], termoBusca: string): Material[] {
        const termo = termoBusca.toLowerCase();
        return materiais.filter((m) =>
            m.tags.some((tag) => tag.toLowerCase() === termo)
        );
    }
}


// TESTE 
console.log('======================================');
console.log(' DEMO 1 - Template Method (Framework)');
console.log('======================================');

const meuPdf: Arquivo = { nome: 'aula01.pdf', tamanho: 204800, tipo: 'application/pdf' };
const uploaderPdf = new UploadPdfCliente();
uploaderPdf.templateMethod(meuPdf);

const meuVideo: Arquivo = { nome: 'aula01.mp4', tamanho: 52428800, tipo: 'video/mp4' };
const uploaderVideo = new UploadVideoCliente();
uploaderVideo.templateMethod(meuVideo);

console.log('\n======================================');
console.log(' DEMO 2 - Strategy (Framework)');
console.log('======================================');

const materiais: Material[] = [
    new Material(1, 'Slides de Arquitetura - Reutilização', 'Arquitetura', ['slides', 'framework']),
    new Material(2, 'Lista de Exercícios de Cálculo III', 'Cálculo', ['lista', 'individual']),
    new Material(3, 'Resumo de Padrões de Projeto', 'Arquitetura', ['resumo', 'gof']),
    new Material(4, 'Vídeo-aula de Banco de Dados', 'Banco', ['video', 'aula']),
];

const formatar = (lista: Material[]): string =>
    lista.map((m) => `#${m.id} ${m.titulo}`).join(' | ') || '(nenhum)';

const buscador = new BuscadorDeMateriaisFramework(new FiltroPorDisciplinaFramework());
console.log('=== Estratégia do framework: FiltroPorDisciplina | termo="Arquitetura" ===');
console.log(formatar(buscador.buscar(materiais, 'Arquitetura')));

buscador.setEstrategia(new FiltroPorTagCliente());
console.log('\n=== Estratégia do cliente: FiltroPorTag | termo="framework" ===');
console.log(formatar(buscador.buscar(materiais, 'framework')));

export {};
