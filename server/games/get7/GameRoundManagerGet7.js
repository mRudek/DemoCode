import { RoundData } from './RoundData.js';
import { PointRules } from './PointRules.js';

class GameRoundManagerGet7{
    constructor(a){
        this.localRoundData = new RoundData(a); 
        this.rules = new PointRules();
        this.rejectNewCommands = true;
        this.serverIo;
        this.localRoundData.resetAll(a);
    }

    evaluate(clientDataPacket,serverLobbyData){
        this.serverIo = clientDataPacket.io;
        clientDataPacket.io = "";
        switch (clientDataPacket.command){
 //-----Round commands
            case 'startRound':
                this.startRound(clientDataPacket,serverLobbyData);
                break;
            case 'evalPlayerTurn':
                //human
                if(this.localRoundData.p1Ready == true || this.localRoundData.p2Ready == true || this.rejectNewCommands == false){
                    this.rejectNewCommands = true;
                    this.evalPlayerTurn(clientDataPacket,serverLobbyData);
                }
                break;    
            case 'wolfsoldier':
                if(this.rejectNewCommands == false){
                    this.rejectNewCommands = true;
                    this.makeWulfSoldier(clientDataPacket,serverLobbyData);
                }
                break;
            case 'getWin':
                this.getWin(serverLobbyData);
                break;
            case 'wantAttackPlayer':
                //human
                serverLobbyData.command = 'attackAllowed';
                if (serverLobbyData.yourPlayer == 1) {
                    serverLobbyData.yourPlayer = 2
                    this.localRoundData.playerTurn = 2;
                } else {
                    this.localRoundData.playerTurn = 1;
                }
                serverLobbyData.playerTurn = this.localRoundData.playerTurn;
                this.serverIo.emit('serverAnswer', serverLobbyData);
                break;
            default:
                break;                
        }
    }

    makeWulfSoldier(clientDataPacket,serverLobbyData){
        //wulf entfernen
        let tmpPlayerCards = [];
        let tmpCardGroupOnTable_X = this.localRoundData.cardGroupOnTable_X;
        //get player cards, who is on turn
        tmpPlayerCards = this.getCardsOfPlayer(serverLobbyData.yourPlayer);
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
        //playerturn
        if(serverLobbyData.yourPlayer == 1 && this.localRoundData.playerTurn == 1){
            this.localRoundData.distributedCards.p1 = tmpPlayerCards;
            this.localRoundData.playerTurn = 1; //Achtung...spieler immer noch dran
        }
        if(serverLobbyData.yourPlayer == 2 && this.localRoundData.playerTurn == 2){
            this.localRoundData.distributedCards.p2 = tmpPlayerCards;
            this.localRoundData.playerTurn = 2; //Achtung...spieler immer noch dran
        }
        this.localRoundData.cardGroupOnTable_X = tmpCardGroupOnTable_X;
        //playerpoints
        serverLobbyData.playerTurn = this.localRoundData.playerTurn;
        serverLobbyData = this.calculatePoints(serverLobbyData);
        serverLobbyData.chosenCardOne = clientDataPacket.chosenCardOne;
        //attacks
        serverLobbyData = this.calculateAttacks(serverLobbyData);
        //----send Data
        this.serverIo.emit('serverAnswer', serverLobbyData);
        this.rejectNewCommands = false;
    }


    startRound(clientDataPacket,serverLobbyData){
        this.checkInPlayer(clientDataPacket,serverLobbyData);
        //init game
        if(this.localRoundData.p1Ready == false || this.localRoundData.p2Ready == false){
            serverLobbyData.command = "waitForPlayer";
            this.serverIo.emit('serverAnswer', serverLobbyData);
        } else {
            if(this.localRoundData.roundStarted == false){
                this.distributeCards();
                this.localRoundData.roundStarted = true;
            }
            serverLobbyData.distributedCards = this.localRoundData.distributedCards;
            serverLobbyData.playerTurn = this.localRoundData.playerTurn;
            this.serverIo.emit('serverAnswer', serverLobbyData);
        }
    }

    checkInPlayer(clientDataPacket,serverLobbyData){
        if(serverLobbyData.yourPlayer == 1){
            this.localRoundData.p1Ready = true;
        }
        if(serverLobbyData.yourPlayer == 2){
            this.localRoundData.p2Ready = true;
        }
    }

    distributeCards(){
        this.localRoundData.cardDeck = this.shuffle(this.localRoundData.cardDeck);
        for(let i = 0; i < 8; i++){
            this.localRoundData.distributedCards.cardsOnTable.push(this.localRoundData.cardDeck.pop())
        }
        for(let i = 0; i < 10; i++){
            this.localRoundData.distributedCards.p1.handCards.push(this.localRoundData.cardDeck.pop()); //P1 handkarten
            this.localRoundData.distributedCards.p2.handCards.push(this.localRoundData.cardDeck.pop()); //P2 handkarten
        }
        for(let i = 0; i < this.localRoundData.distributedCards.cardsOnTable.length; i++){ //Gruppe = Positionsgruppe auf Tisch
            let ServerCardGroup = this.rules.checkGroup(this.localRoundData.distributedCards.cardsOnTable[i]);
            this.localRoundData.cardGroupOnTable_X[ServerCardGroup].array.push(this.localRoundData.distributedCards.cardsOnTable[i]);
          }
        this.localRoundData.distributedCards.cardGroupOnTable_X = this.localRoundData.cardGroupOnTable_X;
        this.localRoundData.distributedCards.cardStack = this.localRoundData.cardDeck; //rest uaf Kartendeck
        this.localRoundData.distributedCards.p1.handCards = this.localRoundData.distributedCards.p1.handCards.sort(function(a, b){return b - a});
        this.localRoundData.distributedCards.p2.handCards = this.localRoundData.distributedCards.p2.handCards.sort(function(a, b){return b - a});
    }

    evalPlayerTurn(clientDataPacket,serverLobbyData){
        //play turn
        this.calculatePlayedCards(clientDataPacket,serverLobbyData);
        //points
        serverLobbyData = this.calculatePoints(serverLobbyData);
        serverLobbyData.chosenCardOne = clientDataPacket.chosenCardOne;
        //turnorder
        this.localRoundData.changePlayerTurn(serverLobbyData);
        serverLobbyData.playerTurn = this.localRoundData.playerTurn;
        //attacks
        serverLobbyData = this.calculateAttacks(serverLobbyData);
        //----send Data
        this.serverIo.emit('serverAnswer', serverLobbyData);
        this.rejectNewCommands = false;
    }

    calculatePoints(serverLobbyData){
        serverLobbyData.distributedCards = this.localRoundData.distributedCards;
        let pointsP1 = this.rules.getpoints(this.localRoundData.distributedCards.p1);
        let pointsP2 = this.rules.getpoints(this.localRoundData.distributedCards.p2);
        serverLobbyData.p1Points = pointsP1;
        serverLobbyData.p2Points = pointsP2;
        //points start
        serverLobbyData.points.p1 = this.rules.getpointsLobbyData(this.localRoundData.distributedCards.p1);
        serverLobbyData.points.p2 = this.rules.getpointsLobbyData(this.localRoundData.distributedCards.p2);
        //points end
        return serverLobbyData;
    }

    calculateAttacks(serverLobbyData){
        if(serverLobbyData.playerTurn == 2 && serverLobbyData.p1Points >= serverLobbyData.points.pointsWinCondition && this.localRoundData.attackingPlayer == 0){ //P1 can attack
            this.localRoundData.attackingPlayer = 1;
        }
        if(serverLobbyData.playerTurn == 1 && serverLobbyData.p2Points >= serverLobbyData.points.pointsWinCondition && this.localRoundData.attackingPlayer == 0){ //P2 can attack
            this.localRoundData.attackingPlayer = 2;
        }
        //check for attacks
        if(serverLobbyData.playerTurn == 2 && serverLobbyData.p1Points >= serverLobbyData.points.pointsWinCondition){ //P1 can attack
            serverLobbyData.playerTurn = 1;
            serverLobbyData.command = "attackRequest";
        }else
        if(serverLobbyData.playerTurn == 1 && serverLobbyData.p2Points >= serverLobbyData.points.pointsWinCondition){ //P2 can attack
            serverLobbyData.playerTurn = 2;
            serverLobbyData.command = "attackRequest";
        }
        //check for counterattack
        if(serverLobbyData.playerTurn == 1 && serverLobbyData.p1Points >= serverLobbyData.points.pointsWinCondition && this.localRoundData.attackingPlayer == 2){ //P1 can attack
            serverLobbyData.command = "p1WinsCounter";
        }else
        if(serverLobbyData.playerTurn == 2 && serverLobbyData.p2Points >= serverLobbyData.points.pointsWinCondition && this.localRoundData.attackingPlayer == 1){ //P2 can attack
            serverLobbyData.command = "p2WinsCounter";
        }
        //temp both 0 = remis
        if(serverLobbyData.distributedCards.p1.handCards.length == 0 && serverLobbyData.distributedCards.p2.handCards.length == 0){
            serverLobbyData.command = "remis";
            this.localRoundData.p1Ready = false;
            this.localRoundData.p2Ready = false;
            this.resetAll(this.localRoundData.lobid);
        }
        return serverLobbyData;
    }

    calculatePlayedCards(clientDataPacket,serverLobbyData){
        let tmpPlayerCards = [];
        let tmpCardGroupOnTable_X = this.localRoundData.cardGroupOnTable_X;
        let tmpChosenHandCard = [];
        let groupChosenHandCard = -1;
        let tmpNextDeckCard = [];
        let groupNextDeckCard = -1;
        //get player cards, who is on turn
        tmpPlayerCards = this.getCardsOfPlayer(serverLobbyData.yourPlayer);
        //---Auswertung nur wenn Spieler dran ist----
        //tmp Karten zu Auswertung auswählen und ablegen: 1) Handkarte Spieler 2) Oberste Karte vom KartenDeck
        //-------------------------------------------
        tmpChosenHandCard = clientDataPacket.chosenCardOne;
        tmpPlayerCards = this.removeCardFromPlayerHand(tmpPlayerCards, tmpChosenHandCard);
        tmpNextDeckCard = this.localRoundData.distributedCards.cardStack.pop();
        //Kartengruppe
        //-------------------------------------------
        groupChosenHandCard = this.rules.checkGroup(parseInt(tmpChosenHandCard));
        groupNextDeckCard = this.rules.checkGroup(parseInt(tmpNextDeckCard));
        //wenns joker war noch ne Karte ziehen
        try {
            if(groupChosenHandCard == 13){
                tmpPlayerCards.cardStackSoldiers.push(tmpChosenHandCard);
                tmpChosenHandCard = this.localRoundData.distributedCards.cardStack.pop();
            }
            if(groupNextDeckCard == 13){
                tmpNextDeckCard = this.localRoundData.distributedCards.cardStack.pop();
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
        if(serverLobbyData.yourPlayer == 1 && this.localRoundData.playerTurn == 1){
            this.localRoundData.distributedCards.p1 = tmpPlayerCards;
        }
        if(serverLobbyData.yourPlayer == 2 && this.localRoundData.playerTurn == 2){
            this.localRoundData.distributedCards.p2 = tmpPlayerCards;
        }
        this.localRoundData.cardGroupOnTable_X = tmpCardGroupOnTable_X;
    }

    getCardsOfPlayer(yourPlayer){
        //speichere handkarten vom Spieler
        let playerCards = [];
        //P1
        if(yourPlayer == 1 && this.localRoundData.playerTurn == 1){ //Spielerzug P1 durchführen
            playerCards = this.localRoundData.distributedCards.p1;
        }
        //P2
        if(yourPlayer == 2 && this.localRoundData.playerTurn == 2){ //Spielerzug P2 durchführen
            playerCards = this.localRoundData.distributedCards.p2;
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

    getWin(serverLobbyData){
        switch (serverLobbyData.yourPlayer) {
            case 1:
                serverLobbyData.command = "p1Wins";
                break;
            case 2:
                serverLobbyData.command = "p2Wins";
                break
        }
        this.serverIo.emit('serverAnswer', serverLobbyData);
        this.localRoundData.resetAll();
    }

    resetAll(a){ //muss spter weg
        this.localRoundData.resetAll();
    }

    //----------helper Methods
    shuffle(a) {
        let j, x, i;
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