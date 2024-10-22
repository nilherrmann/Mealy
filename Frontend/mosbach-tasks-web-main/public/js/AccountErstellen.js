document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Verhindert das automatische Neuladen der Seite

  // Eingabewerte sammeln
  const email = document.getElementById('email').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('passwordConfirm').value;

  // Überprüfen, ob die Passwörter übereinstimmen
 if (password !== passwordConfirm) {
   alert('Die Passwörter stimmen nicht überein.');
   return;
 }

  // Daten für die API erstellen
  const data = {
    userName: username,
    email: email,
    password: password
  };

  // Fetch-Anfrage an das Backend senden
  fetch('http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    if (result.message === "Account successfully registered") {
      // Erfolgreiche Registrierung, weiterleiten zur Bestätigungsseite
      window.location.href = 'RegistBestätigung.html';
    } else {
      // Fehler anzeigen
      alert(result.reason || 'Registrierung fehlgeschlagen');
    }
  })
  .catch(error => {
    console.error('Fehler:', error);
    alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
  });
});
