var username = document.querySelector("[name='profile:username']").content;
var profileUUID = document.querySelector(".card-body .row:nth-child(2) samp").innerText;
var template = document.createElement("template");
var htmlForBadges = '';
delta = 5;
var g = document.querySelector("#header").innerHTML;
var q = g.includes("namemc-rank namemc-rank-10\" translate=");
if (q == true){
  delta = 3;
}

$('body').tooltip({
  selector: '[data-toggle=tooltip]'
});

chrome.storage.local.get(function (result) {
  if (result.mcusername) addMCUNButton();
  if (result.hideSeparation) {
    var s2 = document.querySelector("body > main > div > div.col-md-auto.order-md-1 > div:nth-child(4) > div.card-header.py-1").innerHTML;
    if (s2.includes("Separation")) {
      document.querySelector("body > main > div > div.col-md-auto.order-md-1 > div:nth-child(4)").remove();
    } else {
      var s = document.querySelector("body > main > div > div.col-md-auto.order-md-1 > div:nth-child(5) > div.card-header.py-1").innerHTML;
        if (s.includes("Separation")) {
          document.querySelector("body > main > div > div.col-md-auto.order-md-1 > div:nth-child(5)").remove();
        }

    var s = document.querySelector("body > main > div > div.col-md-auto.order-md-1 > div:nth-child(5) > div.card-header.py-1").innerHTML;
        if (s.includes("Separation")) {
          document.querySelector("body > main > div > div.col-md-auto.order-md-1 > div:nth-child(5)").remove();
        }

    }
  }
});

//Formats Creation Dates
function formatCreation(date) {
  var d = date.split("-");
  var date = `${d[1]}/${d[2]}/${d[0]}`;
  return date;
}

function removeAccents(invalidName) {
  return encodeURIComponent(decodeURIComponent(invalidName).normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
}

// Removes Accents from invalids LOL
username = removeAccents(username);

chrome.storage.local.get(function (result) {
  if (result.namemcplusBadges) {
  fetch(`https://api.namemc.plus/badges/${profileUUID}`)
      .then((response) => response.json())
      .then((json) => {
          const badges = [];
          for (let [key, name] of Object.entries(json)) {
            var checkForErrors = JSON.stringify(json);
            if (checkForErrors.includes("404 Not Found") == false) {
              badges.push(name)
              console.log(name)
            }
          }
          console.log(JSON.stringify(badges))
          setStatus(username, profileUUID, badges)
      });
  }
});
function setStatus(username, profileUUID, badges) {
  fetch(`https://api.gapple.pw/cors/username/${username}`)
    .then(response => response.json())
    .then(toUUID => {
      var uuid = toUUID.id;
      fetch(`https://api.ashcon.app/mojang/v2/user/${profileUUID}`)
        .then(response => response.json())
        .then(ashcon => {
          fetch(`https://api.gapple.pw/status/${username}`)
            .then(response => response.json())
            .then(gapple => {
              chrome.storage.local.get(function (result) {
                var type = gapple.status;
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
                    tooltip = "Unmigrated (2009 - Late 2012)";
                    break;
                }

                if (profileUUID == "cc7ba16bb2c540fca18eb87b6949270e") { // homara- breaks the API lol)
                  accountType = "Legacy";
                  tooltip = "Unmigrated (2009 - Late 2012)";
                }
                var createdAtBtn = result.creationDates;
                var AccTypeBtn = result.accountTypes;

                const accTypeText = `
                  <div class="row no-gutters">
                    <div class="col order-lg-1 col-lg-4"><strong>Account Type</strong></div>
                    <div class="col-auto order-lg-3 col-lg-auto text-nowrap text-right" data-toggle="tooltip" title="${tooltip}">${accountType}</div>
                  </div>
                `

                const createdAtText = `
                  <div class="row no-gutters">
                    <div class="col order-lg-1 col-lg-4"><strong>Created At</strong></div>
                    <div class="col-auto order-lg-3 col-lg-auto text-nowrap text-right" data-toggle="tooltip" data-html="true" title="<b>Creation dates are inaccurate for a lot of accounts due to a breaking change on Mojang's end. We are currently fetching dates from Ashcon's API. Please yell at Mojang (WEB-3367) in order for accurate creation dates to return.</b>">NMCP_PLACEHOLDER_DATE</div>
                  </div>
                `

                template.innerHTML = `
                  ${AccTypeBtn && accountType ? accTypeText : ""}
                  ${createdAtBtn && createdAt ? createdAtText.replace("NMCP_PLACEHOLDER_DATE", formatCreation(createdAt)) : ""}
                `

                if (badges.length > 0) {
                  let badgesHTML = "";
                  badges.forEach(badge => {
                    badgesHTML += `
                        <img width="28" height="28" style="border-radius: 4px" src="${badge.icon}" data-toggle="tooltip" data-html="true" title="<b>${badge.name}</b><br>${badge.description}">
                    `
                  })
                  htmlForBadges += `
                    <div class="row no-gutters align-items-center" style="padding-top: 10px">
                      <div class="col-auto col-lg-4 pr-3"><strong>NameMC+ Badges</strong></div>
                      <div class="col text-right text-lg-left">${badgesHTML}</div>
                    </div>`;
                }

                var viewsElement = document.querySelectorAll(".col-lg-4")[3].parentElement;
                var accountTypeElement = template.content;
                viewsElement.parentNode.insertBefore(accountTypeElement, viewsElement.nextSibling);
                document.querySelector(`body > main > div > div.col-md.order-md-2 > div:nth-child(${delta}) > div.card-body.py-1`).innerHTML += htmlForBadges;
              });
            });
        });
    });
}

function addMCUNButton() {
  const parentDiv = document.createElement("a");
  parentDiv.href = `https://mcuserna.me/?lookup=${profileUUID}`;
  parentDiv.target = "_blank";

  const button = document.createElement("button");
  button.innerHTML = "mcuserna.me";
  button.classList = "btn btn-sm text-nowrap btn-success";

  parentDiv.appendChild(button);
  const masterDiv = document.getElementsByClassName("row justify-content-end")[0];
  masterDiv.insertBefore(parentDiv, masterDiv.firstElementChild);
}