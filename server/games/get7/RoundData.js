import { LobbyDataGet7 } from './LobbyDataGet7.js';

class RoundData extends LobbyDataGet7{
    constructor(lobidA) {
        super(lobidA);
        this.playerTurn = 1;
        this.attackingPlayer = 0;
        this.roundStarted = false;
        // this.turnLocked = false;
        this.lobid = lobidA;
        this.p1Ready = false;
        this.p2Ready = false;
        this.cardDeck =[];
        this.maxCards = 51;
        this.playerTurn = 1;
        for(let i = 0; i < this.maxCards; i++){ this.cardDeck.push(i)}; //create deck of cards
        this.cardDeck.unshift(); //card zero entfernen
        this.cardGroupOnTable_X= [
            {group:0, array:[]},
            {group:1, array:[]},
            {group:2, array:[]},
            {group:3, array:[]},
            {group:4, array:[]},
            {group:5, array:[]},
            {group:6, array:[]},
            {group:7, array:[]},
            {group:8, array:[]},
            {group:9, array:[]},
            {group:10, array:[]},
            {group:11, array:[]},
            {group:12, array:[]},
            {group:13, array:[]}, //joker = 99
          ],
        this.distributedCards = {
            p1:{
                handCards: [],
                cardStackempty:[],
                cardStackHeroes: [],
                cardStackKings: [],
                cardStackOfficers: [],
                cardStackSoldiers: []
            },
            p2:{
                handCards: [],
                cardStackempty:[],
                cardStackHeroes: [],
                cardStackKings: [],
                cardStackOfficers: [],
                cardStackSoldiers: []
            },
            cardStack: [],
            cardsOnTable: [],
            cardGroupOnTable_X:[]
        }
    }

    changePlayerTurn(lobbyData){
        if(lobbyData.yourPlayer == 1 && this.playerTurn == 1){
            this.playerTurn = 2;
        }
        if(lobbyData.yourPlayer == 2 && this.playerTurn == 2){
            this.playerTurn = 1;
        }
    }

    resetAll(){
        this.playerTurn = 1;
        this.attackingPlayer = 0;
        this.roundStarted = false;
        this.turnLocked = false;
        this.p1Ready = false;
        this.p2Ready = false;
        this.cardDeck =[];
        this.maxCards = 51;
        this.playerTurn = 1;
        for(let i = 0; i < this.maxCards; i++){ this.cardDeck.push(i)}; //create deck of cards
        this.cardDeck.unshift(); //card zero entfernen
        this.cardGroupOnTable_X= [
            {group:0, array:[]},
            {group:1, array:[]},
            {group:2, array:[]},
            {group:3, array:[]},
            {group:4, array:[]},
            {group:5, array:[]},
            {group:6, array:[]},
            {group:7, array:[]},
            {group:8, array:[]},
            {group:9, array:[]},
            {group:10, array:[]},
            {group:11, array:[]},
            {group:12, array:[]},
            {group:13, array:[]}, //joker = 99
          ],
        this.distributedCards = {
            p1:{
                handCards: [],
                cardStackempty:[],
                cardStackHeroes: [],
                cardStackKings: [],
                cardStackOfficers: [],
                cardStackSoldiers: []
            },
            p2:{
                handCards: [],
                cardStackempty:[],
                cardStackHeroes: [],
                cardStackKings: [],
                cardStackOfficers: [],
                cardStackSoldiers: []
            },
            cardStack: [],
            cardsOnTable: [],
            cardGroupOnTable_X:[]
        }
    }
}

export {RoundData};