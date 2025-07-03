document.addEventListener('DOMContentLoaded', () => {
    // Pegando os elementos da tela
    const telaInicial = document.getElementById('tela-inicial');
    const menuPrincipal = document.getElementById('menu-principal');
    const telaCreditos = document.getElementById('tela-creditos');
    const botaoModoInfinito = document.getElementById('botao-modo-infinito');
    const botaoCreditos = document.getElementById('botao-creditos');

    // Função para mostrar o menu principal e esconder o resto
    function irParaMenuPrincipal() {
        telaInicial.style.display = 'none';
        telaCreditos.style.display = 'none';
        menuPrincipal.style.display = 'flex'; // Usamos flex para centralizar
    }

    // *** LÓGICA PRINCIPAL AQUI ***
    // Verifica se a URL contém a âncora '#menu-principal'
    if (window.location.hash === '#menu-principal') {
        // Se sim, vai direto para o menu principal
        irParaMenuPrincipal();
    } else {
        // Se não, executa a lógica original de esperar uma tecla
        window.addEventListener('keydown', irParaMenuPrincipal, { once: true });
    }

    // Adicionando funcionalidade aos botões do menu
    botaoModoInfinito.addEventListener('click', () => {
        // Verifique se o caminho para a pasta do jogo está correto!
        // Este caminho supõe que a pasta do seu menu (menu2.0) e a pasta do jogo
        // estão no mesmo nível.
        window.location.href = '../Jogo/modoInfinito.html';
    });

    botaoCreditos.addEventListener('click', () => {
        menuPrincipal.style.display = 'none';
        telaCreditos.style.display = 'block';

        // Lógica para voltar dos créditos para o menu com qualquer tecla
        window.addEventListener('keydown', irParaMenuPrincipal, { once: true });
    });

    // Adicione aqui a lógica para os outros botões, se necessário
    // Ex: document.getElementById('botao-iniciar')...

});