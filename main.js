const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height / 2 - 25,
    width: 200,
    height: 200,
    imageIndex: 0,
    speed: 100,
    facingLeft: false
};
player.images = [
    'cowFrames/frame_1.png',
    'cowFrames/frame_2.png',
    'cowFrames/frame_3.png',
    'cowFrames/frame_4.png',
    'cowFrames/frame_5.png',
    'cowFrames/frame_6.png',
    'cowFrames/frame_7.png',
    'cowFrames/frame_8.png',
    'cowFrames/frame_9.png',
    'cowFrames/frame_10.png',
    'cowFrames/frame_11.png',
    'cowFrames/frame_12.png',
    'cowFrames/frame_13.png',
    'cowFrames/frame_14.png',
    'cowFrames/frame_15.png',
    'cowFrames/frame_16.png',
    'cowFrames/frame_17.png',
    'cowFrames/frame_18.png',
    'cowFrames/frame_19.png',
    'cowFrames/frame_20.png',
    'cowFrames/frame_21.png',
    'cowFrames/frame_22.png',
    'cowFrames/frame_23.png',
];

function rotateImage() {
    setInterval(() => {
        player.imageIndex = (player.imageIndex + 1) % player.images.length;
        player.image.src = player.images[player.imageIndex];
    }, 20); // 2000 milissegundos = 2 segundos
}
player.image = new Image();
player.image.src = player.images[player.imageIndex];
rotateImage();

const moveSound = document.getElementById('moveSound');
const mooSound = new Audio('assets/moo.mp3');

let objects = [];
let phase = 1;
let objectsToCollect = 5;
let score = 0;
let bossActive = false;
let bossTimer = 0;
let timeLeft = 100;
let progressBarStarted = false;

function drawPlayer() {
    if (player.facingLeft) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(player.image, -player.x - player.width, player.y, player.width, player.height);
        ctx.restore();
    } else {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    }
}

function drawObjects() {
    objects.forEach(object => {
        ctx.save();
        const centerX = object.x + object.width / 2;
        const centerY = object.y + object.height / 2;
        ctx.translate(centerX, centerY);
        const bounceHeight = 5;
        const bounceSpeed = 1000;
        const bounceOffset = Math.sin(Date.now() * bounceSpeed) * bounceHeight;
        ctx.translate(0, bounceOffset);
        ctx.rotate((Math.PI / 180) * 1);
        const image = new Image();
        image.src = 'assets/coin.png';
        ctx.drawImage(image, -object.width / 2, -object.height / 2, object.width, object.height);
        ctx.restore();
    });
}

function createObject() {
    const object = {
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height - 50),
        width: 60,
        height: 60,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 4 - 2,
        bounce: 0.8
    };
    objects.push(object);
}

function createBoss() {
    const boss = {
        x: canvas.width / 2 - 200,
        y: canvas.height / 2 - 200,
        width: 400,
        height: 400,
        image: new Image()
    };

    boss.image.onload = function() {
        ctx.drawImage(boss.image, boss.x, boss.y, boss.width, boss.height);
    };

    boss.image.src = 'assets/chief1.png';
    objects.push(boss);
    bossActive = true;
}

function startProgressBar() {
    progressBarStarted = true;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawObjects();

    if (!progressBarStarted && (player.x !== canvas.width / 2 - 25 || player.y !== canvas.height / 2 - 25)) {
        startProgressBar();
    }

    objects.forEach((object, index) => {
        if (
            player.x < object.x + object.width &&
            player.x + player.width > object.x &&
            player.y < object.y + object.height &&
            player.y + player.height > object.y
        ) {
            objects.splice(index, 1);
            score++;

            if (objects.length === 0) {
                phase++;
                objectsToCollect += 5;

                objects = [];
                for (let i = 0; i < objectsToCollect; i++) {
                    createObject();
                }

                if (phase === 10) {
                    createBoss();
                }

                timeLeft = 100;
            }
        }
    });

    if (bossActive) {
        bossTimer++;
        if (bossTimer === 30 * 60) {
            bossTimer = 0;
            objects.pop();
            bossActive = false;
        }
    }

    if (progressBarStarted) {
        timeLeft -= 0.1;
        document.getElementById('progressBar').value = timeLeft;
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(10, 10, 180, 100);
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Pontuação: ' + score, 20, 40);
    ctx.fillText('Fase: ' + phase, 20, 80);

    // Verificar se o tempo acabou e o jogador não coletou todas as moedas
    if (timeLeft <= 0 && score < objectsToCollect) {
        window.location.reload();
    }
}

import movePlayer from './movePlayer.js';
movePlayer(player, canvas, moveSound, mooSound);

function playBackgroundMusic() {
    // Por exemplo:
    const backgroundMusic = new Audio('assets/background.mp3');
    backgroundMusic.loop = true; // Para repetir a música
    backgroundMusic.play();
}

document.addEventListener('keydown', function() {
    if (!progressBarStarted) {
        startProgressBar();
        playBackgroundMusic();
    }
    movePlayer(event);
});

setInterval(() => {
    moveSound.currentTime = 0;
    moveSound.play();
}, 20000);

for (let i = 0; i < objectsToCollect; i++) {
    createObject();
}

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
