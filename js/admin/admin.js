window.addEventListener('DOMContentLoaded', function() {
    
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
            showLoadingCircle();

            $.post(REST_API_URL + "admin/login", {username: pseudo, password: $.sha256(password)}, function(data) {
               $.mobile.loading('hide');

               localStorage.setItem("token", data);
               localStorage.setItem("pseudo", pseudo);
                
               $.mobile.changePage("#favoriAdmin", { transition: "slideup", changeHash: false });
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
               $.mobile.loading('hide');

               if (jqXHR.status == 401) { 
                  alert("Identifiants incorrects. Veuillez réessayer.");
               } else if (jqXHR.status == 403) {
                  alert("Compte non activé.");
               } else if (jqXHR.status == 500) {
                  alert("Erreur de BDD. Veuillez réessayer.");
               } else {
                  alert("Erreur inconnue.");
               }
            });
        }
    });

    /* Inscription. */

    $("#btnInscriptionValider").click(function(event) {
        var nom = $("#nomI").val();
        var prenom = $("#prenomI").val();
        var email = $("#emailI").val();
        var pseudo = $("#pseudoI").val();
        var password = $("#passwordI").val();
        var passwordAgain = $("#passwordAgainI").val();  

        if ((nom.length > 0) && (prenom.length > 0) && (email.length > 0) && (pseudo.length > 0) && (password.length > 0) && (passwordAgain.length > 0)) {
          if (password == passwordAgain) {
            $.get(REST_API_URL + "admin/subscription?nom=" + nom + "&prenom=" + prenom + "&email=" + email + "&pseudo=" + pseudo + "&password=" + password, function(datas) {
                alert('Succès de l\'inscription.\nCompte en attente de validation');
                $.mobile.changePage("#connexion", { transition: "slideup", changeHash: false });
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
              if (jqXHR.status == 403) {
                alert("Un utilisateur avec ces informations existe déjà.");
              } else if (jqXHR.status == 500) {
                alert("Erreur de BDD. Veuillez réessayer.");
              } else {
                alert("Erreur inconnue.");
              }
            });
          } else {
            alert("Les deux mots de passe entrés ne sont pas identiques.");
          }
        } else {
          alert("Au moins un des champs est vide.");
        }
    });

    /* Mot de passe oublié. */

    $("#btnPasswordOublieValider").click(function(event) {
        var pseudo = $("#pseudoM").val();

        if (pseudo.length > 0) {
          $.get(REST_API_URL + "admin/passwordOublie?pseudo=" + pseudo, function(datas) {
              alert('Instructions envoyées par mail.');
              $.mobile.changePage("#connexion", { transition: "slideup", changeHash: false });
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
              if (jqXHR.status == 404) { 
                  alert("Utilisateur inconnu.");
              } else if (jqXHR.status == 500) {
                  alert("Erreur de BDD. Veuillez réessayer.");
              } else {
                  alert("Erreur inconnue.");
              }
          }); 
        } else {
          alert("Le pseudo entré est vide.")
        }
    });
    
});