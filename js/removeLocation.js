chrome.storage.local.get(function (result) {
    if (result.hideLocation == true) {

        const DEL_SELECTOR = 'body > main > div.row > div.col-12.col-md-6.col-lg-5 > div:nth-child(2) > img';
            const mo = new MutationObserver(onMutation);
            // in case the content script was injected after the page is partially loaded
            onMutation([{addedNodes: [document.documentElement]}]);
            observe();
            function onMutation(mutations) {
            const toRemove = [];
            for (const {addedNodes} of mutations) {
                for (const n of addedNodes) {
                if (n.tagName) {
                    if (n.matches(DEL_SELECTOR)) {
                        fixText();
                        toRemove.push(n);
                    } else if (n.firstElementChild && n.querySelector(DEL_SELECTOR)) {
                    toRemove.push(...n.querySelectorAll(DEL_SELECTOR));
                    }
                }
                }
            }
            if (toRemove.length) {
                mo.disconnect();
                for (const el of toRemove) el.remove();
                observe();
            }
            }
            function observe() {
            mo.observe(document, {
                subtree: true,
                childList: true,
            });
            }
            function fixText() {
                document.querySelector("body > main > div.row > div.col-12.col-md-6.col-lg-5 > div:nth-child(2) > div.card-body.py-1 > div:nth-child(4) > div.col-auto.text-nowrap > strong").innerHTML = "Ping";
                a = document.querySelector("body > main > div.row > div.col-12.col-md-6.col-lg-5 > div:nth-child(2) > div.card-body.py-1 > div:nth-child(4) > div.col.text-nowrap.text-right").innerHTML;
                b = a.indexOf("(");
                c = a.slice(b)
                document.querySelector("body > main > div.row > div.col-12.col-md-6.col-lg-5 > div:nth-child(2) > div.card-body.py-1 > div:nth-child(4) > div.col.text-nowrap.text-right").innerHTML = c;
            }
    }
  });
  