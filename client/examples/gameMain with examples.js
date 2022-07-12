let canvas;
let ctx;
let waterImage = new Image();
let ships =[];
let a =10;
let shipAC; //Test

//startgame() will be loaded when page is loaded
function startgame(){
    canvas = document.getElementById(`canvas`);
    ctx = canvas.getContext(`2d`);
    loadImages();
    setInterval(update,1000 / 25 );
    setInterval(createShips,5000);
    draw();
}

//--------------example creating ships START
//as function
function createShips(){
    let ship = {
        x:100,
        y:200,
        width: 100,
        height: 100,
        src: `img/ship.jpg`,
        img: new Image()
    };
    ship.img.src = ship.src;
    ships.push(ship);
}

//as function with vars
function createShips3(xs,ys){
    shipAC = {
        x:xs,
        y:ys,
        width: 100,
        height: 100,
        src: `img/ship.jpg`,
        img: new Image(),
    };
    shipAC.img.src = shipAC.src;
}

//as class
class shipAA {
    constructor() {
        this.x = 200;
        this.y = 70;
        this.width = 50;
        this.height = 50;
        this.testImg = new Image();
        this.testImg.src = `img/ship.jpg`;
    }
}
//--------------example creating ships END




//-----------draw functions start
function update(){
    ships.forEach(function(ship){
        ship.x +=2;
    });
}


function loadImages(){
    waterImage.src = `img/water.jpg`;
    createShips3(1,1);
    shipb = new shipAA();
    shipclass = new TestShipAA();
    //shipb.setImg();
    //shipb.testImg.src = `img/ship.jpg`;
}

//---------main draw function
function draw(){
    ctx.drawImage(waterImage,0,0);
    //ships from array
    ships.forEach(function(ship){
        ctx.drawImage(ship.img,ship.x,ship.y,ship.width,ship.height);
    });
    //ship from function
    ctx.drawImage(shipAC.img,shipAC.x,shipAC.y,shipAC.width,shipAC.height);
    //ship from class
    ctx.drawImage(shipb.testImg,shipb.x,shipb.y,shipb.width,shipb.height);
    //ship from external class
    ctx.drawImage(shipclass.testImg,shipclass.x,shipclass.y,shipclass.width,shipclass.height);
    //-----------draw all
    requestAnimationFrame(draw);
}
//-----------draw functions end

function WhichButton(event) {
    // alert("You pressed button: " + event.button);
    //createShips();

}

//--------------------------
//MouseListener
 function printMousePos(event) {
    /*document.body.textContent =
        "clientX: " + event.clientX +
        " - clientY: " + event.clientY;
    */
    createShips3(event.clientX,event.clientY);
}
document.addEventListener("click", printMousePos);