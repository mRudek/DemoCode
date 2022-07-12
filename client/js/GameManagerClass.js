/* 
Handles all Game round operations
*/


class GameManger{
    constructor(){
        this.gui = new GUIManger();
        //this.gameRound = new GameRoundManager();
        this.kiPlayer = new KiPlayer();
        this.placedGameRoundObjects_P1;
        this.placedGameRoundObjects_P2;
        this.gamePhase = "FirstGameRound";
        this.playVsKi = 0;
        this.isEnemyHuman = 1;
        this.playerName = "";
        this.playerArrayId = -5;
        this.enemyArrayNo = -5;
        this.lobid = -6;
        this.KiHit = 0;

        this.playerDataPacket = new DataPacket();
    }

    //template
    template(value){
        this.playerDataPacket.lobid = value;
        this.sendToGameRoomManager('joinLobby');
    } 

    //send to
    sendToGameRoomManager(command){
        this.playerDataPacket.command = command;
        socket.emit('gameRoomManager', this.playerDataPacket);
    }

    //First Page LogOn
    createPlayer(_playerName){
        if(this.playerName !== ""){
            this.gui.changeStatusText("You are already created as Player. Press Start new Game!");
        } else {
            this.playerDataPacket.playerName = _playerName;
            this.sendToGameRoomManager('createNewPlayer');
            this.playerName = _playerName;
            this.gui.changeStatusText("press Start New Game Button");
        }
    }

    //LobbyPhase
    joinLobby(value){
        this.playerDataPacket.lobid = value;
        //this.playerDataPacket.playerArrayId = this.playerArrayId;
        this.sendToGameRoomManager('joinLobby');
    }

    registerForRound(value){
        this.sendToGameRoomManager('registerForRound');
    } 

    //Phase 0 Place Ships / initObjects wird mit registerForRound abgedeckt
    initObjects(){
        //places only WaterPoints
        //socket.emit('initObjects-message', this.playerName);
        //this.sendToGameRoomManager('initObjects');
    }

    //-------- Phase 1 this.gamePhase = "PlayerPlacesShips"
    placePlayerShip(mouseClick, canvasField){
        if(this.gamePhase == 'roundStart'){
            let canvasOffset = this.getCanvasKoordinaten(canvasField);
            this.playerDataPacket.mouseX = mouseClick.clientX - canvasOffset.left;
            this.playerDataPacket.mouseY = mouseClick.clientY - canvasOffset.top;
            //console.log('placePlayerShip: ' + this.playerDataPacket.mouseX +' ' + this.playerDataPacket.mouseY)
            this.sendToGameRoomManager('placePlayerShip');
        }
    }
    
    addPlayerShipOnField(_placementArrayNo){
        this.placedGameRoundObjects_P1[_placementArrayNo].src = `assets/shipsink/img/ship.jpg`;
        this.gui.placeObjectOnField(this.placedGameRoundObjects_P1[_placementArrayNo],"canvasEnemyGameField");
        this.gui.placeObjectOnField(this.placedGameRoundObjects_P2[_placementArrayNo],"canvasMyGameField");
        this.playSound(1);
    }

    waitForPhase_2(message){
        this.gui.changeStatusText(message);
        //this.gamePhase = "playerAttacks";
    }

    //---------- Phase 2 this.gamePhase = "PlayerAttacks"
    checkShipHit(mouseClick, canvasField){
        if(this.gamePhase == "playerAttacks"){
            let canvasOffset = this.getCanvasKoordinaten(canvasField);
            this.playerDataPacket.mouseX = mouseClick.clientX - canvasOffset.left;
            this.playerDataPacket.mouseY = mouseClick.clientY - canvasOffset.top;
            //console.log('checkShipHit: ' + this.playerDataPacket.mouseX +' ' + this.playerDataPacket.mouseY)
            this.sendToGameRoomManager('playerAttacks');
        }
    }

    checkShipDestroyed(placementArrayNo, destroyedStatus, whichPlayerShot, whichPlayerWasShot){
        if(destroyedStatus == 1 && whichPlayerShot == this.playerDataPacket.playerArrayId){ //own shot, wenn ich , dann im Feld 1 aktualisieren
            console.log("a")
            this.placedGameRoundObjects_P2[placementArrayNo].src = `assets/shipsink/img/shipKilled.jpg`;
            this.placeObjectsOnField("canvasMyGameField",1);
            //this.updateStatusScreenPlacedShips();
            //this.checkWinCondition();
        } else if(destroyedStatus == 1) { //enemy was shot
            console.log("b")
            this.placedGameRoundObjects_P1[placementArrayNo].src = `assets/shipsink/img/shipKilled.jpg`;
            this.placeObjectsOnField("canvasEnemyGameField",2);
        }

        if(destroyedStatus != 1 && whichPlayerShot == this.playerDataPacket.playerArrayId){ //own shot, wenn ich , dann im Feld 1 aktualisieren
            console.log("c")
            this.placedGameRoundObjects_P2[placementArrayNo].src = `assets/shipsink/img/empty.jpg`;
            this.placeObjectsOnField("canvasMyGameField",1);
            //this.updateStatusScreenPlacedShips();
            //this.checkWinCondition();
        } else if(destroyedStatus != 1 ) {
            console.log("d")
            this.placedGameRoundObjects_P1[placementArrayNo].src = `assets/shipsink/img/empty.jpg`;
            this.placeObjectsOnField("canvasEnemyGameField",2);
        }
        this.playSound(0);

    }

    playerWon(playerWon, whichPlayerShot){
        this.gamePhase = "END";
        //this.initNewGameRound();
        this.gui.changeStatusText("Spieler " + playerWon + " gewinnt");
        if(playerWon == whichPlayerShot){
            this.playSound(2);
        }
        if(playerWon != whichPlayerShot){
            this.playSound(2);
        }

        this.sendToGameRoomManager('playerWon');
    }
    

//-----------weg
    initNewGameRound(){
        if(this.gamePhase === "END"){
            this.initGameAfterRoundEnd();
        } 
        if(this.gamePhase === "FirstGameRound"){
            this.gamePhase = "PlayerPlacesShips";
            this.initGameRoundFirstStart();
        }
    }

    initGameRoundFirstStart(){
        this.gamePhase = "PlayerPlacesShips";
        //console.log("Active players: " + this.gameRound.getPlayerNo());  //DEBUG
        //0 Player = press NewPlayer Button
        if(this.playerName === ""){
            this.gui.initSurfaces(false);
        } else {
            this.gui.initSurfaces(true);
            this.initObjects();
            this.gui.changeStatusText("Plaziere Schiffe im 2ten unterem Feld");
        }
    }

//--------------------
    initGameAfterRoundEnd(){
        this.gamePhase = "PlayerPlacesShips";
        console.log("Active players: " + this.gameRound.getPlayerNo());  //DEBUG
        //0 Player = press NewPlayer Button
            this.gui.initSurfaces(true);
            this.removeShipsFromSurface();
            this.initPlaceKiShips();
            this.initKiAttackSteps();
            this.initObjects();
            //FieldNo: 1 = EnemyShips; 2 = PlayerShips placed 
            this.placeObjects("canvasEnemyGameField",1);
            this.placeObjects("canvasMyGameField",2);
            this.updateStatusScreenPlacedShips();
            this.gui.changeStatusText("Plaziere Schiffe im 2ten unterem Feld");
    }

    removeShipsFromSurface(){
        this.gameRound.resetShipsPlacements();
    }

    updateStatusScreenPlacedShips(){
        let playerships = this.gameRound.getActiveShips(0);
        let enemyShips = this.gameRound.getActiveShips(1);
        this.gui.updateStatusScreenShipInfo(enemyShips,playerships);
    }



    placeObjectsOnField(_canvasFieldName,_PlayerNo){
        if(_PlayerNo == 1){
            for(let num = 0; num < this.placedGameRoundObjects_P2.length; num++){
                this.gui.placeObjectOnField(this.placedGameRoundObjects_P2[num],_canvasFieldName);
            }
        }
        if(_PlayerNo == 2){
            for(let num = 0; num < this.placedGameRoundObjects_P1.length; num++){
                this.gui.placeObjectOnField(this.placedGameRoundObjects_P1[num],_canvasFieldName);
            }
        }
    }

    sayRoundStarted(){
        this.gui.changeStatusText("Runde getartet. Suche die Schiffe");
    }

//--------- sonstige Funktionen
    getCanvasOffset(_canvasID){
        let canvas;
        let offsetYa;
        canvas = document.getElementById(_canvasID);
        offsetYa=canvas.offsetTop;
        return offsetYa;
    }

    getCanvasKoordinaten(_canvasID){
        let canvas;
        let offsetYa;
        canvas = document.getElementById(_canvasID);
        offsetYa=canvas.getBoundingClientRect();
        return offsetYa;
    }

    playSound(id){
        if (id === 0){
            let laserSound = new Audio(`assets/sounds/laser.mp3`);
            laserSound.play();
        }
        if (id === 1){
            let tie = new Audio(`assets/sounds/tiePlacement.mp3`);
            tie.play();
        }
        if (id === 2){
            let win = new Audio(`assets/sounds/winFanFar.mp3`);
            win.play();
        }
        if (id === 3){
            let lose = new Audio(`assets/sounds/p_lose.mp3`);
            lose.play();
        }
        if (id === 4){
            // let lose = new Audio(`assets/sounds/p_start.mp3`);
            // lose.play();
        }
        
    }

    testPlaceWater(p1objects,p2objects){
        this.placedGameRoundObjects_P1 = p1objects;
        this.placedGameRoundObjects_P2 = p2objects;
        for(let i = 0; i < 25; i++){
            this.placedGameRoundObjects_P1[i].src = `assets/shipsink/img/waterpoint.jpg`;
            this.placedGameRoundObjects_P2[i].src = `assets/shipsink/img/waterpoint.jpg`;
        }
        for(let num = 0; num < this.placedGameRoundObjects_P1.length; num++){
            this.gui.placeObjectOnField(this.placedGameRoundObjects_P2[num],"canvasMyGameField");
            this.gui.placeObjectOnField(this.placedGameRoundObjects_P1[num],"canvasEnemyGameField");
        }
    }
}