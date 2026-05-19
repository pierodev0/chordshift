const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];
const flats = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
];

let currentStep = 0;

const inputArea = document.getElementById("inputArea");
const outputDiv = document.getElementById("output");
const keyDisplay = document.getElementById("keyDisplay");

// EXPRESIÓN REGULAR AVANZADA
// Detecta: Notas (A-G), Accidentales (#, b),
// Extensiones (maj7, m7b5, add9, sus4, dim, etc.)
// Y acordes con bajo / slash (D/F#)
const chordRegex =
    /\b([A-G][b#]?(?:maj|min|m|M|aug|dim|sus|add|alt|b5|#5|[0-9]|\+|\-|\(|\))*)(?:\/([A-G][b#]?))?\b/g;

inputArea.addEventListener("input", update);

function changeTranspose(delta) {
    currentStep += delta;
    keyDisplay.innerText =
        currentStep === 0
            ? "Tono Original"
            : (currentStep > 0 ? "+" : "") +
              currentStep +
              " Semitonos";
    update();
}

function update() {
    const lines = inputArea.value.split("\n");
    let usedChords = []; // Usamos un Array para mantener el orden de inserción

    const processedLines = lines.map((line) => {
        if (isChordLine(line)) {
            return line.replace(chordRegex, (match, root, bass) => {
                const transRoot = transposeNote(root, currentStep);
                const transBass = bass
                    ? "/" + transposeNote(bass, currentStep)
                    : "";
                const fullChord = transRoot + transBass;

                // Si el acorde no ha sido registrado aún, lo añadimos al final de la lista
                if (!usedChords.includes(fullChord)) {
                    usedChords.push(fullChord);
                }

                return `<strong>${fullChord}</strong>`;
            });
        }
        return escapeHTML(line);
    });

    // Generar Leyenda en orden de aparición
    let finalHtml = "";
    if (usedChords.length > 0) {
        // Ya no usamos .sort(), así se mantiene el orden del Array
        const chordList = usedChords
            .map((c) => `<strong>${c}</strong>`)
            .join("   ");
        finalHtml += `<div class="legend-area">ACORDES (en orden): ${chordList}</div>\n`;
    }

    outputDiv.innerHTML = finalHtml + processedLines.join("\n");
}

function isChordLine(line) {
    if (!line.trim()) return false;
    // Si contiene muchas letras seguidas (palabras largas), es letra, no acordes
    const words = line.trim().split(/\s+/);
    let chordLike = 0;

    words.forEach((w) => {
        // Limpiamos el token para verificar si es acorde
        const clean = w.replace(/[()]/g, "");
        if (
            clean.match(
                /^[A-G][b#]?(maj|min|m|M|aug|dim|sus|add|alt|b5|#5|[0-9]|\+|\-|\(|\/)*$/,
            )
        ) {
            chordLike++;
        }
    });

    // Heurística: si más del 40% son acordes y no hay palabras muy largas
    const hasLongWords = words.some((w) => w.length > 8);
    return chordLike / words.length > 0.4 && !hasLongWords;
}

function transposeNote(chordPart, steps) {
    // Extraer solo la nota base (ej: de Fmaj7 extraer F, de C#m extraer C#)
    return chordPart.replace(/[A-G][b#]?/, (note) => {
        let index = notes.indexOf(note);
        let useFlats = false;

        if (index === -1) {
            index = flats.indexOf(note);
            if (index !== -1) useFlats = true;
        }

        if (index === -1) return note;

        let newIndex = (index + steps) % 12;
        while (newIndex < 0) newIndex += 12;

        return useFlats ? flats[newIndex] : notes[newIndex];
    });
}

function escapeHTML(str) {
    return str.replace(
        /[&<>"']/g,
        (m) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[m],
    );
}

async function copyFormatted() {
    const content = document.getElementById("output").innerHTML;
    const plainText = document.getElementById("output").innerText;

    // Creamos un HTML que Word entienda perfectamente
    const html = `
            <div style="font-family:'Courier New',Courier,monospace; white-space:pre; line-height:1.2;">
                ${content}
            </div>
        `;

    const blobHtml = new Blob([html], { type: "text/html" });
    const blobText = new Blob([plainText], { type: "text/plain" });

    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                "text/html": blobHtml,
                "text/plain": blobText,
            }),
        ]);
        const toast = document.getElementById("toast");
        toast.style.display = "block";
        setTimeout(() => (toast.style.display = "none"), 3000);
    } catch (e) {
        alert("Error al copiar. Selecciona el texto manualmente.");
    }
}

// Ejemplo inicial para probar acordes complejos
window.onload = () => {
    inputArea.value =
        "Acordes Complejos: Fmaj7  Cadd9  Am7b5  G13  D/F#\n\nFmaj7          Cadd9\nFue tanto el amor que nos tuvimos\nAm7b5          D7#9\nQue ya no queda nada de nosotros";
    update();
};
