export function animatePlayerMovement(key, player, canvas, ctx) {
    switch (key) {
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
}
