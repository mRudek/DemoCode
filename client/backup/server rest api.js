
import { join } from 'path';
import { createServer } from "http";
import { Server } from "socket.io";
import express, {  } from 'express';

const app = express();
const PORT = 3000;

const highScores = [{name: "SERVER 1", score: 40}, {name: "SERVER 2", score: 60}, {name: "SERVER 3", score: 1000}]

// Set static folder
app.use(express.static('client'));

//-------------------REST API------- ------
app.get('/memHighscore', (req,res) => {
    res.status(200).send(highScores);
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
