$(document).ready(function() {
    // Token vom LocalStorage abrufen
    const token = localStorage.getItem('authToken');
    if (token) {
        console.log("Token erfolgreich abgerufen:", token);
    } else {
        console.log("Kein Token im LocalStorage gefunden.");
    }

    // Funktion zum Abrufen der Profildaten
    function getProfileData() {
        $.ajax({
            url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/user',
            type: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            success: function(data) {
            console.log("Erhaltene Profildaten:", data);

                 if (data.userName || data.username) {
                               $('#userName').val(data.userName || data.username);
                           } else {
                               alert('Fehler: Benutzername nicht gefunden.');
                           }

                           // Überprüfe und setze die E-Mail
                           if (data.email) {
                               $('#useremail').val(data.email);
                           } else {
                               alert('Fehler: E-Mail nicht gefunden.');
                           }
                       },
            error: function(xhr) {
                handleError(xhr);
            }
        });
    }

    // Funktion zum Speichern des Profils (PUT)
    window.saveProfile = function() {
        const userName = $('#userName').val();
        const useremail = $('#useremail').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        if (newPassword && newPassword !== confirmPassword) {
            alert('Die Passwörter stimmen nicht überein.');
            return;
        }

        const fieldsToUpdate = {
            userName: userName,
            email: useremail,
            password: newPassword ? newPassword : undefined
        };

        $.ajax({
            url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/user',
            type: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(fieldsToUpdate),
            success: function(result) {
                if (result.message === "Account details successfully changed") {
                    alert('Profil erfolgreich aktualisiert!');
                } else {
                    alert(result.reason || 'Fehler beim Speichern des Profils');
                }
            },
            error: function(xhr) {
                handleError(xhr);
            }
        });
    };

    // Funktion zum Löschen des Accounts (DELETE)
    $("#deleteAccount").click(function(event) {
        event.preventDefault();

        if (confirm('Möchtest du wirklich deinen Account löschen?')) {
            $.ajax({
                url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/user',
                type: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                success: function(result) {
                    if (result.message === "Account successfully deleted") {
                        alert('Account erfolgreich gelöscht.');
                        localStorage.removeItem('authToken');
                        window.location.href = "Login.html";
                    } else {
                        alert(result.reason || 'Fehler beim Löschen des Accounts');
                    }
                },
                error: function(xhr) {
                    handleError(xhr);
                }
            });
        }
    });

    // Funktion zum Abmelden
    $("#logOut").click(function(event) {
        event.preventDefault();
        alert('Erfolgreich abgemeldet!');
        localStorage.removeItem('authToken');
        window.location.href = "Login.html";
    });

    function handleError(xhr) {
        console.log('Fehler:', xhr.status);
        console.log('Antwort:', xhr.responseText);
        if (xhr.status === 0) {
            alert('CORS Fehler: Zugriff verweigert. Überprüfe die Serverkonfiguration.');
        } else if (xhr.status === 404) {
            alert('Die angeforderte Ressource wurde nicht gefunden (404).');
        } else if (xhr.status === 403) {
            alert('Zugriff verweigert (403). Bitte überprüfe deine Berechtigungen.');
        } else {
            alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        }
    }

    // Profildaten beim Laden der Seite abrufen
    getProfileData();
});
