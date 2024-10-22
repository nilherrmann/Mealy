<script>

    const token = "123"; // Token auf den Wert 123 gesetzt

    // Funktion zum Abrufen der Profildaten (GET)
    document.addEventListener('DOMContentLoaded', function() {
        fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token im Header senden
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.userName && data.email) {
                document.getElementById('userName').value = data.userName;
                document.getElementById('userEmail').value = data.email;
            } else {
                alert('Fehler beim Abrufen der Profildaten');
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
            alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        });
    });

    // Funktion zum Speichern des Profils (PUT)
    function saveProfile() {
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Überprüfen, ob die Passwörter übereinstimmen
        if (newPassword && newPassword !== confirmPassword) {
            alert('Die Passwörter stimmen nicht überein.');
            return;
        }

        const fieldsToUpdate = [
            { field: "userName", value: userName },
            { field: "email", value: userEmail }
        ];

        if (newPassword) {
            fieldsToUpdate.push({ field: "password", value: newPassword });
        }

        // PUT-Anfragen für jedes Feld
        fieldsToUpdate.forEach(field => {
            fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    token: token,
                    field: field.field,
                    value: field.value
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.message === "Account details successfully changed") {
                    alert('Profil erfolgreich aktualisiert!');
                } else {
                    alert(result.reason || 'Fehler beim Speichern des Profils');
                }
            })
            .catch(error => {
                console.error('Fehler:', error);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            });
        });
    }

    // Funktion zum Löschen des Accounts (DELETE)
    function deleteAccount() {
        if (confirm('Möchtest du wirklich deinen Account löschen?')) {
            fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/user', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    token: token
                })
            })
            .then(response => response.json())
            .then(result => {
                if (result.message === "Account successfully deleted") {
                    alert('Account erfolgreich gelöscht.');
                    window.location.href = "login.html";
                } else {
                    alert(result.reason || 'Fehler beim Löschen des Accounts');
                }
            })
            .catch(error => {
                console.error('Fehler:', error);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            });
        }
    }

    function logOut() {
        alert('Erfolgreich abgemeldet!');
        window.location.href = "Login.html";
    }
</script>