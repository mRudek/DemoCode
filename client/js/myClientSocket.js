const socket = io();


//NEU
socket.on('jobFinished', dataPacket => {
    console.log("Socket Job finished");

    switch (dataPacket.command){
        case 'createNewPlayer':
            gameManager.playerArrayId = dataPacket.playerArrayId;
            gameManager.playerDataPacket.playerArrayId = dataPacket.playerArrayId;
            gameManager.gui.updateStatusScreenPlayerIds(gameManager.playerDataPacket.playerArrayId, "");
            gameManager.gui.changeStatusText("Join einer Lobby und dann Button: Für Runde Anmelden ");
            break;
        case 'addLobbies':
            select = document.getElementById('joinLobbySelect');
            var opt = document.createElement('option');
            opt.value = dataPacket.lobid;
            opt.innerHTML = dataPacket.lobid;
            select.appendChild( opt );
            break;
        case 'joinLobby':
            gameManager.lobid = dataPacket.lobid;
            appendMessage("Bist Lobby gejoined: " + gameManager.lobid + '  Drücke Button "Für Runde Anmelden"' );
            gameManager.gui.updateStatusScreenPlayerIds(gameManager.playerArrayId, dataPacket.activeP1PlayerArrayId,  dataPacket.activeP2PlayerArrayId, dataPacket.lobid);
            break;
        case 'registerForRound':
            if(gameManager.playerDataPacket.lobid == dataPacket.lobid){ 
                gameManager.gui.updateStatusScreenPlayerIds(gameManager.playerDataPacket.playerArrayId, dataPacket.activeP1PlayerArrayId,  dataPacket.activeP2PlayerArrayId, dataPacket.lobid);
            }
            break;
        case 'roundStart':
            var lobbyData = dataPacket;
            if(gameManager.playerDataPacket.lobid == lobbyData.lobid){
                if(activePlayerInPlayerLobby(gameManager, lobbyData) == true){
                    gameManager.gui.initSurfaces(true);
                    gameManager.testPlaceWater(lobbyData.p1playFieldObjects, lobbyData.p2playFieldObjects);
                    //gameManager.initObjects();
                    gameManager.gui.changeStatusText("Plaziere Schiffe im 2ten unterem Feld");
                    gameManager.playSound(4); //du bist dran
                    gameManager.gamePhase = 'roundStart';
                }
            }
            break;
        case 'placePlayerShip':
            var lobbyData = dataPacket;
            if(gameManager.playerDataPacket.lobid == lobbyData.lobid){
                if(messageOwner(gameManager, lobbyData) == true){
                    gameManager.addPlayerShipOnField(lobbyData.placementArrayNo);
                }
                gameManager.gui.initStatusScreenShipInfo(lobbyData.p1PlacedShips,lobbyData.p2PlacedShips);
            }
            //gameManager.playSound(4); //du bist dran
            break;
        case 'allShipsPlaced':
            var lobbyData = dataPacket;
            gameManager.waitForPhase_2('Warte bis beide Spieler Schiffe plaziert haben!!');
            gameManager.gui.initStatusScreenShipInfo(lobbyData.p1PlacedShips,lobbyData.p2PlacedShips);
            break;                            
        case 'playSound':
            if(gameManager.playerDataPacket.lobid == dataPacket.lobid){
                if(gameManager.playerDataPacket.playerArrayId == dataPacket.activeP1PlayerArrayId || gameManager.playerDataPacket.playerArrayId == dataPacket.activeP2PlayerArrayId){
                    gameManager.playSound(3); //du bist dran
                }
            }
            break;
        case 'gotToPhaseKillShips':
            var lobbyData = dataPacket;
            gameManager.gui.changeStatusText('Spieler ' + lobbyData.playerTurn + ' greife Schiffe in Feld 1 an');
            gameManager.gamePhase = 'playerAttacks'
            break;   
        case 'playerAttacks':
            var lobbyData = dataPacket;
            gameManager.gui.initStatusScreenShipInfo(lobbyData.p1PlacedShips,lobbyData.p2PlacedShips);
            gameManager.gui.changeStatusText('Spieler ' + lobbyData.playerTurn + ' greife Schiffe in Feld 1 an');
            var whichPlayerShot = lobbyData.whichPlayerShot;
            var whichPlayerWasShot = lobbyData.whichPlayerWasShot;
            //welcher Spieler bin ich
            var imPlayerNo = -13;
            if(lobbyData.activeP1PlayerArrayId == gameManager.playerDataPacket.playerArrayId){
                imPlayerNo = 0
            }
            if(lobbyData.activeP2PlayerArrayId == gameManager.playerDataPacket.playerArrayId){
                imPlayerNo = 1
            }
            //wer hat geschossen, ich oder mein Gegener
            // ich bin spieler imPlayerNo   ich 1 schuss, gegner 2 schuss
            if(imPlayerNo == (whichPlayerShot)){
                whichPlayerShot = 0;
                whichPlayerWasShot = 1;
            }
            if(imPlayerNo != (whichPlayerShot)){
                whichPlayerShot = 1;
                whichPlayerWasShot = 0;
            }
            gameManager.checkShipDestroyed(lobbyData.placementArrayNo, lobbyData.destroyedStatus, lobbyData.playerArrayId, whichPlayerWasShot);
            if(lobbyData.playerWon > -1){
                gameManager.playerWon(lobbyData.playerWon, lobbyData.playerArrayId);
            }
            break;  
        case 'bistNetDran':
            var lobbyData = dataPacket;
            gameManager.gui.changeStatusText('Bist net dran du depp');
            break; 
        case 'lobbyReset':
            gameManager.gui.updateStatusScreenPlayerIds(gameManager.playerDataPacket.playerArrayId, dataPacket.activeP1PlayerArrayId,  dataPacket.activeP2PlayerArrayId, dataPacket.lobid);
            break; 
    }
})

//algemeine methoden
    function messageOwner(_gameManager, _lobbyData){
        let value = false
        if(_gameManager.playerDataPacket.playerArrayId == _lobbyData.playerArrayId){
            value = true
        }
        return value
    }
    
    function activePlayerInPlayerLobby(_gameManager, _lobbyData){
        let value = false
        if(_gameManager.playerDataPacket.playerArrayId == _lobbyData.activeP1PlayerArrayId || _gameManager.playerDataPacket.playerArrayId == _lobbyData.activeP2PlayerArrayId){
            value = true
        }
        return value
    }


