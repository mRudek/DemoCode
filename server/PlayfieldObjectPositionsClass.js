class PlayfieldObjectPositions {
    constructor() {
        //array for avaible ship positions
        this.waterPointPosArray = [];
        this.initWaterPointPosArray();
    }

    //---------------waterPoint START
    //define the first watermark, where ships can be put on
    initWaterPointPos(){
        this.waterPointPos = {
            x:150,
            y:20,
            width: 30,
            height: 30,
            src: `img/waterpoint.jpg`
        };
    }

    //define all other watermark, where ships can be put on        
    initWaterPointPosArray(){
        let tmp = [];
        let xmove =  70;
        let ymove =  70;
        //playfield x * y
        for (let i = 0; i < 5; i++){
            for(let j = 0; j < 5; j++){
                this.waterPointPos = {
                    x:35,
                    y:25,
                    width: 50,
                    height: 50,
                    src: `img/waterpoint.jpg`
                };
                var pointb = this.waterPointPos;
                this.waterPointPosArray = tmp;
                pointb.x = pointb.x + j * xmove;
                pointb.y = pointb.y + i * ymove;
                tmp.push(pointb);
            };  
        }
        this.waterPointPosArray = tmp;
        //console.log(this.waterPointPosArray); //for debug
        //this.waterPointPosArray = tmp;
    }
    //---------------waterPoint END    
}

export {PlayfieldObjectPositions};