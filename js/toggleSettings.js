$("#hideblcbutton").on('change', function () {
  toggleBLC()
});
$("#acctypebutton").on('change', function () {
  toggleAccType()
});
$("#creationbutton").on('change', function () {
  toggleCreation()
});
$("#blockedbutton").on('change', function () {
  toggleBlocked()
});

function toggleBLC() {
  var HideBLC = hideblcbutton.checked;

  chrome.storage.local.set({
    "HideBLC": HideBLC
  }, function () {
    console.log("Saved");
  });

  console.log(HideBLC);
}

function toggleAccType() {
  var AccType = acctypebutton.checked;

  chrome.storage.local.set({
    "AccType": AccType
  }, function () {
    console.log("Saved");
  });

  console.log(AccType);
}

function toggleCreation() {
  var createdAt = creationbutton.checked;

  chrome.storage.local.set({
    "createdAt": createdAt
  }, function () {
    console.log("Saved");
  });

  console.log(createdAt);
}

function toggleBlocked() {
  var blockedNames = blockedbutton.checked;

  chrome.storage.local.set({
    "blockedNames": blockedNames
  }, function () {
    console.log("Saved");
  });

  console.log(blockedNames);
}

function restore_options() {
  chrome.storage.local.get(function (result) {
    var HideBLC = result.HideBLC;
    if (HideBLC == undefined) {
      HideBLC = false;
    }
    hideblcbutton.checked = HideBLC;
    console.log("Options loaded: " + HideBLC);
    
    var AccType = result.AccType;
    if (AccType == undefined) {
      AccType = true;
    }
    acctypebutton.checked = AccType;
    console.log("Options loaded: " + AccType);
    
    var createdAt = result.createdAt;
    if (createdAt == undefined) {
      createdAt = true;
    }
    creationbutton.checked = createdAt;
    console.log("Options loaded: " + createdAt);
    
    var blockedNames = result.blockedNames;
    if (blockedNames == undefined) {
      blockedNames = true;
    }
    blockedbutton.checked = blockedNames;
    console.log("Options loaded: " + blockedNames);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
