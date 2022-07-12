import { LobbyDataGet7 } from './LobbyDataGet7.js';
import { PointRules } from './PointRules.js';

class GameRoundManagerGet7{
    constructor(a){
        this.resetAll(a);
        this.lobbyData = new LobbyDataGet7(a); //brauch ich das wohl net
        this.rules = new PointRules();
        this.serverIo;
    }

    evaluate(dataPacket,lobbyData){
        this.serverIo = dataPacket.io;
        dataPacket.io = "";
        this.lobbyData = lobbyData; //brauch ich das wohl net
        switch (dataPacket.command){
 //-----Round commands
            case 'startRound':
                this.startRound(dataPacket,lobbyData);
                break;
            case 'startRoundKI':
                lobbyData.yourPlayer = "P1";
                lobbyData.yourPlayer = "P2";
                this.startRound(dataPacket,lobbyData);
                break;   
            case 'evalPlayerTurn':
                if(this.p1Ready == true || this.p2Ready == true){
                    this.evalPlayerTurn(dataPacket,lobbyData);
                }
                break;    
            case 'wolfsoldier':
                this.makeWulfSoldier(dataPacket,lobbyData);
                break;
            case 'getWin':
                this.getWin(dataPacket,lobbyData);
                break;
            case 'wantAttackPlayer':
                lobbyData.command = 'evalPlayerTurn';
                // this.evalPlayerTurn(dataPacket,lobbyData);
                this.serverIo.emit('serverAnswer', lobbyData);
                break;
            default:
                break;                
        }
    }

    makeWulfSoldier(dataPacket,lobbyData){
        //wulf entfernen
        let tmpPlayerCards = [];
        let tmpCardGroupOnTable_X = this.cardGroupOnTable_X;
        let tmpChosenHandCard = [];
        let groupChosenHandCard = -1;
        let tmpNextDeckCard = [];
        let groupNextDeckCard = -1;
        //get player cards, who is on turn
        tmpPlayerCards = this.getCardsOfPlayer(lobbyData.yourPlayer);
        //wulf zu soldier machen
        let lenOffice = tmpPlayerCards.cardStackOfficers.length;
        let tmpOfficer = [];
        for(let i = 0; i < lenOffice; i++){
            let tmpCard = tmpPlayerCards.cardStackOfficers.pop();
            if (tmpCard == 33){
                tmpPlayerCards.cardStackSoldiers.push(tmpCard);
            } else {
                tmpOfficer.push(tmpCard);
            }
        }
        tmpPlayerCards.cardStackOfficers = tmpOfficer;
        //alles ins prod rein
        //----------------------
        if(lobbyData.yourPlayer == "P1" && this.playerTurn == 1){
            this.distributedCards.p1 = tmpPlayerCards;
            this.playerTurn = 1; //Achtung...spieler immer noch dran
        }
        if(lobbyData.yourPlayer == "P2" && this.playerTurn == 2){
            this.distributedCards.p2 = tmpPlayerCards;
            this.playerTurn = 2; //Achtung...spieler immer noch dran
        }
        this.cardGroupOnTable_X = tmpCardGroupOnTable_X;
        //pack data for client +playerpoints
        //-----------------------
        lobbyData.playerTurn = this.playerTurn;
        lobbyData.distributedCards = this.distributedCards;
        let pointsP1 = this.rules.getpoints(this.distributedCards.p1);
        let pointsP2 = this.rules.getpoints(this.distributedCards.p2);
        lobbyData.p1Points = pointsP1;
        lobbyData.p2Points = pointsP2;
        //points start
        lobbyData.points.p1 = this.rules.getpointsLobbyData(this.distributedCards.p1);
        lobbyData.points.p2 = this.rules.getpointsLobbyData(this.distributedCards.p2);
        //points end
        lobbyData.chosenCardOne = dataPacket.chosenCardOne;
        if(pointsP1 >= 5){
            lobbyData.command = "p1Wins";
            this.p1Ready = false;
            this.p2Ready = false;
            this.resetAll(this.lobid);
        }else if(pointsP2 >= 5){
            lobbyData.command = "p2Wins";
            this.p1Ready = false;
            this.p2Ready = false;
            this.resetAll(this.lobid);
        } else if(lobbyData.distributedCards.p1.handCards.length == 0 && lobbyData.distributedCards.p2.handCards.length == 0){
            lobbyData.command = "remis";
            this.p1Ready = false;
            this.p2Ready = false;
            this.resetAll(this.lobid);
        }
        this.serverIo.emit('serverAnswer', lobbyData);
    }


    startRound(dataPacket,lobbyData){
        if(lobbyData.yourPlayer == "P1"){
            this.p1Ready = true;
        }
        if(lobbyData.yourPlayer == "P2"){
            this.p2Ready = true;
        }
        if(this.p1Ready == false || this.p2Ready == false){
            lobbyData.command = "waitForPlayer";
            this.serverIo.emit('serverAnswer', lobbyData);
        } else {
            if(this.roundStarted == false){
                this.distributeCards();
                this.roundStarted = true;
            }
            lobbyData.distributedCards = this.distributedCards;
            this.serverIo.emit('serverAnswer', lobbyData);
        }
    }

    startRoundKI(dataPacket,lobbyData){
        if(this.roundStarted == false){
            this.distributeCards();
            this.roundStarted = true;
        }
        lobbyData.distributedCards = this.distributedCards;
        this.serverIo.emit('serverAnswer', lobbyData);
    }

    distributeCards(){
        this.cardDeck = this.shuffle(this.cardDeck);
        for(let i = 0; i < 8; i++){
            this.distributedCards.cardsOnTable.push(this.cardDeck.pop())
        }
        for(let i = 0; i < 10; i++){
            this.distributedCards.p1.handCards.push(this.cardDeck.pop()); //P1 handkarten
            this.distributedCards.p2.handCards.push(this.cardDeck.pop()); //P2 handkarten
        }
        for(let i = 0; i < this.distributedCards.cardsOnTable.length; i++){ //Gruppe = Positionsgruppe auf Tisch
            let ServerCardGroup = this.rules.checkGroup(this.distributedCards.cardsOnTable[i]);
            this.cardGroupOnTable_X[ServerCardGroup].array.push(this.distributedCards.cardsOnTable[i]);
          }
        this.distributedCards.cardGroupOnTable_X = this.cardGroupOnTable_X;
        this.distributedCards.cardStack = this.cardDeck; //rest uaf Kartendeck
        this.distributedCards.p1.handCards = this.distributedCards.p1.handCards.sort(function(a, b){return b - a});
        this.distributedCards.p2.handCards = this.distributedCards.p2.handCards.sort(function(a, b){return b - a});
    }

    evalPlayerTurn(dataPacket,lobbyData){
        // console.log("chosen Card " + dataPacket.chosenCardOne)
        let tmp1AttackNo = this.p1AttackNo;
        let tmpPlayerCards = [];
        let tmpCardGroupOnTable_X = this.cardGroupOnTable_X;
        let tmpChosenHandCard = [];
        let groupChosenHandCard = -1;
        let tmpNextDeckCard = [];
        let groupNextDeckCard = -1;
        //get player cards, who is on turn
        tmpPlayerCards = this.getCardsOfPlayer(lobbyData.yourPlayer);
        //---Auswertung nur wenn Spieler dran ist----
        //tmp Karten zu Auswertung auswählen und ablegen: 1) Handkarte Spieler 2) Oberste Karte vom KartenDeck
        //-------------------------------------------
        tmpChosenHandCard = dataPacket.chosenCardOne;
        tmpPlayerCards = this.removeCardFromPlayerHand(tmpPlayerCards, tmpChosenHandCard);
        tmpNextDeckCard = this.distributedCards.cardStack.pop();
        //Kartengruppe
        //-------------------------------------------
        groupChosenHandCard = this.rules.checkGroup(parseInt(tmpChosenHandCard));
        groupNextDeckCard = this.rules.checkGroup(parseInt(tmpNextDeckCard));
        //wenns joker war noch ne Karte ziehen
        try {
            if(groupChosenHandCard == 13){
                tmpPlayerCards.cardStackSoldiers.push(tmpChosenHandCard);
                tmpChosenHandCard = this.distributedCards.cardStack.pop();
            }
            if(groupNextDeckCard == 13){
                tmpNextDeckCard = this.distributedCards.cardStack.pop();
                groupNextDeckCard = this.rules.checkGroup(parseInt(tmpNextDeckCard));
            }
        } catch (error) {
            console.log(error);
        }
        //Karten auf Tisch ablegen = einfach nur zur Kartengruppe pushen
        try {
            tmpCardGroupOnTable_X[groupChosenHandCard].array.push(tmpChosenHandCard);
            tmpCardGroupOnTable_X[groupNextDeckCard].array.push(tmpNextDeckCard);
        } catch (error) {
            console.log(error);
        }
        //---Karten dem Spieler geben
        //wenn eine Gruppe 2 oder 4 Karten hat, dann bekommt der Spieler die Karten
        //-------------------------------------------
        let xlength = -1;
        //Alle Karten der Handgruppe
        try {
            xlength = tmpCardGroupOnTable_X[groupChosenHandCard].array.length;
            if(xlength == 2 || xlength == 4){
                tmpPlayerCards = this.giveCardsToPlayer(groupChosenHandCard, tmpPlayerCards, tmpCardGroupOnTable_X);
            }
            //Alle Karten der NextDeck Gruppe
            xlength = tmpCardGroupOnTable_X[groupNextDeckCard].array.length;
            if(xlength == 2 || xlength == 4){
                tmpPlayerCards = this.giveCardsToPlayer(groupNextDeckCard, tmpPlayerCards, tmpCardGroupOnTable_X);
            }
        } catch (error) {
            console.log(error);
        }
        //alles ins prod rein
        //----------------------
        if(lobbyData.yourPlayer == "P1" && this.playerTurn == 1){
            this.distributedCards.p1 = tmpPlayerCards;
            this.playerTurn = 2;
        }
        if(lobbyData.yourPlayer == "P2" && this.playerTurn == 2){
            this.distributedCards.p2 = tmpPlayerCards;
            this.playerTurn = 1;
        }
        this.cardGroupOnTable_X = tmpCardGroupOnTable_X;
        //pack data for client +playerpoints
        //-----------------------
        lobbyData.playerTurn = this.playerTurn;
        lobbyData.distributedCards = this.distributedCards;
        let pointsP1 = this.rules.getpoints(this.distributedCards.p1);
        let pointsP2 = this.rules.getpoints(this.distributedCards.p2);
        lobbyData.p1Points = pointsP1;
        lobbyData.p2Points = pointsP2;
        //points start
        lobbyData.points.p1 = this.rules.getpointsLobbyData(this.distributedCards.p1);
        lobbyData.points.p2 = this.rules.getpointsLobbyData(this.distributedCards.p2);
        //points end
        lobbyData.chosenCardOne = dataPacket.chosenCardOne;
        if(pointsP1 >= 0 && lobbyData.playerTurn == 1){
            lobbyData.command = "p1Attack";
            lobbyData.playerTurn = 1;
        }else if(pointsP2 >= 5){
            lobbyData.command = "p2Wins";
            this.p1Ready = false;
            this.p2Ready = false;
            this.resetAll(this.lobid);
        } else if(lobbyData.distributedCards.p1.handCards.length == 0 && lobbyData.distributedCards.p2.handCards.length == 0){
            lobbyData.command = "remis";
            this.p1Ready = false;
            this.p2Ready = false;
            this.resetAll(this.lobid);
        }
        this.serverIo.emit('serverAnswer', lobbyData);
    }

    getCardsOfPlayer(yourPlayer){
        //speichere handkarten vom Spieler
        var playerCards = [];
        //P1
        if(yourPlayer == "P1" && this.playerTurn == 1){ //Spielerzug P1 durchführen
            playerCards = this.distributedCards.p1;
        }
        //P2
        if(yourPlayer == "P2" && this.playerTurn == 2){ //Spielerzug P2 durchführen
            playerCards = this.distributedCards.p2;
        }
        return playerCards;
    }

    removeCardFromPlayerHand(tmpPlayerCards, tmpChosenHandCard){
        let anzahlHandKarten = 0;
        try {
            anzahlHandKarten = tmpPlayerCards.handCards.length;
        } catch (error) {
            console.log(error);
        }
        let dump = [];
        for(let i = 0; i < anzahlHandKarten; i++){
            let checkerCardA = tmpPlayerCards.handCards.pop(); 
            let checkerCardB = parseInt(tmpChosenHandCard); 
            if(checkerCardA != checkerCardB){ //alle karten ausser tmpChosenHandCard
                dump.push(checkerCardA);
            } 
        }
        tmpPlayerCards.handCards = dump;
        //nochmal, da verkehrt rum
        anzahlHandKarten = tmpPlayerCards.handCards.length;
        dump = [];
        for(let i = 0; i < anzahlHandKarten; i++){
                let a = tmpPlayerCards.handCards.pop()
                dump.push(a);
        }
        tmpPlayerCards.handCards = dump;
        dump = [];
        return tmpPlayerCards;
    }

    giveCardsToPlayer(group, tmpPlayerCards, tmpCardGroupOnTable_X){
        let xlength = tmpCardGroupOnTable_X[group].array.length;
        while(xlength > 0) {
            //Feldkarte holen
            let tableCard = tmpCardGroupOnTable_X[group].array.pop();
            xlength--;
            //Feldkarte bestimmen und ablegen
            try {
                let typeTableCard = this.rules.checkCardType(tableCard);
                if(typeTableCard == "hero"){
                    tmpPlayerCards.cardStackHeroes.push(tableCard);
                } else if(typeTableCard == "officer"){
                    tmpPlayerCards.cardStackOfficers.push(tableCard);
                } else if(typeTableCard == "king"){
                    tmpPlayerCards.cardStackKings.push(tableCard);
                    tmpPlayerCards.cardStackKings = tmpPlayerCards.cardStackKings.sort(function(a, b){return b - a})
                } else if(typeTableCard == "soldier"){
                    tmpPlayerCards.cardStackSoldiers.push(tableCard);
                }
            } catch (error) {
                console.log(error);
            }
        } 
        return tmpPlayerCards;
    }

    getWin(dataPacket,lobbyData){
        // if(pointsP1 >= 5 && lobbyData.yourPlayer == 1){
        //     lobbyData.command = "p1Wins";
        //     this.p1Ready = false;
        //     this.p2Ready = false;
        //     this.resetAll(this.lobid);
        // }else if(pointsP2 >= 5 && lobbyData.yourPlayer == 2){
        //     lobbyData.command = "p2Wins";
        //     this.p1Ready = false;
        //     this.p2Ready = false;
        //     this.resetAll(this.lobid);
        // } else if(lobbyData.distributedCards.p1.handCards.length == 0 && lobbyData.distributedCards.p2.handCards.length == 0){
        //     lobbyData.command = "remis";
        //     this.p1Ready = false;
        //     this.p2Ready = false;
        //     this.resetAll(this.lobid);
        // }
        lobbyData.command = "p1Wins";
        this.serverIo.emit('serverAnswer', lobbyData);
    }

    resetAll(a){
        this.p1AttackNo = 0;
        this.roundStarted = false;
        this.lobid = a;
        this.updateIntervall = 10;
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

    //----------helper Methods
    shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
}

export {GameRoundManagerGet7};