const skinViewer = null;
const skinViewerWalk = null;
var username = document.querySelector("[name='profile:username']").content;
var profileUuid = document.querySelector("body > main > div > div.col-md.order-md-2 > div:nth-child(1) > div.card-body.py-1 > div:nth-child(2) > div.col-12.order-lg-2.col-lg > samp").innerText
const capeDB = {}


class CapeTemplate {
  /**
   * 
   * @param {string} src 
   * @param {string[]} users 
   * @param {string} name 
   * @param {string} description
   * @param {string} redirect
   */
  constructor(src, users, name, description = null, redirect = null) {
    this.src = src;
    this.users = users;
    this.name = name;
    this.description = description;
    this.redirect = redirect;
  }
}


String.prototype.addDashes = function () {
  var uuid = this;
  var isUUIDwithDashes = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i.test(uuid);
  var isUUIDwithoutDashes = /^[A-F\d]{8}[A-F\d]{4}4[A-F\d]{3}[89AB][A-F\d]{3}[A-F\d]{12}$/i.test(uuid);
  if (isUUIDwithoutDashes == true) {
    return uuid.substr(0, 8) + "-" + uuid.substr(8, 4) + "-" + uuid.substr(12, 4) + "-" + uuid.substr(16, 4) + "-" + uuid.substr(20);
  } else if (isUUIDwithDashes == true) {
    return uuid;
  } else {
    throw new Error("Can only add dashes to a valid UUID: " + uuid);
  }
};


/* Add NMCP and JSON capes to profile */
fetch("https://api.namemc.plus/capes").then(response => response.json()).then(json => createNMCPCapeCard(json));

function createNMCPCapeCard(db) {
  createSkinViewer();
  createSkinEvents();
  createCapeEvents();

  const capes = [];
  Object.entries(db).forEach(obj => {
    if (obj[1].users.includes(profileUuid)) {
      capes.push(new CapeTemplate(obj[1].src, obj[1].users, obj[0], obj[1].description, "https://namemc.com/nmcp-cape/" + obj[0].toLowerCase().replace(" ", "-")))
    }
  })

  if (Object.keys(capes).length > 0) {
    return createCapeCard(capes, "NameMC+ Capes", createThirdPartyCapeCard, true, null)
  }
  createThirdPartyCapeCard();
}


/* 
    Add third-party capes to profile
    {username} is replaced with the username (capitalization)
    {uuid} is replaced with the UUID (no dashes)
    {uuid-dashes} is replaced with the UUID (dashes)
*/
function createThirdPartyCapeCard(_) {
  chrome.storage.local.get(result => {
    if (!result.otherCapes) return;
    const capes = [];

    if (result.mantle) {
      // createCapeCard([], "Mantle Capes", console.log("Created Mantle cape card!"), true, "https://mantle.gg");
    }

    if (result.labymod) {
      capes.push({
        "name": "LabyMod",
        "url": "https://api.gapple.pw/cors/labymod/cape/{uuid-dashes}"
      })
    }

    if (result.cloaksplus) {
      capes.push({
        "name": "Cloaks+",
        "url": "https://server.cloaksplus.com/capes/{username}.png"
      })
    }

    if (result.capesmod) {
      capes.push({
        "name": "MinecraftCapes",
        "url": `https://minecraftcapes.net/profile/{uuid}/cape/map?${Date.now()}`
      })
    }

    createCapeCard([], "Third-Party Capes", capeCard => {
      capeCard.style = "display: none;";
      const capeDiv = capeCard.querySelector("div.card-body.text-center");

      for (let i = 0; i < capes.length; i++) {
        capes[i].url = capes[i].url.replace("{username}", username);
        capes[i].url = capes[i].url.replace("{uuid}", profileUuid);
        capes[i].url = capes[i].url.replace("{uuid-dashes}", profileUuid.addDashes());

        fetch(capes[i].url).then(data => {
          if (data.ok) {
            createCape(capes[i].url, capeDiv, capes[i].name, "", capes[i].url);
            capeCard.style = "";
          }
        })
      }
    })
  });
}


/* Cape card creator */
/**
 * @param {CapeTemplate[]} capes 
 * @param {string} title
 * @param {function} callback 
 * @param {boolean} showAmount 
 * @param {string} redirect
 */
function createCapeCard(capes, title, callback = console.log("Successfully made cape card!"), showAmount = false, redirect = null) {
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
  capes.forEach(cape => {
    createCape(cape.src, cardDiv.querySelector("div.card-body.text-center"), cape.name, cape.description, cape.redirect ?? capes[i])
  })

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
/**
 * @param {string} src 
 * @param {HTMLElement} parentElement 
 * @param {string} name 
 * @param {string} description 
 * @param {string} redirect 
 */
function createCape(src, parentElement, name = "", description = "", redirect = "") {
  let capeCanvas = document.createElement("canvas");
  capeCanvas.className = "cape-2d align-top skin-button skin-button-selected";
  let capeDataHash = `custom-${name.replace(" ", "-").toLowerCase()}`;
  capeCanvas.setAttribute("data-cape-hash", capeDataHash);
  capeDB[capeDataHash] = src;
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
    capescale = capeImage.width / 64;
    let frame = 0;
        let doAnimation = setInterval(function() {
            const offset = (frame * (capeImage.width / 2))
            ctx.drawImage(capeImage, 1 * capescale, offset + (1 * capescale), 10 * capescale, 16 * capescale, 0, 0, capeCanvas.width, capeCanvas.height)
            frame = frame + 1 > (capeImage.height / (capeImage.width / 2)) - 1 ? 0 : frame + 1;
        }, 110);

        if(capeImage.height == capeImage.width / 2) {
            clearInterval(doAnimation);
        }
    createCapeEvents();
  }

  // Puts the image in a href
  let featureImageHref = document.createElement("a");
  featureImageHref.href = redirect ? redirect : src;
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


/* Creates cape events for the custom viewer */
function createCapeEvents() {
  let capeChildren = document.getElementsByClassName("cape-2d")
  console.log(`Found ${capeChildren.length} capes`)
  for (var i = 0; i < capeChildren.length; i++) {
    capeChildren[i].addEventListener('mouseover', (event) => {
      for (var i = 0; i < capeChildren.length; i++) {
        capeChildren[i].classList.remove("skin-button-selected");
      }
      event.target.classList.add("skin-button-selected");
      let capeHash = event.target.getAttribute("data-cape-hash")

      if (capeHash != undefined && !capeHash.startsWith("custom-")) {
        let capeUrl = "https://texture.namemc.com/" + capeHash.substring(0, 2) + "/" + capeHash.substring(2, 4) + "/" + capeHash + ".png";
        this.skinViewer.loadCape(capeUrl)
        console.log("capeEvent: Mojang/Optifine")
      } else if (capeHash.startsWith("custom-")) {
        this.skinViewer.loadCape(capeDB[capeHash])
        console.log("capeEvent: Custom")
      }
    })
  }
}


/* Creates a custom skin and cape viewer */
function createSkinViewer() {
  // Skin
  let featureDiv = document.createElement("div");
  featureDiv.id = "minecraftcapes-skin";
  featureDiv.className = "card mb-3";

  // Add a button for animation
  let featureAnimateButton = document.createElement("button");
  featureAnimateButton.className = "btn btn-secondary play-pause-btn position-absolute top-0 left-0 m-2 p-0";
  featureAnimateButton.style.cssText = "width:32px;height:32px;z-index:1;";
  featureAnimateButton.addEventListener('click', (event) => {
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
  featureElytraButton.style.cssText = "height:32px;padding:0px 10px !important;z-index:1;";
  featureElytraButton.addEventListener('click', (event) => {
    if (this.skinViewer.playerObject.backEquipment == "cape") {
      featureElytraButton.innerHTML = "Show Cape"
      this.skinViewer.loadCape(this.skinViewer.capeImage, {
        backEquipment: 'elytra'
      })
    } else {
      featureElytraButton.innerHTML = "Show Elytra"
      this.skinViewer.loadCape(this.skinViewer.capeImage, {
        backEquipment: 'cape'
      })
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

  //Get skin
  let skinHash = $(".skin-3d").attr("data-skin-hash")
  let skinUrl = textureURL(skinHash);

  //Insert the div
  let profileLeft = document.querySelectorAll(".order-md-1 > .card.mb-3")[1]
  profileLeft.parentElement.insertBefore(featureDiv, profileLeft);

  this.skinViewer = new skinview3d.FXAASkinViewer({
    canvas: document.getElementById("skin_container"),
    width: 270,
    height: 330,
    skin: skinUrl,
    cape: this.finalCape,
    ears: this.finalEars
  });

  let control = skinview3d.createOrbitControls(this.skinViewer);
  control.enableRotate = true;
  control.enableZoom = false;
  control.enablePan = false;

  this.skinViewerWalk = this.skinViewer.animations.add(skinview3d.WalkingAnimation);
  this.skinViewerWalk.paused = true;

  this.skinViewer.camera.position.set(0, 10, 50);
  control.update();

  this.skinViewer.playerObject.rotation.y = 6.75

  document.getElementById("skin_container").addEventListener(
    "contextmenu",
    (event) => event.stopImmediatePropagation(),
    true
  );

  //Set style
  document.getElementById("skin_container").style.filter = "drop-shadow(-9px 4px 9px rgba(0,0,0,0.4))"
  document.getElementById("skin_container").style.outline = "none"

  document.querySelectorAll(".order-md-1 > .card.mb-3")[0].remove();
}


/* Creates skin events for the custom viewer */
function createSkinEvents() {
  let skinChildren = document.querySelectorAll("div a .skin-button");
  for (var i = 0; i < skinChildren.length; i++) {
    skinChildren[i].addEventListener('mouseover', (event) => {
      if (event.target != undefined) {
        if (event.target.getAttribute("data-skin-hash")) {
          let skinHash = event.target.getAttribute("data-skin-hash")
          let skinUrl = "https://texture.namemc.com/" + skinHash.substring(0, 2) + "/" + skinHash.substring(2, 4) + "/" + skinHash + ".png";
          this.skinViewer.loadSkin(skinUrl)
        }
      }
    })
  }
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


/* Returns a NameMC texture URL */
function textureURL(hash) {
  return 'https://texture.namemc.com/' + hash[0] + hash[1] + '/' + hash[2] + hash[3] + '/' + hash + '.png';
}
