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

let highestScore: number = 0;

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

  /* adding new platform */
  for (let i = 0; i < platformArray.length; i++) {
    const platform = platformArray[i];
    if (doodler.velocity.y < 0 && doodler.velocity.y < (canvas.width * 3) / 4) {
      platform.position.posY -= INITIAL_VELOCITY_Y;
    }
    if (detectCollision(doodler, platform) && doodler.velocity.y > 0) {
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



  /* Updating score and highest score*/
  doodler.updateScore();
  scoreEl.innerHTML = `Score: ${doodler.score}`;
  if (doodler.score > highestScore) {
    highestScore = doodler.score;
    localStorage.setItem("highestScore", highestScore.toString());
    highestScoreEl.innerHTML = `Highest Score: ${highestScore}`;
  }

  /*Game over information */
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const boxWidth = 300;
    const boxHeight = 140;
    const boxX = (ctx.canvas.width - boxWidth) / 2;
    const boxY = (ctx.canvas.height - boxHeight) / 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    ctx.font = '20px "Gloria Hallelujah", sans-serif';
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("Game Over", ctx.canvas.width / 2, boxY + 30);
    ctx.fillText(`Score: ${doodler.score}`, ctx.canvas.width / 2, boxY + 70);
    ctx.fillText("Press 'R' to Restart", ctx.canvas.width / 2, boxY + 110);
    return;
  }

  if (!doodler.gameStart) {
    ctx.fillStyle = "black";
    ctx.font = '24px "Gloria Hallelujah", sans-serif';
    ctx.fillText("Press 'space' to start game", 15, ctx.canvas.height - 10);
  }

  if(doodler.position.posY < canvas.height / 2){
    doodler.position.posY = canvas.height / 2;
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
      // if (doodler.gameStart) {
      //   doodler.moveDoodler(DIRECTION.UP);
      // }
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
    draw();
  }

  if (e.code === "Space") {
    doodler.velocity.y = INITIAL_VELOCITY_Y;
    doodler.gameStart = true;
  }
});
