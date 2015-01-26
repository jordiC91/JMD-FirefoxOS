window.addEventListener('DOMContentLoaded', function() {

    $.get("http://5.39.94.146:8080/JMD/webresources/etablissement/getAll", function(datas) {
        for (var i = 0; i < datas.length; i++) {
          $("#listEtab").append("<li>" + datas[i].nom + "<br>" + "<p>" + datas[i].ville + "</p>" + "</li>");
          $("#listEtab").listview("refresh");
        }
    });
});
