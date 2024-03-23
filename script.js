const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const modal = document.createElement('div');
modal.id = 'modal';
modal.style.display = 'none';
modal.style.position = 'fixed';
modal.style.top = '0';
modal.style.left = '0';
modal.style.width = '100%';
modal.style.height = '100%';
modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
modal.style.zIndex = '9999';
modal.style.color = '#fff';
modal.style.fontSize = '24px';
modal.style.textAlign = 'center';
modal.style.paddingTop = '50vh';
modal.textContent = 'Créditos: Alexandre Jaccon Gomes e Livia Prates Jaccon';
document.body.appendChild(modal);

function toggleModal() {
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height / 2 - 25,
    width: 200,
    height: 200,
    image: new Image(),
    speed: 100,
    facingLeft: false
};

player.image.onload = function() {
    drawPlayer();
};
player.image.src = 'assets/character.png';

const moveSound = document.getElementById('moveSound');
const coinSound = new Audio('assets/coin.wav');
const mooSound = new Audio('assets/moo.mp3');

let objects = [];
let phase = 1;
let objectsToCollect = 5;
let score = 0;
let bossActive = false;
let bossTimer = 0;
let timeLeft = 100;

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

      // Aplicando efeito de bounce com transformação CSS
      const bounceHeight =5; // Altura do bounce
      const bounceSpeed = 1000; // Velocidade do bounce
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
      speedX: Math.random() * 4 - 2, // Velocidade horizontal aleatória
      speedY: Math.random() * 4 - 2, // Velocidade vertical aleatória
      bounce: 0.8 // Coeficiente de restituição para o efeito de bounce
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

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObjects();

  objects.forEach((object, index) => {
      if (
          player.x < object.x + object.width &&
          player.x + player.width > object.x &&
          player.y < object.y + object.height &&
          player.y + player.height > object.y
      ) {
          objects.splice(index, 1);
          score++;
          coinSound.play();

          if (objects.length === 0) {
              phase++;
              objectsToCollect += 5;

              const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
              document.body.style.backgroundColor = randomColor;

              objects = [];
              for (let i = 0; i < objectsToCollect; i++) {
                  createObject();
              }

              if (phase === 10) {
                  createBoss();
              }

              timeLeft = 100; // Resetar a barra de progresso
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

  timeLeft -= 0.1;
  document.getElementById('progressBar').value = timeLeft;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(10, 10, 180, 100);
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText('Pontuação: ' + score, 20, 40);
  ctx.fillText('Fase: ' + phase, 20, 80);
}

function movePlayer(e) {
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

document.addEventListener('keydown', movePlayer);

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
