// Funktion zur Benutzeranmeldung und zum Abrufen des Tokens
(function() {
    let token = "123";

    // Funktion zur Benutzeranmeldung
    function loginUser(email, password) {
        const loginData = {
            email: email,
            password: password
        };

        $.ajax({
            url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/login', // URL zum Anmelden
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(loginData),
            success: function(response) {
                if (response.token) {
                    // Token speichern (z.B. im Local Storage)
                    localStorage.setItem('authToken', response.token);
                    alert('Anmeldung erfolgreich!');
                    fetchPlans(); // Pläne abrufen, nachdem der Benutzer erfolgreich angemeldet wurde
                } else {
                    alert(response.reason || 'Anmeldung fehlgeschlagen.');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                console.error('Fehler:', thrownError);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        });
    }

    function getToken() {
        return localStorage.getItem('authToken');
    }

    // Funktion zum Abrufen der Pläne (Rezepte) vom Backend
    function fetchPlans() {
        const token = getToken(); // Dynamisch das Token abrufen

        $.ajax({
            url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/plan',
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
        const diet = 'Standard'; // Beispielwert für Diät
        const description = 'Dieser Ordner enthält Rezepte.'; // Beispielbeschreibung
        const token = getToken(); // Dynamisch das Token abrufen

        if (!folderName) {
            alert('Bitte gib einen Ordnernamen ein.');
            return;
        }

        $.ajax({
            url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/plan',
            type: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                token: token, // Token im Request-Body senden
                name: folderName,
                diet: diet,
                description: description
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

    // EventListener hinzufügen, wenn die Seite geladen wird
    $(document).ready(function() {
        // Beispielaufruf zur Benutzeranmeldung, hier kannst du Eingabefelder anpassen
        $("#login-button").click(function(event) {
            event.preventDefault();
            const email = $("#email").val();
            const password = $("#password").val();
            loginUser(email, password); // Benutzeranmeldung durchführen
        });

        fetchPlans(); // Pläne abrufen, sobald die Seite geladen wird

        // EventListener für die Erstellung eines neuen Ordners
        $("#create-folder-button").click(function(event) {
            event.preventDefault();
            createFolder(); // Ordner erstellen
        });
    });
})();
