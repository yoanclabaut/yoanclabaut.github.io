export default class Bricks {
    constructor(id,x, y, l,h, sprite, spriteCassee, ptsDeVieDeBase) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.l = l;
        this.h = h;
        this.sprite = sprite;
        this.spriteCassee = spriteCassee;
        this.ptsDeVieDeBase = ptsDeVieDeBase;
        if(this.ptsDeVieDeBase == 1){
            this.ptsDeVie = 1;
        }
        else if(this.ptsDeVieDeBase > 1){
            this.ptsDeVie = 2;
        }
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if(this.ptsDeVie == 1){
            ctx.drawImage(this.sprite, 0, 0);
        }
        else if(this.ptsDeVieDeBase > 1 && this.ptsDeVie > 1){
            ctx.drawImage(this.sprite, 0, 0);
        }
        else if(this.ptsDeVieDeBase == 1 && this.ptsDeVie > 1){
            ctx.drawImage(this.spriteCassee, 0, 0);
        }
        ctx.restore();
    }
}
