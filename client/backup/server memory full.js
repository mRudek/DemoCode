
//import {} from './server/PlayerDataClass.js';
//const math = require("./server/PlayerDataClass.js");
import { GameRoomManager } from './server/GameRoomManagerClass.js';
const gameRoomManager = new GameRoomManager();

import {} from './server/PlayerDataClass.js';
import { GameRoundManager } from './server/GameRoundManagerClass.js';
const gameRoundManager = new GameRoundManager();

//import { RuleSet } from './server/RuleSetClass.js';
import { Lobby } from './server/LobbyClass.js';


//const ruleSet = new RuleSet();
const lobby_1 = new Lobby(1);

import { join } from 'path';
import { createServer } from "http";
import { Server } from "socket.io";
import express, {  } from 'express';
import mysql, {  } from 'mysql';

// const mysql = mysql();

const app = express();
const server = createServer(app);

const io = new Server(server);
const con = mysql.createConnection({
    host: "bp9n31iobtcdpns0cuap-mysql.services.clever-cloud.com",
    user: "u7c5onfgjludacow",
    password: "sU8NNqVSI6y2Pzs7uBb3",
    database: "bp9n31iobtcdpns0cuap"
  });

// Set static folder
app.use(express.static('client'));

//high score init
const serverHighScores = [{name: "Server 1", score: 46}, {name: "Server 2", score: 50}, {name: "Server 3", score: 2000},{name: "Server 1", score: 46}, {name: "Server 2", score: 50}, {name: "Server 3", score: 2000},{name: "Server 1", score: 46}, {name: "Server 2", score: 50}, {name: "Server 3", score: 2000}, {name: "Server 3", score: 2000}];
let lockServerHighScores = false;
const displayedHighScores = 10;
let highScoreOnStartServer = 0; // 0 = default, 1 = from DB
const dbHigscore = "testHighscores";
//testHighscores
//higscores



//---------------UpdateHighScores
    function updateHighScore(data){
        checkDataLock(data);
    }

    // 0) pruefe, ob ServerArray bearbeitbar und speere Schreibzugriff auf Array
    function checkDataLock(data){
        setTimeout( () =>{
            if(lockServerHighScores == true){
                console.log("YES " + test);
                test++; 
                checkDataLock(data);
            } else{
                lockServerHighScores == true
                pushToArrayAndSort(data)
            }
        }, 500);
    }

    // 1) Daten ins tmp Array pushen
    // 2) Daten im tmp sortieren
    function pushToArrayAndSort(data){
        console.log("pushtoArray fired");
        let tmpArray = [];
        var tmpSortedArray = [];
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

        //reihenfolge im Array aendern
        // serverHighScores.forEach(element => {
        //     tmpArray.push(tmpSortedArray.pop());
        // });
        // 4) sortierten tmpArray in DB saven
        const con = mysql.createConnection({
            host: "bp9n31iobtcdpns0cuap-mysql.services.clever-cloud.com",
            user: "u7c5onfgjludacow",
            password: "sU8NNqVSI6y2Pzs7uBb3",
            database: "bp9n31iobtcdpns0cuap"
            });
            let place = 1;
            tmpSortedArray.forEach(element => {
            console.log(element.name);
            var sql =  "UPDATE "+ dbHigscore + " SET score = " + element.score + ", name = '" + element.name   + "' WHERE place =" + place +"" ;
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
        lockServerHighScores = false;
        io.emit('gethighScore', serverHighScores);
    }


// Run when client connects
io.on('connect', socket => {
    //--------------------INIT ON CONNECT
    console.log("first connect: " + socket.id)
    if(highScoreOnStartServer == 0){
        console.log("1 updates HighScore on Server start) gethighScore START ------- ");
        var sql =  "SELECT * FROM "+ dbHigscore + "" ;
        con.query(sql, function (err, result) {
            if(err) throw console.log(err);
            for (let i = 0; i < displayedHighScores; i++) {
                serverHighScores[i].score = result[i].score;
                serverHighScores[i].name = result[i].name;
            }
          console.log("2 updates HighScore on Server start) gethighScore ENDE -------");
        });
        highScoreOnStartServer++;
        con.end(); console.log("connection closed -------");
        io.emit('gethighScore', serverHighScores);
    }


    //--------------------INIT ON CONNECT ENDE

    //--------ans Game senden
    socket.on('gameRoomManager', dataPack => {
        dataPack.socket = socket;
        dataPack.io = io;
        gameRoomManager.evaluate(dataPack);
    })

    //-------------------HigScore Memory-------------
    socket.on('updatehighScore', data => {
        updateHighScore(data);
    })

    //update on manuell highscore
    socket.on('gethighScore', data => {
        io.emit('gethighScore', serverHighScores);
    })

//------------------dbTest-----------------------------
    socket.on('Template', data => {

    });

    socket.on('dbRead', data => {
        // var sql =  "SELECT * FROM higscores" ;
        // con.query(sql, function (err, result) {
        //     //if(err) throw err;
        //     if(err) console.log(err);
        //   console.log("SQL select done");
        // });
        io.emit('gethighScore', serverHighScores);
    })

    socket.on('dbWrite', data => {
        var score = 13;
        var placeName = "gogo";
        var place = 3;

        var sql =  "UPDATE "+ dbHigscore + " SET score = " + score + ", name = '" + placeName + "' WHERE place =" + place +"" 
        con.query(sql, function (err, result) {
            //if(err) throw err;
            if(err) console.log(err);
          console.log("SQL write done");
        });
    })




    //-------------------Ab hier Alter Code-------------
    socket.on('send-chat-message', (message, cb) => {
        //socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
        //io.emit('chat-message', message)
        io.emit('chat-message', message )
        console.log("send-chat-message: " + message)
        cb("callback Test: " + message)
    })
    //nur fuer tests
    socket.on('place-enemy-message', (message, cb) => {
        io.emit('place-enemy-message', { message: message })
        console.log(message)
        cb("callback Test " + message)
    })

        /*
    //-------------------------gameStart
    socket.on('send-gameStart', _gameStartData => {
        if(lobby_1.lobid == _gameStartData.lobid && lobby_1.activeP1PlayerArrayId < 0){
            lobby_1.activeP1PlayerArrayId = _gameStartData.playerArrayNo;
        } else if(lobby_1.lobid == _gameStartData.lobid && lobby_1.activeP2PlayerArrayId < 0){
            lobby_1.activeP2PlayerArrayId = _gameStartData.playerArrayNo;
        }
        io.emit('gameStart-answer', lobby_1); 
        if(lobby_1.lobid == _gameStartData.lobid && lobby_1.activeP1PlayerArrayId > 0 && lobby_1.activeP2PlayerArrayId > 0 ){
            io.emit('roundStart-answer', lobby_1); 
        }
    })

    socket.on('initObjects-message', message => {
        console.log("init Objects 1")
        let objectsP1 = gameRoundManager.getGameObjects(0);
        let objecstP2 = gameRoundManager.getGameObjects(1);
        //console.log(placedGameRoundObjects_P1[0].name);
        socket.emit('initObjects-message', {"p1Objects":objectsP1, "p2Objects":objecstP2} )
        //console.log(placedGameRoundObjects_P1)
    })

    socket.on('placePlayerShip-message', message => {
        let placementArrayNo = ruleSet.checkValidShipPos(message.x,message.y); //wandelt koordinaten in arrayNo um
        if (placementArrayNo > -1 && gameRoundManager.getActiveShips(socket.id) < 10){
            gameRoundManager.placeShip(socket.id,placementArrayNo);    
            socket.emit('placePlayerShip-message', placementArrayNo)
        } else {
            var allPlacedMessage = "Alle Schiffe plaziert. Zerstöre Schiffe in Feld 1"
            socket.emit('allShipPlaced-message', allPlacedMessage)
        }
    })

    socket.on('checkShipHit-message', message => {
        let placementArrayNo = ruleSet.checkValidShipPos(message.x,message.y); //wandelt koordinaten in arrayNo um
        if (placementArrayNo > -1){
            let destroyed = 0;
            //checks the attack, destroy the ship and return answer, if ship destroyed or not
            destroyed = gameRoundManager.answerIsShipDestroyed(placementArrayNo, message.enemyArrayNo); //spieler 0 greift spieler 1 an
            if(destroyed === 1){
                //this.checkWinCondition();
            }             
            io.emit('checkShipHit-message', {'placementArrayNo':placementArrayNo, 'destroyedStatus':destroyed, 'whichPlayerShot': message.playerArrayNo, 'whichPlayerWasShot': message.enemyArrayNo })
        } else {
            var allPlacedMessage = "Ungueltiger Angriff"
            //socket.emit('allShipPlaced-message', allPlacedMessage)
        }
    })
    */
});  //connect finished

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
