window.addEventListener('DOMContentLoaded', function() {

    /* Accueil. */
    
    $("#adminChoice").click(function(event){
        if (localStorage.getItem("pseudo") != null) {
           $.mobile.changePage("#favoriAdmin", { transition: "slideup", changeHash: false });
        } else {
           $.mobile.changePage("#connexion", { transition: "slideup", changeHash: false });
        }
    });
    
    $("#etudiantChoice").click(function(event){
        $.mobile.changePage("#accueilEtudiant", { transition: "slideup", changeHash: false });
    });
});


/**
 * Méthode permettant de déconnecter l'utilisateur (clear du localstorage et redirection vers la page de connexion).
 */
function deconnexion() {
   localStorage.setItem("pseudo", null);
   localStorage.setItem("token", null);
               
   $.mobile.changePage("#connexion", { transition: "slideup", changeHash: false });
};

/**
 * Méthode permettant de montrer un rond de chargement.
 */
function showLoadingCircle() {
   $.mobile.loading('show', {
       text: 'Chargement',
       textVisible: true
   });
};