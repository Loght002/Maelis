const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const btnReiniciar = document.getElementById("btnReiniciar");
const pontuacaoDiv = document.getElementById("pontuacao");
const btnVoltarMenu = document.getElementById("btnVoltarMenu");

const limiteSuperior = 250;
const limiteEsquerdo = 50;
const limiteDireito = canvas.width - 50;

let player;
let tiros;
let inimigos;
let inimigosAzuis;
let tirosInimigo;
let pontos;
let estrelas;
let particulas;
let textoContagem = "";

let leftPressed = false;
let rightPressed = false;
let spacePressed = false;

let jogoAtivo = false;

let gameLoopId;
let inimigoIntervalId;
let inimigoAzulIntervalId;

// --- FUNÇÕES DE DESENHO ---

function criarEstrelas() {
    estrelas = [];
    for (let i = 0; i < 100; i++) {
        estrelas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5 + 0.5,
            speed: Math.random() * 0.5 + 0.2
        });
    }
}

function desenharEAtualizarEstrelas() {
    ctx.fillStyle = "#FFF";
    for (const estrela of estrelas) {
        estrela.y += estrela.speed;
        if (estrela.y > canvas.height) {
            estrela.y = 0;
            estrela.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(estrela.x, estrela.y, estrela.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

function criarExplosao(x, y, cor) {
    for (let i = 0; i < 20; i++) {
        particulas.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            radius: Math.random() * 3 + 1,
            cor: cor,
            vida: 50
        });
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
        ctx.globalAlpha = p.vida / 50;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

function desenharPlayer() {
    ctx.globalAlpha = 1.0; 

    if (player.invincible) {
        const piscar = Math.floor(Date.now() / 150) % 2 === 0;
        if (piscar) {
            ctx.globalAlpha = 0.6;
        } else {
            ctx.globalAlpha = 0.2;
        }
    }

    ctx.fillStyle = "#00FF00";
    ctx.shadowColor = "#00FF00";
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(player.x, player.y - player.radius);
    ctx.lineTo(player.x - player.radius * 0.8, player.y + player.radius * 0.6);
    ctx.lineTo(player.x + player.radius * 0.8, player.y + player.radius * 0.6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#005500";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();

    if (jogoAtivo) {
        ctx.fillStyle = "#FFD700";
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 15;
        const alturaPropulsor = (Math.random() * 10 + 10);
        ctx.beginPath();
        ctx.moveTo(player.x - player.radius * 0.4, player.y + player.radius * 0.7);
        ctx.lineTo(player.x + player.radius * 0.4, player.y + player.radius * 0.7);
        ctx.lineTo(player.x, player.y + player.radius * 0.7 + alturaPropulsor);
        ctx.closePath();
        ctx.fill();
    }

    ctx.globalAlpha = 1.0; 
    ctx.shadowBlur = 0;
}

function desenharVidas() {
    const heartSize = 20;
    const padding = 10;
    const startX = 30;
    const startY = 60; 

    ctx.fillStyle = '#FF3C3C';
    ctx.shadowColor = '#FF3C3C';
    ctx.shadowBlur = 10;

    for (let i = 0; i < player.lives; i++) {
        const x = startX + i * (heartSize + padding);
        const y = startY;

        ctx.beginPath();
        ctx.moveTo(x, y + heartSize / 4);
        ctx.bezierCurveTo(x, y, x - heartSize / 2, y, x - heartSize / 2, y + heartSize / 4);
        ctx.bezierCurveTo(x - heartSize / 2, y + heartSize / 2, x, y + heartSize / 1.5, x, y + heartSize);
        ctx.bezierCurveTo(x, y + heartSize / 1.5, x + heartSize / 2, y + heartSize / 2, x + heartSize / 2, y + heartSize / 4);
        ctx.bezierCurveTo(x + heartSize / 2, y, x, y, x, y + heartSize / 4);
        ctx.closePath();
        ctx.fill();
    }
    ctx.shadowBlur = 0;
}


function desenharInimigo(inimigo) {
    ctx.fillStyle = "#FF3C3C";
    ctx.shadowColor = "#FF3C3C";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(inimigo.x, inimigo.y + inimigo.height);
    ctx.lineTo(inimigo.x - inimigo.width / 2, inimigo.y);
    ctx.lineTo(inimigo.x + inimigo.width / 2, inimigo.y);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
}

function desenharInimigoAzul(inimigo) {
    ctx.fillStyle = "#3C3CFF";
    ctx.shadowColor = "#3C3CFF";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(inimigo.x, inimigo.y, inimigo.width / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
}

function desenharTiro(tiro, cor) {
    ctx.fillStyle = cor;
    ctx.shadowColor = cor;
    ctx.shadowBlur = 15;
    ctx.fillRect(tiro.x - tiro.width / 2, tiro.y, tiro.width, tiro.height);
    ctx.shadowBlur = 0;
}

function desenharContagem() {
    if (textoContagem !== "") {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "80px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#00FFFF";
        ctx.shadowBlur = 10;
        ctx.fillText(textoContagem, canvas.width / 2, canvas.height / 2 - 100);
        ctx.shadowBlur = 0;
    }
}

// --- FUNÇÕES PRINCIPAIS DO JOGO ---

function inicializar() {
    cancelAnimationFrame(gameLoopId);
    clearInterval(inimigoIntervalId);
    clearInterval(inimigoAzulIntervalId);

    player = {
        x: canvas.width / 2,
        y: canvas.height - 80,
        radius: 25,
        speed: 6,
        lives: 3,
        invincible: false
    };

    tiros = [];
    inimigos = [];
    inimigosAzuis = [];
    tirosInimigo = [];
    particulas = [];
    pontos = 0;
    textoContagem = "";

    pontuacaoDiv.textContent = "Pontos: 0";
    leftPressed = false;
    rightPressed = false;
    spacePressed = false;
    jogoAtivo = false;

    btnReiniciar.style.display = "none";
    btnVoltarMenu.style.display = "none"
    canvas.style.filter = "none";

    if (!estrelas) criarEstrelas();

    iniciarContagemRegressiva();
    atualizar();
}

function iniciarContagemRegressiva() {
    setTimeout(() => { textoContagem = "3"; }, 500);
    setTimeout(() => { textoContagem = "2"; }, 1500);
    setTimeout(() => { textoContagem = "1"; }, 2500);
    setTimeout(() => { textoContagem = "GO!"; }, 3500);
    setTimeout(() => {
        textoContagem = "";
        jogoAtivo = true;
        iniciarLoopsDeInimigos();
    }, 4500);
}

function criarInimigo() {
    if (!jogoAtivo) return;
    inimigos.push({
        x: Math.random() * (limiteDireito - limiteEsquerdo - 40) + limiteEsquerdo + 20,
        y: -50,
        width: 40,
        height: 30,
        speed: 1.5 + Math.random() * 1.5,
        ativo: true,
        tempoTiro: Math.random() * 100
    });
}

function criarInimigoAzul() {
    if (!jogoAtivo) return;
    inimigosAzuis.push({
        x: Math.random() * (limiteDireito - limiteEsquerdo - 30) + limiteEsquerdo + 15,
        y: -30,
        width: 30,
        height: 30,
        speed: 0.5 + Math.random() * 0.5,
    });
}

function gameOver() {
    jogoAtivo = false;
    btnReiniciar.style.display = "block";
    btnVoltarMenu.style.display = "block";
    criarExplosao(player.x, player.y, '#00FF00');
}

function atualizar() {
    gameLoopId = requestAnimationFrame(atualizar);

    if (jogoAtivo) {
        if (leftPressed) player.x -= player.speed;
        if (rightPressed) player.x += player.speed;

        if (player.x - player.radius < limiteEsquerdo) player.x = limiteEsquerdo + player.radius;
        if (player.x + player.radius > limiteDireito) player.x = limiteDireito - player.radius;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharEAtualizarEstrelas();

    // Desenha as bordas
    ctx.strokeStyle = "rgba(0, 0, 0, 0)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(limiteEsquerdo, limiteSuperior);
    ctx.lineTo(limiteDireito, limiteSuperior);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(limiteEsquerdo, 0);
    ctx.lineTo(limiteEsquerdo, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(limiteDireito, 0);
    ctx.lineTo(limiteDireito, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    if (jogoAtivo) {
        ctx.strokeStyle = "rgba(0, 0, 0, 0)";
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(limiteEsquerdo, player.y);
        ctx.lineTo(limiteDireito, player.y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    desenharPlayer();
    desenharVidas();

    if (jogoAtivo) {
        for (let i = tiros.length - 1; i >= 0; i--) {
            const tiro = tiros[i];
            tiro.y -= tiro.speed;
            desenharTiro(tiro, "#FFFF00");
            if (tiro.y < -tiro.height) {
                tiros.splice(i, 1);
            }
        }
    }

    // Lógica dos inimigos vermelhos
    for (let i = inimigos.length - 1; i >= 0; i--) {
        const inimigo = inimigos[i];
        if (jogoAtivo) {
            if (inimigo.y + inimigo.height < limiteSuperior) {
                inimigo.y += inimigo.speed;
            } else {
                inimigo.tempoTiro++;
                if (inimigo.tempoTiro > 120) {
                    tirosInimigo.push({
                        x: inimigo.x,
                        y: inimigo.y + inimigo.height,
                        width: 5,
                        height: 15,
                        speed: 5
                    });
                    inimigo.tempoTiro = 0;
                }
            }
        }
        desenharInimigo(inimigo);
        for (let j = tiros.length - 1; j >= 0; j--) {
            const tiro = tiros[j];
            if (tiro.x > inimigo.x - inimigo.width / 2 &&
                tiro.x < inimigo.x + inimigo.width / 2 &&
                tiro.y < inimigo.y + inimigo.height &&
                tiro.y + tiro.height > inimigo.y) {

                criarExplosao(inimigo.x, inimigo.y, '#FF3C3C');
                inimigos.splice(i, 1);
                tiros.splice(j, 1);
                pontos += 10;
                pontuacaoDiv.textContent = "Pontos: " + pontos;
                break;
            }
        }
    }

    // Lógica dos inimigos azuis (Morte instantânea)
    for (let i = inimigosAzuis.length - 1; i >= 0; i--) {
        const inimigoA = inimigosAzuis[i];
        if (jogoAtivo) {
            inimigoA.y += inimigoA.speed;
            if (inimigoA.y + (inimigoA.height / 2) > player.y) {
                gameOver();
            }
        }
        desenharInimigoAzul(inimigoA);
        for (let j = tiros.length - 1; j >= 0; j--) {
            const tiro = tiros[j];
            if (tiro.x > inimigoA.x - inimigoA.width / 2 &&
                tiro.x < inimigoA.x + inimigoA.width / 2 &&
                tiro.y < inimigoA.y + inimigoA.height / 2 &&
                tiro.y + tiro.height > inimigoA.y - inimigoA.height / 2) {

                criarExplosao(inimigoA.x, inimigoA.y, '#3C3CFF');
                inimigosAzuis.splice(i, 1);
                tiros.splice(j, 1);
                pontos += 15;
                pontuacaoDiv.textContent = "Pontos: " + pontos;
                break;
            }
        }
    }

    // Lógica de colisão do tiro inimigo com o jogador
    for (let i = tirosInimigo.length - 1; i >= 0; i--) {
        const tiroI = tirosInimigo[i];
        if (jogoAtivo) {
            tiroI.y += tiroI.speed;
        }
        desenharTiro(tiroI, "#00FFFF");

        const distX = tiroI.x - player.x;
        const distY = tiroI.y - player.y;
        const distancia = Math.sqrt(distX * distX + distY * distY);

        if (jogoAtivo && distancia < player.radius && !player.invincible) {
            tirosInimigo.splice(i, 1);
            player.lives--;

            if (player.lives <= 0) {
                gameOver();
            } else {
                player.invincible = true;
                criarExplosao(player.x, player.y, '#FFA500');
                setTimeout(() => {
                    player.invincible = false;
                }, 2000);
            }
        } else if (tiroI.y > canvas.height) {
            tirosInimigo.splice(i, 1);
        }
    }

    desenharEAtualizarParticulas();
    desenharContagem();

    if (!jogoAtivo && btnReiniciar.style.display === "block") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FF3C3C";
        ctx.font = "50px 'Press Start 2P'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 5;
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 50);
        cancelAnimationFrame(gameLoopId);
    }
}

// --- INICIALIZAÇÃO E EVENTOS ---

document.addEventListener("keydown", (e) => {
    if (!jogoAtivo) return; 
    if (e.key === "ArrowLeft") leftPressed = true;
    if (e.key === "ArrowRight") rightPressed = true;
    
    if (e.key === " " && !spacePressed && !player.invincible) {
        spacePressed = true;
        tiros.push({
            x: player.x,
            y: player.y - player.radius,
            width: 6,
            height: 20,
            speed: 8
        });
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") leftPressed = false;
    if (e.key === "ArrowRight") rightPressed = false;
    if (e.key === " ") spacePressed = false;
});

btnReiniciar.addEventListener("click", () => {
    inicializar();
});

function iniciarLoopsDeInimigos() {
    inimigoIntervalId = setInterval(() => {
        if (jogoAtivo) criarInimigo();
    }, 1200);

    inimigoAzulIntervalId = setInterval(() => {
        if (jogoAtivo) criarInimigoAzul();
    }, 2500);
}

// ALTERADO: Corrigido o caminho para o arquivo do menu
btnVoltarMenu.addEventListener("click", () => {
    window.location.href = '../menu2.0/menu.html#menu-principal';
});

inicializar();