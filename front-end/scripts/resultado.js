document.getElementById("puntajeFinal").textContent =
  (localStorage.getItem("ultimoPuntaje") || "0") + " / 27";

fetch("http://localhost:4000/partidas")
  .then(function (r) { return r.json(); })
  .then(function (records) {
    var tabla = document.getElementById("tablaRecords");
    tabla.innerHTML = "";
    records.forEach(function (p) {
      tabla.innerHTML += "<tr>" +
        "<td>" + p.nombre + "</td>" +
        "<td>" + p.puntuacion + "</td>" +
        "<td>" + p.fecha_creacion + "</td>" +
        "</tr>";
    });
  });