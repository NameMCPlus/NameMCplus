class Setting {
  constructor(name, button, defaultOption = false) {
    this.name = name;
    this.button = button;
    this.defaultOption = defaultOption;
  }
}

const options = [
  // main options
  new Setting("otherCapes", document.getElementById("othercapesbutton"), true),
  new Setting("namemcplusBadges", document.getElementById("badgesbutton"), true),
  new Setting("accountTypes", document.getElementById("acctypebutton"), true),
  new Setting("creationDates", document.getElementById("creationbutton"), true),
  new Setting("blockedNames", document.getElementById("blockedbutton"), true),
  new Setting("oldLayout", document.getElementById("searchbutton"), false),
  new Setting("hideLocation", document.getElementById("hidelocationbutton"), false),
  new Setting("hideSeparation", document.getElementById("hideseparationbutton"), false),
  new Setting("mcusername", document.getElementById("mcusernamebutton"), false),

  // more capes options
  new Setting("capePages", document.getElementById("capepagesbutton"), true),
  new Setting("namemcpluscape", document.getElementById("namemcpluscapebutton"), true),
  new Setting("optifine", document.getElementById("optifinebutton"), true),
  // new Setting("mantle", document.getElementById("mantlebutton"), true),
  new Setting("cloaksplus", document.getElementById("cloaksplusbutton"), true),
  new Setting("labymod", document.getElementById("labymodbutton"), true),
  new Setting("capesmod", document.getElementById("capesmodbutton"), true)
]

options.forEach(option => {
  option.button.onclick = () => {
    toggleSetting(option.name, option.button.checked)
  };
})

function toggleSetting(key, value) {
  const obj = {};
  obj[key] = value;
  chrome.storage.local.set(obj, console.log(`Successfully set "${key}" to "${value}"`))
}

function restoreOptions() {
  chrome.storage.local.get(function (result) {
    options.forEach(option => {

      if (typeof result[option.name] == "undefined") {
        option.button.checked = option.defaultOption;
        toggleSetting(option.name, option.defaultOption);
        console.log(`Option ${option.name} didn't exist`)
        return;
      }

      console.log(`Option ${option.name} is set to ${result[option.name]}`)
      option.button.checked = result[option.name];

    })
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
