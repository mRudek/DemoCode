import { createServer } from "http";
import { Server } from "socket.io";
import express, {  } from 'express';

class Sender{

    sendToAll(dataPacket, io){
        //first delete socket and io from packet to prevent errors
        dataPacket.socket = null;
        dataPacket.io = null;
        io.emit('jobFinished', dataPacket);
    }

    sendToSender(dataPacket, socket){
        //first delete socket and io from packet to prevent errors
        dataPacket.socket = null;
        dataPacket.io = null;
        socket.emit('jobFinished', dataPacket);
    }

}

export {Sender};
