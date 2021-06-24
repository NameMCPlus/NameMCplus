//by M6 (M6yo) & Faav (withdrew)

var username = document.querySelector("div.col.order-lg-1.col-lg-4.text-nowrap").firstElementChild.innerHTML;
var template = document.createElement("template");

chrome.storage.local.get(function (result) {
  if (result.HideBLC == true) {
    document.querySelector(".badlion-card").remove();
  }
});

$('body').tooltip({
  selector: '[data-toggle=tooltip]'
});

//Formats Creation Dates
function formatCreation(date) {
  var d = date.split("-");
  var date = `${d[1]}/${d[2]}/${d[0]}`;
  return date;
}

setStatus(username);

function setStatus(username) {
  fetch(`https://api.ashcon.app/mojang/v2/user/${username}`)
    .then(response => response.json())
    .then(ashcon => {
      fetch(`https://api.gapple.pw/status/${username}`)
        .then(response => response.json())
        .then(gapple => {
          chrome.storage.local.get(function (result) {
            var type = gapple.status;
            var uuid = gapple.uuid
            var createdAt = ashcon.created_at;
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
            var createdAtBtn = result.createdAt;
            var AccTypeBtn = result.AccType;
            if (AccTypeBtn == true && createdAtBtn == true || AccTypeBtn == undefined && createdAtBtn == undefined) {
              if (createdAt) {
                template.innerHTML = `<div class="row no-gutters"><div class="col order-lg-1 col-lg-4"><strong>Account Type</strong></div><div class="col-auto order-lg-3 col-lg-auto text-nowrap text-right" gapple-toggle="tooltip" title="${tooltip}">${accountType}</div></div><div class="row no-gutters"><div class="col order-lg-1 col-lg-4"><strong>Created At</strong></div><div class="col-auto order-lg-3 col-lg-auto text-nowrap text-right" gapple-toggle="tooltip" gapple-html="true" title="<b>Creation dates are inaccurate for a lot of accounts due to a breaking change on Mojang's end. We are currently fetching dates from Ashcon's API. Please yell at Mojang (WEB-3367) in order for accurate creation dates to return.</b>">${formatCreation(createdAt)}</div></div>`;
              } else {
                template.innerHTML = `<div class="row no-gutters"><div class="col order-lg-1 col-lg-4"><strong>Account Type</strong></div><div class="col-auto order-lg-3 col-lg-auto text-nowrap text-right" gapple-toggle="tooltip" title="${tooltip}">${accountType}</div></div>`;
              }
            } else if (AccTypeBtn == true && createdAtBtn == false || AccTypeBtn == undefined && createdAtBtn == false) {
              template.innerHTML = `<div class="row no-gutters"><div class="col order-lg-1 col-lg-4"><strong>Account Type</strong></div><div class="col-auto order-lg-3 col-lg-auto text-nowrap text-right" gapple-toggle="tooltip" title="${tooltip}">${accountType}</div></div>`;
            } else if (AccTypeBtn == false && createdAtBtn == true || AccTypeBtn == false && createdAtBtn == undefined) {
              if (createdAt) {
                template.innerHTML = `<div class="row no-gutters"><div class="col order-lg-1 col-lg-4"><strong>Created At</strong></div><div class="col-auto order-lg-3 col-lg-auto text-nowrap text-right" gapple-toggle="tooltip" gapple-html="true" title="<b>Creation dates are inaccurate for a lot of accounts due to a breaking change on Mojang's end. We are currently fetching dates from Ashcon's API. Please yell at Mojang (WEB-3367) in order for accurate creation dates to return.</b>">${formatCreation(createdAt)}</div></div>`;
              } else {
                template.innerHTML = ``;
              }
            } else {
              template.innerHTML = ``;
            }
            var viewsElement = document.querySelectorAll(".col-lg-4")[3].parentElement;
            var accountTypeElement = template.content;
            viewsElement.parentNode.insertBefore(accountTypeElement, viewsElement.nextSibling);
          });
        });
    });
}
