class CardListGet7{
    constructor() {
        this.cardlocation = "/assets/cards/";
        this.audiolocation = "/assets/cards/";        
        this.cardList = []
        this.CardListGet7 =[];
        this.cardSets =[
            {no: 0, typ: "deckCard", group: 99}, //blue: 2, 6, 10 //red: 14.18.26 //green: 26, 34, 38
            {no: 1, typ: "hero", group: 1}, //blue: 2, 6, 10 //red: 14.18.26 //green: 26, 34, 38
            {no: 2, typ: "king", group: 1},
            {no: 3, typ: "soldier", group: 1},
            {no: 4, typ: "soldier", group: 1},
            {no: 5, typ: "officer", group: 2},
            {no: 6, typ: "king", group: 2},
            {no: 7, typ: "soldier", group: 2},
            {no: 8, typ: "soldier", group: 2},
            {no: 9, typ: "hero", group: 3},
            {no: 10, typ: "king", group: 3},
            {no: 11, typ: "soldier", group: 3},
            {no: 12, typ: "soldier", group: 3},
            {no: 13, typ: "officer", group: 4},
            {no: 14, typ: "king", group: 4},
            {no: 15, typ: "soldier", group: 4},
            {no: 16, typ: "soldier", group: 4},
            {no: 17, typ: "officer", group: 5},
            {no: 18, typ: "king", group: 5},
            {no: 19, typ: "soldier", group: 5},
            {no: 20, typ: "soldier", group: 5},
            {no: 21, typ: "officer", group: 6},
            {no: 22, typ: "king", group: 6},
            {no: 23, typ: "soldier", group: 6},
            {no: 24, typ: "soldier", group: 6},
            {no: 25, typ: "officer", group: 7},
            {no: 26, typ: "king", group: 7},
            {no: 27, typ: "soldier", group: 7},
            {no: 28, typ: "soldier", group: 7},
            {no: 29, typ: "hero", group: 8},
            {no: 30, typ: "officer", group: 8},
            {no: 31, typ: "soldier", group: 8},
            {no: 32, typ: "soldier", group: 8},
            {no: 33, typ: "officer", group: 9},  //wulf
            {no: 34, typ: "king", group: 9},
            {no: 35, typ: "soldier", group: 9},
            {no: 36, typ: "soldier", group: 9},
            {no: 37, typ: "officer", group: 10},
            {no: 38, typ: "king", group: 10},
            {no: 39, typ: "soldier", group: 10},
            {no: 40, typ: "soldier", group: 10},
            {no: 41, typ: "hero", group: 11},
            {no: 42, typ: "soldier", group: 11},
            {no: 43, typ: "soldier", group: 11},
            {no: 44, typ: "soldier", group: 11}, //bonus punkte
            {no: 45, typ: "hero", group: 12},
            {no: 46, typ: "officer", group: 12},
            {no: 47, typ: "king", group: 12},
            {no: 48, typ: "soldier", group: 12}, //bonus punkte
            {no: 49, typ: "soldier", group: 99},
            {no: 50, typ: "soldier", group: 99}
        ];
        this.createCardList();
    }

    createCardList(){
        let cardlocation = "/assets/cards/";
        let audiolocation = "/assets/cards/";
        let maxCards = 51;
        let checkCardNo = 0;
        for(let i = 0; i < maxCards; i++){
            let card;
            checkCardNo = i;
            if(i < 10){
                card = {id: i, src: this.cardlocation + "00" + i +".jpg", audio: new Audio(this.audiolocation + "00" + i +".mp3"), color: "", cardtype: "N", border:"", group: this.cardSets[i].group };
                //get7 cards
                if(this.cardSets[i].typ == "hero"){
                    card.cardtype = "H";
                }
                if(this.cardSets[i].typ == "officer"){
                    card.cardtype = "O";
                    if(checkCardNo == 5 || checkCardNo == 13 || checkCardNo == 46){ card.color = "rgba(218, 187, 12, 0.973)"} //superoffi
                }
                if(this.cardSets[i].typ == "king"){ //blue: 2, 6, 10 //red: 14.18.26 //green: 26, 34, 38
                    card.cardtype = "K";
                                    //Kings
                if(checkCardNo == 2 || checkCardNo == 6 || checkCardNo == 10){ card.color = "rgba(178, 235, 164)"} //green
                }
                if(this.cardSets[i].typ =="soldier"){
                    card.cardtype = "S";
                }
            }
            else if(i < 100){
                card = {id: i, src: this.cardlocation + "0" + i +".jpg", audio: new Audio(this.audiolocation + "0" + i +".mp3"), color: "", cardtype: "N",border:"", group: this.cardSets[i].group   };
                //get7 Cards
                if(this.cardSets[i].typ == "hero" && i <= 50){
                    card.cardtype = "H";
                }
                if(this.cardSets[i].typ == "officer" && i <= 50){
                    card.cardtype = "O";
                    if(checkCardNo == 5 || checkCardNo == 13 || checkCardNo == 46){ card.color = "rgba(218, 187, 12, 0.973)"} //superoffi
                }
                if(this.cardSets[i].typ == "king" && i <= 50){
                    card.cardtype = "K";
                                    //Kings
                if(checkCardNo == 14 || checkCardNo == 18 || checkCardNo == 22){ card.color = "rgba(250, 1, 1)"} //red
                if(checkCardNo == 26 || checkCardNo == 34 || checkCardNo == 38){ card.color = "rgba(6, 192, 248)"} //blue
                }
                if(this.cardSets[i].typ == "soldier" && i <= 50){
                    card.cardtype = "S";
                    if(checkCardNo == 48 || checkCardNo == 44 || checkCardNo == 33){card.cardtype = "S2 ";} //2P Soldier
                    if(checkCardNo == 49 || checkCardNo == 50){card.cardtype = "J";} //3P Joker
                }
            }
            else if(i < 1000){
                card = {id: i, src: this.cardlocation + "" + i +".jpg", audio: new Audio(this.audiolocation + "" + i +".mp3"), styleReact: "border: '4px solid rgb(211, 30, 30)'" };
            }
            //borders
            if(card.id == 1 || card.id == 2 || card.id == 3 || card.id == 4 ){card.border = "10px solid rgb(250, 1, 1)"}
            if(card.id == 5 || card.id == 6 || card.id == 7 || card.id == 8 ){card.border = "10px solid rgba(218, 187, 12, 0.973)"}
            if(card.id == 9 || card.id == 10 || card.id == 11 || card.id == 12 ){card.border = "10px solid rgba(0, 0, 255, 0.692)"}
            if(card.id == 13 || card.id == 14 || card.id == 15 || card.id == 16 ){card.border = "10px solid rgb(123, 32, 41)"}
            if(card.id == 17 || card.id == 18 || card.id == 19 || card.id == 20 ){card.border = "10px solid rgb(222, 111, 1)"}
            if(card.id == 21 || card.id == 22 || card.id == 23 || card.id == 24 ){card.border = "10px solid rgb(21, 132, 1)"}
            if(card.id == 25 || card.id == 26 || card.id == 27 || card.id == 28 ){card.border = "10px solid rgb(46, 122, 1)"}
            if(card.id == 29 || card.id == 30 || card.id == 31 || card.id == 32 ){card.border = "10px solid rgb(86, 175, 1)"}
            if(card.id == 33 || card.id == 34 || card.id == 35 || card.id == 36 ){card.border = "10px solid rgb(94, 1, 1)"}
            if(card.id == 37 || card.id == 38 || card.id == 39 || card.id == 40 ){card.border = "10px solid rgb(111, 63, 1)"}
            if(card.id == 41 || card.id == 42 || card.id == 43 || card.id == 44 ){card.border = "10px solid rgb(180, 53, 1)"}
            if(card.id == 45 || card.id == 46 || card.id == 47 || card.id == 48 ){card.border = "10px solid rgb(45, 34, 1)"}
        
            this.CardListGet7.push(card);
        }
    }

    getCardListGet7(){
        return this.CardListGet7;
    }

    getTopCardImg(){
        let tmp = [];
        tmp.push(this.cardList[0]);
        return tmp[0].src;
    }

    shuffle(){
        var tmp = this.cardList ;
        var help = new Helper ();
        this.cardList = help.shuffle(this.cardList);
    }

    getCard(arrayNo){
        var card = this.cardList[arrayNo];
        return card;
    }

    getCardGroup(arrayNo){
        var group = this.cardSets[arrayNo].group;
        return group;
    }
}
