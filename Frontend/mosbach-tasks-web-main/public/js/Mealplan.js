$(document).ready(function() {
  const token = '123';  // Dummy Token

  // FullCalendar Initialisierung
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'de',  // Sprache auf Deutsch setzen
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    dateClick: function(info) {
      // Zeigt das Formular an, wenn ein Datum im Kalender geklickt wird
      $('#mealForm').show();
      $('#selectedDate').text(info.dateStr);  // Ausgewähltes Datum anzeigen

      // Formular für das Hinzufügen von Mahlzeiten bearbeiten
      $('#mealAddForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        const mealTime = $('#mealTime').val();
        const meal = $('#meal').val();
        const selectedDate = info.dateStr;

        // Füge die Mahlzeit zum Kalender hinzu
        calendar.addEvent({
          title: `${mealTime}: ${meal}`,
          start: selectedDate,
          allDay: true,
          extendedProps: {
            mealType: mealTime,
            mealName: meal
          }
        });

        // Hier der POST Request zum Backend, um die Mahlzeit zu speichern
        $.ajax({
          url: 'http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/recipe/linkRecipeToMealplan',
          method: 'POST',
          data: JSON.stringify({
            token: token,
            day: selectedDate,
            time: mealTime,
            recipe: meal
          }),
          contentType: 'application/json',
          success: function(response) {
            alert('Mahlzeit erfolgreich gespeichert');
            $('#mealForm').hide();
            updateNutritionalInfo(selectedDate, mealTime, meal); // Nährwerte aktualisieren
          },
          error: function(xhr) {
            alert('Fehler beim Hinzufügen der Mahlzeit: ' + xhr.responseJSON.reason);
          }
        });
      });
    }
  });

  calendar.render();

  // Funktion zum Abrufen der Nährwerte und Aktualisieren der Anzeige
  function updateNutritionalInfo(day, mealTime, meal) {
    // Hier kann die Logik implementiert werden, um die Nährwerte des Gerichts abzurufen
    // Beispiel: API-Call, um die Nährwerte zu erhalten
    $.ajax({
      url: 'http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/recipe/getNutritionalValues', // Beispiel-URL
      method: 'GET',
      data: { meal: meal }, // Senden des Mahlzeitnamens
      contentType: 'application/json',
      success: function(response) {
        // Aktualisieren der Nährwerte in der Tabelle
        const nutritionalInfo = response.nutrition; // Beispielhafte Rückgabe von Nährwerten
        $(`#${mealTime.toLowerCase()}-nutrition-${day}`).text(`Nährwerte: ${nutritionalInfo}`);
      },
      error: function(xhr) {
        alert('Fehler beim Abrufen der Nährwerte: ' + xhr.responseJSON.reason);
      }
    });
  }
});
