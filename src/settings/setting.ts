function isEmpty(obj: Object): boolean {
    return Object.keys(obj).length === 0;
}

function forceMaxLength(this: HTMLElement): void {
    let input = this as HTMLInputElement;
    if (parseInt(input.value) > 100) input.value = '100';
    else if (input.value.length > input.maxLength) input.value = input.value.slice(0, input.maxLength);
}

/**
 * Enregistre la note voulus globale (pour tout les cours) dans le storage chrome
 * synced
 */
function syncSettings(): void {
    let inputField: HTMLInputElement = document.getElementById('wanted') as HTMLInputElement;
    let input: number = parseInt(inputField.value);

    if (input <= 100 && 0 <= input) {
        chrome.storage.sync.set({ 'global': input });
        console.log(`set global variable to ${input}`);
        resetStyle();
    }

}

/**
 * Load la note globale voulus a partir du storage chrome synced
 */
async function loadSettings(): Promise<void> {

    // get settings from chrome storage sync
    let storage: Promise<{ [key: string]: any; }> = chrome.storage.sync.get('global');
    let param = await storage;

    let inputField: HTMLInputElement = document.getElementById('wanted') as HTMLInputElement;

    if (!isEmpty(param) && inputField !== undefined) {
        inputField.value = `${param.global}`;
    }
    else {
        inputField.value = "60";
    }
}


function changeClass() {
    let saveButton: HTMLElement | null = document.getElementById('save');
    let inputField: HTMLElement | null = document.getElementById('wanted');

    saveButton?.classList.toggle("changes");

    inputField?.removeEventListener("keydown", changeClass);
}

function generateBaseEvent() {
    saveButton?.addEventListener('click', syncSettings);
    inputField?.addEventListener('input', forceMaxLength);
    inputField?.addEventListener('keydown', changeClass);
}

function resetStyle() {
    saveButton?.classList.remove("changes");
    inputField?.addEventListener('keydown', changeClass);
}

let saveButton: HTMLElement | null = document.getElementById('save');
let inputField: HTMLElement | null = document.getElementById('wanted');

// MAIN //

generateBaseEvent();

loadSettings();