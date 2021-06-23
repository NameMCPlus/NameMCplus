//by M6 (M6yo) & Faav (withdrew)

var username = document.querySelector("div.col.order-lg-1.col-lg-4.text-nowrap").firstElementChild.innerHTML;
var template = document.createElement("template");

chrome.storage.local.get(['HideBLC'], function(result) {
 if (result.HideBLC == true) {
   document.querySelector(".badlion-card").remove();
 }
});

$('body').tooltip({
  selector: '[data-toggle=tooltip]'
});

setStatus(username);

function setStatus(username) {
  fetch(`https://api.gapple.pw/status/${username}`)
    .then(response => response.json())
    .then(data => {
      var type = data.status;
      var uuid = data.uuid
      var accountType;
      var tooltip;

      switch (type) {
        case "msa":
          accountType = "Microsoft";
          tooltip = "Microsoft Account";
          break;
        case "migrated_msa":
          accountType = "Microsoft";
          tooltip = "Migrated from Mojang";
          break;
        case "new_msa":
          accountType = 'Microsoft';
          tooltip = "Newly Created";
          break;
        case "mojang":
          accountType = "Mojang";
          tooltip = "Mojang Account";
          break;
        case "normal":
          accountType = "Normal (Mojang OR Microsoft)";
          tooltip = "Mojang or Microsoft Account";
          break;
        case "legacy":
          accountType = "Legacy";
          tooltip = "Unmigrated (2009-Late 2012)";
          break;
      }

      if (uuid == "cc7ba16bb2c540fca18eb87b6949270e") { // homara- breaks the API lol)
        accountType = "Legacy";
        tooltip = "Unmigrated (2009-Late 2012)";
      }

      template.innerHTML = `<div class="row no-gutters"><div class="col order-lg-1 col-lg-4"><strong>Account Type</strong></div><div class="col-auto order-lg-3 col-lg-auto text-nowrap text-right" data-toggle="tooltip" title="${tooltip}">${accountType}</div></div>`;
      var viewsElement = document.querySelectorAll(".col-lg-4")[3].parentElement;
      var accountTypeElement = template.content.children[0];
      viewsElement.parentNode.insertBefore(accountTypeElement, viewsElement.nextSibling);
    });
}
