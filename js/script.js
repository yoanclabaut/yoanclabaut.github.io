import Ball from "./ball.js";
import Racket from "./racket.js";
import { createLvls } from "./Lvl.js";
import { loadAssets } from "./assets.js";
import { ajouteEcouteursClavier, inputState } from "./ecouteurs.js";
import Bricks from "./bricks.js";
import Bonus from "./bonus.js";
import { rectsOverlap, circRectsOverlap } from "./collisions.js";

var assetsToLoadURLs = {
    spriteSheet: { url: '../assets/images/spriteSheetCasseBricks.png' },
    briqueBleue: { url: '../assets/images/briqueBleue.png' },
    briqueRouge: { url: '../assets/images/briqueRouge.png' },
    briqueVerte: { url: '../assets/images/briqueVerte.png' },
    briqueBleueClaire: { url: '../assets/images/briqueBleueClaire.png' },
    briqueOrange: { url: '../assets/images/briqueOrange.png' },
    briqueViolette: { url: '../assets/images/briqueViolette.png' },
    briqueBleueCassee: { url: '../assets/images/briqueBleueCassee.png' },
    briqueRougeCassee: { url: '../assets/images/briqueRougeCassee.png' },
    briqueVerteCassee: { url: '../assets/images/briqueVerteCassee.png' },
    briqueBleueClaireCassee: { url: '../assets/images/briqueBleueClaireCassee.png' },
    briqueOrangeCassee: { url: '../assets/images/briqueOrangeCassee.png' },
    briqueVioletteCassee: { url: '../assets/images/briqueVioletteCassee.png' },
    tall: { url: '../assets/images/tall.png' },
    small: { url: '../assets/images/small.png' },
    slow: { url: '../assets/images/slow.png' },
    fast: { url: '../assets/images/fast.png' },
    boule: { url: '../assets/images/ball.png' },
    normale: { url: '../assets/images/normale.png' },
    petite: { url: '../assets/images/petite.png' },
    large: { url: '../assets/images/large.png' },
    bgn: { url: '../assets/images/bgn.png' },
    soundOn: { url: '../assets/images/soundOn.png' },
    soundOff: { url: '../assets/images/soundOff.png' },
    plop: { url: 'https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/plop.mp3', buffer: false, loop: false, volume: 0.3 },
    bonusSound: { url: '../assets/audio/bonusSound.wav', buffer: false, loop: false, volume: 0.8 },
    victory: { url: '../assets/audio/victory.wav', buffer: false, loop: false, volume: 0.3 },
    gameover: { url: '../assets/audio/gameOver.wav', buffer: false, loop: false, volume: 0.3 },
    menuStart: { url: '../assets/audio/menuStart.mp3', buffer: true, loop: true, volume: 0.05 },
    bgnSound: { url: '../assets/audio/bgnSound.wav', buffer: true, loop: true, volume: 0.05 },
};

let gameState = "menuStart";
let racket, ball, tableauBonus = [];
let canvas, ctx;
let lvls;
let currentLvl = 0;
let tableauDesObjetsGraphiques = [];
let assets;
let jeuLance = false;
let compteur;
let bonus = undefined;
let soundState = "on";

window.onload = init;
function init(event) {
    canvas = document.querySelector('#myCanvas');
    //console.log(canvas);
    // pour dessiner, on utilise le contexte 2D
    ctx = canvas.getContext('2d');

    // chargement des assets (musique,  images, sons)    
    loadAssets(assetsToLoadURLs, startGame);
}
function startGame(assetsLoaded) {
    assets = assetsLoaded;
    // appelée quand tous les assets sont chargés    
    console.log("StartGame : tous les assets sont chargés");
    ajouteEcouteursClavier();

    // On va créer un joueur    
    racket = new Racket(458, 650, 85, 24, assets.normale, 10);
    ball = new Ball(500, 635, 15, assets.boule);
    lvls = createLvls(assets);

    if (soundState == "on") {
        assets.menuStart.play();
    }

    requestAnimationFrame(animationLoop);

}
function animationLoop() {
    // On affiche le background   
    ctx.drawImage(assets.bgn, 0, 0, canvas.width, canvas.height);
    switch (gameState) {
        case 'menuStart':
            afficheMenuStart(ctx);
            break;
        case 'menuScore':
            afficheMenuScore(ctx);
            break;
        case 'gameOver':
            topScore(currentLvl);
            afficheGameOver(ctx);
            currentLvl = 0;
            break;
        case 'ecranDebutNiveau':
            afficheEcranDebutNiveau(ctx);
            break;
        case 'jeuEnCours':
            dessinerLesObjetsGraphiques(ctx);
            testeEtatClavierPourRacket();

            if (ball.vy == 0) {
                lancerBalle();
                compteur = 0;
            }
            else {
                ball.move();
                racket.move();
                compteur++;
                playBonus(compteur);
                if (bonus != undefined) {
                    bonus.play();
                }
                if (compteur > 960) {
                    compteur = 0;
                }
            }

            if (ball.testeCollisionAvecBordsDuCanvas(canvas.width, canvas.height) == 'gameOver') {
                gameState = 'gameOver';
                
                for (let i = 0; i < tableauDesObjetsGraphiques.length; i++) {
                    let b = tableauDesObjetsGraphiques[i];
                    if (b instanceof Bonus) {
                        // On reset le bonus
                        b.reset();
                    }
                }
                if (soundState == "on") {
                    assets.bgnSound.stop();
                    assets.gameover.play();
                }
            } else {
                ball.testeCollisionAvecBordsDuCanvas(canvas.width, canvas.height);
            }

            if (jeuLance == false) {
                chargeLvl();
                jeuLance = true;
            }
            
            changeLvl();

            detecteCollisionBricksWithBricks();
            detecteCollisionBallWithRacket();
            racket.testeCollisionAvecBordsDuCanvas(canvas.width);

            if (inputState.e) {
                gameState = 'gamePause';
            }

            break;
        case 'gameLoading':
            if (soundState == "on")
                assets.bgnSound.stop();
            afficheGameLoading(ctx);
            break;
        case 'gameVictory':
            topScore(currentLvl);
            afficheGameVictory(ctx);
            currentLvl = 0;
            break;
        case 'gameOptions':
            afficheGameOptions(ctx);
            break;
        case 'gamePause':
            if (soundState == "on") {
                assets.bgnSound.stop();
            }
            afficheGamePause(ctx);
            break;
    }

    // 4 - On rappelle la fonction d'animation
    requestAnimationFrame(animationLoop);
}
function testeEtatClavierPourRacket() {
    racket.vx = 0;
    if (inputState.left) {
        racket.vx = -10;
    } else {
        if (inputState.right)
            racket.vx = 10;
    }
}
function lancerBalle() {
    if (inputState.space) {
        ball.vx = 6;
        ball.vy = -6;
    }
}
function afficheEcranDebutNiveau(ctx) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "40px Arial";
    ctx.fillText("Bienvenue au niveau " + niveau, 190, 100);
    ctx.restore();
}

function afficheMenuStart(ctx) {
    ctx.fillStyle = 'black';
    ctx.font = "40px Arial";
    ctx.fillText("Hello, you are in the BEST bricks breaker EVER", 70, 200);
    ctx.strokeText("Hello, you are in the BEST bricks breaker EVER", 70, 200);
    ctx.fillText("(S)tart", 100, 500);
    ctx.strokeText("(S)tart", 100, 500);
    ctx.fillText("(O)ptions", 400, 500);
    ctx.strokeText("(O)ptions", 400, 500);
    ctx.fillText("(T)op score", 700, 500);
    ctx.strokeText("(T)op score", 700, 500);
    if(soundState == "off"){
        assets.menuStart.stop();
    }
    if (inputState.s) {
        gameState = 'jeuEnCours';
        if (soundState == "on") {
            assets.bgnSound.play();
            assets.menuStart.stop();
        }
    }
    if (inputState.o) {
        gameState = 'gameOptions';
    }
    if(inputState.t) {
        gameState = 'menuScore';
    }
}
function afficheMenuScore(ctx) {
    ctx.fillStyle = 'black';
    ctx.font = "40px Arial";
    ctx.fillText("Top score", 70, 200);
    ctx.strokeText("Top score", 70, 200);
    ctx.fillText("Press 'M' to go to start menu", 280, 500);
    ctx.strokeText("Press 'M' to go to start menu", 280, 500);
    if(localStorage.getItem('topUn')) {
        ctx.fillText("Level: " + localStorage.getItem('topUn'), 250, 350);
        ctx.strokeText("Level: " + localStorage.getItem('topUn'), 250, 350);
    }else {
        ctx.fillText("He don't have a score saved", 250, 350);
        ctx.strokeText("He don't hava a score saved", 250, 350);
    }

    if (inputState.m) {
        gameState = 'menuStart';
        if (soundState == "on")
        assets.menuStart.play();
    }
}
function afficheGameOver(ctx) {
    ctx.save();
    ctx.fillStyle = 'red';
    ctx.font = "50px Arial";
    ctx.fillText("GAME OVER!!!", 320, 300);
    ctx.strokeText("GAME OVER!!!", 320, 300);
    ctx.fillStyle = 'black';
    ctx.font = "20px Arial";
    ctx.fillText("Press 'M' to go to start menu", 150, 500);
    ctx.strokeText("Press 'M' to go to start menu", 150, 500);
    ctx.fillText(" Press 'enter' to restart", 640, 500);
    ctx.strokeText(" Press 'enter' to restart", 640, 500);
    for (var i = 0; i < tableauBonus; i++) {
        tableauBonus[i].reset();
    }
    bonus = undefined;
    resetAfterBonus();
    resetRacketAndBall();
    jeuLance = false;
    if (inputState.enter) {
        gameState = 'jeuEnCours';
        if (soundState == "on")
            assets.bgnSound.play();
    }
    if (inputState.m) {
        gameState = 'menuStart';

        if (soundState == "on")
            assets.menuStart.play();
    }
    ctx.restore();
}
function afficheGameVictory(ctx) {
    ctx.save();
    ctx.fillStyle = 'green';
    ctx.font = "50px Arial";
    ctx.fillText("YOU WIN!!!", 320, 300);
    ctx.strokeText("YOU WIN!!!", 320, 300);
    ctx.fillStyle = 'black';
    ctx.font = "20px Arial";
    ctx.fillText("Press 'M' to go to start menu", 150, 500);
    ctx.strokeText("Press 'M' to go to start menu", 150, 500);
    ctx.fillText(" Press 'enter' to restart", 640, 500);
    ctx.strokeText(" Press 'enter' to restart", 640, 500);
    for (var i = 0; i < tableauBonus; i++) {
        tableauBonus[i].reset();
    }
    bonus = undefined;
    resetRacketAndBall();
    jeuLance = false;
    if (inputState.enter) {
        gameState = 'jeuEnCours';
        if (soundState == "on")
            assets.bgnSound.play();
    }
    if (inputState.m) {
        gameState = 'menuStart';
        if (soundState == "on")
            assets.menuStart.play();
    }
    ctx.restore();
}
function afficheGamePause(ctx) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.font = "50px Arial";
    ctx.fillText("Press 'R' to resume the game", 100, 200);
    ctx.strokeText("Press 'R' to resume the game", 100, 200);
    ctx.fillText("Press 'M' to go to start menu", 100, 500);
    ctx.strokeText("Press 'M' to go to start menu", 100, 500);
    if (inputState.r) {
        gameState = 'jeuEnCours';
        if (soundState == "on")
            assets.bgnSound.play();
    }
    if (inputState.m) {
        gameState = 'menuStart';
        resetRacketAndBall();
        jeuLance = false;
        resetAfterBonus();
        if (soundState == "on")
            assets.menuStart.play();
    }
    ctx.restore();
}
function afficheGameOptions(ctx) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.font = "40px Arial";
    ctx.fillText("OPTIONS", 400, 100);
    ctx.strokeText("OPTIONS", 400, 100);
    ctx.fillText("Press 'M' to go to start menu", 50, 500);
    ctx.strokeText("Press 'M' to go to start menu", 50, 500);
    ctx.font = "35px Arial";
    ctx.fillText("(N) to ON or (F) to OFF the Sound", 450, 400);
    ctx.strokeText("(N) to ON or (F) to OFF the Sound", 450, 400);
    if (soundState === "on") {
        ctx.drawImage(assets.soundOn, 650, 450, 100, 100);
    }
    else {
        ctx.drawImage(assets.soundOff, 650, 450, 100, 100);
    }
    if (inputState.n) {
        if (soundState === "off") {
            soundState = "on";
            assets.menuStart.play();
        }
    }
    if (inputState.f) {
        if (soundState === "on"){
            soundState = "off";
            assets.menuStart.stop();
        }
    }
    if (inputState.m) {
        gameState = 'menuStart';
    }
    ctx.restore();
}
function afficheGameLoading(ctx) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.font = "30px Arial";
    ctx.fillText("Lvl : " + (currentLvl) + " passed ! Push your touch 'enter' to access to the lvl : " + (currentLvl + 1), 100, 300);
    ctx.strokeText("Lvl : " + (currentLvl) + " passed ! Push your touch 'enter' to access to the lvl : " + (currentLvl + 1), 100, 300);
    if (inputState.enter) {
        for (var i = 0; i < tableauBonus; i++) {
            tableauBonus[i].reset();
        }
        bonus = undefined;
        resetRacketAndBall();
        jeuLance = false;
        gameState = 'jeuEnCours';
        assets.bgnSound.play();
    }
    ctx.restore();
}
function detecteCollisionBricksWithBricks() {
    let b;
    tableauDesObjetsGraphiques.forEach(balle => {
        if (balle instanceof Ball) {
            for (let i = 0; i < tableauDesObjetsGraphiques.length; i++) {
                b = tableauDesObjetsGraphiques[i];
                if (b instanceof Bricks) {
                    // Si la balle est en collision avec la brique
                    if (balle.x + balle.r > b.x && balle.x - balle.r < b.x + b.l && balle.y + balle.r > b.y && balle.y - balle.r < b.y + b.h) {
                        // Joue le son plop quand on touche une brique
                        if (soundState === "on")
                            assets.plop.play();
                        // si la balle est en collision avec le bord gauche ou droit de la brique
                        if (balle.x + balle.r > b.x && balle.x - balle.r < b.x) {
                            balle.vx = -balle.vx;
                        }
                        // si la balle est en collision avec le bord haut ou bas de la brique
                        else {
                            balle.vy = -balle.vy;
                        }
                        if (b.ptsDeVieDeBase == 1) {
                            // On supprime la brique
                            b.ptsDeVieDeBase--;
                            tableauDesObjetsGraphiques.splice(i, 1);
                        }
                        else {
                            b.ptsDeVieDeBase--;
                        }
                        // On sort de la boucle
                        break;
                    }
                }
                if (b instanceof Bonus) {
                    // Si le bonus entre en collision avec la racket
                    if (b.x + b.l > racket.x && b.x < racket.x + racket.l && b.y + b.h > racket.y && b.y < racket.y + racket.h) {
                        // On joue un son de bonus
                        if (soundState === "on")
                            assets.bonusSound.play();
                        // On reset le bonus
                        b.reset();
                        // On active le bonus
                        effetBonus(b.sprite.src);
                        // On remet le bonus en indéfini
                        bonus = undefined;
                        // On sort de la boucle
                        break;
                    }
                    // Si le bonus entre en collision avec le bas du canvas
                    if (b.y > canvas.height) {
                        // On reset le bonus
                        b.reset();
                        // On remet le bonus en indéfini
                        bonus = undefined;
                        // On sort de la boucle
                        break;
                    }
                }
            }
        }
    })
}

function detecteCollisionBallWithRacket() {
    // Si la balle est en collision avec le haut de la racket
    // Collision par le haut de la racket
    if (circRectsOverlap(racket.x, racket.y, racket.l, racket.h, ball.x, ball.y, ball.r)) {
        // Collision par le haut de la racket
        if (ball.y + ball.r > racket.y) {
            ball.vy = -ball.vy;
            ball.y = racket.y - ball.r;
        }
        // Collision sur la gauche de la racket
        if (ball.x - ball.r < racket.x) {
            ball.vx = -ball.vx;
            ball.x = racket.x - ball.r;
        }
        // Collision sur la droite de la racket
        if (ball.x + ball.r >= racket.x + racket.l) {
            ball.vx = -ball.vx;
            ball.x = racket.x + racket.l + ball.r;
        }

    }
}
function chargeLvl() {
    let a;
    console.log('chargement du niveau : ' + currentLvl);
    let tabElement = lvls[currentLvl].tabElements;
    tableauDesObjetsGraphiques = [...tabElement];
    for (let i = 0; i < tableauDesObjetsGraphiques.length; i++) {
        a = tableauDesObjetsGraphiques[i];
        if (a instanceof Bricks) {
            a.ptsDeVieDeBase = a.ptsDeVie;
        }
    }
    tableauDesObjetsGraphiques.push(racket);
    tableauDesObjetsGraphiques.push(ball);
    for (let i = 0; i < tableauDesObjetsGraphiques.length; i++) {
        a = tableauDesObjetsGraphiques[i];
        if (a instanceof Bonus) {
            tableauBonus.push(a);
        }
    }
}
function dessinerLesObjetsGraphiques(ctx) {
    tableauDesObjetsGraphiques.forEach(o => {
        o.draw(ctx);
    });
};
function changeLvl() {
    let a;
    let briqueExist = false;
    for (let i = 0; i < tableauDesObjetsGraphiques.length; i++) {
        a = tableauDesObjetsGraphiques[i];
        if (a instanceof Bricks) {
            briqueExist = true;
            break;
        }
    }
    if (briqueExist === false) {
        resetAfterBonus();
        for (let i = 0; i < tableauDesObjetsGraphiques.length; i++) {
            let b = tableauDesObjetsGraphiques[i];
            if (b instanceof Bonus) {
                // On reset le bonus
                b.reset();
            }
        }
        if (currentLvl < lvls.length - 1) {
            currentLvl++;
            gameState = 'gameLoading';
        }
        else {
            gameState = 'gameVictory';
            if (soundState == "on") {
                assets.bgnSound.stop();
                assets.victory.play();
            }
        }
    }
}
function playBonus(compteur) {
    if (tableauBonus.length > 0 && compteur > 960) {
        console.log('je lance un bonus');
        bonus = tableauBonus[Math.floor(Math.random() * tableauBonus.length)]
        bonus.vy = 3;

        return bonus;
    }
    else if (compteur === 800) {
        resetAfterBonus();
    }
}
function resetRacketAndBall() {
    racket.x = 458;
    racket.y = 650;
    ball.x = 500;
    ball.y = 635;
    ball.vy = 0;
    ball.vx = 0;
}

function effetBonus(bonusName) {
    // On regarde le nom du bonus
    // Si le bonus est un bonus de slow :
    if (bonusName.includes('slow')) {
        // On diminue la vitesse de la balle
        ball.vx = ball.vx / 1.5;
        ball.vy = ball.vy / 1.5;
    }
    // Si le bonus est un bonus de fast :
    else if (bonusName.includes('fast')) {
        // On augmente la vitesse de la balle
        ball.vx = ball.vx * 1.5;
        ball.vy = ball.vy * 1.5;
    }
    // Si le bonus agrandit la racket :
    else if (bonusName.includes('tall')) {
        // On augmente la taille de la racket
        racket.l = 124;
        racket.sprite = assets.large;
    }
    // Si le bonus rétrécit la racket :
    else if (bonusName.includes('small')) {
        // On rétrécit la taille de la racket
        racket.l = 42;
        racket.sprite = assets.petite;
    }

    for (let i = 0; i < tableauDesObjetsGraphiques.length; i++) {
        let b = tableauDesObjetsGraphiques[i];
        if (b instanceof Ball) {
            tableauDesObjetsGraphiques.splice(i, 1);
            tableauDesObjetsGraphiques.push(ball);
        }
    };
    for (let i = 0; i < tableauDesObjetsGraphiques.length; i++) {
        let b = tableauDesObjetsGraphiques[i];
        if (b instanceof Racket) {
            tableauDesObjetsGraphiques.splice(i, 1);
            tableauDesObjetsGraphiques.push(racket);
            console.log(b)
        }
    };

}
function resetAfterBonus() {
    // On remet la vitesse de la balle à sa valeur de base
    if (ball.vx > 0) {
        ball.vx = 6;
    }
    else {
        ball.vx = -6;
    }
    if (ball.vy > 0) {
        ball.vy = 6;
    }
    else {
        ball.vy = -6;
    }
    // On remet la taille de la racket à sa valeur de base
    racket.l = 83;
    racket.sprite = assets.normale;

    // On remplace les objets racket et ball dans le tableau des objets graphiques
    for (let i = 0; i < tableauDesObjetsGraphiques.length; i++) {
        let b = tableauDesObjetsGraphiques[i];
        if (b instanceof Ball) {
            tableauDesObjetsGraphiques.splice(i, 1);
            tableauDesObjetsGraphiques.push(ball);
        }
    };
    for (let i = 0; i < tableauDesObjetsGraphiques.length; i++) {
        let b = tableauDesObjetsGraphiques[i];
        if (b instanceof Racket) {
            tableauDesObjetsGraphiques.splice(i, 1);
            tableauDesObjetsGraphiques.push(racket);
        }
    };
}

function topScore(level) {
    if(localStorage.getItem('topUn')) {
        if(level > localStorage.getItem('topUn')) {
            console.log('currentlevel')
            localStorage.removeItem('topUn')
            localStorage.setItem('topUn', level);
        }
    }else {
        localStorage.setItem('topUn', level);
    }
}
