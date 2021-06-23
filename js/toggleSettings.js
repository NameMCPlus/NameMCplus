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
    hideblcbutton.checked = result.HideBLC;
    console.log("Options loaded: " + result.HideBLC);
    acctypebutton.checked = result.AccType;
    console.log("Options loaded: " + result.AccType);
    creationbutton.checked = result.createdAt;
    console.log("Options loaded: " + result.createdAt);
    blockedbutton.checked = result.blockedNames;
    console.log("Options loaded: " + result.blockedNames);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
