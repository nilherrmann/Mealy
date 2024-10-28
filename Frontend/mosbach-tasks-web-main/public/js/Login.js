$(document).ready(function() {
  $("#submitLogin").click(function(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seitenreload)

    // Login-Daten sammeln
    var loginData = {
      userName: $("#userName").val(), // Stelle sicher, dass das Input-Feld die ID "userName" hat
      password: $("#password").val() // Stelle sicher, dass das Input-Feld die ID "password" hat
    };

    // Validierung: Überprüfen, ob Felder ausgefüllt sind
    if (!loginData.userName || !loginData.password) {
      console.log("Fehler: Ein oder mehrere Felder sind leer.");
      alert('Bitte alle Felder ausfüllen.');
      return; // Beende die Funktion, wenn Felder leer sind
    }

    console.log("Login-Daten gesammelt:", loginData);

    // AJAX-Login-Anfrage an die API senden
    $.ajax({
      url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/login', // Stelle sicher, dass die URL korrekt ist
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(loginData), // Korrekte Übergabe der loginData
      success: function(data) {
        console.log("Antwort von der API erhalten:", data);
        if (data.token) {
          localStorage.setItem('authToken', data.token);  // Token im localStorage speichern
          console.log("Token erfolgreich gespeichert:", data.token);

          window.location.href = 'Hompage2.html';
        } else {
          console.log("Login fehlgeschlagen: Kein Token erhalten.");
          alert('Login fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.');
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        console.log("Fehler beim Senden der Anfrage:");
        console.log("Statuscode:", xhr.status);
        console.log("Fehlerdetails:", thrownError);
        console.log("Vollständige Antwort:", xhr);
        alert('Ein Fehler ist beim Login aufgetreten. Bitte versuche es erneut.');
      }
    });
  });
});
