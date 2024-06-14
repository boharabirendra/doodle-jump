import { Doodler } from "./Doodler";
import { playSound } from "./Utils";



/* Game over */
export function endGame(
  gameOver: boolean,
  ctx: CanvasRenderingContext2D,
  doodler: Doodler
): boolean {
  const gameOverSound = new Audio("/gameOver.mp3");
  if (gameOver) {
    playSound(gameOverSound);

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
    return true;
  }
  return false;
}

