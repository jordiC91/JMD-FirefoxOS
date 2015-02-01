window.addEventListener('DOMContentLoaded', function() {
    
    $("#etudiantChoice").click(function(event){
        $.mobile.changePage("#accueilEtudiant", { transition: "slideup", changeHash: false });
    });
   
    /* Création d'un établissement. */

    $("#btnCreateEtabAdmin").click(function(event) {
        var nom = $("#nomEtab").val();
        var ville = $("#ville").val();

        if ((nom.length > 0) && (ville.length > 0)) {
          $.ajax({
             url: REST_API_URL + 'etablissement?nom=' + nom + "&ville=" + ville + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             success: function(result) {
               alert('Etablissement créé.');
               $.mobile.changePage("#etabAdmin", { transition: "slideup", changeHash: false });
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

    $("#etabAnnee").click(function(event) {
        
    });

    $("#btnCreateAnnAdmin").click(function(event) {
        var nom = $("#nomAnn").val();
        var etablissement = $("#etabAnnee").val();
        var isLastYear = $("#isLastYear").val();

        if ((nom.length > 0) && (etablissement.length > 0) && (isLastYear.length > 0)) {
          $.ajax({
             url: REST_API_URL + 'annee?nom=' + nom + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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
             url: REST_API_URL + 'ue?nom=' + nom + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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
                403: function() {
                    alert("Une UE avec ce nom et cet établissement existe déjà.");
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

        // Optionnels.
        var isOption = $("#isOption").val();
        var noteMini = $("#noteMiniMat").val();
        var isRattrapable = $("#isRattrapable").val();

        if ((nom.length > 0) && (coeff.length > 0)) {
          $.ajax({
             url: REST_API_URL + 'matiere?nom=' + nom + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
             type: 'PUT',
             statusCode: {
                200: function() {
                    alert('Année créée.');
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
