const customCapes = {
    "capes": {
        "marc": {
            "name": "Marc",
            "file": "???",
            "displayImage": "???",
            "redirect": "",
            "users": [
                "88e152f3-e545-4681-8cec-3e8f85175902"
            ]
        }
    }
};

const randomUserProfile = users => {
    if (users.length < 1) return null;
    return `https://namemc.com/profile/${users[Math.floor(Math.random() * users.length)]}`;
}

// intended to run when the cape section of namemc is loaded
function LoadCustomCapes() {

    const _capeMaster = document.getElementsByClassName("row small-gutters justify-content-center")[0];
    Object.entries(customCapes.capes).forEach(_entry => {

        const _cape = _entry[1];

        const _capeDiv = _capeMaster.appendChild(document.createElement("div"));
        _capeDiv.setAttribute("class", "col-6 col-md");

        if (!_cape.redirect) {
            _cape.redirect = randomUserProfile(_cape.users);
        }

        _capeDiv.innerHTML = 
        `<a href="https://namemc.com/profile/${_cape.users[0]}">
            <div class="card mb-2">
                <div class="card-header text-center text-nowrap text-ellipsis p-1" translate="no">${_cape.name}</div>
                <div class="card-body position-relative text-center checkered p-0">
                    <div>
                        <img class="auto-size-square" loading="lazy" width="280" height="280" src="${_cape.displayImage}" data-src="${_cape.displayImage}" alt="${_cape.name}" title="${_cape.name}">
                    </div>
                    <div class="position-absolute bottom-0 right-0 text-muted mx-1">★${_cape.users.length}</div>
                </div>
            </div>
        </a>`;

    })

}

// intended to run when a user's page is loaded
function LoadUserCustomCapes(uuid) {

    // get user special capes and return if there are none
    const _userCapes = [];
    Object.entries(customCapes.capes).forEach(_cape => {
        if(_cape[1].users.includes(uuid)) {
            _userCapes.push(_cape[1]);
        }
    })
    if (_userCapes === []) return;

    // prepare user cape list
    const _capeMaster = document.getElementsByClassName("col-md-auto order-md-1")[0].appendChild(document.createElement("div"));
    _capeMaster.setAttribute("class", "card mb-3");
    _capeMaster.innerHTML = 
    `<div class="card-header py-1">
        <strong>NameMC+ Capes (${_userCapes.length})</strong>
    </div>`; 
    
    const _capeDiv = _capeMaster.appendChild(document.createElement("div"));
    _capeDiv.setAttribute("class", "card-body");
    _capeDiv.setAttribute("style", "padding: 2px");

    const _capeArea = _capeDiv.appendChild(document.createElement("div"));
    _capeArea.setAttribute("style", "width: 324px; margin: auto; text-align: center;");

    // add user capes
    _userCapes.forEach(_cape => {
        const _capeHref = _capeArea.appendChild(document.createElement("a"));
        if (!_cape.redirect) {
            _cape.redirect = randomUserProfile(_cape.users);
        }
        _capeHref.setAttribute("href", _cape.redirect);
        _capeHref.setAttribute("title", _cape.name);

        const _capeCanvas = _capeHref.appendChild(document.createElement("canvas"));
        _capeCanvas.setAttribute("class", "cape-2d align-top skin-button");
        _capeCanvas.setAttribute("width", "40");
        _capeCanvas.setAttribute("height", "64");

        const _ctx = _capeCanvas.getContext("2d");
        const _img = new Image();
        _img.onload = () => {
            _ctx.drawImage(_img, 1, 1, 10, 16);
        };
        _img.src = _cape.file;
    })

}