const createHelpModal = () => {
    const helpModal = document.createElement('div');
    helpModal.id = 'helpModal';
    helpModal.style.display = 'none'; // Inicialmente oculto
    helpModal.style.position = 'fixed';
    helpModal.style.top = '0';
    helpModal.style.left = '0';
    helpModal.style.width = '100%';
    helpModal.style.height = '100%';
    helpModal.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    helpModal.style.zIndex = '9999';
    helpModal.style.color = '#000';
    helpModal.style.fontSize = '24px';
    helpModal.style.textAlign = 'center';
    helpModal.innerHTML = `
            <h2>Como Jogar</h2>
            <p>Use as setas do teclado para mover o jogador.</p>
            <p>Objetivo: coletar todas as moedas para avançar para a próxima fase.</p>
            <p>Na fase 10 você encontrará uma surpresa, cuide-se para chegar até lá</p>
            <p>Controles:</p>
            <p>
                Seta para cima: Mover para cima<br/>
                Seta para baixo: Mover para baixo<br/>
                Seta para esquerda: Mover para a esquerda<br/>
                Seta para direita: Mover para a direita<br/>
                Tecla (m) : Tocar som<br/>
                Tecla (r) : Recarregar o jogo<br/>
                Tecla (c) : Mostrar/Esconder créditos<br/>
                Tecla (h) : Mostrar painel de ajuda<br/>
                Tecla (s) : Ativa e desativo o som <br/>
            </p>
            <p>Um agradecimento aos meus queridos: Livia Prates Jaccon e Alexandre Jaccon </p>
    `;
    document.body.appendChild(helpModal);
};

// Chama a função para criar a modal de ajuda antes de usá-la
createHelpModal();

// Função para exibir ou ocultar a modal de ajuda
const toggleHelpModal = () => {
    const helpModal = document.getElementById('helpModal');

    if (helpModal.style.display === 'none' || !helpModal.style.display) {
        helpModal.style.display = 'block';
    } else {
        helpModal.style.display = 'none';
    }
};

const movePlayer = (player, canvas, moveSound, mooSound, toggleModal) => {
    const movePlayer = (e) => {
        switch (e.key) {
            case 'ArrowUp':
                player.y -= player.speed;
                break;
            case 'ArrowDown':
                player.y += player.speed;
                break;
            case 'ArrowLeft':
                player.x -= player.speed;
                player.facingLeft = true;
                break;
            case 'ArrowRight':
                player.x += player.speed;
                player.facingLeft = false;
                break;
            case 'm':
                mooSound.play();
                break;
            case 'r':
                window.location.reload();
                break;
            case 'c':
            case 'C':
                toggleModal();
                break;
            case 'h':
            case 'H':
                toggleHelpModal();
                break;
        }

        if (player.x < 0) {
            player.x = 0;
        } else if (player.x + player.width > canvas.width) {
            player.x = canvas.width - player.width;
        }
        if (player.y < 0) {
            player.y = 0;
        } else if (player.y + player.height > canvas.height) {
            player.y = canvas.height - player.height;
        }

        moveSound.currentTime = 0;
        moveSound.play();
    };

    document.addEventListener('keydown', movePlayer);

    setInterval(() => {
        moveSound.currentTime = 0;
        moveSound.play();
    }, 20000);
};

export default movePlayer;
