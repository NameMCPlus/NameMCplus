//by M6 (M6yo) & Faav (withdrew)

var username = document.querySelector(".my-1, .px-3").firstElementChild.innerHTML;
var namemcStatus = document.querySelector(".col-sm-6.my-1").lastElementChild;

function removeFinePrint() {
  // removes fine print under name availability
  var a = document.querySelector("body > main > div.mb-3 > small");
  a.remove("d-block text-right");
}

betterNameMC(username);

function betterNameMC(username) {
  fetch(`https://api.gapple.pw/blocked/${username}`)
    .then(response => {
      if (response.ok) return response.json();
      return response.json().then(response => response)
    })
    .then(data => {
      var status = data.status;

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
    });
}
