export default class Racket {
    constructor(x, y, l, h, sprite, vx) {
        this.x = x;
        this.y = y;
        this.l = l;
        this.h = h;
        this.sprite = sprite;
        this.vx = vx;
    }   
    draw(ctx) {
        // Bonne pratique, quand on change la couleur, la position du repère, etc.        // les ombres, par exemple, on sauvegarde le contexte avant de le modifier        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.sprite, 0, 0);
        // et on le restaure à la fin de la fonction       
        ctx.restore();
    }
    move() {
        this.x += this.vx;
    }
    testeCollisionAvecBordsDuCanvas(largeurCanvas) {
        if (this.x + this.l > largeurCanvas) {
            // On positionne le joueur à la limite du canvas, au point de contact            
            this.x = largeurCanvas - this.l;
            this.vx = -this.vx;
        }
        if (this.x < 0) {
            // On positionne le joueur à la limite du canvas, au point de contact            
            this.x = 0;
            this.vx = -this.vx;
        }
    }
}