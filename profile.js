//by M6 (M6yo) & Faav (withdrew)

var username = document.querySelector("h1").innerHTML;
var template = document.createElement("template");

setStatus(username);

function setStatus(username) {
  fetch(`https://api.gapple.pw/status/${username}`)
    .then(response => response.json())
.then(data => {
  var type = data.status;
  var uuid = data.uuid
  if (type == "msa") {
    accountType = "Microsoft";
  } else if (type == "migrated_msa") {
    accountType = 'Microsoft';
  } else if (type == "new_msa") {
    accountType = 'Microsoft';
  } else if (type == "mojang") {
    accountType = "Mojang";
  } else if (type == "normal") {
    accountType = "Normal (Mojang OR Microsoft)";
  } else if (type == "legacy") {
    accountType = "Legacy";
  } else if (uuid.toLowerCase() == "cc7ba16bb2c540fca18eb87b6949270e") { // homara- breaks the API lol
    accountType = "Legacy";
  }
  template.innerHTML = `<div class="row no-gutters"><div class="col order-lg-1 col-lg-4"><strong>Account Type</strong></div><div class="col-auto order-lg-3 col-lg-auto text-nowrap text-right">${accountType}</div></div>`;
  var viewsElement = document.querySelectorAll(".row, .no-gutters")[5];
  var accountTypeElement = template.content.children[0];
  viewsElement.parentNode.insertBefore(accountTypeElement, viewsElement.nextSibling);
});
}
