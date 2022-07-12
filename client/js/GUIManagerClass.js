/* 
Manages GUI
*/

class GUIManger{
    constructor(){
        this.statusScreen = new StatusScreen('canvasStatusScreen');
        this.initStatusScreenShipInfo(0,0);
    }
    initSurfaces(_status){
        if(_status === false){
            this.statusScreen.drawStatusText("Press NewPlayer Button");
        }
        if(_status === true){
            this.initGUI(450,360,'canvasEnemyGameField');
            this.initGUI(450,360,'canvasMyGameField');           
            let backGround = new Image();
            backGround.src = `assets/shipsink/img/water.jpg`;
            this.enemyGameField = new GameField('canvasEnemyGameField', backGround);
            this.myGameField = new GameField('canvasMyGameField', backGround);
        }
    }

    initGUI(width,height, canvasId){
        var canvas = document.getElementById(canvasId);  
        canvas.width = width;
        canvas.height = height;
    }

    initStatusScreenShipInfo(_noEnemyShips, _noPlayerShips){
        let txtEnemyShips = "Enemy Ships left: " + _noEnemyShips;
        let txtPlayerShips = "Player Ships left: " + _noPlayerShips;
        let xpos = 210;
        let ypos = 10;
        this.statusScreen.drawStatusEnemyShips(txtEnemyShips,xpos,ypos);
        this.statusScreen.drawStatusPlayerShipsShips(txtPlayerShips,xpos,ypos);
        xpos = 315;
        ypos = 10;
    }

    updateStatusScreenPlayerIds(playerArrayId, p1Arrayid, p2Arrayid, lobbyid){
        this.statusScreen.drawPlayerArrayId("Deine ID: " + playerArrayId);
        this.statusScreen.drawLobbyId("Lobby ID: " + lobbyid);
        this.statusScreen.drawP1ArrayId("Spieler 1 ID: " + p1Arrayid);
        this.statusScreen.drawP2ArrayId("Spieler 2 ID: " + p2Arrayid);
    }






    updateStatusScreenShipInfo(_noEnemyShips, _noPlayerShips){
        let txtEnemyShips = "Enemy Ships left: " + _noEnemyShips;
        let txtPlayerShips = "Player Ships left: " + _noPlayerShips;
        let xpos = 210;
        let ypos = 10;
        this.statusScreen.drawStatusEnemyShips(txtEnemyShips,xpos,ypos);
        this.statusScreen.drawStatusPlayerShipsShips(txtPlayerShips,xpos,ypos);
    }

    placeObjectOnField(_playFieldObject, _canvasField){
        if(_canvasField === "canvasMyGameField"){
            this.myGameField.redrawGameField(_playFieldObject);
        }
        if(_canvasField === "canvasEnemyGameField"){
            this.enemyGameField.redrawGameField(_playFieldObject);
        }
    }

    changeStatusText(_text){
        this.statusScreen.drawStatusText(_text);
    }

}