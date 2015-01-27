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
