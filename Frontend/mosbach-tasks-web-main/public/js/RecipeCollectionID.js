const token = "123"; // Beispiel-Token, sollte dynamisch gesetzt werden

// Funktion zum Abrufen der Liste von Plänen (Rezept-Ordnern) und Rezepten
function fetchPlans() {
    fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/plan', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    })
    .then(response => response.json())
    .then(result => {
        if (result.plans) {
            displayPlans(result.plans);
        } else {
            alert(result.reason || 'Fehler beim Abrufen der Pläne');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    });
}

// Funktion zum Erstellen eines neuen Ordners (Plans)
function createFolder() {
    const folderName = document.getElementById('folder-name').value;
    if (!folderName) {
        alert('Bitte geben Sie einen Ordnernamen ein');
        return;
    }

    fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token,
            name: folderName,
            diet: 'default',  // Diät kann angepasst werden
            description: 'Ordnerbeschreibung' // Beschreibung kann angepasst werden
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.message === "Plan successfully created") {
            alert('Ordner erfolgreich erstellt');
            fetchPlans();  // Aktualisiere die Liste der Pläne nach Erstellung
        } else {
            alert(result.reason || 'Fehler beim Erstellen des Ordners');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    });
}

// Funktion zum Anzeigen der abgerufenen Pläne (Ordner)
function displayPlans(plans) {
    const folderList = document.getElementById('folder-list');
    folderList.innerHTML = '';  // Vorherige Inhalte löschen

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
    fetch(`http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/plan/${planId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
    })
    .then(response => response.json())
    .then(result => {
        if (result.message === "Plan successfully deleted") {
            alert('Ordner erfolgreich gelöscht');
            fetchPlans();  // Aktualisiere die Liste der Pläne nach Löschung
        } else {
            alert(result.reason || 'Fehler beim Löschen des Ordners');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    });
}

// Funktion zum Bearbeiten eines Ordners (Plans)
function editFolder(planId, currentName) {
    const newName = prompt('Geben Sie den neuen Namen des Ordners ein', currentName);
    if (!newName) return;

    fetch(`http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/plan/${planId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token,
            field: 'name',
            value: newName
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.message === "plan successfully changed") {
            alert('Ordnername erfolgreich geändert');
            fetchPlans();  // Aktualisiere die Liste der Pläne nach Änderung
        } else {
            alert(result.reason || 'Fehler beim Ändern des Ordnernamens');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    });
}

// Abrufen der Pläne beim Laden der Seite
window.onload = fetchPlans;
