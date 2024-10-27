$(document).ready(function() {
    // Token dynamisch aus localStorage abrufen
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Bitte melde dich zuerst an.');
        return;
    }

    // Pläne abrufen, sobald die Seite geladen wird
    fetchPlans();

    // EventListener für die Erstellung eines neuen Ordners
    $("#create-folder-button").click(function(event) {
        event.preventDefault();
        createFolder();
    });

    // Login-Button-Click-Event
    $("#login-button").click(function(event) {
        event.preventDefault();
        const email = $("#email").val();
        const password = $("#password").val();
        loginUser(email, password);
    });
});

// Funktion zum Abrufen der Pläne (Rezepte) vom Backend
function fetchPlans() {
    const token = getToken(); // Dynamisch das Token abrufen

    $.ajax({
        url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/plan',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}` // Korrekte Verwendung von Template-Strings
        },
        success: function(data) {
            if (data.plans) {
                displayPlans(data.plans); // Pläne in der UI anzeigen
            } else {
                alert(data.reason || 'Fehler beim Abrufen der Rezepte.');
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.error('Fehler:', thrownError);
            alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        }
    });
}

// Funktion zum Erstellen eines neuen Ordners (Plan)
function createFolder() {
    const folderName = document.getElementById('folder-name').value;
    if (!folderName) {
        alert('Bitte gib einen Ordnernamen ein.');
        return;
    }

    const token = getToken(); // Dynamisch das Token abrufen

    $.ajax({
        url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/plan',
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}` // Korrekte Verwendung von Template-Strings
        },
        data: JSON.stringify({
            name: folderName,
            diet: 'Standard', // Beispielwert für Diät
            description: 'Dieser Ordner enthält Rezepte.' // Beispielbeschreibung
        }),
        success: function(result) {
            if (result.message === "Plan successfully created") {
                alert('Ordner erfolgreich erstellt!');
                fetchPlans(); // Liste der Ordner aktualisieren
            } else {
                alert(result.reason || 'Fehler beim Erstellen des Ordners.');
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.error('Fehler:', thrownError);
            alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        }
    });
}

// Funktion zum Anzeigen der abgerufenen Pläne (Ordner)
function displayPlans(plans) {
    const folderList = document.getElementById('folder-list');
    folderList.innerHTML = ''; // Vorherige Inhalte löschen

    plans.forEach(plan => {
        const folderElement = document.createElement('div');
        folderElement.classList.add('folder');
        folderElement.innerHTML = `
            <h3>${plan.name}</h3>
            <p>${plan.description}</p>
            <button onclick="deleteFolder('${plan.plan_id}')">Ordner löschen</button>
            <button onclick="editFolder('${plan.plan_id}', '${plan.name}')">Ordner bearbeiten</button>
        `;
        folderList.appendChild(folderElement);
    });
}

// Funktion zum Löschen eines Ordners (Plans)
function deleteFolder(planId) {
    const token = getToken(); // Dynamisch das Token abrufen

    $.ajax({
        url: `https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/plan/${planId}`, // Korrekte Verwendung von Template-Strings
        type: 'DELETE',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}` // Korrekte Verwendung von Template-Strings
        },
        success: function(result) {
            if (result.message === "Plan successfully deleted") {
                alert('Ordner erfolgreich gelöscht');
                fetchPlans(); // Aktualisiere die Liste der Pläne nach Löschung
            } else {
                alert(result.reason || 'Fehler beim Löschen des Ordners');
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.error('Fehler:', thrownError);
            alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        }
    });
}

// Funktion zum Bearbeiten eines Ordners (Plans)
function editFolder(planId, currentName) {
    const newName = prompt('Geben Sie den neuen Namen des Ordners ein', currentName);
    if (!newName) return;

    const token = getToken(); // Dynamisch das Token abrufen

    $.ajax({
        url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/plan/${planId}', // Korrekte Verwendung von Template-Strings
        type: 'PUT',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${token}` // Korrekte Verwendung von Template-Strings
        },
        data: JSON.stringify({
            field: 'name',
            value: newName
        }),
        success: function(result) {
            if (result.message === "plan successfully changed") {
                alert('Ordnername erfolgreich geändert');
                fetchPlans(); // Aktualisiere die Liste der Pläne nach Änderung
            } else {
                alert(result.reason || 'Fehler beim Ändern des Ordnernamens');
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.error('Fehler:', thrownError);
            alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        }
    });
}

// Funktion zum Abrufen des gespeicherten Tokens
function getToken() {
    return localStorage.getItem('authToken');
}
