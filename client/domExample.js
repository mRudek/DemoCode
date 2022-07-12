//source: https://www.youtube.com/watch?v=y17RuWkWdn8
//example: add new div with classname
const body = document.body;
const div = document.createElement("div");
div.innerHTML = "hallo";
div.classList.add("select-game-container");
body.append(div);

//example: remove div
// div.classList.remove("memory-stat-container");

//example: add element to id
const div2 = document.createElement("div");
div2.innerHTML = "hallo2";
div2.classList.add("select-game-container");
// body.append(div2);
document.querySelector("#example-id").append(div2);
// document.querySelector("#example-id").remove(div2);

//remove games
const div3 = document.createElement("div");
div3.innerHTML = "hallo3";
div3.classList.add("select-game-container");
// div3.id.add("root");
// div3.setAttribute("id", "root");
document.querySelector("#test-id").append(div3);
// body.remove(div3);

// document.querySelector("#root").remove();
document.querySelector("#select-game").append(div3)

function removeGame (){
    document.querySelector("#root").setAttribute("id", "id_you_like");
    console.log("removed");
}