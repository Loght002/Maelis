document.addEventListener('DOMContentLoaded', () => {
    // Pegando todos os elementos da DOM
    const telaInicial = document.getElementById('tela-inicial');
    const menuPrincipal = document.getElementById('menu-principal');
    const telaCreditos = document.getElementById('tela-creditos');
    const telaRanking = document.getElementById('tela-ranking');
    const telaConfiguracoes = document.getElementById('tela-configuracoes');
    const rankingList = document.getElementById('ranking-list');
    const musicaMenu = document.getElementById('musica-menu');
    const somClick = document.getElementById('som-click');
    const somHover = document.getElementById('som-hover');
    const botaoIniciar = document.getElementById('botao-iniciar');
    const botaoModoInfinito = document.getElementById('botao-modo-infinito');
    const botaoCreditos = document.getElementById('botao-creditos');
    const botaoRanking = document.getElementById('botao-ranking');
    const botaoConfig = document.getElementById('botao-config');
    const btnToggleMusic = document.getElementById('btn-toggle-music');
    const btnToggleSfx = document.getElementById('btn-toggle-sfx');
    const btnLangPrev = document.getElementById('btn-lang-prev');
    const btnLangNext = document.getElementById('btn-lang-next');
    const currentLanguageDisplay = document.getElementById('current-language');

    // Volumes padrão (você pode ajustar estes)
    musicaMenu.volume = 0.7; 
    somHover.volume = 0.3;
    somClick.volume = 0.4;

    // --- DICIONÁRIO DE IDIOMAS ---
    const languages = {
        'pt': { name: 'Português', key: 'pt' },
        'en': { name: 'English', key: 'en' },
        'es': { name: 'Español', key: 'es' }
    };

    const langData = {
        'pt': {
            pressione_tecla: "Pressione qualquer tecla para iniciar...",
            melhor_experiencia: "Para melhor experiência, aperte F11 para maximizar a tela",
            subtitulo: "GUARDIÃ DA NÉVOA",
            iniciar_btn: "INICIAR",
            modo_infinito_btn: "MODO INFINITO",
            creditos_btn: "CRÉDITOS",
            ranking_btn: "RANKING",
            versao: "VERSÃO: 1.0",
            pressione_tecla_voltar: "(Pressione qualquer tecla para voltar ao menu)",
            configuracoes_titulo: "CONFIGURAÇÕES",
            musica_label: "Música",
            sfx_label: "Efeitos Sonoros",
            idioma_label: "Idioma",
            esc_voltar: "(Pressione ESC para voltar ao menu)",
            ranking_carregando: "Carregando ranking...",
            ranking_vazio: "Ninguém no ranking ainda. Seja o primeiro!",
            ranking_erro: "Não foi possível carregar o ranking. Tente novamente mais tarde."
        },
        'en': {
            pressione_tecla: "Press any key to start...",
            melhor_experiencia: "For an enhanced experience, press F11 to maximise the screen.",
            subtitulo: "NAVY GUARDIAN",
            iniciar_btn: "START",
            modo_infinito_btn: "INFINITE MODE",
            creditos_btn: "CREDITS",
            ranking_btn: "RANKING",
            versao: "VERSION: 1.0",
            pressione_tecla_voltar: "(Press any key to return to the menu)",
            configuracoes_titulo: "SETTINGS",
            musica_label: "Music",
            sfx_label: "Sound Effects",
            idioma_label: "Language",
            esc_voltar: "(Press ESC to return to the menu)",
            ranking_carregando: "Loading ranking...",
            ranking_vazio: "No one in the ranking yet. Be the first!",
            ranking_erro: "Could not load the ranking. Please try again later."
        },
        'es': {
            pressione_tecla: "Pulsa cualquier tecla para empezar...",
            melhor_experiencia: "Para una mejor experiencia, presiona F11 para maximizar la pantalla",
            subtitulo: "GUARDIANA DE LA NIEBLA",
            iniciar_btn: "COMIENZA",
            modo_infinito_btn: "MODO INFINITO",
            creditos_btn: "CREDITOS",
            ranking_btn: "RANKING",
            versao: "VERSIÓN: 1.0",
            pressione_tecla_voltar: "(Presiona cualquier tecla para volver al menú)",
            configuracoes_titulo: "CONFIGURACIÓN",
            musica_label: "Música",
            sfx_label: "Efectos de Sonido",
            idioma_label: "Idioma",
            esc_voltar: "(Presiona ESC para volver al menú)",
            ranking_carregando: "Cargando ranking...",
            ranking_vazio: "Nadie en el ranking todavía. ¡Sé el primero!",
            ranking_erro: "No se pudo cargar el ranking. Por favor, inténtalo de nuevo más tarde."
        }
    };

    const languageKeys = Object.keys(languages);

    // NOVA FUNÇÃO: Salva a posição atual da música do menu
    function saveMenuMusicTime() {
        if (musicaMenu && !musicaMenu.paused) {
            localStorage.setItem('currentMenuMusicTime', musicaMenu.currentTime);
        }
    }

    // --- LÓGICA DE CRÉDITOS ---
    const creditosAnimacaoContainer = document.querySelector('.creditos-animacao-container');
    let scrollPosition = 0;
    let scrollSpeed = 0.5;
    let isAutoScrolling = false;
    let scrollTimeout;
    let animationFrameId;
    function animateCredits() { 
        if (isAutoScrolling) { 
            scrollPosition -= scrollSpeed; 
            const umBlocoHeight = creditosAnimacaoContainer.children[0].offsetHeight; 
            if (Math.abs(scrollPosition) >= umBlocoHeight) { 
                scrollPosition += umBlocoHeight; 
            } 
        } 
        if (creditosAnimacaoContainer) { 
            creditosAnimacaoContainer.style.transform = `translateY(${scrollPosition}px)`; 
        } 
        animationFrameId = requestAnimationFrame(animateCredits); 
    }
    function startCredits() { 
        scrollPosition = 0; 
        if (creditosAnimacaoContainer) { 
            creditosAnimacaoContainer.style.transform = `translateY(0px)`; 
        } 
        isAutoScrolling = true; 
        esconderTelas(); 
        botaoConfig.style.display = 'none'; 
        telaCreditos.style.display = 'flex'; 
        animateCredits(); 
        telaCreditos.addEventListener('wheel', handleManualScroll); 
        window.addEventListener('keydown', stopCredits, { once: true }); 
    }
    function stopCredits() { 
        if (telaCreditos.style.display === 'flex') { 
            cancelAnimationFrame(animationFrameId); 
            isAutoScrolling = false; 
            telaCreditos.removeEventListener('wheel', handleManualScroll); 
            mostrarMenuPrincipal(); 
        } 
    }
    function handleManualScroll(event) { 
        event.preventDefault(); 
        isAutoScrolling = false; 
        clearTimeout(scrollTimeout); 
        scrollPosition -= event.deltaY; 
        const umBlocoHeight = creditosAnimacaoContainer.children[0].offsetHeight; 
        scrollPosition = Math.max(-umBlocoHeight, scrollPosition); 
        scrollPosition = Math.min(0, scrollPosition); 
        scrollTimeout = setTimeout(() => { isAutoScrolling = true; }, 2000); 
    }

    // --- LÓGICA DE CONFIGURAÇÕES ---
    let settings = {
        music: true,
        sfx: true,
        language: 'pt' // Idioma padrão
    };

    function saveSettings() {
        localStorage.setItem('maelis-settings', JSON.stringify(settings));
    }

    function loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('maelis-settings'));
        if (savedSettings) {
            settings = { ...settings, ...savedSettings }; // Mescla para garantir que novas chaves não quebrem o jogo
        }
        updateConfigUI();
        applyAudioSettings();
    }

    function updateLanguage() {
        const currentLang = settings.language;
        const texts = langData[currentLang];

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (texts[key]) {
                // Para o título principal, atualizamos o data-text para o efeito glitch
                if (element.classList.contains('titulo-principal')) {
                    element.setAttribute('data-text', texts[key]);
                }
                element.textContent = texts[key];
            }
        });
        currentLanguageDisplay.textContent = languages[currentLang].name;
    }

    function updateConfigUI() {
        btnToggleMusic.innerHTML = settings.music ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        btnToggleSfx.innerHTML = settings.sfx ? '<i class="fas fa-bell"></i>' : '<i class="fas fa-bell-slash"></i>';
        updateLanguage();
    }
    
    function applyAudioSettings() {
        if (settings.music && musicaMenu.paused && menuPrincipal.style.display === 'flex') {
            const savedTime = parseFloat(localStorage.getItem('currentMenuMusicTime') || 0);
            musicaMenu.currentTime = savedTime; // Define o tempo salvo
            musicaMenu.play().catch(e => console.log("Áudio bloqueado pelo navegador."));
        } else if (!settings.music) {
            musicaMenu.pause();
        }
    }

    function tocarSomDeClique() {
        if (settings.sfx) {
            somClick.currentTime = 0;
            somClick.play();
        }
    }

    function tocarSomDeHover() {
        if (settings.sfx) {
            somHover.currentTime = 0;
            somHover.play();
        }
    }

    // --- LÓGICA DE NAVEGAÇÃO ENTRE TELAS ---
    function esconderTelas() {
        telaInicial.style.display = 'none';
        menuPrincipal.style.display = 'none';
        telaCreditos.style.display = 'none';
        telaRanking.style.display = 'none';
        telaConfiguracoes.style.display = 'none';
        botaoConfig.style.display = 'none'; // Esconde a engrenagem por padrão
    }

    function mostrarMenuPrincipal() {
        esconderTelas();
        menuPrincipal.style.display = 'flex';
        botaoConfig.style.display = 'block'; // Mostra a engrenagem APENAS no menu principal
        applyAudioSettings();
        window.removeEventListener('keydown', voltarDasConfiguracoes);
        window.removeEventListener('keydown', voltarDoRanking);
    }

    function mostrarTelaConfiguracoes() {
        esconderTelas();
        telaConfiguracoes.style.display = 'flex';
        window.addEventListener('keydown', voltarDasConfiguracoes);
    }

    function voltarDasConfiguracoes(event) {
        if (event.key === 'Escape') {
            mostrarMenuPrincipal();
        }
    }
    
    async function mostrarRanking() {
        esconderTelas();
        telaRanking.style.display = 'flex';
        rankingList.innerHTML = `<p>${langData[settings.language].ranking_carregando}</p>`;
        try {
            const response = await fetch('https://maelis-ranking-server.onrender.com/ranking');
            if (!response.ok) throw new Error('Network response was not ok');
            const rankingData = await response.json();
            if (rankingData.length === 0) {
                rankingList.innerHTML = `<p>${langData[settings.language].ranking_vazio}</p>`;
            } else {
                let rankingHTML = '<ol>';
                rankingData.forEach((player, index) => {
                rankingHTML += `<li><span class="rank-nickname">${index + 1}. ${player.nome}</span><span class="rank-score">${player.pontuacao}</span></li>`;
            });
                rankingHTML += '</ol>';
                rankingList.innerHTML = rankingHTML;
            }
        } catch (error) {
            console.error("Erro ao buscar ranking:", error);
            rankingList.innerHTML = `<p>${langData[settings.language].ranking_erro}</p>`;
        }
        window.addEventListener('keydown', voltarDoRanking, { once: true });
    }

    function voltarDoRanking() {
        mostrarMenuPrincipal();
    }
    
    // --- EVENTOS DE CLIQUE ---
    botaoIniciar.addEventListener('click', () => {
        tocarSomDeClique();
        saveMenuMusicTime(); // <--- CHAMA A NOVA FUNÇÃO AQUI
        setTimeout(() => { window.location.href = '../Jogo/Fases/selecaoDeFases.html'; }, 150);
    });

    botaoModoInfinito.addEventListener('click', () => {
        tocarSomDeClique();
        // Não salva o tempo da música aqui se for para um modo diferente
        setTimeout(() => { window.location.href = '../Jogo/ModoInfinito/modoinfinito.html'; }, 150);
    });

    botaoCreditos.addEventListener('click', () => {
        tocarSomDeClique();
        startCredits();
    });

    botaoRanking.addEventListener('click', () => {
        tocarSomDeClique();
        mostrarRanking();
    });

    botaoConfig.addEventListener('click', (e) => {
        e.preventDefault();
        tocarSomDeClique();
        mostrarTelaConfiguracoes();
    });

    // --- Eventos dos botões de configurações ---
    btnToggleMusic.addEventListener('click', () => {
        tocarSomDeClique();
        settings.music = !settings.music;
        saveSettings();
        updateConfigUI();
        applyAudioSettings();
    });

    btnToggleSfx.addEventListener('click', () => {
        settings.sfx = !settings.sfx;
        tocarSomDeClique();
        saveSettings();
        updateConfigUI();
    });

    btnLangPrev.addEventListener('click', () => {
        tocarSomDeClique();
        let currentIndex = languageKeys.indexOf(settings.language);
        currentIndex = (currentIndex - 1 + languageKeys.length) % languageKeys.length;
        settings.language = languageKeys[currentIndex];
        saveSettings();
        updateLanguage();
    });

    btnLangNext.addEventListener('click', () => {
        tocarSomDeClique();
        let currentIndex = languageKeys.indexOf(settings.language);
        currentIndex = (currentIndex + 1) % languageKeys.length;
        settings.language = languageKeys[currentIndex];
        saveSettings();
        updateLanguage();
    });

    // --- EVENTOS DE HOVER ---
    [botaoIniciar, botaoModoInfinito, botaoCreditos, botaoRanking, botaoConfig].forEach(botao => {
        botao.addEventListener('mouseover', tocarSomDeHover);
    });

    // --- INICIALIZAÇÃO ---
    // A lógica de inicialização foi ajustada para que a música continue de onde parou.
    // Se a página for acessada com #menu-principal ou se o usuário pressionar uma tecla na tela inicial,
    // o menu principal é mostrado e a música é iniciada/continuada.
    if (window.location.hash === '#menu-principal') {
        mostrarMenuPrincipal();
    } else {
        // Usa `once: true` para que o evento seja removido após a primeira execução
        window.addEventListener('keydown', () => {
            mostrarMenuPrincipal();
            // Também tenta tocar a música aqui, caso a tela inicial seja a primeira coisa que o usuário vê
            // e ele clique para entrar no menu. applyAudioSettings() já faz isso.
        }, { once: true });
    }

    // Carrega as configurações na inicialização (isso também aplica as configurações de áudio)
    loadSettings();
});