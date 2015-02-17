window.addEventListener('DOMContentLoaded', function() {
	
	/* Variable pour l'étudiant */
	var rccEtudiant;
	var curerntAnneeEtudiant;
	var currentMatiereEtudiant;

	/* Liste des années depuis EDAUM */
	$(document).on("pageshow","#addAnneeEtudiant", function() {
		if (sessionStorage.getItem("isChoiceEtabDone")) {
			$("#etabChoiceEtudiant").parent().append("<p id=\"choiceEtabEtudiant\">"+JSON.parse(sessionStorage.getItem("tempEtab")).nom+"</p>");
		}

		// Back Button
		$("#backButtonAddAnneeEtudiant").click(function(event) {
	 	$.mobile.changePage("#accueilEtudiant", { transition: "slideup", reverse: true });
    	});

		// Go to Choix Etablissement
		$("#etabChoiceEtudiant").click(function() {
			$("#choiceEtabEtudiant").remove();
			sessionStorage.setItem("isChoiceEtabActiv",true);
			$.mobile.changePage("#choixEtablissementEtudiant", { transition: "slide", changeHash: false });
		});

		if (sessionStorage.getItem("isChoiceDiplDone")) {
			$("#diplChoiceEtudiant").parent().append("<p id=\"choiceDiplEtudiant\">"+JSON.parse(sessionStorage.getItem("tempDipl")).nom+"</p>");
		}

		// Go to Choix Diplome
		$("#diplChoiceEtudiant").click(function() {
			$("#choiceDiplEtudiant").remove();
			sessionStorage.setItem("isChoiceDiplActiv",true);
			$.mobile.changePage("#choixDiplomeEtudiant", { transition: "slide", changeHash: false });
		});

		if (sessionStorage.getItem("isChoiceDiplDone") && sessionStorage.getItem("isChoiceEtabDone")){
			showLoadingCircle();
			$.get(REST_API_URL + "annee/getAnnees?idDiplome="+(JSON.parse(sessionStorage.getItem("tempDipl"))).idDiplome+"&idEtablissement="+(JSON.parse(sessionStorage.getItem("tempEtab"))).idEtablissement, function(datas) {
				$("#listAddAnneesEtudiant li:nth-child(3)").nextAll("li").remove();

				if (datas.length > 0) {
					var listAddAnneesEtudiantDOM = $("#listAddAnneesEtudiant");
					listAddAnneesEtudiantDOM.append("<li data-role=\"list-divider\">Liste des années :</li>");

					for (var i = 0; i < datas.length; i++) {
						listAddAnneesEtudiantDOM.append("<li ntab=\""+i+"\"><a>" + datas[i].nom + "</a></li>");
					}
					listAddAnneesEtudiantDOM.listview("refresh");

					$("#listAddAnneesEtudiant li a").bind( "click", function() {
						var i = $(this).parent().attr('ntab');

						if (confirm("Cliquer sur OK pour télécharger le RCC \""+datas[i].nom+"\" du diplôme \""+JSON.parse(sessionStorage.getItem("tempDipl")).nom+"\" de l'établissement \""+JSON.parse(sessionStorage.getItem("tempEtab")).nom+"\"") == true) {
							showLoadingCircle();
							$.get(REST_API_URL + "annee/getCompleteYear?idAnnee="+datas[i].idAnnee, function(datasCompleteYear) {
								console.log(datasCompleteYear);
								addAnnee(datasCompleteYear);
								$.mobile.changePage("#accueilEtudiant", { transition: "slideup", reverse: true });
							}).fail(function(jqXHR, textStatus, errorThrown) {
								console.log(textStatus);
								console.log(errorThrown);
							}); 
							hideLoadingCircle();
						} else {
							console.log("retour");
						}
					});
				}
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
				console.log(errorThrown);
			}); 
			hideLoadingCircle();
		}
	});


/* Choix établissement */
$(document).on("pageshow","#choixEtablissementEtudiant", function() {
	showLoadingCircle();
	initChoixEtablissementEtudiant();
	hideLoadingCircle();
});

function initChoixEtablissementEtudiant() {
	$("#backButtonChoixEtablissementEtudiant").click(function(event) {
	 	$.mobile.changePage("#addAnneeEtudiant", { transition: "slide", reverse: true });
    });

	$.get(REST_API_URL + "etablissement/getAll", function(datas) {
		$('#listviewEtabEtudiant').empty();

		for (var i = 0; i < datas.length; i++) {       
			$("#listviewEtabEtudiant").append("<li ntab=\""+i+"\"><a>" + datas[i].nom + "<br><p>" + datas[i].ville + "</p></a></li>");
		}

		$("#listviewEtabEtudiant").listview("refresh");

		$("#listviewEtabEtudiant li a").bind( "click", function() {
			$("#listviewEtabEtudiant li a").removeClass();
			$("#listviewEtabEtudiant li a").addClass("ui-btn ui-btn-icon-right");

			$(this).addClass("ui-btn ui-btn-icon-right ui-icon-check");

			var i = $(this).parent().attr('ntab');
			sessionStorage.setItem("tempEtab", JSON.stringify(datas[i]));
			sessionStorage.setItem("isChoiceEtabDone",true);
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.log(textStatus);
		console.log(errorThrown);
	}); 
}

/* Choix Diplôme */
$(document).on("pageshow","#choixDiplomeEtudiant", function() {
	$("#backButtonChoixDiplomeEtudiant").click(function(event) {
	 	$.mobile.changePage("#addAnneeEtudiant", { transition: "slide", reverse: true });
    });

	showLoadingCircle();
	initChoixDiplomeEtudiant();
	hideLoadingCircle();
});

function initChoixDiplomeEtudiant() {
	$.get(REST_API_URL + "diplome/getAll", function(datas) {
		$('#listviewEtabEtudiant').empty();

		for (var i = 0; i < datas.length; i++) {            
			$("#listviewDiplEtudiant").append("<li ntab=\""+i+"\"><a>" + datas[i].nom + "<br></a></li>");
		}

		$("#listviewDiplEtudiant").listview("refresh");

		$("#listviewDiplEtudiant li a").bind( "click", function() {
			$("#listviewDiplEtudiant li a").removeClass();
			$("#listviewDiplEtudiant li a").addClass("ui-btn ui-btn-icon-right");

			$(this).addClass("ui-btn ui-btn-icon-right ui-icon-check");

			var i = $(this).parent().attr('ntab');
			sessionStorage.setItem("tempDipl", JSON.stringify(datas[i]));
			sessionStorage.setItem("isChoiceDiplDone",true);
		});

	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		console.log(textStatus);
		console.log(errorThrown);
	}); 
};

/* Liste RCC Etudiant */
$(document).on("pagebeforeshow","#accueilEtudiant", function() {
	$("#addAnneeEtudiantButton").click(function(event) {
        $.mobile.changePage("#addAnneeEtudiant", { transition: "slideup", changeHash: false });
    });

	$("#backButtonAccueilEtudiant").click(function(event) {
	 	$.mobile.changePage("#accueil", { transition: "slideup", reverse: true });
    });

	console.log("accueilEtudiant");
	loadRCCs();
	console.log("beforeGetRcc");
	console.log(rccEtudiant);
	getRccEtudiant();
});

function getRccEtudiant(){
	var listRCCEtudiantDOM = $('#listRCCEtudiant');
	listRCCEtudiantDOM.empty();

	for (var i = 0; i < rccEtudiant.length; i++) {         
		console.log(rccEtudiant[i]);

		listRCCEtudiantDOM.append("<li data-role=\"list-divider\">" + rccEtudiant[i].nomDiplome + "</li>");

		for (var j = 0;j < rccEtudiant[i].annees.length; j++){
			//listRCCEtudiantDOM.append("<li section=\""+i+"\" row=\""+j+"\"><a>" + rccEtudiant[i].annees[j].nom + "<br></a></li>");
			console.log("getRccEtudiant");
			console.log(rccEtudiant[i].annees[j]);
			if (rccEtudiant[i].annees[j].moyenne == -1){
				listRCCEtudiantDOM.append("<li section=\""+i+"\" row=\""+j+"\"><a>" + rccEtudiant[i].annees[j].nom + "<br></a><div class=\"noteEtudiant\"><div><p class=\"withoutNote\">Aucune note</p></div></div></li>");
			}
			else {
				listRCCEtudiantDOM.append("<li section=\""+i+"\" row=\""+j+"\"><a>" + rccEtudiant[i].annees[j].nom + "<br></a><div class=\"noteEtudiant\"><div><p class=\"withNote\">"+rccEtudiant[i].annees[j].moyenne.toFixed(2)+"</p></div></div></li>");
			}
		}
	}

	$("#listRCCEtudiant li").bind( "click", function() {
		var section = $(this).attr('section');
		var row = $(this).attr('row');
		currentAnneeEtudiant = rccEtudiant[section].annees[row];
		$.mobile.changePage("#listUEEtudiant", { transition: "slide", changeHash: false });
	});

	$("#listRCCEtudiant li").bind("taphold", function() {
		var section = $(this).attr('section');
		var row = $(this).attr('row');

		if (confirm("Etes vous sûr de vouloir supprimer \""+rccEtudiant[section].annees[row].nom+"\" du \""+rccEtudiant[section].nomDiplome+"\" ?") == true) {
			console.log("suppression");
			rccEtudiant[section].annees.splice(row,1);

			if (rccEtudiant[section].annees.length <= 0) {
				rccEtudiant.splice(section,1);
			}
			saveRCCs();
			getRccEtudiant();
		}
		else {
			console.log("do nothing");
		}

	});


	listRCCEtudiantDOM.listview("refresh");
};


$(document).on("pagebeforeshow","#listUEEtudiant", function() {
	$("#backButtonListUEEtudiant").click(function(event) {
	 	$.mobile.changePage("#accueilEtudiant", { transition: "slide", reverse: true });
    });

	showPageUE();
});

/* Liste des UEs et Matières */
function showPageUE(){
	var listUEMatiereEtudiantDOM = $("#listUEMatiereEtudiant");
	listUEMatiereEtudiantDOM.empty();

	for (var i = 0; i < currentAnneeEtudiant.ues.length; i++) {         
		var ue = new UE(currentAnneeEtudiant.ues[i], currentAnneeEtudiant);
		listUEMatiereEtudiantDOM.append("<li idue="+currentAnneeEtudiant.ues[i].idUE+" data-role=\"list-divider\">" + currentAnneeEtudiant.ues[i].nom.toUpperCase() + "</li>");

		for (var j = 0;j < ue.matieres.length; j++){
			var matiere = new Matiere(ue.matieres[j], ue);
			matiere.sayHello();
			if (matiere.moyenne == -1){
				listUEMatiereEtudiantDOM.append("<li section=\""+i+"\" row=\""+j+"\"><a>" + matiere.nom + "<br><p>Coefficient : "+matiere.coefficient+"</p></a><div class=\"noteEtudiant\"><div><p class=\"withoutNote\">Aucune note</p></div></div></li>");
			}
			else {
				listUEMatiereEtudiantDOM.append("<li section=\""+i+"\" row=\""+j+"\"><a>" + matiere.nom + "<br><p>Coefficient : "+matiere.coefficient+"</p></a><div class=\"noteEtudiant\"><div><p class=\"withNote\">"+matiere.moyenne.toFixed(2)+"</p></div></div></li>");
			}
			$("[section="+i+"]").bind( "click", function() {
				var section = $(this).attr('section');
				var row = $(this).attr('row');
				console.log(section+":"+row);
				console.log(currentAnneeEtudiant);
				currentMatiereEtudiant = currentAnneeEtudiant.ues[section].matieres[row];
				$.mobile.changePage("#editeNoteMatiereEtudiant", { transition: "slide", changeHash: false });
			});
		}
	}

	listUEMatiereEtudiantDOM.listview("refresh");
}

$(document).on("pagebeforeshow","#editeNoteMatiereEtudiant", function() {
	if (currentMatiereEtudiant.moyenne > -1){
		$("#noteps").val(currentMatiereEtudiant.moyenne);
	}
	else {
		$("#noteps").val("");
	}

	$("#backButtonEditeNoteMatiereEtudiant").click(function(event) {
	 	$.mobile.changePage("#listUEEtudiant", { transition: "slide", reverse: true });
    });

	$("#saveModifMatiere").click(function() {
		var notePS = $('#noteps').val();
		console.log(notePS);
		currentMatiereEtudiant.moyenne = parseFloat(notePS);
		currentMatiereEtudiant.ue.actualiserMoyenne();
		saveRCCs();
	 	$.mobile.changePage("#listUEEtudiant", { transition: "slide", reverse: true });
	});

	$("#buttonAddNoteCC").click(function() {
	 	$.mobile.changePage("#addNoteCCEtudiant", { transition: "slide", reverse: false });
	});

});

$(document).on("pagebeforeshow","#addNoteCCEtudiant", function() {

	$("#backButtonAddNoteCCEtudiant").click(function(event) {
	 	$.mobile.changePage("#editeNoteMatiereEtudiant", { transition: "slide", reverse: true });
    });

	$("#saveNoteCC").click(function() {
		//var notePS = $('#noteps').val();
		console.log("Save Add Note CC");

		//currentMatiereEtudiant.moyenne = parseFloat(notePS);
		//currentMatiereEtudiant.ue.actualiserMoyenne();
		//saveRCCs();
	 	$.mobile.changePage("#listUEEtudiant", { transition: "slide", reverse: false });
	});
});

/* Objets métiers */

function EDAUMDiplome(jsonDatasDiplome){
	this.nomDiplome = jsonDatasDiplome.nomDiplome;
	this.idDiplome = jsonDatasDiplome.idDiplome;
	this.annees = new Array();
	console.log(jsonDatasDiplome);
		this.annees.push(new Annee(jsonDatasDiplome));	
}

function Diplome(jsonDatasDiplome){
	this.nomDiplome = jsonDatasDiplome.nomDiplome;
	this.idDiplome = jsonDatasDiplome.idDiplome;
	this.annees = new Array();
	console.log(jsonDatasDiplome);

	for (var i = 0; i < jsonDatasDiplome.annees.length; i++){
		this.annees.push(new Annee(jsonDatasDiplome.annees[i]));	
		console.log(jsonDatasDiplome.annees[i]);		
	}
}

function Annee(jsonDatasAnnee){
	this.nom = jsonDatasAnnee.nom;
	//this.nomEtablissement = jsonDatasAnnee.etablissement.nom;
	//this.villeEtablissement = jsonDatasAnnee.etablissement.ville;
	this.isLastYear = jsonDatasAnnee.isLastYear;
	this.idAnnee = jsonDatasAnnee.idAnnee;
	this.decoupage = jsonDatasAnnee.decoupage;
	console.log(jsonDatasAnnee.moyenne);
	if (jsonDatasAnnee.moyenne != null) {
		this.moyenne = jsonDatasAnnee.moyenne;
	}
	else {
		this.moyenne = -1;
	}
	console.log(this.moyenne);

	this.ues = new Array();
	console.log(jsonDatasAnnee)
	for (var i = 0; i < jsonDatasAnnee.ues.length; i++){
		var ue = new UE(jsonDatasAnnee.ues[i], this);
		this.ues.push(ue);
	}

	/*this.ues = jsonDatasAnnee.ues;
	for (var i = 0; i < this.ues.length; i++){
		this.ues[i].moyenne = -1;
		for (var j = 0; j < this.ues[i].matieres.length; j++){
			this.ues[i].matieres[j].moyenne = -1;
		}
	}*/
}

Annee.prototype.actualiserMoyenne = function() {
    var totalCoeff = 0;
    var noteCoefficiente = 0;
    
    for (var i = 0; i < this.ues.length; i++) {
    	ue = this.ues[i];
        if (ue.moyenne > -1.0) {
            totalCoeff += ue.coefficientUE;
            noteCoefficiente += ue.moyenne*ue.coefficientUE;
        }
    }
    if (totalCoeff > 0) {
        this.moyenne = noteCoefficiente/totalCoeff;
    }
    else {
        this.moyenne = -1.0;
    }
    console.log("Moyenne Annee : "+this.moyenne);
    	console.log(rccEtudiant);

    //this.isValid = self.checkValid()
    //this.isComplete = self.checkComplete()
}


function UE(jsonDatasUE, annee){
	this.annee = annee;
		this.nom = jsonDatasUE.nom;
	this.idUE = jsonDatasUE.idUE;
	this.coefficientUE = 0;
	if (jsonDatasUE.moyenne != null) {
		this.moyenne = jsonDatasUE.moyenne;
	}
	else {
		this.moyenne = -1;
	}	
	this.nbOptMini = jsonDatasUE.nbOptMini;
	this.noteMini = jsonDatasUE.noteMini;
	this.yearType = jsonDatasUE.yearType;

	this.matieres = new Array();
	for (var i = 0; i < jsonDatasUE.matieres.length; i++){
		var matiere = new Matiere(jsonDatasUE.matieres[i], this);
		this.coefficientUE += matiere.coefficient;
		this.matieres.push(matiere);
	}
}

UE.prototype.actualiserMoyenne = function(){
	    var totalCoeff = 0;
        var noteCoefficiente = 0;
        var tempNbOptMini = this.nbOptMini;

        //self.isComplete = true
        var array = this.matieres;
	    array.sort(function(a, b){
		    var keyA = new Date(a.moyenne),
		    keyB = new Date(b.moyenne);
		    if(keyA < keyB) return -1;
		    if(keyA > keyB) return 1;
		    return 0;
		});
		console.log(array);
        for (var i = 0; i < array.length; i++) {
            if(array[i].isOption == true){
                tempNbOptMini--;
            }
            if (array[i].moyenne > -1.0 && tempNbOptMini >= 0){
                totalCoeff += array[i].coefficient;
                noteCoefficiente += array[i].moyenne*array[i].coefficient;
            }
            else if (array[i].moyenne == -1.0) {
                //self.isComplete = false
            }
            console.log(array[i].moyenne);
        }

        this.coefficientUE = totalCoeff;
        
        if (totalCoeff == 0) {
            this.moyenne = -1.0;
        }
        else {
            this.moyenne = noteCoefficiente/totalCoeff;
        }
        console.log("Moyenne UE : "+this.moyenne);
        this.annee.actualiserMoyenne();
        //self.isValid = self.checkValid()
        //self.annee.actualiserMoyenne()
}

function Matiere(jsonDatasMatiere , ue){
	this.ue = ue;
	this.coefficient = parseFloat(jsonDatasMatiere.coefficient);
	this.idMatiere = jsonDatasMatiere.idMatiere;
	this.isOption = jsonDatasMatiere.isOption;
	this.isRattrapable = jsonDatasMatiere.isRattrapable;
	this.noteMini = jsonDatasMatiere.noteMini;
	if (jsonDatasMatiere.moyenne != null) {
		this.moyenne = jsonDatasMatiere.moyenne;
	}
	else {
		this.moyenne = -1;
	}
	this.nom = jsonDatasMatiere.nom;
	// Note CC
}

Matiere.prototype.sayHello = function(){
	console.log("hello from "+this.nom+"| Moyenne : "+this.moyenne+" | My parent is "+this.ue.nom+" | MoyenneUE : "+this.ue.moyenne);
};

function addAnnee(jsonDatasAnnee){
	console.log(localStorage.getItem("rccEtudiant"));

	var isAdded = false;
	for (var i = 0; i < rccEtudiant.length; i++){
		if (rccEtudiant[i].idDiplome == jsonDatasAnnee.idDiplome){
			rccEtudiant[i].annees.push(new Annee(jsonDatasAnnee));
			isAdded = true;
		}
	}

	if (!isAdded){
		rccEtudiant.push(new EDAUMDiplome(jsonDatasAnnee));
	}

	saveRCCs();
}

/* Save & Load Rcc LocalStoralge */

function saveRCCs(){
	var cache = [];
	localStorage.setItem("rccEtudiant", JSON.stringify(rccEtudiant, function(key, value) {
	if (typeof value === 'object' && value !== null) {
		if (cache.indexOf(value) !== -1) {
            // Circular reference found, discard key
            return;
        }
        // Store value in our collection
        cache.push(value);
    	}
    return value;
	}));
	cache = null;
	console.log("RCCs Sauvegardés !");
	console.log(rccEtudiant)
}

function loadRCCs(){
	if (localStorage.getItem("rccEtudiant") == null){
		localStorage.setItem("rccEtudiant", JSON.stringify(new Array()));
	}

	rccEtudiant = new Array();
	for (var i = 0; i < JSON.parse(localStorage.getItem("rccEtudiant")).length; i++){
		var d = new Diplome(JSON.parse(localStorage.getItem("rccEtudiant"))[i]);
		console.log(d);
		console.log("Diplome"+i);
		rccEtudiant.push(d);
	}
	console.log(rccEtudiant);
}


});