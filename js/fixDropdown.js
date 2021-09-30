$('[data-toggle=dropdown]').dropdown({
  selector: '[data-toggle=dropdown]',
  display: "static"
});

document.querySelectorAll('[data-toggle=dropdown]').forEach(
  function (element) {
    element.classList.add("pointer-all");
  });

document.querySelector("#header > div:nth-child(1) > nav > a > span").innerText = "NameMC+";
