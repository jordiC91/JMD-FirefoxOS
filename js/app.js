window.addEventListener('DOMContentLoaded', function() {

    /* Accueil. */
    
    $("#adminChoice").click(function(event){
        $.mobile.changePage("#connexion", { transition: "slideup", changeHash: false });
    });
    
     $("#etudiantChoice").click(function(event){
        $.mobile.changePage("#accueilEtudiant", { transition: "slideup", changeHash: false });
    });
   
    // Administrateur.
    
    /* Connexion. */
    
    $("#btnConnexion").click(function(event) {        
        $.mobile.changePage("#favoriAdmin", { transition: "slideup", changeHash: false });
    });
    
    /* Accueil. */
    
    $("#favoriAdmin").on("swipeleft", function() {
        $.mobile.changePage("#etabAdmin", { changeHash: false });
    });
    
    $("#etabAdmin").on("swipeleft", function() {
        $.mobile.changePage("#diplomesAdmin", { changeHash: false });
    });
    
    $("#etabAdmin").on("swiperight", function() {
        $.mobile.changePage("#favoriAdmin", { changeHash: false });
    });
    
    $("#diplomesAdmin").on("swiperight", function() {
        $.mobile.changePage("#etabAdmin", { changeHash: false });
    });
    
    /* Liste des établissements. */
    
    $.get("http://5.39.94.146:8080/JMD/webresources/etablissement/getAll", function(datas) {
        for (var i = 0; i < datas.length; i++) {            
          $("#listviewEtabAdmin").append("<li>" + datas[i].nom + "<br>" + "<p>" + datas[i].ville + "</p>" + "</li>");
        }
        
        $("#listviewEtabAdmin").listview("refresh");
    });
    
    /* Liste des diplômes. */
    
    $.get("http://5.39.94.146:8080/JMD/webresources/diplome/getAll", function(datas) {
        for (var i = 0; i < datas.length; i++) {
          $("#listviewDipAdmin").append("<li>" + datas[i].nom + "</li>");
        }
        
        $("#listviewDipAdmin").listview("refresh");
    });
    
    $("#listviewDipAdmin").click(function(event) {        
        $.mobile.changePage("#listeAnneeAdmin", { transition: "slideup", changeHash: false });
    });
    
    /* Liste des années. */
    
    
    
    /* Liste des UE. */
    
    
    
    /* Liste des matières. */
    
    
    
});
