class PointRules {
    constructor() { //H: -- O: --K: -- S: -- SSuperS: -- SuperOff: --
        this.set1 =[1,2,3,4]; //H: 1 -- O: --K: 2 -- S: 3, 4 -- SSuperS: -- SuperOff: --
        this.set2=[5,6,7,8]; //H: -- O: 1 --K: 2 -- S: 3, 4 -- SSuperS: -- SuperOff: --
        this.set3 =[9,10,11,12]; //H: 1 -- O: --K: 2 -- S: 3, 4 -- SSuperS: -- SuperOff: -- 9 13 46
        this.set4 =[13,14,15,16]; //H: -- O:1 --K:2 -- S:3 4 -- SSuperS: -- SuperOff: --
        this.set5 =[17,18,19,20]; //H: -- O:1 --K:2 -- S:3 4 -- SSuperS: -- SuperOff: --
        this.set6 =[21,22,23,24]; //H: -- O:1 --K:2 -- S:3 4 -- SSuperS: -- SuperOff: --
        this.set7 =[25,26,27,28]; //H: -- O:1 --K:2 -- S:3 4 -- SSuperS: -- SuperOff: --
        this.set8 =[29,30,31,32]; //H:1 -- O:2 --K: -- S:3 4 -- SSuperS: -- SuperOff: --
        this.set9 =[33,34,35,36]; //H: -- O: --K:2 -- S:3 4 -- SSuperS: -- SuperOffWulf:1 --
        this.set10 =[37,38,39,40]; //H: -- O:1 --K:2 -- S:3 4 -- SSuperS: -- SuperOff: --
        this.set11 =[41,42,43,44]; //H:1 -- O: --K: -- S:2 3 -- SSuperS: 4 -- SuperOff: --
        this.set12 =[45,46,47,48]; //H:1 -- O:2 --K:3 -- S: -- SSuperS: 4 -- SuperOff: --
        this.heroes = [1,9,29] //41, 45
        this.officers = [6,14,] //41, 45
        this.kings = [2,6,10,] //41, 45
        this.soldiers = [3,4,7,8,11,12,15,16,19,20,23,24,27,28,31,32,35,36,39,40,42,43,44,48] //41, 45
        //bonuspoints
        this.supersoldier = []
        this.superofficer = []
        this.kingsa = [] //41, 45
        this.kingsb = [] //41, 45
        this.kingsc = [] //41, 45
        this.cardSets =[
            {no: 0, typ: "deckCard", group: 99}, //blue: 2, 6, 10 //red: 14.18.26 //green: 26, 34, 38
            {no: 1, typ: "hero", group: 1},
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
            {no: 33, typ: "officer", group: 9},
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
            {no: 44, typ: "soldier", group: 11},
            {no: 45, typ: "hero", group: 12},
            {no: 46, typ: "officer", group: 12},
            {no: 47, typ: "king", group: 12},
            {no: 48, typ: "soldier", group: 12},
            {no: 49, typ: "soldier", group: 99},
            {no: 50, typ: "soldier", group: 99}
        ]
    }
    //Gruppen:
    //Helden: 5 ----- 1, 3, 8, 11 , 12
    //Office:9 ----- 2, 4 - 10, 12 
    //Könige: 10 ---- 1 - 7, 9, 10, 12
    //--------2 Soldaten, 
    //Wulf: Officer no 9
    //SuperSoldat: 12, 36
    checkPoint(card){
        let t1 = this.checkGroup(card);
        return answer
    }

    checkGroup(g){
        let group = false;
        g = parseInt(g);
        try {
            if(this.set1.includes(g) || this.cardSets[g].group == 99){
                group = 1;
            }
            if(this.set2.includes(g) || this.cardSets[g].group == 99){
                group = 2;
            }
            if(this.set3.includes(g) || this.cardSets[g].group == 99){
                group = 3;
            }
            if(this.set4.includes(g) || this.cardSets[g].group == 99){
                group = 4;
            }
            if(this.set5.includes(g) || this.cardSets[g].group == 99){
                group = 5;
            }
            if(this.set6.includes(g)|| this.cardSets[g].group == 99){
                group = 6;
            }
            if(this.set7.includes(g)|| this.cardSets[g].group == 99){
                group = 7;
            }
            if(this.set8.includes(g)|| this.cardSets[g].group == 99){
                group = 8;
            }
            if(this.set9.includes(g)|| this.cardSets[g].group == 99){
                group = 9 ;
            }
            if(this.set10.includes(g)|| this.cardSets[g].group == 99){
                group = 10 ;
            }
            if(this.set11.includes(g)|| this.cardSets[g].group == 99){
                group = 11 ;
            }
            if(this.set12.includes(g)|| this.cardSets[g].group == 99){
                group = 12 ;
            }
            if(this.cardSets[g].group == 99){
                group = 13 ;
            }
        } catch (error) {
            console.log(error);
        }
        return group
    }

    checkCardType(cardNo){
        return this.cardSets[cardNo].typ;
    }

    // handCards: [],
    // cardStackempty:[],
    // cardStackHeroes: [],
    // cardStackKings: [],
    // cardStackOfficers: [],
    // cardStackSoldiers: []

    getpointsLobbyData(cardStack){
        let points = {
            heros:0,
            officers:0,
            kings:0,
            soldiers:0,
            total:0
        }
        points.heros = this.checkHero(cardStack);
        points.officers = this.checkOfficers(cardStack);
        points.kings = this.checkKings(cardStack);
        points.soldiers = this.ckeckSoldiers(cardStack);
        points.total = this.getpoints(cardStack);
        return points;
    }

    getpoints(cardStack){
        let points = 0;
            //heroes
                points = points + this.checkHero(cardStack);
            //kings
                points = points + this.checkKings(cardStack); //3 K paare = bonuspunkte
            //officers
                points = points + this.checkOfficers(cardStack);          
            //soldiers
                points = points + this.ckeckSoldiers(cardStack);           
        return points;
    }

    //5 heroes--- 5 = 15P --  3 = 3P -- 3 + SuperHero = 4 P --
    checkHero(cardStack){
        let points = 0;
        let givePoints = cardStack.cardStackHeroes.length;
            if(givePoints >2){
                points = cardStack.cardStackHeroes.length;
            }
            //check mit superhero = 44
            // cardStack.cardStackHeroes.forEach(element => {if(element == 44){ points = points -1}});
            //4 Könige = 4 Punkte
            if(cardStack.cardStackHeroes.length == 4){points = 4}
            //check bonuspoint 5 Heroes = 44
            if(cardStack.cardStackHeroes.length == 5){points = points + 15}
        return points
    }

    //ckeck kings 3 x 3 Kings --- 5 K = 1 P -- + Grupper K = 3 P
    checkKings(cardStack){
        let points = 0;
        let superpoints = 0;
            //ab 5 Könige Punkte
            if(cardStack.cardStackKings.length >= 5){
                points = cardStack.cardStackKings.length-4
            }
            //Bonuspunkte bei gleichfarbige Köinge
            //K1
            cardStack.cardStackKings.forEach(element => {
                if(element == 2 || element == 6 || element == 10){
                    superpoints++;
                }
            });
            if(superpoints ==3){
                points = points + 3;
            }
            superpoints =0;
            //K2
            cardStack.cardStackKings.forEach(element => {
                if(element == 14 || element == 18 || element == 22){
                    superpoints++;
                }
            });
            if(superpoints ==3){
                points = points + 3;
            }
            superpoints =0;
            //K3
            cardStack.cardStackKings.forEach(element => {
                if(element == 26 || element == 34|| element == 38){
                    superpoints++;
                }
            });
            if(superpoints ==3){
                points = points + 3;
            }
            superpoints =0;
        return points
    }

    //9 Offices --- 3 GoldOfficer = 5 P --- ab 5 Officers = 1 P ---SuperWulf = 33
    checkOfficers(cardStack){
        let points = 0;
        let superpoints = 0;
        if(cardStack.cardStackOfficers.length >=5){
            points = cardStack.cardStackOfficers.length-4;
            //bonupunkte beis SuperOfficers 9 13 46
            cardStack.cardStackOfficers.forEach(element => {
                if(element == 5 || element == 13 || element == 46){
                    superpoints++;
                }
            });
            if(superpoints ==3){
                points = points + 5;
            }
        }
        return points
    }

    //24 Soldiers
    ckeckSoldiers(cardStack){
        let points = 0;
        points = cardStack.cardStackSoldiers.length-9; 
        //bonuspunkte
        cardStack.cardStackSoldiers.forEach(element => {
            if(element == 48 || element == 44 || element == 33){
                points = points +1;
            }
            if(element == 49 || element == 50 ){
                points = points +1;
            }
        });
        if (points < 1){
            points = 0;
        }
        return points
    }
}

export {PointRules};