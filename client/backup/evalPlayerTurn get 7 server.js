    evalPlayerTurn(dataPacket,lobbyData){
        let tmpHandCardStack = [];
        let tmpTableCardStack = [];
        let pointForCard = false;
        console.log("chosen Card " + dataPacket.chosenCardOne)
        //P1
        if(lobbyData.yourPlayer == "P1" && this.playerTurn == 1){
            let anzahlHandKarten = this.distributedCards.p1.handCards.length;
            for(let i = 0; i < anzahlHandKarten; i++){
                tmpHandCardStack.push(this.distributedCards.p1.handCards.pop());
              // console.log("tmp i ist " +tmp[i] + " etarge " + e.target.value);
              //HandKarte gefunden
              if(tmpHandCardStack[i] == dataPacket.chosenCardOne){
                    //HandKarte ablegen
                    let handCard = tmpHandCardStack.pop();
                    //tvgl Handkarte mit feld
                    let groupHandCard = this.rules.checkGroup(parseInt(handCard)); //gruppe Handkarte
                    // console.log("Gruppe handkarte: " + groupHandCard);
                     //vgl gruppe Handkarte mit Tischkarten ------
                    let anzahlFeldKarten = this.distributedCards.cardsOnTable.length;
                    for(let i = 0; i < anzahlFeldKarten; i++){ //fuer jede Feldkarte
                        let tableCard = this.distributedCards.cardsOnTable.pop(); //Feldkarte abheben
                        let groupTableCard = this.rules.checkGroup(parseInt(tableCard)); //gruppe Feldkarte x
                        // console.log("Gruppe Feldkarte: " + groupTableCard);
                        //--------------------------/
                        //wenn Feldkarte und handkarte gleiche Gruppe, dann
                        //1) bestimme Typ Feldkarte und Handkarte
                        //2) lege ins entsprechende Feld / Array
                        //4) lege ins entsprechende Feld / Array
                        //+++++++++++++++++
                        if(groupHandCard == groupTableCard && pointForCard == false){ //Spielerablage, da punkt
                            //1) bestimme Typ Feldkarte
                            let typeTableCard = this.rules.checkCardType(tableCard);
                            let typeHandCard = this.rules.checkCardType(dataPacket.chosenCardOne);
                            //Feldkarte ablegen
                            if(typeTableCard == "hero"){
                                this.distributedCards.p1.cardStackHeroes.push(tableCard);
                            } else if(typeTableCard == "officer"){
                                this.distributedCards.p1.cardStackOfficers.push(tableCard);
                            } else if(typeTableCard == "king"){
                                this.distributedCards.p1.cardStackKings.push(tableCard);
                            } else if(typeTableCard == "soldier"){
                                this.distributedCards.p1.cardStackSoldiers.push(tableCard);
                            }
                            //Handkarte ablegen
                            if(typeHandCard == "hero"){
                                this.distributedCards.p1.cardStackHeroes.push(dataPacket.chosenCardOne);
                            } else if(typeHandCard == "officer"){
                                this.distributedCards.p1.cardStackOfficers.push(dataPacket.chosenCardOne);
                            } else if(typeHandCard == "king"){
                                this.distributedCards.p1.cardStackKings.push(dataPacket.chosenCardOne);
                            } else if(typeHandCard == "soldier"){
                                this.distributedCards.p1.cardStackSoldiers.push(dataPacket.chosenCardOne);
                            }
                            pointForCard = true;
                        } else {
                            tmpTableCardStack.push(tableCard);
                        }
                        //+++++++++++++++++
                    } //break
                    //-------------XXXXXXXXX START NEUE KARTE XXXXXXX----------
                    if(pointForCard == false){ //wenn keine punkte, dann auf tisch legen
                        tmpTableCardStack.push(dataPacket.chosenCardOne);
                        // if(this.distributedCards.cardStack.length > 0){ //tischkarte setzen
                        //     this.distributedCards.cardsOnTable.push(this.distributedCards.cardStack.pop())
                        // }
                    }
                    pointForCard = false;
                    this.distributedCards.cardsOnTable = tmpTableCardStack; //Karten auf Deck neu auflegen
                    tmpTableCardStack = [];
                    let chosenCardCPU = this.distributedCards.cardStack.pop();
                            //HandKarte ablegen
                            handCard = chosenCardCPU;
                            //tvgl Handkarte mit feld
                            groupHandCard = this.rules.checkGroup(parseInt(handCard)); //gruppe Handkarte
                            // console.log("Gruppe handkarte: " + groupHandCard);
                             //vgl gruppe Handkarte mit Tischkarten ------
                            anzahlFeldKarten = this.distributedCards.cardsOnTable.length;
                            for(let i = 0; i < anzahlFeldKarten; i++){ //fuer jede Feldkarte
                                let tableCard = this.distributedCards.cardsOnTable.pop(); //Feldkarte abheben
                                let groupTableCard = this.rules.checkGroup(parseInt(tableCard)); //gruppe Feldkarte x
                                // console.log("Gruppe Feldkarte: " + groupTableCard);
                                //--------------------------/
                                //wenn Feldkarte und handkarte gleiche Gruppe, dann
                                //1) bestimme Typ Feldkarte und Handkarte
                                //2) lege ins entsprechende Feld / Array
                                //4) lege ins entsprechende Feld / Array
                                //+++++++++++++++++
                                if(groupHandCard == groupTableCard && pointForCard == false){ //Spielerablage, da punkt
                                    //1) bestimme Typ Feldkarte
                                    let typeTableCard = this.rules.checkCardType(tableCard);
                                    let typeHandCard = this.rules.checkCardType(chosenCardCPU);
                                    //Feldkarte ablegen
                                    if(typeTableCard == "hero"){
                                        this.distributedCards.p1.cardStackHeroes.push(tableCard);
                                    } else if(typeTableCard == "officer"){
                                        this.distributedCards.p1.cardStackOfficers.push(tableCard);
                                    } else if(typeTableCard == "king"){
                                        this.distributedCards.p1.cardStackKings.push(tableCard);
                                    } else if(typeTableCard == "soldier"){
                                        this.distributedCards.p1.cardStackSoldiers.push(tableCard);
                                    }
                                    //Handkarte ablegen
                                    if(typeHandCard == "hero"){
                                        this.distributedCards.p1.cardStackHeroes.push(chosenCardCPU);
                                    } else if(typeHandCard == "officer"){
                                        this.distributedCards.p1.cardStackOfficers.push(chosenCardCPU);
                                    } else if(typeHandCard == "king"){
                                        this.distributedCards.p1.cardStackKings.push(chosenCardCPU);
                                    } else if(typeHandCard == "soldier"){
                                        this.distributedCards.p1.cardStackSoldiers.push(chosenCardCPU);
                                    }
                                    pointForCard = true;
                                } else {
                                    tmpTableCardStack.push(tableCard);
                                }
                                //+++++++++++++++++
                            } //break
                    if(pointForCard == false){ //wenn keine punkte, dann auf tisch legen
                        tmpTableCardStack.push(chosenCardCPU);
                        // if(this.distributedCards.cardStack.length > 0){ //tischkarte setzen
                        //     this.distributedCards.cardsOnTable.push(this.distributedCards.cardStack.pop())
                        // }
                    }       
                    //-------------XXXXXXXXX ENDE NEUE KARTE XXXXXXX----------
                }
            }//P1 save for Client send
            this.distributedCards.p1.handCards = tmpHandCardStack;
            this.distributedCards.cardsOnTable = tmpTableCardStack;
            // console.log("Tischkarten neu");  console.log(this.distributedCards.cardsOnTable);
            // console.log("hero neu");  console.log(this.distributedCards.p1.cardStackHeroes);
            // console.log("officer neu");  console.log(this.distributedCards.p1.cardStackOfficers);
            // console.log("king neu");  console.log(this.distributedCards.p1.cardStackKings);
            // console.log("soldier neu");  console.log(this.distributedCards.p1.cardStackSoldiers);
            lobbyData.distributedCards = this.distributedCards;
            this.playerTurn = 2;
            // if(this.distributedCards.cardStack.length > 0){ //tischkarte setzen
            //     this.distributedCards.cardsOnTable.push(this.distributedCards.cardStack.pop())
            // }
        } //P1 ENDE
        //P2
        if(lobbyData.yourPlayer == "P2" && this.playerTurn == 2){
            let anzahlHandKarten = this.distributedCards.p2.handCards.length;
            for(let i = 0; i < anzahlHandKarten; i++){
                tmpHandCardStack.push(this.distributedCards.p2.handCards.pop());
              // console.log("tmp i ist " +tmp[i] + " etarge " + e.target.value);
              //HandKarte gefunden
              if(tmpHandCardStack[i] == dataPacket.chosenCardOne){
                    //HandKarte ablegen
                    let handCard = tmpHandCardStack.pop();
                    //tvgl Handkarte mit feld
                    let groupHandCard = this.rules.checkGroup(parseInt(handCard)); //gruppe Handkarte
                    // console.log("Gruppe handkarte: " + groupHandCard);
                     //vgl gruppe Handkarte mit Tischkarten ------
                    let anzahlFeldKarten = this.distributedCards.cardsOnTable.length;
                    for(let i = 0; i < anzahlFeldKarten; i++){ //fuer jede Feldkarte
                        let tableCard = this.distributedCards.cardsOnTable.pop(); //Feldkarte abheben
                        let groupTableCard = this.rules.checkGroup(parseInt(tableCard)); //gruppe Feldkarte x
                        // console.log("Gruppe Feldkarte: " + groupTableCard);
                        //--------------------------/
                        //wenn Feldkarte und handkarte gleiche Gruppe, dann
                        //1) bestimme Typ Feldkarte und Handkarte
                        //2) lege ins entsprechende Feld / Array
                        //4) lege ins entsprechende Feld / Array
                        //+++++++++++++++++
                        if(groupHandCard == groupTableCard && pointForCard == false){ //Spielerablage, da punkt
                            //1) bestimme Typ Feldkarte
                            let typeTableCard = this.rules.checkCardType(tableCard);
                            let typeHandCard = this.rules.checkCardType(dataPacket.chosenCardOne);
                            //Feldkarte ablegen
                            if(typeTableCard == "hero"){
                                this.distributedCards.p2.cardStackHeroes.push(tableCard);
                            } else if(typeTableCard == "officer"){
                                this.distributedCards.p2.cardStackOfficers.push(tableCard);
                            } else if(typeTableCard == "king"){
                                this.distributedCards.p2.cardStackKings.push(tableCard);
                            } else if(typeTableCard == "soldier"){
                                this.distributedCards.p2.cardStackSoldiers.push(tableCard);
                            }
                            //Handkarte ablegen
                            if(typeHandCard == "hero"){
                                this.distributedCards.p2.cardStackHeroes.push(dataPacket.chosenCardOne);
                            } else if(typeHandCard == "officer"){
                                this.distributedCards.p2.cardStackOfficers.push(dataPacket.chosenCardOne);
                            } else if(typeHandCard == "king"){
                                this.distributedCards.p2.cardStackKings.push(dataPacket.chosenCardOne);
                            } else if(typeHandCard == "soldier"){
                                this.distributedCards.p2.cardStackSoldiers.push(dataPacket.chosenCardOne);
                            }
                            pointForCard = true;
                        } else {
                            tmpTableCardStack.push(tableCard);
                        }
                        //+++++++++++++++++
                    } //break
                    //-------------XXXXXXXXX START NEUE KARTE XXXXXXX----------
                    if(pointForCard == false){ //wenn keine punkte, dann auf tisch legen
                        tmpTableCardStack.push(dataPacket.chosenCardOne);
                        // if(this.distributedCards.cardStack.length > 0){ //tischkarte setzen
                        //     this.distributedCards.cardsOnTable.push(this.distributedCards.cardStack.pop())
                        // }
                    }
                    pointForCard = false;
                    this.distributedCards.cardsOnTable = tmpTableCardStack; //Karten auf Deck neu auflegen
                    tmpTableCardStack = [];
                    let chosenCardCPU = this.distributedCards.cardStack.pop();
                            //HandKarte ablegen
                            handCard = chosenCardCPU;
                            //tvgl Handkarte mit feld
                            groupHandCard = this.rules.checkGroup(parseInt(handCard)); //gruppe Handkarte
                            // console.log("Gruppe handkarte: " + groupHandCard);
                             //vgl gruppe Handkarte mit Tischkarten ------
                            anzahlFeldKarten = this.distributedCards.cardsOnTable.length;
                            for(let i = 0; i < anzahlFeldKarten; i++){ //fuer jede Feldkarte
                                let tableCard = this.distributedCards.cardsOnTable.pop(); //Feldkarte abheben
                                let groupTableCard = this.rules.checkGroup(parseInt(tableCard)); //gruppe Feldkarte x
                                // console.log("Gruppe Feldkarte: " + groupTableCard);
                                //--------------------------/
                                //wenn Feldkarte und handkarte gleiche Gruppe, dann
                                //1) bestimme Typ Feldkarte und Handkarte
                                //2) lege ins entsprechende Feld / Array
                                //4) lege ins entsprechende Feld / Array
                                //+++++++++++++++++
                                if(groupHandCard == groupTableCard && pointForCard == false){ //Spielerablage, da punkt
                                    //1) bestimme Typ Feldkarte
                                    let typeTableCard = this.rules.checkCardType(tableCard);
                                    let typeHandCard = this.rules.checkCardType(chosenCardCPU);
                                    //Feldkarte ablegen
                                    if(typeTableCard == "hero"){
                                        this.distributedCards.p2.cardStackHeroes.push(tableCard);
                                    } else if(typeTableCard == "officer"){
                                        this.distributedCards.p2.cardStackOfficers.push(tableCard);
                                    } else if(typeTableCard == "king"){
                                        this.distributedCards.p2.cardStackKings.push(tableCard);
                                    } else if(typeTableCard == "soldier"){
                                        this.distributedCards.p2.cardStackSoldiers.push(tableCard);
                                    }
                                    //Handkarte ablegen
                                    if(typeHandCard == "hero"){
                                        this.distributedCards.p2.cardStackHeroes.push(chosenCardCPU);
                                    } else if(typeHandCard == "officer"){
                                        this.distributedCards.p2.cardStackOfficers.push(chosenCardCPU);
                                    } else if(typeHandCard == "king"){
                                        this.distributedCards.p2.cardStackKings.push(chosenCardCPU);
                                    } else if(typeHandCard == "soldier"){
                                        this.distributedCards.p2.cardStackSoldiers.push(chosenCardCPU);
                                    }
                                    pointForCard = true;
                                } else {
                                    tmpTableCardStack.push(tableCard);
                                }
                                //+++++++++++++++++
                            } //break
                    if(pointForCard == false){ //wenn keine punkte, dann auf tisch legen
                        tmpTableCardStack.push(chosenCardCPU);
                        // if(this.distributedCards.cardStack.length > 0){ //tischkarte setzen
                        //     this.distributedCards.cardsOnTable.push(this.distributedCards.cardStack.pop())
                        // }
                    }       
                    //-------------XXXXXXXXX ENDE NEUE KARTE XXXXXXX----------
                }
            }//P2 save for Client send
            this.distributedCards.p2.handCards = tmpHandCardStack;
            this.distributedCards.cardsOnTable = tmpTableCardStack;
            // console.log("Tischkarten neu");  console.log(this.distributedCards.cardsOnTable);
            // console.log("Soldaten neu");  console.log(this.distributedCards.p2.cardStackSoldiers);
            lobbyData.distributedCards = this.distributedCards;
            this.playerTurn = 1;
            lobbyData.playsound = true;
        }//P2 ENDE
        //pack data for client +playerpoints
        lobbyData.playerTurn = this.playerTurn;
        lobbyData.distributedCards = this.distributedCards;
        let pointsP1 = this.rules.getpoints(this.distributedCards.p1);
        let pointsP2 = this.rules.getpoints(this.distributedCards.p2);
        // let p1points =  lobbyData.distributedCards.p1.cardStackSoldiers.length;
        // let p2points =  lobbyData.distributedCards.p2.cardStackSoldiers.length;
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
                this.resetAll();
            }, 200);
        }
        setTimeout(() =>{
            dataPacket.io.emit('serverAnswer', lobbyData);
        }, 100);
    }
