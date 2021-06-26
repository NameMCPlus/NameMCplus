//by M6 (M6yo) & Faav (withdrew)

var username = document.querySelector(".text-center.pt-3 samp").innerText;
var namemcStatus = document.querySelector("#status-bar div").firstElementChild.lastElementChild.innerHTML.replaceAll("*", "");
var searches = document.querySelector(".tabular").innerText;
var statusClass = document.querySelector("#status-bar").classList[1];
var statusColor = document.querySelector("#status-bar").classList[2];
var count = document.querySelector("#status-bar").parentElement.parentElement.parentElement.childElementCount;
var textColor = "";
var results = "";
var profiles = "";
var serverCount = "";
var servers = "";
var Skin = "";
var skinCount = "";

try {
  results = document.querySelector("#status-bar").parentElement.parentElement.parentElement.children[2].querySelector("h6").innerHTML;
} catch {}

try {
  profiles = document.querySelector("#status-bar").parentElement.parentElement.parentElement.children[2].lastElementChild.innerHTML;
} catch {}

try {
  serverCount = document.querySelector("#status-bar").parentElement.parentElement.parentElement.children[3].firstElementChild.innerHTML;
} catch {}

try {
  servers = document.querySelector("#status-bar").parentElement.parentElement.parentElement.children[3].lastElementChild.innerHTML;
} catch {}

try {
  Skin = document.querySelector("#status-bar").parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.lastElementChild.outerHTML;
} catch {}

try {
  skinCount = document.querySelector("#status-bar").parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild.innerHTML;
} catch {}

if (statusColor) {
  textColor = statusColor;
}

function removeFinePrint() {
  // removes fine print under name availability
  document.querySelector("#status-bar").parentElement.lastElementChild.remove();
}

betterNameMC(username);

function betterNameMC(username) {
  fetch(`https://api.gapple.pw/blocked/${username}`)
    .then(response => {
      if (response.ok) return response.json();
      return response.json().then(response => response)
    })
    .then(gapple => {
      chrome.storage.local.get(function (result) {
        var status = gapple.status;
        var blockedNameBtn = result.blockedNames;
        document.querySelector("main.container").style = "display: block";
        console.log(Skin);
        if (blockedNameBtn !== false) {
          if (status == "blocked" || status == "blocked_or_dropping" && namemcStatus == "Available") {
            document.querySelector("main").innerHTML = `<div class="mb-3"><div id="status-bar" class="card bg-blocked"><div class="card-body px-0"><div class="row align-items-center"><div class="col-md-7"><h1 class="my-1 px-3 text-center text-nowrap text-ellipsis" translate="no"><samp>${username}</samp></h1><hr class="mt-2 mb-1 d-md-none"></div><div class="col-md-5 text-center my-1"><div class="row no-gutters align-items-center"><div class="col-sm-6 my-1"><div><strong>Status</strong></div><div>Blocked</div></div><div class="col-sm-6 my-1"><div><strong>Searches</strong></div><div class="tabular">${searches}</div></div></div></div></div></div></div></div><hr class="mt-0"><div class="row"><div class="col-md-6 col-lg-5 order-md-2"><p class="text-muted">${skinCount}</p>${Skin}</div><div class="col-md-6 col-lg-7 order-md-1"><p class="text-muted">${results}</p>${profiles}<p class="text-muted">${serverCount}</p>${servers}</div></div></div></div></div></div>`;
          } else {
            document.querySelector("main").innerHTML = `<div class="mb-3"><div id="status-bar" class="card ${statusClass} ${statusColor}"><div class="card-body px-0"><div class="row align-items-center"><div class="col-md-7"><h1 class="my-1 px-3 text-center text-nowrap text-ellipsis" translate="no"><samp>${username}</samp></h1><hr class="mt-2 mb-1 d-md-none"></div><div class="col-md-5 text-center my-1"><div class="row no-gutters align-items-center"><div class="col-sm-6 my-1"><div><strong>Status</strong></div><div>${namemcStatus}</div></div><div class="col-sm-6 my-1"><div><strong>Searches</strong></div><div class="tabular">${searches}</div></div></div></div></div></div></div></div><hr class="mt-0"><div class="row"><div class="col-md-6 col-lg-5 order-md-2"><p class="text-muted">${skinCount}</p>${Skin}</div><div class="col-md-6 col-lg-7 order-md-1"><p class="text-muted">${results}</p>${profiles}<p class="text-muted">${serverCount}</p>${servers}</div></div></div></div></div></div>`;
          }
        } else {
          document.querySelector("main").innerHTML = `<div class="mb-3"><div id="status-bar" class="card ${statusClass} ${statusColor}"><div class="card-body px-0"><div class="row align-items-center"><div class="col-md-7"><h1 class="my-1 px-3 text-center text-nowrap text-ellipsis" translate="no"><samp>${username}</samp></h1><hr class="mt-2 mb-1 d-md-none"></div><div class="col-md-5 text-center my-1"><div class="row no-gutters align-items-center"><div class="col-sm-6 my-1"><div><strong>Status</strong></div><div>${namemcStatus}</div></div><div class="col-sm-6 my-1"><div><strong>Searches</strong></div><div class="tabular">${searches}</div></div></div></div></div></div></div></div><hr class="mt-0"><div class="row"><div class="col-md-6 col-lg-5 order-md-2"><p class="text-muted">${skinCount}</p>${Skin}</div><div class="col-md-6 col-lg-7 order-md-1"><p class="text-muted">${results}</p>${profiles}<p class="text-muted">${serverCount}</p>${servers}</div></div></div></div></div></div>`;
        }
        drawSkin2D();
      });
    });
}
