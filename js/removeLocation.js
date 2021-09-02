
chrome.storage.local.get(function (result) {
    if (result.HideLocation == true) {
      document.querySelector("body > main > div.row > div.col-12.col-md-6.col-lg-5 > div:nth-child(2) > img").remove();
      document.querySelector("body > main > div.row > div.col-12.col-md-6.col-lg-5 > div:nth-child(2) > div.card-body.py-1 > div:nth-child(4) > div.col-auto.text-nowrap > strong").innerHTML = "Ping";
      //document.querySelector(".badlion-card").remove();
      a = document.querySelector("body > main > div.row > div.col-12.col-md-6.col-lg-5 > div:nth-child(2) > div.card-body.py-1 > div:nth-child(4) > div.col.text-nowrap.text-right").innerHTML;
      b = a.indexOf("(");
      c = a.slice(b)
      document.querySelector("body > main > div.row > div.col-12.col-md-6.col-lg-5 > div:nth-child(2) > div.card-body.py-1 > div:nth-child(4) > div.col.text-nowrap.text-right").innerHTML = c;
      
    }
  });
  