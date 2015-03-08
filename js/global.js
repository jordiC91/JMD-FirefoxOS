window.addEventListener('DOMContentLoaded', function() {

    /* Redirection de l'utilisateur vers l'écran qu'il a défini, s'il existe. */

    if (localStorage.getItem("accueilChoice") == "etudiant") {
      $.mobile.changePage("#accueilEtudiant", { transition: "slideup", changeHash: false });
    } else if (localStorage.getItem("accueilChoice") == "administrateur") {

      if ((localStorage.getItem("pseudo") != "null") && (localStorage.getItem("token") != "null")) {
           $.mobile.changePage("#accueilAdmin", { transition: "slideup", changeHash: false });
      } else {
           $.mobile.changePage("#connexion", { transition: "slideup", changeHash: false });
      }
    }

    /* Accueil. */
    
    $("#adminChoice").click(function(event) {
        if ($("#rememberChoice").is(":checked")) {
          localStorage.setItem("accueilChoice", "administrateur");
        }

        if ((localStorage.getItem("pseudo") != "null") && (localStorage.getItem("token") != "null")) {
           $.mobile.changePage("#accueilAdmin", { transition: "slideup", changeHash: false });
        } else {
           $.mobile.changePage("#connexion", { transition: "slideup", changeHash: false });
        }
    });
    
    $("#etudiantChoice").click(function(event) {
        if ($("#rememberChoice").is(":checked")) {
          localStorage.setItem("accueilChoice", "etudiant");
        }

        $.mobile.changePage("#accueilEtudiant", { transition: "slideup", changeHash: false });
    });
});


/**
 * Méthode permettant de déconnecter l'utilisateur (clear du localstorage et redirection vers la page de connexion).
 */
function deconnexion() {
   localStorage.setItem("pseudo", null);
   localStorage.setItem("token", null);

   sessionStorage.setItem("currentTab", null);
               
   $.mobile.changePage("#connexion", { transition: "slideup", changeHash: false });
};

/**
 * Méthode permettant de changer de page
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

function hideLoadingCircle() {
    $.mobile.loading('hide');
}