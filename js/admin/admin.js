window.addEventListener('DOMContentLoaded', function() {
    
    $("#btnBackAccueil").click(function(event) {  
      $.mobile.changePage("#accueil", { transition: "slideup", changeHash: false });
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
                
               $.mobile.changePage("#accueilAdmin", { transition: "slideup", changeHash: false });
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

    /* Clôturer le compte. */

    $("#cloturerCompte").click(function(event) {
        var confirmSuppr = confirm("Voulez-vous vraiment clôturer votre compte ?");

        if (confirmSuppr == true) {
            $.get(REST_API_URL + "admin/closeAdminAccount?pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
              $.mobile.loading('hide');

              alert("Votre compte a bien été clôturé.");
              deconnexion();
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                $.mobile.loading('hide');

                if (jqXHR.status == 401) {
                    alert("Session expirée.");
                    deconnexion();
                } else if (jqXHR.status == 500) {
                    alert("Erreur de BDD. Veuillez réessayer.");
                } else {
                    alert("Erreur inconnue.");
                }
            }); 
        }  
    });

    /* Nommer un administrateur. */

    $(document).on("pageshow","#nommerAdmin",function() {
       initAdminsWaiting();
    });
    
    function initAdminsWaiting() {
        showLoadingCircle();

        $.get(REST_API_URL + "admin/getAllAdminInactive", function(datas) {
            $.mobile.loading('hide');

            $('#listviewAdminsWaiting').empty();

            var listeAdmins = [];

            for (var i = 0; i < datas.length; i++) {   
              listeAdmins.push(datas[i]);

              $("#listviewAdminsWaiting").append("<li id=\"listeAdmins-" + datas[i].id + "\">" + datas[i].pseudo + "</li>");
            
              $("#listeAdmins-" + datas[i].id).click(function(event) {
                var pseudoToNominate = listeAdmins[$(this).index()].pseudo;
                var confirmSuppr = confirm("Voulez-vous vraiment nommer \"" + pseudoToNominate + "\" administrateur ?");

                if (confirmSuppr == true) {
                    $.get(REST_API_URL + "admin/nominateAdmin?pseudoToNominate=" + pseudoToNominate + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
                      $.mobile.loading('hide');

                      alert(pseudoToNominate + " a été nommé administrateur.");
                      location.reload();
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        $.mobile.loading('hide');

                        if (jqXHR.status == 401) {
                            alert("Session expirée.");
                            deconnexion();
                        } else if (jqXHR.status == 500) {
                            alert("Erreur de BDD. Veuillez réessayer.");
                        } else {
                            alert("Erreur inconnue.");
                        }
                    }); 
                }  
              });
            }

            if (datas.length == 0) {
              $("#listviewAdminsWaiting").append("<li>Aucun compte en attente.</li>");
            } 

            $("#listviewAdminsWaiting").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $.mobile.loading('hide');

            if (jqXHR.status == 401) {
                alert("Session expirée.");
                deconnexion();
            } else if (jqXHR.status == 500) {
                alert("Erreur de BDD. Veuillez réessayer.");
            } else {
                alert("Erreur inconnue.");
            }
        }); 
    }; 
    
});