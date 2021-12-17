
// check if selected is on the evaluations
let chosen = $("a.selected").text();

if (chosen == "Évaluations") main();

// TODO: encapsulate function main() in class
function main() {
    let output = "";

    // selecte la note de l'etudiant actuellement
    let note = $("#divPrincipal table.Content td.Content table:last b");
    let noteText = note.text(); // prend la valeur en texte

    if (noteText.includes("Note finale") || noteText.includes("/ 100,00")) {
        // si les notes sont finales

        const congrats = ["Esti, tu l'as eu", "Damnnnnnnn, gg", "Congrats *clap clap*", "I wish que j'avais des notes comme sa lol"];
        const fails = ["Aaaaah rip. T'étais pas trop motiver à ce que je vois...", "... rien à dire pour vrai", "J'ai déjà été là", "Next time sa ira mieux", "Depress pas, y'en à toujours des plus stupides"];

        const re = /(\d+)/; // vas chercher le nombre de points actuelle, le nombre de points amasser total et la moyenne
        let match = noteText.match(re); // match le regex

        // prend le nombre de points finale et prend un message random des array "congrats" ou "fails"
        let pointFinal = parseInt(match[1]);

        output = pointFinal >= 60 ? congrats[Math.floor(Math.random() * congrats.length)] : fails[Math.floor(Math.random() * fails.length)];

    } else if (noteText.includes("0,00 \/ 0,00")) {
        // si les notes sont a 0
        output = "L'enfer vient juste de commencer à ce que je vois... Bonne chance";

    } else {
        // si les notes ne sont pas encore finale
        const re = /(\d+\,\d+) \/ (\d+\,\d+).\((.+)\)/; // vas chercher le nombre de points actuelle, le nombre de points amasser total et la moyenne
        let match = noteText.match(re); // match le regex

        let pointAccumuler = parseFloat(match[1]); // prend le groupe 1 du regex
        let pointAccumulerTotal = parseFloat(match[2]); // prend le groupe 2 du regex

        let pointViser = 60; // nombre de points que l'etudiant souhaite avoir dans ce cours
        let pointRestant = 100 - pointAccumulerTotal; // points que l'etudiant peut toujours amasser
        let pointNecessaire = pointViser - pointAccumuler; // le nombres de points que l'etudiant doit avoir afin d'obtenir le nombre de points viser
        let pourcentageNecessaire = pointNecessaire * 100 / pointRestant // les points necessaire en pourcentages

        // ecrit le nombre de points necessaire en dessous de la note actuelle
        output = `Nombre de points nécessaire ${pointNecessaire} / ${pointRestant} (${pourcentageNecessaire.toFixed(2)}%)`;
    }
    
    // TODO: ajouter condition si la moyenne desirer ne peut pas etre obtenue

    note.append(`<p>${output}</p>`);
}
