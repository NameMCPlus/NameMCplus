const skinViewer = null;
const skinViewerWalk = null;
var username = document.querySelector("[name='profile:username']").content;
var profileUuid = document.querySelector("body > main > div > div.col-md.order-md-2 > div:nth-child(1) > div.card-body.py-1 > div:nth-child(2) > div.col-12.order-lg-2.col-lg > samp").innerText
console.log("UUID is " + profileUuid);

var labymodExists = hasLabyCape();

function textureURL(hash) {
  return 'https://texture.namemc.com/' + hash[0] + hash[1] + '/' + hash[2] + hash[3] + '/' + hash + '.png';
}

async function hasLabyCape() {

String.prototype.addDashes = function () {
  var uuid = this;
  var isUUIDwithDashes = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i.test(uuid);
  var isUUIDwithoutDashes = /^[A-F\d]{8}[A-F\d]{4}4[A-F\d]{3}[89AB][A-F\d]{3}[A-F\d]{12}$/i.test(uuid);
  if (isUUIDwithoutDashes == true) {
    return uuid.substr(0, 8) + "-" + uuid.substr(8, 4) + "-" + uuid.substr(12, 4) + "-" + uuid.substr(16, 4) + "-" + uuid.substr(20);
  } else if (isUUIDwithDashes == true) {
    throw new Error("This UUID already has dashes!");
  } else {
    throw new Error("This is not a valid UUID!");
  }
};
  const labymod = await fetch("https://api.gapple.pw/cors/labymod/cape/" + profileUuid.addDashes());
  const labyStatus = await labymod.status;
  labymodExists = false;
  if (labyStatus == 200) {
    labymodExists = true;
  }

  console.log("hasLabyCape?... " + labymodExists);

  return labymodExists;

}


console.log("labymodExists = " + labymodExists);

// Checks the users profile
fetch("https://minecraftcapes.net/profile/" + profileUuid).then(function(response) {
    return response.json();
}).then(function(body) {
    createSkinViewer();

    if(body.textures.ears != null) {
        createEarsCard(body.textures.ears);
        this.skinViewer.loadEars("data:image/png;base64," + body.textures.ears)
    }

    if(body.textures.cape != null) {
        createCapeModCard(body.textures.cape);
        this.skinViewer.loadCape("data:image/png;base64," + body.textures.cape)
        cape_capeMod = body.textures.cape;

        if (labymodExists == false) {
          
        createSkinEvents();
        console.log("created Skin Events");
        createCapeEvents(body.textures.cape, null);
        console.log("created Cape Events");
        }
    }

    if (labymodExists == true) {

        capeCrop('https://api.gapple.pw/cors/labymod/cape/' + profileUuid, body.textures.cape);

    }
    if (body.textures.cape == null && labymodExists == false) {

      createCapeEvents(null, null)
      createSkinEvents();

    }
    
    
});

/**
 * Creates the cape card
 */

 function createLabyCapeCard(base64Cape) {
    //Create the parent div
    let featureDiv = document.createElement("div");
    featureDiv.id = "labymod-cape";
    featureDiv.className = "card mb-3";

    //Add the title
    let featureTitle = document.createElement("strong");
    featureTitle.className = "card-header py-1";
    featureTitle.innerHTML = "<strong><a href=\"https://labymod.net\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">LabyMod</a> Cape</strong>";
    featureDiv.appendChild(featureTitle);

    //Add the body
    let featureBody = document.createElement("div");
    featureBody.className = "card-body text-center";
    featureBody.style.padding = "3px"
    featureDiv.appendChild(featureBody);

    //Remove the cape highlight
    let capeChildren = document.getElementsByClassName("cape-2d")
    for (var i = 0; i < capeChildren.length; i++) {
        capeChildren[i].classList.remove("skin-button-selected");
    }

    //Add the image
    let capeCanvas = document.createElement("canvas");
    capeCanvas.className = "cape-2d align-top skin-button skin-button-selected";
    capeCanvas.setAttribute("data-cape-hash", "labymod-cape");
    capeCanvas.width = 40;
    capeCanvas.height = 64;

    capeImage = new Image();
    capeImage.src = "data:image/png;base64," + base64Cape;
    capeImage.onload = function() {
        const ctx = capeCanvas.getContext('2d');
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        capeScale = capeImage.width / 64;
        //ctx.drawImage(capeImage, 1 * capeScale, 1 * capeScale, 10 * capeScale, 16 * capeScale, 0, 0, capeCanvas.width, capeCanvas.height)
        //ctx.drawImage(capeImage, 0, 0, 10 * capeScale, 16 * capeScale, 0, 0, capeCanvas.width, capeCanvas.height);
        ctx.drawImage(capeImage, 0, 0, capeCanvas.width, capeCanvas.height);

        /*
        let frame = 0;
        let doAnimation = setInterval(function() {
            const offset = (frame * (capeImage.width / 2))
            ctx.drawImage(capeImage, 1 * capeScale, offset + (1 * capeScale), 10 * capeScale, 16 * capeScale, 0, 0, capeCanvas.width, capeCanvas.height)
            frame = frame + 1 > (capeImage.height / (capeImage.width / 2)) - 1 ? 0 : frame + 1;
        }, 110);

        if(capeImage.height == capeImage.width / 2) {
            clearInterval(doAnimation);
        }
        */
    }

    //Puts the image in a href
    let featureImageHref = document.createElement("a");
    featureImageHref.href = "https://api.gapple.pw/cors/labymod/cape/" + profileUuid;
    featureImageHref.target = "_blank";
    featureImageHref.appendChild(capeCanvas);
    featureBody.appendChild(featureImageHref);

    //Insert the div
    let profileLeft = document.querySelector(".input-group.input-group-sm.my-2").parentElement.parentElement;
    profileLeft.parentElement.insertBefore(featureDiv, profileLeft);
}

function createCapeModCard(base64Cape) {
    //Create the parent div
    let featureDiv = document.createElement("div");
    featureDiv.id = "minecraftcapes-cape";
    featureDiv.className = "card mb-3";

    //Add the title
    let featureTitle = document.createElement("strong");
    featureTitle.className = "card-header py-1";
    featureTitle.innerHTML = "<strong><a href=\"https://minecraftcapes.net\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">MinecraftCapes</a> Cape</strong>";
    featureDiv.appendChild(featureTitle);

    //Add the body
    let featureBody = document.createElement("div");
    featureBody.className = "card-body text-center";
    featureBody.style.padding = "3px"
    featureDiv.appendChild(featureBody);

    //Remove the cape highlight
    let capeChildren = document.getElementsByClassName("cape-2d")
    for (var i = 0; i < capeChildren.length; i++) {
        capeChildren[i].classList.remove("skin-button-selected");
    }

    //Add the image
    let capeCanvas = document.createElement("canvas");
    capeCanvas.className = "cape-2d align-top skin-button skin-button-selected";
    capeCanvas.setAttribute("data-cape-hash", "minecraftcapes-mod");
    capeCanvas.width = 40;
    capeCanvas.height = 64;

    capeImage = new Image();
    capeImage.src = "data:image/png;base64," + base64Cape;
    capeImage.onload = function() {
        const ctx = capeCanvas.getContext('2d');
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        capeScale = capeImage.width / 64;
        ctx.drawImage(capeImage, 1 * capeScale, 1 * capeScale, 10 * capeScale, 16 * capeScale, 0, 0, capeCanvas.width, capeCanvas.height)
        let frame = 0;
        let doAnimation = setInterval(function() {
            const offset = (frame * (capeImage.width / 2))
            ctx.drawImage(capeImage, 1 * capeScale, offset + (1 * capeScale), 10 * capeScale, 16 * capeScale, 0, 0, capeCanvas.width, capeCanvas.height)
            frame = frame + 1 > (capeImage.height / (capeImage.width / 2)) - 1 ? 0 : frame + 1;
        }, 110);

        if(capeImage.height == capeImage.width / 2) {
            clearInterval(doAnimation);
        }
    }

    //Puts the image in a href
    let featureImageHref = document.createElement("a");
    featureImageHref.href = "https://minecraftcapes.net/profile/" + profileUuid + "/cape/map?" + Date.now();
    featureImageHref.target = "_blank";
    featureImageHref.appendChild(capeCanvas);
    featureBody.appendChild(featureImageHref);

    //Insert the div
    let profileLeft = document.querySelector(".input-group.input-group-sm.my-2").parentElement.parentElement;
    profileLeft.parentElement.insertBefore(featureDiv, profileLeft);
}

/**
 * Creates the ears card
 */
function createEarsCard(base64Ears) {
    //Create the parent div
    let featureDiv = document.createElement("div");
    featureDiv.id = "minecraftcapes-ears";
    featureDiv.className = "card mb-3";

    //Add the title
    let featureTitle = document.createElement("strong");
    featureTitle.className = "card-header py-1";
    featureTitle.innerHTML = "<strong><a href=\"https://minecraftcapes.net\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">MinecraftCapes</a> Ears</strong>";
    featureDiv.appendChild(featureTitle);

    //Add the body
    let featureBody = document.createElement("div");
    featureBody.className = "card-body text-center";
    featureDiv.appendChild(featureBody);

    //Add the image
    let featureImage = document.createElement("img");
    let featureImageStyles = "image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -o-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: optimize-contrast; image-rendering: pixelated; -ms-interpolation-mode: nearest-neighbor;"
    featureImage.setAttribute("style", featureImageStyles)
    featureImage.style.width = "25%";
    featureImage.src = "data:image/png;base64," + base64Ears;

    //Puts the image in a href
    let featureImageHref = document.createElement("a");
    featureImageHref.href = "https://minecraftcapes.net/profile/" + profileUuid + "/ears?" + Date.now();
    featureImageHref.target = "_blank";
    featureImageHref.appendChild(featureImage);
    featureBody.appendChild(featureImageHref);

    //Insert the div
    let profileLeft = document.querySelector(".input-group.input-group-sm.my-2").parentElement.parentElement;
    profileLeft.parentElement.insertBefore(featureDiv, profileLeft);
}

/**
 * Creates the skin viewer
 */
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
        toggleCustomAnimation(event.target);
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
    featureElytraButton.addEventListener('click', (event) => {
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

    //Get skin
    let skinHash = $(".skin-3d").attr("data-skin-hash")
    let skinUrl = textureURL(skinHash);

    //Insert the div
    let profileLeft = document.querySelectorAll(".order-md-1 > .card.mb-3")[1]
    profileLeft.parentElement.insertBefore(featureDiv, profileLeft);

    this.skinViewer = new skinview3d.SkinViewer({
        canvas: document.getElementById("skin_container"),
        width: 300,
        height: 400,
        skin: skinUrl,
        cape: this.finalCape,
        ears: this.finalEars
    });

    this.skinViewer.loadCape("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgBAMAAABQs2O3AAAAKlBMVEUAAABOTk6NjY2Hh4d7e3tzc3NsbGxZWVlKSkpVVVVoaGiEhIR/f39jY2OSVXT6AAAAAXRSTlMAQObYZgAAAKdJREFUOMtjQAOMgsbGxgz4gCADISDYKCiIX0GHoKAAPgWMQAWClClobBQsx69AYnp5Ah4FnB2SM2vxKphZXj5rAR4F7NOnl6cFYJU6AKHm3kpLC8anYFXaslRnrAoMYAqyQp3xmbA01MUlGqsCBQgV4uri4oRPAatLaIgRVgUboApCXHx24zOBx8ZYSQmfAgYj603YFQTAFChpG+NVwGwEtGIUUBsAADaTIwwcJYk6AAAAAElFTkSuQmCC");

    // Control objects with your mouse!
    let control = skinview3d.createOrbitControls(this.skinViewer);
    control.enableRotate = true;
    control.enableZoom = false;
    control.enablePan = false;

    this.skinViewerWalk = this.skinViewer.animations.add(skinview3d.WalkingAnimation);
    this.skinViewerWalk.paused = true;

    //Set style
    document.getElementById("skin_container").style.filter = "drop-shadow(-5px 5px 7px rgba(0, 0, 0, 0.4))"
    document.getElementById("skin_container").style.outline = "none"
    document.getElementById("skin_container").style.width = "100%"

document.querySelectorAll(".order-md-1 > .card.mb-3")[0].remove();
}

/**
 * Creates the skin events
 */
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

/**
 * Creates the cape events
 */
function createCapeEvents(base64Cape_capemod, base64CapeLaby) {
    let capeChildren = document.getElementsByClassName("cape-2d")
    for (var i = 0; i < capeChildren.length; i++) {
        capeChildren[i].addEventListener('mouseover', (event) => {
            for (var i = 0; i < capeChildren.length; i++) {
                capeChildren[i].classList.remove("skin-button-selected");
            }

            event.target.classList.add("skin-button-selected");
            let capeHash = event.target.getAttribute("data-cape-hash")
            if(capeHash != undefined && capeHash != "minecraftcapes-mod" && capeHash != "labymod-cape") {
                let capeUrl = "https://texture.namemc.com/" + capeHash.substring(0, 2) + "/" + capeHash.substring(2, 4) + "/" + capeHash + ".png";
                this.skinViewer.loadCape(capeUrl)
                console.log("capeEvent: Mojang/Optifine")
            } else if (capeHash == "minecraftcapes-mod" && base64Cape_capemod != null) {
                this.skinViewer.loadCape("data:image/png;base64," + base64Cape_capemod)
                console.log("capeEvent: capeMod")
            } else if (capeHash == "labymod-cape" && base64CapeLaby != null) {
              this.skinViewer.loadCape(base64CapeLaby)
              console.log("capeEvent: Laby")
            }

        })
    }
}

/**
 * Toggles the animation
 */
function toggleCustomAnimation(eventTarget) {
    this.skinViewerWalk.paused = !this.skinViewerWalk.paused;
}

//Turning image into canvas for cape cropping
function toCanvas(image, x, y, w, h) {
    x = (typeof x === 'undefined' ? 0 : x);
    y = (typeof y === 'undefined' ? 0 : y);
    w = (typeof w === 'undefined' ? image.width : w);
    h = (typeof h === 'undefined' ? image.height : h);
    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
    return canvas;
  }
  //Opaque image for cape cropping
  function Opaque(image) {
    let canvas = toCanvas(image);
    let ctx = canvas.getContext('2d');
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = data.data;
    for (let p = 3; p < pixels.length; p += 4) {
      pixels[p] = 255;
    }
    ctx.putImageData(data, 0, 0);
    return canvas;
  }
  //Cape Scaling for cape cropping
  function ScaleCape(height) {
    if (height % 22 === 0) {
      return height / 22;
    } else if (height % 17 === 0) {
      return height / 17;
    } else if (height >= 32 && (height & (height - 1)) === 0) {
      return height / 32;
    } else {
      return Math.max(1, Math.floor(height / 22));
    }
  }

  
  //Main Cape Crop Function
  function capeCrop(textureUrl, capeMod_cape) {
    var canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 128;
    let image = new Image();
    image.crossOrigin = '';
    image.src = textureUrl;
    image.onload = function () {
      let cs = image ? ScaleCape(image.height) : null;
      let opaque = Opaque(image);
      let ctx = canvas.getContext('2d');
      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.msImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(opaque, cs, cs, 10 * cs, 16 * cs, 0, 0, canvas.width, canvas.height);
      var croppedCapeURL = canvas.toDataURL();
      console.log("cape has been cropped");

      labyCapeDataURL = croppedCapeURL;
      labyCapeData = labyCapeDataURL.replace("data:image/png;base64,","");
      console.log("labyCapeData = done \n" + labyCapeData);

      createLabyCapeCard(labyCapeData);
        console.log("created Laby Cape Card");
        createSkinEvents();
        console.log("created Skin Events");
        labyResize(capeMod_cape);
        toDataURL(
          'https://api.gapple.pw/cors/labymod/cape/' + profileUuid,
          function (dataUrl) {
            labyResize(dataUrl, capeMod_cape);
          }
        )
        
        //createCapeEvents(capeMod_cape, );
        //console.log("created cape events");
        
    };
  }

function labyResize(labyData, capeMod_cape) {

  var c = document.createElement("canvas");
    c.width = 2048;
    c.height = 1024;
    var ctx = c.getContext("2d");
    var imageObj1 = new Image();
    imageObj1.src = labyData;
    imageObj1.onload = async() => {
        await ctx.drawImage(imageObj1, 0, 0, 704, 544);
        var laby_SV3D_URL = await c.toDataURL("image/png");
        createCapeEvents(capeMod_cape, laby_SV3D_URL);
                   
        c.remove();
    };
}

function toDataURL(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}