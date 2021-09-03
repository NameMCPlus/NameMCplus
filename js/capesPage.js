const customCapesURL = chrome.runtime.getURL('../json/customCapes.json');
const capes = fetch(customCapesURL)
    .then((response) => response.json())
    .then((json) => {
        console.log(`Address: ${location.href}`)
        if (location.href == "https://namemc.com/capes") {
            loadCapes(json, "Custom Capes", "custom-cape");
        }
        
        if (location.href.includes("namemc.com/custom-cape/")) {
            let displayCape = null;
            json.capes.forEach(cape => {
                if (cape.name.toLowerCase().replace(" ", "-") == location.href.split("https://namemc.com/custom-cape/")[1]) {
                    displayCape = cape;
                }
            });
            if (displayCape == null) return;
            document.querySelector("main > div").remove();
            loadCapeInfo(displayCape, "Custom Cape");
        }
        
        if (location.href.includes("namemc.com/cape/")) {
            const capeInfoURL = chrome.runtime.getURL("../json/capeInfo.json")
            fetch(capeInfoURL).then(response => response.json()).then(capeJson => {
                const capeHash = location.href.split("https://namemc.com/cape/")[1];

                const descriptionCard = document.createElement("div");
                descriptionCard.className = "card mb-3";
                descriptionCard.innerHTML = `
                    <div class="d-flex flex-column" style="max-height: 25rem">
                        <div class="card-header py-1">
                            <strong>Description</strong>
                        </div>
                        <div class="card-body py-2">
                            ${capeJson.capes[capeHash].description}
                        </div>
                    </div>
                `;

                const insertBeforeDiv = document.getElementsByClassName("card-body player-list py-2")[0].parentElement.parentElement.parentElement.parentElement.childNodes[0];
                insertBeforeDiv.appendChild(descriptionCard);
            })
        }
    });

async function loadCapes(json, title, subredirect) {
    const capesDiv = document.querySelector("main > div > div");

    capesDiv.innerHTML += `
        <div class="container mt-3">
            <h1 class="text-center">${title}</h1>
            <hr class="my-0">
            <br>
        </div>
    `

    for(let i = 0; i < json.capes.length; i++) {
        // Make it so that if there's five capes in a row, it starts a new row
        if (i / 5 == Math.round(i / 5)) {
            const breakLine = document.createElement("div");
            breakLine.classList = "d-none d-md-block w-100";
            capesDiv.appendChild(breakLine);
        }
        // Create the cape card
        const capeDiv = document.createElement("div");
        capeDiv.className = "col-6 col-md";
        capeDiv.innerHTML = `
            <a href="https://namemc.com/${subredirect}/${json.capes[i].name.toLowerCase().replace(" ", "-")}">
                <div class="card mb-2">
                    <div class="card-header text-center text-nowrap text-ellipsis p-1" translate="no">${json.capes[i].name}</div>
                    <div class="card-body position-relative text-center checkered p-0">
                        <div>
                            <img class="auto-size-square" loading="lazy" width="280" height="280" style="image-rendering: pixelated;" src="${json.capes[i].src}" data-src="${json.capes[i].src}" alt="${json.capes[i].name}" title="${json.capes[i].name}">
                        </div>
                        <div class="position-absolute bottom-0 right-0 text-muted mx-1">★${json.capes[i].users.length}</div>
                    </div>
                </div>
            </a>
        `;
        capesDiv.appendChild(capeDiv);
    }
}

async function loadCapeInfo(cape, type) {
    document.title = `${cape.name} | ${type} | NameMC`;
    const headerDiv = document.querySelector("body > header").appendChild(document.createElement("div"));
    headerDiv.className = "container mt-3";
    headerDiv.innerHTML = `
        <h1 class="text-center" translate="no">${cape.name} <small class="text-muted text-nowrap">${type}</small></h1>
        <hr class="my-0">
    `;

    document.querySelector("main").innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-body position-relative text-center p-0 checkered">
                        <canvas class="skin-3d drop-shadow auto-size align-top" width="375" height="500"></canvas>
                        <h5 class="position-absolute bottom-0 right-0 m-1 text-muted">★${cape.users.length}</h5>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="d-flex flex-column" style="max-height: 25rem">
                        <div class="card-header py-1">
                            <strong>Description</strong>
                        </div>
                        <div class="card-body py-2">
                            ${cape.description}
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="d-flex flex-column" style="max-height: 25rem">
                        <div class="card-header py-1">
                            <strong>Profiles (${cape.users.length})</strong>
                        </div>
                        <div class="card-body player-list py-2">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const canvas = document.querySelector("canvas.skin-3d.drop-shadow.auto-size.align-top");
    const capeImage = new Image();
    capeImage.src = cape.image ?? cape.src;
    capeImage.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.drawImage(capeImage, 0, canvas.height / 8, canvas.width, capeImage.height * (canvas.width / capeImage.width));
    }

    const namesDiv = document.getElementsByClassName("card-body player-list py-2")[0];
    cape.users.forEach(user => {
        fetch(`https://api.gapple.pw/cors/sessionserver/${user}`).then(response => response.json()).then(json => {
            namesDiv.innerHTML += `<a translate="no" href="/profile/${user}">${json.name}</a> `;
        })
    })
}