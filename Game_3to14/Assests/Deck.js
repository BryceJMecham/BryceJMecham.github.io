export class Deck{   //calculating numDecks: Math.ceil(numOfPlayers * 14 / 54);
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