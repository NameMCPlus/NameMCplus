//by M6 (M6yo) & Faav (withdrew)

var username = document.querySelector(".text-center.pt-3 samp").innerHTML;
var namemcStatus = document.querySelector("#status-bar div").firstElementChild.lastElementChild;

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
            if (blockedNameBtn !== false) {
              if (status == "blocked" || status == "blocked_or_dropping" && namemcStatus.innerHTML == "Available*") {
                removeFinePrint();
                namemcStatus.innerHTML = "Blocked";
                var element = document.getElementById('status-bar');
                element.classList.remove("bg-success");
                element.style.backgroundColor = "grey";
              } else if (namemcStatus.innerHTML == "Available*") {
                removeFinePrint();
                namemcStatus.innerHTML = "Available";
              }
            }
        });
    });
}
