chrome.storage.local.get(function (result) {
  console.log(result.HideBLC);
  if (result.HideBLC == true) {
    try {
      document.querySelector(".badlion").remove();
    } catch {}
  }
});
