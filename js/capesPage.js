const url = chrome.runtime.getURL('../json/customCapes.json');

const capes = fetch(url)
    .then((response) => response.json())
    .then((json) => {
        loadCapes(json);
    });

async function loadCapes(json) {
    const capesDiv = document.querySelector("main > div > div");

    capesDiv.innerHTML += `
        <div class="container mt-3">
            <h1 class="text-center">NameMC+ Capes</h1>
            <hr class="my-0">
            <br>
        </div>
    `

    json.capes.forEach(cape => {
        const capeDiv = document.createElement("div");
        capeDiv.className = "col-6 col-md";
        capeDiv.innerHTML = `
            <a href="https://namemc.com/profile/${cape.users[Math.floor(Math.random() * cape.users.length)]}">
                <div class="card mb-2">
                    <div class="card-header text-center text-nowrap text-ellipsis p-1" translate="no">${cape.name}</div>
                    <div class="card-body position-relative text-center checkered p-0">
                        <div>
                            <img class="auto-size-square" loading="lazy" width="280" height="280" style="image-rendering: pixelated;" src="${cape.image}" data-src="${cape.image}" alt="${cape.name}" title="${cape.name}">
                        </div>
                        <div class="position-absolute bottom-0 right-0 text-muted mx-1">★${cape.users.length}</div>
                    </div>
                </div>
            </a>
        `;
        capesDiv.appendChild(capeDiv);
    })
}