var girisYapildiMi = false;
var apiURL = null;
$(function(){
    $.get( "https://gist.githubusercontent.com/domatesbot/aac8bdf048296695554e0a1f15d73ea8/raw/", function( data ) { 
        //her zaman güncel api adresini almak için gist
        apiURL = JSON.parse(data).apiURL;
        chrome.storage.local.set({apiURL: apiURL}, function() {
            try{
                chrome.storage.local.get(['domatesToken'], function(result) {
                    chrome.storage.local.get(['domatesEmail'], function(domatesEmail) {
                        chrome.storage.local.get(['domatesName'], function(domatesName) {
                            chrome.storage.local.get(['domatesLastLogin'], function(domatesLastLogin) {
                                if(result.domatesToken && result.domatesToken != null){
                                    //burada tokenın kontrolünü yaptır.
                                    var url = apiURL + "/eklenti-kontrol";
                                 
                                    $.ajax({
                                        type: "POST",
                                        url: url,
                                        data: {
                                            name: domatesName.domatesName,
                                            email: domatesEmail.domatesEmail,
                                            extensionKey: result.domatesToken
                                        },
                                        json: true,
                                        success: function(data) { 
                                               if(data.success && data.giris){
                                                $("#isimDoldur").append(domatesName.domatesName);
                                                $("#sonGirisTarihi").append(domatesLastLogin.domatesLastLogin.date);
                                                $("#domatesGiris").hide();
                                                $("#girisYapili").show();
                                               }else {
                                                chrome.storage.local.set({domatesToken: null}, function() {});
                                               }
                                        },
                                        error: function(error) {
                                            $("#aa").html("error: " + JSON.stringify(error));
                                            chrome.storage.local.set({domatesToken: null}, function() {});
                                        }
                                    });
                                }else {
                                    //giriş yapılmamış
                                }
                            });
                        });
                    });
                });
            }catch (e){
                console.log(e);
            }
        });
      });



    $("#domatesGiris").submit(function(e) {
        var url = apiURL + "/eklenti-login";
        $.ajax({
               type: "POST",
               url: url,
               data: $("#domatesGiris").serialize(),
               json: true,
               success: function(data) {
                    $("#aa").html("data: " + JSON.stringify(data));
                    // data = JSON.parse(data);
                    if(data.success == true){
                        $("#aa").html("data: " + JSON.stringify(data));
                        chrome.storage.local.set({domatesToken: data.tokenKey}, function() {
                            chrome.storage.local.set({domatesEmail: data.email}, function() {});
                            chrome.storage.local.set({domatesName: data.name}, function() {});
                            chrome.storage.local.set({domatesLastLogin: data.lastLogin}, function() {});
                            $("#domatesGiris").hide();
                            $("#girisYapili").show();
                            chrome.tabs.getSelected(null, function(tab) {
                                var code = 'window.location.reload();';
                                chrome.tabs.executeScript(tab.id, {code: code});
                            });
                           
                        });
                    }else {
                        $("#aa").html("error1: " +  JSON.stringify(data));
                        chrome.storage.local.set({domatesToken: null}, function() {});
                    }
               },
               error: function(error){
                $("#aa").html("error: " + JSON.stringify(error));
                chrome.storage.local.set({domatesToken: null}, function() {});
               }
             });
    
        e.preventDefault(); // avoid to execute the actual submit of the form.
    });
    $("#logout").click(function(e) {
        chrome.storage.local.set({domatesToken: null}, function() {
            chrome.tabs.getSelected(null, function(tab) {
                var code = 'window.location.reload();';
                chrome.tabs.executeScript(tab.id, {code: code});
            });
            $("#girisYapili").hide();
            $("#domatesGiris").show();      
        });
    });


});