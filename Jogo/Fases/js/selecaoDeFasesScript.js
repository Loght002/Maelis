window.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE TRADUÇÃO E CONFIGURAÇÕES ---
    // Defina as configurações padrão, incluindo music e sfx
    let settings = { music: true, sfx: true, language: 'pt' };

    const selectionLangData = {
        'pt': {
            titulo_pagina: "Seleção de Fases",
            titulo_cabecalho: "Seleção de Fases",
            fase1_btn: "Fase 1",
            fase2_btn: "Fase 2",
            fase3_btn: "Fase 3"
        },
        'en': {
            titulo_pagina: "Phase Selection",
            titulo_cabecalho: "Phase Selection",
            fase1_btn: "Phase 1",
            fase2_btn: "Phase 2",
            fase3_btn: "Phase 3"
        },
        'es': {
            titulo_pagina: "Selección de Fases",
            titulo_cabecalho: "Selección de Fases",
            fase1_btn: "Fase 1",
            fase2_btn: "Fase 2",
            fase3_btn: "Fase 3"
        }
    };

    // --- Referências aos elementos de áudio ---
    const musicaMenu = document.getElementById('musica-menu');
    const somClick = document.getElementById('som-click');
    const somHover = document.getElementById('som-hover');

    // Volumes padrão (você pode ajustar estes)
    musicaMenu.volume = 0.7; 
    somHover.volume = 0.3;
    somClick.volume = 0.4;

    // --- Funções de Áudio para Seleção de Fases ---
    function tocarSom(somElement) {
        if (settings.sfx && somElement) {
            somElement.currentTime = 0; // Reinicia para permitir cliques/hovers rápidos
            somElement.play().catch(e => console.warn("Erro ao tocar SFX:", e));
        }
    }

    function tocarMusicaContinuada(musicaElement) {
        // A música só deve tocar se settings.music for true
        if (settings.music && musicaElement) {
            const savedTime = parseFloat(localStorage.getItem('currentMenuMusicTime') || 0);
            musicaElement.currentTime = savedTime;
            // É importante definir o loop para true se você quer que ela continue indefinidamente
            musicaElement.loop = true; 
            musicaElement.play().catch(e => console.warn("Erro ao continuar música:", e));
        }
    }

    // --- Carrega as configurações (incluindo música/SFX e idioma) ---
    // Esta função agora é a única responsável por carregar as configurações do localStorage
    function loadSettingsAndApply() {
        const savedSettings = JSON.parse(localStorage.getItem('maelis-settings'));
        if (savedSettings) {
            settings = { ...settings, ...savedSettings };
        }
        // Aplica o volume dos sons de hover e click com base nas configurações
        if (somHover) somHover.volume = 0.3; // Pode ajustar o volume padrão ou salvar no settings
        if (somClick) somClick.volume = 0.4; // Pode ajustar o volume padrão ou salvar no settings
    }

    function updateTexts() {
        const texts = selectionLangData[settings.language];
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (texts[key]) {
                element.textContent = texts[key];
            }
        });
        document.title = texts.titulo_pagina;
    }

    // --- LÓGICA DE DESBLOQUEIO DE FASES ---
    const nivelConcluido = parseInt(localStorage.getItem('nivelConcluido')) || 0;

    // ADICIONAR ESTA LINHA: Referência para o botão da Fase 1
    const botaoFase1 = document.getElementById('fase1'); 
    const botaoFase2 = document.getElementById('fase2');
    const botaoFase3 = document.getElementById('fase3');
    const btnVoltarMenu = document.getElementById('btn-voltar-menu');

    if (nivelConcluido >= 1) {
        botaoFase2.classList.remove('bloqueado');
        botaoFase2.href = 'fase2.html';
    }

    if (nivelConcluido >= 2) {
        botaoFase3.classList.remove('bloqueado');
        botaoFase3.href = 'fase3.html';
    }

    // --- Event Listeners para botões na tela de seleção de fases ---
    [botaoFase1, botaoFase2, botaoFase3, btnVoltarMenu].forEach(btn => {
        if (btn) {
            btn.addEventListener('mouseover', () => tocarSom(somHover));
            btn.addEventListener('click', () => {
                tocarSom(somClick);
                // Quando clicar em uma fase (Fase 1, 2, 3), pause a música do menu,
                // já que a fase terá sua própria música.
                if (btn.id.startsWith('fase')) {
                    if (musicaMenu) {
                        musicaMenu.pause(); 
                        // Opcional: localStorage.removeItem('currentMenuMusicTime'); 
                        // Descomente a linha acima se quiser que a música do menu RECOMECE do zero 
                        // quando voltar para ele da fase. Caso contrário, ela continuará de onde parou 
                        // na tela de seleção de fases.
                    }
                }
                // A navegação real acontece pelo href do link, após o som do clique
            });
        }
    });

    // --- INICIALIZAÇÃO ---
    // 1. Carrega e aplica as configurações (incluindo idioma e status de áudio)
    loadSettingsAndApply(); 
    // 2. Atualiza os textos da página com base no idioma carregado
    updateTexts();
    // 3. Toca a música, continuando de onde parou no menu principal
    tocarMusicaContinuada(musicaMenu); 
});