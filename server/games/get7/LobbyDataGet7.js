class LobbyDataGet7 {
    constructor(lobidA) {
        // this.sender = new Sender();
        this.lobid = lobidA;
        this.gameRunning = 0;
        this.activeP1 = 0;
        this.activeP2 = 0;
        this.lobbyData = {
            kiGame: false,
            'command':'',
            p1Points: 0,
            p2Points: 0,
            points:{
                pointsWinCondition: 5, 
                p1:{
                    heros:0,
                    officers:0,
                    kings:0,
                    soldiers:0,
                    total:0
                },
                p1:{
                    heros:0,
                    officers:0,
                    kings:0,
                    soldiers:0,
                    total:0
                }
            },
            'serverAnwser': "serverAnswer",
            'lobid': this.lobid,
            'playerArrayId': -12,
            'yourPlayer':"",
            'activeP1': this.activeP1,
            'activeP2': this.activeP2,
            'playerTurn': 1,
            'playerWon': -1,
            'cardDeck': [],
            'maxCards': 41,
            'chosenCardOne': 555,
            distributedCards: {
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
                // this.cardGroupOnTable_X= [
                //     {group:0, array:[]},
                //     {group:1, array:[]},
                //     {group:2, array:[]},
                //     {group:3, array:[]},
                //     {group:4, array:[]},
                //     {group:5, array:[]},
                //     {group:6, array:[]},
                //     {group:7, array:[]},
                //     {group:8, array:[]},
                //     {group:9, array:[]},
                //     {group:10, array:[]},
                //     {group:11, array:[]},
                //     {group:12, array:[]},
                //   ]
            }
        }
    }
}

export {LobbyDataGet7};