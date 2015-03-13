window.addEventListener('DOMContentLoaded', function() {
  //Enregistrement du token
    if (navigator.push) {
      // Request the endpoint. This uses PushManager.register().
      if (localStorage.getItem("tokenDevice") == null){
        var req = navigator.push.register();
        
        req.onsuccess = function(e) {
          var endpoint = req.result;
            console.log("New endpoint: " + endpoint );

            var token = endpoint.replace("https://updates.push.services.mozilla.com/update/", "");
            console.log(token);
            localStorage.setItem("tokenDevice", token);
          }

         req.onerror = function(e) {
           console.error("Error getting a new endpoint: " + JSON.stringify(e));
         }
      }
    } 

    // En cas de changement du PUSH REGISTER (MOZILLA SIDE)
    if (window.navigator.mozSetMessageHandler) {
      window.navigator.mozSetMessageHandler('push-register', function(e) {
        console.log('push-register received, I need to register my endpoint(s) again!');

        var req = navigator.push.register();
        req.onsuccess = function(e) {
          var endpoint = req.result;
          var newToken = endpoint.replace("https://updates.push.services.mozilla.com/update/", "");

          if (newToken != localStorage.getItem("tokenDevice")){
            $.get(REST_API_URL + "admin/updateTokenFFOS?old="+localStorage.getItem("tokenDevice")+"&new="+newToken, function(datas) {
                console.log(datas);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
            }); 
          }
        }
        req.onerror = function(e) {
          console.error("Error getting a new endpoint: " + JSON.stringify(e));
        }
      });
    }

    // Notification en approche
    if (window.navigator.mozSetMessageHandler) {
        window.navigator.mozSetMessageHandler('push', function(e) {
        $.get(REST_API_URL + "admin/lastMessage?token="+localStorage.getItem("tokenDevice"), function(datas) {
            console.log(datas);
            if (Notification.permission === "granted") {
              var options = {body:datas, icon:"img/icons/icon48x48.png"};
              var notification = new Notification("JMD",options);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }); 
      }); 
      } else {
        // No message handler
      }

    // Enregistrement du token
    if (navigator.push) {
      // Request the endpoint. This uses PushManager.register().
      if (localStorage.getItem("tokenDevice") == null){
        var req = navigator.push.register();
        
        req.onsuccess = function(e) {
          var endpoint = req.result;
            console.log("New endpoint: " + endpoint );

            var token = endpoint.replace("https://updates.push.services.mozilla.com/update/", "");
            console.log(token);
            localStorage.setItem("tokenDevice", token);
          }

         req.onerror = function(e) {
           console.error("Error getting a new endpoint: " + JSON.stringify(e));
         }
      }
    } 

    // En cas de changement du PUSH REGISTER (MOZILLA SIDE)
    if (window.navigator.mozSetMessageHandler) {
      window.navigator.mozSetMessageHandler('push-register', function(e) {
        console.log('push-register received, I need to register my endpoint(s) again!');

        var req = navigator.push.register();
        req.onsuccess = function(e) {
          var endpoint = req.result;
          var newToken = endpoint.replace("https://updates.push.services.mozilla.com/update/", "");

          if (newToken != localStorage.getItem("tokenDevice")){
            $.get(REST_API_URL + "admin/updateTokenFFOS?old="+localStorage.getItem("tokenDevice")+"&new="+newToken, function(datas) {
                console.log(datas);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
            }); 
          }
        }
        req.onerror = function(e) {
          console.error("Error getting a new endpoint: " + JSON.stringify(e));
        }
      });
    }

    // Notification en approche
    if (window.navigator.mozSetMessageHandler) {
        window.navigator.mozSetMessageHandler('push', function(e) {
        $.get(REST_API_URL + "admin/lastMessage?token="+localStorage.getItem("tokenDevice"), function(datas) {
            console.log(datas);
            if (Notification.permission === "granted") {
              var options = {body:datas, icon:"img/icons/icon48x48.png"};
              var notification = new Notification("JMD",options);
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }); 
      }); 
      } else {
        // No message handler
      }

    /* Redirection de l'utilisateur vers l'écran qu'il a défini, s'il existe. */

    if (localStorage.getItem("accueilChoice") == "etudiant") {
      changePage("accueilEtudiant");
    } else if (localStorage.getItem("accueilChoice") == "administrateur") {
      if ((localStorage.getItem("pseudo") != "null") && (localStorage.getItem("token") != "null")) {
          changePage("accueilAdmin");
      } else {
          changePage("connexion");
      }
    }

    /* Accueil. */
    
    // Listener du bouton "Administrateur" sur l'accueil de l'application.
    $("#adminChoice").click(function(event) {
        if ($("#rememberChoice").is(":checked")) { // Si la checkbox pour se souvenir du choix est coché, on sauve le choix.
          localStorage.setItem("accueilChoice", "administrateur");
        }

        if ((localStorage.getItem("pseudo") != "null") && (localStorage.getItem("token") != "null")) {
          changePage("accueilAdmin"); // L'utilisateur est déjà connecté, on le dirige vers l'accueil du côté admin.
        } else {
          changePage("connexion"); 
        }
    });
    
    // Listener du bouton "Etudiant" sur l'accueil de l'application.
    $("#etudiantChoice").click(function(event) {
        if ($("#rememberChoice").is(":checked")) { // Si la checkbox pour se souvenir du choix est coché, on sauve le choix.
          localStorage.setItem("accueilChoice", "etudiant");
        }

        changePage("accueilEtudiant");
    });
});

// Ces méthodes sont globales car utilisées dans toute la partie admin.

/**
 * Méthode permettant de déconnecter l'utilisateur.
 * Cclear du localstorage et redirection vers la page de connexion.
 */
function deconnexion() {
   localStorage.setItem("pseudo", null);
   localStorage.setItem("token", null);

   sessionStorage.setItem("currentTab", null);
               
   changePage("connexion");
};

/**
 * Méthode permettant de changer de page.
 * Utile le jour où on veut 
 */
function changePage(page) {
   $.mobile.changePage("#" + page, { transition: "slideup", changeHash: false });
};

/**
 * Méthode permettant de montrer un rond de chargement.
 */
function showLoadingCircle() {
    $.mobile.loading( "show", {
            text: "Chargement...",
            textVisible: true,
            theme: "a",
            textonly: false,
            html: ""
    });
};

/**
 * Méthode permettant de cacher un rond de chargement.
 */
function hideLoadingCircle() {
    $.mobile.loading('hide');
}

$(document).on('mobileinit', function () {
   $.mobile.ignoreContentEnabled = true;
   $.mobile.defaultPageTransition = "slide";
});

/**
 * Méthode permettant de parcourir un tableau d'objet et de chercher la position d'une clé ("nom").
 *
 * @param key La clé à chercher.
 * @param ueArray Le tableau à parcourir.
 */
function search(key, ueArray) {
    for (var i = 0; i < ueArray.length; i++) {
      if (key == ueArray[i].nom) {
         return i;
      }
    }

   return -1;
};