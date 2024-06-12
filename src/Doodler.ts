import { GRAVITY } from "./Constants";
import { DIRECTION, IPoint } from "./Utils";

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
  ctx: CanvasRenderingContext2D;

  insertDoodler: (doodlerImg?: string) => void;
  moveDoodler: (direction: DIRECTION) => void;
}

export class Doodler implements IDoodler {
  width: number;
  height: number;
  position: IPoint;
  image: Image;
  velocity: Velocity;
  ctx: CanvasRenderingContext2D;
  currentDirection: DIRECTION;

  constructor(
    width: number,
    height: number,
    position: IPoint,
    image: Image,
    velocity: Velocity,
    ctx: CanvasRenderingContext2D
  ) {
    this.width = width;
    this.height = height;
    this.position = position;
    this.image = image;
    this.velocity = velocity;
    this.ctx = ctx;
    this.currentDirection = DIRECTION.RIGHT;
  }

  insertDoodler = (doodlerImg?: string) => {
    const img = new Image();
    img.src = doodlerImg || (this.currentDirection === DIRECTION.LEFT ? this.image.doodlerLeft : this.image.doodlerRight);

    /* horizontal velocity */
    this.position.posX += this.velocity.x; 
    if(this.position.posX > this.ctx.canvas.width){
      this.position.posX = 0;
    }else if (this.position.posX + this.width < 0){
      this.position.posX = this.ctx.canvas.width;
    }

    /* vertical velocity */
    this.velocity.y += GRAVITY;
    this.position.posY += this.velocity.y;

    this.ctx.drawImage(img, this.position.posX, this.position.posY, this.width, this.height);
  };

  moveDoodler = (direction: DIRECTION) => {
    this.currentDirection = direction;
    switch (direction) {
      case DIRECTION.UP:
        this.velocity.y = -8;
        break;
      case DIRECTION.DOWN:
        // Implement movement logic if needed
        break;
      case DIRECTION.RIGHT:
        this.velocity.x = 4;
        this.insertDoodler(this.image.doodlerRight);
        break;
      case DIRECTION.LEFT:
        this.velocity.x = -4;
        this.insertDoodler(this.image.doodlerLeft);
        break;
    }
  };
}
