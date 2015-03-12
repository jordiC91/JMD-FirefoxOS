window.addEventListener('DOMContentLoaded', function() {

    $("#btnBackAccueil").click(function(event) {  
      deconnexion();
    });

    $(document).on("pageshow","#accueilAdmin", function() {
      if ((sessionStorage.getItem("currentTab") == "null") || (sessionStorage.getItem("currentTab") == null) || (sessionStorage.getItem("currentTab") == "favoris")) {
        $("#tabFavoris").trigger("click");
      } else if (sessionStorage.getItem("currentTab") == "établissement") {
        $("#tabEtab").trigger("click");
      } else if (sessionStorage.getItem("currentTab") == "diplôme") {
        $("#tabDip").trigger("click");
      } else if (sessionStorage.getItem("currentTab") == "année") {
        $("#tabAnnee").trigger("click");
      } else if (sessionStorage.getItem("currentTab") == "autre") {
        $("#tabAutre").trigger("click");
      }
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
               hideLoadingCircle();

               localStorage.setItem("token", data);
               localStorage.setItem("pseudo", pseudo);
                
               changePage("accueilAdmin");
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
               hideLoadingCircle();

               if (jqXHR.status == 401) { 
                  alert("Identifiants incorrects. Veuillez réessayer.");
               } else if (jqXHR.status == 403) {
                  alert("Compte non activé.");
               } else if (jqXHR.status == 500) {
                  alert("Erreur de BDD. Veuillez réessayer.");
               } else {
                  alert("Erreur inconnue.");
                  console.log(jqXHR);
               }
            });
        }
    });

    /* Inscription. */

    $("#btnInscriptionValider").click(function(event) {
        var nom = $("#nomI").val();
        var prenom = $("#prenomI").val();
        var email = $("#emailI").val();
        var emailAgain = $("#emailAgainI").val();
        var pseudo = $("#pseudoI").val();
        var password = $("#passwordI").val();
        var passwordAgain = $("#passwordAgainI").val();  

        if ((nom.length > 0) && (prenom.length > 0) && (email.length > 0) && (emailAgain.length > 0) && (pseudo.length > 0) && (password.length > 0) && (passwordAgain.length > 0)) {
          if (password == passwordAgain) {
            if (email == emailAgain) {
              showLoadingCircle();

              $.get(REST_API_URL + "admin/subscription?nom=" + nom + "&prenom=" + prenom + "&email=" + email + "&pseudo=" + pseudo + "&password=" + password, function(datas) {
                  hideLoadingCircle();
                  alert('Succès de l\'inscription.\nVotre compte est maintenant en attente de validation');
                  changePage("connexion");
              })
              .fail(function(jqXHR, textStatus, errorThrown) {
                hideLoadingCircle();

                if (jqXHR.status == 403) {
                  alert("Un utilisateur avec ces informations existe déjà.");
                } else if (jqXHR.status == 500) {
                  alert("Erreur de BDD. Veuillez réessayer.");
                } else {
                  alert("Erreur inconnue.");
                  console.log(jqXHR);
                }
              });
            } else {
              alert("Les deux emails entrés ne sont pas identiques.");
            }
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
          showLoadingCircle();

          $.get(REST_API_URL + "admin/passwordOublie?pseudo=" + pseudo, function(datas) {
              hideLoadingCircle();
              alert('Instructions envoyées par mail.');
              changePage("connexion");
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
              hideLoadingCircle();

              if (jqXHR.status == 404) { 
                  alert("Utilisateur inconnu.");
              } else if (jqXHR.status == 500) {
                  alert("Erreur de BDD. Veuillez réessayer.");
              } else {
                  alert("Erreur inconnue.");
                  console.log(jqXHR);
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
            showLoadingCircle();

            $.get(REST_API_URL + "admin/closeAdminAccount?pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
              hideLoadingCircle();
              alert("Votre compte a bien été clôturé.");
              deconnexion();
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                hideLoadingCircle();

                if (jqXHR.status == 401) {
                    alert("Session expirée.");
                    deconnexion();
                } else if (jqXHR.status == 500) {
                    alert("Erreur de BDD. Veuillez réessayer.");
                } else {
                    alert("Erreur inconnue.");
                    console.log(jqXHR);
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
            hideLoadingCircle();

            $('#listviewAdminsWaiting').empty();

            var listeAdmins = [];

            for (var i = 0; i < datas.length; i++) {   
              listeAdmins.push(datas[i]);

              $("#listviewAdminsWaiting").append("<li id=\"listeAdmins-" + datas[i].id + "\">" + datas[i].pseudo + "<br /><p>" + datas[i].email + "</p></li>");
            
              $("#listeAdmins-" + datas[i].id).click(function(event) {
                var pseudoToNominate = listeAdmins[$(this).index()].pseudo;
                var confirmSuppr = confirm("Voulez-vous vraiment nommer \"" + pseudoToNominate + "\" administrateur ?");

                if (confirmSuppr == true) {
                    $.get(REST_API_URL + "admin/nominateAdmin?pseudoToNominate=" + pseudoToNominate + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
                      hideLoadingCircle();
                      alert(pseudoToNominate + " a été nommé administrateur.");
                      location.reload();
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        hideLoadingCircle();

                        if (jqXHR.status == 401) {
                            alert("Session expirée.");
                            deconnexion();
                        } else if (jqXHR.status == 500) {
                            alert("Erreur de BDD. Veuillez réessayer.");
                        } else {
                            alert("Erreur inconnue.");
                            console.log(jqXHR);
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
            hideLoadingCircle();

            if (jqXHR.status == 401) {
                alert("Session expirée.");
                deconnexion();
            } else if (jqXHR.status == 500) {
                alert("Erreur de BDD. Veuillez réessayer.");
            } else {
                alert("Erreur inconnue.");
                console.log(jqXHR);
            }
        }); 
    }; 

    /* Notifications par mail. */

    $("#radioNotifMail").change(function() {
      showLoadingCircle();

      if ($("#radioNotifMail").is(":checked")) { // Coché
        $.ajax({
             url: REST_API_URL + "admin/acceptMail?newValue=true&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                    hideLoadingCircle();
                    alert('Vous recevrez les prochains mails envoyés par l\'application.');
                },
                401: function() {
                    hideLoadingCircle();
                    alert("Session expirée.");
                    deconnexion();
                },
                500: function() {
                    hideLoadingCircle();
                    alert("Erreur de BDD. Veuillez réessayer.");
                }
             }
        });
      } else {
        $.ajax({
             url: REST_API_URL + "admin/acceptMail?newValue=false&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                    hideLoadingCircle();
                    alert('Vous ne recevrez plus les prochains mails envoyés par l\'application.');
                },
                401: function() {
                    hideLoadingCircle();
                    alert("Session expirée.");
                    deconnexion();
                },
                500: function() {
                    hideLoadingCircle();
                    alert("Erreur de BDD. Veuillez réessayer.");
                }
             }
        });
      }
    });
    
});