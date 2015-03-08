window.addEventListener('DOMContentLoaded', function() {

    $("#btnCreaAccueil").click(function(event) {
        var newPage;

        if ($("#titleAccueilAdmin").text() == "Etablissement") {
           newPage = "createEtabAdmin";
        } else if ($("#titleAccueilAdmin").text() == "Diplôme") {
           newPage = "createDiplomeAdmin";
        } else if ($("#titleAccueilAdmin").text() == "Année") {
           newPage = "createAnneeAdmin";
        } 

        changePage(newPage);
    });

    /* Création d'un établissement. */

    $("#btnCreateEtabAdmin").click(function(event) {
        var nom = $("#nomEtab").val();
        var ville = $("#ville").val();

        if ((nom.length > 0) && (ville.length > 0)) {
          showLoadingCircle();

          $.ajax({
             url: REST_API_URL + 'etablissement?nom=' + nom + "&ville=" + ville + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                  hideLoadingCircle();
                  alert('Etablissement créé.');
                  changePage("accueilAdmin");
                },
                401: function() {
                  hideLoadingCircle();
                  alert("Session expirée.");
                  deconnexion();
                },
                403: function() {
                  hideLoadingCircle();
                  alert("Un établissement avec ce nom existe déjà.");
                },
                500: function() {
                  hideLoadingCircle();
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
          showLoadingCircle();

          $.ajax({
             url: REST_API_URL + 'diplome?nom=' + nom + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                  hideLoadingCircle();
                  alert('Diplôme créé.');
                  changePage("accueilAdmin");
                },
                401: function() {
                  hideLoadingCircle();
                  alert("Session expirée.");
                  deconnexion();
                },
                403: function() {
                  hideLoadingCircle();
                  alert("Un diplôme avec ce nom existe déjà.");
                },
                500: function() {
                  hideLoadingCircle();
                  alert("Erreur de BDD. Veuillez réessayer.");
                }
             }
          });
        } else {
          alert("Le nom entré est vide.");
        }
    });

    /* Création d'une année. */

    $(document).on("pageshow","#createAnneeAdmin",function() {
       showLoadingCircle();

       $.get(REST_API_URL + "etablissement/getAll", function(datas) {
            hideLoadingCircle();

            $('#selectEtabCreaAnnee').empty();

            for (var i = 0; i < datas.length; i++) {            
              $("#selectEtabCreaAnnee").append("<option value=" + datas[i].idEtablissement + " id=idEtabA" + datas[i].idEtablissement + ">" + datas[i].nom + " - " + datas[i].ville + "</option>");
            }

            $("#selectEtabCreaAnnee").selectmenu("refresh", true);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            hideLoadingCircle();

            if (jqXHR.status == 500) {
              alert("Erreur de BDD. Veuillez réessayer.");
            } else {
              alert("Erreur inconnue.");
              console.log(jqXHR);
            }
        }); 
    });

    $("#btnCreateAnnAdmin").click(function(event) {
        var nom = $("#nomAnn").val();
        var idEtablissement = $("#selectEtabCreaAnnee option:selected").val();
        var isLastYear = $("#isLastYear").is(":checked");
        var decoupage = $("#decoupageAnnee option:selected").text();

        if ((nom.length > 0)) {
          showLoadingCircle();

          $.ajax({
             url: REST_API_URL + 'annee?nom=' + nom + "&idDiplome=" + JSON.parse(sessionStorage.getItem("diplome")).idDiplome + "&idEtablissement=" + idEtablissement + "&decoupage=" + decoupage + "&isLastYear=" + isLastYear + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                    hideLoadingCircle();
                    alert('Année créée.');
                    changePage("listeAnneeAdmin");
                },
                401: function() {
                    hideLoadingCircle();
                    alert("Session expirée.");
                    deconnexion();
                },
                403: function() {
                    hideLoadingCircle();
                    alert("Une année avec ce nom et cet établissement existe déjà.");
                },
                500: function() {
                    hideLoadingCircle();
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
          showLoadingCircle();

          $.ajax({
             url: REST_API_URL + 'ue?nom=' + nom + "&idAnnee=" + localStorage.getItem("idAnnee") + ((moyenneMini.length > 0) ? "&noteMinimale=" + moyenneMini : "") + ((nbOptionsMini.length > 0) ? "&nbOptMini=" + nbOptionsMini : "") +  "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                    hideLoadingCircle();
                    alert('UE créée.');
                    changePage("listeUEAdmin");
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
          if ($.isNumeric(coeff)) {
            showLoadingCircle();

            $.ajax({
               url: REST_API_URL + 'matiere?nom=' + nom + "&isRattrapable=" + isRattrapable + ((noteMini.length > 0) ? "&noteMini=" + noteMini : "") + "&isOption" + isOption + "&coefficient=" + coeff + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
               type: 'PUT',
               statusCode: {
                  200: function() {
                      hideLoadingCircle();
                      alert('Matière créée.');
                      changePage("listeMatAdmin");
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
            alert("Le coefficient doit être un nombre.");
          }
        } else {
          alert("Au moins un des champs est vide.");
        }
    });
    
});