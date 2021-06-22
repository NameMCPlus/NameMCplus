$("#hideblcbutton").on('change', function() {toggleBLC()});

  function toggleBLC() {
    var HideBLC = hideblcbutton.checked;
    
    chrome.storage.local.set({"HideBLC": HideBLC}, function() {
        console.log("Saved");
    });

    console.log(HideBLC);
  }

  function restore_options() {
    chrome.storage.local.get(['HideBLC'], function(result) {
      hideblcbutton.checked = result.HideBLC;
      console.log("Options loaded: " + result.HideBLC);
    });
  }

  document.addEventListener('DOMContentLoaded', restore_options);
