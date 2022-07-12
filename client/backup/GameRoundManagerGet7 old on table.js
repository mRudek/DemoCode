import { LobbyDataGet7 } from './LobbyDataGet7.js';
import { PointRules } from './PointRules.js';

class GameRoundManagerGet7{
    constructor(a){
        this.resetAll(a);
    }


    evaluate(dataPacket,lobbyData){
        this.lobbyData = lobbyData; //brauch ich das wohl net
        switch (dataPacket.command){
 //-----Round commands
            case 'startRound':
                this.startRound(dataPacket,lobbyData);
                break;        
            case 'evalPlayerTurn':
                if(this.p1Ready == true || this.p2Ready == true){
                    this.evalPlayerTurn(dataPacket,lobbyData);
                }
                break;                
            default:
                break;                
        }
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
            setTimeout(() =>{
                dataPacket.io.emit('serverAnswer', lobbyData);
            }, this.updateIntervall);
        } else {
            this.distributeCards();
            lobbyData.distributedCards = this.distributedCards;
            setTimeout(() =>{
                dataPacket.io.emit('serverAnswer', lobbyData);
            }, this.updateIntervall);
        }
    }

    distributeCards(){
        this.cardDeck = this.shuffle(this.cardDeck);
        for(let i = 0; i < 10; i++){
            this.distributedCards.p1.handCards.push(this.cardDeck.pop()); //P1 handkarten
            this.distributedCards.p2.handCards.push(this.cardDeck.pop()); //P2 handkarten
        }
        for(let i = 0; i < 8; i++){
            this.distributedCards.cardsOnTable.push(this.cardDeck.pop())
        }

        for(let i = 0; i < this.distributedCards.cardsOnTable.length; i++){
            let ServerCardGroup = this.rules.checkGroup(this.distributedCards.cardsOnTable[i]);
            let TableCardGroup = -1
            for(let TableGroup = 1; TableGroup < 13; TableGroup++){
                let glength = this.cardGroupOnTable_X[TableGroup].array.length;
              if(glength> 0){
                let k = this.cardGroupOnTable_X[TableGroup].array[0];
                TableCardGroup = this.rules.checkGroup(k);
              }
              if(glength == 0){ //wenn leer, dann legen
                    this.cardGroupOnTable_X[TableGroup].array.push(this.distributedCards.cardsOnTable[i]);
                break;
              } else if(TableCardGroup == ServerCardGroup){ //nicht leer: vgl gruppe Karte tisch mit gruppe Karte Server
                    this.cardGroupOnTable_X[TableGroup].array.push(this.distributedCards.cardsOnTable[i]);
                break;
              }
            }
          }
        this.distributedCards.cardGroupOnTable_X = this.cardGroupOnTable_X;
        this.distributedCards.cardStack = this.cardDeck; //rest uaf Kartendeck
    }

    evalPlayerTurn(dataPacket,lobbyData){
        let tmpHandCardStack = [];
        let tmpTableCardStack = [];
        let tmpStorrage = [];        
        // let tmpChosenHandCard = -10;
        let pointForCard = false;
        // console.log("chosen Card " + dataPacket.chosenCardOne)
        let tmpPlayerCards = [];
        let tmpCardGroupOnTable_X = this.cardGroupOnTable_X;
        let tmpChosenHandCard = dataPacket.chosenCardOne;
        let dump = [];
        let cpu = false;
        for(let g = 0 ; g < 2; g++){
            //speichere handkarten vom Spieler
            //P1
            if(cpu == true && lobbyData.yourPlayer == "P1" && this.playerTurn == 1){ 
                tmpChosenHandCard = this.distributedCards.cardStack.pop();
            } else if(lobbyData.yourPlayer == "P1" && this.playerTurn == 1){
                tmpPlayerCards = this.distributedCards.p1;
            }
            //P2
            if(cpu == true && lobbyData.yourPlayer == "P2" && this.playerTurn == 2){
                tmpChosenHandCard = this.distributedCards.cardStack.pop();
            }else if(lobbyData.yourPlayer == "P2" && this.playerTurn == 2){
                tmpPlayerCards = this.distributedCards.p2;
            }
            //---Auswertung nur wenn Spieler dran ist----
            //-------------------------------------------
            let tmpName = "P" + this.playerTurn;
            if(lobbyData.yourPlayer == tmpName){
                //----entferne Karte aus Hand, wenn nicht cpu
                //...................................
                if(cpu == false){
                    let anzahlHandKarten = tmpPlayerCards.handCards.length;
                    dump = [];
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
                }
                //----suche Kartengruppe
                //...................................
                let xGroupFound = -10;
                for(let i = 1; i <= 12; i++){ //fuer jede Feldgruppe 1 bis 12
                    let leng = tmpCardGroupOnTable_X[i].array.length;
                    if(leng> 0){
                        let groupDeck = this.rules.checkGroup(parseInt(tmpCardGroupOnTable_X[i].array[0]));
                        let groupChoosen = this.rules.checkGroup(parseInt(tmpChosenHandCard));
                        if(groupDeck== groupChoosen){ //gruppe gefunden
                            xGroupFound = i;
                        }
                    }
                }
                //gruppe gefunden => verteile Karten in Ablagen und leere
                if(xGroupFound > 0){
                    let xlength = tmpCardGroupOnTable_X[xGroupFound].array.length + 1;
                    //Feldkarten ablegen
                    for(let i = 1; i < xlength; i++){
                        //Feldkarte holen
                        let tableCard = tmpCardGroupOnTable_X[xGroupFound].array.pop();
                        //Feldkarte bestimmen und ablegen
                        let typeTableCard = this.rules.checkCardType(tableCard);
                        if(typeTableCard == "hero"){
                            tmpPlayerCards.cardStackHeroes.push(tableCard);
                        } else if(typeTableCard == "officer"){
                            tmpPlayerCards.cardStackOfficers.push(tableCard);
                        } else if(typeTableCard == "king"){
                            tmpPlayerCards.cardStackKings.push(tableCard);
                        } else if(typeTableCard == "soldier"){
                            tmpPlayerCards.cardStackSoldiers.push(tableCard);
                        }
                    }
                    let typeTableCard = this.rules.checkCardType(tmpChosenHandCard);
                    if(typeTableCard == "hero"){
                        tmpPlayerCards.cardStackHeroes.push(tmpChosenHandCard);
                    } else if(typeTableCard == "officer"){
                        tmpPlayerCards.cardStackOfficers.push(tmpChosenHandCard);
                    } else if(typeTableCard == "king"){
                        tmpPlayerCards.cardStackKings.push(tmpChosenHandCard);
                    } else if(typeTableCard == "soldier"){
                        tmpPlayerCards.cardStackSoldiers.push(tmpChosenHandCard);
                    }
                } else {
                    //keine Gruppe => lege Karte aufs Spielfeld
                    for(let i = 1; i <= 12; i++){ //fuer jede Feldgruppe 1 bis 12
                        let leng = tmpCardGroupOnTable_X[i].array.length;
                        if(leng == 0){
                            tmpCardGroupOnTable_X[i].array.push(tmpChosenHandCard);
                            break;
                        }
                    }
                }
            }
            cpu = true;
        }
        //----------------
        //for schleife ENDE
        let chack = tmpCardGroupOnTable_X;
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
        // let pointsP1 = 0;
        // let pointsP2 = 0;
        let pointsP1 = this.rules.getpoints(this.distributedCards.p1);
        let pointsP2 = this.rules.getpoints(this.distributedCards.p2);
        lobbyData.p1Points = pointsP1;
        lobbyData.p2Points = pointsP2;
        lobbyData.chosenCardOne = dataPacket.chosenCardOne;
        if(pointsP1 > 5){
            lobbyData.command = "p1Wins";
            this.p1Ready = false;
            this.p2Ready = false;
            setTimeout(() =>{
                this.resetAll();
            }, 200);
        }else if(pointsP2 > 5){
            lobbyData.command = "p2Wins";
            this.p1Ready = false;
            this.p2Ready = false;
            setTimeout(() =>{
                this.resetAll();
            }, 200);
        } else if(lobbyData.distributedCards.p1.handCards.length == 0 && lobbyData.distributedCards.p2.handCards.length == 0){
            lobbyData.command = "remis";
            this.p1Ready = false;
            this.p2Ready = false;
            setTimeout(() =>{
                this.resetAll(this.lobid);
            }, 200);
        }
        setTimeout(() =>{
            dataPacket.io.emit('serverAnswer', lobbyData);
        }, 100);
    }

    resetAll(a){
        this.lobid = a;
        this.lobbyData = new LobbyDataGet7(a); //brauch ich das wohl net
        this.rules = new PointRules();
        this.updateIntervall = 400;
        this.p1Ready = false;
        this.p2Ready = false;
        this.cardDeck =[];
        this.maxCards = 50;
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