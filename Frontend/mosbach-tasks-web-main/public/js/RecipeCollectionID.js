// Funktion zum Abrufen des gespeicherten Tokens
(function() {
    // Funktion zum Abrufen der Liste von Plänen (Rezept-Ordnern) und Rezepten
    function fetchPlans() {
        const token = getToken(); // Dynamisch das Token abrufen

        $.ajax({
            url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/plan',
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function(result) {
                if (result.plans) {
                    displayPlans(result.plans);
                } else {
                    alert(result.reason || 'Fehler beim Abrufen der Pläne');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.error('Fehler:', thrownError);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        });
    }

    // Funktion zum Erstellen eines neuen Ordners (Plans)
    function createFolder() {
        const folderName = document.getElementById('folder-name').value;
        if (!folderName) {
            alert('Bitte geben Sie einen Ordnernamen ein');
            return;
        }

        const token = getToken(); // Dynamisch das Token abrufen

        $.ajax({
            url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/plan',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                token,
                name: folderName,
                diet: 'default',  // Diät kann angepasst werden
                description: 'Ordnerbeschreibung' // Beschreibung kann angepasst werden
            }),
            success: function(result) {
                if (result.message === "Plan successfully created") {
                    alert('Ordner erfolgreich erstellt');
                    fetchPlans();  // Aktualisiere die Liste der Pläne nach Erstellung
                } else {
                    alert(result.reason || 'Fehler beim Erstellen des Ordners');
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
        const token = getToken(); // Dynamisch das Token abrufen

        $.ajax({
            url: 'http://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/plan/${planId}',
            type: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ token }), // Token im Request-Body senden
            success: function(result) {
                if (result.message === "Plan successfully deleted") {
                    alert('Ordner erfolgreich gelöscht');
                    fetchPlans();  // Aktualisiere die Liste der Pläne nach Löschung
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
            url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/plan/${planId}',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                token,
                field: 'name',
                value: newName
            }),
            success: function(result) {
                if (result.message === "plan successfully changed") {
                    alert('Ordnername erfolgreich geändert');
                    fetchPlans();  // Aktualisiere die Liste der Pläne nach Änderung
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

    // Initialer Aufruf zum Abrufen der Pläne, wenn die Seite geladen wird
    $(document).ready(function() {
        fetchPlans();
    });
})();
