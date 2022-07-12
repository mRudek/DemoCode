class ShipLocations{
    constructor(){
        this.shipArray = [];
    }

    addShipPos(ArrayNo){
        let ship = {ArrayNo};
        this.shipArray.push(ship);
        console.log("ship was added at ",ArrayNo);
    }

}