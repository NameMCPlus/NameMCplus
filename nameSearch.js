
var theName = document.querySelector("#status-bar > div > div > div.col-md-7 > h1 > samp").innerHTML;

isBlocked(theName);

function isBlocked(theName) {

fetch( `https://api.gapple.pw/blocked/${theName}`  )
.then( response => response.json() )
.then( response => {
    
    if(response.status == "blocked") {

        var availability = document.querySelector("#status-bar > div > div > div.col-md-5.text-center.my-1 > div > div:nth-child(1) > div:nth-child(2)");
        availability.innerHTML = "Blocked";

        var element = document.getElementById('status-bar');
            element.classList.remove("bg-success");
            element.style.backgroundColor = "grey";

        console.log(`${theName} is blocked`);
    }
    if(response.status !== "blocked") {
        console.log(`${theName} is not blocked`);

    }
});

}