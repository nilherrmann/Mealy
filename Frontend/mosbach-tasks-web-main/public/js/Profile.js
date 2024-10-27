const token = "123"; // Token auf den Wert 123 gesetzt

$(document).ready(function() {
    // Funktion zum Abrufen der Profildaten (GET)
    $.ajax({
        url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/user',
        type: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        success: function(data) {
            if (data.userName && data.email) {
                $('#userName').val(data.userName);
                $('#userEmail').val(data.email);
            } else {
                alert('Fehler beim Abrufen der Profildaten');
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            console.log('Fehler:', thrownError);
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
    });

    // Funktion zum Speichern des Profils (PUT)
    window.saveProfile = function() {
        const userName = $('#userName').val();
        const userEmail = $('#userEmail').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        if (newPassword && newPassword !== confirmPassword) {
            alert('Die Passwörter stimmen nicht überein.');
            return;
        }

        const fieldsToUpdate = {
            userName: userName,
            email: userEmail,
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
            error: function(xhr, ajaxOptions, thrownError) {
                console.log('Fehler:', thrownError);
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
                        window.location.href = "Login.html";
                    } else {
                        alert(result.reason || 'Fehler beim Löschen des Accounts');
                    }
                },
                error: function(xhr, ajaxOptions, thrownError) {
                    console.log('Fehler:', thrownError);
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
            });
        }
    });

    // Funktion zum Abmelden
    $("#logOut").click(function(event) {
        event.preventDefault();
        alert('Erfolgreich abgemeldet!');
        window.location.href = "Login.html";
    });
});
