chrome.storage.local.get(result => {
    if (result.browniePoints) {
        document.title = document.title.replace("NameMC ", "NameMC+ ");
        document.querySelector("nav > a").setAttribute("title", "Coding their website for them since 2021!")
        document.querySelector("nav > a > svg").setAttribute("viewBox", "-7 -7 14 14");
        document.querySelector("nav > a > svg > path").setAttribute("d", "M -1 1 L -1 5 L 1 5 L 1 1 L 5 1 L 5 -1 L 1 -1 L 1 -5 L -1 -5 L -1 -1 L -5 -1 L -5 1 L -1 1");
        document.querySelector("nav > a > span").innerHTML += "+"; 

        var link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
            }
        link.href = 'https://namemc.plus/icon128.png';
    }
})

const navigationBar = document.querySelector("nav > ul");

const testerMenuItem = document.createElement("li");
testerMenuItem.className = "nav-item";
testerMenuItem.innerHTML = `
    <a class="nav-link" href="/plus/cape-tester">
        <i class="fas fa-rectangle-portrait menu-icon d-none d-xl-inline-block"></i>Tester
    </a>
`

navigationBar.appendChild(testerMenuItem);
