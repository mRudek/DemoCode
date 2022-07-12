class StatusScreen {
    constructor(canvasID) {
        this.playfieldObjectPositions = new PlayfieldObjectPositions();
        this.canid = canvasID;
        this.canvas = document.getElementById(this.canid);
        this.ctx = this.canvas.getContext(`2d`);
        this.drawStatusText("Press New Player");
    }

    drawStatusText(_text){
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(10, 50, 300, 30);
        this.ctx.fillStyle = "blue";
        this.ctx.fillText(_text, 15, 70, 200);
    }

    drawStatusEnemyShips(_text,_xpos,_ypos){
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(_xpos, _ypos, 100, 25);
        this.ctx.fillStyle = "blue";
        this.ctx.fillText(_text, _xpos,_ypos+10 , 200);
    }

    drawStatusPlayerShipsShips(_text,_xpos,_ypos){
        this.ctx.fillStyle = "blue";
        this.ctx.fillText(_text, _xpos,_ypos+_ypos+10, 200);
    }


    //Lobby etc
    drawPlayerArrayId(_text){
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(315, 10, 100, 60);
        this.ctx.fillStyle = "blue";
        this.ctx.fillText(_text, 315,20 , 200);
    }

    drawLobbyId(_text){
        this.ctx.fillStyle = "blue";
        this.ctx.fillText(_text, 315,20+15, 200);
    }

    drawP1ArrayId(_text){
        this.ctx.fillStyle = "blue";
        this.ctx.fillText(_text, 315,20+25, 200);
    }
    drawP2ArrayId(_text){
        this.ctx.fillStyle = "blue";
        this.ctx.fillText(_text, 315,20+35, 200);
    }

}