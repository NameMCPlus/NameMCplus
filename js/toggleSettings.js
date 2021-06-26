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
$("#searchbutton").on('change', function () {
  toggleBTSearch()
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

function toggleBTSearch() {
  var BTSearch = searchbutton.checked;

  chrome.storage.local.set({
    "BTSearch": BTSearch
  }, function () {
    console.log("Saved");
  });

  console.log(BTSearch);
}

function restore_options() {
  chrome.storage.local.get(function (result) {
    var HideBLC = result.HideBLC;
    var AccType = result.AccType;
    var createdAt = result.createdAt;
    var blockedNames = result.blockedNames;
    var BTSearch = result.BTSearch;

    if (HideBLC == undefined) {
      hideblcbutton.checked = false;
      HideBLC = false;
      toggleBLC()
    }
    if (AccType == undefined) {
      acctypebutton.checked = true;
      AccType = true;
      toggleAccType()
    }
    if (createdAt == undefined) {
      creationbutton.checked = true;
      createdAt = true;
      toggleCreation()
    }
    if (blockedNames == undefined) {
      blockedbutton.checked = true;
      blockedNames = true;
      toggleBlocked()
    }
    if (BTSearch == undefined) {
      searchbutton.checked = true;
      BTSearch = true;
      toggleBTSearch()
    }

    hideblcbutton.checked = HideBLC;
    console.log("Options loaded: " + HideBLC);

    acctypebutton.checked = AccType;
    console.log("Options loaded: " + AccType);

    creationbutton.checked = createdAt;
    console.log("Options loaded: " + createdAt);

    blockedbutton.checked = blockedNames;
    console.log("Options loaded: " + blockedNames);

    searchbutton.checked = BTSearch;
    console.log("Options loaded: " + BTSearch);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
