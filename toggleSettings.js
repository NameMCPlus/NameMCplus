document.querySelector("#hideblcbutton").addEventListener("click", toggleBLC());

  function toggleBLC() {

    var HideBLC;

    document.querySelector("#BLCStatus").innerHTML = HideBLC;

    switch (HideBLC) {

        case false:
            HideBLC = true;
                break;
        case true:
            HideBLC = false;
                break;
        case null:
        case undefined:
            HideBLC = true;
                break;
    }
    
    chrome.storage.local.set({HideBLC: HideBLC}, function() {
        console.log("Saved");
    });
    console.log(HideBLC);
    
    document.querySelector("#BLCStatus").innerHTML = HideBLC;
  }

  function restore_options() {
    chrome.storage.local.get(['HideBLC'], function(result) {
      console.log("Options loaded");
    });
  }

  document.addEventListener('DOMContentLoaded', restore_options);