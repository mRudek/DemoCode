class doku{

    DOM_Manipulation(){
        a.innerText = "abc"; b.append(a); 
        a.setAttribute("id", "testfeld");
        a.innerHTML = "abc";
        document.getElementById("rootTest").appendChild(a);

        btnHeight = 0;
        styleVisible = 'hidden';
        const btnNewGame = document.getElementById("newGameButton");
        btnNewGame.setAttribute("style", "visibility:  "+ styleVisible + "; height: " + btnHeight +"px; font-size: 0px;")
    }

}