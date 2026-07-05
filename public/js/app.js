let ecoles = [];
let seances = [];
let animations = [];
let inscriptions = [];

async function chargerEcoles() {

    const liste = document.getElementById("ecole");

   const [repEcoles, repSeances, repAnimations, repInscriptions] = await Promise.all([
    fetch("/api/ecoles"),
    fetch("/api/seances"),
    fetch("/api/animations"),
    fetch("/api/inscriptions")
]);

const donneesEcoles = await repEcoles.json();
const donneesSeances = await repSeances.json();
const donneesAnimations = await repAnimations.json();
const donneesInscriptions = await repInscriptions.json();

ecoles = donneesEcoles.records;
seances = donneesSeances.records;
animations = donneesAnimations.records;
inscriptions = donneesInscriptions.records;

   liste.innerHTML = `
    <option value="">
        Choisissez une école ou saisissez son nom ou son RNE
    </option>
`;

    ecoles
        .sort((a, b) =>
            a.fields.Ville.localeCompare(b.fields.Ville) ||
            a.fields.Ecole.localeCompare(b.fields.Ecole)
        )
        .forEach(ecole => {

            const option = document.createElement("option");

            option.value = ecole.id;
           const niveau = ecole.fields.UAI.toLowerCase().includes("maternelle")
           ? "Maternelle"
           : "Élémentaire";

option.textContent =
    `${ecole.fields.Ecole} – ${niveau} (${ecole.fields.Ville})`;
            liste.appendChild(option);

        });

    liste.addEventListener("change", afficherEcole);

    afficherEcole();

    new TomSelect("#ecole",{
    create:false,

    placeholder:"Choisissez une école dans la liste ou saisissez son nom ou son RNE",

    sortField:{
        field:"text",
        direction:"asc"
    }
});

}

function afficherEcole() {

    const id = Number(document.getElementById("ecole").value);

    const ecole = ecoles.find(e => e.id === id);

    if (!ecole) return;

    document.getElementById("uai").textContent = ecole.fields.UAI ?? "";
    document.getElementById("ville").textContent = ecole.fields.Ville ?? "";
    document.getElementById("type").textContent = ecole.fields.Type ?? "";
    document.getElementById("formation").textContent = ecole.fields.Type_de_formation ?? "";
    document.getElementById("nb").textContent = ecole.fields.Nb_enseignants ?? "";

    afficherSeances(ecole);

}



function afficherSeances(ecole) {

    const zone = document.getElementById("seances");

    zone.innerHTML = "";

    
const liste = inscriptions.filter(inscription =>
    inscription.fields.UAI === ecole.id
);



    if (liste.length === 0) {
        zone.textContent = "Aucune séance";
        return;
    }

    liste.forEach(inscription => {

        const div = document.createElement("div");

        div.className = "seance";

        div.innerHTML = `

            <h3>${inscription.fields.Titre_Affiche || inscription.fields.Titre_Animation}</h3>

            <div class="badge">
                ${(inscription.fields.Domaine || "").charAt(0).toUpperCase() +
                (inscription.fields.Domaine || "").slice(1)}
            </div>

${
    inscription.fields.Observations
    ? `
    <div class="observation-badge">
        ${inscription.fields.Observations}
    </div>
    `
    : ""
}


${
    inscription.fields.CPC
    ? `
    <div class="contact">

        <div class="contact-titre">
            Formateur à contacter
        </div>

        <div class="contact-ligne">
            <span>👤 <strong>${inscription.fields.CPC}</strong></span>

            ${
                inscription.fields.Mail
                ? `<a href="mailto:${inscription.fields.Mail}">
                    ✉️ ${inscription.fields.Mail}
                   </a>`
                : ""
            }

        </div>

    </div>
    `
    : ""
}


            <div class="ligne">

                <div class="case">
                    <span>📅 Date</span>
                    <strong>${inscription.fields.Date_Affichage || "À définir"}</strong>

                </div>

                <div class="case">
                    <span>🕒 Horaire</span>
                    <strong>${inscription.fields.Horaire || "À définir"}</strong>
                </div>

                <div class="case">
                    <span>📍 Lieu</span>
                    <strong>${inscription.fields.Lieu || "-"}</strong>
                </div>

                <div class="case">
                    <span>⏱ Durée</span>
                    <strong>${inscription.fields.Duree || "-"}</strong>
                </div>

            </div>



        `;

        zone.appendChild(div);

    });

}


function exporterPDF() {

    const id = Number(document.getElementById("ecole").value);
    const ecole = ecoles.find(e => e.id === id);

    if (!ecole) return;

    const liste = inscriptions.filter(i => i.fields.UAI === ecole.id);

    const groupes = {};

    liste.forEach(i => {

        const titre = i.fields.Titre_Animation || "Sans titre";

        if (!groupes[titre]) groupes[titre] = [];

        groupes[titre].push(i);

    });

    let html = `
<!DOCTYPE html>
<html lang="fr">
<head>

<meta charset="UTF-8">

<title>Campus Circo</title>

<style>

body{
    font-family:Arial,sans-serif;
    margin:25px;
    color:#222;
    font-size:12px;
}

h1{
    margin:0;
    font-size:26px;
    color:#1E4F91;
}

h2{
    margin:2px 0 20px;
    font-size:15px;
    font-weight:400;
}

h3{
    margin:28px 0 10px;
    color:#1E4F91;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-bottom:24px;
}

th,td{
    border:1px solid #555;
    padding:8px;
    vertical-align:top;
}

th{
    background:#EAF2FB;
}

.info{
    margin-bottom:20px;
}

</style>

</head>

<body>

<h1>Campus Circo</h1>

<h2>Plan de formation continue Vandoeuvre</h2>

<div class="info">

<strong>École :</strong> ${ecole.fields.Ecole}<br>
<strong>Ville :</strong> ${ecole.fields.Ville}<br>
<strong>UAI :</strong> ${ecole.fields.UAI}

</div>
`;

Object.keys(groupes).forEach(titre => {

    html += `
        <h3>${titre}</h3>

        <table>
            <thead>

                <tr>
                    <th>Date</th>
                    <th>Horaire</th>
                    <th>Lieu</th>
                    <th>Durée</th>
                    <th>Observation</th>
                </tr>

            </thead>

            <tbody>
    `;

    groupes[titre].forEach(i => {

        html += `
            <tr>

                <td>${i.fields.Date_Affichage || ""}</td>

                <td>${i.fields.Horaire || ""}</td>

                <td>${i.fields.Lieu || ""}</td>

                <td>${i.fields.Duree || ""}</td>

                <td>${i.fields.Observations || ""}</td>

            </tr>
        `;

    });

    html += `
            </tbody>

        </table>
    `;

});

html += `
</body>
</html>
`;

const fenetre = window.open("", "_blank");

fenetre.document.write(html);

fenetre.document.close();

fenetre.focus();

setTimeout(() => {

    fenetre.print();

}, 300);

}



console.log("APP V2");
document.addEventListener("DOMContentLoaded", chargerEcoles);

document.getElementById("btnPDF").addEventListener("click", exporterPDF);

const popup = document.getElementById("popup");
const fermerPopup = document.getElementById("fermerPopup");

fermerPopup.addEventListener("click", () => {

    popup.classList.add("cache");

});
