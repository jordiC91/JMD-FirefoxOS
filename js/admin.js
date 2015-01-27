window.addEventListener('DOMContentLoaded', function() {
    
    $("#etudiantChoice").click(function(event){
        $.mobile.changePage("#accueilEtudiant", { transition: "slideup", changeHash: false });
    });
   
    // Administrateur.

    function deconnexion() {
        localStorage.setItem("pseudo", null);
        localStorage.setItem("token", null);
                
        $.mobile.changePage("#connexion", { transition: "slideup", changeHash: false });
    };
    
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
    
    /* Connexion. */
    
    $("#btnConnexion").click(function(event) {  
        var pseudo = $("#pseudo").val();
        var password = $("#password").val();

        if ((pseudo.length == 0) || (password.length == 0)) {
            alert("Pseudo et / ou mot de passe vide.")
        } else {    
            $.post(REST_API_URL + "admin/login", {username: pseudo, password: $.sha256(password)}, function(data) {
               localStorage.setItem("token", data);
               localStorage.setItem("pseudo", pseudo);
                
               $.mobile.changePage("#favoriAdmin", { transition: "slideup", changeHash: false });
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
               if (errorThrown.indexOf("Unauthorized") > -1) { // 401
                   alert("Identifiants incorrects.");
               } else if (errorThrown.indexOf("Forbidden") > -1) { // 403
                   alert("Compte non activé.");
               } else {
                   alert("Erreur inconnue.");
               }
            });
        }
    });

    /* Création d'un établissement. */

    $("#btnCreateEtabAdmin").click(function(event){
        
    });

    /* Création d'un diplôme. */

    $("#btnCreateDipAdmin").click(function(event){
        
    });

    /* Création d'une année. */

    $("#btnCreateAnnAdmin").click(function(event){
        
    });

    /* Création d'une UE. */

    $("#btnCreateUEAdmin").click(function(event){
        
    });

    /* Création d'une matière. */

    $("#btnCreateMatAdmin").click(function(event){
        
    });
    
    /* Liste des favoris. */
    
    $(document).on("pageinit","#favoriAdmin",function() {
       initFavAdmin();
    });
    
    function initFavAdmin() {
        $.get(REST_API_URL + "annee/getFavorites?pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
            $('#listviewFavAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {            
              $("#listviewFavAdmin").append("<li>" + datas[i].nom + "<br><p>" + datas[i].etablissement.nom + " - " + datas[i].etablissement.ville + "</p></li>");
            }

            $("#listviewFavAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (errorThrown.indexOf("Unauthorized") > -1) {
                deconnexion();
            } else {
                alert("Erreur inconnue.");
            }
         }); 
    };
    
    /* Liste des établissements. */
    
    $(document).on("pageshow","#etabAdmin", function() {
       initEtabAdmin();
    });
    
    function initEtabAdmin() {
        $.get(REST_API_URL + "etablissement/getAll", function(datas) {
            $('#listviewEtabAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {            
              $("#listviewEtabAdmin").append("<li>" + datas[i].nom + "<br><p>" + datas[i].ville + "</p></li>");
            }

            $("#listviewEtabAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert("Erreur.");
        }); 
    };
    
    /* Liste des diplômes. */
    
    $(document).on("pageshow","#diplomesAdmin",function() {
       initDipAdmin();
    });
    
    function initDipAdmin() {
        $.get(REST_API_URL + "diplome/getAll", function(datas) {
            $('#listviewDipAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {
              $("#listviewDipAdmin").append("<li id=" + datas[i].idDiplome + ">" + datas[i].nom + "</li>");
                
              $("#" + datas[i].idDiplome).click(function(event) {
                localStorage.setItem("idDiplome", this.id);

                setTimeout(function() { 
                    $.mobile.changePage("#listeAnneeAdmin", { transition: "slideup", changeHash: false });
                }, 100);
              });
            }

            $("#listviewDipAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert("Erreur.");
        }); 
    };
    
    /* Liste des années. */

    $(document).on("pageshow","#listeAnneeAdmin", function(e, data) {
       var idDip = localStorage.getItem("idDiplome");
       initAnnAdmin(idDip);
       localStorage.setItem("idDiplome", null);
    });
    
    function initAnnAdmin(idDip) {
        $.get(REST_API_URL + "annee/getAnneesByDiplome?idDiplome=" + idDip, function(datas) {
            $('#listviewAnnAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {
              $("#listviewAnnAdmin").append("<li id=" + datas[i].idAnnee + ">" + datas[i].nom + "</li>");
              
              $("#" + datas[i].idAnnee).click(function(event) {
                localStorage.setItem("idAnnee", this.id);

                setTimeout(function() { 
                    $.mobile.changePage("#listeUEAdmin", { transition: "slideup", changeHash: false });
                }, 100);
              });
            }

            $("#listviewAnnAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert("Erreur.");
        }); 
    };
    
    /* Liste des UE. */
    
    $(document).on("pageshow","#listeUEAdmin", function() {
       var idAnnee = localStorage.getItem("idAnnee");
       initUEAdmin(idAnnee);
       localStorage.setItem("idAnnee", null);
    });
    
    function initUEAdmin(idAnnee) {
        $.get(REST_API_URL + "ue/getAllUEOfAnnee?idAnnee=" + idAnnee, function(datas) {
            $('#listviewUEAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {
              $("#listviewUEAdmin").append("<li id=" + datas[i].idUE + ">" + datas[i].nom + "</li>");
                
              $("#" + datas[i].idUE).click(function(event) {
                localStorage.setItem("idUE", this.id);
                $.mobile.changePage("#listeMatAdmin", { transition: "slideup", changeHash: false });
              });
            }

            $("#listviewUEAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert("Erreur.");
        }); 
    };
    
    /* Liste des matières. */
    
    $(document).on("pageshow","#listeMatAdmin",function() {
       var idUE = localStorage.getItem("idUE");
       initMatAdmin(idUE);
       localStorage.setItem("idUE", null);
    });
    
    function initMatAdmin(idUE) {
        $.get(REST_API_URL + "matiere/getAllMatieretOfUE?idUE=" + idUE, function(datas) {
            $('#listviewMatAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {
              $("#listviewMatAdmin").append("<li id=" + datas[i].idMatiere + ">" + datas[i].nom + "</li>");
            }

            $("#listviewMatAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            alert("Erreur.");
        }); 
    };
    
});
