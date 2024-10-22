const token = "123"; // Beispiel-Token, in der Realität sollte das Token dynamisch ermittelt werden

// Funktion zum Abrufen der Pläne (Rezepte) vom Backend
function fetchPlans() {
    fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/plan', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.plans) {
            displayPlans(data.plans); // Pläne in der UI anzeigen
        } else {
            alert(data.reason || 'Fehler beim Abrufen der Rezepte.');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    });
}

// Funktion zur Anzeige der Pläne in der UI
function displayPlans(plans) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = ''; // Vorherige Einträge entfernen

    plans.forEach(plan => {
        const planElement = document.createElement('div');
        planElement.classList.add('plan-item');
        planElement.innerHTML = `
            <h3>${plan.name}</h3>
            <p>Diät: ${plan.diet}</p>
            <p>Beschreibung: ${plan.description}</p>
        `;
        recipeList.appendChild(planElement);
    });
}

// Funktion zum Erstellen eines neuen Ordners (Plan)
function createFolder() {
    const folderName = document.getElementById('folder-name').value;

    if (!folderName) {
        alert('Bitte gib einen Ordnernamen ein.');
        return;
    }

    fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            token: token,
            name: folderName,
            diet: 'Standard',  // Beispielwert für Diät
            description: 'Dieser Ordner enthält Rezepte.'  // Beispielbeschreibung
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.message === "Plan successfully created") {
            alert('Ordner erfolgreich erstellt!');
            fetchPlans();  // Liste der Ordner aktualisieren
        } else {
            alert(result.reason || 'Fehler beim Erstellen des Ordners.');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    });
}

// EventListener hinzufügen, wenn die Seite geladen wird
document.addEventListener('DOMContentLoaded', function() {
    fetchPlans();  // Pläne abrufen, sobald die Seite geladen wird
});
