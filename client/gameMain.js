//creates objects at start
let gameManager;

//startgame() will be loaded when page is loaded
function startgame(){
    //callGameManager
    gameManager = new GameManger('canvasStatusScreen');
}

//----Phase 0 New player Login
    function btnInitPlayerGUI(){
        let playerNameOne = document.getElementById("playerName").value;
        gameManager.createPlayer(playerNameOne);
    }

    //momentan ohne Funktion
    function btnStartNewGame(){
        gameManager.sendToGameRoomManager('playerWon');
    }

    //joinlobby
    document.getElementById('join-lobby-container').addEventListener('submit', e => {
        e.preventDefault()
        console.log('join lobby button gedrueckt')
        let value = document.getElementById("joinLobbySelect").value;
        gameManager.joinLobby(value);
        //socket.emit('gameRoomManager', {'playerArrayNo': gameManager.playerArrayNo, 'lobid': gameManager.lobid} )
    })

    //register For NewRound
    document.getElementById('registerForNewRound-container').addEventListener('submit', e => {
        e.preventDefault()
        console.log('registerForNewRound button gedrueckt')
        gameManager.registerForRound();
        //socket.emit('gameRoomManager', {'playerArrayNo': gameManager.playerArrayNo, 'lobid': gameManager.lobid} )
    })


    


//----Phase 2 search and destroy ships
//--------------------MouseListener START 
function clickOnGameField1(event, canvasName){
    console.log("-------------------- NO 1 Field from function"); //for debug
    gameManager.checkShipHit(event, canvasName);
}

function clickOnGameField2(event, canvasName){
    console.log("----------------------------- NO 2 Field from function"); //for debug
    console.log(canvasName); //for debug
    gameManager.placePlayerShip(event, canvasName);

}

function getCanvasOffset(_canvasID){
    let canvas;
    let offsetYa;
    canvas = document.getElementById(_canvasID);
    offsetYa=canvas.offsetTop;
    return offsetYa;
}

/*
//clickedOnGameField wird nicht verwendet / nur zur vorlage
function clickedOnGameField(event){
    console.log(" NO clickedOnGameField"); //for debug
}
//document.addEventListener("click", clickedOnGameField);
//document.addEventListener("click", printMousePos);
*/

//--------------------MouseListener END 

