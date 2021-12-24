
function getNote(): JQuery<HTMLElement> {
    let noteSelector: string = "#divPrincipal table.Content td.Content table:last b";
    let noteNode: JQuery<HTMLElement> = $(noteSelector);

    return noteNode;
}

class Cours {

    public state: CoursAffichableState | undefined;

    readonly pointsActuelle: number;
    readonly pointsAccumuler: number;
    readonly pointsVoulus: number;
    readonly pointsMaximal: number;

    constructor(pointActuelle: number, pointsAccumuler: number, pointsVoulus: number) {
        this.pointsActuelle = pointActuelle;
        this.pointsAccumuler = pointsAccumuler;
        this.pointsVoulus = pointsVoulus;
        this.pointsMaximal = 100;

    }

    public afficher(): void {
        this.state?.afficher();
    }

    public changerState(state: CoursAffichableState) {
        this.state = state;
        this.state.setCours(this);
    }

}

/**
 * Classe abstraite qui definie le state
 * de cours affichable
 */
abstract class CoursAffichableState {
    protected cours: Cours | undefined;

    public setCours(cours: Cours) {
        this.cours = cours;
    }

    /**
     * Interacts with the DOM of the webpage to show the average required
     */
    abstract afficher(): void

}

class CoursAffichable extends CoursAffichableState {

    afficher(): void {
        let noteNode: JQuery<HTMLElement> = getNote();
        let newNode: HTMLElement = document.createElement('p');

        newNode.innerText = this.generateText();

        noteNode.append(newNode);
    }

    private generateText(): string {
        if (this.cours === undefined) { return ""; }

        let texte: string;

        let pointsPossible: number = this.cours.pointsMaximal - this.cours.pointsAccumuler;
        let pointsNecessaire: number = this.cours.pointsVoulus - this.cours.pointsActuelle;


        if (pointsNecessaire < 0) { texte = "Vous avez déjà atteint votre objectif"; }
        else if (pointsNecessaire > pointsPossible) { texte = "Il est impossible d'atteindre votre objectif"; }

        else {
            let pourcentageNecessaire: number = pointsNecessaire * 100 / pointsPossible;
            texte = `Il vous manque ${pointsNecessaire}/${pointsPossible} (${pourcentageNecessaire.toFixed(2)}%)`;
        }

        return texte;
    }

}

class CoursNonAffichable extends CoursAffichableState {
    afficher(): void { return; }
}

function isEmpty(obj: Object) {
    return Object.keys(obj).length === 0;
}

async function CreateCours(): Promise<Cours> {

    let noteText: string = getNote().text();
    let cours: Cours;
    let wanted: number;

    // grab la note actuelle de l'etudiant
    let re: RegExp = /(\d+\,\d+) \/ (\d+\,\d+)/;

    let note: RegExpMatchArray | null = noteText.match(re);

    let storage: Promise<any> = chrome.storage.sync.get('global');
    let param = await storage;


    if (isEmpty(param)) { wanted = 60; }
    else { wanted = param.global; }

    if (note !== null) {
        cours = new Cours(parseFloat(note[1]), parseFloat(note[2]), wanted);
    }
    else {
        cours = new Cours(0, 0, 0);
    }


    if (noteText.includes("0,00 / 0,00") || noteText.includes("100 / 100") || noteText.includes("Note finale")) {
        cours.changerState(new CoursNonAffichable());
    }
    else {
        cours.changerState(new CoursAffichable());
    }

    return cours;
}

let chosen: string = $("a.selected").text();

if (chosen == "Évaluations") {
    CreateCours()
        .then(
            (cours) => {
                cours.afficher();
            }
        );
}