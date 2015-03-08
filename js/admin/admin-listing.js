window.addEventListener('DOMContentLoaded', function() {

    /* Autre. */

    function listenerAutreTab() {
        showLoadingCircle();

        sessionStorage.setItem("currentTab", "autre");

        $("#tabAutre").addClass("ui-icon-more-sel").removeClass("ui-icon-more");

        $("#tabDip").addClass("ui-icon-diplome").removeClass("ui-icon-diplome-sel");
        $("#tabFavoris").addClass("ui-icon-favori").removeClass("ui-icon-favori-sel");
        $("#tabEtab").addClass("ui-icon-etablissement").removeClass("ui-icon-etablissement-sel");
        $("#tabAnnee").addClass("ui-icon-annee").removeClass("ui-icon-annee-sel");

        $('#listviewEtabAdmin').empty();
        $('#listviewDipAdmin').empty();
        $('#listviewFavAdmin').empty();
        $('#listviewChercherAnnee').empty();

        $('#autresLinks').show();

        $("#titleAccueilAdmin").text("Autre");

        $("#btnCreaAccueil").hide();

        $.get(REST_API_URL + "admin/isMailAccepted?pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
            hideLoadingCircle();

            if (datas == "true") {
              $("#radioNotifMail").addClass('checked');
            } else {
              $("#radioNotifMail").removeClass('checked');
            }
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

    $("#tabAutre").bind("click", listenerAutreTab);

    /* Liste des favoris. */

    function initFavAdmin() {
        showLoadingCircle();

        sessionStorage.setItem("currentTab", "favoris");

        $("#tabFavoris").addClass("ui-icon-favori-sel").removeClass("ui-icon-favori");
        
        $("#tabDip").addClass("ui-icon-diplome").removeClass("ui-icon-diplome-sel");
        $("#tabEtab").addClass("ui-icon-etablissement").removeClass("ui-icon-etablissement-sel");
        $("#tabAutre").addClass("ui-icon-more").removeClass("ui-icon-more-sel");
        $("#tabAnnee").addClass("ui-icon-annee").removeClass("ui-icon-annee-sel");

        $('#listviewEtabAdmin').empty();
        $('#listviewDipAdmin').empty();
        $('#listviewChercherAnnee').empty();

        $('#autresLinks').hide();

        $("#titleAccueilAdmin").text("Favoris");

        $("#btnCreaAccueil").hide();

        $.get(REST_API_URL + "annee/getFavorites?pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
            hideLoadingCircle();

            $('#listviewFavAdmin').empty();

            $("#listviewFavAdmin").append("<li data-role=\"list-divider\">VOS FAVORIS</li>");

            var listeAnnee = [];

            for (var i = 0; i < datas.length; i++) {   
              listeAnnee.push(datas[i]);

              $("#listviewFavAdmin").append("<li id=\"listeFav-" + datas[i].idAnnee + "\">" + datas[i].nom + "<br><p>" + datas[i].etablissement.nom + " - " + datas[i].etablissement.ville + "</p></li>");
            
              $("#listeFav-" + datas[i].idAnnee).click(function(event) {
                sessionStorage.setItem("annee", JSON.stringify(listeAnnee[$(this).index() - 1])); 
                $.mobile.changePage("#listeUEAdmin", { transition: "slideup", changeHash: false });
              });

              $("#listeFav-" + datas[i].idAnnee).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous vraiment ne plus suivre cette année ?");

                if (confirmSuppr == true) {
                    $.get(REST_API_URL + "admin/unfollow?idAnnee=" + listeAnnee[$(this).index() - 1].idAnnee + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
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
                          console.log(jqXHR);
                        }
                    })); 
                }
              });
            }

            if (datas.length == 0) {
              $("#listviewFavAdmin").append("<li>Aucunee année suivie.</li>");
            } 

            $("#listviewFavAdmin").listview("refresh");
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

    $("#tabFavoris").bind("click", initFavAdmin);
    
    /* Liste des établissements. */
    
    function initEtabAdmin() {
        showLoadingCircle();

        sessionStorage.setItem("currentTab", "établissement");

        $("#tabEtab").addClass("ui-icon-etablissement-sel").removeClass("ui-icon-etablissement");

        $("#tabFavoris").addClass("ui-icon-favori").removeClass("ui-icon-favori-sel");
        $("#tabDip").addClass("ui-icon-diplome").removeClass("ui-icon-diplome-sel");
        $("#tabAutre").addClass("ui-icon-more").removeClass("ui-icon-more-sel");
        $("#tabAnnee").addClass("ui-icon-annee").removeClass("ui-icon-annee-sel");

        $('#listviewFavAdmin').empty();
        $('#listviewDipAdmin').empty();
        $('#listviewChercherAnnee').empty();

        $('#autresLinks').hide();

        $("#titleAccueilAdmin").text("Etablissement");

        $("#btnCreaAccueil").show();

        $.get(REST_API_URL + "etablissement/getAll", function(datas) {
            hideLoadingCircle();

            $('#listviewEtabAdmin').empty();

            $("#listviewEtabAdmin").append("<li data-role=\"list-divider\">LISTE DES ETABLISSEMENTS</li>");

            var listeEtab = [];
            
            for (var i = 0; i < datas.length; i++) {     
              listeEtab.push(datas[i]);       

              $("#listviewEtabAdmin").append("<li id=\"listeEtab-" + datas[i].idEtablissement + "\">" + datas[i].nom + "<br><p>" + datas[i].ville + "</p></li>");

              $("#listeEtab-" + datas[i].idEtablissement).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous supprimer cet établissement ?");

                if (confirmSuppr == true) {
                    $.ajax({
                       url: REST_API_URL + 'etablissement?id=' + listeEtab[$(this).index() - 1].idEtablissement + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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

            if (datas.length == 0) {
              $("#listviewEtabAdmin").append("<li>Aucun établissement.</li>");
            } 

            $("#listviewEtabAdmin").listview("refresh");
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
    };

    $("#tabEtab").bind("click", initEtabAdmin);
    
    /* Liste des diplômes. */
    
    function initDipAdmin() {
        showLoadingCircle();

        sessionStorage.setItem("currentTab", "diplôme");

        $("#tabDip").addClass("ui-icon-diplome-sel").removeClass("ui-icon-diplome");

        $("#tabFavoris").addClass("ui-icon-favori").removeClass("ui-icon-favori-sel");
        $("#tabEtab").addClass("ui-icon-etablissement").removeClass("ui-icon-etablissement-sel");
        $("#tabAutre").addClass("ui-icon-more").removeClass("ui-icon-more-sel");
        $("#tabAnnee").addClass("ui-icon-annee").removeClass("ui-icon-annee-sel");

        $('#listviewEtabAdmin').empty();
        $('#listviewFavAdmin').empty();
        $('#listviewChercherAnnee').empty();

        $('#autresLinks').hide();

        $("#titleAccueilAdmin").text("Diplôme");

        $("#btnCreaAccueil").show();

        $.get(REST_API_URL + "diplome/getAll", function(datas) {
            hideLoadingCircle();

            $('#listviewDipAdmin').empty();

            $("#listviewDipAdmin").append("<li data-role=\"list-divider\">LISTE DES DIPLÔMES</li>");
            
            var listeDiplomes = [];

            for (var i = 0; i < datas.length; i++) {
              listeDiplomes.push(datas[i]);

              $("#listviewDipAdmin").append("<li id=\"listeDip-" + datas[i].idDiplome + "\">" + datas[i].nom + "</li>");
              
              $("#listeDip-" + datas[i].idDiplome).click(function(event) {
                sessionStorage.setItem("diplome", JSON.stringify(listeDiplomes[$(this).index()  - 1])); 
                $.mobile.changePage("#listeAnneeAdmin", { transition: "slideup", changeHash: false });
              });

              $("#listeDip-" + datas[i].idDiplome).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous supprimer ce diplôme ?");

                if (confirmSuppr == true) {
                    $.ajax({
                       url: REST_API_URL + 'diplome?id=' + listeDiplomes[$(this).index() - 1].idDiplome + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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
              $("#listviewDipAdmin").append("<li>Aucune année.</li>");
            } 

            $("#listviewDipAdmin").listview("refresh");
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
    };

    $("#tabDip").bind("click", initDipAdmin);

    /* Chercher une année. */

    $("#tabAnnee").bind("click", initChercherAnnAdmin);

    function initChercherAnnAdmin() {
        sessionStorage.setItem("currentTab", "année");

        $("#tabAnnee").addClass("ui-icon-annee-sel").removeClass("ui-icon-annee");

        $("#tabFavoris").addClass("ui-icon-favori").removeClass("ui-icon-favori-sel");
        $("#tabEtab").addClass("ui-icon-etablissement").removeClass("ui-icon-etablissement-sel");
        $("#tabAutre").addClass("ui-icon-more").removeClass("ui-icon-more-sel");
        $("#tabDip").addClass("ui-icon-diplome").removeClass("ui-icon-diplome-sel");

        $('#listviewEtabAdmin').empty();
        $('#listviewFavAdmin').empty();
        $('#listviewDipAdmin').empty();

        $("#listviewChercherAnnee").empty();
        $("#listviewChercherAnnee").append("<li data-role=\"list-divider\">FILTRER PAR :</li>");
        $("#listviewChercherAnnee").append("<li id=\"choiceEtabAdminLi\">Etablissement</li>");
        $("#listviewChercherAnnee").append("<li id=\"choiceDipAdminLi\">Diplôme</li>");

        $("#choiceEtabAdminLi").bind("click", function() {
          $.mobile.changePage("#choixEtabAdmin", { transition: "slideup", changeHash: false });
        });

        $("#choiceDipAdminLi").bind("click", function() {
          $.mobile.changePage("#choixDiplomeAdmin", { transition: "slideup", changeHash: false });
        });

        $("#listviewChercherAnnee").listview("refresh");

        $('#autresLinks').hide();

        $("#titleAccueilAdmin").text("Année");

        $("#btnCreaAccueil").show();
    };

    $(document).on("pageshow","#accueilAdmin", function() {
      if (sessionStorage.getItem("isChoiceDipADone")) {
        $("#choiceDipAdminLi").append("<p id=\"choiceDiplAEtudiant\">"+JSON.parse(sessionStorage.getItem("tempDipA")).nom+"</p>");
      }

      if (sessionStorage.getItem("isChoiceEtabADone")) {
        $("#choiceEtabAdminLi").append("<p id=\"choiceEtabAEtudiant\">"+JSON.parse(sessionStorage.getItem("tempEtabA")).nom+"</p>");
      }

      if (sessionStorage.getItem("isChoiceDipADone") && sessionStorage.getItem("isChoiceEtabADone")){
        showLoadingCircle();

        $.get(REST_API_URL + "annee/getAnnees?idDiplome="+(JSON.parse(sessionStorage.getItem("tempDipA"))).idDiplome+"&idEtablissement="+(JSON.parse(sessionStorage.getItem("tempEtabA"))).idEtablissement, function(datas) {
          $("#listviewChercherAnnee li:nth-child(3)").nextAll("li").remove();

          if (datas.length > 0) {
            $("#listviewChercherAnnee").append("<li data-role=\"list-divider\">Liste des années :</li>");

            var listeAnnees = []; 

            for (var i = 0; i < datas.length; i++) {
              listeAnnees.push(datas[i]);
              $("#listviewChercherAnnee").append("<li id=\"listviewChercherAnnee-"+datas[i].idAnnee+"\"><a>" + datas[i].nom + "</a></li>");

              $("#listviewChercherAnnee-" + datas[i].idAnnee).click(function(event) {
                sessionStorage.setItem("diplome", sessionStorage.getItem("tempDipA")); 
                sessionStorage.setItem("annee", JSON.stringify(listeAnnees[$(this).index() - 4])); 

                sessionStorage.removeItem("isChoiceEtabADone");
                sessionStorage.removeItem("isChoiceDipADone");
                sessionStorage.removeItem("tempDipA");
                sessionStorage.removeItem("tempEtabA");

                $.mobile.changePage("#listeUEAdmin", { transition: "slideup", changeHash: false });
              });
            }

            $("#listviewChercherAnnee").listview("refresh");
          }
        }).fail(function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
          console.log(errorThrown);
        }); 

        hideLoadingCircle();
     }
    });

    $("#tabAnnee").bind("click", initChercherAnnAdmin);

    /* Choix Diplôme */

    $(document).on("pageshow","#choixDiplomeAdmin", function() {
      showLoadingCircle();
      initChoixDiplomeAdmin();
      hideLoadingCircle();
    });

    function initChoixDiplomeAdmin() {
      $.get(REST_API_URL + "diplome/getAll", function(datas) {
        $('#listviewDiplAdmin').empty();

        for (var i = 0; i < datas.length; i++) {            
          $("#listviewDiplAdmin").append("<li ntab=\""+i+"\"><a>" + datas[i].nom + "<br></a></li>");
        }

        $("#listviewDiplAdmin").listview("refresh");

        $("#listviewDiplAdmin li a").bind( "click", function() {
          $("#listviewDiplAdmin li a").removeClass();
          $("#listviewDiplAdmin li a").addClass("ui-btn ui-btn-icon-right");

          $(this).addClass("ui-btn ui-btn-icon-right ui-icon-check");

          var i = $(this).parent().attr('ntab');
          sessionStorage.setItem("tempDipA", JSON.stringify(datas[i]));
          sessionStorage.setItem("isChoiceDipADone",true);
        });
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      }); 
    };

    /* Choix établissement */

    $(document).on("pageshow","#choixEtabAdmin", function() {
      showLoadingCircle();
      initChoixEtabAdmin();
      hideLoadingCircle();
    });

    function initChoixEtabAdmin() {
      $.get(REST_API_URL + "etablissement/getAll", function(datas) {
        $('#listviewDiplAdminA').empty();

        for (var i = 0; i < datas.length; i++) {            
          $("#listviewDiplAdminA").append("<li ntab=\""+i+"\"><a>" + datas[i].nom + "<br></a></li>");
        }

        $("#listviewDiplAdminA").listview("refresh");

        $("#listviewDiplAdminA li a").bind( "click", function() {
          $("#listviewDiplAdminA li a").removeClass();
          $("#listviewDiplAdminA li a").addClass("ui-btn ui-btn-icon-right");

          $(this).addClass("ui-btn ui-btn-icon-right ui-icon-check");

          sessionStorage.setItem("tempEtabA", JSON.stringify(datas[$(this).parent().attr('ntab')]));
          sessionStorage.setItem("isChoiceEtabADone",true);
        });
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
      }); 
    };
    
    /* Liste des années. */

    $(document).on("pageshow","#listeAnneeAdmin", function(e, data) {
       initAnnAdmin();
    });
    
    function initAnnAdmin() {
        showLoadingCircle();

        $("#titreListeAnnees").text(JSON.parse(sessionStorage.getItem("diplome")).nom);

        $.get(REST_API_URL + "annee/getAnneesByDiplome?idDiplome=" + JSON.parse(sessionStorage.getItem("diplome")).idDiplome, function(datas) {
            hideLoadingCircle();

            $('#listviewAnnAdmin').empty();

            var listeAnnees = [];
            
            for (var i = 0; i < datas.length; i++) {
              listeAnnees.push(datas[i]);

              $("#listviewAnnAdmin").append("<li id=\"listeAnn-" + datas[i].idAnnee + "\">" + datas[i].nom + "</li>");
              
              $("#listeAnn-" + datas[i].idAnnee).click(function(event) {
                sessionStorage.setItem("annee", JSON.stringify(listeAnnees[$(this).index()])); 
                changePage("listeUEAdmin");
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
              $("#listviewAnnAdmin").append("<li>Aucune année.</li>");
            } 

            $("#listviewAnnAdmin").listview("refresh");
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
    };
    
    /* Liste des UE. */
    
    $(document).on("pageshow","#listeUEAdmin", function() {
       initUEAdmin();
    });
    
    function initUEAdmin() {
        showLoadingCircle();

        $("#titreUEAdminPage").text(JSON.parse(sessionStorage.getItem("annee")).nom);

        $.get(REST_API_URL + "ue/getAllUEOfAnnee?idAnnee=" + JSON.parse(sessionStorage.getItem("annee")).idAnnee, function(datas) {
            hideLoadingCircle();

            $('#listviewUEAdmin').empty();

            var listeUE = [];
            
            for (var i = 0; i < datas.length; i++) {
              listeUE.push(datas[i]);

              $("#listviewUEAdmin").append("<li id=\"listeUE-" + datas[i].idUE + "\">" + datas[i].nom + "</li>");
                
              $("#listeUE-" + datas[i].idUE).click(function(event) {
                sessionStorage.setItem("ue", JSON.stringify(listeUE[$(this).index()])); 
                changePage("listeMatAdmin");
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
              $("#listviewUEAdmin").append("<li>Aucune UE.</li>");
            } 

            $("#listviewUEAdmin").listview("refresh");
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
    };
    
    /* Liste des matières. */
    
    $(document).on("pageshow","#listeMatAdmin",function() {
       initMatAdmin();
    });
    
    function initMatAdmin() {
        showLoadingCircle();

        $("#titreMatiereAdminPage").text(JSON.parse(sessionStorage.getItem("ue")).nom);

        $.get(REST_API_URL + "matiere/getAllMatieretOfUE?idUE=" + JSON.parse(sessionStorage.getItem("ue")).idUE, function(datas) {
            hideLoadingCircle();

            $('#listviewMatAdmin').empty();

            var listeMatieres = [];
            
            for (var i = 0; i < datas.length; i++) {
                listeMatieres.push(datas[i]);

                $("#listviewMatAdmin").append("<li id=\"listeMat-" + datas[i].idMatiere + "\">" + datas[i].nom + "</li>");

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
              $("#listviewMatAdmin").append("<li>Aucune matière.</li>");
            } 

            $("#listviewMatAdmin").listview("refresh");
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
    };

});