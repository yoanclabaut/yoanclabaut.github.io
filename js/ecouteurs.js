let inputState = {}




function ajouteEcouteursClavier() {
    // On va écouter les événements clavier
    // et on va modifier la vitesse du joueur
    // en fonction de la touche pressée
    window.onkeydown = (event) => {
        console.log(event.key);
        switch (event.key) {
            case 'ArrowLeft':
                inputState.left = true;
                break;
            case 'ArrowRight':
                inputState.right = true;
                break;
            case ' ':
                inputState.space = true;
                break;
            case 'Enter':
                inputState.enter = true;
                break;   
            case 's':
                inputState.s = true;
                break;  
            case 'o':
                inputState.o = true;
                break;       
            case 'e':
                inputState.e = true;
                break;   
            case 'n':
                inputState.n = true;
                break;   
            case 'f':
                inputState.f = true;
                break;  
            case 'r':
                inputState.r = true;
                break;  
            case 'm':
                inputState.m = true;
                break;   
            case 't':
                inputState.t = true;
                break;
        }
    }

    window.onkeyup = (event) => {
        console.log(event.key);
        switch (event.key) {
            case 'ArrowLeft':
                inputState.left = false;
                break;
            case 'ArrowRight':
                inputState.right = false;
                break;
            case ' ':
                inputState.space = false;
                break;
            case 'Enter':
                inputState.enter = false;
                break;  
            case 's':
                inputState.s = false;
                break;  
            case 'o':
                inputState.o = false;
                break;
            case 'e':
                inputState.e = false;
                break; 
            case 'n':
                inputState.n = false;
                break;  
            case 'f':
                inputState.f = false;
                break;   
            case 'r':
                inputState.r = false;
                break;  
            case 'm':
                inputState.m = false;
                break;   
            case 't':
                inputState.t = false;
                break; 
        }
    }

}

export {ajouteEcouteursClavier, inputState}