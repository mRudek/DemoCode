import { PlayfieldObjectPositions } from './PlayfieldObjectPositionsClass.js';

class RuleSet{
    constructor(){
        this.playfieldObjectPositions = new PlayfieldObjectPositions();
    }


    //checks if mouseclick is in rectangel. if no, then -1 else returns the arrayno
    checkValidShipPos(x,y){
        let arrayno = -1;
        let no = -1;
        //mouse clicked on waterpicture
        //groesser als x, aber kleiner als x + width
        for(let no = 0; no < this.playfieldObjectPositions.waterPointPosArray.length ; no++ ){
            let xpos = this.playfieldObjectPositions.waterPointPosArray[no].x;
            let width = this.playfieldObjectPositions.waterPointPosArray[no].width;
            let ypos = this.playfieldObjectPositions.waterPointPosArray[no].y;
            let height = this.playfieldObjectPositions.waterPointPosArray[no].height;  
            //inner rectangel of a watermark             
            if(x >xpos && x < (xpos+width)
            &&y >ypos && y < (ypos+height) ){
                    console.log("YES its Field ",xpos,ypos);
                    arrayno = no;
                    break;
            } else{
                console.log("NO, ",xpos,ypos); //for debug
            }
        }
//        console.log(arrayno); //for debug
        return arrayno;
    }

}

export {RuleSet};