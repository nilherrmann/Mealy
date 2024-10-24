
$(document).ready(function() {
  $("#submit").click(function(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars (Seitenreload)

    // Eingabewerte sammeln
    var loginData = {
      email: $("#email").val(),
      username: $("#username").val(),
      password: $("#password").val(),
      passwordConfirm: $("#passwordConfirm").val(),
    };

    // Überprüfen, ob die Passwörter übereinstimmen
    if (password !== passwordConfirm) {
      alert('Die Passwörter stimmen nicht überein.');
      return;
    }

    console.log("Registrierungsdaten:", data);

    // AJAX-Anfrage an das Backend senden
    $.ajax({
      url: 'http://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/register', // Stelle sicher, dass die URL korrekt ist
      type: 'POST',
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data),
      success: function(response) {
        console.log(response); // Antwort prüfen
        if (response.message === "Account successfully registered") {
          window.location.href = 'RegistBestätigung.html'; // Weiterleitung nach erfolgreicher Registrierung
        } else {
          alert(response.reason || "Registrierung fehlgeschlagen");
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        console.log('Fehler: ' + xhr.status + ' ' + thrownError);
        alert('Ein Fehler ist bei der Registrierung aufgetreten: ' + xhr.status + ' ' + thrownError);
      }
    });
  });
});

