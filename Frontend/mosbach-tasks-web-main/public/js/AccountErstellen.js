document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault();

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
  fetch('http://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    console.log(result); // Antwort prüfen
    if (result.message === "Account successfully registered") {
      window.location.href = 'RegistBestätigung.html';
    } else {
      alert(result.reason || "Registrierung fehlgeschlagen");
    }
  })
  .catch(error => {
    console.error("Fehler:", error);
    alert("Fehler beim Registrieren: " + error.message);
  });
})