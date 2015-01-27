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
   
    // Administrateur.
    
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
               if (errorThrown.indexOf("Unauthorized") > -1) {
                   alert("Identifiants incorrects.");
               } else {
                   alert("Erreur inconnue.");
               }
            });
        }
    });
    
    /* Liste des favoris. */
    
    $(document).on("pageshow","#favoriAdmin",function() {
       initFavAdmin();
    });
    
    function initFavAdmin() {
        $.get(REST_API_URL + "annee/getFavorites?pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
            for (var i = 0; i < datas.length; i++) {            
              $("#listviewFavAdmin").append("<li>" + datas[i].nom + "<br><p>" + datas[i].etablissement.nom + " - " + datas[i].etablissement.ville + "</p></li>");
            }

            $("#listviewFavAdmin").listview("refresh");
        }); 
    };
    
    /* Liste des établissements. */
    
    $(document).on("pageshow","#etabAdmin",function() {
       initEtabAdmin();
    });
    
    function initEtabAdmin() {
        $.get(REST_API_URL + "etablissement/getAll", function(datas) {
            for (var i = 0; i < datas.length; i++) {            
              $("#listviewEtabAdmin").append("<li>" + datas[i].nom + "<br><p>" + datas[i].ville + "</p></li>");
            }

            $("#listviewEtabAdmin").listview("refresh");
        });
    };
    
    /* Liste des diplômes. */
    
    $(document).on("pageshow","#diplomesAdmin",function() {
       initDipAdmin();
    });
    
    function initDipAdmin() {
        $.get(REST_API_URL + "diplome/getAll", function(datas) {
            for (var i = 0; i < datas.length; i++) {
              $("#listviewDipAdmin").append("<li>" + datas[i].nom + "</li>");
            }

            $("#listviewDipAdmin").listview("refresh");
        });
    };
    
    $("#listviewDipAdmin").click(function(event) {        
        $.mobile.changePage("#listeAnneeAdmin", { transition: "slideup", changeHash: false });
    });
    
    /* Liste des années. */
    
    $(document).on("pageshow","#listeAnneeAdmin",function() {
       initAnnAdmin();
    });
    
    function initAnnAdmin() {
        
    };
    
    /* Liste des UE. */
    
    $(document).on("pageshow","#listeUEAdmin",function() {
       initUEAdmin();
    });
    
    function initUEAdmin() {
        
    };
    
    /* Liste des matières. */
    
    $(document).on("pageshow","#listeMatAdmin",function() {
       initMatAdmin();
    });
    
    function initMatAdmin() {
        
    };
    
});
