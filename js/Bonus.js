export default class Bonus{
    constructor(sprite) {
        this.x = Math.random() * (850 - 100) + 100;
        this.y = -25;
        this.l = 87;
        this.h = 24;
        this.vy = 3;
        this.sprite = sprite;
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.sprite, 0, 0);
        // et on le restaure à la fin de la fonction       
        ctx.restore();
    }
    play() {
        this.y +=this.vy;
    }
    reset() {
        this.x = Math.random() * (850 - 100) + 100;
        this.y = -25;
        // On met sa vitesse à 0
        this.vy = 0;
    }
}
