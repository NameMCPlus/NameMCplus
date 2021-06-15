
var username = document.querySelector("body > main > h1").textContent;
console.log(`Username is ${username}`);

function setStatus() {

    fetch(`https://api.gapple.pw/blocked/${username}`)
    .then(response => {
      if (response.ok) return response.json();
      return response.json().then(response => response)
    })
    .then(data => {
        var status = data.status;
        

    });

}