// remove the 404 error
document.querySelector("main > div").remove();
document.title = "Cape Tester | NameMC+"
document.querySelector("header").innerHTML += `
    <div class="container pt-3">
        <h1 class="text-center">Minecraft Cape Tester</h1>
        <hr>
    </div>
`

// declare variables
const skinViewer = null;
const skinViewerWalk = null;

// create skin viewer
document.querySelector("main").innerHTML = `
    <div class="row">
        <div class="col-md order-md-1"></div>
        <div class="col-md-auto order-md-2"></div>
    </div>
`;
createSkinViewer(document.querySelector("main > div > div"))

// create skin viewer options parent
const settingsParent = document.createElement("div");
settingsParent.className = "card mb-3"
document.querySelectorAll("main > div > div")[1].appendChild(settingsParent);



// go crazy, go stupid aaaaah
settingsParent.innerHTML = `
    <div class="card-header py-1"><strong>Settings</strong></div>
    <div class="card-body py-1">
        <label for="skin-input" style="padding-top: 3%;">Skin</label>
        <input type="text" class="form-control" id="skin-input" placeholder="Name / UUID" style="font-family: 'Consolas', monospace">
        <label for="cape-input" style="padding-top: 3%;">Cape</label>
        <select class="form-control" id="cape-input">
            <optgroup label="Java Edition Capes" id="java-capes-group"></optgroup>
            <optgroup label="Bedrock Edition Capes" id="bedrock-capes-group"></optgroup>
            <optgroup label="OptiFine Capes" id="optifine-capes-group"></optgroup>
            <optgroup label="NameMC+ Capes" id="namemcplus-capes-group"></optgroup>
        </select>
        <label for="cape-file-input" style="padding-top: 3%;">Custom Cape</label><br>
        <input type="file" class="form-control" style="padding-bottom: 11%;" id="cape-file-input" accept="image/png, image/gif, image/jpeg" />
        <div style="padding-top: 5%;"></div>
        <label for="upside-down-input">Upside Down</label>
        <input type="checkbox" id="upside-down-input" />
    </div>
`;



// when a user for the skin is entered
document.getElementById("skin-input").onkeydown = event => {
    if(event.key != 'Enter') return;
    const value = document.getElementById("skin-input").value;
    this.skinViewer.loadSkin(`https://www.mc-heads.net/skin/${value.trim()}`);
}



// add upside down change register
document.getElementById("upside-down-input").onchange = (event) => {
    if (document.getElementById("upside-down-input").checked) {
        this.skinViewer.playerObject.rotation.y = -10
        this.skinViewer.scene.rotation.z = Math.PI;
        this.skinViewer.scene.position.y = -17.5;
    } else {
        this.skinViewer.playerObject.rotation.y = 10
        this.skinViewer.scene.rotation.z = 0;
        this.skinViewer.scene.position.y = 0;
    }
}



// add select register
document.getElementById("cape-input").onchange = (event) => {
    this.skinViewer.loadCape(document.getElementById("cape-input").value)
}



// add select file register
var reader = new FileReader();
reader.addEventListener("load", () => {this.skinViewer.loadCape(reader.result)}, false);

document.getElementById("cape-file-input").onchange = (event) => {
    reader.readAsDataURL(document.getElementById("cape-file-input").files[0]);
}



// add cape options
loadCapeOptions();

async function loadCapeOptions() {
    const selectElement = document.getElementById("cape-input");

    fetch("https://api.namemc.plus/capeInfo").then(response => response.json()).then(json => {
        let parentElement = document.getElementById("java-capes-group")
        Object.entries(json).sort().forEach(cape => {
            parentElement.innerHTML += `<option value="${cape[1].src}">${cape[0]}</option>`
        })
    })

    fetch("https://api.namemc.plus/bedrockCapes").then(response => response.json()).then(json => {
        let parentElement = document.getElementById("bedrock-capes-group")
        Object.entries(json).sort().forEach(cape => {
            parentElement.innerHTML += `<option value="${cape[1].src}">${cape[0]}</option>`
        })
    })

    fetch("https://api.namemc.plus/OFcapes").then(response => response.json()).then(json => {
        let parentElement = document.getElementById("optifine-capes-group")
        Object.entries(json).forEach(cape => {
            parentElement.innerHTML += `<option value="${cape[1].src}">${cape[0]}</option>`
        })
    })

    fetch("https://api.namemc.plus/capes").then(response => response.json()).then(json => {
        let parentElement = document.getElementById("namemcplus-capes-group")
        chrome.storage.local.get(result => {
            if (result.hiddenCapes) {
                Object.entries(result.hiddenCapes).forEach(obj => {
                    json[obj[0]] = obj[1];
                })
            }
            Object.entries(json).sort().forEach(cape => {
                parentElement.innerHTML += `<option value="${cape[1].src}">${cape[0]}</option>`
            })
        })
    });
}



function createSkinViewer(parent) {
    // Skin
    let featureDiv = document.createElement("div");
    featureDiv.id = "skin-viewer";
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
    featureCanvas.id = "skin_container";
    featureBody.appendChild(featureCanvas);
  
    //Get skin model
    let skinModel = $(".skin-3d").attr("data-model");
  
    //Insert the div
    parent.appendChild(featureDiv);
  
    this.skinViewer = new skinview3d.FXAASkinViewer({
      canvas: document.getElementById("skin_container"),
      width: 270,
      height: 330,
      skin: "https://texture.namemc.com/12/b9/12b92a9206470fe2.png",
      model: skinModel,
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

    this.skinViewer.playerObject.rotation.y = 10;
  
    document.getElementById("skin_container").addEventListener(
      "contextmenu",
      (event) => event.stopImmediatePropagation(),
      true
    );
  
    //Set style
    document.getElementById("skin_container").style.filter = "drop-shadow(-9px 4px 9px rgba(0,0,0,0.4))"
    document.getElementById("skin_container").style.outline = "none"
  
    return featureDiv;
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