var username = document.querySelector("[name='profile:username']").content;
var profileUuid = document.querySelector("body > main > div > div.col-md.order-md-2 > div:nth-child(1) > div.card-body.py-1 > div:nth-child(2) > div.col-12.order-lg-2.col-lg > samp").innerText





/* Add NMCP capes to profile */
const capeJsonURL = chrome.runtime.getURL('../json/customCapes.json');
fetch(capeJsonURL)
    .then(response => response.json())
    .then(json => {
        const capes = {
            names: [],
            descs: [],
            sources: []
        };
        json.capes.forEach(cape => {
            if (cape.users.includes(profileUuid)) {
                capes.names.push(cape.name);
                capes.descs.push(cape.description);
                capes.sources.push(cape.src);
            }
        });
        if (capes.sources.length > 0) {
            return createCapeCard(capes.sources, capeDiv => {
                createThirdPartyCapeCard();
            }, {title: "NameMC+ Capes", showAmount: true, capeNames: capes.names, capeDescs: capes.descs})
        }
        return createThirdPartyCapeCard();
    })





/* Add third-party (LabyMod, Cloaks+, etc) capes to profile */
function createThirdPartyCapeCard() {
    chrome.storage.local.get(result => {
        if (result.otherCapes) {
            createCapeCard([], capeCard => {
                const capeDiv = capeCard.querySelector("div.card-body.text-center");

                const functionsToRun = [createLabyModCape, createMantleCape, createCloaksPlusCape, createCapesModCape]
                for (let i = 0; i < functionsToRun.length; i++) {
                    functionsToRun[i](capeDiv).then(result => {
                        if (i == functionsToRun.length - 1 && capeDiv.firstElementChild == null) capeCard.remove();
                    })
                }
            }, {title: "Third-Party Capes"})
        } 
    });
}

async function createLabyModCape(capeDiv) {
    String.prototype.addDashes = function () {
        var uuid = this;
        var isUUIDwithDashes = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i.test(uuid);
        var isUUIDwithoutDashes = /^[A-F\d]{8}[A-F\d]{4}4[A-F\d]{3}[89AB][A-F\d]{3}[A-F\d]{12}$/i.test(uuid);
        if (isUUIDwithoutDashes == true) {
          return uuid.substr(0, 8) + "-" + uuid.substr(8, 4) + "-" + uuid.substr(12, 4) + "-" + uuid.substr(16, 4) + "-" + uuid.substr(20);
        } else if (isUUIDwithDashes == true) {
          return uuid;
        } else {
          throw new Error("This is not a valid UUID!");
        }
    };
    
    const url = "https://api.gapple.pw/cors/labymod/cape/" + profileUuid.addDashes();
    return new Promise((resolve, reject) => {
        fetch(url).then(data => {
            if (data.status == 200) {
                createCape(url, capeDiv, "LabyMod", "");
                resolve(true);
            }
        })
    
        resolve(false);
    })
}

function createMantleCape(capeDiv) {
    const url = "https://capes.mantle.gg/capes/" + username + ".png";
    return new Promise((resolve, reject) => {
        fetch(url, { method : "GET", mode: 'cors', headers: {'Access-Control-Allow-Origin': '*'} })
            .then(response => {
                if (response.status == 200) {
                    createCape(url, capeDiv, "Mantle", "");
                    resolve(true);
                }
                resolve(false);
            })
    })
}

function createCloaksPlusCape(capeDiv) {
    const url = "https://server.cloaksplus.com/capes/" + username + ".png";
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                console.log("Cloaks+ Response: " + response)
                if (response) {
                    createCape(url, capeDiv, "Cloaks+", "");
                    resolve(true);
                }
                resolve(false);
            })
        })
}

function createCapesModCape(capeDiv) {
    const url = "https://minecraftcapes.net/profile/" + profileUuid;
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => response.json())
            .then(body => {
                if (body.textures.cape) {
                    createCape(url + "/cape", capeDiv, "MinecraftCapes Mod", "");
                    resolve(true);
                }
                resolve(false);
            })
    })
}





/* Cape card creator */
function createCapeCard(capes, callback = capeCard => {}, {title, redirect, showAmount, capeNames, capeDescs} = {
    title: "Custom Capes", 
    redirect: "",
    showAmount: true,
    capeNames: [""],
    capeDescs: [""] }) 
{
    let titleArray = title.split(" ");
    titleArray.shift();

    // Create cape card
    const cardDiv = document.createElement("div");
    cardDiv.id = title.toLowerCase().replace(" ", "-");
    cardDiv.className = "card mb-3";
    cardDiv.innerHTML = `
        <div class="card-header py-1">
            <strong>
                ${redirect ? `<a href="${redirect}" target="_blank" rel="nofollow noopener noreferrer">` : ""}${title.split(" ")[0]}${redirect ? `</a>` : ""}${" " + titleArray.join(" ")}${showAmount ? " (" + capes.length + ")" : ""}
            </strong>
        </div>
        <div class="card-body text-center" style="padding: 3px">
        </div>
    `;

    // Render capes
    for (let i = 0; i < capes.length; i++) {
        createCape(capes[i], cardDiv.querySelector("div.card-body.text-center"), capeNames[i], capeDescs[i])
    };

    // Remove cape selected glow
    const capeChildren = document.getElementsByClassName("cape-2d")
    for (var i = 0; i < capeChildren.length; i++) {
        capeChildren[i].classList.remove("skin-button-selected");
    }

    let profileLeft = document.querySelector(".input-group.input-group-sm.my-2").parentElement.parentElement;
    profileLeft.parentElement.insertBefore(cardDiv, profileLeft);

    callback(cardDiv);
}





/* Cape canvas creator */
function createCape(src, parentElement, name = "", description = "") {
    let capeCanvas = document.createElement("canvas");
        capeCanvas.className = "cape-2d align-top skin-button skin-button-selected";
        capeCanvas.setAttribute("data-cape-hash", `${name.replace(" ", "-").toLowerCase()}-cape`);
        capeCanvas.width = 40;
        capeCanvas.height = 64;
        capeImage = new Image();
        capeImage.src = src;

        capeImage.onload = () => {
            const ctx = capeCanvas.getContext('2d');
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            if (capeImage.src != src) capeImage.src = src;
            const localCapeScale = capeScale(capeImage.height)
            ctx.drawImage(capeImage, localCapeScale, localCapeScale, 10 * localCapeScale, 16 * localCapeScale, 0, 0, capeCanvas.width, capeCanvas.height)
        }

        // Puts the image in a href
        let featureImageHref = document.createElement("a");
        featureImageHref.href = src;
        featureImageHref.target = "_blank";
        featureImageHref.setAttribute("data-toggle", "tooltip"),
        featureImageHref.setAttribute("data-html", "true")
        if (typeof name != 'undefined') {
            featureImageHref.setAttribute("title", `
                <b>${name}</b>${description ? `<br>${description}` : ""}
            `)
        }
        featureImageHref.appendChild(capeCanvas);
        parentElement.appendChild(featureImageHref);
}





/* Cape scaling (height) */
function capeScale(height) {
    if (height % 22 === 0) {
      return height / 22;
    } else if (height % 17 === 0) {
      return height / 17;
    } else if (height >= 32 && (height & (height - 1)) === 0) {
      return height / 32;
    }
    return Math.max(1, Math.floor(height / 22));
}