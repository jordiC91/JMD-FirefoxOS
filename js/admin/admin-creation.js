window.addEventListener('DOMContentLoaded', function() {

    $("#btnCreaAccueil").click(function(event) {
        var newPage;

        if ($("#titleAccueilAdmin").text() == "Etablissement") {
           newPage = "createEtabAdmin";
        } else if ($("#titleAccueilAdmin").text() == "Diplôme") {
           newPage = "createDiplomeAdmin";
        } else if ($("#titleAccueilAdmin").text() == "Année") {
           newPage = "createAnneeAdmin";
        } else if ($("#titleAccueilAdmin").text() == "Chercher une année") {
           newPage = "createAnneeAdminHome";
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

       // Initialisation de la liste déroulante contenant tous les établissements.

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

        // Initialisation de la liste déroulante contenant tous les diplômes.

        $.get(REST_API_URL + "diplome/getAll", function(datas) {
            hideLoadingCircle();

            $('#selectDipCreaAnnee').empty();

            for (var i = 0; i < datas.length; i++) {            
              $("#selectDipCreaAnnee").append("<option value=" + datas[i].idDiplome + " id=idDipA" + datas[i].idDiplome + ">" + datas[i].nom + "</option>");
            }

            $("#selectDipCreaAnnee").selectmenu("refresh", true);
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

        if (decoupage == "Aucun") {
          decoupage = "NULL";
        } else {
          decoupage = decoupage.toUpperCase();
        }

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

    /* Création d'une année - Home.
     * Dupliqué - Expliqué dans "index.html".
     */

    $(document).on("pageshow","#createAnneeAdminHome",function() {
       showLoadingCircle();

       // Initialisation de la liste déroulante contenant tous les établissements.

       $.get(REST_API_URL + "etablissement/getAll", function(datas) {
            hideLoadingCircle();

            $('#selectEtabCreaAnneeHome').empty();

            for (var i = 0; i < datas.length; i++) {            
              $("#selectEtabCreaAnneeHome").append("<option value=" + datas[i].idEtablissement + " id=idEtabAHome" + datas[i].idEtablissement + ">" + datas[i].nom + " - " + datas[i].ville + "</option>");
            }

            $("#selectEtabCreaAnneeHome").selectmenu("refresh", true);
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

        // Initialisation de la liste déroulante contenant tous les diplômes.

        $.get(REST_API_URL + "diplome/getAll", function(datas) {
            hideLoadingCircle();

            $('#selectDipCreaAnneeHome').empty();

            for (var i = 0; i < datas.length; i++) {            
              $("#selectDipCreaAnneeHome").append("<option value=" + datas[i].idDiplome + " id=idDipAHome" + datas[i].idDiplome + ">" + datas[i].nom + "</option>");
            }

            $("#selectDipCreaAnneeHome").selectmenu("refresh", true);
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

    $("#btnCreateAnnAdminHome").click(function(event) {
        var nom = $("#nomAnnHome").val();
        var idDiplome = $("#selectDipCreaAnneeHome option:selected").val();
        var idEtablissement = $("#selectEtabCreaAnneeHome option:selected").val();
        var isLastYear = $("#isLastYearHome").is(":checked");

        var decoupage = $("#decoupageAnneeHome option:selected").text();

        if (decoupage == "Aucun") {
          decoupage = "NULL";
        } else {
          decoupage = decoupage.toUpperCase();
        }

        if ((nom.length > 0)) {
          showLoadingCircle();

          $.ajax({
             url: REST_API_URL + 'annee?nom=' + nom + "&idDiplome=" + idDiplome + "&idEtablissement=" + idEtablissement + "&decoupage=" + decoupage + "&isLastYear=" + isLastYear + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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

    $(document).on("pageshow","#createUEAdmin",function() {
        $('#selectDecoupageUECreaUE').empty();  

        if (JSON.parse(sessionStorage.getItem("annee")).decoupage == "SEMESTRE") {
          $("#selectDecoupageUECreaUE").append("<option value=\"sem1\">Semestre 1</option>");
          $("#selectDecoupageUECreaUE").append("<option value=\"sem2\">Semestre 2</option>");
        } else if (JSON.parse(sessionStorage.getItem("annee")).decoupage == "TRIMESTRE") {
          $("#selectDecoupageUECreaUE").append("<option value=\"tri1\">Trimestre 1</option>");
          $("#selectDecoupageUECreaUE").append("<option value=\"tri2\">Trimestre 2</option>");
          $("#selectDecoupageUECreaUE").append("<option value=\"tri3\">Trimestre 3</option>");
        } else {
          $("#selectDecoupageUECreaUE").append("<option value=\"aucun\">Aucun</option>");
        }    

        $("#selectDecoupageUECreaUE").selectmenu("refresh", true);
    });

    $("#btnCreateUEAdmin").click(function(event) {
        var nom = $("#nomUE").val();

        var decoupage = $("#selectDecoupageUECreaUE option:selected").val();
        decoupage = decoupage.toUpperCase();

        // Optionnels.
        var nbOptionsMini = $("#nbOptionsMini").val();
        var moyenneMini = $("#moyenneMini").val();

        if (nom.length > 0) {
          showLoadingCircle();

          $.ajax({
             url: REST_API_URL + 'ue?nom=' + nom + "&idAnnee=" + JSON.parse(sessionStorage.getItem("annee")).idAnnee + ((moyenneMini.length > 0) ? "&noteMinimale=" + moyenneMini : "") + "&yearType=" + decoupage + ((nbOptionsMini.length > 0) ? "&nbOptMini=" + nbOptionsMini : "") +  "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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
               url: REST_API_URL + 'matiere?nom=' + nom + "&idUE=" + JSON.parse(sessionStorage.getItem("ue")).idUE + "&isRattrapable=" + isRattrapable + ((noteMini.length > 0) ? "&noteMini=" + noteMini : "") + "&isOption=" + isOption + "&coefficient=" + coeff + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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