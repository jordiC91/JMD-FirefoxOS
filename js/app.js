window.addEventListener('DOMContentLoaded', function() {

    /* Accueil. */
    
    $("#listChoixAccueil").click(function(event) {
        if (event.target.id.indexOf("adminLi") > -1) {
          $.mobile.changePage("#listeEtabAdmin", { transition: "slideup", changeHash: false });
        }
        
        if (event.target.id.indexOf("etudiantLi") > -1) {
          $.mobile.changePage("#accueilEtudiant", { transition: "slideup", changeHash: false });
        }
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
          $("#listDiplomeAdmin").append("<li>" + datas[i].nom + "</li>");
          $("#listDiplomeAdmin").listview("refresh");
        }
    });
});
