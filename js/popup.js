document.getElementById("othercapesopenmenu").onclick = function() {
    document.getElementById("third-party-capes-menu").style = "";
    document.getElementById("main-menu").style = "display: none;";
    chrome.storage.local.get(result => {
        if (!result.customApis) result.customApis = "";
        document.getElementById("apistextinput").value = result.customApis;
    })
}

document.getElementById("othercapesclosemenu").onclick = function() {
    document.getElementById("third-party-capes-menu").style = "display: none;";
    document.getElementById("main-menu").style = "";
}

document.getElementById("savecustomapisbutton").onclick = function() {
    chrome.storage.local.set({
        "customApis": document.getElementById("apistextinput").value
    })
}