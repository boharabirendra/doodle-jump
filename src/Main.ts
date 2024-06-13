import {
  DIMENSION,
  DOODLER_IMAGE,
  INITIAL_VELOCITY_Y,
  NUMBER_OF_PLATFORM,
  PLATFORM_IMAGE,
} from "./Constants";
import { Doodler, gameOver } from "./Doodler";
import { Platform } from "./Platform";
import { DIRECTION } from "./Utils";


const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

canvas.width = DIMENSION.CANVAS_WIDTH;
canvas.height = DIMENSION.CANVAS_HEIGHT;

/*    Doodler section  */
const doodler = new Doodler(
  DIMENSION.DOODLER_WIDTH,
  DIMENSION.DOODLER_HEIGHT,
  {
    posX: canvas.width / 2 - DIMENSION.DOODLER_WIDTH / 2,
    posY: (canvas.height * 7) / 8 - DIMENSION.DOODLER_HEIGHT,
  },
  {
    doodlerLeft: DOODLER_IMAGE.DOODLER_IMAGE_FACE_LEFT,
    doodlerRight: DOODLER_IMAGE.DOODLER_IMAGE_FACE_RIGHT,
  },
  {
    x: 0,
    y: 0,
  },
  ctx
);

/* Platform section */
const platformArray: Platform[] = [];
function placePlatform() {
  const platform = new Platform(
    DIMENSION.PLATFORM_HEIGHT,
    DIMENSION.PLATFORM_WIDTH,
    {
      posX: canvas.width / 2,
      posY: canvas.height - 50,
    },
    PLATFORM_IMAGE,
    ctx
  );
  platformArray.push(platform);

  for (let i = 0; i < NUMBER_OF_PLATFORM; i++) {
    const randomX = Math.floor((Math.random() * canvas.width * 3) / 4);
    const platform1 = new Platform(
      DIMENSION.PLATFORM_HEIGHT,
      DIMENSION.PLATFORM_WIDTH,
      {
        posX: randomX,
        posY: canvas.height - 75 * i - 150,
      },
      PLATFORM_IMAGE,
      ctx
    );
    platformArray.push(platform1);
  }
}

placePlatform();

function newPlatform() {
  const randomX = Math.floor((Math.random() * canvas.width * 3) / 4);
  const platform1 = new Platform(
    DIMENSION.PLATFORM_HEIGHT,
    DIMENSION.PLATFORM_WIDTH,
    {
      posX: randomX,
      posY: -DIMENSION.PLATFORM_HEIGHT,
    },
    PLATFORM_IMAGE,
    ctx
  );
  platformArray.push(platform1);
}

/*   */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  doodler.insertDoodler();

  /* Creating new platform */
  for (let i = 0; i < platformArray.length; i++) {
    const platform = platformArray[i];
    if (doodler.velocity.y < 0 && doodler.velocity.y < (canvas.width * 3) / 4) {
      platform.position.posY -= INITIAL_VELOCITY_Y;
    }
    if (detectCollision(doodler, platform) && doodler.velocity.y >= 0) {
      doodler.velocity.y = INITIAL_VELOCITY_Y;
    }
    platform.createPlatform();
  }

  while (
    platformArray.length > 0 &&
    platformArray[0].position.posY >= canvas.height
  ) {
    platformArray.shift();
    newPlatform();
  }

  /* Updating score */
  doodler.updateScore();
  ctx.fillStyle = "black";
  ctx.font = " 20px sans-serif";
  ctx.fillText(`Score: ${doodler.score}`, 5, 20);

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.fillText(
      "Game Over: Press 'R' to Restart",
      20,
      (ctx.canvas.height * 7) / 8
    );
    return;
  }
  window.requestAnimationFrame(draw);
}
draw();

/*  Collision detection  */
function detectCollision(doodler: Doodler, platform: Platform): boolean {
  return (
    doodler.position.posX < platform.position.posX + platform.width &&
    doodler.position.posX + doodler.width > platform.position.posX &&
    doodler.position.posY < platform.position.posY + platform.height &&
    doodler.position.posY + doodler.height > platform.position.posY
  );
}

/* Event listener section */
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      doodler.moveDoodler(DIRECTION.UP);
      break;
    case "ArrowDown":
      doodler.moveDoodler(DIRECTION.DOWN);
      break;
    case "ArrowRight":
      doodler.moveDoodler(DIRECTION.RIGHT);
      break;
    case "ArrowLeft":
      doodler.moveDoodler(DIRECTION.LEFT);
      break;
  }

  if (e.key.toLowerCase() === "r" && gameOver) {
    doodler.reset();
    draw();
  }
});
