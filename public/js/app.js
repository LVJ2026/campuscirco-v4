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

    liste.innerHTML = "";

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

function formaterDate(valeur) {

    if (!valeur) return "À définir";

    if (typeof valeur === "string" && valeur.startsWith("d,")) {

        const timestamp = Number(valeur.substring(2));

        return new Date(timestamp * 1000).toLocaleDateString("fr-FR");

    }

    return valeur;

}


function formaterDate(valeur) {

    console.log("Date reçue :", valeur, typeof valeur);

    if (!valeur) return "À définir";

    if (Array.isArray(valeur)) {

        return new Date(valeur[1] * 1000).toLocaleDateString("fr-FR");

    }

    return String(valeur);

}

function afficherSeances(ecole) {

    const zone = document.getElementById("seances");

    zone.innerHTML = "";

    
const liste = inscriptions
    .filter(inscription => inscription.fields.UAI === ecole.id)
    .sort((a, b) => {

        const da = a.fields.Date
            ? new Date(a.fields.Date)
            : new Date("2100-01-01");

        const db = b.fields.Date
            ? new Date(b.fields.Date)
            : new Date("2100-01-01");

        return da - db;

    });


    if (liste.length === 0) {
        zone.textContent = "Aucune séance";
        return;
    }

    liste.forEach(inscription => {

        const div = document.createElement("div");

        div.className = "seance";

        div.innerHTML = `

            <h3>${inscription.fields.Titre_Animation}</h3>

            <div class="badge">
                ${(inscription.fields.Domaine || "").charAt(0).toUpperCase() +
                (inscription.fields.Domaine || "").slice(1)}
            </div>

            <div class="ligne">

                <div class="case">
                    <span>📅 Date</span>
                   
<strong>${formaterDate(inscription.fields.Date)}</strong>

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

            ${
                inscription.fields.Observations
                ? `
                <div class="observation">
                    <strong>Observation :</strong><br>
                    ${inscription.fields.Observations}
                </div>
                `
                : ""
            }

        `;

        zone.appendChild(div);

    });

}
console.log("APP V2");
document.addEventListener("DOMContentLoaded", chargerEcoles);

document.addEventListener("click", (event) => {

    if (event.target.id === "btnPDF") {

        window.print();

    }

});