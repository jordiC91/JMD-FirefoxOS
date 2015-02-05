window.addEventListener('DOMContentLoaded', function() {
  
    /**
     * Méthode permettant de déconnecter l'utilisateur (clear du localstorage et redirection vers la page de connexion).
     */
    function deconnexion() {
        localStorage.setItem("pseudo", null);
        localStorage.setItem("token", null);
                
        $.mobile.changePage("#connexion", { transition: "slideup", changeHash: false });
    };

    /* Création d'un établissement. */

    $("#btnCreateEtabAdmin").click(function(event) {
        var nom = $("#nomEtab").val();
        var ville = $("#ville").val();

        if ((nom.length > 0) && (ville.length > 0)) {
          $.ajax({
             url: REST_API_URL + 'etablissement?nom=' + nom + "&ville=" + ville + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                  alert('Etablissement créé.');
                  $.mobile.changePage("#etabAdmin", { transition: "slideup", changeHash: false });
                },
                401: function() {
                  alert("Session expirée.");
                  deconnexion();
                },
                403: function() {
                  alert("Un établissement avec ce nom existe déjà.");
                },
                500: function() {
                  alert("Erreur de BDD. Veuillez réessayer.");
                }
             }
          });
        } else {
          alert("Au moins un des champs est vide.");
        }
    });

    /* Création d'un diplôme. */

    $("#btnCreateDipAdmin").click(function(event) {
        var nom = $("#nomDip").val();

        if (nom.length > 0) {
          $.ajax({
             url: REST_API_URL + 'diplome?nom=' + nom + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                  alert('Diplôme créé.');
                  $.mobile.changePage("#diplomesAdmin", { transition: "slideup", changeHash: false });
                },
                401: function() {
                  alert("Session expirée.");
                  deconnexion();
                },
                403: function() {
                  alert("Un diplôme avec ce nom existe déjà.");
                },
                500: function() {
                  alert("Erreur de BDD. Veuillez réessayer.");
                }
             }
          });
        } else {
          alert("Le nom entré est vide.")
        }
    });

    /* Création d'une année. */

    $(document).on("pageshow","#createAnneeAdmin",function() {
       $.get(REST_API_URL + "etablissement/getAll", function(datas) {
            $('#selectEtabCreaAnnee').empty();

            for (var i = 0; i < datas.length; i++) {            
              $("#selectEtabCreaAnnee").append("<option value=" + datas[i].idEtablissement + " id=idEtabA" + datas[i].idEtablissement + ">" + datas[i].nom + " - " + datas[i].ville + "</option>");
            }

            $("#selectEtabCreaAnnee").select("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 500) {
              alert("Erreur de BDD. Veuillez réessayer.");
            } else {
              alert("Erreur inconnue.");
            }
        }); 
    });

    $("#btnCreateAnnAdmin").click(function(event) {
        var nom = $("#nomAnn").val();
        var idEtablissement = $("#selectEtabCreaAnnee option:selected").val();
        var isLastYear = $("#isLastYear").is(":checked");
        var decoupage = $("#decoupageAnnee option:selected").text();

        if ((nom.length > 0)) {
          $.ajax({
             url: REST_API_URL + 'annee?nom=' + nom + "&idDiplome=" + localStorage.getItem("idDiplome") + "&idEtablissement=" + idEtablissement + "&decoupage=" + decoupage + "&isLastYear=" + isLastYear + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                    alert('Année créée.');
                    $.mobile.changePage("#listeAnneeAdmin", { transition: "slideup", changeHash: false });
                },
                401: function() {
                    alert("Session expirée.");
                    deconnexion();
                },
                403: function() {
                    alert("Une année avec ce nom et cet établissement existe déjà.");
                },
                500: function() {
                    alert("Erreur de BDD. Veuillez réessayer.");
                }
             }
          });
        } else {
          alert("Au moins un des champs est vide.");
        }
    });

    /* Création d'une UE. */

    $("#btnCreateUEAdmin").click(function(event) {
        var nom = $("#nomUE").val();

        // Optionnels.
        var nbOptionsMini = $("#nbOptionsMini").val();
        var moyenneMini = $("#moyenneMini").val();

        if (nom.length > 0) {
          $.ajax({
             url: REST_API_URL + 'ue?nom=' + nom + "&idAnnee=" + localStorage.getItem("idAnnee") + ((moyenneMini.length > 0) ? "&noteMinimale=" + moyenneMini : "") + ((nbOptionsMini.length > 0) ? "&nbOptMini=" + nbOptionsMini : "") +  "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                    alert('UE créée.');
                    $.mobile.changePage("#listeUEAdmin", { transition: "slideup", changeHash: false });
                },
                401: function() {
                    alert("Session expirée.");
                    deconnexion();
                },
                500: function() {
                    alert("Erreur de BDD. Veuillez réessayer.");
                }
             }
          });
        } else {
          alert("Le nom entré est vide.");
        }
    });

    /* Création d'une matière. */

    $("#btnCreateMatAdmin").click(function(event) {
        var nom = $("#nomMat").val();
        var coeff = $("#coeffMat").val();
        var isOption = $("#isOption").is(":checked");
        var isRattrapable = $("#isRattrapable").is(":checked");

        // Optionnel.
        var noteMini = $("#noteMiniMat").val();

        if ((nom.length > 0) && (coeff.length > 0)) {
          $.ajax({
             url: REST_API_URL + 'matiere?nom=' + nom + "&isRattrapable=" + isRattrapable + ((noteMini.length > 0) ? "&noteMini=" + noteMini : "") + "&isOption" + isOption + "&coefficient=" + coeff + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                    alert('Matière créée.');
                    $.mobile.changePage("#listeMatAdmin", { transition: "slideup", changeHash: false });
                },
                401: function() {
                    alert("Session expirée.");
                    deconnexion();
                },
                500: function() {
                    alert("Erreur de BDD. Veuillez réessayer.");
                }
             }
          });
        } else {
          alert("Au moins un des champs est vide.");
        }
    });
    
});