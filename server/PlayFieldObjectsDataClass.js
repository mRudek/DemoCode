class PlayFieldObjectsData{
    constructor() {
        //Array for Objects
        this.waterPointArray = [];
        this.itemArray = [];
        this.shipArray = [];
        //Init first Objects
        this.addWaterPointsToArray();
    }

//-----------WATERPOINT DEF START
    //Definiert Wasserpunkte auf Spielfeld 
    addWaterPointsToArray(){
        let tmp = [];
        let xmove =  70;
        let ymove =  70;
        //playfield x * y
        for (let i = 0; i < 5; i++){
            for(let j = 0; j < 5; j++){
                this.waterPoint = {
                    name: "waterPoint",
                    x:35,
                    y:25,
                    width: 50,
                    height: 50,
                    src: `img/waterPoint.jpg`,
                    //img: new Image()
                };
                var pointb = this.waterPoint;
                this.waterPointArray = tmp;
                //this.setImage();
                //pointb.img.src = this.waterPoint.src;
                pointb.x = pointb.x + j * xmove;
                pointb.y = pointb.y + i * ymove;
                tmp.push(pointb);
            };  
        }
        this.waterPointArray = tmp;
        //console.log(this.waterPointArray); //for debug
        //this.waterPointPosArray = tmp;
    }

    getWaterPointArray(){
        return this.waterPointArray;
    }


//-----------Ship DEF START
    addShipToShipArray(_shipArrayPlace){
                this.ship = {
                    name: "Ship",
                    arrayPlace: _shipArrayPlace,
                    isDestroyed: 0,
                    x:35,
                    y:25,
                    width: 50,
                    height: 50,
                    src: `img/waterPoint.jpg`,
                    //img: new Image()
                };
                //this.ship.img.src = this.ship.src;
                this.shipArray.push(this.ship);
        //console.log("Ships "); //for debug
        //console.log(this.shipArray); //for debug
        //this.waterPointPosArray = tmp;
    }

    getshipArray(){
        return this.shipArray;
    }

    getActiveShips(){
        let activeShips = 0;
        for(let i =0; i < this.shipArray.length; i++){
            if(this.shipArray[i].isDestroyed === 0){
                activeShips++;
            }
        }
        return activeShips;
    }

    changeShipStatusToDestroyed(_shipArrayID){
        this.shipArray[_shipArrayID].isDestroyed = 1;
    }

    emptyShipArray(){
        this.shipArray = [];
    }

}

export {PlayFieldObjectsData};