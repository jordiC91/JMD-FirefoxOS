# JMD-WS

This Github project is a module containing the FirefoxOS application of JMD.

### Presentation of JMD

JMD ('J'ai Mon Diplôme' in French, 'I Have My Diploma' in English) is a university project started in "M1 MIAGE" and finished in "M2 MIAGE" by Jordi CHARPENTIER and Yoann VANHOESERLANDE. 

Its purpose is to provide to all students an application to calculate their average marks and simulate their graduation in real time.

Several other features are also available.
Examples:
- For students: export one year as PDF. 
You can see an example here : http://www.jordi-charpentier.com/jmd/Example_Mail_Modif.png
- For administrators: tracking changes from one year, with a mail for each change.
You can see an example here : http://www.jordi-charpentier.com/jmd/Example_PDF.pdf

### Technologies used on JMD

- Webservices : Java (+ JAX-RS library).
- Database : MySQL.
- iOS application : Swift
- Android application : Java
- FirefoxOS application : jQuery Mobile 

### Content of 'JMD-FirefoxOS'

This project was created with WebIDE (Firefox Developper Edition). You can see below some explanations of the architecture :
- JMD
- --index.html : it's a single page application (SPA) so this file contains all the application.
- --css : contains all CSS of the application.
- --js : contains all javascript sources.
- ----admin : contains all sources for admin part in the application.
- ----jquery : contains the jquery library.
- ----jspdf : contains the jspdf library.
- --img : contains all images of the application : icons, logo, ...
- ----icons : contains all the icons application.

### Screens

http://www.casimages.com/i/150310021444208788.png

http://www.casimages.com/i/150310021444658194.png

http://www.casimages.com/i/150310021444729220.png

### Example

Here an example of 2 methods used in student part to load and save a RCC on the phone using localstorage :

```javascript
function saveRCCs() {
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

function loadRCCs() {
   	if (localStorage.getItem("rccEtudiant") == null){
    	localStorage.setItem("rccEtudiant", JSON.stringify(new Array()));
    }

   	rccEtudiant = new Array();
    
    for (var i = 0; i < JSON.parse(localStorage.getItem("rccEtudiant")).length; i++){
    	var d = new Diplome(JSON.parse(localStorage.getItem("rccEtudiant"))[i]);
    	rccEtudiant.push(d);
    }
};
