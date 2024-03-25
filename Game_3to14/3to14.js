//window.innerHeight & window.innerWidth are in pixels

//Save to session varibales: round, numOfPlayers, players array with cleared hands.. or clear them after pulling them.
//      scoreboard html, and playsFirst... I may need to do some of the things
//      that switchPlayer and endRound do to set the varibels.. but maybe not
//      because they may be reset from the beginning of the code.

//Variables 
let infoDiv = document.getElementById("infoDiv");
let startDiv = document.getElementById("startDiv");  
let deckDiv = document.getElementById("deckDiv");
let discardDiv = document.getElementById("discardDiv");
let handDiv = document.getElementById("handDiv");
let actionsDiv = document.getElementById("actionsDiv");
let body = document.getElementsByTagName("body")[0];
let playersDiv = document.getElementById("playersDiv");
let playersList = document.getElementById("playersList");
let scoreList = document.getElementById("scoreList");
let scoreBoardTable = document.getElementById("scoreBoard");
let numOfPlayers = 0;
let players = [];
let deck;
let discard = [];
let cardHighlighted = false;
let selectedCardIndex = -1;
let interactingPlayer;
let playsFirst = 0; //players index of interactingPlayer
let playerHasLayedDown = false;
let playerWhoLayedDown;
let round = 3;

const gameStates = {
    GAME_OVER: 0,
    ROUND_OVER: 1,
    PLAYING: 2,
    NEW_DEAL: 3 //do I need this one?
};

let gameState = gameStates.PLAYING;

const suits = [ 
    'hearts',
    'dimonds',
    'spades',
    'clubs'
];

const rank = [
    /*0*/2, /*1*/3, /*2*/4, /*3*/5, /*4*/6, /*5*/7, /*6*/8, 
    /*7*/9, /*8*/10, /*9 J*/11, /*10 Q*/12, /*11 K*/13, /*12 A*/14
]

const cardBackImg = [
    "Queenie1.HEIC",
    "Queenie2.HEIC",
    "Queenie3.HEIC",
    "Queenie4.JPEG",
    "Queenie5.JPEG",
    "Queenie6.JPEG"
]

class Deck{   //calculating numDecks: Math.ceil(numOfPlayers * 14 / 54);
    constructor(numDecks){
        this.cards = []; //an array of 54 cards (don't forget jokers)
        this.numDecks = numDecks;
    }

    shuffle(){
        for(let x = 0; x < 2; x++){ //too much?
            for(let i = this.cards.length - 1; i > 0; i--){
                let j = Math.floor(Math.random() * (i + 1)); //does this go one number too high?
                let tmp = this.cards[i];
                this.cards[i] = this.cards[j];
                this.cards[j] = tmp;
            }
        }
    }

    createNewDeck(){  
        let cards = [];

        for(let w=0; w < this.numDecks; w++){
            for (let x=0; x < suits.length; x++){
                for(let y=0; y < rank.length; y++){
                    let card = {};
                    card.backImg = cardBackImg[w];
                    card.suit = suits[x];
                    card.rank = rank[y];
                    card.matched = false;
                    cards.push(card);
                }
            }
            let card = {};
            card.backImg = cardBackImg[w];
            card.suit = 'Joker';
            card.rank = 'Joker';
            card.matched = false;
            cards.push(card);
            let card2 = {};
            card2.backImg = cardBackImg[w];
            card2.suit = 'Joker';
            card2.rank = 'Joker';
            card2.matched = false;
            cards.push(card2);
        }

        return cards;
    }
}

class Player{
    constructor(name){
        this.name = name;
        this.hand = [];
        //turn boolean?
        this.score = 0;
    }

    // get hand(){
    //     return hand;
    // }
    // set hand(cards){
    //     this.hand = cards;
    // }
}

document.getElementById("scoreSubmit").addEventListener("click", function(){
    scoreBoardTable.hidden = "true";
});
document.getElementById("viewScore").addEventListener("click", function(){
    if(scoreBoardTable.hidden == true){
        scoreBoardTable.removeAttribute("hidden");
    }
    else{
        scoreBoardTable.hidden = "true";
    }
});
window.addEventListener("DOMContentLoaded", loadedHandler);

function loadedHandler() {       
    body.style.height = window.innerHeight + "px";

    //Updating the Information Div
    let newInfo = document.createElement("div");
    newInfo.innerHTML = "Welcome to 3-14!";
    infoDiv.appendChild(newInfo);

    let startButton = document.getElementById("startButton");
    //Starting the game
    startButton.addEventListener("click", function(){
        startDiv.style.fontSize = "2em";
        startDiv.classList.remove("start");
        startDiv.innerHTML = "How many players?";

        let numInput = document.createElement("input");
        numInput.type = "number"; 
        numInput.style.display = "block";
        numInput.style.margin = "20px";
        numInput.max = "20";
        numInput.min = "1";
        numInput.value = "1";
        startDiv.appendChild(numInput);

        let submit = document.createElement("input");
        submit.type = "submit";
        submit.value = "Let's Play!";
        submit.style.margin = "20px";
        submit.classList.add("clickable");
        submit.style.display = "block";
        startDiv.appendChild(submit);

        let x=0;
        submit.addEventListener("click", function() {
            numOfPlayers = numInput.value;
            submitPlayers(x);
        });
        numInput.addEventListener("keypress", function(event){
            if(event.key == "Enter"){
                numOfPlayers = numInput.value;
                submitPlayers(x);
            }
        });
    });
    
    

}


function drawCardBack(){
    let newCard = document.createElement("div");
    newCard.classList.add("cardBack");
    return newCard;
}

function submitPlayers(x){
    
    startDiv.innerHTML = "Enter Player "+ parseInt(x+1) +"'s Name: ";
    let textBox = document.createElement("input");
    textBox.type = "text";
    textBox.style.display = "block";
    textBox.style.margin = "20px";
    startDiv.appendChild(textBox);

    let nextButton = document.createElement("input");
    nextButton.type = "submit";
    nextButton.classList.add("clickable");
    nextButton.style.display = "block";
    nextButton.style.margin = "20px";
    if(x == numOfPlayers-1){
        nextButton.value = "Done!"
    }
    else{
        nextButton.value = "Next Player";
    }
    startDiv.appendChild(nextButton);

    nextButton.addEventListener("click", function(){
        if(textBox.value !== ""){
            next(x, textBox.value);
        }
        else{
            let warning = document.createElement("h3");
            warning.innerHTML = "Please enter a name!";
            warning.style.color = "red";
            startDiv.appendChild(warning);
        }
    });
    textBox.addEventListener("keypress", function(event){
        if(event.key == "Enter"){
            if(textBox.value !== ""){
                next(x, textBox.value);
            }
            else{
                let warning = document.createElement("h3");
                warning.innerHTML = "Please enter a name!";
                warning.style.color = "red";
                startDiv.appendChild(warning);
            }
        }
    });
}

function next(x, text){
    x++;

    //creating the players
    let newPlayer = new Player(text);

    players.push(newPlayer);

    playersDiv.removeAttribute("hidden");
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.innerHTML = x + ". " + players[x-1].name;
    //li.style.textAlign = "left";
    tr.appendChild(td);
    let td2 = document.createElement("td");
    td2.innerHTML = players[x-1].score + "pts";
    tr.appendChild(td2);
    playersList.appendChild(tr);

    let tdScore = document.createElement("td");
    tdScore.innerHTML = "<strong>" + players[x-1].name + "</strong>";
    document.getElementById("scorePlayer").appendChild(tdScore);


    if(x == numOfPlayers){
        startGame();
    }
    submitPlayers(x);
}


function startGame(){
    
    //Creating the deck and shuffling
    deck = new Deck(Math.ceil(numOfPlayers * 14 / 54) + 1);
    deck.cards = deck.createNewDeck();
    console.log(deck);
    deck.shuffle();

    //Drawing the deck
    drawDeck();
    
    //Unhiding the oj div's
    startDiv.hidden = "true";
    deckDiv.removeAttribute("hidden");
    discardDiv.removeAttribute("hidden");
    handDiv.removeAttribute("hidden");

    //Playing the game! 3 to 14 is 12 rounds
    playGame(round);
    

}

function playGame(){
    //Dealing cards (changing the top card on the deck background img)
    for(let r=0; r<round; r++){
        for(let p=0; p<players.length; p++){
            players[p].hand.push(deck.cards.pop());
        }
    }

    gameState = gameStates.PLAYING;

    playsFirst = 0;
    if(round - 3 < players.length){
        playsFirst = round-3;
    }
    else{
        let x = round-3;
        while(x > players.length - 1){
            x -= players.length;
        }
        playsFirst = x;
    }

    interactingPlayer = players[playsFirst];
   
    //I may need to change who goes first when implementing a 1 player game
    infoDiv.innerHTML = "New round! " + interactingPlayer.name + " plays first.";

    discard.push(deck.cards.pop());

    console.log(deck);

    revealingHand();

    



    //Organizing the hand

    //Tracking game state
   // while(gameState == gameStates.PLAYING){
        
        
        //Switching turns
    
   // }
    

    // if(gameState == gameStates.ROUND_OVER){

    // }
    // else if(gameState == gameStates.GAME_OVER){

    // }

    



    // let moveDiv = document.getElementById();
    // let whereTop = document.getElementById().style.top;
    // let whereLeft = document.getElementById().style.left;
    // let intervalId = setInterval(moveCard, 10, moveDiv, whereTop, whereLeft);
}

function moveCard(moveDiv, whereTop, whereLeft){

}

function revealingHand(){
    let revealHand = document.createElement("input");
    revealHand.type = "submit";
    revealHand.value = "Reveal " + interactingPlayer.name + "'s hand";
    revealHand.classList.add("clickable");
    handDiv.appendChild(revealHand);

    revealHand.addEventListener("click", function(){
        showHand();

        let deckTopCard = drawDeck();
        deckTopCard.classList.add("clickable");

        //update the infomation board
        infoDiv.style.fontSize = "3em";
        infoDiv.innerHTML = "Draw a card from the deck or discard pile"

        if(playerHasLayedDown){
            window.alert("This is your last turn. " + playerWhoLayedDown.name + " has layed down.")
            //show points earnd at end of turn?
        }

        let discardTopCard = drawDiscard();
        if(discardTopCard != null){
            discardTopCard.classList.add("clickable");

            discardTopCard.addEventListener("click", function(){
                discardTopCard.classList.remove("clickable");
                deckTopCard.classList.remove("clickable");
                playerDrew("discard");
            });
        }

        deckTopCard.addEventListener("click", function(){
            discardTopCard.classList.remove("clickable");
            deckTopCard.classList.remove("clickable");
            playerDrew("deck");
        });

    });
}

function drawDeck(){
    let newCard = drawCardBack();
    newCard.style.margin = "20px 20px 20px 55px";
    newCard.style.backgroundImage = "url(" + deck.cards[deck.cards.length-3].backImg + ")";
    deckDiv.appendChild(newCard);
    
    newCard = drawCardBack();
    newCard.style.margin = "15px 20px 20px 50px";
    newCard.style.backgroundImage = "url(" + deck.cards[deck.cards.length-2].backImg + ")";
    deckDiv.appendChild(newCard);
    
    newCard = drawCardBack();
    newCard.style.margin = "10px 20px 20px 45px";
    newCard.style.backgroundImage = "url(" + deck.cards[deck.cards.length-1].backImg + ")";
    newCard.id = "topDeckCard";
    deckDiv.appendChild(newCard);
    return newCard;
}

function drawDiscard(){
    if(discard.length == 0){
        discardDiv.innerHTML = "<h3>Discard Pile</h3> <div id='emptyDiscard'></div>"
        return null;
    }
    else if(discard.length == 1){
        discardDiv.innerHTML = "<h3>Discard Pile</h3>";
        newCard = drawCard(discard[discard.length - 1].suit, discard[discard.length - 1].rank);
        newCard.style.margin = "10px 20px 20px 45px";
        newCard.id = "topDiscardCard";
        discardDiv.appendChild(newCard);
        return newCard; //to make top card clickable
    }
    else if(discard.length == 2){
        discardDiv.innerHTML = "<h3>Discard Pile</h3>";
        newCard = drawCard(discard[discard.length - 2].suit, discard[discard.length - 2].rank);
        newCard.style.margin = "15px 20px 20px 50px";
        discardDiv.appendChild(newCard);
        
        newCard = drawCard(discard[discard.length - 1].suit, discard[discard.length - 1].rank);
        newCard.style.margin = "10px 20px 20px 45px";
        newCard.id = "topDiscardCard";
        discardDiv.appendChild(newCard);
        return newCard; //to make top card clickable
    }
    else{
        discardDiv.innerHTML = "<h3>Discard Pile</h3>";
        let newCard = drawCard(discard[discard.length - 3].suit, discard[discard.length - 3].rank);
        newCard.style.margin = "20px 20px 20px 55px";
        discardDiv.appendChild(newCard);
        
        newCard = drawCard(discard[discard.length - 2].suit, discard[discard.length - 2].rank);
        newCard.style.margin = "15px 20px 20px 50px";
        discardDiv.appendChild(newCard);
        
        newCard = drawCard(discard[discard.length - 1].suit, discard[discard.length - 1].rank);
        newCard.style.margin = "10px 20px 20px 45px";
        newCard.id = "topDiscardCard";
        discardDiv.appendChild(newCard);
        return newCard; //to make top card clickable
    }
}

function showHand(clickable){
    handDiv.innerHTML = "<h3>Your Cards</h3>";
    
    for(let c=0; c < interactingPlayer.hand.length; c++){
        let newCard = drawCard(interactingPlayer.hand[c].suit, interactingPlayer.hand[c].rank);
        newCard.style.marginLeft = 100 * c +"px";
        newCard.id = "card" + c;
        if(clickable){
            newCard.classList.add("clickable");
        }
        handDiv.appendChild(newCard);
        if(clickable){
            let index = c;
            newCard.addEventListener("click", function(){
                selected(index)
            });
        }
    }

    layDownCheck();
}

function selected(index){
    let selectedCard = document.getElementById("card"+index);
    if(cardHighlighted){
        if(index == selectedCardIndex){
            cardHighlighted = false;
            selectedCard.classList.remove("selected");
            drawDiscard();
        }
        else{   //organizing players hand
            let temp = interactingPlayer.hand[selectedCardIndex];
            interactingPlayer.hand[selectedCardIndex] = interactingPlayer.hand[index];
            interactingPlayer.hand[index] = temp;
            document.getElementById("card"+selectedCardIndex).classList.remove("selected");
            cardHighlighted = false;
            showHand(true);
            drawDiscard();  //take off the possible click event
        }
    }
    else{
        selectedCardIndex = index;
        cardHighlighted = true;
        selectedCard.classList.add("selected");
        if(discard.length > 0){
            document.getElementById("topDiscardCard").classList.add("clickable");
            document.getElementById("topDiscardCard").addEventListener("click", function(){
                let endTurn = window.confirm("Are you sure you want to discard? \nThis will end your turn.");
                if(endTurn){
                    discard.push(interactingPlayer.hand.splice(index, 1)[0]); //splice returns an array
                    drawDiscard(); 
                    cardHighlighted = false;
                    showHand(); //delete this function call once switchPlayers is implented.

                    if(playerHasLayedDown){
                        console.log("add points here maybe?");
                    }
                    else if(layDownCheck()){    
                        let endRound = window.confirm("You can lay down. Would you like to lay down?");
                        if(endRound){
                            playerWhoLayedDown = interactingPlayer;
                            playerHasLayedDown = true;
                        }
                    }
                    switchPlayers();
                }
            })
        }   
        else{
            document.getElementById("emptyDiscard").classList.add("clickable");
            document.getElementById("emptyDiscard").addEventListener("click", function(){
                let endTurn = window.confirm("Are you sure you want to discard? \nThis will end your turn.");
                if(endTurn){
                    discard.push(interactingPlayer.hand.splice(index, 1)[0]); //splice returns an array
                    drawDiscard(); 
                    cardHighlighted = false;
                    showHand(); //delete this function call once switchPlayers is implented.
                    
                    if(playerHasLayedDown){
                        console.log("add points here maybe?");
                    }
                    else if(layDownCheck()){    
                        let endRound = window.confirm("You can lay down. Would you like to lay down?");
                        if(endRound){
                            playerWhoLayedDown = interactingPlayer;
                            playerHasLayedDown = true;
                        }
                    }
                    switchPlayers();
                }
            })
        }
    }
    
    layDownCheck();
}

function drawCard(suit, rank){
    let card = document.createElement("div");
    card.classList.add("card");
    let rankSub;
    if(rank == 11){
        rankSub = 'J';
    }
    else if(rank == 12){
        rankSub = 'Q';
    }
    else if(rank == 13){
        rankSub = 'K';
    }
    else if(rank == 14){
        rankSub = 'A';
    }
    else{
        rankSub = rank;
    }
    
    let topRankDiv = document.createElement("div");
    topRankDiv.innerHTML = rankSub;
    topRankDiv.id = "topRank";

    let bottomRankDiv = document.createElement("div");
    bottomRankDiv.innerHTML = rankSub;
    bottomRankDiv.id = "bottomRank";

    let topSuitDiv = document.createElement("img");
    topSuitDiv.id = "topSuit";

    let bottomSuitDiv = document.createElement("img");
    bottomSuitDiv.id = "bottomSuit";

    if(suit == 'dimonds'){  //suits[1]
        topRankDiv.style.color= "red";
        topSuitDiv.src = "dimonds.png";
        card.style.backgroundImage = "url(dimonds.png)";
        bottomRankDiv.style.color= "red";
        bottomSuitDiv.src = "dimonds.png";
    }
    else if(suit == 'hearts'){ //suits[0]
        topRankDiv.style.color= "red";
        topSuitDiv.src = "hearts.png";
        card.style.backgroundImage = "url(hearts.png)";
        bottomRankDiv.style.color= "red";
        bottomSuitDiv.src = "hearts.png";
    }
    else if(suit == 'clubs'){ //suits[3]
        topRankDiv.style.color= "black";
        topSuitDiv.src = "clubs.png";
        card.style.backgroundImage = "url(clubs.png)";
        bottomRankDiv.style.color= "black";
        bottomSuitDiv.src = "clubs.png";
    }
    else if(suit == 'spades'){ //suits[2]
        topRankDiv.style.color= "black";
        topSuitDiv.src = "spades.png";
        card.style.backgroundImage = "url(spades.png)";
        bottomRankDiv.style.color= "black";
        bottomSuitDiv.src = "spades.png";
    }
    else if(suit == 'Joker'){
        //find a good icon!*************************************
    }

    card.appendChild(topRankDiv);
    card.appendChild(bottomRankDiv);
    card.appendChild(topSuitDiv);
    card.appendChild(bottomSuitDiv);

    return card;
}

function playerDrew(cardIsFrom){
    if(cardIsFrom == "deck"){
        interactingPlayer.hand.push(deck.cards.pop());
        drawDiscard();
        drawDeck();
    }
    else if(cardIsFrom == "discard"){
        interactingPlayer.hand.push(discard.pop());
        drawDeck();
        drawDiscard();
    }
    
    //update infomation
    infoDiv.style.fontSize = "2em";
    infoDiv.innerHTML = "Select a card. Then select another card to organize your hand or select the discard pile to end your turn."
    //infoDiv.style.fontSize = "3em";

    setTimeout(showHand, 100, true);
    let yep = document.createElement("h3");
    yep.innerHTML = ":)";
    handDiv.appendChild(yep);   //prevents the drawn card from becoming selected automatically

}

function switchPlayers(){
    playsFirst++;
    if(playsFirst >= numOfPlayers){
        playsFirst = 0;
    }
    interactingPlayer = players[playsFirst];

    //hide previous players hand
    handDiv.innerHTML = "<h3>Your Cards</h3>";

    //update infomation
    infoDiv.innerHTML = interactingPlayer.name + "'s turn";

    if(playerHasLayedDown){
        if(interactingPlayer.name == playerWhoLayedDown.name){
            endRound();
        }
        else{
            revealingHand();
        }
    }
    else{
        revealingHand();
    }
}

function layDownCheck(){
    //copy the players hand
    // let handDup = [];
    // for(let x=0; x<interactingPlayer.hand.length;x++){
    //     handDup.push(interactingPlayer.hand[x]);
    // }

    let wildIndices = [];

    //Checking for sets
    let sets = [];

    for(let x=0; x<interactingPlayer.hand.length; x++){
        interactingPlayer.hand[x].matched = false;
        if(interactingPlayer.hand[x].rank == "Joker" || interactingPlayer.hand[x].rank == round){
            interactingPlayer.hand[x].matched = true;
            wildIndices.push(x);
            if(wildIndices.length == round){
                for(let x=0; x<interactingPlayer.hand.length; x++){
                    if(interactingPlayer.hand[x].matched == true){
                        document.getElementById("card"+x).style.backgroundColor = "lightgreen";
                    }
                }
                return true;
            }
        }
    }
    console.log(wildIndices);

    for(let card=0; card < interactingPlayer.hand.length-1; card++){
        let set = [];
        if(interactingPlayer.hand[card].matched == false){
            set.push(card);
            interactingPlayer.hand[card].matched = true;  //probably don't need this
            for(let check=1+card; check < interactingPlayer.hand.length; check++){
                if(interactingPlayer.hand[check].matched == false){
                    if(interactingPlayer.hand[card].rank == interactingPlayer.hand[check].rank){
                        interactingPlayer.hand[check].matched = true;
                        set.push(check);
                    }
                }
            }
            if(set.length >= 3){
                console.log("Set pushed:");
                console.log(set);
                sets.push(set);
            }
            else if(set.length >= 3-wildIndices.length){
                for(let w=0; set.length < 3; w++){
                    set.push(wildIndices[w]);
                }
                console.log("Set pushed:");
                console.log(set);
                sets.push(set);
            }
            else{
                for(let x=0; x<set.length; x++){
                    interactingPlayer.hand[set[x]].matched = false;
                }
            }
            if(set.length == round){
                for(let x=0; x<interactingPlayer.hand.length; x++){
                    if(interactingPlayer.hand[x].matched == true){
                        document.getElementById("card"+x).style.backgroundColor = "lightgreen";
                    }
                }
                return true;
            }
        }
    }

    //Checking for runs
    let runs = [];

    for(let x=0; x<interactingPlayer.hand.length; x++){
        interactingPlayer.hand[x].matched = false;
        if(interactingPlayer.hand[x].rank == "Joker" || interactingPlayer.hand[x].rank == round){
            interactingPlayer.hand[x].matched = true;
        }
    }
//Ace's counting as a 1 or a 14...***********************
    for(let card=0; card < interactingPlayer.hand.length-1; card++){
        let run = [];
        if(interactingPlayer.hand[card].matched == false){
            run.push(card);
            interactingPlayer.hand[card].matched = true; 
            for(let check=1+card; check < interactingPlayer.hand.length; check++){
                if(interactingPlayer.hand[card].suit == interactingPlayer.hand[check].suit && interactingPlayer.hand[check].matched == false){
                    if(interactingPlayer.hand[check].rank == interactingPlayer.hand[card].rank-1){
                        run.push(check);
                        interactingPlayer.hand[check].matched = true;
                        checkSmallerRanks(run, card, interactingPlayer.hand[check].rank, 0, wildIndices);
                    }
                    else if(interactingPlayer.hand[check].rank == interactingPlayer.hand[card].rank+1){
                        run.push(check);
                        interactingPlayer.hand[check].matched = true;
                        checkLargerRanks(run, card, interactingPlayer.hand[check].rank, 0, wildIndices);
                    }
                    else {
                        for(let w=1; w<wildIndices.length+1; w++){
                            if(interactingPlayer.hand[check].rank == interactingPlayer.hand[card].rank+1+w){
                                for(let v=0; v<w; v++){
                                    run.push(wildIndices[v]);
                                }
                                run.push(check);
                                interactingPlayer.hand[check].matched = true;
                                checkLargerRanks(run, card, interactingPlayer.hand[check].rank, w, wildIndices);
                            }
                            if(interactingPlayer.hand[check].rank == interactingPlayer.hand[card].rank-1-w){
                                for(let v=0; v<w; v++){
                                    run.push(wildIndices[v]);
                                }
                                run.push(check);
                                interactingPlayer.hand[check].matched = true;
                                checkSmallerRanks(run, card, interactingPlayer.hand[check].rank, w, wildIndices);
                            }
                        }
                    }
                }
            }
            if(run.length >= 3){
                runs.push(run);
            }
            else if(run.length >= 3-wildIndices.length){
                for(let w=0; run.length < 3; w++){
                    run.push(wildIndices[w]);
                }
                runs.push(run);
            }
            else{
                for(let x=0; x<run.length; x++){
                    interactingPlayer.hand[run[x]].matched = false;
                }
            }
            if(run.length == round){
                for(let x=0; x<interactingPlayer.hand.length; x++){
                    if(interactingPlayer.hand[x].matched == true){
                        document.getElementById("card"+x).style.backgroundColor = "lightseagreen";
                    }
                }
                return true;
            }
        }
    }


    //If there are more than one runs and/or sets
    if(sets.length > 1 || runs.length > 1 || (sets.length >= 1 && runs.length >= 1)){
        return setsCheck(sets, runs, wildIndices);
    }
    else{
        //Determine combo info and determineScore for single groups that can't laydown
        //******************** */
        return false;
    }


    //some serious algarithms here*******************************

    //0. in a minimum set of 3
    //1. in a set of more than 3; after one card is removed it becomes a 0
    //2. in

}
function checkSmallerRanks(run, card, rank, wildsUsed, wildIndices){ //( the array, index to start from-1, rank)
    console.log("smaller");
    for(let check=1+card; check < interactingPlayer.hand.length; check++){
        if(interactingPlayer.hand[card].suit == interactingPlayer.hand[check].suit && interactingPlayer.hand[check].matched == false){
            if(interactingPlayer.hand[check].rank == rank-1){
                run.push(check);
                interactingPlayer.hand[check].matched = true;
                checkSmallerRanks(run, card, interactingPlayer.hand[check].rank, w, wildIndices);
            }
            else{
                for(let w=1; w<wildIndices.length - wildsUsed + 1; w++){
                    if(interactingPlayer.hand[check].rank == rank-1-w){
                        for(let v=wildsUsed; v<w+wildsUsed; v++){
                            run.push(wildIndices[v]);
                        }
                        run.push(check);
                        interactingPlayer.hand[check].matched = true;
                        checkSmallerRanks(run, card, interactingPlayer.hand[check].rank, w, wildIndices);
                    }
                }
            }
        }
    }
}
function checkLargerRanks(run, card, rank, wildsUsed, wildIndices){
    console.log("larger");
    for(let check=1+card; check < interactingPlayer.hand.length; check++){
        if(interactingPlayer.hand[card].suit == interactingPlayer.hand[check].suit && interactingPlayer.hand[check].matched == false){
            if(interactingPlayer.hand[check].rank == rank+1){
                run.push(check);
                interactingPlayer.hand[check].matched = true;
                checkLargerRanks(run, card, interactingPlayer.hand[check].rank, w, wildIndices);
            }
            else{
                for(let w=1; w<wildIndices.length - wildsUsed + 1; w++){
                    if(interactingPlayer.hand[check].rank == rank+1+w){
                        for(let v=wildsUsed; v<w+wildsUsed; v++){
                            run.push(wildIndices[v]);
                        }
                        run.push(check);
                        interactingPlayer.hand[check].matched = true;
                        checkLargerRanks(run, card, interactingPlayer.hand[check].rank, w, wildIndices);
                    }
                }
            }
        }
    }
}

function setsCheck(sets, runs, wildIndices){  //these are arrays of arrays containing indices to cards in the interacting players hand
    console.log("sets: ");
    console.log(sets);
    console.log("runs: ");
    console.log(runs);

    for(let x=0; x<interactingPlayer.hand.length; x++){
        interactingPlayer.hand[x].matched = false;
    }

    let combos = [];

    for(let x=0; x<sets.length + runs.length; x++){
        let combo = {
            indices: [],
            numOfMatched: 0,
            points: 0
        };
        if(x<sets.length){
            for(let y=0; y<sets[x].length; y++){
                combo.indices.push(sets[x][y]);
            }
        }
        else if(runs.length > 0){
            for(let y=0; y<runs[x-sets.length].length; y++){
                combo.indices.push(runs[x-sets.length][y]);
            }
        }
        combo.numOfMatched += combo.indices.length;
        if(x+1 < sets.length + runs.length){
            //check for matching indices

            //if group length is > 3 then ignore that many matching indices
        }
        
        determineScore(combo);
        combos.push(combo);
        
    }


    return true;
}

function determineScore(combo){
    let score = 0;
    let inverseIndices = [];
    //Finding inverse indices
    for(let b=0; b<interactingPlayer.hand.length; b++){
        let hasIndex = false;
        for(let a=0; a<combo.indices.length; a++){
            if(combo.indices[a] == b){
                hasIndex = true;
            }
        }
        if(hasIndex == false){
            inverseIndices.push(b);
        }
    }

    console.log(combo.indices);
    console.log(inverseIndices);

    for(let x=0; x<inverseIndices.length; x++){
        if(interactingPlayer.hand[combo.indices[x]].rank == 'Joker' || interactingPlayer.hand[combo.indices[x]].rank == round){
            score += 20;
        }
        else if(interactingPlayer.hand[combo.indices[x]].rank < 10){
            score += 5;
        }
        else if(interactingPlayer.hand[combo.indices[x]].rank == 14){
            score += 15;
        }
        else if(interactingPlayer.hand[combo.indices[x]].rank >= 10){
            score += 10;
        }
    }
    combo.points = score;
    console.log(score);
}

function endRound(){
    console.log("round has ended");
    //update scores
    playersList.innerHTML = "";
    for(let x=0; x<numOfPlayers; x++){
        if(playerWhoLayedDown.name == players[x].name){
            players[x].score += 0;
        }
        else{
            //change to give appropriate scores...***************************
            players[x].score += 10;
        }
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerHTML = (x + 1) + ". " + players[x].name;
        //li.style.textAlign = "left";
        tr.appendChild(td);
        let td2 = document.createElement("td");
        td2.innerHTML = players[x].score + "pts";
        tr.appendChild(td2);
        playersList.appendChild(tr);

        let tdScore = document.createElement("td");
        tdScore.innerHTML = players[x].score;
        document.getElementById("round"+round).appendChild(tdScore);
    }

    playerHasLayedDown = false;

    //check for end of game
    if(round == 14){
        endGame();
    }//start next round
    else{
        round++;
        //clear player hand and put back in deck and shuffle
        for(let x=0; x < numOfPlayers; x++){
            for(let y=0; y<round-1; y++){
                deck.cards.push(players[x].hand.pop());
            }
        }
        while(discard.length > 0){
            console.log("in before");
            deck.cards.push(discard.pop());
        }
        console.log(deck);
        deck.shuffle();
        scoreBoardTable.removeAttribute("hidden");
        playGame();
    }
}

function endGame(){
    console.log("Game Over");
    //display winner and scores
    deckDiv.hidden = "true";
    discardDiv.hidden = "true";
    playersDiv.hidden = "true";
    handDiv.hidden = "true";
    scoreBoardTable.removeAttribute("hidden");

    let winner = players[0];
    for(let x=1; x<numOfPlayers; x++){
        if(players[x].score < winner.score){
            winner = players[x];
        }
    }
    infoDiv.innerHTML = winner.name + " Wins! Congrats!"

    //show play again option
    let sS= document.getElementById("scoreSubmit")
    sS.value = "Play Again?";
    sS.addEventListener("click", function(){
        infoDiv.innerHTML = " ";
        sS.value = "Continue Playing";
        startDiv.classList.add("start");
        startDiv.fontSize = "3em";
        startDiv.innerHTML = '<div id="startButton">START</div>';
        loadedHandler();
    })
}