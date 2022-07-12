
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

const app = express();
const server = createServer(app);

const io = new Server(server);

// Set static folder
app.use(express.static('client'));


// Run when client connects
io.on('connect', socket => {
    console.log(socket.id)

//--------ans Game senden
socket.on('gameRoomManager', dataPack => {
    dataPack.socket = socket;
    dataPack.io = io;
    gameRoomManager.evaluate(dataPack);
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

});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
