
var theName = document.querySelector("#status-bar > div > div > div.col-md-7 > h1 > samp").innerHTML;

isBlocked(theName);

function f() {
    // removes fine print under name availability
    var a = document.querySelector("body > main > div.mb-3 > small");
    a.remove("d-block text-right");

}

function isBlocked(theName) {

fetch( `https://api.gapple.pw/blocked/${theName}`  )
.then( response => response.json() )
.then( response => {
    switch(response.status) {

        case `blocked`:

            f();

            var availability = document.querySelector("#status-bar > div > div > div.col-md-5.text-center.my-1 > div > div:nth-child(1) > div:nth-child(2)");
            availability.innerHTML = "Blocked";

            var element = document.getElementById('status-bar');
                element.classList.remove("bg-success");
                element.style.backgroundColor = "grey";

                console.log(`${theName} is blocked`);
                    break;
        case `invalid`:

            console.log(`${theName} is invalid`);
                break;
                
        case `taken`:
        
            console.log(`${theName} is not blocked`);
                break;

        case `available`:   

            f();

            var q = document.querySelector("#status-bar > div > div > div.col-md-5.text-center.my-1 > div > div:nth-child(1) > div:nth-child(2)");
            q.innerHTML = "Available";
            
                console.log(`${theName} is available`);
                    break;
                    
        case `soon`:

            var q = document.querySelector("#status-bar > div > div > div.col-md-5.text-center.my-1 > div > div:nth-child(1) > div:nth-child(2)");
            q.innerHTML = "Available Later*";
            
                console.log(`${theName} is dropping soon!`);
                    break;

    }
});

}
