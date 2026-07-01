let ecoles = [];
let seances = [];
let animations = [];

async function chargerEcoles() {

    const liste = document.getElementById("ecole");

    const [repEcoles, repSeances, repAnimations] = await Promise.all([
    fetch("/api/ecoles"),
    fetch("/api/seances"),
    fetch("/api/animations")
]);

const donneesEcoles = await repEcoles.json();
const donneesSeances = await repSeances.json();
const donneesAnimations = await repAnimations.json();

ecoles = donneesEcoles.records;
seances = donneesSeances.records;
animations = donneesAnimations.records;

    liste.innerHTML = "";

    ecoles
        .sort((a, b) =>
            a.fields.Ville.localeCompare(b.fields.Ville) ||
            a.fields.Ecole.localeCompare(b.fields.Ecole)
        )
        .forEach(ecole => {

            const option = document.createElement("option");

            option.value = ecole.id;
            option.textContent =
                `${ecole.fields.Ecole} (${ecole.fields.Ville})`;

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

function afficherSeances(ecole) {

    const zone = document.getElementById("seances");

    zone.innerHTML = "";

    const inscriptions = ecole.fields.INSCRIPTIONS || [];

    const liste = seances.filter(seance =>
        inscriptions.includes(seance.id)
    );

    if (liste.length === 0) {
        zone.textContent = "Aucune séance";
        return;
    }

    liste.forEach(seance => {

        const div = document.createElement("div");

        const animation = animations.find(a => a.id === seance.fields.Animation);

        div.className = "seance";

div.innerHTML = `
    <h3>${animation ? animation.fields.Titre : seance.fields.ID_seance}</h3>

   <div class="badge">
    ${animation.fields.Domaine ?? ""}
   </div>

    <div class="ligne">

        <div class="case">
            <span>📅 Date</span>
            <strong>${seance.fields.Date || "À définir"}</strong>
        </div>

        <div class="case">
            <span>🕒 Horaire</span>
            <strong>${seance.fields.Horaire || "À définir"}</strong>
        </div>

        <div class="case">
            <span>📍 Lieu</span>
            <strong>${seance.fields.Lieu || "-"}</strong>
        </div>

        <div class="case">
            <span>⏱ Durée</span>
            <strong>${seance.fields.Duree || "-"}</strong>
        </div>

    </div>
`;
        zone.appendChild(div);

    });

}
console.log("APP V2");
document.addEventListener("DOMContentLoaded", chargerEcoles);