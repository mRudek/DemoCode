class GameField{

    constructor(canvasID, background) {
        this.canid = canvasID;
        this.canvas = document.getElementById(this.canid);
        this.ctx = this.canvas.getContext(`2d`);
        this.ctx.fillText(this.canid, 100, 15);
        this.initGameField(background);
    }

    initGameField(_background){
        this.ctx.drawImage(_background,0,0);
    }

    redrawGameField(_object){
        //console.log("redraw: " + _object.x);
        let ctx = this.canvas.getContext(`2d`);
            //console.log("y Koor " + _object.x);
            var imga = new Image();
            imga.src = _object.src;
            ctx.drawImage(imga,_object.x,_object.y,_object.width,_object.height);            
    }

}