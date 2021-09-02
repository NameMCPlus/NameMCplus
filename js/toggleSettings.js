$("#acctypebutton").on('change', function () {
  toggleAccType()
});
$("#hideseparationbutton").on('change', function () {
  toggleSeparation()
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
$("#othercapesbutton").on('change', function () {
  toggleOtherCapes()
})
$("#hidelocationbutton").on('change', function () {
  toggleLocation()
})

function toggleLocation() {
  var HideLocation = hidelocationbutton.checked;

  chrome.storage.local.set({
    "HideLocation": HideLocation
  }, function () {
    console.log("Saved");
  });

  console.log(HideLocation);
}

function toggleSeparation() {
  var HideSeparation = hideseparationbutton.checked;

  chrome.storage.local.set({
    "HideSeparation": HideSeparation
  }, function () {
    console.log("Saved");
  });

  console.log(HideSeparation);
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

function toggleOtherCapes() {
  var otherCapes = othercapesbutton.checked;

  chrome.storage.local.set({
    "otherCapes": otherCapes
  }, function () {
    console.log("Saved");
  });

  console.log(otherCapes);
}

function restore_options() {
  chrome.storage.local.get(function (result) {

    var AccType = result.AccType;
    var createdAt = result.createdAt;
    var blockedNames = result.blockedNames;
    var BTSearch = result.BTSearch;
    var HideLocation = result.HideLocation;
    var HideSeparation = result.HideSeparation;
    var otherCapes = result.otherCapes;

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
    if (otherCapes == undefined) {
      othercapesbutton.checked = true;
      otherCapes = true;
      toggleOtherCapes();
    }
    if (HideLocation == undefined) {
      hidelocationbutton.checked = false;
      HideLocation = false;
      toggleLocation()
    }
    if (HideSeparation == undefined) {
      hideseparationbutton.checked = false;
      HideSeparation = false;
      toggleSeparation()
    }

    acctypebutton.checked = AccType;
    console.log("Options loaded: " + AccType);

    creationbutton.checked = createdAt;
    console.log("Options loaded: " + createdAt);

    blockedbutton.checked = blockedNames;
    console.log("Options loaded: " + blockedNames);

    searchbutton.checked = BTSearch;
    console.log("Options loaded: " + BTSearch);

    hidelocationbutton.checked = HideLocation;
    console.log("Options loaded: " + HideLocation);

    hideseparationbutton.checked = HideSeparation;
    console.log("Options loaded: " + HideSeparation);

    othercapesbutton.checked = otherCapes;
    console.log("Options loaded: " + otherCapes)
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
