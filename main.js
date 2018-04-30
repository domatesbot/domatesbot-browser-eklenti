var siteListesi = [];
siteListesi.push("beeg.com");
siteListesi.push("xhamster.com");
siteListesi.push("youporn.com");
siteListesi.push("redtube.com");
siteListesi.push("3movs.com");
siteListesi.push("tubxporn.com");
chrome.storage.local.get(['apiURL'], function(getApiURL) {
    chrome.storage.local.get(['domatesToken'], function(getDomatesToken) {
        if(getDomatesToken.domatesToken && getDomatesToken.domatesToken != null){
            var x = document.URL;
            for (let index = 0; index < siteListesi.length; index++) {
                const element = siteListesi[index];
                if(x.indexOf(element) !== -1){
                    injectScript(chrome.extension.getURL("assets/js/inject.js"),getDomatesToken,getApiURL);
                }
            }
        }
    });
});

function injectScript(location,domatesToken,apiURL){
  var key = document.createElement('script');
  key.setAttribute("type","text/javascript");
  key.text = "var apiURL = '"+ apiURL.apiURL +"'; var domatesKey = '" + domatesToken.domatesToken + "';";
  document.getElementsByTagName("head")[0].appendChild(key);
  var a = document.createElement('script');
  a.setAttribute("type","text/javascript");
  a.setAttribute("src", location);
  document.getElementsByTagName("head")[0].appendChild(a);
}
