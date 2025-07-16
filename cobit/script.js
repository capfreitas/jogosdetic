document.addEventListener('DOMContentLoaded', () => {
    const DOMAINS = { '1': 'Avaliar, Dirigir e Monitorar (EDM)', '2': 'Alinhar, Planejar e Organizar (APO)', '3': 'Construir, Adquirir e Implementar (BAI)', '4': 'Entregar, Serviço e Suporte(DSS)', '5': 'Monitorar, Analisar e Avaliar (MEA)' };
    const PROCESSES_DATA = [ { id: 'p1', domain: '1', text: 'Garantir a Definição e Manutenção do Modelo de Governança' }, { id: 'p2', domain: '1', text: 'Garantir a Realização de Benefícios' }, { id: 'p3', domain: '1', text: 'Garantir a Otimização do Risco' }, { id: 'p4', domain: '1', text: 'Garantir a Otimização de Recursos' }, { id: 'p5', domain: '1', text: 'Garantir a Transparência para as partes interessadas' }, { id: 'p6', domain: '2', text: 'Gerenciar a Estrutura de Gestão de TI' }, { id: 'p7', domain: '2', text: 'Gerenciar a Estratégia' }, { id: 'p8', domain: '2', text: 'Gerenciar a Arquitetura da Organização' }, { id: 'p9', domain: '2', text: 'Gerenciar Inovação' }, { id: 'p10', domain: '2', text: 'Gerenciar Portfólio' }, { id: 'p11', domain: '2', text: 'Gerenciar Orçamentos e Custos' }, { id: 'p12', domain: '2', text: 'Gerenciar Recursos Humanos' }, { id: 'p13', domain: '2', text: 'Gerenciar Relacionamentos' }, { id: 'p14', domain: '2', text: 'Gerenciar Contratos de Prestação de Serviços' }, { id: 'p15', domain: '2', text: 'Gerenciar Fornecedores' }, { id: 'p16', domain: '2', text: 'Gerenciar Qualidade' }, { id: 'p17', domain: '2', text: 'Gerenciar Riscos' }, { id: 'p18', domain: '2', text: 'Gerenciar Segurança' }, { id: 'p19', domain: '3', text: 'Gerenciar Programas e Projetos' }, { id: 'p20', domain: '3', text: 'Gerenciar Definição de Requisitos' }, { id: 'p21', domain: '3', text: 'Gerenciar Identificação e Desenvolvimento de Soluções' }, { id: 'p22', domain: '3', text: 'Gerenciar Disponibilidade e Capacidade' }, { id: 'p23', domain: '3', text: 'Gerenciar Capacidade de Mudança Organizacional' }, { id: 'p24', domain: '3', text: 'Gerenciar Mudanças' }, { id: 'p25', domain: '3', text: 'Gerenciar Aceitação e Transição da Mudança' }, { id: 'p26', domain: '3', text: 'Gerenciar Conhecimento' }, { id: 'p27', domain: '3', text: 'Gerenciar Ativos' }, { id: 'p28', domain: '3', text: 'Gerenciar Configuração' }, { id: 'p29', domain: '4', text: 'Gerenciar Operações' }, { id: 'p30', domain: '4', text: 'Gerenciar Solicitações e Incidentes de Serviço' }, { id: 'p31', domain: '4', text: 'Gerenciar Problemas' }, { id: 'p32', domain: '4', text: 'Gerenciar Continuidade' }, { id: 'p33', domain: '4', text: 'Gerenciar Serviços de Segurança' }, { id: 'p34', domain: '4', text: 'Gerenciar os Controles de Processos de Negócio' }, { id: 'p35', domain: '5', text: 'Monitorar, Analisar e Avaliar Desempenho e Conformidade' }, { id: 'p36', domain: '5', text: 'Monitorar, Analisar e Avaliar o Sistema de Controle Interno' }, { id: 'p37', domain: '5', text: 'Monitorar, Analisar e Avaliar Conformidade com Requisitos Externos' }];

    let deck = [];
    let deckIndex = 0;
    let moveHistory = []; 

    const cardHolder = document.getElementById('card-holder');
    const domainPanesContainer = document.getElementById('domain-panes');
    const resultsDisplay = document.getElementById('results-display');
    const deckCounter = document.getElementById('deck-counter');
    
    function initializeGame() {
        deck = [...PROCESSES_DATA];
        shuffleArray(deck);
        deckIndex = 0;
        moveHistory = [];
        domainPanesContainer.innerHTML = '';
        createDomainPanes();
        resultsDisplay.innerHTML = '';
        showCurrentCard();
    }

    function createDomainPanes() {
        Object.keys(DOMAINS).forEach(id => {
            const container = document.createElement('div');
            container.className = 'process-container';
            container.innerHTML = `<h2 class="containerTitle">${DOMAINS[id]} <span class="domain-counter">(0)</span></h2><ul id="${id}" class="dropzone"></ul>`;
            domainPanesContainer.appendChild(container);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showCurrentCard() {
        cardHolder.innerHTML = '';
        if (deck.length > 0) {
            deckIndex = Math.max(0, Math.min(deckIndex, deck.length - 1));
            const process = deck[deckIndex];
            const card = document.createElement('div');
            card.id = process.id;
            card.className = 'process-card';
            card.dataset.domain = process.domain;
            card.textContent = process.text;
            cardHolder.appendChild(card);
        } else {
            cardHolder.innerHTML = '<strong>Fim de jogo!</strong>';
        }
        updateDeckCounter();
        updateAllCounters();
    }

    function placeCurrentCard(zoneId) {
        const zone = document.getElementById(zoneId);
        if (!zone || deck.length === 0) return;

        const processToMove = deck[deckIndex];
        const originalIndex = deckIndex;
        
        const li = document.createElement('li');
        li.id = processToMove.id;
        li.dataset.domain = processToMove.domain;
        li.textContent = processToMove.text;
        zone.appendChild(li);
        
        deck.splice(deckIndex, 1);
        
        moveHistory.push({ process: processToMove, fromIndex: originalIndex, toZoneId: zoneId });

        showCurrentCard();
    }

    function undoLastMove() {
        const lastMove = moveHistory.pop();
        if (!lastMove) return;

        const { process, fromIndex, toZoneId } = lastMove;
        
        const pane = document.getElementById(toZoneId);
        if (pane) {
            const itemToRemove = pane.querySelector(`li#${process.id}`);
            if (itemToRemove) itemToRemove.remove();
        }

        deck.splice(fromIndex, 0, process);
        deckIndex = fromIndex;
        showCurrentCard();
    }

    function updateAllCounters() {
        document.querySelectorAll('.target-btn').forEach(button => {
            const zoneId = button.dataset.targetId;
            const pane = document.getElementById(zoneId);
            const count = pane ? pane.children.length : 0;
            const counterSpan = button.querySelector('.domain-counter');
            if (counterSpan) counterSpan.textContent = `(${count})`;
        });
    }

    function updateDeckCounter() {
        deckCounter.textContent = `${deck.length > 0 ? deckIndex + 1 : 0} / ${deck.length}`;
    }

    // --- Lógica dos Botões ---
    document.querySelectorAll('.target-btn').forEach(button => {
        button.addEventListener('click', () => {
            placeCurrentCard(button.dataset.targetId);
        });
    });

    document.getElementById('btnUndo').addEventListener('click', undoLastMove);

    document.getElementById('newGameBtn').addEventListener('click', () => {
        if (confirm('Tem certeza?')) initializeGame();
    });

    document.getElementById('shuffleBtn').addEventListener('click', () => {
        shuffleArray(deck);
        deckIndex = 0;
        showCurrentCard();
    });

    // --- FUNÇÃO ATUALIZADA (v5.3) ---
    document.getElementById('checkResultBtn').addEventListener('click', () => {
        let total = 0, wrong = 0;
        document.querySelectorAll('#domain-panes .dropzone li').forEach(item => {
            total++;
            item.classList.remove('correct', 'wrong');
            const existingFeedback = item.querySelector('.feedback-text');
            if (existingFeedback) existingFeedback.remove();

            if (item.dataset.domain === item.parentElement.id) {
                item.classList.add('correct');
            } else {
                item.classList.add('wrong');
                wrong++;
                const correctDomainId = item.dataset.domain;
                const correctDomainName = DOMAINS[correctDomainId];
                const feedbackSpan = document.createElement('span');
                feedbackSpan.className = 'feedback-text';
                feedbackSpan.innerHTML = `(Deveria ser em: <strong>${correctDomainName}</strong>)`;
                item.appendChild(feedbackSpan);
            }
        });
        if (total > 0) {
            const correctCount = total - wrong;
            const percentage = Math.round((correctCount * 100) / total);
            resultsDisplay.innerHTML = `Acertos: <strong>${correctCount}/${total}</strong> (${percentage}%)`;
        } else {
            resultsDisplay.innerHTML = "Nenhum processo classificado.";
        }
    });
    
    document.getElementById('btnNext').addEventListener('click', () => {
        if (deck.length > 1) deckIndex = (deckIndex + 1) % deck.length;
        showCurrentCard();
    });
    document.getElementById('btnPrev').addEventListener('click', () => {
        if (deck.length > 1) deckIndex = (deckIndex - 1 + deck.length) % deck.length;
        showCurrentCard();
    });
    document.getElementById('btnFirst').addEventListener('click', () => {
        if (deck.length > 0) deckIndex = 0;
        showCurrentCard();
    });
    document.getElementById('btnLast').addEventListener('click', () => {
        if (deck.length > 0) deckIndex = deck.length - 1;
        showCurrentCard();
    });
    
    initializeGame();
});