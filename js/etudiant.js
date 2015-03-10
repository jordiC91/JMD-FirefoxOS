window.addEventListener('DOMContentLoaded', function() {
	
	/* Variable pour l'étudiant */
	var rccEtudiant;
	var currentAnneeEtudiant;
	var currentMatiereEtudiant;

	/* Liste des années depuis EDAUM */
	$(document).on("pageshow","#addAnneeEtudiant", function() {
		if (sessionStorage.getItem("isChoiceEtabDone")) {
			$("#etabChoiceEtudiant").parent().append("<p id=\"choiceEtabEtudiant\">"+JSON.parse(sessionStorage.getItem("tempEtab")).nom+"</p>");
		}

		if (sessionStorage.getItem("isChoiceDiplDone")) {
			$("#diplChoiceEtudiant").parent().append("<p id=\"choiceDiplEtudiant\">"+JSON.parse(sessionStorage.getItem("tempDipl")).nom+"</p>");
		}

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
						if(datas[i] != null){
							if (confirm("Cliquer sur OK pour télécharger le RCC \""+datas[i].nom+"\" du diplôme \""+JSON.parse(sessionStorage.getItem("tempDipl")).nom+"\" de l'établissement \""+JSON.parse(sessionStorage.getItem("tempEtab")).nom+"\"") == true) {
								showLoadingCircle();
								$.get(REST_API_URL + "annee/getCompleteYear?idAnnee="+datas[i].idAnnee, function(datasCompleteYear) {
									addAnnee(datasCompleteYear);
									$.mobile.changePage("#accueilEtudiant", { transition: "slideup", reverse: true });
									hideLoadingCircle();
								}).fail(function(jqXHR, textStatus, errorThrown) {
									console.log(textStatus);
									console.log(errorThrown);
									hideLoadingCircle();
								}); 
							}
						}
					});
				}
				hideLoadingCircle();
			}).fail(function(jqXHR, textStatus, errorThrown) {
				console.log(textStatus);
				console.log(errorThrown);
				hideLoadingCircle();
			}); 
		}
	});

// Go to Choix Diplome
$("#diplChoiceEtudiant").click(function() {
	$("#choiceDiplEtudiant").remove();
	sessionStorage.setItem("isChoiceDiplActiv",true);
	$.mobile.changePage("#choixDiplomeEtudiant", { transition: "slide", changeHash: false });
});

// Go to Choix Etablissement
$("#etabChoiceEtudiant").click(function() {
	$("#choiceEtabEtudiant").remove();
	sessionStorage.setItem("isChoiceEtabActiv",true);
	$.mobile.changePage("#choixEtablissementEtudiant", { transition: "slide", changeHash: false });
});

$("#backButtonAddAnneeEtudiant").click(function(event) {
	$.mobile.changePage("#accueilEtudiant", { transition: "slideup", reverse: true });
});

/* Choix établissement */
$(document).on("pageshow","#choixEtablissementEtudiant", function() {
	showLoadingCircle();
	initChoixEtablissementEtudiant();
});

$("#backButtonChoixEtablissementEtudiant").click(function(event) {
	$.mobile.changePage("#addAnneeEtudiant", { transition: "slide", reverse: true });
});

function initChoixEtablissementEtudiant() {

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
		hideLoadingCircle();
	}).fail(function(jqXHR, textStatus, errorThrown) {
		console.log(textStatus);
		console.log(errorThrown);
			hideLoadingCircle();
	}); 
}

/* Choix Diplôme */
$(document).on("pageshow","#choixDiplomeEtudiant", function() {
	showLoadingCircle();
	initChoixDiplomeEtudiant();
});

$("#backButtonChoixDiplomeEtudiant").click(function(event) {
	$.mobile.changePage("#addAnneeEtudiant", { transition: "slide", reverse: true });
});

function initChoixDiplomeEtudiant() {
	$.get(REST_API_URL + "diplome/getAll", function(datas) {
		$('#listviewDiplEtudiant').empty();

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
		hideLoadingCircle();
	}).fail(function(jqXHR, textStatus, errorThrown) {
		console.log(textStatus);
		console.log(errorThrown);
		hideLoadingCircle();
	}); 
};

/* Liste RCC Etudiant */
$("#addAnneeEtudiantButton").click(function(event) {
	$.mobile.changePage("#addAnneeEtudiant", { transition: "slideup", changeHash: false });
});

$("#backButtonAccueilEtudiant").click(function(event) {
	$.mobile.changePage("#accueil", { transition: "slideup", reverse: true });
});

$(document).on("pagebeforeshow","#accueilEtudiant", function() {
	loadRCCs();
	getRccEtudiant();
});

function getRccEtudiant(){
	var listRCCEtudiantDOM = $('#listRCCEtudiant');
	listRCCEtudiantDOM.empty();

	for (var i = 0; i < rccEtudiant.length; i++) {         
		listRCCEtudiantDOM.append("<li data-role=\"list-divider\">" + rccEtudiant[i].nomDiplome + "</li>");

		for (var j = 0;j < rccEtudiant[i].annees.length; j++){
			if (rccEtudiant[i].annees[j].moyenne == -1){
				listRCCEtudiantDOM.append("<li section=\""+i+"\" row=\""+j+"\"><a>" + rccEtudiant[i].annees[j].nom + "<br></a><div class=\"noteEtudiant\"><div><p class=\"withoutNote\">Aucune note</p></div></div></li>");
			}
			else {
				listRCCEtudiantDOM.append("<li section=\""+i+"\" row=\""+j+"\"><a>" + rccEtudiant[i].annees[j].nom + "<br></a><div class=\"noteEtudiant\"><div><p class=\"withNote\" style=\""+rccEtudiant[i].annees[j].getColor()+"\">"+rccEtudiant[i].annees[j].moyenne.toFixed(3)+"</p></div></div></li>");
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
			rccEtudiant[section].annees.splice(row,1);

			if (rccEtudiant[section].annees.length <= 0) {
				rccEtudiant.splice(section,1);
			}
			saveRCCs();
			getRccEtudiant();
		}
	});

	listRCCEtudiantDOM.listview("refresh");
};

$("#backButtonListUEEtudiant").click(function(event) {
	$.mobile.changePage("#accueilEtudiant", { transition: "slide", reverse: true });
});

$(document).on("pagebeforeshow","#listUEEtudiant", function() {
	$("#listUEEtudiant .headerTextTabs").text(currentAnneeEtudiant.nom);

	$("#selectDecoupage").empty();
	$("#selectDecoupage").navbar("destroy");
	if (currentAnneeEtudiant.decoupage == "SEMESTRE"){
		$("#selectDecoupage").append("<ul><li id=\"sem1\"><a data-ajax=\"false\">Semestre 1</a></li><li id=\"sem2\"><a data-ajax=\"false\">Semestre 2</a></li></ul>");
		showPageUE("SEM1");

		$("#sem2").click(function(event) {
			showPageUE("SEM2");
		});

		$("#sem1").click(function(event) {
			showPageUE("SEM1");
		});
	}
	else if (currentAnneeEtudiant.decoupage == "TRIMESTRE"){
		$("#selectDecoupage").append("<ul><li><a href=\"#tri1\" data-ajax=\"false\">Trimestre 1</a></li><li><a href=\"#tri2\" data-ajax=\"false\">Trimestre 2</a></li><li><a href=\"#tri3\" data-ajax=\"false\">Trimestre 3</a></li></ul>");
		showPageUE("TRI1");

		$("#tri2").click(function(event) {
			showPageUE("TRI2");
		});

		$("#tri1").click(function(event) {
			showPageUE("TRI1");
		});

		$("#tri3").click(function(event) {
			showPageUE("TRI3");
		});
	}
	else {
		showPageUE("NULL");
	}
	$("#selectDecoupage").navbar();
});

/* Liste des UEs et Matières */
function showPageUE(decoupage){
	var listUEMatiereEtudiantDOM = $("#listUEMatiereEtudiant");
	listUEMatiereEtudiantDOM.fadeOut("fast", function(){

		listUEMatiereEtudiantDOM.empty();
		if (decoupage == "NULL"){
			var ues = currentAnneeEtudiant.ues;
		}
		else {
			var ues = currentAnneeEtudiant.getUEsByDecoupage(decoupage);
		}

		for (var i = 0; i < ues.length; i++) {         
			var ue = new UE(ues[i], currentAnneeEtudiant);

			listUEMatiereEtudiantDOM.append("<li idue="+ue.idUE+" data-role=\"list-divider\">" + ue.nom.toUpperCase() + "</li>");
			for (var j = 0;j < ue.matieres.length; j++){
				var matiere = new Matiere(ue.matieres[j], ue);
				var optionText = "";
				if (matiere.isOption){
					optionText = " | Option";
				}

				if (matiere.moyenne == -1){
					listUEMatiereEtudiantDOM.append("<li section=\""+i+"\" row=\""+j+"\"><a>" + matiere.nom + "<br><p>Coefficient : "+matiere.coefficient+optionText+"</p></a><div class=\"noteEtudiant\"><div><p class=\"withoutNote\">Aucune note</p></div></div></li>");
				}
				else {
					listUEMatiereEtudiantDOM.append("<li section=\""+i+"\" row=\""+j+"\"><a>" + matiere.nom + "<br><p>Coefficient : "+matiere.coefficient+optionText+"</p></a><div class=\"noteEtudiant\"><div><p class=\"withNote\">"+matiere.moyenne.toFixed(2)+"</p></div></div></li>");
				}

				$("[section="+i+"]").bind( "click", function() {
					var section = $(this).attr('section');
					var row = $(this).attr('row');
					currentMatiereEtudiant = currentAnneeEtudiant.ues[section].matieres[row];
					$.mobile.changePage("#editeNoteMatiereEtudiant", { transition: "slide", changeHash: false });
				});
			}
			if (ue.moyenne > -1.0){
				listUEMatiereEtudiantDOM.append("<li data-role=\"list-divider\" class=\"footerDivider\"><p class=\"footerDivider\">Moyenne UE : " + ue.moyenne.toFixed(2) + " / 20</p></li>");
			}
		}

		listUEMatiereEtudiantDOM.listview("refresh");
		listUEMatiereEtudiantDOM.fadeIn("fast");

	});
}

$("#getPDF").click(function(event) {
	getPdf();
});

$(document).on("pagebeforeshow","#editeNoteMatiereEtudiant", function() {
	if (currentMatiereEtudiant.notePS > -1){
		$("#noteps").val(currentMatiereEtudiant.notePS);
	}
	else {
		$("#noteps").val("");
	}

	if (currentMatiereEtudiant.noteDS > -1){
		$("#noteds").val(currentMatiereEtudiant.noteDS);
	}
	else {
		$("#noteds").val("");
	}

	if (currentMatiereEtudiant.coefficientSession != -1){
		$("#coefficient").val(currentMatiereEtudiant.coefficientSession);
	}
	else {
		$("#coefficient").val("");
	}

	$("#footerEditeNoteMatiere").remove();
	if (currentMatiereEtudiant.noteMini > 0){
		$("#editeNoteChampsList li:nth-child(3)").after("<li id=\"footerEditeNoteMatiere\" data-role=\"list-divider\" class=\"footerDivider\"><p class=\"footerDivider\">La moyenne minimale de cette matière est de "+currentMatiereEtudiant.noteMini+" / 20</p></li>");
	}

	getNotesCC();
});

$("#backButtonEditeNoteMatiereEtudiant").click(function(event) {
	$.mobile.changePage("#listUEEtudiant", { transition: "slide", reverse: true });	
});

$("#saveModifMatiere").click(function() {
	currentMatiereEtudiant.notePS = parseFloat($('#noteps').val());
	currentMatiereEtudiant.noteDS = parseFloat($('#noteds').val());
	currentMatiereEtudiant.coefficientSession = $('#coefficient').val();

	currentMatiereEtudiant.actualiserMoyenne();
	saveRCCs();
	$.mobile.changePage("#listUEEtudiant", { transition: "slide", reverse: true });
});

$("#buttonAddNoteCC").click(function() {
	$.mobile.changePage("#addNoteCCEtudiant", { transition: "slideup", reverse: false });
});

function getNotesCC() {
	$(".notecc").remove();
	var listEditeNoteCCDOM = $("#editeNoteChampsList li:last-child");
	if (currentMatiereEtudiant.notesCC.length > 0) {

		for (var i = 0; i < currentMatiereEtudiant.notesCC.length; i++) {
			listEditeNoteCCDOM.before("<li class=\"notecc ui-field-contain ui-li-static ui-body-inherit\" ntab=\""+i+"\">" + currentMatiereEtudiant.notesCC[i].nom + "<br><p>Coefficient : "+currentMatiereEtudiant.notesCC[i].coefficient+"</p><div class=\"noteEtudiant\"><div><p class=\"withNote\">"+currentMatiereEtudiant.notesCC[i].note+"/"+currentMatiereEtudiant.notesCC[i].noteSur+"</p></div></div></li>");
		}
	}

	$("#editeNoteChampsList li.notecc").bind("taphold", function() {
		var ntab = $(this).attr('ntab');
		if (confirm("Etes vous sûr de vouloir supprimer la note \""+currentMatiereEtudiant.notesCC[ntab].nom+"\" ?") == true) {
			currentMatiereEtudiant.notesCC.splice(ntab,1);
		}
		saveRCCs();
	});

	$("#editeNoteChampsList").listview("refresh");
}

	// -------------------------------------------

	$("#backButtonAddNoteCCEtudiant").click(function(event) {
		$.mobile.changePage("#editeNoteMatiereEtudiant", { transition: "slideup", reverse: true });
	});

	$("#saveNoteCC").click(function() {
		var nom = $('#addNoteCCEtudiant #nameNoteCC').val();
		var noteDS = $('#addNoteCCEtudiant #noteCC').val();
		var noteSurDS = $('#addNoteCCEtudiant #noteSurCC').val();
		var coeffCC = $('#addNoteCCEtudiant #coeffCC').val();
		var noteMetier = new NoteCC(nom, noteDS, noteSurDS, coeffCC);
		currentMatiereEtudiant.addNoteCC(noteMetier);

		$.mobile.changePage("#editeNoteMatiereEtudiant", { transition: "slideup", reverse: true });
	});

	$(document).on("pagebeforeshow","#addNoteCCEtudiant", function() {

	});

	/* Objets métiers */

	function EDAUMDiplome(jsonDatasDiplome){
		this.nomDiplome = jsonDatasDiplome.nomDiplome;
		this.idDiplome = jsonDatasDiplome.idDiplome;
		this.annees = new Array();
		var annee = new Annee(jsonDatasDiplome);
		annee.villeEtablissement = jsonDatasDiplome.etablissement.ville;
		annee.nomEtablissement = jsonDatasDiplome.etablissement.nom;
		this.annees.push(annee);	
	}

	function Diplome(jsonDatasDiplome){
		this.nomDiplome = jsonDatasDiplome.nomDiplome;
		this.idDiplome = jsonDatasDiplome.idDiplome;
		this.annees = new Array();

		for (var i = 0; i < jsonDatasDiplome.annees.length; i++){
			this.annees.push(new Annee(jsonDatasDiplome.annees[i]));	
		}
	}

// ----------------------------------------------------------
// ---------------------- Classe Annee ----------------------
// ----------------------------------------------------------
function Annee(jsonDatasAnnee){
	this.nom = jsonDatasAnnee.nom;
	this.nomEtablissement = jsonDatasAnnee.nomEtablissement;
	this.villeEtablissement = jsonDatasAnnee.villeEtablissement;
	this.isLastYear = jsonDatasAnnee.isLastYear;
	this.idAnnee = jsonDatasAnnee.idAnnee;
	this.decoupage = jsonDatasAnnee.decoupage;

	if (jsonDatasAnnee.decoupage == "SEMESTRE"){
		if (jsonDatasAnnee.moyenneS1 != null){this.moyenneS1 = jsonDatasAnnee.moyenneS1;}
		else {this.moyenneS1 = -1;}	

		if (jsonDatasAnnee.creditS1 != null){this.creditS1 = jsonDatasAnnee.creditS1;}
		else {this.creditS1 = -1;}	

		if (jsonDatasAnnee.statusS1 != null){this.statusS1 = jsonDatasAnnee.statusS1;}
		else {this.statusS1 = "Défaillant";}

		if (jsonDatasAnnee.moyenneS2 != null){this.moyenneS2 = jsonDatasAnnee.moyenneS2;}
		else {this.moyenneS2 = -1;}	

		if (jsonDatasAnnee.creditS2 != null){this.creditS2 = jsonDatasAnnee.creditS2;}
		else {this.creditS2 = -1;}	

		if (jsonDatasAnnee.statusS2 != null){this.statusS2 = jsonDatasAnnee.statusS2;}
		else {this.statusS2 = "Défaillant";}
	}
	else if (jsonDatasAnnee.decoupage == "TRIMESTRE"){
		if (jsonDatasAnnee.moyenneT1 != null){this.moyenneT1 = jsonDatasAnnee.moyenneT1;}
		else {this.moyenneS1 = -1;}	

		if (jsonDatasAnnee.creditT1 != null){this.creditT1 = jsonDatasAnnee.creditT1;}
		else {this.creditS1 = -1;}

		if (jsonDatasAnnee.statusT1 != null){this.statusT1 = jsonDatasAnnee.statusT1;}
		else {this.statusT1 = "Défaillant";}

		if (jsonDatasAnnee.moyenneT2 != null){this.moyenneT2 = jsonDatasAnnee.moyenneT2;}
		else {this.moyenneS2 = -1;}	

		if (jsonDatasAnnee.creditT2 != null){this.creditT2 = jsonDatasAnnee.creditT2;}
		else {this.creditT2 = -1;}

		if (jsonDatasAnnee.statusT2 != null){this.statusT2 = jsonDatasAnnee.statusT2;}
		else {this.statusT2 = "Défaillant";}

		if (jsonDatasAnnee.moyenneT3 != null){this.moyenneT3 = jsonDatasAnnee.moyenneT3;}
		else {this.moyenneS3 = -1;}	

		if (jsonDatasAnnee.creditT3 != null){this.creditT3 = jsonDatasAnnee.creditT3;}
		else {this.creditT3 = -1;}	

		if (jsonDatasAnnee.statusT3 != null){this.statusT3 = jsonDatasAnnee.statusT3;}
		else {this.statusT3 = "Défaillant";}
	}

	if (jsonDatasAnnee.moyenne != null) {
		this.moyenne = jsonDatasAnnee.moyenne;
	}
	else {
		this.moyenne = -1;
	}

	if (jsonDatasAnnee.isValid != null) {
		this.isValid = jsonDatasAnnee.isValid;
	}
	else {
		this.isValid = false;
	}

	if (jsonDatasAnnee.isComplete != null) {
		this.isComplete = jsonDatasAnnee.isComplete;
	}
	else {
		this.isComplete = false;
	}

	this.ues = new Array();
	for (var i = 0; i < jsonDatasAnnee.ues.length; i++){
		var ue = new UE(jsonDatasAnnee.ues[i], this);
		this.ues.push(ue);
	}
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
	this.isValid = this.checkValid();
	this.isComplete = this.checkComplete();
}

Annee.prototype.getResultat = function(){
	if (this.moyenne >= 0 && this.isComplete) {
		if (this.moyenne >= 10) {
			return "Admis";
		}
		else if (this.moyenne < 10 && this.isValid){
			return "Ajourné";
		}
		else if (this.moyenne < 10 && !this.isValid) {
			return "Défaillant";
		}
	}
	return "Défaillant";
}

Annee.prototype.checkValid = function(){
	for (var i = 0; i < this.ues.length; i++) {
		if (!this.ues[i].isValid && this.ues[i].hasNotes()) {
			return false;
		}
	}

	return this.moyenne >= 10;
}

Annee.prototype.checkComplete = function(){
	for (var i = 0; i < this.ues.length; i++) {
		if (!this.ues[i].isComplete) {
			return false;
		}
	}
	return true;
}

Annee.prototype.hasNotes = function(){
	for (var i = 0; i < this.ues.length; i++) {
		if (this.ues[i].hasNotes()) {
			return true;
		}
	}
	return false;
}

Annee.prototype.getUEsByDecoupage = function (decoupage) {
	var ues = new Array();
	for (var i = 0; i < this.ues.length; i++) {
		if (decoupage == this.ues[i].yearType){
			ues.push(this.ues[i]);
		}
	}

	ues.sort(function(a, b){
		var keyA = new Date(a.nom),
		keyB = new Date(b.nom);
		if(keyA < keyB) return -1;
		if(keyA > keyB) return 1;
		return 0;
	});

	return ues;
}

Annee.prototype.getColor = function(){
	if (!this.hasNotes()) {
		return "background-color: rgb(255,94,58) !important;";
	}
	else if (this.moyenne < 10 || !this.isValid) {
		return "background-color: rgb(251,71,70) !important;";
	}
	else {
		return "background-color: rgb(67,213,81) !important;";
	}
}

Annee.prototype.saveDeccoupageMoyenne = function(decoupage){
	if (decoupage != "NULL"){
		var totalCoeff = 0;
		var noteCoefficiente = 0;

		ues = currentAnneeEtudiant.getUEsByDecoupage(decoupage);
		var isComplete = true;
		for (var i = 0; i < ues.length; i++) {
			ue = ues[i];
			if (ue.moyenne > -1.0 /*&& ue.isComplete*/) {
				totalCoeff += ue.coefficientUE;
				noteCoefficiente += ue.moyenne*ue.coefficientUE;
			}
			else {
				isComplete = false;
			}
		}
		if (totalCoeff > 0) {
			var moyenne = noteCoefficiente/totalCoeff;
		}
		else {
			var moyenne = -1.0;
		}

		// isValid
		var isValid = true;
		for (var i = 0; i < this.ues.length; i++) {
			if (!this.ues[i].isValid && this.ues[i].hasNotes()) {
				isValid = false;
			}
		}
		isValid = this.moyenne >= 10;

		// Status
		var status;
		if (moyenne >= 0 && isComplete) {
			if (this.moyenne >= 10) {
				status = "Admis";
			}
			else if (moyenne < 10 && isValid && isComplete){
				status = "Ajourné";
			}
			else if (moyenne < 10 && (!isValid || !isComplete) ) {
				status = "Défaillant";
			}
		} 
		else {
			status = "Défaillant";
		}

		if (decoupage == "SEM1"){
			currentAnneeEtudiant.moyenneS1 = moyenne.toFixed(3);
			currentAnneeEtudiant.statusS1 = status;
			currentAnneeEtudiant.isValidS1 = isValid;
			if(isComplete){currentAnneeEtudiant.creditS1 = totalCoeff;}
			else{currentAnneeEtudiant.creditS1 = -1.0;}
		}
		else if (decoupage == "SEM2"){
			currentAnneeEtudiant.moyenneS2 = moyenne.toFixed(3);
			currentAnneeEtudiant.statusS2 = status;
			currentAnneeEtudiant.isValidS2 = isValid;
			if(isComplete){currentAnneeEtudiant.creditS2 = totalCoeff;}
			else{currentAnneeEtudiant.creditS2 = -1.0;}
		}
		else if (decoupage == "TRI1"){
			currentAnneeEtudiant.moyenneT1 = moyenne.toFixed(3);
			currentAnneeEtudiant.statusT1 = status;
			currentAnneeEtudiant.isValidT1 = isValid;
			if(isComplete){currentAnneeEtudiant.creditT1 = totalCoeff;}
			else{currentAnneeEtudiant.creditT1 = -1.0;}
		}
		else if (decoupage == "TRI2"){
			currentAnneeEtudiant.moyenneT2 = moyenne.toFixed(3);
			currentAnneeEtudiant.statusT2 = status;
			currentAnneeEtudiant.isValidT2 = isValid;
			if(isComplete){currentAnneeEtudiant.creditT2 = totalCoeff;}
			else{currentAnneeEtudiant.creditT2 = -1.0;}
		}
		else if (decoupage == "TRI3"){
			currentAnneeEtudiant.moyenneT3 = moyenne.toFixed(3);
			currentAnneeEtudiant.statusT3 = status;
			currentAnneeEtudiant.isValidT3 = isValid;
			if(isComplete){currentAnneeEtudiant.creditT3 = totalCoeff;}
			else{currentAnneeEtudiant.creditT3 = -1.0;}
		}
	}
}

// ----------------------------------------------------------
// ----------------------- Classe UE ------------------------
// ----------------------------------------------------------
function UE(jsonDatasUE, annee){
	this.annee = annee;
	this.nom = jsonDatasUE.nom;
	this.idUE = jsonDatasUE.idUE;

	if (jsonDatasUE.moyenne != null) {
		this.moyenne = jsonDatasUE.moyenne;
	}
	else {
		this.moyenne = -1;
	}
	
	if (jsonDatasUE.coefficientUE != null) {
		this.coefficientUE = jsonDatasUE.coefficientUE;
	}
	else {
		this.coefficientUE = 0;
	}

	this.nbOptMini = jsonDatasUE.nbOptMini;
	this.noteMini = jsonDatasUE.noteMini;
	this.yearType = jsonDatasUE.yearType;

	if (jsonDatasUE.isValid != null) {
		this.isValid = jsonDatasUE.isValid;
	}
	else {
		this.isValid = false;
	}

	if (jsonDatasUE.isComplete != null) {
		this.isComplete = jsonDatasUE.isComplete;
	}
	else {
		this.isComplete = false;
	}

	this.matieres = new Array();
	for (var i = 0; i < jsonDatasUE.matieres.length; i++){
		var matiere = new Matiere(jsonDatasUE.matieres[i], this);
		this.matieres.push(matiere);
	}
}

UE.prototype.actualiserMoyenne = function(){
	var totalCoeff = 0;
	var noteCoefficiente = 0;
	var tempNbOptMini = this.nbOptMini;

	this.isComplete = true
	var array = this.matieres;
	array.sort(function(a, b){
		var keyA = new Date(a.moyenne),
		keyB = new Date(b.moyenne);
		if(keyA < keyB) return -1;
		if(keyA > keyB) return 1;
		return 0;
	});

	for (var i = 0; i < array.length; i++) {
		if(array[i].isOption == true){
			tempNbOptMini--;
		}
		if (array[i].moyenne > -1.0 && tempNbOptMini >= 0){
			totalCoeff += array[i].coefficient;
			noteCoefficiente += array[i].moyenne*array[i].coefficient;
			continue;
		}
		else if (array[i].moyenne == -1.0 && tempNbOptMini >= 0) {
			this.isComplete = false
		}
	}

	if (totalCoeff == 0) {
		this.moyenne = -1.0;
		this.coefficientUE = -1.0;
	}
	else {
		this.coefficientUE = totalCoeff;
		this.moyenne = noteCoefficiente/totalCoeff;
	}
	this.annee.saveDeccoupageMoyenne(this.yearType);
	this.annee.actualiserMoyenne();
	this.isValid = this.checkValid()
}

UE.prototype.hasNotes = function(){    
	for (var i = 0; i < this.matieres.length; i++){
		if (this.matieres[i].hasNotes()) {
			return true;
		}
	}
	return false;
}

UE.prototype.checkValid = function(){
	for (var i = 0; i < this.matieres.length; i++){        
		if (!this.matieres[i].isValid && this.matieres[i].hasNotes()){
			return false;
		}
	}

	return this.moyenne >= this.noteMini;
}

UE.prototype.getCredits = function(){
	if (this.moyenne >= 10 && this.isValid && this.isComplete) {
		return this.coefficientUE;
	}
	return "";
}

UE.prototype.getResultat = function(){
	if (this.moyenne >= 0 /*&& this.checkComplete()*/) {
		if (this.moyenne >= 10 && this.isComplete) {
			return "Admis";
		}
		else if (this.moyenne < 10 && this.isValid){
			return "Ajourné";
		}
		else if (this.moyenne < 10 && !this.isValid) {
			return "Défaillant";
		}
	}
	return "Défaillant";
}

// ----------------------------------------------------------
// --------------------- Classe Matiere ---------------------
// ----------------------------------------------------------
function Matiere(jsonDatasMatiere , ue){
	this.ue = ue;
	this.nom = jsonDatasMatiere.nom;
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
	
	if (jsonDatasMatiere.isValid != null){
		this.isValid = jsonDatasMatiere.isValid;
	} 
	else {
		this.isValid = false;
	}

	if (jsonDatasMatiere.notePS != null) {
		this.notePS = jsonDatasMatiere.notePS;
	}
	else {
		this.notePS = -1;
	}

	if (jsonDatasMatiere.noteDS != null) {
		this.noteDS = jsonDatasMatiere.noteDS;
	}
	else {
		this.noteDS = -1;
	}

	if (jsonDatasMatiere.coefficientSession != null) {
		this.coefficientSession = jsonDatasMatiere.coefficientSession;
	}
	else {
		this.coefficientSession = -1;
	}

	this.notesCC = new Array();
	if (jsonDatasMatiere.notesCC != null){
		for (var i = 0; i < jsonDatasMatiere.notesCC.length; i++){
			var note = new NoteCC(jsonDatasMatiere.notesCC[i].nom, jsonDatasMatiere.notesCC[i].note, jsonDatasMatiere.notesCC[i].noteSur, jsonDatasMatiere.notesCC[i].coefficient, jsonDatasMatiere.notesCC[i].idNote);
			this.notesCC.push(note);
		}
	}

}

Matiere.prototype.actualiserMoyenne = function(){
	var noteCC = this.getMoyenneCC();
    // Dans le cas où le rattrapage est réussi, annulation du partiel
    if(this.noteDS > this.notePS) {
    	this.moyenne = this.noteDS;
    }
        //Dans le cas où la note des partiels est supérieur à la noteCC, annulation de la note CC
        else if(this.notePS >= noteCC) {
        	this.moyenne = this.notePS;
        }
        
        else if (this.notePS == -1) {
        	if (noteCC == -1) {
        		this.moyenne = -1;
        	}
        	else {
        		this.moyenne = noteCC;
        	}
        }
        else if(noteCC == -1){
        	this.moyenne = this.notePS;
        }
        else {
        	this.moyenne = this.getCoefficientSession()*this.notePS+this.getCoefficientCC()*this.getMoyenneCC();
        }

        this.isValid = this.checkValid();
        this.ue.actualiserMoyenne();
    }

    Matiere.prototype.getMoyenneCC = function(){
    	var moyenne = 0;
    	var totalCoeff = 0;

    	for(var i = 0; i < this.notesCC.length; i++){
    		totalCoeff += this.notesCC[i].coefficient * this.notesCC[i].noteSur /20;
    		moyenne += this.notesCC[i].note * this.notesCC[i].coefficient * this.notesCC[i].noteSur /20;
    	}

    	if(totalCoeff > 0) {
    		return moyenne/totalCoeff;
    	}
    	else {
    		return -1;
    	}
    }

    Matiere.prototype.getCoefficientSession = function(){
    	var array = this.coefficientSession.split("/");
    	switch(array.length){
    		case 1 :
    		return this.coefficientSession;
    		case 2 :
    		return array[0]/array[1];
    		default :
    		return -1;
    	}
    }

    Matiere.prototype.getCoefficientCC = function(){
    	if (this.getCoefficientSession() < 1) {
    		return 1-this.getCoefficientSession();
    	}
    	else {
    		return 1;
    	}
    }

    Matiere.prototype.getResultat = function(){
    	if (this.moyenne >= 0){
    		if (this.moyenne >= 10){
    			return "Admis";
    		}
    		else if (this.moyenne < 10 && this.isValid){
    			return "Ajourné";
    		}
    		else if (this.moyenne < 10 && !this.isValid) {
    			return "Défaillant";
    		}
    	}
    	return "Défaillant";
    }

    Matiere.prototype.getStatus = function(){
    	if (this.moyenne >= 0) {
    		if (this.moyenne >= 10) {
    			return " | Admis";
    		}
    		else if (this.moyenne < 10 && this.isValid){
    			return " | Ajourné";
    		}
    		else if (this.moyenne < 10 && !this.isValid) {
    			return " | Défaillant";
    		}
    	}
    	return "";
    }

    Matiere.prototype.hasNotes = function(){
    	return this.moyenne != -1.0;
    }

    Matiere.prototype.addNoteCC = function(note){
    	this.notesCC.push(note);
    }

    Matiere.prototype.checkValid = function(){
    	return this.moyenne >= this.noteMini;
    }

    function NoteCC(nom, note, noteSur, coefficient){
    	this.idNote = currentMatiereEtudiant.notesCC.length;
    	this.nom = nom;
    	this.note = note;
    	this.noteSur = noteSur;
    	this.coefficient = coefficient;
    }

    function NoteCC(nom, note, noteSur, coefficient, idNote){
    	this.idNote = idNote;
    	this.nom = nom;
    	this.note = note;
    	this.noteSur = noteSur;
    	this.coefficient = coefficient;
    }

    function addAnnee(jsonDatasAnnee){
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
            return;
        }
        cache.push(value);
    }
    return value;
}));
    	cache = null;
    }

    function loadRCCs(){
    	if (localStorage.getItem("rccEtudiant") == null){
    		localStorage.setItem("rccEtudiant", JSON.stringify(new Array()));
    	}

    	rccEtudiant = new Array();
    	for (var i = 0; i < JSON.parse(localStorage.getItem("rccEtudiant")).length; i++){
    		var d = new Diplome(JSON.parse(localStorage.getItem("rccEtudiant"))[i]);
    		rccEtudiant.push(d);
    	}
    }

    function getPdf(){
    	var doc = new jsPDF('p','pt','letter');
    	var decoupages = new Array();
    	var decoupageB = new Array();
    	var moyennesDecoupage = new Array();
    	var credits = new Array();
    	if (currentAnneeEtudiant.decoupage == "NULL") {
    		decoupages = ["NULL"]
    	}
    	else if (currentAnneeEtudiant.decoupage == "SEMESTRE") {
    		decoupages = ["SEM1", "SEM2"];
    		decoupageB = ["Semestre 1", "Semestre 2"];
    		moyennesDecoupage = [currentAnneeEtudiant.moyenneS1, currentAnneeEtudiant.moyenneS2];
    		resultatsDecoupage = [currentAnneeEtudiant.statusS1, currentAnneeEtudiant.statusS2];
    		credits = [currentAnneeEtudiant.creditS1, currentAnneeEtudiant.creditS2];
    	}
    	else if (currentAnneeEtudiant.decoupage == "TRIMESTRE") {
    		decoupages = ["TRI1", "TRI2", "TRI3"];
    		decoupageB = ["Trimestre 1", "Trimestre 2", "Trimestre 3"];
    		moyennesDecoupage = [currentAnneeEtudiant.moyenneT1, currentAnneeEtudiant.moyenneT2, currentAnneeEtudiant.moyenneT3];
    		credits = [currentAnneeEtudiant.creditT1, currentAnneeEtudiant.creditT2, currentAnneeEtudiant.creditT3];
    		resultatsDecoupage = [currentAnneeEtudiant.statusT1, currentAnneeEtudiant.statusT2, currentAnneeEtudiant.statusT3];
    	}

    	doc.setFontSize(25);
    	doc.setFont("helvetica", "bold");
    	doc.text("Relevé de notes et résultats", 612/2, 60, 0, 0, "center");    

    	doc.setFontSize(11);
    	doc.setFont("helvetica", "normal");
    	doc.text(currentAnneeEtudiant.nomEtablissement+" ("+currentAnneeEtudiant.villeEtablissement+")", 10, 20, 0, 0);    

    	var position = 100;
    	doc.text("Note/Barème", 412, position, 0, 0, "right");  
    	doc.text("Résultat", 512, position, 0, 0, "right");  
    	doc.text("Crédits", 572, position, 0, 0, "right");  
    	position+= 17;

    	for (var k = 0; k < decoupages.length; k++){
    		if (k > 0){
    			position+=10;
    		}
    		if (decoupages.length > 1){
    			doc.setFont("helvetica", "bold");
    			doc.text(decoupageB[k], 25, position, 0, 0);

    			if (moyennesDecoupage[k] == -1){
    				doc.text("Pas de note", 412, position, 0, 0, "right");  
    			}
    			else {
    				doc.text(moyennesDecoupage[k]+" / 20", 412, position, 0, 0, "right");  
    			}
    			doc.text(resultatsDecoupage[k], 512, position, 0, 0, "right");  

    			if (credits[k] != -1){
    				doc.text(credits[k]+"", 572, position, 0, 0, "right");  
    			}

    			position+=17;
    			if (position > 770){
    				doc.addPage();
    				position = 40;
    			}
    		}

    		var ues = currentAnneeEtudiant.getUEsByDecoupage(decoupages[k]);

    		for (var i = 0; i <ues.length; i++){
    			doc.setFont("helvetica", "bold");
    			doc.text(ues[i].nom, 25, position, 0, 0); 

    			if (ues[i].moyenne > -1.0){
    				doc.text(ues[i].moyenne.toFixed(3)+" / 20", 412, position, 0, 0, "right");  
    			}
    			else {
    				doc.text("Pas de note", 412, position, 0, 0, "right");  
    			}
    			doc.text(ues[i].getResultat(), 512, position, 0, 0, "right");  
    			doc.text(ues[i].getCredits()+"", 572, position, 0, 0, "right");  

    			for (var j = 0; j < ues[i].matieres.length; j++){
    				position+= 14
    				if (position > 770){
    					doc.addPage();
    					position = 40;
    				}
    				doc.setFont("helvetica", "normal");
    				doc.text(ues[i].matieres[j].nom, 30, position, 0, 0);  

    				if (ues[i].matieres[j].moyenne > -1.0 && ues[i].moyenne > -1.0){
    					doc.text(ues[i].matieres[j].moyenne.toFixed(3)+" / 20", 412, position, 0, 0, "right");  
    				}
    				else if (ues[i].matieres[j].moyenne == -1.0 && ues[i].moyenne > -1.0) {
    					doc.text("Pas de note", 412, position, 0, 0, "right");  
    				}
    				doc.text(ues[i].matieres[j].getResultat(), 512, position, 0, 0, "right");  
    			}
    			position+= 17;
    			if (position > 770){
    				doc.addPage();
    				position = 40;
    			}
    		}
    	}

    	doc.setFont("helvetica", "bold");
    	doc.text("Moyenne Générale", 25, position, 0, 0); 		
    	doc.text(currentAnneeEtudiant.getResultat(), 512, position, 0, 0, "right");  
    	if (currentAnneeEtudiant.moyenne > -1.0){
    		doc.text(currentAnneeEtudiant.moyenne.toFixed(3)+" / 20", 412, position, 0, 0, "right");  
    	}
    	else if (currentAnneeEtudiant.moyenne == -1.0) {
    		doc.text("Pas de note", 412, position, 0, 0, "right");  
    	}
    	doc.save(currentAnneeEtudiant.nom+".pdf");
    }







});