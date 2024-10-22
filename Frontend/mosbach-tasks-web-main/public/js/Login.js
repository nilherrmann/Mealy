// Token wird nach dem Login auf den Wert 123 gesetzt
let token = "123";

// Funktion für den Login (POST)
function login() {
    const userName = document.getElementById('userName').value;
    const password = document.getElementById('password').value;

    if (!userName || !password) {
        alert('Bitte fülle alle Felder aus.');
        return;
    }

    // Login-Anfrage an die API senden
    fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userName: userName,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token || token === "123") {  // Token auf 123 setzen
            // Login erfolgreich
            localStorage.setItem('authToken', token);  // Token im localStorage speichern
            alert('Login erfolgreich!');
            window.location.href = 'Hompage2.html';  // Weiterleitung nach erfolgreichem Login
        } else {
            alert(data.reason || 'Fehler beim Login.');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    });
}

// Optional: Funktion zum Überprüfen, ob der Login aktiv ist (GET)
function checkLoginAlive() {
    fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/login', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'The login is alive') {
            console.log('Login aktiv.');
        } else {
            console.log('Login nicht aktiv.');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
    });
}

// Optional: Funktion zum Abmelden (DELETE)
function logOut() {
    fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/login', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Successfully loged out') {
            alert('Erfolgreich abgemeldet!');
            localStorage.removeItem('authToken');  // Token entfernen
            token = null;
            window.location.href = 'login.html';  // Zurück zur Login-Seite
        } else {
            alert(data.message || 'Fehler beim Abmelden.');
        }
    })
    .catch(error => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    });
}

// Wenn ein Token im localStorage existiert, setzen wir es für spätere Anfragen
document.addEventListener('DOMContentLoaded', function() {
    token = localStorage.getItem('authToken') || token;  // Token auf 123, falls keiner gespeichert ist
    if (token) {
        checkLoginAlive();
    }
});
