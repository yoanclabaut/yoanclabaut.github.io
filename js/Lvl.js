import Bricks from "./bricks.js";
import Bonus from "./bonus.js";

export default class Lvl {
    constructor(tabElements = []) {
        this.tabElements = tabElements;
    }
}
function createLvls(assets){
    let tabCouleurs = [assets.briqueBleue, assets.briqueViolette, assets.briqueRouge, assets.briqueVerte, assets.briqueOrange, assets.briqueBleueClaire];
    let tabCouleursCassee = [assets.briqueBleueCassee, assets.briqueVioletteCassee, assets.briqueRougeCassee, assets.briqueVerteCassee, assets.briqueOrangeCassee, assets.briqueBleueClaireCassee];
    let tableauBonus = [new Bonus(assets.tall), new Bonus(assets.small), new Bonus(assets.slow), new Bonus(assets.fast)];
    let tableauBonusa = [new Bonus(assets.tall), new Bonus(assets.slow)];
    
    let compteurX = 70;
    let compteurY = 60;

    let lvl1 = [];
    for(let i = 1; i < 25; i++) { 
        if(compteurX > 900) {
            compteurX = 70;
            compteurY = compteurY + 35;
        }         
        let couleur = Math.floor(Math.random() * tabCouleurs.length);       
        lvl1.push(new Bricks(i, compteurX, compteurY, 96, 30, tabCouleurs[couleur], tabCouleursCassee[couleur],1));     
        compteurX = compteurX + 150
    }
    compteurX = 70;
    compteurY = 60;
    tableauBonusa.forEach(element => {
        lvl1.push(element);
    });


    let lvl2 = [];
    for(let i = 1; i <36; i++) {
        if(compteurX > 900) {
            compteurX = 70;
            compteurY = compteurY + 35;
        }               
        let couleur = Math.floor(Math.random() * tabCouleurs.length);       
        lvl2.push(new Bricks(i, compteurX, compteurY, 96, 30, tabCouleurs[couleur], tabCouleursCassee[couleur],1));     
        compteurX = compteurX + 101
    }
    compteurX = 70;
    compteurY = 60;
    tableauBonusa.forEach(element => {
        lvl2.push(element);
    });


    let lvl3 = [];
    for(let i = 1; i < 25; i++) { 
        if(compteurX > 900) {
            compteurX = 70;
            compteurY = compteurY + 70;
        }         
        let couleur = Math.floor(Math.random() * tabCouleurs.length);       
        lvl3.push(new Bricks(i, compteurX, compteurY, 96, 30, tabCouleurs[couleur], tabCouleursCassee[couleur],2));     
        compteurX = compteurX + 101
    }
    compteurX = 70;
    compteurY = 60;
    tableauBonus.forEach(element => {
        lvl3.push(element);
    });
    let lvl4 = [];
    for(let i = 1; i < 40; i++) { 
        if(compteurX > 900) {
            compteurX = 70;
            compteurY = compteurY + 70;
        }         
        let couleur = Math.floor(Math.random() * tabCouleurs.length);       
        lvl4.push(new Bricks(i, compteurX, compteurY, 96, 30, tabCouleurs[couleur], tabCouleursCassee[couleur],2));     
        compteurX = compteurX + 150
    }
    compteurX = 70;
    compteurY = 60;
    tableauBonus.forEach(element => {
        lvl4.push(element);
    });
    let lvls = [
        new Lvl(lvl1),
        new Lvl(lvl2),
        new Lvl(lvl3),
        new Lvl(lvl4)
    ];
    return lvls
}
export {createLvls};