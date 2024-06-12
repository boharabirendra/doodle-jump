import { IPoint } from "./Utils";

interface IPlatform{
    height: number;
    width: number;
    position: IPoint;
    image: string;
    ctx: CanvasRenderingContext2D
    createPlatform: () => void;
}

export class Platform implements IPlatform{
    height: number;
    width: number;
    position: IPoint;
    image: string;
    ctx: CanvasRenderingContext2D;

    constructor(height:number, width: number, position:IPoint, image: string, ctx: CanvasRenderingContext2D){
        this.height = height;
        this.width = width;
        this.position = position;
        this.image = image;
        this.ctx = ctx;
    }

    createPlatform = () => {
        const img = new Image();
        img.src = this.image;
        this.ctx.drawImage(img, this.position.posX, this.position.posY, this.width, this.height);
    };  
}