// =======================================================
// --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
// =======================================================
const prologoContainer = document.getElementById("prologo-container");
const prologoTexto = document.getElementById("prologo-texto"); // Adicionado para tradução
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");
const pontuacaoDiv = document.getElementById("pontuacao");
const ondaDisplay = document.getElementById("onda-display");
const caixaDialogo = document.getElementById("caixa-dialogo");
const textoDialogo = document.getElementById("texto-dialogo");
const btnContinuar = document.getElementById("btn-continuar");
const fimDeFaseDiv = document.getElementById("fim-de-fase");
const btnVoltarMenuFase = document.getElementById("btnVoltarMenuFase");
const telaFalha = document.getElementById("tela-falha");
const btnTentarNovamente = document.getElementById("btn-tentar-novamente");
const btnVoltarMenuFalha = document.getElementById("btn-voltar-menu-falha");
const bossUi = document.getElementById("boss-ui");
const bossHealthBar = document.getElementById("boss-health-bar");
const btnPularPrologo = document.getElementById("btn-pular-prologo");
const magicBarContainer = document.getElementById("magic-bar-container");
const magicBarFill = document.getElementById("magic-bar-fill");
const fireMagicBarContainer = document.getElementById("fire-magic-bar-container");
const fireMagicBarFill = document.getElementById("fire-magic-bar-fill");
const geloBarContainer = document.getElementById("gelo-bar-container");
const geloBarFill = document.getElementById("gelo-bar-fill");
const vidasContainer = document.getElementById("vidas-container");
const escudosContainer = document.getElementById("escudos-container"); // NOVO: Seleciona o container dos escudos


// --- Elementos de Áudio ---
const somClick = document.getElementById('som-click');
const somHover = document.getElementById('som-hover');
const somGameOver = document.getElementById('som-game-over');
const somDisparo = document.getElementById('som-disparo');
const somDanoMaelis = document.getElementById("dano-maelis");
const somDaCriatura = document.getElementById("som-da-criatura");
const somVitoria = document.getElementById("som-vitoria");
const somHabilidade = document.getElementById("som-habilidade");
const musicaAcao = document.getElementById('musica-acao');

// --- NOVOS ELEMENTOS DE IMAGEM DA REAÇÃO DA MAELIS (selecionados do DOM) ---
const maelisNormalFace = document.getElementById("maelis-normal");
const maelisChorandoFace = document.getElementById("maelis-chorando");
const maelisDescabeladaFace = document.getElementById("maelis-descabelada");
const maelisMortaFace = document.getElementById("maelis-morta");

// =======================================================
// --- 2. MOTOR DE CONFIGURAÇÕES, TRADUÇÃO E ÁUDIO ---
// =======================================================

let settings = { music: true, sfx: true, language: 'pt' };

const fase3LangData = {
    'pt': {
        titulo_pagina: "Maelis: Fase 3 - Jardim Corrompido",
        prologo_texto: `<p>No coração da floresta ancestral, o Jardim de Gorgóvia era um santuário de vida...</p><p>...até a chegada da Névoa Sombria.</p><p>A corrupção se espalhou como uma praga, retorcendo a natureza e enlouquecendo seu espírito guardião.</p><p>Agora, apenas uma pessoa ousa entrar...</p><p>Maelis, a última maga elemental, em uma missão para purificar o Jardim...</p><p id="ultimo-paragrafo">...ou perecer na escuridão.</p>`,
        prologo_aviso: "Pressione ESPAÇO para começar",
        btn_pular_prologo: "Pular Prólogo",
        pontos: "Pontos:",
        onda: "Onda",
        magia_sombra: "Magia das Sombras",
        magia_fogo: "Magia de Fogo",
        magia_gelo: "Magia de Gelo",
        boss_nome: "Gorgóvia, A Sombra Errante",
        btn_continuar: "Continuar",
        vitoria_titulo: "Jardim Purificado!",
        vitoria_texto: "A Sombra se desfez... A caçada terminou.",
        btn_voltar_menu: "Voltar ao Menu",
        falha_titulo: "Você foi corrompido.",
        falha_texto: "A escuridão venceu desta vez.",
        btn_tentar_novamente: "Tentar Novamente",
        dialogo_magia_fogo: "A energia neste lugar é opressora... mas sinto um novo poder despertar! Minha magia agora queima com FOGO!",
        dialogo_pre_boss: "Sinto uma presença... não é uma planta, é um caçador. A Sombra Errante do jardim. Estranho... não sinto meus poderes especiais fluindo perto dele.",
        dialogo_final: "A Sombra se desfez... A caçada terminou. O jardim pode respirar de novo.",
        falha_cacado: "Você foi caçado.",
        falha_escapou: "Um inimigo escapou!"
    },
    'en': {
        titulo_pagina: "Maelis: Phase 3 - Corrupted Garden",
        prologo_texto: `<p>In the heart of the ancient forest, Gorgovia's Garden was a sanctuary of life...</p><p>...until the arrival of the Shadow Mist.</p><p>The corruption spread like a plague, twisting nature and maddening its guardian spirit.</p><p>Now, only one person dares to enter...</p><p>Maelis, the last elemental mage, on a mission to purify the Garden...</p><p id="ultimo-paragrafo">...or perish in the darkness.</p>`,
        prologo_aviso: "Press SPACE to start",
        btn_pular_prologo: "Skip Intro",
        pontos: "Score:",
        onda: "Wave",
        magia_sombra: "Shadow Magic",
        magia_fogo: "Fire Magic",
        magia_gelo: "Ice Magic",
        boss_nome: "Gorgovia, The Wandering Shadow",
        btn_continuar: "Continue",
        vitoria_titulo: "Garden Purified!",
        vitoria_texto: "The Shadow has faded... The hunt is over.",
        btn_voltar_menu: "Back to Menu",
        falha_titulo: "You have been corrupted.",
        falha_texto: "The darkness won this time.",
        btn_tentar_novamente: "Try Again",
        dialogo_magia_fogo: "The energy in this place is oppressive... but I feel a new power awakening! My magic now burns with FIRE!",
        dialogo_pre_boss: "I feel a presence... it's not a plant, it's a hunter. The Wandering Shadow of the garden. Strange... I don't feel my special powers flowing near it.",
        dialogo_final: "The Shadow has faded... The hunt is over. The garden can breathe again.",
        falha_cacado: "You have been hunted.",
        falha_escapou: "An enemy escaped!"
    },
    'es': {
        titulo_pagina: "Maelis: Fase 3 - Jardín Corrupto",
        prologo_texto: `<p>En el corazón del bosque ancestral, el Jardín de Gorgovia era un santuario de vida...</p><p>...hasta la llegada de la Niebla Oscura.</p><p>La corrupción se extendió como una plaga, retorciendo la naturaleza y enloqueciendo a su espíritu guardián.</p><p>Ahora, solo una persona se atreve a entrar...</p><p>Maelis, la última maga elemental, en una misión para purificar el Jardín...</p><p id="ultimo-paragrafo">...o perecer en la oscuridad.</p>`,
        prologo_aviso: "Presiona ESPACIO para empezar",
        btn_pular_prologo: "Saltar Intro",
        pontos: "Puntos:",
        onda: "Oleada",
        magia_sombra: "Magia de Sombras",
        magia_fogo: "Magia de Fuego",
        magia_gelo: "Magia de Hielo",
        boss_nome: "Gorgovia, La Sombra Errante",
        btn_continuar: "Continuar",
        vitoria_titulo: "¡Jardín Purificado!",
        vitoria_texto: "La Sombra se ha desvanecido... La caza ha terminado.",
        btn_voltar_menu: "Volver al Menú",
        falha_titulo: "Has sido corrompido.",
        falha_texto: "La oscuridad ha vencido esta vez.",
        btn_tentar_novamente: "Intentar de Nuevo",
        dialogo_magia_fogo: "La energía en este lugar es opresiva... ¡pero siento un nuevo poder despertar! ¡Mi magia ahora arde con FUEGO!",
        dialogo_pre_boss: "Siento una presencia... no es una planta, es un cazador. La Sombra Errante del jardín. Extraño... no siento mis poderes especiales fluir cerca de él.",
        dialogo_final: "La Sombra se ha desvanecido... La caza ha terminado. El jardín puede respirar de nuevo.",
        falha_cacado: "Has sido cazado.",
        falha_escapou: "¡Un enemigo escapó!"
    }
};

function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('maelis-settings'));
    if (savedSettings) {
        settings = { ...settings, ...savedSettings };
    }
    // Adicione esta linha para aplicar as configurações de áudio
    applyAudioSettings();
}

function applyAudioSettings() {
    if (settings.music) {
        musicaAcao.muted = false;
        // somVitoria é um SFX, então não está aqui
        somGameOver.muted = false; // CORREÇÃO: O som de game over é tratado como música
    } else {
        musicaAcao.muted = true;
        // somVitoria é um SFX, então não está aqui
        somGameOver.muted = true; // CORREÇÃO: O som de game over é tratado como música
    }
    somVitoria.muted = !settings.sfx; // CORREÇÃO: somVitoria é um efeito sonoro
    somClick.muted = !settings.sfx;
    somHover.muted = !settings.sfx;
    somDisparo.muted = !settings.sfx;
    somDanoMaelis.muted = !settings.sfx;
    somDaCriatura.muted = !settings.sfx;
    // O som somHabilidade não está aqui, mas o somVitoria agora está
}

function updateTexts() {
    const texts = fase3LangData[settings.language];
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
    if (prologoTexto) prologoTexto.innerHTML = texts.prologo_texto;
}

function tocarSom(somElement) {
    if (settings.sfx && somElement) {
        somElement.currentTime = 0;
        somElement.play().catch(e => console.error("Erro ao tocar SFX:", e));
    }
}

function tocarMusica(musicaElement) {
    if (settings.music && musicaElement) {
        musicaElement.loop = (musicaElement.id === 'musica-acao');
        musicaElement.currentTime = 0;
        musicaElement.play().catch(e => console.error("Erro ao tocar música:", e));
    }
}

function pararMusica(musicaElement) {
    if (musicaElement) {
        musicaElement.pause();
        musicaElement.currentTime = 0;
    }
}


// =======================================================
// --- 3. ESTADO DO JOGO E CARREGAMENTO DE ASSETS ---
// =======================================================

// --- Configurações de Volume ---
if (somDisparo) somDisparo.volume = 0.1;
if (musicaAcao) musicaAcao.volume = 0.2;
if (somVitoria) somVitoria.volume = 0.2;
if (somHover) somHover.volume = 0.3;
if (somGameOver) somGameOver.volume = 0.2;
if (somClick) somClick.volume = 0.3;
if (somDanoMaelis) somDanoMaelis.volume = 0.3;
if (somDaCriatura) somDaCriatura.volume = 0.3;
if (somHabilidade) somHabilidade.volume = 0.4;

// --- Constantes e Variáveis de Estado ---
const totalDeOndas = 8;
const MAX_LIVES = 3; // Maelis começa com 3 vidas, então 4 estados de reação
let player, tiros = [], inimigos = [], particulas = [], ambiente, raiosSombra = [];
let projeteisInimigos, boss, ataquesChefe;
let leftPressed = false, rightPressed = false, spacePressed = false, shiftPressed = false;
let jogoAtivo = false;
let estadoFase = 'PROLOGO';
let ondaAtual = 0;
let pontos = 0;
let animationFrameId;
let prologoAvisoMostrado = false;
let magiaSombraDesbloqueada = false;
let barraMagiaSombraAtual = 0;
const inimigosParaMagiaSombra = 5;
const DURACAO_MODO_SOMBRA = 10000;
const COOLDOWN_SOMBRA = 25000;
const COOLDOWN_RAIO_SOMBRA = 400;
let modoSombraAtivo = false;
let magiaSombraEmCooldown = false;
let podeAtirarRaioSombra = true;
let timerModoSombra = null;
let timerCooldownSombra = null;
let fireMagicUnlocked = false;
let fireMagicCharge = 0;
const enemiesToChargeFireMagic = 7;
let fireExplosionActive = false;
let fireExplosionTimer = 0;
const fireExplosionDuration = 30;
const fireExplosionRadius = 200;
let magiaGeloDesbloqueada = false;
let magiaGeloCarregada = 0;
let modoGeloAtivo = false;
let magiaGeloEmCooldown = false;
let timerModoGelo = null;
let timerCooldownGelo = null;
const INIMIGOS_PARA_MAGIA_GELO = 10;
const DURACAO_MODO_GELO = 10000;
const COOLDOWN_GELO = 20000;
const DURACAO_CONGELAMENTO = 3000;
let inimigosEscapadosCount = 0;
const MAX_INIMIGOS_ESCAPED = 1;

// --- Variáveis para Cadência de Tiro ---
let canShoot = true; // Permite o primeiro tiro
const SHOT_COOLDOWN_NORMAL = 3330 / 8; // Cadência normal
const SHOT_COOLDOWN_FIRE = 3330 / 16; // Cadência melhorada (mais rápida)
let shotCooldown = SHOT_COOLDOWN_NORMAL; // Inicia com a cadência normal
let lastShotTime = 0; // Armazena o timestamp do último tiro

// --- Imagens do Player e Inimigos ---
const maelisParadaImg = new Image();
maelisParadaImg.src = 'assets/Maelis_de_costas_parada.png';
const maelisDireitaImg = new Image();
maelisDireitaImg.src = 'assets/Maelis_de_costas_1.png';
const maelisEsquerdaImg = new Image();
maelisEsquerdaImg.src = 'assets/Maelis_de_costas_2.png';
let aranhaInimigoImage = new Image();
aranhaInimigoImage.src = 'assets/aranha-inimigo1.png';
let totemInimigoImage = new Image();
totemInimigoImage.src = 'assets/totem-inimigo.png';
let vagalumeInimigoImage = new Image();
vagalumeInimigoImage.src = 'assets/vagalume-inimigo.png';
let bossImage = new Image();
bossImage.src = 'assets/Bossfase_3.png';
const florInimigoImage = new Image();
florInimigoImage.src = 'assets/flor_inimiga.png';
const projetilFlorImage = new Image();
projetilFlorImage.src = 'assets/projetil_florinimiga.png';
const projetilTotemImage = new Image();
projetilTotemImage.src = 'assets/projetil-totem.png';

// --- Sprites de Reação da Maelis (como objetos Image para carregar) ---
const maelisNormalFaceImg = new Image();
maelisNormalFaceImg.src = 'assets/maelis-face-normal.png';
const maelisChorandoFaceImg = new Image();
maelisChorandoFaceImg.src = 'assets/maelis-face-chorando.png';
const maelisDescabeladaFaceImg = new Image();
maelisDescabeladaFaceImg.src = 'assets/maelis-face-descabelada.png';
const maelisMortaFaceImg = new Image();
maelisMortaFaceImg.src = 'assets/maelis-face-morta.png';

// --- Imagens para Magias ---
let magiaNormalImage = new Image();
magiaNormalImage.src = 'assets/magia-normal.png';
let magiaDasSombrasImage = new Image();
magiaDasSombrasImage.src = 'assets/magia-das-sombras.png';
let magiaDeFogoImage = new Image();
magiaDeFogoImage.src = 'assets/magia-de-fogo.png';
let iceMagicProjectileImage = new Image();
iceMagicProjectileImage.src = 'assets/magia-de-gelo.png';
const bossProjetilImage = new Image();
bossProjetilImage.src = 'assets/fogoP_faseboss3.png';
const bossInvestidaImage = new Image();
bossInvestidaImage.src = 'assets/fogoG_faseboss3.png';
const ataqueEspinhosImage = new Image();
ataqueEspinhosImage.src = 'assets/Espinhos.png';

// Array para todas as imagens a serem carregadas
const imagesToLoad = [
    maelisParadaImg, maelisDireitaImg, maelisEsquerdaImg,
    aranhaInimigoImage, totemInimigoImage, vagalumeInimigoImage,
    bossImage, florInimigoImage, projetilFlorImage, projetilTotemImage,
    magiaDasSombrasImage, magiaDeFogoImage, iceMagicProjectileImage, magiaNormalImage,
    bossProjetilImage, bossInvestidaImage, ataqueEspinhosImage, maelisNormalFaceImg, maelisChorandoFaceImg, maelisDescabeladaFaceImg, maelisMortaFaceImg // NOVAS IMAGENS DE REAÇÃO
];
let imagesLoadedCount = 0;

function imageLoaded() {
    imagesLoadedCount++;
    if (imagesLoadedCount === imagesToLoad.length) {
        console.log("Todas as imagens carregadas!");
    }
}

imagesToLoad.forEach(img => {
    img.onload = imageLoaded;
    img.onerror = () => {
        console.error("FALHA AO CARREGAR IMAGEM: " + img.src);
        imageLoaded();
    };
});


// =======================================================
// ===== CONTROLE DE FLUXO E ESTADO DA FASE ==============
// =======================================================

function comecarJogo() {
    if (estadoFase !== 'PROLOGO') return;
    prologoContainer.style.display = 'none';
    gameContainer.style.display = 'flex'; 
    inicializar();
}

function atualizarExpressaoMaelis() {
    if (!player) return; // Adiciona verificação para evitar erro se player for nulo
    maelisNormalFace.style.display = 'none';
    maelisChorandoFace.style.display = 'none';
    maelisDescabeladaFace.style.display = 'none';
    maelisMortaFace.style.display = 'none';

    if (player.lives === MAX_LIVES) {
        maelisNormalFace.style.display = 'block';
    } else if (player.lives === MAX_LIVES - 1) {
        maelisChorandoFace.style.display = 'block';
    } else if (player.lives === MAX_LIVES - 2) {
        maelisDescabeladaFace.style.display = 'block';
    } else {
        maelisMortaFace.style.display = 'block';
    }
}

function inicializar() {
    pararMusica(musicaAcao);
    pararMusica(somVitoria);
    pararMusica(somGameOver);

    cancelAnimationFrame(animationFrameId);
    document.querySelectorAll('.lance-warning-area').forEach(el => el.remove());
    prologoAvisoMostrado = false;

    pontuacaoDiv.style.display = 'block';

    player = {
        x: canvas.width / 2,
        y: canvas.height - 80,
        width: 55,
        height: 70,
        speed: 6,
        lives: MAX_LIVES,
        shields: 3,
        invincible: false,
        imagemAtual: maelisParadaImg
    };

    tiros = [];
    inimigos = [];
    particulas = [];
    projeteisInimigos = [];
    ataquesChefe = [];
    raiosSombra = [];
    boss = null;
    leftPressed = false;
    rightPressed = false;
    spacePressed = false;
    shiftPressed = false;
    pontos = 0;
    ondaAtual = 0;
    jogoAtivo = true;
    estadoFase = 'GAMEPLAY';
    inimigosEscapadosCount = 0;

    // --- ADICIONE ESTA LINHA AQUI ---
shotCooldown = SHOT_COOLDOWN_NORMAL;
// ---------------------------------

    magiaSombraDesbloqueada = true;
    barraMagiaSombraAtual = 0;
    modoSombraAtivo = false;
    magiaSombraEmCooldown = false;
    podeAtirarRaioSombra = true;
    clearTimeout(timerModoSombra);
    clearTimeout(timerCooldownSombra);

    fireMagicUnlocked = false;
    fireMagicCharge = 0;
    fireExplosionActive = false;
    fireExplosionTimer = 0;

    magiaGeloDesbloqueada = true;
    magiaGeloCarregada = 0;
    modoGeloAtivo = false;
    magiaGeloEmCooldown = false;
    clearTimeout(timerModoGelo);
    clearTimeout(timerCooldownGelo);


    updateTexts();
    caixaDialogo.style.display = 'none';
    fimDeFaseDiv.style.display = 'none';
    telaFalha.style.display = 'none';
    bossUi.style.display = 'none';
    ondaDisplay.style.display = 'none';
    bossHealthBar.className = 'boss-health-bar';

    if (magicBarContainer) {
        magicBarContainer.style.display = 'flex';
        magicBarContainer.classList.remove('cooldown');
    }
    if (magicBarFill) { magicBarFill.style.width = '0%'; magicBarFill.classList.remove('pronta'); }

    if (fireMagicBarContainer) fireMagicBarContainer.style.display = 'none';
    if (fireMagicBarFill) fireMagicBarFill.style.width = '0%';
    
    if (geloBarContainer) {
        geloBarContainer.style.display = 'flex';
        geloBarContainer.classList.remove('cooldown');
    }
    if (geloBarFill) { geloBarFill.style.width = '0%'; geloBarFill.classList.remove('pronta'); }


    criarAmbiente();
    atualizarVidasUI();
    atualizarExpressaoMaelis();
    
    iniciarProximaOnda(); 

    tocarMusica(musicaAcao);
    
    atualizar();
}

function avancarEstadoFase() {
    const texts = fase3LangData[settings.language];
    switch(estadoFase) {
        case 'GAMEPLAY':
            if (ondaAtual >= totalDeOndas && inimigos.length === 0 && projeteisInimigos.length === 0) {
                estadoFase = 'PRE_BOSS';
                mostrarDialogoPreBoss();
            } else if (inimigos.length === 0 && projeteisInimigos.length === 0) {
                if (ondaAtual === 3 && !fireMagicUnlocked) {
                    fireMagicUnlocked = true;
                    shotCooldown = SHOT_COOLDOWN_FIRE; // <<< ADICIONE ESTA LINHA AQUI
                    if (fireMagicBarContainer) fireMagicBarContainer.style.display = 'flex';
                    textoDialogo.textContent = texts.dialogo_magia_fogo;
                    caixaDialogo.style.display = 'block';
                    estadoFase = 'NARRATIVA_MAGIA';
                } else {
                    iniciarProximaOnda();
                }
            }
            break;

        case 'NARRATIVA_MAGIA':
            caixaDialogo.style.display = 'none';
            estadoFase = 'GAMEPLAY';
            iniciarProximaOnda();
            break;

        case 'PRE_BOSS':
            caixaDialogo.style.display = 'none';
            iniciarLutaChefe();
            break;

        case 'BOSS_DERROTADO':
            bossUi.style.display = 'none';
            estadoFase = 'NARRATIVA_FINAL';
            pararMusica(musicaAcao);
            tocarMusica(somVitoria);
            mostrarDialogoFinal();
            break;

        case 'NARRATIVA_FINAL':
            caixaDialogo.style.display = 'none';
            fimDeFaseDiv.style.display = 'block';
            estadoFase = 'FIM';
            jogoAtivo = false;
            const progressoAtual = localStorage.getItem('nivelConcluido') || '0';
            if (parseInt('3') > parseInt(progressoAtual)) {
                localStorage.setItem('nivelConcluido', '3');
            }
            break;
    }
}

function mostrarDialogoMagia(tipo) {
    const texts = fase3LangData[settings.language];
    if (tipo === 'fogo') {
        textoDialogo.textContent = texts.dialogo_magia_fogo;
    }
    caixaDialogo.style.display = 'block';
}

function mostrarDialogoPreBoss() {
    const texts = fase3LangData[settings.language];
    textoDialogo.textContent = texts.dialogo_pre_boss;
    caixaDialogo.style.display = 'block';
}

function mostrarDialogoFinal() {
    const texts = fase3LangData[settings.language];
    textoDialogo.textContent = texts.dialogo_final;
    caixaDialogo.style.display = 'block';
}

function gameOver(motivoKey) {
    jogoAtivo = false;
    estadoFase = 'FALHA';
    const texts = fase3LangData[settings.language];
    const falhaTituloEl = document.getElementById('falha-titulo');
    
    if (falhaTituloEl) {
        falhaTituloEl.textContent = texts[motivoKey] || texts.falha_titulo;
    }

    telaFalha.style.display = 'flex';
    pararMusica(musicaAcao);
    if(somGameOver) somGameOver.loop = false;
    tocarMusica(somGameOver); // CORREÇÃO: Agora usa tocarMusica()

    player.lives = 0;
    atualizarExpressaoMaelis();
}

function aplicarDanoAoJogador(dano = 1) {
    if (player.invincible) return;
    document.getElementById('game-container').classList.add('shake');
    setTimeout(() => {
        document.getElementById('game-container').classList.remove('shake');
    }, 100);

    document.body.classList.add('shake');
    setTimeout(() => {
        document.body.classList.remove('shake');
    }, 100);
    tocarSom(somDanoMaelis);
    tocarSom(somDaCriatura);
    triggerScreenShake();
    if (player.shields > 0) {
        player.shields -= dano;
        criarExplosao(player.x, player.y, '#00BFFF', 30);
    } else if (player.lives > 0) {
        player.lives -= dano;
        criarExplosao(player.x, player.y, '#FFA500', 30);
    }
    atualizarVidasUI();
    atualizarExpressaoMaelis();
    if (player.lives <= 0) {
        gameOver("falha_cacado");
    } else {
        player.invincible = true;
        setTimeout(() => { player.invincible = false; }, 1500);
    }
}

function triggerScreenShake() {
    gameContainer.classList.add('screenshake');
    setTimeout(() => { gameContainer.classList.remove('screenshake'); }, 500);
}

function iniciarProximaOnda() {
    ondaAtual++;
    updateTexts();
    ondaDisplay.style.display = 'block';

    inimigos = [];
    projeteisInimigos = [];

    const numInimigos = ondaAtual <= 3 ? 9 : (ondaAtual <= 5 ? 12 : 15);
    for (let i = 0; i < numInimigos; i++) {
        const randomX = Math.random() * (canvas.width - 100) + 50;
        const randomY = -50 - (Math.random() * 400);
        if (ondaAtual <= 1) {
            criarInimigo('ARANHA', randomX, randomY);
        } else if (ondaAtual <= 3) {
            const tipo = Math.random() < 0.6 ? 'ARANHA' : 'VAGALUME';
            criarInimigo(tipo, randomX, randomY);
        } else if (ondaAtual <= 5) {
            const rand = Math.random();
            if (rand < 0.45) criarInimigo('ARANHA', randomX, randomY);
            else if (rand < 0.8) criarInimigo('VAGALUME', randomX, randomY);
            else criarInimigo('FLOR', randomX, -50);
        } else {
            const rand = Math.random();
            if (rand < 0.4) criarInimigo('ARANHA', randomX, randomY);
            else if (rand < 0.7) criarInimigo('VAGALUME', randomX, randomY);
            else if (rand < 0.9) criarInimigo('FLOR', randomX, -50);
            else criarInimigo('TOTEM', randomX, -50);
        }
    }
}

function criarInimigo(tipo, x, y) {
    let inimigo = { x, y, tipo, hp: 1, image: null, congelado: false };
    switch (tipo) {
        case 'ARANHA':
            Object.assign(inimigo, { width: 40, height: 30, speed: 1.2 + Math.random() * 0.5, hp: 1, image: aranhaInimigoImage });
            break;
        case 'VAGALUME':
            Object.assign(inimigo, { width: 35, height: 35, speed: 1.8 + Math.random() * 0.7, hp: 1, image: vagalumeInimigoImage });
            break;
        case 'FLOR':
            Object.assign(inimigo, { width: 60, height: 80, speed: 0.5, hp: 4, static: true, shootCooldown: 0, shootRate: 120, image: florInimigoImage });
            break;
        case 'TOTEM':
            Object.assign(inimigo, { width: 60, height: 80, speed: 0.3, hp: 4, static: true, shootCooldown: 0, shootRate: 180, image: totemInimigoImage });
            break;
    }
    inimigos.push(inimigo);
}

function atualizarInimigos() {
    for (let i = inimigos.length - 1; i >= 0; i--) {
        const inimigo = inimigos[i];
        if (inimigo.congelado) {
            inimigo.shootCooldown = 0;
            continue;
        }

        if (jogoAtivo) {
            if (inimigo.static && inimigo.y < 150) {
                inimigo.y += inimigo.speed;
            } else if (!inimigo.static) {
                inimigo.y += inimigo.speed;
            }
            if (inimigo.tipo === 'FLOR' || inimigo.tipo === 'TOTEM') {
                inimigo.shootCooldown++;
                if (inimigo.shootCooldown >= inimigo.shootRate) {
                    inimigo.shootCooldown = 0;
                    for (let j = -1; j <= 1; j++) {
                        if (inimigo.tipo === 'TOTEM') {
                            projeteisInimigos.push({ x: inimigo.x, y: inimigo.y + inimigo.height / 2, width: 50, height: 50, vx: j * 1.5, vy: 3, tipo: 'PEDRA', image: projetilTotemImage });
                        } else {
                            projeteisInimigos.push({ x: inimigo.x, y: inimigo.y + inimigo.height / 2, width: 50, height: 50, speed: 4, tipo: 'GOSMA', image: projetilFlorImage });
                        }
                    }
                }
            }
        }
        if (!player.invincible && checkCollision(player, inimigo)) {
            aplicarDanoAoJogador();
            criarExplosao(inimigo.x, inimigo.y, '#FF00FF', 20);
            inimigos.splice(i, 1);
            continue;
        }
        
        if (inimigo.y - inimigo.height / 2 > canvas.height) { 
            inimigos.splice(i, 1); 
            if (estadoFase !== 'BOSS_FIGHT') { 
                inimigosEscapadosCount++;
                if (inimigosEscapadosCount > MAX_INIMIGOS_ESCAPED) {
                    gameOver("falha_escapou");
                    return; 
                }
            }
            continue;
        }
    }
}

function atualizarProjeteisInimigos() {
    for (let i = projeteisInimigos.length - 1; i >= 0; i--) {
        const p = projeteisInimigos[i];
        if (p.vx) p.x += p.vx;
        if (p.vy) p.y += p.vy;
        else if (p.speed) p.y += p.speed;
        
        if (p.y > canvas.height || p.y < 0 || p.x < 0 || p.x > canvas.width) {
            projeteisInimigos.splice(i, 1);
            continue;
        }
        if (!player.invincible && checkCollision(player, p)) {
            aplicarDanoAoJogador();
            projeteisInimigos.splice(i, 1);
        }
    }
}

function iniciarLutaChefe() {
    estadoFase = 'BOSS_FIGHT';
    ondaDisplay.style.display = 'none';
    bossUi.style.display = 'block';

    if (magicBarContainer) magicBarContainer.style.display = 'none';
    if (fireMagicBarContainer) fireMagicBarContainer.style.display = 'none';
    if (geloBarContainer) geloBarContainer.style.display = 'none';

    boss = {
        x: canvas.width / 2,
        y: 180,
        width: 150,
        height: 150,
        hp: 250,
        maxHp: 250,
        phase: 1,
        attackTimer: 0,
        attackDelay: 100,
        invincible: false,
        hitTimer: 0,
        targetX: canvas.width / 2,
        speed: 2,
        vineAngle: 0,
        arenaWalls: { left: 0, right: canvas.width },
        image: bossImage
    };
    bossHealthBar.style.width = '100%';
    triggerScreenShake();
}

function atualizarChefe() {
    if (!boss || estadoFase !== 'BOSS_FIGHT') return;
    if (boss.hitTimer > 0) boss.hitTimer--;
    boss.attackTimer++;

    if (boss.hp <= boss.maxHp * 0.6 && boss.phase === 1) {
        boss.phase = 2;
        boss.attackTimer = -60;
        boss.attackDelay = 180;
        triggerScreenShake();
        criarExplosao(boss.x, boss.y, '#FFFFFF', 50, 5);
        bossHealthBar.classList.add('phase-2');
    }
    if (boss.hp <= boss.maxHp * 0.25 && boss.phase === 2) {
        boss.phase = 3;
        boss.attackTimer = -120;
        boss.attackDelay = 120;
        boss.x = canvas.width / 2;
        triggerScreenShake();
        criarExplosao(boss.x, boss.y, '#FF0000', 80, 7);
        bossHealthBar.classList.add('phase-3');
    }

    if (boss.phase === 1) {
        boss.x += (boss.targetX - boss.x) * 0.02;
        if (Math.abs(boss.x - boss.targetX) < 10) {
            boss.targetX = Math.random() * (canvas.width - 200) + 100;
        }
    } else if (boss.phase === 2 && boss.attackTimer > boss.attackDelay - 30) {
        boss.x = Math.random() * (canvas.width - 200) + 100;
        boss.y = Math.random() * (canvas.height / 2 - 100) + 100;
        criarExplosao(boss.x, boss.y, '#4B0082', 20, 4);
    }

    if (boss.attackTimer > boss.attackDelay) {
        boss.attackTimer = 0;
        tocarSom(somDaCriatura);
        switch (boss.phase) {
            case 1:
                if (Math.random() > 0.5) {
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => criarProjetilChefe('ESPINHO_TELEGUIDO'), i * 150);
                    }
                } else {
                    for (let i = 0; i < 5; i++) {
                        criarProjetilChefe('SEMENTE_VENENO', { vx: (Math.random() - 0.5) * 10, vy: Math.random() * 5 + 2 });
                    }
                }
                break;
            case 2:
                ataquesChefe.push({ tipo: 'AVISO_INVESTIDA', lifetime: 60, startX: boss.x, startY: boss.y, targetX: player.x, targetY: player.y });
                break;
            case 3:
                for (let i = 0; i < 2; i++) {
                    const spawnX = (i % 2 === 0) ? 100 : canvas.width - 100;
                    const enemyType = Math.random() < 0.5 ? 'ARANHA' : 'VAGALUME';
                    criarInimigo(enemyType, spawnX, -50);
                }
                criarAvisoDeLance(player.x, player.y);
                boss.arenaWalls.left += 0.5;
                boss.arenaWalls.right -= 0.5;
                break;
        }
    }
}

function criarProjetilChefe(tipo, props = {}) {
    let p = { x: boss.x, y: boss.y, tipo };
    switch (tipo) {
        case 'ESPINHO_TELEGUIDO':
            const angle = Math.atan2(player.y - p.y, player.x - p.x);
            Object.assign(p, { width: 30, height: 30, vx: Math.cos(angle) * 6, vy: Math.sin(angle) * 6, image: bossProjetilImage });
            break;
        case 'SEMENTE_VENENO':
            Object.assign(p, { width: 30, height: 30, vx: props.vx, vy: props.vy, image: bossProjetilImage });
            break;
    }
    projeteisInimigos.push(p);
}

function criarAvisoDeLance(targetX, targetY) {
    const warningArea = document.createElement('div');
    const canvasRect = canvas.getBoundingClientRect();
    const attackWidth = 40; 

    warningArea.className = 'lance-warning-area';
    warningArea.style.position = 'absolute';
    warningArea.style.left = `${canvasRect.left + targetX - (attackWidth / 2)}px`;
    warningArea.style.top = `${canvasRect.top}px`;
    warningArea.style.width = `${attackWidth}px`;
    warningArea.style.height = `${canvasRect.height}px`;
    warningArea.style.backgroundColor = 'rgba(255, 0, 0, 0.4)';
    warningArea.style.zIndex = '10';

    gameContainer.appendChild(warningArea);

    setTimeout(() => {
        if (estadoFase === 'BOSS_FIGHT') {
            ataquesChefe.push({ tipo: 'LANCA_ENERGIA', x: targetX, y: canvas.height / 2, width: attackWidth, height: canvas.height, lifetime: 20 });
            triggerScreenShake();
            criarExplosao(targetX, canvas.height, '#FF00FF', 40, 5);
        }
        warningArea.remove();
    }, 800); // Tempo de aviso antes do ataque
}

function atualizarAtaquesChefe() {
    for (let i = ataquesChefe.length - 1; i >= 0; i--) {
        const atk = ataquesChefe[i];

        switch (atk.tipo) {
            case 'INVESTIDA':
                atk.x += atk.vx;
                atk.y += atk.vy;
                if (!player.invincible && checkCollision(player, { x: atk.x, y: atk.y, width: atk.width, height: atk.height })) {
                    aplicarDanoAoJogador(2);
                }
                break;
            case 'DANCA_VINHAS':
                atk.angle += 0.03;
                boss.vineAngle = atk.angle;
                break;
            case 'LANCA_ENERGIA':
                if (!player.invincible && checkCollision(player, atk)) {
                    aplicarDanoAoJogador(2);
                }
                break;
        }

        if (atk.lifetime !== undefined) {
            atk.lifetime--;
            if (atk.lifetime <= 0) {
                if (atk.tipo === 'AVISO_INVESTIDA') {
                    ataquesChefe.push({ tipo: 'INVESTIDA', x: atk.startX, y: atk.startY, vx: (atk.targetX - atk.startX) / 20, vy: (atk.targetY - atk.startY) / 20, lifetime: 40, width: 120, height: 120 });
                }
                ataquesChefe.splice(i, 1);
            }
        }
    }
}


function danoNoChefe(dano) {
    if (boss.invincible || !boss) return;
    boss.hp -= dano;
    boss.hitTimer = 5;
    bossHealthBar.style.width = `${(boss.hp / boss.maxHp) * 100}%`;
    if (boss.hp <= 0) {
        estadoFase = 'BOSS_DERROTADO';
        triggerScreenShake();
        criarExplosao(boss.x, boss.y, 'white', 200, 10);

        for (const inimigo of inimigos) {
            criarExplosao(inimigo.x, inimigo.y, '#FF00FF', 20);
        }
        inimigos = [];

        setTimeout(avancarEstadoFase, 2000);
    }
}

function atualizarVidasUI() {
    vidasContainer.innerHTML = '';
    for (let i = 0; i < player.lives; i++) {
        const coracaoDiv = document.createElement('div');
        coracaoDiv.classList.add('coracao');
        coracaoDiv.textContent = '❤️';
        vidasContainer.appendChild(coracaoDiv);
    }
    escudosContainer.innerHTML = '';
    for (let i = 0; i < player.shields; i++) {
        const escudoDiv = document.createElement('div');
        escudoDiv.classList.add('escudo');
        escudoDiv.textContent = '🛡️';
        escudosContainer.appendChild(escudoDiv);
    }
}

function desenharChefe() {
    if (!boss || !boss.image || !boss.image.complete || boss.image.naturalWidth === 0) {
        return;
    }
    ctx.save();
    if (boss.hitTimer > 0) {
        ctx.globalAlpha = 0.5;
    }
    ctx.drawImage(boss.image, boss.x - boss.width / 2, boss.y - boss.height / 2, boss.width, boss.height);
    ctx.restore();
}

function desenharAtaquesChefe() {
    for (const atk of ataquesChefe) {
        ctx.save(); 
        switch (atk.tipo) {
            case 'AVISO_INVESTIDA':
                ctx.strokeStyle = `rgba(255,0,0, ${atk.lifetime / 60})`;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(atk.startX, atk.startY);
                ctx.lineTo(atk.targetX, atk.targetY);
                ctx.stroke();
                break;
            
            case 'INVESTIDA':
                if (bossInvestidaImage.complete && bossInvestidaImage.naturalWidth > 0) {
                    ctx.drawImage(bossInvestidaImage, atk.x - atk.width / 2, atk.y - atk.height / 2, atk.width, atk.height);
                } else {
                    ctx.fillStyle = 'rgba(139,0,139,0.5)';
                    ctx.beginPath();
                    ctx.arc(atk.x, atk.y, atk.width / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case 'DANCA_VINHAS':
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 15;
                const vineLength = canvas.width / 2;
                for (let i = 0; i < 2; i++) {
                    const currentAngle = atk.angle + i * Math.PI;
                    ctx.beginPath();
                    ctx.moveTo(boss.x, boss.y);
                    ctx.lineTo(boss.x + Math.cos(currentAngle) * vineLength, boss.y + Math.sin(currentAngle) * vineLength);
                    ctx.stroke();
                }
                break;
            case 'LANCA_ENERGIA':
                ctx.globalAlpha = atk.lifetime / 20;
                if (ataqueEspinhosImage.complete && ataqueEspinhosImage.naturalWidth > 0) {
                    ctx.drawImage(ataqueEspinhosImage, atk.x - atk.width / 2, 0, atk.width, atk.height);
                } else {
                    ctx.fillStyle = `rgba(255,0,255, ${atk.lifetime / 20})`;
                    ctx.fillRect(atk.x - atk.width / 2, 0, atk.width, atk.height);
                }
                break;
        }
        ctx.restore();
    }
}
function desenharProjeteisInimigos() {
    for (let i = projeteisInimigos.length - 1; i >= 0; i--) {
        const p = projeteisInimigos[i];
        ctx.save();
        ctx.translate(p.x, p.y);

        if (p.image && p.image.complete && p.image.naturalWidth > 0) {
            if (p.vx) {
                ctx.rotate(Math.atan2(p.vy, p.vx));
            }
            ctx.drawImage(p.image, -p.width / 2, -p.height / 2, p.width, p.height);
        
        } else { 
            switch (p.tipo) {
                case 'ESPINHO_TELEGUIDO': ctx.fillStyle = "#8A2BE2"; break;
                case 'SEMENTE_VENENO': ctx.fillStyle = "#7CFC00"; break;
                case 'PEDRA': ctx.fillStyle = "#A9A9A9"; break;
                case 'GOSMA': ctx.fillStyle = "#32CD32"; break;
                default: ctx.fillStyle = "#FFFFFF"; break;
            }
            ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        }
        ctx.restore();
    }
}

function criarAmbiente() {
    ambiente = [];
    for (let i = 0; i < 100; i++) {
        ambiente.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1,
            color: 'rgba(46, 77, 46, 0.5)'
        });
    }
}

function desenharEAtualizarAmbiente() {
    for (const p of ambiente) {
        p.y += p.speed;
        if (p.y > canvas.height) {
            p.y = 0;
            p.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function desenharPlayer() {
    ctx.globalAlpha = 1;
    if (player.invincible) {
        ctx.globalAlpha = Math.floor(Date.now() / 150) % 2 === 0 ? 0.9 : 0.4;
    }
    const img = player.imagemAtual;
    if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    }
    ctx.globalAlpha = 1;
}

function desenharInimigos() {
    for (const inimigo of inimigos) {
        if (inimigo.congelado) {
            ctx.filter = 'hue-rotate(180deg) brightness(1.2)';
        }

        const isImageLoaded = inimigo.image && inimigo.image.complete && inimigo.image.naturalWidth !== 0;

        if (isImageLoaded) {
            ctx.drawImage(inimigo.image, inimigo.x - inimigo.width / 2, inimigo.y - inimigo.height / 2, inimigo.width, inimigo.height);
        } else { 
            switch (inimigo.tipo) {
                case 'ARANHA':
                    ctx.fillStyle = "#4B0082"; ctx.beginPath(); ctx.arc(inimigo.x, inimigo.y, inimigo.width / 2, 0, Math.PI * 2); ctx.fill();
                    break;
                case 'VAGALUME':
                    ctx.fillStyle = "#FFFF00"; ctx.beginPath(); ctx.arc(inimigo.x, inimigo.y, inimigo.width / 2, 0, Math.PI * 2); ctx.fill();
                    break;
                case 'FLOR':
                    ctx.fillStyle = "#228B22"; ctx.fillRect(inimigo.x - inimigo.width / 2, inimigo.y, inimigo.width, inimigo.height);
                    ctx.fillStyle = "#DC143C"; ctx.beginPath(); ctx.arc(inimigo.x, inimigo.y, inimigo.width / 3, 0, Math.PI * 2); ctx.fill();
                    break;
                case 'TOTEM':
                    ctx.fillStyle = "#A0522D"; ctx.fillRect(inimigo.x - inimigo.width / 2, inimigo.y - inimigo.height / 2, inimigo.width, inimigo.height);
                    ctx.fillStyle = "#696969"; ctx.fillRect(inimigo.x - inimigo.width / 4, inimigo.y - inimigo.height / 2, inimigo.width / 2, inimigo.height / 4);
                    break;
            }
        }
        ctx.filter = 'none';
    }
}

function desenharTiros() {
    for (const tiro of tiros) {
        ctx.save();
        ctx.shadowBlur = 15;

        if (tiro.tipo === 'MAGIA_SOMBRA') {
            ctx.shadowColor = "#8A2BE2";
            if (magiaDasSombrasImage.complete && magiaDasSombrasImage.naturalWidth > 0) {
                ctx.globalAlpha = tiro.lifetime / DURACAO_MODO_SOMBRA;
                ctx.drawImage(magiaDasSombrasImage, tiro.x - tiro.width / 2, tiro.y, tiro.width, tiro.height);
            } else {
                ctx.fillStyle = "#6A0DAD";
                ctx.fillRect(tiro.x - tiro.width / 2, tiro.y, tiro.width, tiro.height);
            }
        } 
        else if (tiro.isIceShot) {
            ctx.shadowColor = "#00BFFF";
            if (iceMagicProjectileImage.complete && iceMagicProjectileImage.naturalWidth > 0) {
                ctx.drawImage(iceMagicProjectileImage, tiro.x - tiro.width / 2, tiro.y - tiro.height / 2, tiro.width, tiro.height);
            } else {
                ctx.fillStyle = "#ADD8E6";
                ctx.fillRect(tiro.x - tiro.width / 2, tiro.y, tiro.width, tiro.height);
            }
        }
        else { 
            if (fireMagicUnlocked) {
                ctx.shadowColor = "#FF4500";
                if (magiaDeFogoImage.complete && magiaDeFogoImage.naturalWidth > 0) {
                    ctx.drawImage(magiaDeFogoImage, tiro.x - tiro.width / 2, tiro.y - tiro.height / 2, tiro.width, tiro.height);
                } else {
                    ctx.fillStyle = "#FFA500";
                    ctx.fillRect(tiro.x - tiro.width / 2, tiro.y, tiro.width, tiro.height);
                }
            } else {
                ctx.shadowColor = "#87CEFA";
                if (magiaNormalImage.complete && magiaNormalImage.naturalWidth > 0) {
                    ctx.drawImage(magiaNormalImage, tiro.x - tiro.width / 2, tiro.y - tiro.height / 2, tiro.width, tiro.height);
                } else {
                    ctx.fillStyle = "#ADD8E6";
                    ctx.fillRect(tiro.x - tiro.width / 2, tiro.y, tiro.width, tiro.height);
                }
            }
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}

function criarExplosao(x, y, cor, count = 20, size = 3) {
    for (let i = 0; i < count; i++) {
        particulas.push({ x: x, y: y, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, radius: Math.random() * size, cor: cor, vida: 40 });
    }
}

function desenharEAtualizarParticulas() {
    for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vida--;
        if (p.vida <= 0) {
            particulas.splice(i, 1);
            continue;
        }
        ctx.fillStyle = p.cor;
        ctx.globalAlpha = p.vida / 40;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function desenharExplosaoFogo() {
    if (!fireExplosionActive) return;
    ctx.save();
    const currentAlpha = fireExplosionTimer / fireExplosionDuration;
    const currentRadius = fireExplosionRadius * (fireExplosionTimer / fireExplosionDuration);

    if (magiaDeFogoImage.complete && magiaDeFogoImage.naturalWidth !== 0) {
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = 30;
        ctx.drawImage(magiaDeFogoImage, player.x - currentRadius, player.y - currentRadius, currentRadius * 2, currentRadius * 2);
    } else {
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = `rgba(255, 100, 0, ${currentAlpha})`;
        ctx.shadowColor = '#FF4500';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.arc(player.x, player.y, fireExplosionRadius * (1 - (fireExplosionTimer / fireExplosionDuration)), 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

function desenharAuraGelo() {
    if (!modoGeloAtivo) return;
    ctx.globalAlpha = 0.2 + (Math.sin(Date.now() / 200) * 0.05);
    ctx.fillStyle = '#87CEEB';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.width, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function desenharAuraSombra() {
    if (!modoSombraAtivo) return;
    ctx.globalAlpha = 0.2 + (Math.sin(Date.now() / 200) * 0.05);
    ctx.fillStyle = '#9400D3';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.width, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function desenharRaiosSombra() {
    for (let i = raiosSombra.length - 1; i >= 0; i--) {
        const raio = raiosSombra[i];
        const scaledX = raio.x;
        const scaledHeight = raio.altura;
        const scaledWidth = 50;

        if (magiaDasSombrasImage.complete && magiaDasSombrasImage.naturalWidth > 0) {
            ctx.globalAlpha = raio.alpha; 
            ctx.drawImage(magiaDasSombrasImage, scaledX - scaledWidth / 2, 0, scaledWidth, scaledHeight);
        } else {
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


function checkCollision(obj1, obj2) {
    const left1 = obj1.x - obj1.width / 2;
    const right1 = obj1.x + obj1.width / 2;
    const top1 = obj1.y - obj1.height / 2;
    const bottom1 = obj1.y + obj1.height / 2;
    const left2 = obj2.x - obj2.width / 2;
    const right2 = obj2.x + obj2.width / 2;
    const top2 = obj2.y - obj2.height / 2;
    const bottom2 = obj2.y + obj2.height / 2;
    return right1 > left2 && left1 < right2 && bottom1 > top2 && top1 < bottom2;
}

function atualizarBarraGelo() {
    if (magiaGeloEmCooldown) {
        geloBarContainer.classList.add('cooldown');
        geloBarFill.classList.remove('pronta');
        geloBarFill.style.width = '100%';
    } else {
        geloBarContainer.classList.remove('cooldown');
        const porcentagem = (magiaGeloCarregada / INIMIGOS_PARA_MAGIA_GELO) * 100;
        geloBarFill.style.width = `${porcentagem}%`;
        geloBarFill.classList.toggle('pronta', porcentagem >= 100);
    }
}

function ativarModoGelo() {
    if (!magiaGeloDesbloqueada || modoGeloAtivo || magiaGeloEmCooldown || magiaGeloCarregada < INIMIGOS_PARA_MAGIA_GELO) return;
    
    tocarSom(somHabilidade);
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
        magicBarContainer.classList.add('cooldown');
        magicBarFill.classList.remove('pronta');
        magicBarFill.style.width = '100%';
    } else {
        magicBarContainer.classList.remove('cooldown');
        const porcentagem = (barraMagiaSombraAtual / inimigosParaMagiaSombra) * 100;
        magicBarFill.style.width = `${porcentagem}%`;
        magicBarFill.classList.toggle('pronta', porcentagem >= 100);
    }
}

function ativarModoSombra() {
    if (!magiaSombraDesbloqueada || modoSombraAtivo || magiaSombraEmCooldown || barraMagiaSombraAtual < inimigosParaMagiaSombra) return;

    tocarSom(somHabilidade);
    modoSombraAtivo = true;
    barraMagiaSombraAtual = 0;
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
    tocarSom(somDisparo);

    podeAtirarRaioSombra = false;
    raiosSombra.push({ x: player.x, altura: canvas.height, alpha: 1.0 });

    for (let i = inimigos.length - 1; i >= 0; i--) {
        const inimigo = inimigos[i];
        const raioEsquerda = player.x - (player.width / 2);
        const raioDireita = player.x + (player.width / 2);
        const inimigoEsquerda = inimigo.x - (inimigo.width / 2);
        const inimigoDireita = inimigo.x + (inimigo.width / 2);

        if (inimigoDireita > raioEsquerda && inimigoEsquerda < raioDireita) {
            inimigo.hp -= 999;
            criarExplosao(inimigo.x, inimigo.y, '#6A0DAD', 30);
            pontos += 10;
            updateTexts(); // ATUALIZADO
            inimigos.splice(i, 1);
        }
    }

    setTimeout(() => { podeAtirarRaioSombra = true; }, COOLDOWN_RAIO_SOMBRA);
}


// --- Loop Principal do Jogo ---

function atualizar() {
    animationFrameId = requestAnimationFrame(atualizar);

    if (estadoFase === 'PROLOGO') {
        if (!prologoAvisoMostrado) {
            const ultimoParagrafo = document.getElementById('ultimo-paragrafo');
            const aviso = document.getElementById('prologo-aviso');
            if (ultimoParagrafo && aviso) {
                const textoRect = ultimoParagrafo.getBoundingClientRect();
                const avisoRect = aviso.getBoundingClientRect();
                if (textoRect.bottom < avisoRect.top) {
                    aviso.classList.add('visivel');
                    prologoAvisoMostrado = true;
                }
            }
        }
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharEAtualizarAmbiente();

    if (jogoAtivo) {
        if (leftPressed) {
            player.x -= player.speed;
            player.imagemAtual = maelisEsquerdaImg;
        } else if (rightPressed) {
            player.x += player.speed;
            player.imagemAtual = maelisDireitaImg;
        } else {
            player.imagemAtual = maelisParadaImg;
        }
        player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
    }

    desenharPlayer();
    atualizarVidasUI();
    desenharTiros();
    desenharInimigos();
    desenharProjeteisInimigos();
    desenharAuraGelo();
    desenharAuraSombra();
    desenharRaiosSombra();

    if (estadoFase.includes('BOSS')) {
        desenharChefe();
        desenharAtaquesChefe();
    }

    desenharEAtualizarParticulas();
    desenharExplosaoFogo();

    if (magiaSombraDesbloqueada && estadoFase === 'GAMEPLAY' && magicBarFill) {
        atualizarBarraSombra();
    }

    if (fireMagicUnlocked && estadoFase === 'GAMEPLAY' && fireMagicBarFill) {
        const fillPercentage = (fireMagicCharge / enemiesToChargeFireMagic) * 100;
        fireMagicBarFill.style.width = `${fillPercentage}%`;
        fireMagicBarFill.classList.toggle('pronta', fillPercentage >= 100);
    }

    if (magiaGeloDesbloqueada && estadoFase === 'GAMEPLAY' && geloBarFill) {
        atualizarBarraGelo();
    }

    if (!jogoAtivo) return;

    if (fireExplosionActive) {
        fireExplosionTimer--;
        if (fireExplosionTimer <= 0) {
            fireExplosionActive = false;
        } else {
            for (let j = inimigos.length - 1; j >= 0; j--) {
                const inimigo = inimigos[j];
                const distance = Math.sqrt(Math.pow(player.x - inimigo.x, 2) + Math.pow(player.y - inimigo.y, 2));
                if (distance < fireExplosionRadius && inimigo !== boss) {
                    criarExplosao(inimigo.x, inimigo.y, '#FF4500', 40, 5);
                    inimigos.splice(j, 1);
                    pontos += 10;
                    updateTexts();
                }
            }
        }
    }

    for (let i = tiros.length - 1; i >= 0; i--) {
        const tiro = tiros[i];
        
        if (tiro.speed !== undefined && tiro.speed !== 0) {
            tiro.y -= tiro.speed;
        }

        if (tiro.y < -tiro.height || (tiro.tipo === 'MAGIA_SOMBRA' && tiro.lifetime !== undefined && tiro.lifetime <= 0)) { 
            tiros.splice(i, 1);
            continue;
        }

        let tiroRemovido = false;

        for (let j = inimigos.length - 1; j >= 0; j--) {
            const inimigo = inimigos[j];
            if (checkCollision(tiro, inimigo)) {
                if (tiro.tipo === 'MAGIA_SOMBRA') {
                    criarExplosao(inimigo.x, inimigo.y, '#6A0DAD', 30);
                    tiros.splice(i, 1); 
                    tiroRemovido = true;
                } 
                else if (tiro.isIceShot) {
                    inimigo.hp--;
                    criarExplosao(tiro.x, tiro.y, '#87CEEB', 5, 2);
                    tiros.splice(i, 1);
                    tiroRemovido = true;
                    if (inimigo.hp > 0 && !inimigo.congelado && inimigo.tipo !== 'VAGALUME') {
                        inimigo.congelado = true;
                        setTimeout(() => {
                            if (inimigos.includes(inimigo)) inimigo.congelado = false;
                        }, DURACAO_CONGELAMENTO);
                    }
                }
                else {
                    inimigo.hp--;
                    criarExplosao(tiro.x, tiro.y, '#FFD700', 5, 2);
                    tiros.splice(i, 1);
                    tiroRemovido = true;
                }

                if (inimigo.hp <= 0) {
                    if (inimigos.indexOf(inimigo) !== -1) { 
                        criarExplosao(inimigo.x, inimigo.y, '#FF00FF', 20);
                        inimigos.splice(inimigos.indexOf(inimigo), 1);
                        pontos += 10;
                        updateTexts();
                        
                        if (magiaGeloDesbloqueada && !magiaGeloEmCooldown && magiaGeloCarregada < INIMIGOS_PARA_MAGIA_GELO) {
                            magiaGeloCarregada++;
                            atualizarBarraGelo();
                        }
                        if (magiaSombraDesbloqueada && !modoSombraAtivo && barraMagiaSombraAtual < inimigosParaMagiaSombra) {
                            barraMagiaSombraAtual++;
                            atualizarBarraSombra();
                        }
                         if (fireMagicUnlocked && fireMagicCharge < enemiesToChargeFireMagic) {
                           fireMagicCharge++;
                        }
                    }
                }
                if (tiroRemovido) break;
            }
        }

        if (!tiroRemovido && boss && estadoFase === 'BOSS_FIGHT' && checkCollision(tiro, boss)) {
            if (tiro.tipo !== 'MAGIA_SOMBRA' && !tiro.isIceShot) {
                danoNoChefe(1);
                tiros.splice(i, 1);
                tiroRemovido = true;
            } else if (tiro.isIceShot) {
                criarExplosao(tiro.x, tiro.y, '#87CEEB', 5, 2);
                tiros.splice(i, 1);
                tiroRemovido = true;
            } else if (tiro.tipo === 'MAGIA_SOMBRA') {
                tiros.splice(i, 1);
                tiroRemovido = true;
            }
        }
    }

    atualizarInimigos();
    atualizarProjeteisInimigos();

    if (estadoFase === 'BOSS_FIGHT') {
        atualizarChefe();
        atualizarAtaquesChefe();
    }

    if (estadoFase === 'GAMEPLAY' && inimigos.length === 0 && projeteisInimigos.length === 0) {
        avancarEstadoFase();
    }
}

// --- Controles e Eventos ---

document.addEventListener("keydown", (e) => {
    if (estadoFase === 'PROLOGO') {
        if (prologoAvisoMostrado && e.key === " ") {
            comecarJogo();
        }
        return;
    }

    if (!jogoAtivo) return;

    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") leftPressed = true;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") rightPressed = true;

    // --- Lógica de Disparo com Cadência ---
    if (e.key === " ") { // Removido o '!spacePressed' para permitir manter pressionado
        const currentTime = Date.now();
        if ((currentTime - lastShotTime > shotCooldown)) {
            tocarSom(somDisparo);
            let tiroSpeed = 8;
            let tiroWidth = 6;
            let isIceShot = false;
            let tipoTiro = 'NORMAL';

            if (modoGeloAtivo && estadoFase !== 'BOSS_FIGHT') {
                tiroWidth = 15;
                tiroSpeed = 10;
                isIceShot = true;
            } else if (fireMagicUnlocked && estadoFase !== 'BOSS_FIGHT') {
                tiroSpeed = 12;
                tiroWidth = 8;
                tipoTiro = 'FOGO';
            }

            tiros.push({ 
                x: player.x,
                y: player.y - player.height / 2, 
                width: 15, 
                height: 20,
                speed: tiroSpeed,
                tipo: tipoTiro,
                isIceShot: isIceShot
            });
            lastShotTime = currentTime; // Atualiza o tempo do último tiro
        }
    }
    // Fim da Lógica de Disparo com Cadência

    if (e.key.toLowerCase() === "z" && estadoFase !== 'BOSS_FIGHT') {
        ativarModoGelo();
    }
    
    if (e.key === "Shift" && !shiftPressed && magiaSombraDesbloqueada && estadoFase !== 'BOSS_FIGHT') {
        shiftPressed = true;
        if (!modoSombraAtivo) {
            ativarModoSombra();
        } else {
            dispararRaioSombra(); 
        }
    }

    if (e.key.toLowerCase() === "x" && !fireExplosionActive && fireMagicUnlocked && fireMagicCharge >= enemiesToChargeFireMagic && estadoFase !== 'BOSS_FIGHT') {
        tocarSom(somHabilidade);
        fireExplosionActive = true;
        fireExplosionTimer = fireExplosionDuration;
        fireMagicCharge = 0;
        triggerScreenShake();
        if (fireMagicBarFill) fireMagicBarFill.style.width = '0%';
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") leftPressed = false;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") rightPressed = false;
    if (e.key === " ") spacePressed = false;
    if (e.key === "Shift") shiftPressed = false;
});

btnContinuar.addEventListener("click", () => {
    tocarSom(somClick);
    avancarEstadoFase();
});

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => tocarSom(somHover));
    if (button.id !== 'btn-continuar') {
        button.addEventListener('click', () => tocarSom(somClick));
    }
});

btnVoltarMenuFase.addEventListener("click", () => {
    tocarSom(somClick);
    localStorage.removeItem('currentMenuMusicTime');
    window.location.href = '../../Menu/menu.html#menu-principal';
});
btnTentarNovamente.addEventListener("click", () => {
    tocarSom(somClick);
    inicializar();
});
btnVoltarMenuFalha.addEventListener("click", () => {
    tocarSom(somClick);
    localStorage.removeItem('currentMenuMusicTime');
    window.location.href = '../../Menu/menu.html#menu-principal';
});
btnPularPrologo.addEventListener("click", () => {
    tocarSom(somClick);
    comecarJogo();
});


// Inicia o jogo (ou o loop do prólogo)
loadSettings();
updateTexts();
atualizar();