export default class Ball{
    constructor(x, y, r, sprite) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.r = r;
        this.vy = 0;
        this.vx = 0;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        let pattern = ctx.createPattern(this.sprite, 'repeat');
        ctx.fillStyle = pattern;
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, 2*Math.PI);
        ctx.fill();    
        
        //On ajoute un conntour noir
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }
    
    move() {
        this.x += this.vx;
        this.y +=this.vy;
    }
    testeCollisionAvecBordsDuCanvas(largeurCanvas, hauteurCanvas) {
        if (this.x + this.r > largeurCanvas) {
            this.x = largeurCanvas - this.r;
            this.vx = -this.vx;
        }
        if (this.x - this.r < 0) {
            this.x = this.r;
            this.vx = -this.vx;
        }
        if (this.y + this.r > hauteurCanvas) {          
            return 'gameOver';
            //this.y = hauteurCanvas - this.r;
            //this.vy = -this.vy;
        }
        if (this.y - this.r < 0) {        
            this.y = this.r;
            this.vy = -this.vy;
        }
    }
}
