"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Material {
    constructor(id, titulo, disciplina, tags) {
        this.id = id;
        this.titulo = titulo;
        this.disciplina = disciplina;
        this.tags = tags;
    }
}
// 1. FROZEN SPOT - núcleo do framework (Template Method)
class ProcessadorUploadFramework {
    templateMethod(arquivo) {
        console.log(`\n[Framework] iniciando upload de ${arquivo.nome}`);
        this.validarConteudo(arquivo);
        const metadados = this.extrairInfo(arquivo);
        this.hook_processamentoEspecifico(arquivo);
        this.salvarCloud(metadados);
        console.log(`[Framework] upload concluído para ${arquivo.nome}`);
        return metadados;
    }
    // FROZEN SPOT - comportamento padrão fornecido pelo núcleo
    salvarCloud(metadados) {
        console.log(`[Framework] salvando ${metadados.nomeArquivo} na nuvem...`);
    }
    // HOT SPOT opcional (hook) - corpo vazio por padrão
    hook_processamentoEspecifico(arquivo) { }
}
class BuscadorDeMateriaisFramework {
    constructor(estrategiaInicial) {
        this.estrategia = estrategiaInicial;
    }
    // FROZEN SPOT - ponto de entrada fixo do framework
    buscar(materiais, termoBusca) {
        console.log(`[Framework] buscando materiais com termo="${termoBusca}"`);
        return this.estrategia.filtrar(materiais, termoBusca);
    }
    // HOT SPOT - permite trocar o algoritmo em tempo de execução
    setEstrategia(estrategia) {
        this.estrategia = estrategia;
    }
}
// 3. FROZEN SPOT - estratégia concreta padrão, já fornecida pelo framework
class FiltroPorDisciplinaFramework {
    filtrar(materiais, termoBusca) {
        const termo = termoBusca.toLowerCase();
        return materiais.filter((m) => m.disciplina.toLowerCase() === termo);
    }
}
// 4. FROZEN SPOT - núcleo do framework para notificações (Template Method)
class ProcessadorNotificacaoFramework {
    enviarNotificacao(evento) {
        console.log(`\n[Framework] preparando notificação: ${evento.titulo}`);
        const destinatarios = this.definirDestinatarios(evento);
        this.validarDestinatarios(destinatarios);
        const conteudo = this.montarConteudo(evento);
        const prioridade = this.definirPrioridade(evento);
        const registro = this.despachar(destinatarios, conteudo, prioridade);
        console.log(`[Framework] notificação enviada para ${destinatarios.length} destinatário(s)`);
        return registro;
    }
    // FROZEN SPOT - validação comum controlada pelo framework
    validarDestinatarios(destinatarios) {
        if (destinatarios.length === 0) {
            throw new Error('A notificação precisa ter ao menos um destinatário.');
        }
    }
    // FROZEN SPOT - simula o envio por um canal padronizado do framework
    despachar(destinatarios, conteudo, prioridade) {
        console.log(`[Framework] despachando via ${conteudo.canal} com prioridade ${prioridade}: ${conteudo.assunto}`);
        return {
            destinatarios,
            conteudo,
            prioridade,
            enviadaEm: new Date(),
        };
    }
}
// CLIENTE
// HOT SPOT estendido - especialização concreta para upload de PDF
class UploadPdfCliente extends ProcessadorUploadFramework {
    validarConteudo(arquivo) {
        console.log('[Cliente] validando PDF...');
    }
    extrairInfo(arquivo) {
        return {
            nomeArquivo: arquivo.nome,
            tamanhoBytes: arquivo.tamanho,
            tipoMime: arquivo.tipo,
            dataUpload: new Date(),
            extras: { paginas: 10 },
        };
    }
    hook_processamentoEspecifico(arquivo) {
        console.log('[Cliente] PDF aberto com leitor específico aqui');
    }
}
// HOT SPOT estendido - nova especialização criada pelo cliente,
class UploadVideoCliente extends ProcessadorUploadFramework {
    validarConteudo(arquivo) {
        console.log('[Cliente] validando vídeo...');
    }
    extrairInfo(arquivo) {
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
class FiltroPorTagCliente {
    filtrar(materiais, termoBusca) {
        const termo = termoBusca.toLowerCase();
        return materiais.filter((m) => m.tags.some((tag) => tag.toLowerCase() === termo));
    }
}
// HOT SPOT estendido - notificação concreta para uma nova reunião do grupo
class NotificacaoNovaReuniaoCliente extends ProcessadorNotificacaoFramework {
    definirDestinatarios(evento) {
        return evento.participantes;
    }
    montarConteudo(evento) {
        const data = evento.dados?.data ?? 'data a definir';
        return {
            assunto: `Nova reunião em ${evento.grupo}`,
            corpo: `${evento.autor.nome} criou a reunião "${evento.titulo}" para ${data}.`,
            canal: 'email-e-app',
        };
    }
    definirPrioridade(evento) {
        return evento.dados?.urgente === true ? 'alta' : 'normal';
    }
}
// HOT SPOT estendido - notificação concreta para material compartilhado
class NotificacaoNovoMaterialCliente extends ProcessadorNotificacaoFramework {
    definirDestinatarios(evento) {
        return evento.participantes.filter((usuario) => usuario.id !== evento.autor.id);
    }
    montarConteudo(evento) {
        const disciplina = evento.dados?.disciplina ?? 'disciplina não informada';
        return {
            assunto: `Novo material em ${evento.grupo}`,
            corpo: `${evento.autor.nome} compartilhou "${evento.titulo}" em ${disciplina}.`,
            canal: 'app',
        };
    }
    definirPrioridade() {
        return 'normal';
    }
}
// HOT SPOT estendido - notificação concreta para entrada de participante
class NotificacaoNovoParticipanteCliente extends ProcessadorNotificacaoFramework {
    definirDestinatarios(evento) {
        return evento.responsaveis ?? [evento.autor];
    }
    montarConteudo(evento) {
        const participante = evento.dados?.participante ?? 'Novo participante';
        return {
            assunto: `Participante adicionado em ${evento.grupo}`,
            corpo: `${participante} entrou no grupo "${evento.grupo}".`,
            canal: 'email',
        };
    }
    definirPrioridade() {
        return 'baixa';
    }
}
// TESTE 
console.log('======================================');
console.log(' DEMO 1 - Template Method (Framework)');
console.log('======================================');
const meuPdf = { nome: 'aula01.pdf', tamanho: 204800, tipo: 'application/pdf' };
const uploaderPdf = new UploadPdfCliente();
uploaderPdf.templateMethod(meuPdf);
const meuVideo = { nome: 'aula01.mp4', tamanho: 52428800, tipo: 'video/mp4' };
const uploaderVideo = new UploadVideoCliente();
uploaderVideo.templateMethod(meuVideo);
console.log('\n======================================');
console.log(' DEMO 2 - Strategy (Framework)');
console.log('======================================');
const materiais = [
    new Material(1, 'Slides de Arquitetura - Reutilização', 'Arquitetura', ['slides', 'framework']),
    new Material(2, 'Lista de Exercícios de Cálculo III', 'Cálculo', ['lista', 'individual']),
    new Material(3, 'Resumo de Padrões de Projeto', 'Arquitetura', ['resumo', 'gof']),
    new Material(4, 'Vídeo-aula de Banco de Dados', 'Banco', ['video', 'aula']),
];
const formatar = (lista) => lista.map((m) => `#${m.id} ${m.titulo}`).join(' | ') || '(nenhum)';
const buscador = new BuscadorDeMateriaisFramework(new FiltroPorDisciplinaFramework());
console.log('=== Estratégia do framework: FiltroPorDisciplina | termo="Arquitetura" ===');
console.log(formatar(buscador.buscar(materiais, 'Arquitetura')));
buscador.setEstrategia(new FiltroPorTagCliente());
console.log('\n=== Estratégia do cliente: FiltroPorTag | termo="framework" ===');
console.log(formatar(buscador.buscar(materiais, 'framework')));
console.log('\n======================================');
console.log(' DEMO 3 - Notificações (Template Method)');
console.log('======================================');
const camila = { id: 1, nome: 'Camila Silva', email: 'camila@organizeseugrupo.com' };
const luisa = { id: 2, nome: 'Luísa de Souza', email: 'luisa@organizeseugrupo.com' };
const joao = { id: 3, nome: 'João Pereira', email: 'joao@organizeseugrupo.com' };
const participantes = [camila, luisa, joao];
const notificacaoReuniao = new NotificacaoNovaReuniaoCliente();
notificacaoReuniao.enviarNotificacao({
    grupo: 'Grupo de Arquitetura',
    titulo: 'Planejamento da entrega final',
    autor: camila,
    participantes,
    dados: { data: '24/06/2026 19:00', urgente: true },
});
const notificacaoMaterial = new NotificacaoNovoMaterialCliente();
notificacaoMaterial.enviarNotificacao({
    grupo: 'Grupo de Arquitetura',
    titulo: 'Slides sobre Frameworks',
    autor: luisa,
    participantes,
    dados: { disciplina: 'Arquitetura e Desenho de Software' },
});
const notificacaoParticipante = new NotificacaoNovoParticipanteCliente();
notificacaoParticipante.enviarNotificacao({
    grupo: 'Grupo de Arquitetura',
    titulo: 'Entrada de participante',
    autor: camila,
    participantes,
    responsaveis: [camila],
    dados: { participante: 'João Pereira' },
});
