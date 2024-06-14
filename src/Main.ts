import {
  CANVAS_MID_X,
  DIMENSION,
  DOODLER_IMAGE,
  INITIAL_VELOCITY_Y,
  MAX_JUMP,
  NUMBER_OF_PLATFORM,
  PLATFORM_IMAGE,
  PLAY_BUTTON_POSITION_X,
  PLAY_BUTTON_POSITION_Y,
  START_IMAGE,
} from "./Constants";
import { Doodler, gameOver } from "./Doodler";
import { endGame } from "./GameOver";
import { Platform } from "./Platform";
import { DIRECTION, playSound } from "./Utils";

let highestScore: number = 0;

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const jumpSound = new Audio("/jumpCollide.mp3");

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
  ctx,
  false
);

/* score element */
const scoreEl = document.createElement("p");
scoreEl.style.padding = "6px 22px";
scoreEl.style.borderRadius = "10px";
scoreEl.style.border = "1px solid #020817";
scoreEl.style.font = "16px";
scoreEl.style.position = "absolute";
scoreEl.style.top = "25px";
scoreEl.style.margin = "0px";
scoreEl.style.backgroundColor = "#bbb";
scoreEl.style.left = "20%";
scoreEl.innerHTML = `Score: ${doodler.score}`;
document.body.appendChild(scoreEl);

/* highest score element */
if (localStorage.getItem("highestScore")) {
  highestScore = Number(localStorage.getItem("highestScore"));
} else {
  localStorage.setItem("highestScore", highestScore.toString());
}
const highestScoreEl = document.createElement("p");
highestScoreEl.style.padding = "6px 22px";
highestScoreEl.style.borderRadius = "10px";
highestScoreEl.style.border = "1px solid #020817";
highestScoreEl.style.font = "16px";
highestScoreEl.style.position = "absolute";
highestScoreEl.style.top = "80px";
highestScoreEl.style.margin = "0px";
highestScoreEl.style.backgroundColor = "#aaa";
highestScoreEl.style.left = "20%";
highestScoreEl.innerHTML = `Highest Score: ${highestScore}`;
document.body.appendChild(highestScoreEl);

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
    let randomX = Math.floor((Math.random() * canvas.width * 3) / 4);
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

/* Game start  */
function startGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  doodler.insertDoodler();

  /* adding new platform */
  for (let i = 0; i < platformArray.length; i++) {
    const platform = platformArray[i];
    if (
      doodler.velocity.y < 0 &&
      doodler.position.posY < (canvas.width * 3) / 4
    ) {
      platform.position.posY -= doodler.velocity.y;
    }
    if (detectCollision(doodler, platform) && doodler.velocity.y > 0) {
      doodler.velocity.y = INITIAL_VELOCITY_Y;
      playSound(jumpSound);
    }
    platform.createPlatform();
  }

  while (
    platformArray.length > 0 &&
    platformArray[0].position.posY >= canvas.height
  ) {
    platformArray.shift();
    doodler.score += 10;
    newPlatform();
  }

  /* Updating score and highest score*/
  scoreEl.innerHTML = `Score: ${doodler.score}`;
  if (doodler.score > highestScore) {
    highestScore = doodler.score;
    localStorage.setItem("highestScore", highestScore.toString());
    highestScoreEl.innerHTML = `Highest Score: ${highestScore}`;
  }

  /*Game over section */
  if (endGame(gameOver, ctx, doodler)) {
    return;
  }

  if (doodler.position.posY < MAX_JUMP) {
    doodler.position.posY = MAX_JUMP;
  }

  window.requestAnimationFrame(startGame);
}

/*Start screen section    */
function startScreen() {
  const startImage = new Image();
  startImage.src = START_IMAGE;
  if (startImage.complete) {
    ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
  } else {
    startImage.onload = () => {
      ctx.drawImage(startImage, 0, 0, canvas.width, canvas.height);
    };
  }
}
startScreen();

/*  Collision detection  */
function detectCollision(doodler: Doodler, platform: Platform): boolean {
  return (
    doodler.position.posX < platform.position.posX + platform.width &&
    doodler.position.posX + doodler.width > platform.position.posX &&
    doodler.position.posY < platform.position.posY + platform.height &&
    doodler.position.posY + doodler.height > platform.position.posY
  );
}

/*Keyboard Event listener section */
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      break;
    case "ArrowDown":
      doodler.moveDoodler(DIRECTION.DOWN);
      break;
    case "ArrowRight":
      if (doodler.gameStart) {
        doodler.moveDoodler(DIRECTION.RIGHT);
      }
      break;
    case "ArrowLeft":
      if (doodler.gameStart) {
        doodler.moveDoodler(DIRECTION.LEFT);
      }
      break;
  }

  if (e.key.toLowerCase() === "r" && gameOver) {
    doodler.reset();
    startGame();
  }
});

/* Mouse move event listener */
canvas.addEventListener("mousemove", function (event) {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  if (
    mouseX >= PLAY_BUTTON_POSITION_X &&
    mouseX <= PLAY_BUTTON_POSITION_X + DIMENSION.PLAY_BUTTON_WIDTH &&
    mouseY >= PLAY_BUTTON_POSITION_Y &&
    mouseY <= PLAY_BUTTON_POSITION_Y + DIMENSION.PLAY_BUTTON_HEIGHT
  ) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "default";
  }
});

/* Mouse click listener */
canvas.addEventListener("click", function initialClickHandler(event) {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  if (
    mouseX >= PLAY_BUTTON_POSITION_X &&
    mouseX <= PLAY_BUTTON_POSITION_X + DIMENSION.PLAY_BUTTON_WIDTH &&
    mouseY >= PLAY_BUTTON_POSITION_Y &&
    mouseY <= PLAY_BUTTON_POSITION_Y + DIMENSION.PLAY_BUTTON_HEIGHT
  ) {
    doodler.gameStart = true;
    startGame();
    canvas.removeEventListener("click", initialClickHandler);
    canvas.addEventListener("click", gameControllerClickHandler);
  }
});

/* Mobile device finger touch detection */
function gameControllerClickHandler(event: MouseEvent) {
  if (!doodler.gameStart) return;
  const clickedX = event.clientX;
  if (clickedX < CANVAS_MID_X) {
    doodler.moveDoodler(DIRECTION.LEFT);
  } else if (clickedX > CANVAS_MID_X) {
    doodler.moveDoodler(DIRECTION.RIGHT);
  }
}
