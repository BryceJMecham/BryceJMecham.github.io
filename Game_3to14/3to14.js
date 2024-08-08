/*
 * Author: Bryce Mecham
 *
 * 
 * 
 */

//Variables 
const infoDiv = document.getElementById("infoDiv");
const startDiv = document.getElementById("startDiv");  
const deckDiv = document.getElementById("deckDiv");
const discardDiv = document.getElementById("discardDiv");
const handDiv = document.getElementById("handDiv");
const actionsDiv = document.getElementById("actionsDiv");
const body = document.getElementsByTagName("body")[0];
const playersDiv = document.getElementById("playersDiv");
const scoreList = document.getElementById("scoreList");
const scoreBoardTable = document.getElementById("scoreBoard");
const startButton = document.getElementById("startButton");
const quotesDiv = document.getElementById("quotes");
let numOfPlayers = 1;
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
    START: 1,
    PLAYING: 2,
    NEW_DEAL: 3 //do I need this one?
};

let gameState = gameStates.START;

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
    "Images/Queenie1.HEIC",
    "Images/Queenie2.HEIC",
    "Images/Queenie3.HEIC",
    "Images/Queenie4.JPEG",
    "Images/Queenie5.JPEG",
    "Images/Queenie6.JPEG"
]

class Deck{   //calculating numDecks: Math.ceil(numOfPlayers * 14 / 54);
    constructor(numDecks){
        this.cards = []; //an array of 54 cards (don't forget jokers)
        this.numDecks = numDecks;
    }

    shuffle(){
        for(let x = 0; x < 2; x++){ //too much?
            for(let i = this.cards.length - 1; i > 0; i--){
                let j = Math.floor(Math.random() * (i + 1));
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


//Local Storage Items:
// players
// gameState = localStorage.getItem("gameState");



//TO-DO: Animate card movement
//TO-DO: Add a place like mario card :)

window.addEventListener("DOMContentLoaded", loadedHandler);

function loadedHandler() {       

    //Submit type input listeners
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

    //Form Validation
    let startInputs = startDiv.getElementsByTagName("input");
    const howManyPlayersField = document.getElementsByTagName("tr")[1];
    const startTable = document.getElementsByTagName("table")[0];
    let errorGivenForNames = false;

    deckDiv.style.display = "hidden";
    discardDiv.style.display = "hidden";

    //How Many Players? Field: startInputs[0]
    //Update how many player names are required:
    startInputs[0].addEventListener("change", function(){
        numOfPlayers = startInputs[0].value
        startTable.innerHTML = "<tr><td>How Many Players?</td></tr>";
        startTable.appendChild(howManyPlayersField);
        for(let i=1; i <= numOfPlayers; ++i){
            let newPlayerRow = document.createElement("tr");
            newPlayerRow.innerHTML = "<td>Player " + i +"'s Name:</td></tr><tr><td><input type='text' maxlength='20'></td>"
            startTable.appendChild(newPlayerRow);
        }
        errorGivenForNames = false;
    });


    startButton.addEventListener("click", function(){
        //Loop through inputs to ensure everyone has a name.
        let nameCheck = true;
        for (let i=1; i < startInputs.length; ++i){
            //Name cannot be blank
            if (startInputs[i].value == ""){
                if(nameCheck){
                    console.log("WARN: Name(s) are blank!");
                }
                nameCheck = false;
            }
            //Name must be unique
            for (let j=i+1; j < startInputs.length + 1 - i; ++j){
                if (startInputs[i].value == startInputs[j].value){
                    nameCheck = false;
                    console.log("WARN: Names are not unique!");
                    break;
                }
            }
        }

        if (nameCheck){
            console.log(numOfPlayers);
            //Get the names for each player and add players to players list
            for (let i=1; i < numOfPlayers+1; ++i){
                if(startInputs[i]){
                    let newPlayer = new Player(startInputs[i].value);
                    players.push(newPlayer);

                    //Adding players to scoreboard
                    let td = document.createElement("td");
                    td.innerHTML = players[i-1].name;
                    document.getElementById("scorePlayer").appendChild(td);
                }
            }
            //Display the game board
            gameState = gameStates.PLAYING;
            startDiv.hidden = 'true';
            quotesDiv.hidden = 'true';
            deckDiv.style.display = "inline-block";
            discardDiv.style.display = "inline-block";
            handDiv.removeAttribute("hidden");
            playersDiv.style.display = "inline-block";

            

            //Start the Game
            //Creating the deck and shuffling
            let numOfDecks = Math.ceil(players.length * 14 / 54) + 1;
            deck = new Deck(numOfDecks);
            deck.cards = deck.createNewDeck();
            deck.shuffle();

            //Drawing the deck
            drawDeck();
            
            //Playing the game! 3 to 14 is 12 rounds
            startRound();
            revealingHand();
        }
        else if(!errorGivenForNames){
            let errorDiv = document.createElement("div");
            errorDiv.classList.add('warning');
            errorDiv.innerHTML = "Please enter a unique name for each player"
            startTable.appendChild(errorDiv);
            errorGivenForNames = true;
        }
        
    });

}


function drawCardBack(){
    let newCard = document.createElement("div");
    newCard.classList.add("cardBack");
    return newCard;
}


function startRound(){
    //Dealing cards (changing the top card on the deck background img)
    for(let r=0; r<round; r++){
        for(let p=0; p<players.length; p++){
            players[p].hand.push(deck.cards.pop());
        }
    }

    //Determine who plays first each round
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
    
    infoDiv.innerHTML = "New round! " + interactingPlayer.name + " plays first.";

    discard.push(deck.cards.pop());
}


function revealingHand(){
    
    if(playerHasLayedDown){
        let alert = document.createElement("div");
        alert.innerHTML = "This is your last turn! " + playerWhoLayedDown.name + " has layed down."; 
        alert.classList.add("alert");
        handDiv.appendChild(alert);
    }
    
    let revealHand = document.createElement("input");
    revealHand.type = "submit";
    revealHand.value = "Reveal " + interactingPlayer.name + "'s hand";
    revealHand.classList.add("clickable");
    handDiv.appendChild(revealHand);

    playersDiv.style.marginTop = "50px";

    revealHand.addEventListener("click", function(){
        // Moves the score board button so it's not under the cards
        playersDiv.style.marginTop = "250px";
        
        showHand();

        let deckTopCard = drawDeck();
        deckTopCard.classList.add("clickable");

        //update the infomation board
        infoDiv.style.fontSize = "3em";
        infoDiv.innerHTML = "Draw a card from the deck or discard pile"

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
    newCard.style.margin = "20px 0px 0px -35px";
    newCard.style.backgroundImage = "url(" + deck.cards[deck.cards.length-3].backImg + ")";
    deckDiv.appendChild(newCard);
    
    newCard = drawCardBack();
    newCard.style.margin = "15px 0px 0px -40px";
    newCard.style.backgroundImage = "url(" + deck.cards[deck.cards.length-2].backImg + ")";
    deckDiv.appendChild(newCard);
    
    newCard = drawCardBack();
    newCard.style.margin = "10px 0px 0px -45px";
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
        newCard.style.margin = "20px 0px 20px -20px";
        newCard.id = "topDiscardCard";
        discardDiv.appendChild(newCard);
        return newCard; //to make top card clickable
    }
    else if(discard.length == 2){
        discardDiv.innerHTML = "<h3>Discard Pile</h3>";
        newCard = drawCard(discard[discard.length - 2].suit, discard[discard.length - 2].rank);
        newCard.style.margin = "20px 0px 20px -20px";
        discardDiv.appendChild(newCard);
        
        newCard = drawCard(discard[discard.length - 1].suit, discard[discard.length - 1].rank);
        newCard.style.margin = "15px 0px 20px -25px";
        newCard.id = "topDiscardCard";
        discardDiv.appendChild(newCard);
        return newCard; //to make top card clickable
    }
    else{
        discardDiv.innerHTML = "<h3>Discard Pile</h3>";
        let newCard = drawCard(discard[discard.length - 3].suit, discard[discard.length - 3].rank);
        newCard.style.margin = "20px 0px 20px -20px";
        discardDiv.appendChild(newCard);
        
        newCard = drawCard(discard[discard.length - 2].suit, discard[discard.length - 2].rank);
        newCard.style.margin = "15px 0px 20px -25px";
        discardDiv.appendChild(newCard);
        
        newCard = drawCard(discard[discard.length - 1].suit, discard[discard.length - 1].rank);
        newCard.style.margin = "10px 0px 20px -30px";
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
                        let endRound = window.confirm("Can you lay down?");
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
                        let endRound = window.confirm("Can you lay down?");
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
        topSuitDiv.src = "Images/dimonds.png";
        card.style.backgroundImage = "url(Images/dimonds.png)";
        bottomRankDiv.style.color= "red";
        bottomSuitDiv.src = "Images/dimonds.png";
    }
    else if(suit == 'hearts'){ //suits[0]
        topRankDiv.style.color= "red";
        topSuitDiv.src = "Images/hearts.png";
        card.style.backgroundImage = "url(Images/hearts.png)";
        bottomRankDiv.style.color= "red";
        bottomSuitDiv.src = "Images/hearts.png";
    }
    else if(suit == 'clubs'){ //suits[3]
        topRankDiv.style.color= "black";
        topSuitDiv.src = "Images/clubs.png";
        card.style.backgroundImage = "url(Images/clubs.png)";
        bottomRankDiv.style.color= "black";
        bottomSuitDiv.src = "Images/clubs.png";
    }
    else if(suit == 'spades'){ //suits[2]
        topRankDiv.style.color= "black";
        topSuitDiv.src = "Images/spades.png";
        card.style.backgroundImage = "url(Images/spades.png)";
        bottomRankDiv.style.color= "black";
        bottomSuitDiv.src = "Images/spades.png";
    }

    if(rankSub == 10){
        topRankDiv.style.left = "5px";
        bottomRankDiv.style.left = "117px";
    }
 
    if(suit == 'Joker'){
        bottomRankDiv.style.left = "80px";
        bottomRankDiv.style.top = "165px";
        topSuitDiv.src = "Images/CalciferFan.jpg";
        topSuitDiv.style.height = "120px";
        topSuitDiv.style.width = "100px";
        topSuitDiv.style.left = "25px";
        topSuitDiv.style.top = "40px";

        card.appendChild(topRankDiv);
        card.appendChild(bottomRankDiv);
        card.appendChild(topSuitDiv);
    }
    else{
        card.appendChild(topRankDiv);
        card.appendChild(bottomRankDiv);
        card.appendChild(topSuitDiv);
        card.appendChild(bottomSuitDiv);
    }

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
    if(playsFirst >= players.length){
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
    return true;
    // //copy the players hand
    // // let handDup = [];
    // // for(let x=0; x<interactingPlayer.hand.length;x++){
    // //     handDup.push(interactingPlayer.hand[x]);
    // // }

    // let wildIndices = [];

    // //Checking for sets
    // let sets = [];

    // for(let x=0; x<interactingPlayer.hand.length; x++){
    //     interactingPlayer.hand[x].matched = false;
    //     if(interactingPlayer.hand[x].rank == "Joker" || interactingPlayer.hand[x].rank == round){
    //         interactingPlayer.hand[x].matched = true;
    //         wildIndices.push(x);
    //         if(wildIndices.length == round){
    //             for(let x=0; x<interactingPlayer.hand.length; x++){
    //                 if(interactingPlayer.hand[x].matched == true){
    //                     document.getElementById("card"+x).style.backgroundColor = "lightgreen";
    //                 }
    //             }
    //             return true;
    //         }
    //     }
    // }
    // console.log(wildIndices);

    // for(let card=0; card < interactingPlayer.hand.length-1; card++){
    //     let set = [];
    //     if(interactingPlayer.hand[card].matched == false){
    //         set.push(card);
    //         interactingPlayer.hand[card].matched = true;  //probably don't need this
    //         for(let check=1+card; check < interactingPlayer.hand.length; check++){
    //             if(interactingPlayer.hand[check].matched == false){
    //                 if(interactingPlayer.hand[card].rank == interactingPlayer.hand[check].rank){
    //                     interactingPlayer.hand[check].matched = true;
    //                     set.push(check);
    //                 }
    //             }
    //         }
    //         if(set.length >= 3){
    //             console.log("Set pushed:");
    //             console.log(set);
    //             sets.push(set);
    //         }
    //         else if(set.length >= 3-wildIndices.length){
    //             for(let w=0; set.length < 3; w++){
    //                 set.push(wildIndices[w]);
    //             }
    //             console.log("Set pushed:");
    //             console.log(set);
    //             sets.push(set);
    //         }
    //         else{
    //             for(let x=0; x<set.length; x++){
    //                 interactingPlayer.hand[set[x]].matched = false;
    //             }
    //         }
    //         if(set.length == round){
    //             for(let x=0; x<interactingPlayer.hand.length; x++){
    //                 if(interactingPlayer.hand[x].matched == true){
    //                     document.getElementById("card"+x).style.backgroundColor = "lightgreen";
    //                 }
    //             }
    //             return true;
    //         }
    //     }
//     }

//     //Checking for runs
//     let runs = [];

//     for(let x=0; x<interactingPlayer.hand.length; x++){
//         interactingPlayer.hand[x].matched = false;
//         if(interactingPlayer.hand[x].rank == "Joker" || interactingPlayer.hand[x].rank == round){
//             interactingPlayer.hand[x].matched = true;
//         }
//     }
// //Ace's counting as a 1 or a 14...***********************
//     for(let card=0; card < interactingPlayer.hand.length-1; card++){
//         let run = [];
//         if(interactingPlayer.hand[card].matched == false){
//             run.push(card);
//             interactingPlayer.hand[card].matched = true; 
//             for(let check=1+card; check < interactingPlayer.hand.length; check++){
//                 if(interactingPlayer.hand[card].suit == interactingPlayer.hand[check].suit && interactingPlayer.hand[check].matched == false){
//                     if(interactingPlayer.hand[check].rank == interactingPlayer.hand[card].rank-1){
//                         run.push(check);
//                         interactingPlayer.hand[check].matched = true;
//                         checkSmallerRanks(run, card, interactingPlayer.hand[check].rank, 0, wildIndices);
//                     }
//                     else if(interactingPlayer.hand[check].rank == interactingPlayer.hand[card].rank+1){
//                         run.push(check);
//                         interactingPlayer.hand[check].matched = true;
//                         checkLargerRanks(run, card, interactingPlayer.hand[check].rank, 0, wildIndices);
//                     }
//                     else {
//                         for(let w=1; w<wildIndices.length+1; w++){
//                             if(interactingPlayer.hand[check].rank == interactingPlayer.hand[card].rank+1+w){
//                                 for(let v=0; v<w; v++){
//                                     run.push(wildIndices[v]);
//                                 }
//                                 run.push(check);
//                                 interactingPlayer.hand[check].matched = true;
//                                 checkLargerRanks(run, card, interactingPlayer.hand[check].rank, w, wildIndices);
//                             }
//                             if(interactingPlayer.hand[check].rank == interactingPlayer.hand[card].rank-1-w){
//                                 for(let v=0; v<w; v++){
//                                     run.push(wildIndices[v]);
//                                 }
//                                 run.push(check);
//                                 interactingPlayer.hand[check].matched = true;
//                                 checkSmallerRanks(run, card, interactingPlayer.hand[check].rank, w, wildIndices);
//                             }
//                         }
//                     }
//                 }
//             }
//             if(run.length >= 3){
//                 runs.push(run);
//             }
//             else if(run.length >= 3-wildIndices.length){
//                 for(let w=0; run.length < 3; w++){
//                     run.push(wildIndices[w]);
//                 }
//                 runs.push(run);
//             }
//             else{
//                 for(let x=0; x<run.length; x++){
//                     interactingPlayer.hand[run[x]].matched = false;
//                 }
//             }
//             if(run.length == round){
//                 for(let x=0; x<interactingPlayer.hand.length; x++){
//                     if(interactingPlayer.hand[x].matched == true){
//                         document.getElementById("card"+x).style.backgroundColor = "lightseagreen";
//                     }
//                 }
//                 return true;
//             }
//         }
//     }


//     //If there are more than one runs and/or sets
//     if(sets.length > 1 || runs.length > 1 || (sets.length >= 1 && runs.length >= 1)){
//         return setsCheck(sets, runs, wildIndices);
//     }
//     else{
//         //Determine combo info and determineScore for single groups that can't laydown
//         //******************** */
//         return false;
//     }


//     //some serious algarithms here*******************************

//     //0. in a minimum set of 3
//     //1. in a set of more than 3; after one card is removed it becomes a 0
//     //2. in

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
    // let inverseIndices = [];
    // //Finding inverse indices
    // for(let b=0; b<interactingPlayer.hand.length; b++){
    //     let hasIndex = false;
    //     for(let a=0; a<combo.indices.length; a++){
    //         if(combo.indices[a] == b){
    //             hasIndex = true;
    //         }
    //     }
    //     if(hasIndex == false){
    //         inverseIndices.push(b);
    //     }
    // }

    // console.log(combo.indices);
    // console.log(inverseIndices);

    // for(let x=0; x<inverseIndices.length; x++){
    //     if(interactingPlayer.hand[combo.indices[x]].rank == 'Joker' || interactingPlayer.hand[combo.indices[x]].rank == round){
    //         score += 20;
    //     }
    //     else if(interactingPlayer.hand[combo.indices[x]].rank < 10){
    //         score += 5;
    //     }
    //     else if(interactingPlayer.hand[combo.indices[x]].rank == 14){
    //         score += 15;
    //     }
    //     else if(interactingPlayer.hand[combo.indices[x]].rank >= 10){
    //         score += 10;
    //     }
    // }
    // combo.points = score;
    console.log(score);
}

function endRound(){
    console.log("round has ended");
    //update scores
    console.log(players.length);
    for(let x=0; x<players.length; x++){
        if(playerWhoLayedDown.name == players[x].name){
            players[x].score += 0;
        }
        else{
//TO-DO: change to give appropriate scores...***************************
            players[x].score += 10;
        }


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
        for(let x=0; x < players.length; x++){
            for(let y=0; y<round-1; y++){
                deck.cards.push(players[x].hand.pop());
            }
        }
        while(discard.length > 0){
            deck.cards.push(discard.pop());
        }
        console.log(deck);
        deck.shuffle();
        scoreBoardTable.removeAttribute("hidden");
        startRound();
        revealingHand();
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
    for(let x=1; x<players.length; x++){
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