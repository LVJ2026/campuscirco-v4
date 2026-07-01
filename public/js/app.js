let ecoles = [];
let seances = [];

async function chargerEcoles() {

    const liste = document.getElementById("ecole");

    const [repEcoles, repSeances] = await Promise.all([
        fetch("/api/ecoles"),
        fetch("/api/seances")
    ]);

    const donneesEcoles = await repEcoles.json();
    const donneesSeances = await repSeances.json();

    ecoles = donneesEcoles.records;
    seances = donneesSeances.records;

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

        div.className = "seance";

div.innerHTML = `
    <h3>${seance.fields.ID_seance}</h3>

    <p><strong>Domaine :</strong> ${seance.fields.Domaine ?? "-"}</p>

    <p>📅 <strong>Date :</strong> ${seance.fields.Date || "-"}</p>

    <p>🕒 <strong>Horaire :</strong> ${seance.fields.Horaire || "-"}</p>

    <p>📍 <strong>Lieu :</strong> ${seance.fields.Lieu || "-"}</p>

    <p>⏱ <strong>Durée :</strong> ${seance.fields.Duree || "-"}</p>
`;

        zone.appendChild(div);

    });

}

document.addEventListener("DOMContentLoaded", chargerEcoles);