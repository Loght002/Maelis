const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- Dimensões Originais do Canvas (Referência para escalonamento) ---
const originalCanvasWidth = 800;
const originalCanvasHeight = 1000;

// Define as dimensões iniciais do canvas para os cálculos originais, será escalado pelo CSS
canvas.width = originalCanvasWidth;
canvas.height = originalCanvasHeight;

// --- Elementos da Interface (Não são necessárias alterações aqui para responsividade, já selecionados) ---
const pontuacaoDiv = document.getElementById("pontuacao");
const vidasContainer = document.getElementById("vidas-container"); // NOVO: Referência ao container de vidas
const caixaDialogo = document.getElementById("caixa-dialogo");
const textoDialogo = document.getElementById("texto-dialogo");
const btnContinuar = document.getElementById("btn-continuar");
const fimDeFaseDiv = document.getElementById("fim-de-fase");
const btnVoltarMenuFase = document.getElementById("btnVoltarMenuFase");
const telaFalha = document.getElementById("tela-falha");
const btnTentarNovamente = document.getElementById("btn-tentar-novamente");
const btnVoltarMenuFalha = document.getElementById("btn-voltar-menu-falha")
const avisoEscape = document.getElementById("aviso-escape");
const telaBomTrabalho = document.getElementById("tela-bom-trabalho");
const btnVoltarMenuFinal = document.getElementById("btn-voltar-menu-final");
const geloBarContainer = document.getElementById("gelo-bar-container");
const geloBarFill = document.getElementById("gelo-bar-fill");
const sombraBarContainer = document.getElementById("sombra-bar-container");
const sombraBarFill = document.getElementById("sombra-bar-fill");
const ondaDisplay = document.getElementById("onda-display"); // <-- ADICIONADO

// --- Referências de áudio ---
const somClick = document.getElementById("som-click");
const somHover = document.getElementById("som-hover");
const somGameOver = document.getElementById("som-game-over");
const somDisparo = document.getElementById("som-disparo");
const musicaAcao = document.getElementById("musica-acao");
const musicaVitoria = document.getElementById("musica-vitoria");
const somDanoMaelis = document.getElementById("dano-maelis");
const somDaCriatura = document.getElementById("som-da-criatura");

// --- ELEMENTOS DE IMAGEM DA REAÇÃO DA MAELIS (selecionados do DOM) ---
// Certifique-se de que esses IDs estejam no seu HTML da Fase 2.
const maelisNormalFace = document.getElementById("maelis-normal");
const maelisChorandoFace = document.getElementById("maelis-chorando");
const maelisDescabeladaFace = document.getElementById("maelis-descabelada");
const maelisMortaFace = document.getElementById("maelis-morta");

// =======================================================
// --- NOVO: SEÇÃO DE TRADUÇÃO E CONFIGURAÇÕES ---
// =======================================================
let settings = { music: true, sfx: true, language: 'pt' };

const fase2LangData = {
    'pt': {
        titulo_pagina: "Maelis: Fase 2 - Floresta Corrompida",
        pontos: "Pontos:",
        onda: "Onda",
        magia_gelo: "Magia de Gelo",
        magia_sombra: "Magia das Sombras",
        aviso_escape: "AVISO! Um inimigo escapou. Não deixe que aconteça de novo!",
        dialogo_inicial: "Aqui, onde os pilares caíram... os protetores se ajoelharam diante da Névoa. Você ousa seguir onde eles ruíram?",
        dialogo_vitoria_parcial: "Parabéns! Todas as hordas foram purificadas. Você está se tornando mais forte!",
        vitoria_titulo: "Fase Concluída!",
        falha_titulo_fim_jogo: "Fim de jogo!",
        falha_texto: "A escuridão venceu desta vez.",
        btn_continuar: "Continuar",
        btn_tentar_novamente: "Tentar Novamente",
        btn_voltar_menu: "Voltar ao Menu",
    },
    'en': {
        titulo_pagina: "Maelis: Phase 2 - Corrupted Forest",
        pontos: "Score:",
        onda: "Wave",
        magia_gelo: "Ice Magic",
        magia_sombra: "Shadow Magic",
        aviso_escape: "WARNING! An enemy escaped. Don't let it happen again!",
        dialogo_inicial: "Here, where the pillars fell... the protectors knelt before the Mist. Do you dare to follow where they crumbled?",
        dialogo_vitoria_parcial: "Congratulations! All hordes have been cleansed. You are growing stronger!",
        vitoria_titulo: "Phase Complete!",
        falha_titulo_fim_jogo: "Game Over!",
        falha_texto: "The darkness won this time.",
        btn_continuar: "Continue",
        btn_tentar_novamente: "Try Again",
        btn_voltar_menu: "Back to Menu",
    },
    'es': {
        titulo_pagina: "Maelis: Fase 2 - Bosque Corrupto",
        pontos: "Puntos:",
        onda: "Oleada",
        magia_gelo: "Magia de Hielo",
        magia_sombra: "Magia de las Sombras",
        aviso_escape: "¡AVISO! Un enemigo ha escapado. ¡No dejes que vuelva a ocurrir!",
        dialogo_inicial: "Aquí, donde los pilares cayeron... los protectores se arrodillaron ante la Niebla. ¿Te atreves a seguir donde ellos cayeron?",
        dialogo_vitoria_parcial: "¡Felicidades! Todas las hordas han sido purificadas. ¡Te estás volviendo más fuerte!",
        vitoria_titulo: "¡Fase Completada!",
        falha_titulo_fim_jogo: "¡Fin del juego!",
        falha_texto: "La oscuridad ha vencido esta vez.",
        btn_continuar: "Continuar",
        btn_tentar_novamente: "Intentar de Nuevo",
        btn_voltar_menu: "Volver al Menú",
    }
};

function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('maelis-settings'));
    if (savedSettings) {
        settings = { ...settings, ...savedSettings };
    }
    // NOVO: Adiciona a lógica para aplicar as configurações de áudio
    applyAudioSettings();
}

// A função applyAudioSettings() usa as variáveis globais music e sfx para
// decidir se a música e os sons do jogo devem ser tocados.
function applyAudioSettings() {
    if (settings.music) {
        musicaAcao.muted = false;
        musicaVitoria.muted = false;
        somGameOver.muted = false; // <-- CORRIGIDO: O som de game over é tratado como música
    } else {
        musicaAcao.muted = true;
        musicaVitoria.muted = true;
        somGameOver.muted = true;  // <-- CORRIGIDO: O som de game over é tratado como música
    }
    // Aplica o estado de "mudo" para todos os efeitos sonoros
    somClick.muted = !settings.sfx;
    somHover.muted = !settings.sfx;
    somDisparo.muted = !settings.sfx;
    somDanoMaelis.muted = !settings.sfx;
    somDaCriatura.muted = !settings.sfx;
}

function updateTexts() {
    const texts = fase2LangData[settings.language];
    if (!texts) return;

    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (texts[key]) {
            if (key === 'pontos') {
                element.textContent = `${texts[key]} ${pontos}`;
            } else if (key === 'onda') {
                element.textContent = `${texts[key]} ${ondaAtual} / ${totalDeOndas}`;
            } else {
                element.innerHTML = texts[key];
            }
        }
    });
    document.title = texts.titulo_pagina;
}
// --- FIM DA SEÇÃO DE TRADUÇÃO ---

somDisparo.volume = 0.1; // Ajusta o volume do som de disparo
musicaAcao.volume = 1; // Ajusta o volume da música de ação
musicaVitoria.volume = 0.5;
somClick.volume = 0.3; // Ajusta o volume do som de clique
somHover.volume = 0.3; // Ajusta o volume do som de hover
somGameOver.volume = 0.5;
somDanoMaelis.volume = 0.3;
somDaCriatura.volume = 0.3;


// --- Constantes do Jogo (Estas serão agora escaladas) ---
// Defina-as em relação ao tamanho original do seu canvas
const originalLimiteEsquerdo = 50;
const originalLimiteDireito = originalCanvasWidth - 50;
// originalLimiteDano não é mais necessário para a lógica de escape, pois usamos a altura do canvas
const totalDeOndas = 4;
const MAX_LIVES = 3; // Maelis terá 3 vidas (normal, chorando, descabelada, morta)
const inimigosPorOndaInicial = 7;
const inimigosHorda3 = 9;
const inimigosHorda4 = 13;
// Constantes de Magia
const INIMIGOS_PARA_MAGIA = 10;
const DURACAO_MODO_GELO = 10000;
const COOLDOWN_GELO = 20000;
const DURACAO_CONGELAMENTO = 3000;
const DURACAO_MODO_SOMBRA = 10000;
const COOLDOWN_SOMBRA = 25000;
const COOLDOWN_RAIO_SOMBRA = 400; // 0.4 segundos entre cada raio


// --- Variáveis de Estado do Jogo (Nenhuma alteração na declaração) ---
let player, tiros = [], inimigos = [], inimigoTiros = [], particulas = [], estrelas = [], raiosSombra = [];
let pontos = 0, leftPressed = false, rightPressed = false, spacePressed = false, shiftPressed = false;
let jogoAtivo = false, estadoFase = 'DIALOGO_INICIAL', ondaAtual = 0;
let inimigoEscapou = false, primeiroAvisoDado = false; // <<< ALTERAÇÃO: Variáveis para controle de escape/aviso
let animationFrameId;
// Magia de Gelo
let magiaGeloDesbloqueada = false;
let magiaGeloCarregada = 0;
let modoGeloAtivo = false;
let magiaGeloEmCooldown = false;
let timerModoGelo = null;
let timerCooldownGelo = null;
// Magia das Sombras
let magiaSombraDesbloqueada = false;
let magiaSombraCarregada = 0;
let modoSombraAtivo = false;
let magiaSombraEmCooldown = false;
let podeAtirarRaioSombra = true;
let timerModoSombra = null;
let timerCooldownSombra = null;

// --- Variáveis para Cadência de Tiro ---
let canShoot = true; // Permite o primeiro tiro
const shotCooldown = 3330 / 8; // 1000ms (1 segundo) dividido por 3 tiros = 333.33ms entre tiros
let lastShotTime = 0; // Armazena o timestamp do último tiro

// --- Variáveis de Escala ---
let scaleX = 1;
let scaleY = 1;
let currentCanvasWidth = originalCanvasWidth;
let currentCanvasHeight = originalCanvasHeight;


// --- Imagens do Jogo ---
// <<< ALTERAÇÃO: Renomeado playerImage e adicionado imagens de caminhada
let maelisParadaImage = new Image();
let maelisDireitaImage = new Image();
let maelisEsquerdaImage = new Image();
let vagalumeEnemyImage = new Image();
let totemEnemyImage = new Image();
let totemProjectileImage = new Image();
let iceMagicProjectileImage = new Image();
let shadowMagicImage = new Image();

// <<< ALTERAÇÃO: Caminhos das imagens da Maelis
maelisParadaImage.src = 'assets/Maelis_de_costas_parada.png';
maelisDireitaImage.src = 'assets/Maelis_de_costas_1.png';
maelisEsquerdaImage.src = 'assets/Maelis_de_costas_2.png';

// --- NOVO: Imagem do tiro normal ---
const tiroNormalSprite = new Image();
tiroNormalSprite.src = 'assets/magia-normal.png';

/// Sprites de Reação da Maelis (como objetos Image para carregar)
const maelisNormalFaceImg = new Image();
maelisNormalFaceImg.src = 'assets/maelis-face-normal.png';
const maelisChorandoFaceImg = new Image();
maelisChorandoFaceImg.src = 'assets/maelis-face-chorando.png';
const maelisDescabeladaFaceImg = new Image();
maelisDescabeladaFaceImg.src = 'assets/maelis-face-descabelada.png';
const maelisMortaFaceImg = new Image();
maelisMortaFaceImg.src = 'assets/maelis-face-morta.png';

vagalumeEnemyImage.src = 'assets/vagalume-inimigo.png';
totemEnemyImage.src = 'assets/totem-inimigo.png';
totemProjectileImage.src = 'assets/projetil-totem.png';
iceMagicProjectileImage.src = 'assets/magia-de-gelo.png';
shadowMagicImage.src = 'assets/magia-das-sombras.png';

// <<< ALTERAÇÃO: Adicionadas novas imagens à lista de carregamento
const imagesToLoad = [
    maelisParadaImage, maelisDireitaImage, maelisEsquerdaImage, 
    vagalumeEnemyImage, totemEnemyImage, totemProjectileImage, 
    iceMagicProjectileImage, shadowMagicImage, tiroNormalSprite, maelisNormalFaceImg, maelisChorandoFaceImg, maelisDescabeladaFaceImg, maelisMortaFaceImg // Adicione as novas imagens aqui
];
let imagesLoadedCount = 0;

function imageLoaded() {
    imagesLoadedCount++;
    if (imagesLoadedCount === imagesToLoad.length) {
        console.log("Todas as imagens carregadas!");
        loadSettings(); // Carrega o idioma salvo
        updateTexts(); // Aplica a tradução inicial
        setupCanvasForResponsiveness(); // Chama isso depois que as imagens carregam para obter o tamanho correto do canvas
        inicializar();
    }
}

imagesToLoad.forEach(img => {
    img.onload = imageLoaded;
    img.onerror = () => {
        console.error("FALHA AO CARREGAR IMAGEM: " + img.src);
        imageLoaded();
    };
});

// --- Nova função para lidar com o redimensionamento do canvas ---
function setupCanvasForResponsiveness() {
    const gameContainer = document.getElementById("game-container");
    // Assegura que gameContainer.clientWidth/Height tem um valor válido
    // Se o contêiner não tem um tamanho definido explicitamente, pode retornar 0
    currentCanvasWidth = gameContainer.clientWidth > 0 ? gameContainer.clientWidth : originalCanvasWidth;
    currentCanvasHeight = gameContainer.clientHeight > 0 ? gameContainer.clientHeight : originalCanvasHeight;

    // Define as dimensões internas do canvas para corresponder ao tamanho de exibição
    canvas.width = currentCanvasWidth;
    canvas.height = currentCanvasHeight;

    // Calcula os fatores de escalonamento
    scaleX = currentCanvasWidth / originalCanvasWidth;
    scaleY = currentCanvasHeight / originalCanvasHeight;

    console.log(`Canvas redimensionado para ${currentCanvasWidth}x${currentCanvasHeight}. ScaleX: ${scaleX}, ScaleY: ${scaleY}`);
}

// Ouve eventos de redimensionamento da janela
window.addEventListener('resize', setupCanvasForResponsiveness);

// =======================================================
// --- 2. CONTROLE DE ÁUDIO ---
// =======================================================
// Adapta a função tocarSom para respeitar a configuração de sfx
function tocarSom(som) {
    // Só toca o som se a configuração de sfx estiver ativada
    if (settings.sfx && som) {
        som.currentTime = 0;
        som.play().catch(error => console.warn("Erro ao tocar som.", error));
    }
}


// =======================================================
// ===== CONTROLE DE FLUXO DA FASE =======================
// =======================================================

function inicializar() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    player = {
        x: originalCanvasWidth / 2,
        y: originalCanvasHeight - 80,
        width: 50,
        height: 60,
        speed: 6,
        lives: MAX_LIVES, // Inicia com o número máximo de vidas
        invincible: false,
        // <<< NOVO: Propriedade para guardar a imagem atual do jogador
        currentImage: maelisParadaImage 
    };
    tiros = []; inimigos = []; inimigoTiros = []; particulas = []; estrelas = []; raiosSombra = [];
    pontos = 0; ondaAtual = 0;
    leftPressed = false; rightPressed = false; spacePressed = false; shiftPressed = false;
    jogoAtivo = false; estadoFase = 'DIALOGO_INICIAL';

    inimigoEscapou = false; 
    primeiroAvisoDado = false; 

    magiaGeloDesbloqueada = false;
    magiaGeloCarregada = 0;
    modoGeloAtivo = false;
    magiaGeloEmCooldown = false;
    clearTimeout(timerModoGelo);
    clearTimeout(timerCooldownGelo);
    geloBarContainer.style.display = 'none';
    atualizarBarraGelo();

    magiaSombraDesbloqueada = false;
    magiaSombraCarregada = 0;
    modoSombraAtivo = false;
    magiaSombraEmCooldown = false;
    podeAtirarRaioSombra = true;
    clearTimeout(timerModoSombra);
    clearTimeout(timerCooldownSombra);
    sombraBarContainer.style.display = 'none';
    atualizarBarraSombra();

    updateTexts(); // ATUALIZADO: para definir textos iniciais
    fimDeFaseDiv.style.display = 'none';
    telaFalha.style.display = 'none';
    telaBomTrabalho.style.display = 'none';
    avisoEscape.style.display = 'none';
    caixaDialogo.style.display = 'none';
    if (ondaDisplay) ondaDisplay.style.display = 'none'; // <-- ADICIONADO: Esconde o contador ao iniciar

    criarEstrelas();
    atualizarVidasUI();
    atualizarExpressaoMaelis(); // Chama a função para garantir que a face inicial seja a normal
    mostrarDialogoInicial();
}

function mostrarDialogoInicial() {
    estadoFase = 'DIALOGO_INICIAL';
    textoDialogo.textContent = fase2LangData[settings.language].dialogo_inicial;
    caixaDialogo.style.display = 'block';
    btnContinuar.style.display = 'none';
    // O evento é adicionado aqui para garantir que o jogo só comece após a interação do usuário
    document.addEventListener('keydown', handleInitialInput, { once: true });
}

function handleInitialInput(e) {
    if (e.key === " ") {
        somClick.play(); // Toca o som de clique
        iniciarGameplay();
    } else {
        // Se a tecla não for espaço, adiciona o listener novamente
        document.addEventListener('keydown', handleInitialInput, { once: true });
    }
}

function iniciarGameplay() {
    caixaDialogo.style.display = 'none';
    jogoAtivo = true;
    estadoFase = 'GAMEPLAY';
    if (inimigos.length === 0) {
        iniciarProximaOnda();
    }
    // Certifique-se de que o loop do jogo comece aqui, se ainda não estiver rodando
    if (!animationFrameId) { // Evita múltiplos loops de animação
        atualizar();
    }
    // Garante que a UI de vidas e pontuação esteja visível ao iniciar o gameplay
    pontuacaoDiv.style.display = 'block';
    vidasContainer.style.display = 'flex'; // Exibe o container de vidas
    // As barras de magia serão exibidas quando desbloqueadas
    musicaAcao.play(); // Inicia a música de ação
}


function avancarEstadoFase() {
    if (inimigos.length === 0 && inimigoTiros.length === 0) {
        if (ondaAtual === 1 && !magiaSombraDesbloqueada) {
            magiaSombraDesbloqueada = true;
            sombraBarContainer.style.display = 'flex';
        }
        if (ondaAtual === 2 && !magiaGeloDesbloqueada) {
            magiaGeloDesbloqueada = true;
            geloBarContainer.style.display = 'flex';
        }

        if (ondaAtual < totalDeOndas) {
            iniciarProximaOnda();
        } else {
            mostrarTelaDeParabensIntermediaria();
        }
    }
}

function mostrarTelaDeParabensIntermediaria() {
    jogoAtivo = false; 
    estadoFase = 'NARRATIVA';
    if (ondaDisplay) ondaDisplay.style.display = 'none'; // Esconde o contador
    musicaAcao.pause(); // Pausa a música de ação
    musicaVitoria.play(); // Toca a música de vitória
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null; // Limpa o ID da animação
    textoDialogo.textContent = fase2LangData[settings.language].dialogo_vitoria_parcial;
    caixaDialogo.style.display = 'block';
    btnContinuar.style.display = 'block';
    const progressoAtual = localStorage.getItem('nivelConcluido') || '0';
    const nivelDestaFase = '2';
    if (parseInt(nivelDestaFase) > parseInt(progressoAtual)) {
        localStorage.setItem('nivelConcluido', nivelDestaFase);
    }
    const showGoodJobScreenListener = () => {
        somClick.play(); // Toca o som de clique ao continuar
        caixaDialogo.style.display = 'none';
        mostrarTelaBomTrabalho();
        btnContinuar.removeEventListener('click', showGoodJobScreenListener);
    };
    btnContinuar.addEventListener('click', showGoodJobScreenListener, { once: true });
}

function mostrarTelaBomTrabalho() {
    jogoAtivo = false;
    estadoFase = 'FASE_FINALIZADA';
    telaBomTrabalho.style.display = 'flex';
    // Esconde os elementos da UI fixa quando o jogo termina
    pontuacaoDiv.style.display = 'none';
    vidasContainer.style.display = 'none';
    geloBarContainer.style.display = 'none';
    sombraBarContainer.style.display = 'none';
}

function mostrarTelaDeFalha() {
    jogoAtivo = false;
    estadoFase = 'FALHA';
    if (ondaDisplay) ondaDisplay.style.display = 'none';
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    musicaAcao.pause();
    musicaAcao.currentTime = 0;
    
    // --- CORREÇÃO: O som de game over agora é tocado diretamente ---
    somGameOver.play();
    
    telaFalha.style.display = 'flex';
    pontuacaoDiv.style.display = 'none';
    vidasContainer.style.display = 'none';
    geloBarContainer.style.display = 'none';
    sombraBarContainer.style.display = 'none';
}

function gameOver() {
    jogoAtivo = false;
    estadoFase = 'GAMEOVER';
    if (ondaDisplay) ondaDisplay.style.display = 'none';
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    musicaAcao.pause();
    musicaAcao.currentTime = 0;
    
    // --- CORREÇÃO: O som de game over agora é tocado diretamente ---
    somGameOver.play(); 
    
    updateTexts();
    telaFalha.style.display = 'flex';
    pontuacaoDiv.style.display = 'none';
    vidasContainer.style.display = 'none';
    geloBarContainer.style.display = 'none';
    sombraBarContainer.style.display = 'none';

    player.lives = 0;
    atualizarExpressaoMaelis();
}

function aplicarDanoAoJogador() {
    if (player.invincible) return;
    player.lives--;
        // Adiciona a classe de tremer ao game-container
document.getElementById('game-container').classList.add('shake');
setTimeout(() => {
    // Remove a classe após 100ms
    document.getElementById('game-container').classList.remove('shake');
}, 100);

document.body.classList.add('shake');
setTimeout(() => {
    document.body.classList.remove('shake');
}, 100);
    tocarSom(somDanoMaelis);
    tocarSom(somDaCriatura);
    atualizarVidasUI(); // NOVO: Atualiza a exibição de vidas após sofrer dano
    atualizarExpressaoMaelis(); // Atualiza a expressão da Maelis após sofrer dano
    criarExplosao(player.x, player.y, '#FFA500', 30);
    if (player.lives <= 0) {
        gameOver();
    } else {
        player.invincible = true;
        setTimeout(() => { player.invincible = false; }, 1500);
    }
}

// --- FUNÇÃO ATUALIZADA PARA OS 4 ESTADOS DE VIDA DA MAELIS ---
function atualizarExpressaoMaelis() {
    // Esconde todas as faces primeiro
    maelisNormalFace.style.display = 'none';
    maelisChorandoFace.style.display = 'none';
    maelisDescabeladaFace.style.display = 'none';
    maelisMortaFace.style.display = 'none';

    // Mostra a face correta baseada na proporção de vidas restantes
    // MAX_LIVES = 3
    if (player.lives === MAX_LIVES) { // 3 vidas: Normal
        maelisNormalFace.style.display = 'block';
    } else if (player.lives === MAX_LIVES - 1) { // 2 vidas: Chorando
        maelisChorandoFace.style.display = 'block';
    } else if (player.lives === MAX_LIVES - 2) { // 1 vida: Descabelada
        maelisDescabeladaFace.style.display = 'block';
    } else { // 0 vidas ou menos: Morta
        maelisMortaFace.style.display = 'block';
    }
}

function iniciarProximaOnda() {
    ondaAtual++;
    updateTexts();
    if (ondaDisplay) {
        ondaDisplay.style.display = 'block';
    }
    inimigos = [];
    inimigoTiros = [];
    let numInimigos, baseSpeedVagalume = 1.2, shootIntervalTotem = 3000;
    if (ondaAtual <= 2) numInimigos = inimigosPorOndaInicial;
    else if (ondaAtual === 3) { numInimigos = inimigosHorda3; baseSpeedVagalume = 1.3; shootIntervalTotem = 2800; }
    else if (ondaAtual === 4) { numInimigos = inimigosHorda4; baseSpeedVagalume = 1.4; shootIntervalTotem = 2500; }
    
    // Simplificando o cálculo da posição Y.
    // O primeiro inimigo sempre começa na posição Y = -150px.
    // Os inimigos subsequentes são gerados acima dele, com um espaçamento de 100px.
    // Essa lógica é robusta e não depende de cálculos complexos que possam ter erros.
    const startingYOffset = -150; 
    const enemySpacing = 100;

    for (let i = 0; i < numInimigos; i++) {
        const xPos = originalLimiteEsquerdo + 50 + (Math.random() * (originalLimiteDireito - originalLimiteEsquerdo - 100));
        
        // yPos vai de -150 para -250, -350, etc., garantindo que todos
        // comecem fora da tela.
        const yPos = startingYOffset - (i * enemySpacing);
        
        if (Math.random() < 0.6 || ondaAtual === 1) {
            criarVagalumeCorrompido(xPos, yPos, baseSpeedVagalume + (Math.random() * 0.5));
        } else {
            criarTotem(xPos, yPos, 1.5, shootIntervalTotem, originalCanvasHeight * (0.15 + ondaAtual * 0.04));
        }
    }
}

function criarVagalumeCorrompido(x, y, speed) {
    inimigos.push({ x, y, width: 45, height: 45, speed, hp: 1, tipo: 'VAGALUME', congelado: false });
}

function criarTotem(x, y, speed, shootInterval, stopY) {
    inimigos.push({ x, y, width: 50, height: 70, speed, hp: 4, tipo: 'TOTEM', shootInterval, lastShot: Date.now(), stopY, congelado: false });
}

function atualizarBarraGelo() {
    if (magiaGeloEmCooldown) {
        geloBarContainer.classList.add('cooldown');
        geloBarFill.classList.remove('pronta');
        geloBarFill.style.width = '100%';
    } else {
        geloBarContainer.classList.remove('cooldown');
        const porcentagem = (magiaGeloCarregada / INIMIGOS_PARA_MAGIA) * 100;
        geloBarFill.style.width = `${porcentagem}%`;
        geloBarFill.classList.toggle('pronta', porcentagem >= 100);
    }
}

function ativarModoGelo() {
    if (!magiaGeloDesbloqueada || modoGeloAtivo || magiaGeloEmCooldown || magiaGeloCarregada < INIMIGOS_PARA_MAGIA) return;
    
    modoGeloAtivo = true;
    magiaGeloCarregada = 0;
    atualizarBarraGelo();

    timerModoGelo = setTimeout(() => modoGeloAtivo = false, DURACAO_MODO_GELO);

    magiaGeloEmCooldown = true;
    atualizarBarraGelo();
    timerCooldownGelo = setTimeout(() => {
        magiaGeloEmCooldown = false;
        atualizarBarraGelo();
    }, COOLDOWN_GELO);
}


function atualizarBarraSombra() {
    if (magiaSombraEmCooldown) {
        sombraBarContainer.classList.add('cooldown');
        sombraBarFill.classList.remove('pronta');
        sombraBarFill.style.width = '100%';
    } else {
        sombraBarContainer.classList.remove('cooldown');
        const porcentagem = (magiaSombraCarregada / INIMIGOS_PARA_MAGIA) * 100;
        sombraBarFill.style.width = `${porcentagem}%`;
        sombraBarFill.classList.toggle('pronta', porcentagem >= 100);
    }
}

function ativarModoSombra() {
    if (!magiaSombraDesbloqueada || modoSombraAtivo || magiaSombraEmCooldown || magiaSombraCarregada < INIMIGOS_PARA_MAGIA) return;

    modoSombraAtivo = true;
    magiaSombraCarregada = 0;
    atualizarBarraSombra();

    timerModoSombra = setTimeout(() => {
        modoSombraAtivo = false;
        
        magiaSombraEmCooldown = true;
        atualizarBarraSombra();
        timerCooldownSombra = setTimeout(() => {
            magiaSombraEmCooldown = false;
            atualizarBarraSombra();
        }, COOLDOWN_SOMBRA);

    }, DURACAO_MODO_SOMBRA);
}

function dispararRaioSombra() {
    if (!modoSombraAtivo || !podeAtirarRaioSombra) return;
    somDisparo.play(); // Toca o som de disparo ao usar a magia das sombras

    podeAtirarRaioSombra = false;
    raiosSombra.push({ x: player.x, altura: originalCanvasHeight, alpha: 1.0 });

    const raioEsquerda = player.x - 50 / 2;
    const raioDireita = player.x + 50 / 2;

    for (let i = inimigos.length - 1; i >= 0; i--) {
        const inimigo = inimigos[i];
        const inimigoEsquerda = inimigo.x - inimigo.width / 2;
        const inimigoDireita = inimigo.x + inimigo.width / 2;

        if (inimigoDireita > raioEsquerda && inimigoEsquerda < raioDireita) {
            matarInimigo(inimigo, i);
        }
    }

    setTimeout(() => { podeAtirarRaioSombra = true; }, COOLDOWN_RAIO_SOMBRA);
}


// =======================================================
// ===== FUNÇÕES DE DESENHO E EFEITOS ====================
// =======================================================
function createScaledObject(obj) {
    return {
        x: obj.x * scaleX,
        y: obj.y * scaleY,
        width: obj.width * scaleX,
        height: obj.height * scaleY
    };
}

// removemos createScaledPoint pois não está sendo utilizada diretamente

function criarEstrelas(){
    for (let i = 0; i < 150; i++) {
        estrelas.push({
            x: Math.random() * originalCanvasWidth,
            y: Math.random() * originalCanvasHeight,
            radius: Math.random() * 1.5,
            speed: Math.random() * .4 + .2
        });
    }
}

function desenharEAtualizarEstrelas(){
    ctx.fillStyle = "rgba(173, 216, 230, 0.7)";
    for (const estrela of estrelas) {
        estrela.y += estrela.speed;
        if (estrela.y > originalCanvasHeight) {
            estrela.y = 0;
            estrela.x = Math.random() * originalCanvasWidth;
        }
        const scaledX = estrela.x * scaleX;
        const scaledY = estrela.y * scaleY;
        const scaledRadius = estrela.radius * Math.min(scaleX, scaleY);

        ctx.beginPath();
        ctx.arc(scaledX, scaledY, scaledRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function criarExplosao(x, y, cor, count = 20){
    for (let i = 0; i < count; i++) {
        particulas.push({
            x: x,
            y: y,
            vx: (Math.random() - .5) * 4,
            vy: (Math.random() - .5) * 4,
            radius: Math.random() * 3,
            cor: cor,
            vida: 40
        });
    }
}

function desenharEAtualizarParticulas(){
    for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vida--;
        if (p.vida <= 0) {
            particulas.splice(i, 1);
        } else {
            const scaledX = p.x * scaleX;
            const scaledY = p.y * scaleY;
            const scaledRadius = p.radius * Math.min(scaleX, scaleY);

            ctx.fillStyle = p.cor;
            ctx.globalAlpha = p.vida / 40;
            ctx.beginPath();
            ctx.arc(scaledX, scaledY, scaledRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
}

function desenharAuraGelo() {
    if (!modoGeloAtivo) return;
    ctx.globalAlpha = 0.2 + (Math.sin(Date.now() / 200) * 0.05);
    ctx.fillStyle = '#87CEEB';
    const scaledPlayer = createScaledObject(player);
    ctx.beginPath();
    ctx.arc(scaledPlayer.x, scaledPlayer.y, scaledPlayer.width, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function desenharAuraSombra() {
    if (!modoSombraAtivo) return;
    ctx.globalAlpha = 0.2 + (Math.sin(Date.now() / 200) * 0.05);
    ctx.fillStyle = '#9400D3';
    const scaledPlayer = createScaledObject(player);
    ctx.beginPath();
    ctx.arc(scaledPlayer.x, scaledPlayer.y, scaledPlayer.width, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function desenharRaiosSombra() {
    for (let i = raiosSombra.length - 1; i >= 0; i--) {
        const raio = raiosSombra[i];
        const scaledX = raio.x * scaleX;
        const scaledHeight = raio.altura * scaleY;
        const scaledWidth = 50 * scaleX;

        // Desenha o sprite da magia das sombras, se disponível
        if (shadowMagicImage.complete && shadowMagicImage.naturalWidth > 0) {
            // Ajusta a posição Y para que o raio comece do topo e vá até a base do canvas
            ctx.drawImage(shadowMagicImage, scaledX - scaledWidth / 2, 0, scaledWidth, scaledHeight);
        } else {
            // Fallback para gradiente se a imagem não carregar
            const gradiente = ctx.createLinearGradient(scaledX, 0, scaledX, scaledHeight);
            gradiente.addColorStop(0, `rgba(148, 0, 211, ${raio.alpha})`);
            gradiente.addColorStop(0.5, `rgba(75, 0, 130, ${raio.alpha})`);
            gradiente.addColorStop(1, `rgba(148, 0, 211, ${raio.alpha})`);
            
            ctx.fillStyle = gradiente;
            ctx.fillRect(scaledX - scaledWidth / 2, 0, scaledWidth, scaledHeight);
        }
        
        raio.alpha -= 0.05;
        if (raio.alpha <= 0) {
            raiosSombra.splice(i, 1);
        }
    }
}

function desenharPlayer() {
    ctx.globalAlpha = player.invincible ? (Math.floor(Date.now() / 150) % 2 === 0 ? .9 : .4) : 1;
    const scaledPlayer = createScaledObject(player);

    // <<< ALTERAÇÃO: Usa a imagem atual do jogador (parado ou andando)
    const imageToDraw = player.currentImage;
    if (imageToDraw && imageToDraw.complete && imageToDraw.naturalWidth > 0) {
        ctx.drawImage(imageToDraw, scaledPlayer.x - scaledPlayer.width / 2, scaledPlayer.y - scaledPlayer.height / 2, scaledPlayer.width, scaledPlayer.height);
    } else {
        // Fallback caso a imagem não carregue
        ctx.fillStyle = "blue";
        ctx.fillRect(scaledPlayer.x - scaledPlayer.width / 2, scaledPlayer.y - scaledPlayer.height / 2, scaledPlayer.width, scaledPlayer.height);
    }
    ctx.globalAlpha = 1;
}

// NOVO: Função para atualizar os corações no DOM
function atualizarVidasUI() {
    vidasContainer.innerHTML = ''; // Limpa os corações existentes
    for (let i = 0; i < player.lives; i++) {
        const coracaoDiv = document.createElement('div');
        coracaoDiv.classList.add('coracao');
        coracaoDiv.textContent = '❤️';
        vidasContainer.appendChild(coracaoDiv);
    }
}


function desenharInimigo(inimigo) {
    let img = (inimigo.tipo === 'VAGALUME') ? vagalumeEnemyImage : totemEnemyImage;
    
    if (inimigo.congelado) {
        ctx.filter = 'hue-rotate(180deg) brightness(1.2)';
    }

    const scaledInimigo = createScaledObject(inimigo);
    if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, scaledInimigo.x - scaledInimigo.width / 2, scaledInimigo.y - scaledInimigo.height / 2, scaledInimigo.width, scaledInimigo.height);
    } else { 
        ctx.fillStyle = (inimigo.tipo === 'VAGALUME') ? "#8B008B" : "#A0522D";
        ctx.fillRect(scaledInimigo.x - scaledInimigo.width / 2, scaledInimigo.y - scaledInimigo.height / 2, scaledInimigo.width, scaledInimigo.height);
    }

    ctx.filter = 'none';
}

    function desenharTiro(tiro) {
    const scaledTiro = createScaledObject(tiro);

    // Se o tiro for de gelo, desenha o sprite de gelo
    if (tiro.isIceShot && iceMagicProjectileImage.complete && iceMagicProjectileImage.naturalWidth > 0) {
        ctx.drawImage(iceMagicProjectileImage, scaledTiro.x - scaledTiro.width / 2, scaledTiro.y, scaledTiro.width, scaledTiro.height);
    } 
    // Se o tiro for o padrão (não de gelo), desenha o novo sprite
    else if (!tiro.isIceShot && tiroNormalSprite.complete && tiroNormalSprite.naturalWidth > 0) {
        ctx.drawImage(tiroNormalSprite, scaledTiro.x - scaledTiro.width / 2, scaledTiro.y, scaledTiro.width, scaledTiro.height);
    } 
    // Fallback caso as imagens não carreguem
    else {
        ctx.fillStyle = "#FFFF00"; 
        ctx.shadowColor = "#FFFF00"; 
        ctx.shadowBlur = 15 * Math.min(scaleX, scaleY);
        ctx.fillRect(scaledTiro.x - scaledTiro.width / 2, scaledTiro.y, scaledTiro.width, scaledTiro.height); 
        ctx.shadowBlur = 0; 
    }
}


function desenharTiroInimigo(tiro) {
    const scaledTiro = createScaledObject(tiro);
    if (totemProjectileImage.complete && totemProjectileImage.naturalWidth > 0) {
        ctx.drawImage(totemProjectileImage, scaledTiro.x - scaledTiro.width / 2, scaledTiro.y - scaledTiro.height / 2, scaledTiro.width, scaledTiro.height);
    } else {
        ctx.fillStyle = "#00BFFF";
        ctx.fillRect(scaledTiro.x - scaledTiro.width / 2, scaledTiro.y, scaledTiro.width, scaledTiro.height);
    }
}


// =======================================================
// ===== LOOP PRINCIPAL DO JOGO (ATUALIZAR) ==============
// =======================================================
function atualizar() {
    animationFrameId = requestAnimationFrame(atualizar);
    ctx.clearRect(0, 0, currentCanvasWidth, currentCanvasHeight);
    desenharEAtualizarEstrelas();

    if (!jogoAtivo) {
        desenharEAtualizarParticulas();
        // Garante que o jogador e as vidas sejam desenhados mesmo quando o jogo não está ativo (ex: no diálogo inicial)
        if (estadoFase === 'DIALOGO_INICIAL') {
            desenharPlayer();
        }
        return;
    }

    updateTexts(); // Centraliza a atualização de texto

    if (leftPressed) player.x -= player.speed;
    if (rightPressed) player.x += player.speed;
    player.x = Math.max(originalLimiteEsquerdo + player.width / 2, Math.min(originalLimiteDireito - player.width / 2, player.x));

    tiros.forEach((tiro, index) => {
        tiro.y -= tiro.speed;
        if (tiro.y < -tiro.height) tiros.splice(index, 1);
    });
    raiosSombra = raiosSombra.filter(raio => raio.alpha > 0);

    inimigoTiros.forEach((tiro, index) => {
        tiro.x += tiro.vx;
        tiro.y += tiro.vy;
        if (tiro.y > originalCanvasHeight + tiro.height || tiro.x < 0 || tiro.x > originalCanvasWidth) {
            inimigoTiros.splice(index, 1);
        } else if (!player.invincible && checkCollision(player, tiro)) {
            aplicarDanoAoJogador();
            criarExplosao(tiro.x, tiro.y, '#00BFFF');
            inimigoTiros.splice(index, 1);
        }
    });
    
    for (let i = inimigos.length - 1; i >= 0; i--) {
        handleInimigoMovimentoEAtirar(inimigos[i]);
        handleColisoes(inimigos[i], i);
    }
    
    desenharPlayer();
    desenharAuraGelo();
    desenharAuraSombra();
    desenharRaiosSombra();
    tiros.forEach(desenharTiro);
    inimigoTiros.forEach(desenharTiroInimigo);
    inimigos.forEach(desenharInimigo);
    desenharEAtualizarParticulas();
    
    if (inimigos.length === 0 && inimigoTiros.length === 0 && jogoAtivo) {
        avancarEstadoFase();
    }
}

function handleInimigoMovimentoEAtirar(inimigo) {
    if (inimigo.congelado) return;

    if (inimigo.tipo === 'TOTEM') {
        if (inimigo.y < inimigo.stopY) {
            inimigo.y += inimigo.speed;
        } else {
            if (Date.now() - inimigo.lastShot > inimigo.shootInterval) {
                const speed = 3;
                const angleSpread = Math.PI / 8;
                inimigoTiros.push({ x: inimigo.x, y: inimigo.y, width: 30, height: 30, vx: 0, vy: speed, tipo: 'TOTEM_PROJETIL' }); // Aumentei width e height para 24
                inimigoTiros.push({ x: inimigo.x, y: inimigo.y, width: 30, height: 30, vx: -speed * Math.sin(angleSpread), vy: speed * Math.cos(angleSpread), tipo: 'TOTEM_PROJETIL' }); // Aumentei width e height para 24
                inimigoTiros.push({ x: inimigo.x, y: inimigo.y, width: 30, height: 30, vx: speed * Math.sin(angleSpread), vy: speed * Math.cos(angleSpread), tipo: 'TOTEM_PROJETIL' }); // Aumentei width e height para 24
                inimigo.lastShot = Date.now();
            }
        }
    } else { 
        inimigo.y += inimigo.speed;
    }
}

function handleColisoes(inimigo, index) {
    if (!inimigos[index]) return; 

    for (let j = tiros.length - 1; j >= 0; j--) {
        if (checkCollision(inimigo, tiros[j])) {
            inimigo.hp--;
            criarExplosao(tiros[j].x, tiros[j].y, tiros[j].isIceShot ? '#87CEEB' : '#FFFF00');

            if (tiros[j].isIceShot && inimigo.hp > 0 && !inimigo.congelado && inimigo.tipo !== 'VAGALUME') {
                inimigo.congelado = true;
                setTimeout(() => {
                    if (inimigos.includes(inimigo)) inimigo.congelado = false;
                }, DURACAO_CONGELAMENTO);
            }
            
            tiros.splice(j, 1);
            if (inimigo.hp <= 0) matarInimigo(inimigo, index);
            return;
        }
    }
    
    if (!player.invincible && checkCollision(player, inimigo)) {
        aplicarDanoAoJogador();
        matarInimigo(inimigo, index);
        return;
    }
    
    // === ALTERAÇÃO: Jogo só termina quando o inimigo estiver completamente fora da tela ===
    if (inimigo.y - inimigo.height / 2 > originalCanvasHeight) { // inimigo.y é o centro, então subtrai metade da altura para a borda superior
        inimigos.splice(index, 1); // Remove o inimigo que escapou
        
        if (!primeiroAvisoDado) {
            primeiroAvisoDado = true;
            mostrarAvisoDeEscape(); // Mostra o aviso na primeira vez
        } else {
            gameOver(); // Game Over no segundo inimigo que escapar
        }
        return; // Garante que não continue processando o inimigo removido
    }
}

function matarInimigo(inimigo, index){
    criarExplosao(inimigo.x, inimigo.y, '#FF00FF', 30);
    pontos += (inimigo.tipo === 'TOTEM' ? 25 : 10);
    // pontuacaoDiv.textContent = "Pontos: " + pontos; // Removido para centralizar em updateTexts()
    
    if (magiaGeloDesbloqueada && !magiaGeloEmCooldown && magiaGeloCarregada < INIMIGOS_PARA_MAGIA) {
        magiaGeloCarregada++;
        atualizarBarraGelo();
    }
    if (magiaSombraDesbloqueada && !magiaSombraEmCooldown && magiaSombraCarregada < INIMIGOS_PARA_MAGIA) {
        magiaSombraCarregada++;
        atualizarBarraSombra();
    }

    inimigos.splice(index, 1);
}

function checkCollision(obj1, obj2) {
    const obj1L = obj1.x - obj1.width / 2;
    const obj1R = obj1.x + obj1.width / 2;
    const obj1T = obj1.y - obj1.height / 2;
    const obj1B = obj1.y + obj1.height / 2;
    const obj2L = obj2.x - obj2.width / 2;
    const obj2R = obj2.x + obj2.width / 2;
    const obj2T = obj2.y - obj2.height / 2;
    const obj2B = obj2.y + obj2.height / 2;
    return obj1R > obj2L && obj1L < obj2R && obj1B > obj2T && obj1T < obj2B;
}

// <<< ALTERAÇÃO: Nova função para mostrar o aviso de escape de inimigo
function mostrarAvisoDeEscape() {
    if (avisoEscape.style.display === 'block' && avisoEscape.style.opacity === '1') return; // Evita mostrar o aviso múltiplas vezes seguidas
    avisoEscape.style.display = 'block';
    avisoEscape.style.opacity = 1;
    setTimeout(() => {
        avisoEscape.style.opacity = 0;
        setTimeout(() => {
            avisoEscape.style.display = 'none';
        }, 500); // Tempo para a transição de opacidade
    }, 3500); // Tempo que o aviso fica visível
}


// =======================================================
// ===== LISTENERS DE EVENTOS ============================
// =======================================================
document.addEventListener("keydown", (e) => {
    if (!jogoAtivo) return;
    
    // <<< ALTERAÇÃO: Atualiza a imagem do jogador ao pressionar a tecla
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        leftPressed = true;
        player.currentImage = maelisEsquerdaImage;
    }
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        rightPressed = true;
        player.currentImage = maelisDireitaImage;
    }
    
    // --- Lógica de Disparo com Cadência ---
    if (e.key === " ") { // Removido o '!spacePressed' para permitir manter pressionado
        const currentTime = Date.now();
        if ((currentTime - lastShotTime > shotCooldown)) {
            tocarSom(somDisparo);
            tiros.push({ 
                x: player.x,
                y: player.y - player.height / 2, 
                // --- NOVO CÓDIGO COM NOVAS DIMENSÕES PARA O SPRITE NORMAL ---
            width: modoGeloAtivo ? 15 : 15,
            height: modoGeloAtivo ? 25 : 20,
                speed: 10,
                isIceShot: modoGeloAtivo
            });
            lastShotTime = currentTime; // Atualiza o tempo do último tiro
        }
    }
    // Fim da Lógica de Disparo com Cadência

    if (e.key.toLowerCase() === "z") {
        ativarModoGelo();
    }
    
    if (e.key === "Shift") {
        if (!shiftPressed) {
            shiftPressed = true;
            if (!modoSombraAtivo) {
                ativarModoSombra();
            } else {
                dispararRaioSombra();
            }
        }
    }
});

document.addEventListener("keyup", (e) => {
    // <<< ALTERAÇÃO: Lógica para voltar à imagem parada ou manter a de movimento
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        leftPressed = false;
        // Se a tecla da direita ainda estiver pressionada, muda para a imagem da direita, senão, para.
        if (rightPressed) {
            player.currentImage = maelisDireitaImage;
        } else {
            player.currentImage = maelisParadaImage;
        }
    }
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        rightPressed = false;
        // Se a tecla da esquerda ainda estiver pressionada, muda para a imagem da esquerda, senão, para.
        if (leftPressed) {
            player.currentImage = maelisEsquerdaImage;
        } else {
            player.currentImage = maelisParadaImage;
        }
    }
    if (e.key === " ") spacePressed = false;
    if (e.key === "Shift") shiftPressed = false;
});

btnVoltarMenuFase.addEventListener("click", () => { 
    somClick.play(); // Toca o som de clique
    musicaVitoria.pause(); // Pausa a música de vitória
    musicaVitoria.currentTime = 0; // Volta para o início
    window.location.href = 'selecaoDeFases.html'; 

});
btnTentarNovamente.addEventListener("click", () => {
    somClick.play(); // Toca o som de clique
    somGameOver.pause(); // Pausa o som de game over
    somGameOver.currentTime = 0; // Volta para o início
    inicializar();
});
btnVoltarMenuFalha.addEventListener("click", () => {
    somClick.play(); // Toca o som de clique
    somGameOver.pause(); // Pausa o som de game over
    somGameOver.currentTime = 0; // Volta para o início
    // Limpa o tempo da música salvo no localStorage para reiniciar no menu
        localStorage.removeItem('currentMenuMusicTime');
    window.location.href = '../../Menu/menu.html#menu-principal'; // Redireciona para o menu principal
})
btnVoltarMenuFinal.addEventListener("click", () => {
    somClick.play(); // Toca o som de clique
    musicaVitoria.pause(); // Pausa a música de vitória
    musicaVitoria.currentTime = 0; // Volta para o início
    // Limpa o tempo da música salvo no localStorage para reiniciar no menu
        localStorage.removeItem('currentMenuMusicTime');
    window.location.href = '../../Menu/menu.html#menu-principal'; // Redireciona para o menu principal
});

// Adiciona listener para som de hover nos botões
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        somHover.play();
    });
});