window.addEventListener('DOMContentLoaded', function() {

    /* Liste des favoris. */
    
    $(document).on("pageshow","#favoriAdmin", function() {
       initFavAdmin();
    });
    
    function initFavAdmin() {
        showLoadingCircle();

        $.get(REST_API_URL + "annee/getFavorites?pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
            $.mobile.loading('hide');

            $('#listviewFavAdmin').empty();

            for (var i = 0; i < datas.length; i++) {            
              $("#listviewFavAdmin").append("<li id=idAnneeFav" + datas[i].idAnnee + ">" + datas[i].nom + "<br><p>" + datas[i].etablissement.nom + " - " + datas[i].etablissement.ville + "</p></li>");
            
              $("#idAnneeFav" + datas[i].idAnnee).click(function(event) {
                localStorage.setItem("idDiplome", this.id.substring(10));

                setTimeout(function() { 
                    $.mobile.changePage("#listeAnneeAdmin", { transition: "slideup", changeHash: false });
                }, 100);
              });

              $("#idAnneeFav" + datas[i].idAnnee).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous vraiment ne plus suivre cette année ?");

                if (confirmSuppr == true) {
                    $.get(REST_API_URL + "admin/unfollow?idAnnee=" + this.id.substring(10) + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(), function(datas) {
                      alert("Cette année n'est plus suivie.");
                    }
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        if (jqXHR.status == 200) {
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
    
    /* Liste des établissements. */
    
    $(document).on("pageshow","#etabAdmin", function() {
       initEtabAdmin();
    });
    
    function initEtabAdmin() {
        showLoadingCircle();

        $.get(REST_API_URL + "etablissement/getAll", function(datas) {
            $.mobile.loading('hide');

            $('#listviewEtabAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {            
              $("#listviewEtabAdmin").append("<li id=idEtab" + datas[i].idEtablissement + ">" + datas[i].nom + "<br><p>" + datas[i].ville + "</p></li>");

              $("#idEtab" + datas[i].idEtablissement).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous supprimer cet établissement ?");

                if (confirmSuppr == true) {
                    $.ajax({
                       url: REST_API_URL + 'etablissement?id=' + this.id.substring(6) + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
                       type: 'DELETE',
                       statusCode: {
                          200: function() {
                              alert('Etablissement supprimé.');
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
    
    /* Liste des diplômes. */
    
    $(document).on("pageshow","#diplomesAdmin",function() {
       initDipAdmin();
    });
    
    function initDipAdmin() {
        showLoadingCircle();

        $.get(REST_API_URL + "diplome/getAll", function(datas) {
            $.mobile.loading('hide');

            $('#listviewDipAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {
              $("#listviewDipAdmin").append("<li id=idDip" + datas[i].idDiplome + ">" + datas[i].nom + "</li>");
                
              $("#idDip" + datas[i].idDiplome).click(function(event) {
                localStorage.setItem("idDiplome", this.id.substring(5));

                setTimeout(function() { 
                  $.mobile.changePage("#listeAnneeAdmin", { transition: "slideup", changeHash: false });
                }, 100);
              });

              $("#idDip" + datas[i].idDiplome).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous supprimer ce diplôme ?");

                if (confirmSuppr == true) {
                    $.ajax({
                       url: REST_API_URL + 'diplome?id=' + this.id.substring(5) + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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
    
    /* Liste des années. */

    $(document).on("pageshow","#listeAnneeAdmin", function(e, data) {
       initAnnAdmin();
    });
    
    function initAnnAdmin(idDip) {
        showLoadingCircle();

        $.get(REST_API_URL + "annee/getAnneesByDiplome?idDiplome=" + localStorage.getItem("idDiplome"), function(datas) {
            $.mobile.loading('hide');

            $('#listviewAnnAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {
              $("#listviewAnnAdmin").append("<li id=idAnn" + datas[i].idAnnee + ">" + datas[i].nom + "</li>");
              
              $("#idAnn" + datas[i].idAnnee).click(function(event) {
                localStorage.setItem("idAnnee", this.id.substring(5));

                setTimeout(function() { 
                    $.mobile.changePage("#listeUEAdmin", { transition: "slideup", changeHash: false });
                }, 100);
              });

              $("#idAnn" + datas[i].idAnnee).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous supprimer cette année ?");

                if (confirmSuppr == true) {
                    $.ajax({
                       url: REST_API_URL + 'annee?id=' + this.id.substring(5) + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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

        $.get(REST_API_URL + "ue/getAllUEOfAnnee?idAnnee=" + localStorage.getItem("idAnnee"), function(datas) {
            $.mobile.loading('hide');

            $('#listviewUEAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {
              $("#listviewUEAdmin").append("<li id=idUE" + datas[i].idUE + ">" + datas[i].nom + "</li>");
                
              $("#idUE" + datas[i].idUE).click(function(event) {
                localStorage.setItem("idUE", this.id.substring(4));
                $.mobile.changePage("#listeMatAdmin", { transition: "slideup", changeHash: false });
              });

              $("#idUE" + datas[i].idUE).bind("taphold", function (event) {
                var confirmSuppr = confirm("Voulez-vous supprimer cette UE ?");

                if (confirmSuppr == true) {
                  $.ajax({
                     url: REST_API_URL + 'ue?id=' + this.id.substring(4) + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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

        $.get(REST_API_URL + "matiere/getAllMatieretOfUE?idUE=" + localStorage.getItem("idUE"), function(datas) {
            $.mobile.loading('hide');

            $('#listviewMatAdmin').empty();
            
            for (var i = 0; i < datas.length; i++) {
                $("#listviewMatAdmin").append("<li id=idMat" + datas[i].idMatiere + ">" + datas[i].nom + "</li>");

                $("#idMat" + datas[i].idMatiere).bind("taphold", function (event) {
                    var confirmSuppr = confirm("Voulez-vous supprimer cette matière ?");

                    if (confirmSuppr == true) {
                        $.ajax({
                           url: REST_API_URL + 'matiere?id=' + this.id.substring(5) + "&pseudo=" + localStorage.getItem("pseudo") + "&token=" + localStorage.getItem("token") + "&timestamp=" + new Date().getTime(),
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