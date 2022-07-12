class KiPlayer{
    constructor(){
        this.kiShips = [];
        this.attackStep = -1;
    }

    placeShips(){
        this.kiShips = this.getRandomNoArray(10,24);
    }

    getShipsArray(){
        return this.kiShips;
    }

    setKiAttackSteps(){
        this.attackStep = -1;
        this.attackSteps = this.getRandomNoArray(25,25);
    }

    getAttackStep(){
        this.attackStep = this.attackStep + 1;
        console.log("AT STEP Array No " , this.attackStep);
        return this.attackSteps[this.attackStep];
    }

    //----------KI start
    getRandomNoArray(noOfNumbers, biggestNo){
        let maxReturnArrayLengh = noOfNumbers; //max groeße Array = no of filds
        let maxArrayLengh = biggestNo; //max groeße Array = no of filds
        let randomNo = []; //Zufallszahle Ruckgabewerte
        let tmpRandomNo = [];
        Math.random(); //Random random = new Random();
        //create array with no of fields
        for (let i = 0; i < maxArrayLengh; i++)      //fuelle FisherArray mit folge 1 bis n, n ist groeßter Wert
        {
            //let randomNo = [];
            randomNo[i] = i;
        }
        //shuffle array
        randomNo = this.randomArrayShuffle(randomNo);
        //get only first x, example 10 ships = first 10 no of new array
        for (let i = 0; i < maxReturnArrayLengh; i++)      //fuelle FisherArray mit folge 1 bis n, n ist groeßter Wert
        {
            tmpRandomNo[i] = randomNo[i];
        }
        return tmpRandomNo;
    }
    
    //source: https://www.codegrepper.com/code-examples/javascript/fisher+yates+shuffle+algorithm+javascript
    randomArrayShuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
//----------KI END

}