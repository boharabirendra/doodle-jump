import { DIMENSION, DOODLER_IMAGE, PLATFORM_IMAGE } from "./Constants";
import { Doodler } from "./Doodler";
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
  ctx,
);



/* Platform section */
const platformArray: Platform[] = [];

const platform = new Platform(
    DIMENSION.PLATFORM_HEIGHT,
    DIMENSION.PLATFORM_WIDTH,
    {
      posX: canvas.width / 2,
      posY: canvas.height - 50
    },
    PLATFORM_IMAGE,
    ctx,
);

platformArray.push(platform);

const platform1 = new Platform(
    DIMENSION.PLATFORM_HEIGHT,
    DIMENSION.PLATFORM_WIDTH,
    {
      posX: canvas.width / 2,
      posY: canvas.height - 150
    },
    PLATFORM_IMAGE,
    ctx,
);

platformArray.push(platform1);




function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  doodler.insertDoodler();
  for(let i = 0; i < platformArray.length; i++){
    platformArray[i].createPlatform();
  }
  window.requestAnimationFrame(draw);
}

draw();



function detectCollision(doodler:Doodler, platform:Platform): boolean {
  return doodler.position.posX < platform.position.posX + platform.width &&   
         doodler.position.posX + doodler.width > platform.position.posX &&  
         doodler.position.posY < platform.position.posY + platform.height &&  
         doodler.position.posY + doodler.height > platform.position.posY;   
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
});
