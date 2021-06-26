$('[data-toggle=dropdown]').dropdown({
  selector: '[data-toggle=dropdown]',
  display: "static"
});

document.querySelectorAll('[data-toggle=dropdown]').forEach(
  function (element) {
    element.classList.add("pointer-all");
  });
