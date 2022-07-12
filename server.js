import { GameRoomManager } from './server/GameRoomManagerClass.js';
const gameRoomManager = new GameRoomManager();

import {} from './server/PlayerDataClass.js';
import { GameRoundManager } from './server/GameRoundManagerClass.js';
const gameRoundManager = new GameRoundManager();

//import { RuleSet } from './server/RuleSetClass.js';
import { Lobby } from './server/LobbyClass.js';

import { GameManagerMemory } from './server/games/memory/GameManagerMemory.js';
const memoryManager = new GameManagerMemory();

import { GameRoomManagerGet7 } from './server/games/get7/GameRoomManagerGet7.js';
const GameRoomManagerGet72 = new GameRoomManagerGet7();


//const ruleSet = new RuleSet();
const lobby_1 = new Lobby(1);

import { join } from 'path';
import { createServer } from "http";
import { Server } from "socket.io";
import express, {  } from 'express';
import mysql, {  } from 'mysql';

// const mysql = mysql();
//---------Server
const app = express();
const server = createServer(app);
const io = new Server(server);
let highScoreOnStartServer = 0; // 0 = default, 1 = from DB

// Set static folder
app.use(express.static('client'));

//---------Main
// Run when client connects
io.on('connect', socket => {
    //--------------------INIT ON SERVERSTART
    console.log("first connect: " + socket.id)
    if(highScoreOnStartServer == 0){
        console.log("1 updates HighScore on Server start) gethighScore START ------- ");
        memoryManager.onServerStart();
        highScoreOnStartServer = 1;
    }
    //--------ans singleplayer Game senden
    socket.on('memory', dataPack => {
        dataPack.socket = socket;
        dataPack.io = io;
        memoryManager.evaluate(dataPack);
    })
    //--------ans multiplayer Game senden schiffe versenken
    socket.on('gameRoomManager', dataPack => {
        dataPack.socket = socket;
        dataPack.io = io;
        gameRoomManager.evaluate(dataPack);
    })

    //--------ans multiplayer Game senden get7 versenken
    socket.on('get7', dataPack => {
        dataPack.socket = socket;
        dataPack.io = io;
        // if(dataPack.kiGame == false){ //vs Human
            GameRoomManagerGet72.evaluate(dataPack);
        // }else { //vs Ki
        //     if(dataPack.command == "startRound"){
        //         dataPack.yourPlayer = 2; //P2 = KI
        //         let serverIo = dataPack.io;
        //         GameRoomManagerGet72.evaluate(dataPack);
        //         dataPack.io = serverIo;
        //         dataPack.yourPlayer = 1; //P1 = human
        //         GameRoomManagerGet72.evaluate(dataPack);
        //         dataPack.io = serverIo;
        //     }
        //     if(dataPack.command == "getWin" && dataPack.yourPlayer == 2){ //KI wins
        //         dataPack.yourPlayer = 2; //P2 = KI 
        //     }
        //     // dataPack.yourPlayer = 1; //P1 = human
        //     GameRoomManagerGet72.evaluate(dataPack);
        // }
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
});  //connect finished


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
