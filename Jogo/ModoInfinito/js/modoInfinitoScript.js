// =======================================================
// --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
// =======================================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");
const cicloDisplay = document.getElementById("ciclo-display");
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
const magicBarContainer = document.getElementById("magic-bar-container");
const magicBarFill = document.getElementById("magic-bar-fill");
const fireMagicBarContainer = document.getElementById("fire-magic-bar-container");
const fireMagicBarFill = document.getElementById("fire-magic-bar-fill");
const geloBarContainer = document.getElementById("gelo-bar-container");
const geloBarFill = document.getElementById("gelo-bar-fill");
const vidasContainer = document.getElementById("vidas-container");
const escudosContainer = document.getElementById("escudos-container");
const maelisNormalFace = document.getElementById("maelis-normal");
const maelisChorandoFace = document.getElementById("maelis-chorando");
const maelisDescabeladaFace = document.getElementById("maelis-descabelada");
const maelisMortaFace = document.getElementById("maelis-morta");
const somClick = document.getElementById('som-click');
const somHover = document.getElementById('som-hover');
const somGameOver = document.getElementById('som-game-over');
const somDisparo = document.getElementById('som-disparo');
const somDanoMaelis = document.getElementById("dano-maelis");
const somDaCriatura = document.getElementById("som-da-criatura");
const somVitoria = document.getElementById("som-vitoria");
const somHabilidade = document.getElementById("som-habilidade");
const musicaAcao = document.getElementById('musica-acao');

// =======================================================
// --- 2. CONFIGURAÇÕES E VARIÁVEIS DE ESTADO ---
// =======================================================
let settings = { music: true, sfx: true, language: 'pt' };
const totalDeOndas = 8;
const MAX_LIVES = 3;

// << NOVO: DADOS DE TRADUÇÃO >>
const infiniteLangData = {
    'pt': {
        titulo_pagina: "Maelis: Modo Infinito",
        ciclo: "Ciclo:",
        pontos: "Pontos:",
        onda: "Onda",
        magia_sombra: "Magia das Sombras",
        magia_fogo: "Magia de Fogo",
        magia_gelo: "Magia de Gelo",
        btn_continuar: "Continuar",
        ciclo_concluido_titulo: "Ciclo Concluído!",
        ciclo_concluido_texto: "A escuridão recua, mas a ameaça persiste...",
        falha_titulo: "Você foi corrompido.",
        falha_texto: "A escuridão venceu desta vez.",
        btn_tentar_novamente: "Tentar Novamente",
        btn_voltar_menu: "Voltar ao Menu",
        prompt_nickname: "Digite seu nickname para o ranking (até 15 caracteres):",
        prompt_padrao: "Jogador",
        contagem_lute: "LUTE!",
        dialogo_entrada: "Sua lenda será contada pela eternidade... ou até sua queda.<br>Sobreviva o máximo que puder."
    },
    'en': {
        titulo_pagina: "Maelis: Infinite Mode",
        ciclo: "Cycle:",
        pontos: "Score:",
        onda: "Wave",
        magia_sombra: "Shadow Magic",
        magia_fogo: "Fire Magic",
        magia_gelo: "Ice Magic",
        btn_continuar: "Continue",
        ciclo_concluido_titulo: "Cycle Complete!",
        ciclo_concluido_texto: "The darkness retreats, but the threat persists...",
        falha_titulo: "You have been corrupted.",
        falha_texto: "The darkness won this time.",
        btn_tentar_novamente: "Try Again",
        btn_voltar_menu: "Back to Menu",
        prompt_nickname: "Enter your nickname for the ranking (up to 15 characters):",
        prompt_padrao: "Player",
        contagem_lute: "FIGHT!",
        dialogo_entrada: "Your legend will be told for eternity... or until your fall.<br>Survive as long as you can."
    },
    'es': {
        titulo_pagina: "Maelis: Modo Infinito",
        ciclo: "Ciclo:",
        pontos: "Puntos:",
        onda: "Oleada",
        magia_sombra: "Magia de las Sombras",
        magia_fogo: "Magia de Fuego",
        magia_gelo: "Magia de Hielo",
        btn_continuar: "Continuar",
        ciclo_concluido_titulo: "¡Ciclo Completado!",
        ciclo_concluido_texto: "La oscuridad retrocede, pero la amenaza persiste...",
        falha_titulo: "Has sido corrompido.",
        falha_texto: "La oscuridad ha vencido esta vez.",
        btn_tentar_novamente: "Intentar de Nuevo",
        btn_voltar_menu: "Volver al Menú",
        prompt_nickname: "Ingresa tu apodo para el ranking (hasta 15 caracteres):",
        prompt_padrao: "Jugador",
        contagem_lute: "¡LUCHA!",
        dialogo_entrada: "Tu leyenda será contada por la eternidad... o hasta tu caída.<br>Sobrevive tanto como puedas."
    }
};

// Variáveis do estado do jogo
let player, tiros = [], inimigos = [], particulas = [], ambiente, raiosSombra = [];
let projeteisInimigos, boss, ataquesChefe;
let leftPressed = false, rightPressed = false, spacePressed = false, shiftPressed = false;
let jogoAtivo = false;
let estadoFase;
let cicloAtual = 1;
let bossDerrotado = false;
let ondaAtual = 0;
let pontos = 0;
let animationFrameId;
let textoContagem = '';
let inimigosEscapadosCount;
let lastShotTime = 0;
// << NOVO: Variável para o nome do jogador >>
let playerNickname;

// Constantes de Jogo
const shotCooldown = 3330 / 16;
const MAX_INIMIGOS_ESCAPED = 1;

// Mágica Sombra
let magiaSombraDesbloqueada, barraMagiaSombraAtual, modoSombraAtivo, magiaSombraEmCooldown, podeAtirarRaioSombra, timerModoSombra, timerCooldownSombra;
const inimigosParaMagiaSombra = 5;
const DURACAO_MODO_SOMBRA = 10000;
const COOLDOWN_SOMBRA = 25000;
const COOLDOWN_RAIO_SOMBRA = 400;

// Mágica Fogo
let fireMagicUnlocked = true, fireMagicCharge, fireExplosionActive, fireExplosionTimer;
const enemiesToChargeFireMagic = 7;
const fireExplosionDuration = 30;
const fireExplosionRadius = 200;

// Mágica Gelo
let magiaGeloDesbloqueada, magiaGeloCarregada, modoGeloAtivo, magiaGeloEmCooldown, timerModoGelo, timerCooldownGelo;
const INIMIGOS_PARA_MAGIA_GELO = 10;
const DURACAO_MODO_GELO = 10000;
const COOLDOWN_GELO = 20000;
const DURACAO_CONGELAMENTO = 3000;

// =======================================================
// --- 3. CARREGAMENTO E CONFIGURAÇÃO DE ASSETS ---
// =======================================================
const assetPath = '../Fases/assets/';

// Imagens
const maelisParadaImg = new Image(); maelisParadaImg.src = assetPath + 'Maelis_de_costas_parada.png';
const maelisDireitaImg = new Image(); maelisDireitaImg.src = assetPath + 'Maelis_de_costas_1.png';
const maelisEsquerdaImg = new Image(); maelisEsquerdaImg.src = assetPath + 'Maelis_de_costas_2.png';
const aranhaInimigoImage = new Image(); aranhaInimigoImage.src = assetPath + 'aranha-inimigo1.png';
const totemInimigoImage = new Image(); totemInimigoImage.src = assetPath + 'totem-inimigo.png';
const vagalumeInimigoImage = new Image(); vagalumeInimigoImage.src = assetPath + 'vagalume-inimigo.png';
const bossImage = new Image(); bossImage.src = assetPath + 'Bossfase_3.png';
const florInimigoImage = new Image(); florInimigoImage.src = assetPath + 'flor_inimiga.png';
const projetilFlorImage = new Image(); projetilFlorImage.src = assetPath + 'projetil_florinimiga.png';
const projetilTotemImage = new Image(); projetilTotemImage.src = assetPath + 'projetil-totem.png';
const maelisNormalFaceImg = new Image(); maelisNormalFaceImg.src = assetPath + 'maelis-face-normal.png';
const maelisChorandoFaceImg = new Image(); maelisChorandoFaceImg.src = assetPath + 'maelis-face-chorando.png';
const maelisDescabeladaFaceImg = new Image(); maelisDescabeladaFaceImg.src = assetPath + 'maelis-face-descabelada.png';
const maelisMortaFaceImg = new Image(); maelisMortaFaceImg.src = assetPath + 'maelis-face-morta.png';
const magiaDasSombrasImage = new Image(); magiaDasSombrasImage.src = assetPath + 'magia-das-sombras.png';
const magiaDeFogoImage = new Image(); magiaDeFogoImage.src = assetPath + 'magia-de-fogo.png';
const iceMagicProjectileImage = new Image(); iceMagicProjectileImage.src = assetPath + 'magia-de-gelo.png';
const bossProjetilImage = new Image(); bossProjetilImage.src = assetPath + 'fogoP_faseboss3.png';
const bossInvestidaImage = new Image(); bossInvestidaImage.src = assetPath + 'fogoG_faseboss3.png';
const ataqueEspinhosImage = new Image(); ataqueEspinhosImage.src = assetPath + 'Espinhos.png';

const imagesToLoad = [ maelisParadaImg, maelisDireitaImg, maelisEsquerdaImg, aranhaInimigoImage, totemInimigoImage, vagalumeInimigoImage, bossImage, florInimigoImage, projetilFlorImage, projetilTotemImage, magiaDasSombrasImage, magiaDeFogoImage, iceMagicProjectileImage, bossProjetilImage, bossInvestidaImage, ataqueEspinhosImage, maelisNormalFaceImg, maelisChorandoFaceImg, maelisDescabeladaFaceImg, maelisMortaFaceImg ];
let imagesLoadedCount = 0;

// Funções de carregamento
function imageLoaded() {
    imagesLoadedCount++;
    if (imagesLoadedCount === imagesToLoad.length) {
        console.log("Todas as imagens carregadas!");
    }
}
imagesToLoad.forEach(img => {
    img.onload = imageLoaded;
    img.onerror = () => { console.error("FALHA AO CARREGAR IMAGEM: " + img.src); imageLoaded(); };
});

// Configuração de volume
if (somDisparo) somDisparo.volume = 0.1;
if (musicaAcao) musicaAcao.volume = 1;
if (somVitoria) somVitoria.volume = 0.5;
if (somHover) somHover.volume = 0.3;
if (somGameOver) somGameOver.volume = 0.5;
if (somClick) somClick.volume = 0.3;
if (somDanoMaelis) somDanoMaelis.volume = 0.3;
if (somDaCriatura) somDaCriatura.volume = 0.3;
if (somHabilidade) somHabilidade.volume = 0.4;

// Funções de áudio e Configurações
function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('maelis-settings'));
    if (savedSettings) {
        settings = { ...settings, ...savedSettings };
    }
}

// << NOVO: Função para atualizar textos com base no idioma >>
function updateTexts() {
    const texts = infiniteLangData[settings.language];
    if (!texts) return; 

    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (texts[key]) {
            // Lógica para textos que precisam concatenar valores
            if (key === 'pontos') {
                element.textContent = `${texts[key]} ${pontos}`;
            } else if (key === 'ciclo') {
                element.textContent = `${texts[key]} ${cicloAtual}`;
            } else if (key === 'onda') {
                 element.textContent = `${texts[key]} ${ondaAtual} / ${totalDeOndas}`;
            } else {
                element.innerHTML = texts[key]; // innerHTML para renderizar <br> etc.
            }
        }
    });
    // Atualiza o título da página
    document.title = texts.titulo_pagina;
}


function tocarSom(somElement) {
    if (settings.sfx && somElement) {
        somElement.currentTime = 0;
        somElement.play().catch(e => console.error("Erro ao tocar SFX:", e));
    }
}
function pararMusica(musicaElement) {
    if (musicaElement) {
        musicaElement.pause();
        musicaElement.currentTime = 0;
    }
}
function tocarMusica(musicaElement) {
    if (settings.music && musicaElement) {
        musicaElement.loop = true;
        musicaElement.play().catch(e => console.error("Erro ao tocar música:", e));
    }
}


// =======================================================
// --- 4. FUNÇÕES DE FLUXO DO JOGO E ESTADO ---
// =======================================================

/**
 * Exibe a caixa de diálogo inicial.
 */
function mostrarDialogoDeEntrada() {
    estadoFase = 'BEM_VINDO';
    // O texto é definido dinamicamente por updateTexts
    textoDialogo.innerHTML = infiniteLangData[settings.language].dialogo_entrada;
    caixaDialogo.style.display = 'flex';
}

/**
 * Inicializa ou reinicializa o jogo.
 * @param {boolean} reiniciarPontos - Se deve resetar a pontuação e o ciclo.
 */
function inicializar(reiniciarPontos = true) {
    pararMusica(musicaAcao);
    pararMusica(somVitoria);
    pararMusica(somGameOver);
    cancelAnimationFrame(animationFrameId);
    
    gameContainer.style.display = 'flex';
    cicloDisplay.style.display = 'block';
    pontuacaoDiv.style.display = 'block';

    player = { x: canvas.width / 2, y: canvas.height - 80, width: 55, height: 70, speed: 6, lives: MAX_LIVES, shields: 3, invincible: false, imagemAtual: maelisParadaImg };
    tiros = []; inimigos = []; particulas = []; projeteisInimigos = []; ataquesChefe = []; raiosSombra = [];
    boss = null;
    leftPressed = false; rightPressed = false; spacePressed = false; shiftPressed = false;
    
    if (reiniciarPontos) {
        pontos = 0;
        cicloAtual = 1;
    }

    ondaAtual = 0;
    inimigosEscapadosCount = 0;
    
    magiaSombraDesbloqueada = true; barraMagiaSombraAtual = 0; modoSombraAtivo = false; magiaSombraEmCooldown = false; podeAtirarRaioSombra = true;
    clearTimeout(timerModoSombra); clearTimeout(timerCooldownSombra);
    fireMagicUnlocked = true; fireMagicCharge = 0; fireExplosionActive = false; fireExplosionTimer = 0;
    magiaGeloDesbloqueada = true; magiaGeloCarregada = 0; modoGeloAtivo = false; magiaGeloEmCooldown = false;
    clearTimeout(timerModoGelo); clearTimeout(timerCooldownGelo);

    updateTexts(); // Atualiza toda a UI de texto

    caixaDialogo.style.display = 'none'; fimDeFaseDiv.style.display = 'none'; telaFalha.style.display = 'none';
    bossUi.style.display = 'none'; ondaDisplay.style.display = 'none';
    bossHealthBar.className = 'boss-health-bar';

    if (magicBarContainer) { magicBarContainer.style.display = 'flex'; magicBarContainer.classList.remove('cooldown'); }
    if (magicBarFill) { magicBarFill.style.width = '0%'; magicBarFill.classList.remove('pronta'); }

    if (fireMagicBarContainer) { 
        fireMagicBarContainer.style.display = 'flex'; 
        fireMagicBarFill.style.width = '0%'; 
        fireMagicBarFill.classList.remove('pronta');
    }
    if (geloBarContainer) { geloBarContainer.style.display = 'flex'; geloBarContainer.classList.remove('cooldown'); }
    if (geloBarFill) { geloBarFill.style.width = '0%'; geloBarFill.classList.remove('pronta'); }

    criarAmbiente();
    atualizarVidasUI();
    atualizarExpressaoMaelis();
    
    atualizar();
}

/**
 * Inicia a contagem regressiva para o início do jogo.
 */
function iniciarContagem() {
    estadoFase = 'CONTAGEM';
    jogoAtivo = true;
    textoContagem = '3';
    
    setTimeout(() => { textoContagem = '2'; }, 1000);
    setTimeout(() => { textoContagem = '1'; }, 2000);
    setTimeout(() => { textoContagem = infiniteLangData[settings.language].contagem_lute; }, 3000);
    setTimeout(() => {
        textoContagem = '';
        estadoFase = 'GAMEPLAY';
        tocarMusica(musicaAcao);
        iniciarProximaOnda();
    }, 4000);
}

/**
 * Inicia um novo ciclo do modo infinito.
 */
function iniciarProximoCiclo() {
    cicloAtual++;
    ondaAtual = 0;
    estadoFase = 'CICLO_COMPLETO';
    updateTexts(); // Atualiza o display do ciclo
    textoDialogo.textContent = "A Sombra se desfaz... por enquanto. A floresta testa seus limites novamente."; // Este pode ser adicionado ao lang data se desejar
    caixaDialogo.style.display = 'flex';
    pararMusica(musicaAcao);
    tocarSom(somVitoria);
}

/**
 * Gerencia a transição entre os estados da fase.
 */
function avancarEstadoFase() {
    switch(estadoFase) {
        case 'BEM_VINDO':
            caixaDialogo.style.display = 'none';
            inicializar(true);
            iniciarContagem();
            break;
        case 'GAMEPLAY':
            if (ondaAtual >= totalDeOndas && inimigos.length === 0 && projeteisInimigos.length === 0) {
                estadoFase = 'PRE_BOSS';
                mostrarDialogoPreBoss();
            } else if (inimigos.length === 0 && projeteisInimigos.length === 0) {
                if (ondaAtual === 3 && !fireMagicUnlocked) {
                    fireMagicUnlocked = true;
                    if (fireMagicBarContainer) fireMagicBarContainer.style.display = 'flex';
                    textoDialogo.textContent = "A energia neste lugar é opressora... mas sinto um novo poder despertar! Minha magia agora queima com FOGO!";
                    caixaDialogo.style.display = 'flex';
                    estadoFase = 'NARRATIVA_MAGIA';
                } else {
                    iniciarProximaOnda();
                }
            }
            break;
        case 'NARRATIVA_MAGIA':
            caixaDialogo.style.display = 'none'; estadoFase = 'GAMEPLAY'; iniciarProximaOnda(); 
            break;
        case 'PRE_BOSS':
            caixaDialogo.style.display = 'none'; iniciarLutaChefe(); 
            break;
        case 'CICLO_COMPLETO':
            caixaDialogo.style.display = 'none';
            estadoFase = 'GAMEPLAY';
            if (magicBarContainer) magicBarContainer.style.display = 'flex';
            if (geloBarContainer) geloBarContainer.style.display = 'flex';
            if (fireMagicUnlocked && fireMagicBarContainer) {
                fireMagicBarContainer.style.display = 'flex';
            }
            pararMusica(somVitoria);
            tocarMusica(musicaAcao);
            iniciarProximaOnda();
            break;
    }
}

/**
 * Exibe o diálogo antes da luta contra o chefe.
 */
function mostrarDialogoPreBoss() {
    textoDialogo.textContent = "O ciclo se repete. A Sombra retorna, alimentada pela sua própria persistência.";
    caixaDialogo.style.display = 'flex';
}

/**
 * Exibe a tela de Game Over.
 */
function gameOver() {
    // Função aninhada para enviar a pontuação
    async function enviarPontuacaoParaRanking(nickname, score) {
        try {
            // Lembre-se que o servidor local precisa estar rodando para isso funcionar.
            // lembrar de tirar o nome e a pontuação

            const response = await fetch('https://maelis-ranking-server.onrender.com/ranking', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ nome: nickname, pontuacao: score }) 
            });
            if (response.ok) { 
                console.log("Pontuação enviada com sucesso para o ranking!"); 
            } else { 
                console.error("Falha ao enviar pontuação para o rankings."); 
            }
        } catch (error) { 
            console.error("Erro de conexão com o servidor de ranking:", error); 
        }
    }
    // Chama a função para enviar a pontuação
    if (playerNickname) {
        enviarPontuacaoParaRanking(playerNickname, pontos);
    }
    
    jogoAtivo = false;
    estadoFase = 'FALHA';
    updateTexts(); // Garante que a tela de falha seja traduzida
    telaFalha.style.display = 'flex';
    pararMusica(musicaAcao);
    if(somGameOver) somGameOver.loop = false;
    tocarSom(somGameOver);
    player.lives = 0;
    atualizarExpressaoMaelis();
}

// =======================================================
// --- 5. LÓGICA DE JOGO: INIMIGOS, CHEFE, MECÂNICAS ---
// =======================================================

function danoNoChefe(dano) {
    if (boss.invincible || !boss || bossDerrotado) return;
    boss.hp -= dano;
    boss.hitTimer = 5;
    bossHealthBar.style.width = `${(boss.hp / boss.maxHp) * 100}%`;
    if (boss.hp <= 0 && !bossDerrotado) {
        bossDerrotado = true;
        bossUi.style.display = 'none';
        triggerScreenShake();
        criarExplosao(boss.x, boss.y, 'white', 200, 10);
        inimigos = []; 
        projeteisInimigos = []; 
        pontos += 500 * cicloAtual;
        updateTexts(); // Atualiza a pontuação na UI
        setTimeout(iniciarProximoCiclo, 2000);
    }
}

function iniciarLutaChefe() {
    bossDerrotado = false;
    estadoFase = 'BOSS_FIGHT';
    ondaDisplay.style.display = 'none';
    bossUi.style.display = 'block';
    if (magicBarContainer) magicBarContainer.style.display = 'none';
    if (fireMagicBarContainer) fireMagicBarContainer.style.display = 'none';
    if (geloBarContainer) geloBarContainer.style.display = 'none';
    
    boss = {
        x: canvas.width / 2, y: 180, width: 150, height: 150,
        hp: 250 + (cicloAtual - 1) * 150,
        maxHp: 250 + (cicloAtual - 1) * 150,
        attackDelay: Math.max(45, 100 - (cicloAtual - 1) * 5),
        phase: 1, attackTimer: 0, invincible: false, hitTimer: 0, targetX: canvas.width / 2, speed: 2, vineAngle: 0,
        arenaWalls: { left: 0, right: canvas.width }, image: bossImage
    };
    bossHealthBar.style.width = '100%';
    triggerScreenShake();
}

function iniciarProximaOnda() {
    ondaAtual++;
    updateTexts(); // Atualiza o display da onda
    ondaDisplay.style.display = 'block';
    inimigos = [];
    projeteisInimigos = [];
    const inimigosBase = ondaAtual <= 3 ? 9 : (ondaAtual <= 5 ? 12 : 15);
    const inimigosBonusCiclo = (cicloAtual - 1) * 2;
    const numInimigos = Math.min(40, inimigosBase + inimigosBonusCiclo);
    for (let i = 0; i < numInimigos; i++) {
        const randomX = Math.random() * (canvas.width - 100) + 50;
        const randomY = -50 - (Math.random() * 400);
        if (ondaAtual <= 1) { criarInimigo('ARANHA', randomX, randomY); }
        else if (ondaAtual <= 3) { const tipo = Math.random() < 0.6 ? 'ARANHA' : 'VAGALUME'; criarInimigo(tipo, randomX, randomY); }
        else if (ondaAtual <= 5) { const rand = Math.random(); if (rand < 0.45) criarInimigo('ARANHA', randomX, randomY); else if (rand < 0.8) criarInimigo('VAGALUME', randomX, randomY); else criarInimigo('FLOR', randomX, -50); }
        else { const rand = Math.random(); if (rand < 0.4) criarInimigo('ARANHA', randomX, randomY); else if (rand < 0.7) criarInimigo('VAGALUME', randomX, randomY); else if (rand < 0.9) criarInimigo('FLOR', randomX, -50); else criarInimigo('TOTEM', randomX, -50); }
    }
}

function criarInimigo(tipo, x, y) {
    let inimigo = { x, y, tipo, congelado: false };
    const hpBonus = Math.floor((cicloAtual - 1) / 2);
    const speedBonus = (cicloAtual - 1) * 0.1;
    switch (tipo) {
        case 'ARANHA':
            Object.assign(inimigo, { width: 40, height: 30, speed: 1.2 + Math.random() * 0.5 + speedBonus, hp: 1 + hpBonus, image: aranhaInimigoImage });
            break;
        case 'VAGALUME':
            Object.assign(inimigo, { width: 35, height: 35, speed: 1.8 + Math.random() * 0.7 + speedBonus, hp: 1 + hpBonus, image: vagalumeInimigoImage });
            break;
        case 'FLOR':
            Object.assign(inimigo, { width: 60, height: 80, speed: 0.5, hp: 4 + hpBonus, static: true, shootCooldown: 0, shootRate: Math.max(50, 120 - (cicloAtual - 1) * 4), image: florInimigoImage });
            break;
        case 'TOTEM':
            Object.assign(inimigo, { width: 60, height: 80, speed: 0.3, hp: 4 + hpBonus * 2, static: true, shootCooldown: 0, shootRate: Math.max(60, 180 - (cicloAtual - 1) * 5), image: totemInimigoImage });
            break;
    }
    inimigos.push(inimigo);
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
    }, 800);
}

// =======================================================
// --- 6. FUNÇÕES DE ATUALIZAÇÃO DO JOGO ---
// =======================================================

function atualizarExpressaoMaelis() {
    maelisNormalFace.style.display = 'none';
    maelisChorandoFace.style.display = 'none';
    maelisDescabeladaFace.style.display = 'none';
    maelisMortaFace.style.display = 'none';
    if (!player) return;
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

function aplicarDanoAoJogador(dano = 1) {
    if (player.invincible) return;
    gameContainer.classList.add('shake');
    setTimeout(() => { gameContainer.classList.remove('shake') }, 100);
    tocarSom(somDanoMaelis);
    tocarSom(somDaCriatura);
    
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
        gameOver();
    } else {
        player.invincible = true;
        setTimeout(() => { player.invincible = false }, 1500);
    }
}

function triggerScreenShake() {
    gameContainer.classList.add('screenshake');
    setTimeout(() => { gameContainer.classList.remove('screenshake') }, 500);
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
                    gameOver("Um inimigo escapou!");
                }
                return;
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

function atualizarChefe() {
    if (!boss || estadoFase !== 'BOSS_FIGHT' || bossDerrotado) return;
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
                    for (let i = 0; i < 3; i++) { setTimeout(() => criarProjetilChefe('ESPINHO_TELEGUIDO'), i * 150); }
                } else {
                    for (let i = 0; i < 5; i++) { criarProjetilChefe('SEMENTE_VENENO', { vx: (Math.random() - 0.5) * 10, vy: Math.random() * 5 + 2 }); }
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
            updateTexts();
            inimigos.splice(i, 1);
        }
    }
    setTimeout(() => { podeAtirarRaioSombra = true }, COOLDOWN_RAIO_SOMBRA);
}

// =======================================================
// --- 7. FUNÇÕES DE DESENHO E RENDERIZAÇÃO ---
// =======================================================

function atualizarVidasUI() {
    vidasContainer.innerHTML = '';
    if (!player) return;
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

function criarAmbiente() {
    ambiente = [];
    for (let i = 0; i < 100; i++) {
        ambiente.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 2, speed: Math.random() * 0.5 + 0.1, color: 'rgba(46, 77, 46, 0.5)' });
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
    if (!player) return;
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
            // Fallback para desenho de formas
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
        } else if (tiro.isIceShot) {
            ctx.shadowColor = "#00BFFF";
            if (iceMagicProjectileImage.complete && iceMagicProjectileImage.naturalWidth > 0) {
                ctx.drawImage(iceMagicProjectileImage, tiro.x - tiro.width / 2, tiro.y - tiro.height / 2, tiro.width, tiro.height);
            } else {
                ctx.fillStyle = "#ADD8E6";
                ctx.fillRect(tiro.x - tiro.width / 2, tiro.y, tiro.width, tiro.height);
            }
        } else {
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
                ctx.fillStyle = "#ADD8E6";
                ctx.fillRect(tiro.x - tiro.width / 2, tiro.y, tiro.width, tiro.height);
            }
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}

function desenharChefe() {
    if (!boss || !boss.image || !boss.image.complete || boss.image.naturalWidth === 0) return;
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
            // Fallback
        }
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
    }
    ctx.restore();
}

function desenharAuraGelo() {
    if (!modoGeloAtivo || !player) return;
    ctx.globalAlpha = 0.2 + (Math.sin(Date.now() / 200) * 0.05);
    ctx.fillStyle = '#87CEEB';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.width, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
}

function desenharAuraSombra() {
    if (!modoSombraAtivo || !player) return;
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
            // Fallback
        }
        raio.alpha -= 0.05;
        if (raio.alpha <= 0) {
            raiosSombra.splice(i, 1);
        }
    }
}

function checkCollision(obj1, obj2) {
    if (!obj1 || !obj2) return false;
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

// =======================================================
// --- 8. LOOP PRINCIPAL DE JOGO ---
// =======================================================

function atualizar() {
    animationFrameId = requestAnimationFrame(atualizar);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    desenharEAtualizarAmbiente();
    
    if (jogoAtivo && player) {
        if (leftPressed) { player.x -= player.speed; player.imagemAtual = maelisEsquerdaImg; }
        else if (rightPressed) { player.x += player.speed; player.imagemAtual = maelisDireitaImg; }
        else { player.imagemAtual = maelisParadaImg; }
        player.x = Math.max(player.width / 2, Math.min(canvas.width - player.width / 2, player.x));
        desenharPlayer();
    }
    
    if (estadoFase === 'CONTAGEM') {
        ctx.fillStyle = "white";
        ctx.font = "80px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(textoContagem, canvas.width / 2, canvas.height / 2);
        return;
    }
    
    if (!jogoAtivo) return;
    if (estadoFase !== 'GAMEPLAY' && estadoFase !== 'BOSS_FIGHT') return;

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

    if (magiaSombraDesbloqueada && estadoFase === 'GAMEPLAY' && magicBarFill) atualizarBarraSombra();
    if (fireMagicUnlocked && estadoFase === 'GAMEPLAY' && fireMagicBarFill) {
        const fillPercentage = (fireMagicCharge / enemiesToChargeFireMagic) * 100;
        fireMagicBarFill.style.width = `${fillPercentage}%`;
        fireMagicBarFill.classList.toggle('pronta', fillPercentage >= 100);
    }
    if (magiaGeloDesbloqueada && estadoFase === 'GAMEPLAY' && geloBarFill) atualizarBarraGelo();

    if (fireExplosionActive) {
        fireExplosionTimer--;
        if (fireExplosionTimer <= 0) {
            fireExplosionActive = false;
        } else {
            for (let j = inimigos.length - 1; j >= 0; j--) {
                const inimigo = inimigos[j];
                const distance = Math.hypot(player.x - inimigo.x, player.y - inimigo.y);
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
        if (tiro.speed !== undefined && tiro.speed !== 0) tiro.y -= tiro.speed;
        if (tiro.y < -tiro.height || (tiro.tipo === 'MAGIA_SOMBRA' && tiro.lifetime !== undefined && tiro.lifetime <= 0)) {
            tiros.splice(i, 1);
            continue;
        }
        
        let tiroRemovido = false;
        for (let j = inimigos.length - 1; j >= 0; j--) {
            const inimigo = inimigos[j];
            if (checkCollision(tiro, inimigo)) {
                if (tiro.isIceShot) {
                    inimigo.hp--;
                    criarExplosao(tiro.x, tiro.y, '#87CEEB', 5, 2);
                    if (inimigo.hp > 0 && !inimigo.congelado && inimigo.tipo !== 'VAGALUME') {
                        inimigo.congelado = true;
                        setTimeout(() => { if (inimigos.includes(inimigo)) inimigo.congelado = false }, DURACAO_CONGELAMENTO);
                    }
                } else {
                    inimigo.hp--;
                    criarExplosao(tiro.x, tiro.y, '#FFD700', 5, 2);
                }

                tiros.splice(i, 1);
                tiroRemovido = true;
                if (inimigo.hp <= 0) {
                    if (inimigos.includes(inimigo)) {
                        criarExplosao(inimigo.x, inimigo.y, '#FF00FF', 20);
                        inimigos.splice(j, 1);
                        pontos += 10;
                        updateTexts();
                        if (magiaGeloDesbloqueada && !magiaGeloEmCooldown) magiaGeloCarregada = Math.min(INIMIGOS_PARA_MAGIA_GELO, magiaGeloCarregada + 1);
                        if (magiaSombraDesbloqueada && !modoSombraAtivo) barraMagiaSombraAtual = Math.min(inimigosParaMagiaSombra, barraMagiaSombraAtual + 1);
                        if (fireMagicUnlocked) fireMagicCharge = Math.min(enemiesToChargeFireMagic, fireMagicCharge + 1);
                    }
                }
                if (tiroRemovido) break;
            }
        }
        if (!tiroRemovido && boss && estadoFase === 'BOSS_FIGHT' && checkCollision(tiro, boss)) {
            danoNoChefe(1);
            tiros.splice(i, 1);
            tiroRemovido = true;
        }
    }
    
    atualizarInimigos();
    atualizarProjeteisInimigos();
    if (estadoFase === 'BOSS_FIGHT') {
        atualizarChefe();
        atualizarAtaquesChefe();
    } else if (estadoFase === 'GAMEPLAY' && inimigos.length === 0 && projeteisInimigos.length === 0) {
        avancarEstadoFase();
    }
}

// =======================================================
// --- 9. MANIPULADORES DE EVENTOS ---
// =======================================================

document.addEventListener("keydown", e => {
    if (!jogoAtivo && estadoFase !== 'BEM_VINDO') return;
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") leftPressed = true;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") rightPressed = true;
    
    if (estadoFase === 'GAMEPLAY' || estadoFase === 'BOSS_FIGHT') {
        if (e.key === " ") {
            const currentTime = Date.now();
            if (currentTime - lastShotTime > shotCooldown) {
                tocarSom(somDisparo);
                let tiroSpeed = 8, tiroWidth = 6, isIceShot = false, tipoTiro = 'NORMAL';
                if (modoGeloAtivo) {
                    tiroWidth = 15;
                    tiroSpeed = 10;
                    isIceShot = true;
                } else if (fireMagicUnlocked) {
                    tiroSpeed = 12;
                    tiroWidth = 8;
                    tipoTiro = 'FOGO';
                }
                tiros.push({ x: player.x, y: player.y - player.height / 2, width: tiroWidth, height: 20, speed: tiroSpeed, tipo: tipoTiro, isIceShot: isIceShot });
                lastShotTime = currentTime;
            }
        }
        if (e.key.toLowerCase() === "z" && estadoFase !== 'BOSS_FIGHT') ativarModoGelo();
        if (e.key === "Shift" && !shiftPressed && magiaSombraDesbloqueada && estadoFase !== 'BOSS_FIGHT') {
            shiftPressed = true;
            if (!modoSombraAtivo) ativarModoSombra();
            else dispararRaioSombra();
        }
        if (e.key.toLowerCase() === "x" && !fireExplosionActive && fireMagicUnlocked && fireMagicCharge >= enemiesToChargeFireMagic && estadoFase !== 'BOSS_FIGHT') {
            tocarSom(somHabilidade);
            fireExplosionActive = true;
            fireExplosionTimer = fireExplosionDuration;
            fireMagicCharge = 0;
            triggerScreenShake();
            if (fireMagicBarFill) fireMagicBarFill.style.width = '0%';
        }
    }
});

document.addEventListener("keyup", e => {
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") leftPressed = false;
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") rightPressed = false;
    if (e.key === " ") spacePressed = false;
    if (e.key === "Shift") shiftPressed = false;
});

btnContinuar.addEventListener("click", () => { tocarSom(somClick); avancarEstadoFase(); });

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => tocarSom(somHover));
    if (button.id !== 'btn-continuar') button.addEventListener('click', () => tocarSom(somClick));
});

btnVoltarMenuFase.addEventListener("click", () => {
    tocarSom(somClick);
    localStorage.removeItem('currentMenuMusicTime');
    window.location.href = '../../Menu/menu.html#menu-principal';
});

btnTentarNovamente.addEventListener("click", () => {
    tocarSom(somClick);
    telaFalha.style.display = 'none';
    inicializar(true);
    iniciarContagem();
});

btnVoltarMenuFalha.addEventListener("click", () => {
    tocarSom(somClick);
    localStorage.removeItem('currentMenuMusicTime');
    window.location.href = '../../Menu/menu.html#menu-principal';
});

// =======================================================
// --- 10. INICIALIZAÇÃO DO JOGO ---
// =======================================================
// O código de inicialização é colocado dentro do 'window.onload'
// para garantir que todos os elementos da página foram carregados
// antes do script tentar acessá-los, prevenindo erros.
window.onload = () => {
    loadSettings();
    
    // << NOVO: Pega o nickname do jogador ANTES de qualquer outra coisa >>
    const texts = infiniteLangData[settings.language];
    playerNickname = prompt(texts.prompt_nickname, texts.prompt_padrao);
    if (!playerNickname || playerNickname.trim() === "") {
        playerNickname = texts.prompt_padrao;
    } else {
        playerNickname = playerNickname.substring(0, 15);
    }
    
    updateTexts(); // Aplica a tradução inicial a todos os elementos
    mostrarDialogoDeEntrada();
};