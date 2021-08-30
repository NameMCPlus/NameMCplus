document.getElementById("othercapesopenmenu").onclick = function() {
    document.getElementById("third-party-capes-menu").style = "";
    document.getElementById("main-menu").style = "display: none;";
}

document.getElementById("othercapesclosemenu").onclick = function() {
    document.getElementById("third-party-capes-menu").style = "display: none;";
    document.getElementById("main-menu").style = "";
}