let player = document.getElementById("Player");
let world = document.getElementById("world");

let x = 0;
let y = 0;

let playerCoordinatesY = window.innerHeight*.45;
let playerCoordinatesX = window.innerWidth*.45;

let start = document.getElementById("start");
start.addEventListener("click", startGame);

function startGame(){
    start.style.display = "none";
    window.addEventListener("keydown", move);
}

function positionPlayer(){

}



function move(event){
    console.log("X: " + playerCoordinatesX + " Y: " + playerCoordinatesY);
    switch(event.key){
        case "w":
            if(y < 0){
                y += 50;            //y and player coordinates need to algin better!
                playerCoordinatesY -= 50;
                player.style.top = window.innerHeight*.45 + "px";
            }
            else if(playerCoordinatesY > 115){
                playerCoordinatesY -= 50;
                player.style.top = playerCoordinatesY + "px";
            }
            world.style.top = y + "px";
            break;
        case "s":
            y -= 50;
            playerCoordinatesY +=50;
            world.style.top = y + "px";
            break;
        case "a":
            if(x < 0){
                x += 50;
                playerCoordinatesX -= 50;
            }
            world.style.left = x + "px";
            break;
        case "d":
            if(x > -(5000 - window.innerWidth*.65)){  //-3750
                x -= 50;
                playerCoordinatesX += 50;
            }
            world.style.left = x + "px";
            break;    
    }


}