// ps4-controller.js

// Função para verificar o estado do controle do PS4
function checkGamepad() {
  // Verificar se há gamepads conectados
  const gamepads = navigator.getGamepads();

  // Iterar sobre os gamepads
  for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      
      // Verificar se o gamepad é válido e se é um controle do PS4
      if (gamepad && gamepad.id === 'Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)') {
          // Log para indicar que o controle do PS4 foi detectado
          console.log('Controle do PS4 detectado!');
          
          // Ler os inputs do controle do PS4
          const xAxis = gamepad.axes[0];
          const yAxis = gamepad.axes[1];
          const buttonUp = gamepad.buttons[12].pressed;
          const buttonDown = gamepad.buttons[13].pressed;
          const buttonLeft = gamepad.buttons[14].pressed;
          const buttonRight = gamepad.buttons[15].pressed;

          // Atualizar a posição do jogador com base nos inputs do controle
          if (xAxis > 0.5) {
              player.x += player.speed;
          } else if (xAxis < -0.5) {
              player.x -= player.speed;
          }
          if (yAxis > 0.5) {
              player.y += player.speed;
          } else if (yAxis < -0.5) {
              player.y -= player.speed;
          }

          // Atualizar a posição do jogador com base nos botões direcionais
          if (buttonUp) {
              player.y -= player.speed;
          } else if (buttonDown) {
              player.y += player.speed;
          }
          if (buttonLeft) {
              player.x -= player.speed;
          } else if (buttonRight) {
              player.x += player.speed;
          }
      }
  }

  // Agendar a próxima verificação do estado do controle
  requestAnimationFrame(checkGamepad);
}

// Iniciar a verificação do estado do controle
window.addEventListener("gamepadconnected", () => {
  checkGamepad();
});
