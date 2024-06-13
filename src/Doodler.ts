import { DIMENSION, GRAVITY, INITIAL_VELOCITY_Y } from "./Constants";
import { DIRECTION, IPoint } from "./Utils";

export let gameOver = false;
let maxScore = 0;

type Velocity = {
  x: number;
  y: number;
};

type Image = {
  doodlerLeft: string;
  doodlerRight: string;
};

interface IDoodler {
  width: number;
  height: number;
  position: IPoint;
  image: Image;
  velocity: Velocity;
  score: number;
  ctx: CanvasRenderingContext2D;
  gameStart : boolean;

  insertDoodler: (doodlerImg?: string) => void;
  moveDoodler: (direction: DIRECTION) => void;
  updateScore: () => void;
  reset : () => void;
}

export class Doodler implements IDoodler {
  width: number;
  height: number;
  position: IPoint;
  image: Image;
  velocity: Velocity;
  ctx: CanvasRenderingContext2D;
  currentDirection: DIRECTION;
  score: number;
  gameStart: boolean;
  constructor(
    width: number,
    height: number,
    position: IPoint,
    image: Image,
    velocity: Velocity,
    ctx: CanvasRenderingContext2D,
    gameStart: boolean
  ) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.image = image;
    this.velocity = velocity;
    this.ctx = ctx;
    this.score = 0;
    this.gameStart = gameStart;
    this.currentDirection = DIRECTION.RIGHT;

  }


  insertDoodler = (doodlerImg?: string) => {
    const img = new Image();
    img.src =
      doodlerImg ||
      (this.currentDirection === DIRECTION.LEFT
        ? this.image.doodlerLeft
        : this.image.doodlerRight);

    /* horizontal velocity */
    this.position.posX += this.velocity.x;
    if (this.position.posX > this.ctx.canvas.width) {
      this.position.posX = 0;
    } else if (this.position.posX + this.width < 0) {
      this.position.posX = this.ctx.canvas.width;
    }

    /* vertical velocity */
    if(this.gameStart){
      this.velocity.y += GRAVITY;
    }
    this.position.posY += this.velocity.y;

    if (this.position.posY > this.ctx.canvas.height) {
      gameOver = true;
    }


    this.ctx.drawImage(
      img,
      this.position.posX,
      this.position.posY,
      this.width,
      this.height
    );
  };

  moveDoodler = (direction: DIRECTION) => {
    this.currentDirection = direction;
    switch (direction) {
      case DIRECTION.UP:
        // this.velocity.y = INITIAL_VELOCITY_Y;
        break;
      case DIRECTION.DOWN:
        break;
      case DIRECTION.RIGHT:
        this.velocity.x = 3;
        this.insertDoodler(this.image.doodlerRight);
        break;
      case DIRECTION.LEFT:
        this.velocity.x = -3;
        this.insertDoodler(this.image.doodlerLeft);
        break;
    }
  };

  updateScore = () => {
    const points = Math.floor(50 * Math.random());
    if (this.velocity.y < 0) {
      maxScore += points;
      if (this.score < maxScore) {
        this.score = maxScore;
      }
    } else if (this.velocity.y > 0) {
      maxScore -= points;
    }
  };

  reset =  () => {
    this.currentDirection = DIRECTION.RIGHT;
    this.position.posX = this.ctx.canvas.width / 2 - DIMENSION.DOODLER_WIDTH / 2;
    this.position.posY = (this.ctx.canvas.height * 7) / 8 - DIMENSION.DOODLER_HEIGHT;
    this.width = DIMENSION.DOODLER_WIDTH;
    this.height = DIMENSION.DOODLER_HEIGHT;
    this.velocity.x = 0;
    this.velocity.y = INITIAL_VELOCITY_Y;
    this.gameStart = true;
    this.score = 0;
    maxScore = 0;
    gameOver = false;
  };
}
