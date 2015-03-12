window.addEventListener('DOMContentLoaded', function() {

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
    
    $("#adminChoice").click(function(event) {
        if ($("#rememberChoice").is(":checked")) {
          localStorage.setItem("accueilChoice", "administrateur");
        }

        if ((localStorage.getItem("pseudo") != "null") && (localStorage.getItem("token") != "null")) {
          changePage("accueilAdmin");
        } else {
          changePage("connexion");
        }
    });
    
    $("#etudiantChoice").click(function(event) {
        if ($("#rememberChoice").is(":checked")) {
          localStorage.setItem("accueilChoice", "etudiant");
        }

        changePage("accueilEtudiant");
    });
});

// Ces méthodes sont globales car utilisées dans toute la partie admin.

/**
 * Méthode permettant de déconnecter l'utilisateur (clear du localstorage et redirection vers la page de connexion).
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