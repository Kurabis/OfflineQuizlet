window.$ = window.jQuery = require('./jquery-3.7.1.js');

$(document).ready(function () {
    addCard(undefined);
});

$(document).on("focus", "textarea", function () {
    const textarea = $(this)[0];

    const lastCard = cards[cards.length - 1];
    if (lastCard.Term === textarea || lastCard.Definition === textarea) {
        addCard(undefined);
    }
});

$(document).on("keydown", "textarea", function (e) {
    if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        addCard(this);
    }
});

$(document).on("input", "textarea", function () {
    const textarea = $(this)[0];

    textarea.style.height = "";
    textarea.style.height = Math.min(textarea.scrollHeight, 300) + "px";
});

$("#export-button").on("click", function () {
    exportToFile();
});

$("#file-input").on("change", function(e) {
    importFile(e);
});

function addCard(afterElement) {
    const newRow = $(`
        <tr>
            <td><textarea class="term-textarea"></textarea></td>
            <td><textarea class="definition-textarea"></textarea></td>
        </tr>
    `);

    if (afterElement == undefined) {
        $("tbody").append(newRow);
    } else {
        $(afterElement).closest("tr").after(newRow);
    }

    const newCard = {
        Term: $("textarea.term-textarea").last()[0],
        Definition: $("textarea.definition-textarea").last()[0]
    };

    if (afterElement == undefined) {
        cards.push(newCard);
    } else {
        const index = cards.findIndex(card => card.Term === afterElement || card.Definition === afterElement);
        cards.splice(index + 1, 0, newCard);
    }

}

function exportToFile() {
    const fileName = $("#name-input")[0].value;

    let exportString = "";

    cards.forEach(card => {
        if (card.Term.value || card.Definition.value) {
            exportString += `${card.Term.value}ǀ${card.Definition.value}ǁ`
        }
    });

    var blob = new Blob([exportString], { type: "text/plain" });

    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/plain", a.download, a.href].join(':');
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
    downloadString(exportString, "text/plain", fileName)
}

let cards = [];