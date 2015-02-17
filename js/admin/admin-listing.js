window.addEventListener('DOMContentLoaded', function() {

    $(document).on("pageshow","#accueilAdmin", function(e, data) {
       $("#tabFavoris").click();
    });

    /* Autre. */

    function listenerAutreTab() {
        showLoadingCircle();

        $("#tabAutre").addClass("ui-icon-more-sel").removeClass("ui-icon-more");

        $("#tabDip").addClass("ui-icon-diplome").removeClass("ui-icon-diplome-sel");
        $("#tabFavoris").addClass("ui-icon-favori").removeClass("ui-icon-favori-sel");
        $("#tabEtab").addClass("ui-icon-etablissement").removeClass("ui-icon-etablissement-sel");
        $("#tabAnnee").addClass("ui-icon-annee").removeClass("ui-icon-annee-sel");

        $('#listviewEtabAdmin').empty();
        $('#listviewDipAdmin').empty();
        $('#listviewFavAdmin').empty();

        $('#autresLinks').show();

        $("#titleAccueilAdmin").text("Autre");

        $("#btnCreaAccueil").hide();

        $.get(REST_API_URL + "admin/isMailAccepted?pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
            $.mobile.loading('hide');

            if (datas == "true") {
              $("#radioNotifMail").addClass('checked');
            } else {
              $("#radioNotifMail").removeClass('checked');
            }
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

    $("#tabAutre").bind("click", listenerAutreTab);

    /* Liste des favoris. */

    function initFavAdmin() {
        showLoadingCircle();

        $("#tabFavoris").addClass("ui-icon-favori-sel").removeClass("ui-icon-favori");
        
        $("#tabDip").addClass("ui-icon-diplome").removeClass("ui-icon-diplome-sel");
        $("#tabEtab").addClass("ui-icon-etablissement").removeClass("ui-icon-etablissement-sel");
        $("#tabAutre").addClass("ui-icon-more").removeClass("ui-icon-more-sel");
        $("#tabAnnee").addClass("ui-icon-annee").removeClass("ui-icon-annee-sel");

        $('#listviewEtabAdmin').empty();
        $('#listviewDipAdmin').empty();

        $('#autresLinks').hide();

        $("#titleAccueilAdmin").text("Favoris");

        $("#btnCreaAccueil").hide();

        $.get(REST_API_URL + "annee/getFavorites?pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
            $.mobile.loading('hide');

            $('#listviewFavAdmin').empty();

            var listeAnnee = [];

            for (var i = 0; i < datas.length; i++) {   
              listeAnnee.push(datas[i]);

              $("#listviewFavAdmin").append("<li id=\"listeFav-" + datas[i].idAnnee + "\">" + datas[i].nom + "<br><p>" + datas[i].etablissement.nom + " - " + datas[i].etablissement.ville + "</p></li>");
            
              $("#listeFav-" + datas[i].idAnnee).click(function(event) {
                sessionStorage.setItem("annee", JSON.stringify(listeAnnee[$(this).index()])); 
                $.mobile.changePage("#listeUEAdmin", { transition: "slideup", changeHash: false });
              });

              $("#listeFav-" + datas[i].idAnnee).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous vraiment ne plus suivre cette année ?");

                if (confirmSuppr == true) {
                    $.get(REST_API_URL + "admin/unfollow?idAnnee=" + listeAnnee[$(this).index()].idAnnee + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
                      alert("Cette année n'est plus suivie.");
                    }
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status == 401) {
                          alert("Session expirée.");
                          deconnexion();
                        } else if (jqXHR.status == 500) {
                          alert("Erreur de BDD. Veuillez réessayer.");
                        } else {
                          alert("Erreur inconnue.");
                        }
                    })); 
                }
              });
            }

            $("#listviewFavAdmin").listview("refresh");
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

    $("#tabFavoris").bind("click", initFavAdmin);
    
    /* Liste des établissements. */
    
    function initEtabAdmin() {
        showLoadingCircle();

        $("#tabEtab").addClass("ui-icon-etablissement-sel").removeClass("ui-icon-etablissement");

        $("#tabFavoris").addClass("ui-icon-favori").removeClass("ui-icon-favori-sel");
        $("#tabDip").addClass("ui-icon-diplome").removeClass("ui-icon-diplome-sel");
        $("#tabAutre").addClass("ui-icon-more").removeClass("ui-icon-more-sel");
        $("#tabAnnee").addClass("ui-icon-annee").removeClass("ui-icon-annee-sel");

        $('#listviewFavAdmin').empty();
        $('#listviewDipAdmin').empty();

        $('#autresLinks').hide();

        $("#titleAccueilAdmin").text("Etablissement");

        $("#btnCreaAccueil").show();

        $.get(REST_API_URL + "etablissement/getAll", function(datas) {
            $.mobile.loading('hide');

            $('#listviewEtabAdmin').empty();

            var listeEtab = [];
            
            for (var i = 0; i < datas.length; i++) {     
              listeEtab.push(datas[i]);       

              $("#listviewEtabAdmin").append("<li id=\"listeEtab-" + datas[i].idEtablissement + "\">" + datas[i].nom + "<br><p>" + datas[i].ville + "</p></li>");

              $("#listeEtab-" + datas[i].idEtablissement).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous supprimer cet établissement ?");

                if (confirmSuppr == true) {
                    $.ajax({
                       url: REST_API_URL + 'etablissement?id=' + listeEtab[$(this).index()].idEtablissement + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
                       type: 'DELETE',
                       statusCode: {
                          200: function() {
                              alert('Etablissement supprimé.');
                              location.reload();
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
                }
              });
            }

            $("#listviewEtabAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $.mobile.loading('hide');

            if (jqXHR.status == 500) {
              alert("Erreur de BDD. Veuillez réessayer.");
            } else {
              alert("Erreur inconnue.");
            }
        }); 
    };

    $("#tabEtab").bind("click", initEtabAdmin);
    
    /* Liste des diplômes. */
    
    function initDipAdmin() {
        showLoadingCircle();

        $("#tabDip").addClass("ui-icon-diplome-sel").removeClass("ui-icon-diplome");

        $("#tabFavoris").addClass("ui-icon-favori").removeClass("ui-icon-favori-sel");
        $("#tabEtab").addClass("ui-icon-etablissement").removeClass("ui-icon-etablissement-sel");
        $("#tabAutre").addClass("ui-icon-more").removeClass("ui-icon-more-sel");
        $("#tabAnnee").addClass("ui-icon-annee").removeClass("ui-icon-annee-sel");

        $('#listviewEtabAdmin').empty();
        $('#listviewFavAdmin').empty();
        
        $('#autresLinks').hide();

        $("#titleAccueilAdmin").text("Diplôme");

        $("#btnCreaAccueil").show();

        $.get(REST_API_URL + "diplome/getAll", function(datas) {
            $.mobile.loading('hide');

            $('#listviewDipAdmin').empty();
            
            var listeDiplomes = [];

            for (var i = 0; i < datas.length; i++) {
              listeDiplomes.push(datas[i]);

              $("#listviewDipAdmin").append("<li id=\"listeDip-" + datas[i].idDiplome + "\">" + datas[i].nom + "</li>");
              
              $("#listeDip-" + datas[i].idDiplome).click(function(event) {
                sessionStorage.setItem("diplome", JSON.stringify(listeDiplomes[$(this).index()])); 
                $.mobile.changePage("#listeAnneeAdmin", { transition: "slideup", changeHash: false });
              });

              $("#listeDip-" + datas[i].idDiplome).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous supprimer ce diplôme ?");

                if (confirmSuppr == true) {
                    $.ajax({
                       url: REST_API_URL + 'diplome?id=' + listeDiplomes[$(this).index()].idDiplome + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
                       type: 'DELETE',
                       statusCode: {
                          200: function() {
                              alert('Diplôme supprimé.');
                              location.reload();
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
                }
              });
            }

            if (datas.length == 0) {
              $("#listviewDipAdmin").append("<li>Aucune année</li>");
            } 

            $("#listviewDipAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $.mobile.loading('hide');

            if (jqXHR.status == 500) {
              alert("Erreur de BDD. Veuillez réessayer.");
            } else {
              alert("Erreur inconnue.");
            }
        }); 
    };

    $("#tabDip").bind("click", initDipAdmin);

    /* Chercher une année. */

    function initChercherAnnAdmin() {
        $("#tabAnnee").addClass("ui-icon-annee-sel").removeClass("ui-icon-annee");

        $("#tabFavoris").addClass("ui-icon-favori").removeClass("ui-icon-favori-sel");
        $("#tabEtab").addClass("ui-icon-etablissement").removeClass("ui-icon-etablissement-sel");
        $("#tabAutre").addClass("ui-icon-more").removeClass("ui-icon-more-sel");
        $("#tabDip").addClass("ui-icon-diplome").removeClass("ui-icon-diplome-sel");

        $('#listviewEtabAdmin').empty();
        $('#listviewFavAdmin').empty();
        $('#listviewDipAdmin').empty();

        $('#autresLinks').hide();

        $("#titleAccueilAdmin").text("Année");

        $("#btnCreaAccueil").show();
    };

    $("#tabAnnee").bind("click", initChercherAnnAdmin);
    
    /* Liste des années. */

    $(document).on("pageshow","#listeAnneeAdmin", function(e, data) {
       initAnnAdmin();
    });
    
    function initAnnAdmin() {
        showLoadingCircle();

        $("#titreListeAnnees").text(JSON.parse(sessionStorage.getItem("diplome")).nom);

        $.get(REST_API_URL + "annee/getAnneesByDiplome?idDiplome=" + JSON.parse(sessionStorage.getItem("diplome")).idDiplome, function(datas) {
            $.mobile.loading('hide');

            $('#listviewAnnAdmin').empty();

            var listeAnnees = [];
            
            for (var i = 0; i < datas.length; i++) {
              listeAnnees.push(datas[i]);

              $("#listviewAnnAdmin").append("<li id=\"listeAnn-" + datas[i].idAnnee + "\">" + datas[i].nom + "</li>");
              
              $("#listeAnn-" + datas[i].idAnnee).click(function(event) {
                sessionStorage.setItem("annee", JSON.stringify(listeAnnees[$(this).index()])); 
                $.mobile.changePage("#listeUEAdmin", { transition: "slideup", changeHash: false });
              });

              $("#listeAnn-" + datas[i].idAnnee).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous supprimer cette année ?");

                if (confirmSuppr == true) {
                    $.ajax({
                       url: REST_API_URL + 'annee?id=' + listeAnnees[$(this).index()].idAnnee + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
                       type: 'DELETE',
                       statusCode: {
                          200: function() {
                              alert('Année supprimée.');
                              location.reload();
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
                }
              });
            }

            if (datas.length == 0) {
              $("#listviewAnnAdmin").append("<li>Aucune année</li>");
            } 

            $("#listviewAnnAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $.mobile.loading('hide');

            if (jqXHR.status == 500) {
              alert("Erreur de BDD. Veuillez réessayer.");
            } else {
              alert("Erreur inconnue.");
            }
        }); 
    };
    
    /* Liste des UE. */
    
    $(document).on("pageshow","#listeUEAdmin", function() {
       initUEAdmin();
    });
    
    function initUEAdmin() {
        showLoadingCircle();

        $("#titleAccueilAdmin").text(JSON.parse(sessionStorage.getItem("annee")).nom);

        $.get(REST_API_URL + "ue/getAllUEOfAnnee?idAnnee=" + JSON.parse(sessionStorage.getItem("annee")).idAnnee, function(datas) {
            $.mobile.loading('hide');

            $('#listviewUEAdmin').empty();

            var listeUE = [];
            
            for (var i = 0; i < datas.length; i++) {
              listeUE.push(datas[i]);

              $("#listviewUEAdmin").append("<li id=\"listeUE-" + datas[i].idUE + "\">" + datas[i].nom + "</li>");
                
              $("#listeUE-" + datas[i].idUE).click(function(event) {
                sessionStorage.setItem("ue", JSON.stringify(listeUE[$(this).index()])); 
                $.mobile.changePage("#listeMatAdmin", { transition: "slideup", changeHash: false });
              });

              $("#listeUE-" + datas[i].idUE).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous supprimer cette UE ?");

                if (confirmSuppr == true) {
                  $.ajax({
                     url: REST_API_URL + 'ue?id=' + listeUE[$(this).index()].idUE + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
                     type: 'DELETE',
                     statusCode: {
                        200: function() {
                            alert('UE supprimée.');
                            location.reload();
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
                }
              });
            }

            if (datas.length == 0) {
              $("#listviewUEAdmin").append("<li>Aucune UE</li>");
            } 

            $("#listviewUEAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $.mobile.loading('hide');

            if (jqXHR.status == 500) {
              alert("Erreur de BDD. Veuillez réessayer.");
            } else {
              alert("Erreur inconnue.");
            }
        }); 
    };
    
    /* Liste des matières. */
    
    $(document).on("pageshow","#listeMatAdmin",function() {
       initMatAdmin();
    });
    
    function initMatAdmin() {
        showLoadingCircle();

        $("#titleAccueilAdmin").text(JSON.parse(sessionStorage.getItem("ue")).nom);

        $.get(REST_API_URL + "matiere/getAllMatieretOfUE?idUE=" + JSON.parse(sessionStorage.getItem("ue")).idUE, function(datas) {
            $.mobile.loading('hide');

            $('#listviewMatAdmin').empty();

            var listeMatieres = [];
            
            for (var i = 0; i < datas.length; i++) {
                listeMatieres.push(datas[i]);

                $("#listviewMatAdmin").append("<li id=\"listeMat" + datas[i].idMatiere + "\">" + datas[i].nom + "</li>");

                $("#listeMat-" + datas[i].idMatiere).bind("taphold", function (event) {
                    var confirmSuppr = confirm("Voulez-vous supprimer cette matière ?");

                    if (confirmSuppr == true) {
                        $.ajax({
                           url: REST_API_URL + 'matiere?id=' + listeMatieres[$(this).index()].idUE + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
                           type: 'DELETE',
                           statusCode: {
                              200: function() {
                                  alert('Matière supprimée.');
                                  location.reload();
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
                    }
                });
            }

            if (datas.length == 0) {
              $("#listviewMatAdmin").append("<li>Aucune matière</li>");
            } 

            $("#listviewMatAdmin").listview("refresh");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            $.mobile.loading('hide');

            if (jqXHR.status == 500) {
              alert("Erreur de BDD. Veuillez réessayer.");
            } else {
              alert("Erreur inconnue.");
            }
        }); 
    };

});