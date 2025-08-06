// =======================================================
// --- ARQUIVO COMBINADO: fase1Script.js + fase1Scripttraduzida.js ---
// =======================================================

// =======================================================
// --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
// =======================================================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// --- Elementos da Interface ---
const vidasDiv = document.getElementById("vidas");
const pontuacaoDiv = document.getElementById("pontuacao");
const tutorialMovimento = document.getElementById("tutorial-movimento");
const tutorialAtaque = document.getElementById("tutorial-ataque");
const caixaDialogo = document.getElementById("caixa-dialogo");
const textoDialogo = document.getElementById("texto-dialogo");
const btnContinuar = document.getElementById("btn-continuar");
const fimDeFaseDiv = document.getElementById("fim-de-fase");
const btnVoltarMenuFase = document.getElementById("btnVoltarMenuFase");
const telaFalha = document.getElementById("tela-falha");
const btnTentarNovamente = document.getElementById("btn-tentar-novamente");
const btnVoltarMenuFalha = document.getElementById("btn-voltar-menu-falha");
const avisoEscape = document.getElementById("aviso-escape");
const ondaDisplay = document.getElementById("onda-display"); // <-- ADICIONADO

// --- Elementos de Áudio ---
const somClick = document.getElementById("som-click");
const somHover = document.getElementById("som-hover");
const somGameOver = document.getElementById("som-game-over");
const somDisparo = document.getElementById("som-disparo");
const musicaAcao = document.getElementById("musica-acao");
const musicaVitoria = document.getElementById("musica-vitoria");
const somDanoMaelis = document.getElementById("dano-maelis");
const somDaCriatura = document.getElementById("som-da-criatura");


// --- NOVOS ELEMENTOS DE IMAGEM DA REAÇÃO DA MAELIS ---
const maelisNormalFace = document.getElementById("maelis-normal");
const maelisChorandoFace = document.getElementById("maelis-chorando"); // Novo
const maelisDescabeladaFace = document.getElementById("maelis-descabelada"); // Novo (antiga muito-triste)
const maelisMortaFace = document.getElementById("maelis-morta"); // Novo

// =======================================================
// --- 2. MOTOR DE CONFIGURAÇÕES, TRADUÇÃO E ÁUDIO ---
// =======================================================

// --- Objeto de Configurações Padrão ---
let settings = { music: true, sfx: true, language: 'pt' };

// --- Dados de Tradução ---
const fase1LangData = {
    'pt': {
        titulo_fase1: "Maelis: Fase 1 - Clareira da Névoa",
        pontos: "Pontos:",
        tutorial_movimento: "Use as setas ← e → para mover.",
        tutorial_ataque: "Pressione 'Espaço' para atacar.",
        aviso_escape: "AVISO! Um inimigo escapou. Não deixe que aconteça de novo!",
        dialogo_final: "Nada mal! Mas é bom se preparar para o que vem mais a frente.",
        btn_continuar: "Continuar",
        vitoria_titulo: "Fase Concluída!",
        derrota_titulo: "Fim de Jogo!",
        derrota_subtitulo_vidas: "A escuridão venceu desta vez.",
        derrota_subtitulo_escape: "Você deixou um inimigo escapar!",
        btn_tentar_novamente: "Tentar Novamente",
        btn_voltar_menu: "Voltar ao Menu",
    },
    'en': {
        titulo_fase1: "Maelis: Phase 1 - Mist Clearing",
        pontos: "Points:",
        tutorial_movimento: "Use the arrow keys ← and → to move.",
        tutorial_ataque: 'Press "Space" to attack.',
        aviso_escape: "WARNING! An enemy has escaped. Don't let it happen again!",
        dialogo_final: "Not bad! But it's good to be prepared for what's ahead.",
        btn_continuar: "Continue",
        vitoria_titulo: "Phase Complete!",
        derrota_titulo: "Game Over!",
        derrota_subtitulo_vidas: "The darkness has won this time.",
        derrota_subtitulo_escape: "You let an enemy escape!",
        btn_tentar_novamente: "Try Again",
        btn_voltar_menu: "Return to Menu",
    },
    'es': {
        titulo_fase1: "Maelis: Fase 1 - Claro de la Niebla",
        pontos: "Puntos:",
        tutorial_movimento: "Usa las flechas ← y → para moverte.",
        tutorial_ataque: "Pulsa 'Espacio' para atacar.",
        aviso_escape: "¡AVISO! Un enemigo ha escapado. ¡No dejes que vuelva a suceder!",
        dialogo_final: "¡Nada mal! Pero es bueno estar preparado para lo que nos espera.",
        btn_continuar: "Continuar",
        vitoria_titulo: "¡Fase Completada!",
        derrota_titulo: "¡Fin del Juego!",
        derrota_subtitulo_vidas: "La oscuridad ha ganado esta vez.",
        derrota_subtitulo_escape: "¡Dejaste escapar a un enemigo!",
        btn_tentar_novamente: "Intentar de Nuevo",
        btn_voltar_menu: "Volver al Menú",
    }
};

// --- Funções do Motor ---
function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('maelis-settings'));
    if (savedSettings) {
        settings = { ...settings, ...savedSettings };
    }
    // Adiciona esta linha para aplicar as configurações de áudio
    applyAudioSettings();
}

// Esta função aplica as configurações de áudio
function applyAudioSettings() {
    if (settings.music) {
        musicaAcao.muted = false;
        musicaVitoria.muted = false;
        somGameOver.muted = false;
    } else {
        musicaAcao.muted = true;
        musicaVitoria.muted = true;
        somGameOver.muted = true;
    }
    somClick.muted = !settings.sfx;
    somHover.muted = !settings.sfx;
    somDisparo.muted = !settings.sfx;
    somDanoMaelis.muted = !settings.sfx;
    somDaCriatura.muted = !settings.sfx;
}

function updateTexts() {
    const texts = fase1LangData[settings.language] || fase1LangData['pt'];
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (texts[key]) {
            if (element.id === 'pontuacao') {
                element.textContent = `${texts.pontos} ${pontos}`;
            } else {
                element.textContent = texts[key];
            }
        }
    });
    document.title = texts.titulo_fase1;
}

function tocarSom(somElement) {
    if (settings.sfx && somElement) {
        somElement.currentTime = 0;
        somElement.play().catch(e => console.error("Erro ao tocar SFX:", e));
    }
}

function tocarMusica(musicaElement) {
    if (settings.music && musicaElement) {
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
if (musicaAcao) musicaAcao.volume = 0.9;
if (musicaVitoria) musicaVitoria.volume = 0.5;
if (somHover) somHover.volume = 0.3;
if (somGameOver) somGameOver.volume = 0.5;
if (somClick) somClick.volume = 0.3;
if (somDanoMaelis) somDanoMaelis.volume = 0.3;
if (somDaCriatura) somDaCriatura.volume = 0.3;

// --- Constantes do Jogo ---
const limiteEsquerdo = 50;
const limiteDireito = canvas.width - 50;
const totalDeOndas = 3;
const MAX_LIVES = 3;

// --- Variáveis de Estado ---
let player, tiros, inimigos, pontos, estrelas, particulas;
let leftPressed = false, rightPressed = false, spacePressed = false;
let jogoAtivo = false;
let estadoFase = 'TUTORIAL_MOVIMENTO';
let ondaAtual = 0;
let primeiroAvisoDado = false;
let animationFrameId;

// --- Variáveis para Cadência de Tiro ---
let canShoot = true;
const shotCooldown = 3330 / 8;
let lastShotTime = 0;

// --- Carregamento de Imagens (Com Animação) ---
const maelisParadaImg = new Image();
maelisParadaImg.src = 'assets/Maelis_de_costas.png';
const maelisDireitaImg = new Image();
maelisDireitaImg.src = 'assets/Maelis_de_costas_1.png';
const maelisEsquerdaImg = new Image();
maelisEsquerdaImg.src = 'assets/Maelis_de_costas_2.png';
const enemyAranhaImage = new Image();
enemyAranhaImage.src = 'assets/aranha-inimigo1.png';

// --- NOVO: Imagem do tiro (sprite) ---
const tiroSprite = new Image();
tiroSprite.src = 'assets/magia-normal.png';

// --- NOVAS IMAGENS PARA A REAÇÃO DA MAELIS ---
const maelisNormalFaceImg = new Image();
maelisNormalFaceImg.src = 'assets/maelis-face-normal.png';
const maelisChorandoFaceImg = new Image();
maelisChorandoFaceImg.src = 'assets/maelis-face-chorando.png';
const maelisDescabeladaFaceImg = new Image();
maelisDescabeladaFaceImg.src = 'assets/maelis-face-descabelada.png';
const maelisMortaFaceImg = new Image();
maelisMortaFaceImg.src = 'assets/maelis-face-morta.png';

const imagesToLoad = [
    maelisParadaImg, maelisDireitaImg, maelisEsquerdaImg, enemyAranhaImage, tiroSprite,
    maelisNormalFaceImg, maelisChorandoFaceImg, maelisDescabeladaFaceImg, maelisMortaFaceImg
];
let imagesLoadedCount = 0;

function startWhenImagesLoaded() {
    imagesLoadedCount++;
    if (imagesLoadedCount === imagesToLoad.length) {
        console.log("Todas as imagens carregadas.");
        inicializar();
    }
}

imagesToLoad.forEach(img => {
    img.onload = startWhenImagesLoaded;
    img.onerror = () => console.error("Erro ao carregar imagem: " + img.src);
});


// =======================================================
// --- 4. CONTROLE DE FLUXO DA FASE ---
// =======================================================

function atualizarVidasDisplay() {
    vidasDiv.innerHTML = '';
    for (let i = 0; i < player.lives; i++) {
        vidasDiv.innerHTML += '❤️';
    }
}

function atualizarExpressaoMaelis() {
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
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    loadSettings();

    pararMusica(somGameOver);
    pararMusica(musicaAcao);
    pararMusica(musicaVitoria);

    player = {
        x: canvas.width / 2, y: canvas.height - 80,
        width: 55, height: 70, speed: 6, lives: MAX_LIVES,
        invincible: false, imagemAtual: maelisParadaImg
    };

    tiros = []; inimigos = []; particulas = [];
    pontos = 0; ondaAtual = 0; primeiroAvisoDado = false;
    leftPressed = false; rightPressed = false; spacePressed = false;
    jogoAtivo = true; estadoFase = 'TUTORIAL_MOVIMENTO';

    updateTexts();
    atualizarVidasDisplay();
    atualizarExpressaoMaelis();

    tutorialMovimento.style.display = 'block';
    tutorialAtaque.style.display = 'none';
    caixaDialogo.style.display = 'none';
    fimDeFaseDiv.style.display = 'none';
    telaFalha.style.display = 'none';
    avisoEscape.style.display = 'none';
    if (ondaDisplay) ondaDisplay.style.display = 'none';

    criarEstrelas();
    atualizar();
}

function avancarEstadoFase() {
    switch (estadoFase) {
        case 'TUTORIAL_MOVIMENTO':
            tutorialMovimento.style.display = 'none';
            tutorialAtaque.style.display = 'block';
            estadoFase = 'TUTORIAL_ATAQUE';
            break;
        case 'TUTORIAL_ATAQUE':
            tutorialAtaque.style.display = 'none';
            estadoFase = 'GAMEPLAY';
            tocarMusica(musicaAcao);
            iniciarProximaOnda();
            break;
        case 'NARRATIVA':
            caixaDialogo.style.display = 'none';
            fimDeFaseDiv.style.display = 'flex';
            updateTexts();
            
            const progressoAtual = localStorage.getItem('nivelConcluido') || '0';
            if (parseInt('1') > parseInt(progressoAtual)) {
                localStorage.setItem('nivelConcluido', '1');
            }
            estadoFase = 'FASE_FINALIZADA';
            jogoAtivo = false;
            break;
        case 'GAMEPLAY':
            estadoFase = 'NARRATIVA';
            mostrarDialogoFinal();
            pararMusica(musicaAcao);
            
            if (musicaVitoria) {
                musicaVitoria.loop = false;
            }
            tocarMusica(musicaVitoria);
            break;
    }
}

function mostrarDialogoFinal() {
    const texts = fase1LangData[settings.language] || fase1LangData['pt'];
    textoDialogo.textContent = texts.dialogo_final;
    caixaDialogo.style.display = 'block';
    btnContinuar.onclick = () => {
        tocarSom(somClick);
        avancarEstadoFase();
    };
}

function mostrarAvisoDeEscape() {
    if (avisoEscape.style.display === 'block') return;
    updateTexts();
    avisoEscape.style.display = 'block';
    avisoEscape.style.opacity = 1;
    setTimeout(() => {
        avisoEscape.style.opacity = 0;
        setTimeout(() => { avisoEscape.style.display = 'none'; }, 500);
    }, 3500);
}

function gameOver(motivo = "vidas") {
    jogoAtivo = false;
    estadoFase = 'GAMEOVER';
    pararMusica(musicaAcao);
    if (somGameOver) {
        somGameOver.loop = false;
    }
    
    tocarMusica(somGameOver);
    
    const texts = fase1LangData[settings.language] || fase1LangData['pt'];
    telaFalha.querySelector('h1').textContent = texts.derrota_titulo;
    telaFalha.querySelector('p').textContent = (motivo === "escape") ? texts.derrota_subtitulo_escape : texts.derrota_subtitulo_vidas;
    
    fimDeFaseDiv.style.display = 'none';
    telaFalha.style.display = 'flex';
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (motivo === "vidas") {
        player.lives = 0;
        atualizarExpressaoMaelis();
    }
}

function aplicarDanoAoJogador() {
    if (player.invincible) return;
    player.lives--;
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
    atualizarVidasDisplay();
    atualizarExpressaoMaelis();
    criarExplosao(player.x, player.y, '#FFA500');
    if (player.lives <= 0) {
        gameOver("vidas");
    } else {
        player.invincible = true;
        setTimeout(() => { player.invincible = false; }, 2000);
    }
}

// =======================================================
// --- 5. LÓGICA DO JOGO (LOOP PRINCIPAL) ---
// =======================================================
function iniciarProximaOnda() {
    ondaAtual++;
    if (ondaDisplay) {
        ondaDisplay.textContent = `Onda ${ondaAtual} / ${totalDeOndas}`;
        ondaDisplay.style.display = 'block';
    }
    inimigos = [];
    if (ondaAtual === 1) { 
        for (let i = 0; i < 3; i++) criarAranhaCorrompida(150, -50 - (i * 60)); 
        criarAranhaCorrompida(canvas.width / 2, -150); 
        criarAranhaCorrompida(canvas.width / 2 - 60, -210); 
        criarAranhaCorrompida(canvas.width / 2 + 60, -210); 
    } else if (ondaAtual === 2) { 
        for (let i = 0; i < 7; i++) criarAranhaCorrompida(limiteEsquerdo + 50 + (i * 100), -50); 
    } else if (ondaAtual === 3) { 
        for (let i = 0; i < 4; i++) { 
            criarAranhaCorrompida(limiteEsquerdo + 80 + (i * 50), -50 - (i * 50)); 
            criarAranhaCorrompida(limiteDireito - 80 - (i * 50), -50 - (i * 50)); 
        } 
    }
}

function criarAranhaCorrompida(x, y) {
    inimigos.push({ x: x, y: y, width: 40, height: 30, speed: 1.2 + Math.random() * 0.5, tipo: 'ARANHA' });
}

function atualizar() {
    if (estadoFase === 'FASE_FINALIZADA' || estadoFase === 'GAMEOVER' || estadoFase === 'NARRATIVA') return;
    animationFrameId = requestAnimationFrame(atualizar);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharEAtualizarEstrelas();

    if (jogoAtivo) {
        if (leftPressed) { player.x -= player.speed; player.imagemAtual = maelisEsquerdaImg; } 
        else if (rightPressed) { player.x += player.speed; player.imagemAtual = maelisDireitaImg; } 
        else { player.imagemAtual = maelisParadaImg; }

        if (player.x - player.width / 2 < limiteEsquerdo) player.x = limiteEsquerdo + player.width / 2;
        if (player.x + player.width / 2 > limiteDireito) player.x = limiteDireito - player.width / 2;
    }

    desenharPlayer();
    desenharEAtualizarParticulas();

    for (let i = tiros.length - 1; i >= 0; i--) {
        const tiro = tiros[i];
        tiro.y -= tiro.speed;
        desenharTiro(tiro);
        if (tiro.y < -tiro.height) tiros.splice(i, 1);
    }

    for (let i = inimigos.length - 1; i >= 0; i--) {
        const inimigo = inimigos[i];
        if (jogoAtivo) inimigo.y += inimigo.speed;
        desenharInimigo(inimigo);

        for (let j = tiros.length - 1; j >= 0; j--) {
            const tiro = tiros[j];
            if (tiro.x < inimigo.x + inimigo.width / 2 && tiro.x + tiro.width > inimigo.x - inimigo.width / 2 &&
                tiro.y < inimigo.y + inimigo.height / 2 && tiro.y + tiro.height > inimigo.y - inimigo.height/2) {
                criarExplosao(inimigo.x, inimigo.y, '#FF00FF');
                inimigos.splice(i, 1); tiros.splice(j, 1);
                pontos += 10;
                updateTexts();
                break;
            }
        }
        if (!inimigos[i]) continue;

        if (!player.invincible && jogoAtivo) {
            if (player.x < inimigo.x + inimigo.width/2 && player.x + player.width > inimigo.x - inimigo.width/2 &&
                player.y < inimigo.y + inimigo.height/2 && player.y + player.height > inimigo.y - inimigo.height/2) {
                aplicarDanoAoJogador();
                inimigos.splice(i, 1);
                continue;
            }
        }
        if (inimigo.y - inimigo.height / 2 > canvas.height) {
            inimigos.splice(i, 1);
            if (!primeiroAvisoDado) {
                primeiroAvisoDado = true;
                mostrarAvisoDeEscape();
            } else {
                gameOver("escape");
            }
        }
    }

    // Lógica para avançar a fase quando todos os inimigos da onda atual forem eliminados
    if (estadoFase === 'GAMEPLAY' && inimigos.length === 0) {
        if (ondaAtual < totalDeOndas) {
            iniciarProximaOnda();
        } else {
            // Chamada para avançar o estado quando todas as ondas forem concluídas
            avancarEstadoFase(); // Isso agora levará ao estado 'NARRATIVA'
        }
    }
}


// =======================================================
// --- 6. FUNÇÕES DE DESENHO E EFEITOS ---
// =======================================================
function criarEstrelas() { estrelas = []; for (let i = 0; i < 150; i++) { estrelas.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 1.5, speed: Math.random() * .4 + .2 }); } }
function desenharEAtualizarEstrelas() { ctx.fillStyle = "rgba(173, 216, 230, 0.7)"; for (const estrela of estrelas) { estrela.y += estrela.speed; if (estrela.y > canvas.height) { estrela.y = 0; estrela.x = Math.random() * canvas.width; } ctx.beginPath(); ctx.arc(estrela.x, estrela.y, estrela.radius, 0, Math.PI * 2); ctx.fill(); } }
function criarExplosao(x, y, cor) { for (let i = 0; i < 20; i++) { particulas.push({ x: x, y: y, vx: (Math.random() - .5) * 4, vy: (Math.random() - .5) * 4, radius: Math.random() * 3, cor: cor, vida: 40 }); } }
function desenharEAtualizarParticulas() { for (let i = particulas.length - 1; i >= 0; i--) { const p = particulas[i]; p.x += p.vx; p.y += p.vy; p.vida--; if (p.vida <= 0) { particulas.splice(i, 1); continue; } ctx.fillStyle = p.cor; ctx.globalAlpha = p.vida / 40; ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; } }

function desenharPlayer() {
    ctx.globalAlpha = player.invincible ? (Math.floor(Date.now() / 150) % 2 === 0 ? .9 : .4) : 1;
    const img = player.imagemAtual;
    if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    } else { // Fallback
        ctx.fillStyle = "blue";
        ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    }
    ctx.globalAlpha = 1;
}

function desenharInimigo(inimigo) {
    const img = enemyAranhaImage;
    if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, inimigo.x - inimigo.width / 2, inimigo.y - inimigo.height / 2, inimigo.width, inimigo.height);
    } else { // Fallback
        ctx.fillStyle = "#8B008B"; ctx.shadowColor = "#FF00FF"; ctx.shadowBlur = 15;
        ctx.beginPath(); ctx.arc(inimigo.x, inimigo.y, inimigo.width / 2, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function desenharTiro(tiro) {
    // --- NOVO CÓDIGO: Desenha o sprite do tiro em vez do retângulo ---
    const img = tiroSprite;
    if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, tiro.x - tiro.width / 2, tiro.y - tiro.height / 2, tiro.width, tiro.height);
    } else { // Fallback, caso a imagem não carregue
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(tiro.x - tiro.width / 2, tiro.y, tiro.width, tiro.height);
    }
}


// =======================================================
// --- 7. EVENTOS DE ENTRADA (TECLADO E BOTÕES) ---
// =======================================================
document.addEventListener("keydown", (e) => {
    // Permite interagir com o tutorial ou avançar o diálogo mesmo se o jogo não estiver "ativo" no gameplay
    if (!jogoAtivo && estadoFase !== 'TUTORIAL_MOVIMENTO' && estadoFase !== 'TUTORIAL_ATAQUE' && estadoFase !== 'NARRATIVA') return; 

    const key = e.key.toLowerCase();
    if (key === "arrowleft" || key === "a") {
        leftPressed = true;
        if (estadoFase === 'TUTORIAL_MOVIMENTO') avancarEstadoFase();
    }
    if (key === "arrowright" || key === "d") {
        rightPressed = true;
        if (estadoFase === 'TUTORIAL_MOVIMENTO') avancarEstadoFase();
    }
    if (key === " ") { // Removido o '!spacePressed' aqui para permitir manter a tecla pressionada para tiros contínuos
    const currentTime = Date.now();
    // Permite atirar apenas no gameplay ou tutorial de ataque E se o cooldown permiti
    if ((estadoFase === 'GAMEPLAY' || estadoFase === 'TUTORIAL_ATAQUE') && canShoot && (currentTime - lastShotTime > shotCooldown)) {
        tocarSom(somDisparo);
        // --- NOVO CÓDIGO (AJUSTE DE TAMANHO) ---
            tiros.push({ x: player.x, y: player.y - player.height / 2, width: 15, height: 20, speed: 8 });
        lastShotTime = currentTime; // Atualiza o tempo do último tiro

        // Para o tutorial, avance a fase apenas no primeiro tiro
        if (estadoFase === 'TUTORIAL_ATAQUE') {
            avancarEstadoFase();
            }
        }
    }
});

document.addEventListener("keyup", (e) => {
    const key = e.key.toLowerCase();
    if (key === "arrowleft" || key === "a") leftPressed = false;
    if (key === "arrowright" || key === "d") rightPressed = false;
    // if (key === " ") spacePressed = false; // Linha removida/comentada
});

// --- Eventos dos Botões ---
function setupButtonEvents() {
    // btnContinuar agora tem seu evento configurado dentro de mostrarDialogoFinal
    const buttons = [btnVoltarMenuFase, btnTentarNovamente, btnVoltarMenuFalha]; 
    buttons.forEach(btn => {
        if (btn) {
            btn.addEventListener("mouseover", () => tocarSom(somHover));
        }
    });

    // Removido: if (btnContinuar) btnContinuar.addEventListener("click", ...)
    // Agora o btnContinuar é configurado dentro de mostrarDialogoFinal()

    if (btnTentarNovamente) btnTentarNovamente.addEventListener("click", () => { tocarSom(somClick); inicializar(); });
    
    const backToMenuAction = () => {
        tocarSom(somClick);
        // Limpa o tempo da música salvo no localStorage para reiniciar no menu
        localStorage.removeItem('currentMenuMusicTime'); 
        setTimeout(() => { window.location.href = '../../Menu/menu.html#menu-principal'; }, 150);
    };

    if(btnVoltarMenuFase) btnVoltarMenuFase.addEventListener("click", backToMenuAction);
    if(btnVoltarMenuFalha) btnVoltarMenuFalha.addEventListener("click", backToMenuAction);
}

setupButtonEvents();