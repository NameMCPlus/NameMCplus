class CapeTemplate {
    /**
     * 
     * @param {string} src 
     * @param {string[]} users 
     * @param {string} name 
     * @param {string} description
     * @param {string} redirect
     */
    constructor(src, users, name, description = null, redirect = null, image = null) {
        this.src = src;
        this.users = users;
        this.name = name;
        this.description = description;
        this.redirect = redirect;
        this.image = image;
    }
}

console.log(`Address: ${location.href}`)



// Runs when viewing page with all capes listed
if (location.href == "https://namemc.com/capes") {
    chrome.storage.local.get(result => {
        if (!result.capePages) return;

        fetch("https://api.namemc.plus/capes").then(response => response.json()).then(json => {
            if (result.namemcpluscape && result.otherCapes) loadCapes(json, "NameMC+ Capes", "nmcp-cape");
            fetch("https://api.namemc.plus/OFcapes").then(response => response.json()).then(SpecialOptifine => {
                loadCapes(SpecialOptifine, "OptiFine Capes", "optifine-cape");
            })
        })

    })
}



// Runs when checking a NameMC+ Cape
chrome.storage.local.get(result => {
    if (location.href.includes("namemc.com/nmcp-cape/") && result.namemcpluscape && result.otherCapes) {
        fetch(`https://api.namemc.plus/capes/${location.href.split("namemc.com/nmcp-cape/")[1]}`).then(response => response.json()).then(json => {
        if (Object.keys(json).length < 1) return;

        document.querySelector("main > div").remove();
        if (json.invisible) {
            json.description += `${atob("CiAgICAgICAgICAgICAgICA8YnI+PGJyPgogICAgICAgICAgICAgICAgUHNzdC4gSGV5IGtpZCwgdGhpcyBpcyBhIHNlY3JldCBjYXBlLgogICAgICAgICAgICAgICAgSWYgeW91IHRoaW5rIHlvdSdyZSB0aGUgZmlyc3QgdG8gZmluZCB0aGlzLCBqb2luIG91ciA8Yj48YSBocmVmPSJodHRwczovL25hbWVtYy5wbHVzL2Rpc2NvcmQiPkRpc2NvcmQ8L2E+PC9iPiBhbmQgc2hhcmUgeW91ciBmaW5kaW5ncyEKICAgICAgICAgICAg")}`
        }

        loadCapeInfo(json, "NameMC+ Cape");
    })
  }
})



// Runs when checking for an OptiFine cape
if (location.href.includes("namemc.com/optifine-cape/")) {
    let displayCape = null;
    fetch("https://api.namemc.plus/OFcapes").then(response => response.json()).then(SpecialOptifine => {
        Object.entries(SpecialOptifine).forEach(obj => {
            if (obj[0].toLowerCase().replace(" ", "-") == location.href.split("namemc.com/optifine-cape/")[1]) {
                displayCape = new CapeTemplate(obj[1].src, obj[1].users, obj[0], obj[1].description, null, obj[1].image);
            }
        })
        if (displayCape == null) return;
        document.querySelector("main > div").remove();
        loadCapeInfo(displayCape, "OptiFine Cape");
    })
}



// Runs when on a normal cape page
if (location.href.includes("namemc.com/cape/")) {
    const capeHash = location.href.split("namemc.com/cape/")[1];
    fetch(`https://api.namemc.plus/capeInfo/${capeHash}`).then(response => response.json()).then(capeJson => {
                
        const descriptionCard = document.createElement("div");
        descriptionCard.className = "card mb-3";
        descriptionCard.innerHTML = `
            <div class="d-flex flex-column" style="max-height: 25rem">
                <div class="card-header py-1">
                    <strong>Description</strong>
                </div>
                <div class="card-body py-2">
                    ${capeJson.description}
                </div>
            </div>
        `;


        let skin = null;
        const playerListObjs = document.getElementsByClassName("card-body player-list py-2");
        if (playerListObjs.length == 1) {
            console.log(`Inner text: ${playerListObjs[0].innerHTML.split(">")[1].split("<")[0]}`);
            skin = [playerListObjs[0].innerHTML.split(">")[1].split("<")[0]];
        }
        const lengthObj = {
            skin: skin,
            amount: parseInt(document.getElementsByClassName("position-absolute bottom-0 right-0 m-1 text-muted")[0].innerHTML.substr(1))
        }
        createSkinViewer(document.getElementsByClassName("skin-3d")[0].parentElement.parentElement, new CapeTemplate(textureURL(capeHash), lengthObj, "Cape"));
        document.getElementsByClassName("skin-3d")[0].parentElement.remove();

        const insertBeforeDiv = document.getElementsByClassName("card-body player-list py-2")[0].parentElement.parentElement.parentElement.parentElement.childNodes[0];
        insertBeforeDiv.appendChild(descriptionCard);
    })
}



async function loadCapes(json, title, urlPath) {
    const capesDiv = document.querySelector("main > div > div");

    const capes = Object.entries(json);
    for(let i = 0; i < Object.keys(json).length; i++) {
        if (i == 0) {
            capesDiv.innerHTML += `
                <div class="container mt-3">
                    <h1 class="text-center">${title}</h1>
                    <hr class="my-0">
                    <br>
                </div>
            `
        }
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
            <a href="https://namemc.com/${urlPath}/${capes[i][0].toLowerCase().replace(" ", "-")}">
                <div class="card mb-2">
                    <div class="card-header text-center text-nowrap text-ellipsis p-1" translate="no">${capes[i][0]}</div>
                    <div class="card-body position-relative text-center checkered p-0">
                        <div>
                            <img class="auto-size-square" loading="lazy" width="280" height="280" style="image-rendering: pixelated;" src="${capes[i][1].image ?? capes[i][1].src}" data-src="${capes[i][1].image ?? capes[i][1].src}" alt="${capes[i][0]}" title="${capes[i][0]}">
                        </div>
                        <div class="position-absolute bottom-0 right-0 text-muted mx-1">★${capes[i][1].users.length}</div>
                    </div>
                </div>
            </a>
        `;
        capesDiv.appendChild(capeDiv);
    }
}

/**
 * 
 * @param {CapeTemplate} cape 
 * @param {string} type 
 */
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
                <div id="skinViewerDiv" class="card mb-3 card-body position-relative text-center p-0 checkered"></div>
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
                <div class="card">
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

    createSkinViewer(document.getElementById("skinViewerDiv"), cape);

    const namesDiv = document.getElementsByClassName("card-body player-list py-2")[0];
    cape.users.forEach(user => {
        fetch(`https://api.gapple.pw/cors/sessionserver/${user}`).then(response => response.json()).then(json => {
            namesDiv.innerHTML += `<a translate="no" href="/profile/${user}">${json.name}</a> `;
        })
    })
}

async function createSkinViewer(parent, cape) {
    // Skin
    let featureDiv = document.createElement("div");
    featureDiv.id = "skinviewer";
    featureDiv.className = "card";

    // User count
    featureDiv.innerHTML += `
        <h5 id="skinViewerDiv" class="position-absolute bottom-0 right-0 m-1 text-muted">★${cape.users.length ?? cape.users.amount}</h5>
    `;

    // Add a button for animation
    let featureAnimateButton = document.createElement("button");
    featureAnimateButton.className = "btn btn-secondary play-pause-btn position-absolute top-0 left-0 m-2 p-0";
    featureAnimateButton.style.cssText = "width:32px;height:32px;z-index:1;";
    featureAnimateButton.addEventListener('click', event => {
        this.skinViewerWalk.paused = !this.skinViewerWalk.paused;
    })
    let featureButtonIcon = document.createElement("i")
    featureButtonIcon.className = "fas fa-play";
    featureAnimateButton.appendChild(featureButtonIcon);
    featureDiv.appendChild(featureAnimateButton);

    // Add a button for Elytra
    let featureElytraButton = document.createElement("button");
    featureElytraButton.innerHTML = "Show Elytra"
    featureElytraButton.className = "btn btn-secondary play-pause-btn position-absolute top-0 right-0 m-2 p-0";
    featureElytraButton.style.cssText  = "height:32px;padding:0px 10px !important;z-index:1;";
    featureElytraButton.addEventListener('click', event => {
        if(this.skinViewer.playerObject.backEquipment == "cape") {
            featureElytraButton.innerHTML = "Show Cape"
            this.skinViewer.loadCape(this.skinViewer.capeImage, { backEquipment: 'elytra' })
        } else {
            featureElytraButton.innerHTML = "Show Elytra"
            this.skinViewer.loadCape(this.skinViewer.capeImage, { backEquipment: 'cape' })
        }
    })
    featureDiv.appendChild(featureElytraButton);

    // Add the body
    let featureBody = document.createElement("div");
    featureBody.className = "card-body text-center checkered";

    featureDiv.appendChild(featureBody);

    // Add the canvas
    let featureCanvas = document.createElement("canvas");
    featureCanvas.id = "skin_container"
    featureBody.appendChild(featureCanvas);

    //Insert the div
    parent.appendChild(featureDiv);

    const usedSkin = skinCalculator(cape.users);

    console.log(`Using cape: ${cape.src}`);

    this.skinViewer = new skinview3d.FXAASkinViewer({
        canvas: document.getElementById("skin_container"),
        width: 300,
        height: 400,
        skin: usedSkin.url,
        cape: cape.src
    });

    if (usedSkin.player) {
        fetch(`https://api.ashcon.app/mojang/v2/user/${usedSkin.player}`).then(response => response.json()).then(json => {
            let skinType = "classic";
            if (json.textures.slim) skinType = "slim";
            this.skinViewer.loadSkin(usedSkin.url, skinType)
        })
    }

    let control = skinview3d.createOrbitControls(this.skinViewer);
    control.enableRotate = true;
    control.enableZoom = false;
    control.enablePan = false;

    this.skinViewerWalk = this.skinViewer.animations.add(skinview3d.WalkingAnimation);
    this.skinViewerWalk.paused = true;

    this.skinViewer.camera.position.set(0, 10, 50);
    control.update();

    this.skinViewer.playerObject.rotation.y = 10;

    //Set style
    document.getElementById("skin_container").style.filter = "drop-shadow(-9px 4px 9px rgba(0,0,0,0.4))"
    document.getElementById("skin_container").style.outline = "none"
}



function textureURL(hash) {
    return 'https://texture.namemc.com/' + hash[0] + hash[1] + '/' + hash[2] + hash[3] + '/' + hash + '.png';
}



const skinCalculator = users => {
    if (users.length == 1) {
        return {
            url: `https://www.mc-heads.net/skin/${users[0]}`,
            player: users[0]
        };
    } else if (users.skin && users.amount == 1) {
        return {
            url: `https://www.mc-heads.net/skin/${users.skin}`,
            player: users.skin
        };
    }

    return {
        url: "https://texture.namemc.com/12/b9/12b92a9206470fe2.png"
    };
}
