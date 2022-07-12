import mysql, {  } from 'mysql';

const serverHighScores = [{place: 1, name: "Server 134", score: 46}, {place: 1,name: "Server 2", score: 50}, {place: 1,name: "Server 3", score: 2000},{place: 1,name: "Server 1", score: 46}, {place: 1,name: "Server 2", score: 50}, {place: 1,name: "Server 3", score: 2000},{place: 1,name: "Server 1", score: 46}, {place: 1,name: "Server 2", score: 50}, {place: 1,name: "Server 3", score: 2000}, {place: 1,name: "Server 3", score: 2000}];
const displayedHighScores = 10;

class GameManagerMemory{
    constructor(){
        //high score init
        //Daten für DemoCode entfernt
        this.lockServerHighScores = false;
        this.dbHigscore = "higscores"; //testHighscores higscores
        this.host = "";
        this.user = "";
        this.password = "";
        this.database = "";
    }

    evaluate(clientDataPacket){
        switch (clientDataPacket.command){     
            case 'gethighScore':
                this.gethighScore(clientDataPacket);
                break;     
            case 'updatehighScore':
                this.updateHighScore(clientDataPacket);
                break;  
            default:
                this.gethighScore(clientDataPacket);
                //console.log(clientDataPacket);
                break;                    
        }
    }

    //-------------------HigScore Memory-------------
    //update highscore on Serverstart
    onServerStart(){
        console.log("clientDataPacket 2");
        //--------------------INIT ON CONNECT
        console.log("onServerStart connect: ");
        let con1 = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
          });
            console.log("1 updates HighScore on Server start) gethighScore START ------- ");
            console.log(serverHighScores);
            let sql =  "SELECT * FROM "+ this.dbHigscore + "" ;
            con1.query(sql, function (err, result) {
                if(err) throw console.log(err);
                serverHighScores;
                displayedHighScores;
            console.log("2 updates HighScore on Server start) gethighScore ENDE -------");
            for (let i = 0; i < displayedHighScores; i++) {
                serverHighScores[i].score = result[i].score;
                serverHighScores[i].name = result[i].name;
                serverHighScores[i].place = result[i].place;
            }
            console.log(result);
            this.serverHighScores = result;
            // sendBackToClient(result);
            });
            con1.end();
    }

    gethighScore(data){
        console.log(serverHighScores);
        data.io.emit('gethighScore', serverHighScores);
    }

    //---------------UpdateHighScores / Save to db
    updateHighScore(data){
        this.checkDataLock(data);
    }

    // 0) pruefe, ob ServerArray bearbeitbar und speere Schreibzugriff auf Array
    checkDataLock(data){
        setTimeout( () =>{
            if(this.lockServerHighScores == true){
                console.log("locked ");
                this.checkDataLock(data);
            } else{
                this.lockServerHighScores == true
                this.pushToArrayAndSort(data)
            }
        }, 500);
    }
    // 1) Daten ins tmp Array pushen
    // 2) Daten im tmp sortieren
    pushToArrayAndSort(clientdata){
        let data = {place: 1, name: "Server 134", score: 46}
        data.name = clientdata.playerName;
        data.score = clientdata.score;
        console.log("pushtoArray fired");
        let tmpArray = [];
        let tmpSortedArray = [];serverHighScores;
        let inserted = false;
        serverHighScores.forEach(element => {
            tmpArray.unshift(element);
        });
        console.log("1) tmpArray copy of ServerArray");
        console.log(tmpArray);
        serverHighScores.forEach(element => {
            if(!inserted){
                //check next element with next serverHighScores
                if(data.score <= element.score){
                    tmpSortedArray.push(data);
                    tmpSortedArray.push(tmpArray.pop());
                    inserted = true;
                } else {
                    tmpSortedArray.push(tmpArray.pop());
                }
            } else {
                tmpSortedArray.push(tmpArray.pop());
            }
        });
        // 3) letzten platz rausschmeisen
        tmpSortedArray.pop();
        console.log("2) tmpSortedArray");
        console.log(tmpSortedArray);
        // 4) sortierten tmpArray in DB saven
        let con = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
          });
            let place = 1;
            tmpSortedArray.forEach(element => {
            console.log(element.name);
            let sql =  "UPDATE "+ this.dbHigscore + " SET score = " + element.score + ", name = '" + element.name   + "' WHERE place =" + place +"" ;
            place++;
            con.query(sql, function (err, result) {
                if(err) throw console.log(err);
                console.log(element.score + " inserted");
            });            
        });
        con.end(); console.log("db connection closed -------");
        // 5) Daten aus tmpArray in ServerArray schreiben
        //leer machen
        for(let i = 0; i < displayedHighScores; i++){
            serverHighScores.pop();
        };
        //serverHighScores generieren
        tmpSortedArray.forEach(element => {
            serverHighScores.push(element);
        });
        console.log("final score");
        console.log(serverHighScores);
        // 6) ServerArray freigeben und an Client zurücksenden
        this.lockServerHighScores = false;
        this.gethighScore(clientdata);
    }

}

export {GameManagerMemory};