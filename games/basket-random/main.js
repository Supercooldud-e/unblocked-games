const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWidth = 40, playerHeight = 60;
const ballRadius = 15;

let players = [
  {x: 100, y: 340, vy: 0, color: '#f44', jump: false, score: 0},
  {x: 660, y: 340, vy: 0, color: '#4af', jump: false, score: 0}
];

let ball = {x: 390, y: 300, vx: 4, vy: -6};

const gravity = 0.7;
const ground = 400 - playerHeight;

let hoopL = {x: 10, y: 170};
let hoopR = {x: 750, y: 170};

function resetBall(scoredLeft) {
  ball.x = 390;
  ball.y = 200;
  ball.vx = scoredLeft ? 4 : -4;
  ball.vy = -6;
}

function drawCourt() {
  ctx.fillStyle = "#68ad5a";
  ctx.fillRect(0, 0, 800, 400);
  // Draw hoops
  ctx.fillStyle = "#bbb";
  ctx.fillRect(hoopL.x, hoopL.y, 10, 60);
  ctx.fillRect(hoopR.x, hoopR.y, 10, 60);
  ctx.strokeStyle = "#222";
  ctx.beginPath();
  ctx.arc(hoopL.x + 15, hoopL.y + 30, 15, Math.PI * 1.5, Math.PI * 0.5, true);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(hoopR.x - 5, hoopR.y + 30, 15, Math.PI * 0.5, Math.PI * 1.5, true);
  ctx.stroke();
}

function drawPlayers() {
  for (let i = 0; i < 2; i++) {
    ctx.fillStyle = players[i].color;
    ctx.fillRect(players[i].x, players[i].y, playerWidth, playerHeight);
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#fd7";
  ctx.fill();
  ctx.strokeStyle = "#b73";
  ctx.stroke();
}

function drawScore() {
  ctx.fillStyle = "#222";
  ctx.font = "32px Arial";
  ctx.fillText(players[0].score, 300, 50);
  ctx.fillText(players[1].score, 480, 50);
}

function update() {
  // Move players
  for (let i = 0; i < 2; i++) {
    if (players[i].jump && players[i].y === ground) {
      players[i].vy = -14 - Math.random()*3;
    }
    players[i].y += players[i].vy;
    players[i].vy += gravity;
    if (players[i].y > ground) {
      players[i].y = ground;
      players[i].vy = 0;
    }
  }

  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;
  ball.vy += gravity*0.7;

  // Floor bounce
  if (ball.y > 400 - ballRadius) {
    ball.y = 400 - ballRadius;
    ball.vy *= -0.7;
  }

  // Ball-wall bounce
  if (ball.x < ballRadius) {
    ball.x = ballRadius;
    ball.vx *= -1;
  }
  if (ball.x > 800 - ballRadius) {
    ball.x = 800 - ballRadius;
    ball.vx *= -1;
  }

  // Ball-player collision
  for (let i = 0; i < 2; i++) {
    let px = players[i].x + playerWidth/2, py = players[i].y + playerHeight/2;
    let dx = ball.x - px, dy = ball.y - py;
    let dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < playerWidth/2 + ballRadius) {
      let angle = Math.atan2(dy, dx);
      ball.vx += Math.cos(angle)*3;
      ball.vy += Math.sin(angle)*2;
    }
  }

  // Score check (left hoop)
  if (
    ball.x - ballRadius < hoopL.x + 25 &&
    ball.y > hoopL.y + 5 && ball.y < hoopL.y + 55 &&
    ball.vx < 0
  ) {
    players[1].score++;
    resetBall(false);
  }

  // Score check (right hoop)
  if (
    ball.x + ballRadius > hoopR.x - 5 &&
    ball.y > hoopR.y + 5 && ball.y < hoopR.y + 55 &&
    ball.vx > 0
  ) {
    players[0].score++;
    resetBall(true);
  }
}

function draw() {
  drawCourt();
  drawPlayers();
  drawBall();
  drawScore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();

// Controls
document.addEventListener('keydown', function(e) {
  if (e.code === 'KeyW') players[0].jump = true;
  if (e.code === 'ArrowUp') players[1].jump = true;
});
document.addEventListener('keyup', function(e) {
  if (e.code === 'KeyW') players[0].jump = false;
  if (e.code === 'ArrowUp') players[1].jump = false;
});
