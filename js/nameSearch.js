//by M6 (M6yo) & Faav (withdrew)

var isWildcard = false;

try {
  if (document.querySelector(".container.mt-3 small").innerText) {
    isWildcard = true;
  }
} catch {}

function unhide() {
  var main = document.querySelector("main.container");
  main.classList.add("d-block");
}

function removeFinePrint() {
  // removes fine print under name availability
  try {
    document.querySelector("#status-bar").parentElement.children[1].remove();
  } catch {}
}

function betterNameMC(username) {
  var namemcStatus = document.querySelector("#status-bar div").firstElementChild.lastElementChild.innerText.replaceAll("*", "");
  var namemcStatusNoReplace = document.querySelector("#status-bar div").firstElementChild.lastElementChild;
  var searches = document.querySelector(".tabular").innerText;
  var statusClass = document.querySelector("#status-bar").classList[1];
  var statusColor = document.querySelector("#status-bar").classList[2];
  var main = document.querySelector("main.container");
  var textColor = "";
  var results = "";
  var profiles = "";
  var serverCount = "";
  var servers = "";
  var Skin = "";
  var skinCount = "";
  var toa = "";
  var dateTime = "";

  try {
    results = document.querySelector("#status-bar").parentElement.parentElement.parentElement.getElementsByTagName("h6")[1].innerText;
  } catch {}

  try {
    document.querySelectorAll(".card-header.py-2").forEach(function (element) {
      profiles += element.parentElement.outerHTML;
    })
  } catch {}

  try {
    serverCount = document.querySelector(".table.table-sm.mb-0").parentElement.parentElement.parentElement.parentElement.querySelector("h6").innerText;
  } catch {}

  try {
    servers = document.querySelector(".table.table-sm.mb-0").parentElement.parentElement.parentElement.outerHTML;
  } catch {}

  try {
    Skin = document.querySelector("#status-bar").parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.lastElementChild.outerHTML;
  } catch {}

  try {
    skinCount = document.querySelector("#status-bar").parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild.innerHTML;
  } catch {}

  try {
    toa = document.querySelector("#availability-time").innerHTML;
  } catch {}

  try {
    dateTime = document.querySelector("#availability-time").dateTime;
  } catch {}

  if (statusColor) {
    textColor = statusColor;
  }

  fetch(`https://api.gapple.pw/blocked/${encodeURIComponent(username)}`)
    .then(response => {
      if (response.ok) return response.json();
      return response.json().then(response => response);
    })
    .then(gapple => {
      chrome.storage.local.get(function (result) {
        var status = gapple.status;
        var blockedNameBtn = result.blockedNames;
        var BTSearchbtn = result.BTSearch;
        unhide();
        console.log(BTSearchbtn);
        console.log(blockedNameBtn);
        if (BTSearchbtn !== false) {
          if (blockedNameBtn !== false) {
            if (status == "blocked" || status == "blocked_or_dropping" && namemcStatus == "Available") {
              main.innerHTML = `<div class="mb-3"><div id="status-bar" class="card bg-blocked"><div class="card-body px-0"><div class="row align-items-center"><div class="col-md-7"><h1 class="my-1 px-3 text-center text-nowrap text-ellipsis" translate="no"><samp>${username}</samp></h1><hr class="mt-2 mb-1 d-md-none"></div><div class="col-md-5 text-center my-1"><div class="row no-gutters align-items-center"><div class="col-sm-6 my-1"><div><strong>Status</strong></div><div>Blocked</div></div><div class="col-sm-6 my-1"><div><strong>Searches</strong></div><div class="tabular">${searches}</div></div></div></div></div></div></div></div><hr class="mt-0"><div class="row"><div class="col-md-6 col-lg-5 order-md-2"><p class="text-muted">${skinCount}</p>${Skin}</div><div class="col-md-6 col-lg-7 order-md-1"><p class="text-muted">${results}</p>${profiles}<p class="text-muted">${serverCount}</p>${servers}</div></div></div></div></div></div>`;
            } else if (namemcStatus == "Available Later") {
              main.innerHTML = `<div class="mb-3"><div id="status-bar" class="card ${statusClass} ${statusColor}"><div class="card-body px-0"><div class="row align-items-center"><div class="col-md-7"><h1 class="my-1 px-3 text-center text-nowrap text-ellipsis" translate="no"><samp>${username}</samp></h1><hr class="mt-2 mb-1 d-md-none"></div><div class="col-md-5 text-center my-1"><div class="row no-gutters align-items-center"><div class="col-6 text-center p-2"><div> <strong>Status</strong></div><div> Available Later</div></div><div class="col-6 text-center p-2"><div> <strong>Searches</strong></div><div class="tabular"> ${searches}</div></div><div class="col-6 text-center p-2"><div> <strong>Time of Availability</strong></div><div> <time id="availability-time" class="text-nowrap" datetime="${dateTime}">${toa}</time></div></div><div class="col-6 text-center p-2"><div> <strong>Time Remaining</strong></div><div class="countdown-timer" data-datetime="${dateTime}" data-update-title="true"></div></div></div></div></div></div></div></div><hr class="mt-0"><div class="row"><div class="col-md-6 col-lg-5 order-md-2"><p class="text-muted">${skinCount}</p>${Skin}</div><div class="col-md-6 col-lg-7 order-md-1"><p class="text-muted">${results}</p>${profiles}<p class="text-muted">${serverCount}</p>${servers}</div></div>`;
            } else {
              main.innerHTML = `<div class="mb-3"><div id="status-bar" class="card ${statusClass} ${statusColor}"><div class="card-body px-0"><div class="row align-items-center"><div class="col-md-7"><h1 class="my-1 px-3 text-center text-nowrap text-ellipsis" translate="no"><samp>${username}</samp></h1><hr class="mt-2 mb-1 d-md-none"></div><div class="col-md-5 text-center my-1"><div class="row no-gutters align-items-center"><div class="col-sm-6 my-1"><div> <strong>Status</strong></div><div> ${namemcStatus}</div></div><div class="col-sm-6 my-1"><div> <strong>Searches</strong></div><div class="tabular"> ${searches}</div></div></div></div></div></div></div></div><hr class="mt-0"><div class="row"><div class="col-md-6 col-lg-5 order-md-2"><p class="text-muted">${skinCount}</p>${Skin}</div><div class="col-md-6 col-lg-7 order-md-1"><p class="text-muted">${results}</p>${profiles}<p class="text-muted">${serverCount}</p>${servers}</div></div>`;
            }
          } else if (namemcStatus == "Available Later") {
            main.innerHTML = `<div class="mb-3"><div id="status-bar" class="card ${statusClass} ${statusColor}"><div class="card-body px-0"><div class="row align-items-center"><div class="col-md-7"><h1 class="my-1 px-3 text-center text-nowrap text-ellipsis" translate="no"><samp>${username}</samp></h1><hr class="mt-2 mb-1 d-md-none"></div><div class="col-md-5 text-center my-1"><div class="row no-gutters align-items-center"><div class="col-6 text-center p-2"><div> <strong>Status</strong></div><div> Available Later</div></div><div class="col-6 text-center p-2"><div> <strong>Searches</strong></div><div class="tabular"> ${searches}</div></div><div class="col-6 text-center p-2"><div> <strong>Time of Availability</strong></div><div> <time id="availability-time" class="text-nowrap" datetime="${dateTime}">${toa}</time></div></div><div class="col-6 text-center p-2"><div> <strong>Time Remaining</strong></div><div class="countdown-timer" data-datetime="${dateTime}" data-update-title="true"></div></div></div></div></div></div></div></div><hr class="mt-0"><div class="row"><div class="col-md-6 col-lg-5 order-md-2"><p class="text-muted">${skinCount}</p>${Skin}</div><div class="col-md-6 col-lg-7 order-md-1"><p class="text-muted">${results}</p>${profiles}<p class="text-muted">${serverCount}</p>${servers}</div></div>`;
          } else {
            main.innerHTML = `<div class="mb-3"><div id="status-bar" class="card ${statusClass} ${statusColor}"><div class="card-body px-0"><div class="row align-items-center"><div class="col-md-7"><h1 class="my-1 px-3 text-center text-nowrap text-ellipsis" translate="no"><samp>${username}</samp></h1><hr class="mt-2 mb-1 d-md-none"></div><div class="col-md-5 text-center my-1"><div class="row no-gutters align-items-center"><div class="col-sm-6 my-1"><div> <strong>Status</strong></div><div> ${namemcStatus}</div></div><div class="col-sm-6 my-1"><div> <strong>Searches</strong></div><div class="tabular"> ${searches}</div></div></div></div></div></div></div></div><hr class="mt-0"><div class="row"><div class="col-md-6 col-lg-5 order-md-2"><p class="text-muted">${skinCount}</p>${Skin}</div><div class="col-md-6 col-lg-7 order-md-1"><p class="text-muted">${results}</p>${profiles}<p class="text-muted">${serverCount}</p>${servers}</div></div>`;
          }
          try {
          drawSkin2D();
          } catch {}
        } else {
          if (blockedNameBtn !== false) {
            if (status == "blocked" || status == "blocked_or_dropping" && namemcStatus == "Available") {
              removeFinePrint();
              namemcStatusNoReplace.innerHTML = "Blocked";
              var element = document.getElementById('status-bar');
              element.classList.remove("bg-success");
              element.classList.add("bg-blocked");
            } else if (namemcStatus.innerHTML == "Available") {
              removeFinePrint();
              namemcStatusNoReplace.innerHTML = "Available";
            } else {
              removeFinePrint();
            }
          }
        }
        try {
          const timers = $('.countdown-timer');
          if (timers.length > 0) {
            makeClock(function (clock) {
              timers.each(function (i, e) {
                startTimer($(e), clock);
              });
            });
          }
        } catch {}
      });
    });
}

if (isWildcard == false) {
  var username = document.querySelector("#search-box").getAttribute("value");
  betterNameMC(username);
} else {
  unhide();
}
