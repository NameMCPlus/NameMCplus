// remove the 404 error
document.querySelector("main > div").remove();

const skinViewer = createSkinViewer(document.querySelector("main"));



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
  
    //Get skin
    let skinUrl = "https://texture.namemc.com/12/b9/12b92a9206470fe2.png";
  
    //Get skin model
    let skinModel = $(".skin-3d").attr("data-model");
  
    //Insert the div
    parent.appendChild(featureDiv);
  
    this.skinViewer = new skinview3d.FXAASkinViewer({
      canvas: document.getElementById("skin_container"),
      width: 270,
      height: 330,
      skin: skinUrl,
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
  
    /* if (username == "Dinnerbone" || username == "Grumm") {
      this.skinViewer.playerObject.rotation.y = -6.75
      this.skinViewer.scene.rotation.z = Math.PI;
      this.skinViewer.scene.position.y = -17.5;
    } else {
      this.skinViewer.playerObject.rotation.y = 6.75
    } */
  
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