const navigationBar = document.querySelector("nav > ul");

const testerMenuItem = document.createElement("li");
testerMenuItem.className = "nav-item";
testerMenuItem.innerHTML = `
    <a class="nav-link" href="/plus/cape-tester">
        <i class="fas fa-rectangle-portrait menu-icon d-none d-xl-inline-block"></i>Tester
    </a>
`

navigationBar.appendChild(testerMenuItem);