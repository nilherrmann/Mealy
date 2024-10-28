$(document).ready(function() {
   // Token dynamisch aus LocalStorage abrufen
   const token = localStorage.getItem('authToken');
   if (!token) {
     alert('Bitte melde dich zuerst an.');
     return; // Stoppe die Ausführung, wenn kein Token vorhanden ist
   }

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
    selectable: true,
    editable: true,
    events: [], // Zunächst ein leeres Array für die Ereignisse
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

         const nutritionalInfo = {
                  calories: $('#calories').val(),     // Kalorien
                  protein: $('#protein').val(),       // Protein
                  carbs: $('#carbs').val(),           // Kohlenhydrate
                  fats: $('#fats').val()               // Fette
                };

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

        // POST Request zum Backend, um die Mahlzeit zu speichern
        $.ajax({
          url: 'https://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/recipe/linkRecipeToMealplan',
          method: 'POST',
          headers: { 'token': token },  // Token im Header hinzufügen
          data: JSON.stringify({
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
    },
    eventClick: function(info) {
      if (confirm("Möchten Sie diese Mahlzeit löschen?")) {
        info.event.remove(); // Löschen der Veranstaltung aus dem Kalender
        removeMealFromDatabase(info.event.startStr, info.event.extendedProps.mealType); // Aus der Datenbank löschen
      }
    }
  });

  function removeMealFromDatabase(day, time) {
      $.ajax({
          url: 'https://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/recipe/unlinkRecipe',
          type: 'DELETE',
          headers: { 'token': token },  // Token im Header hinzufügen
          data: JSON.stringify({
              day: day,
              time: time
          }),
          contentType: 'application/json',
          success: function(response) {
              alert('Mahlzeit erfolgreich entfernt');
          },
          error: function(xhr) {
              alert('Fehler beim Entfernen der Mahlzeit: ' + xhr.responseJSON.reason);
          }
      });
  }

  calendar.render();

  // Funktion zum Abrufen von Mahlzeiten aus der Datenbank
  function loadMealsFromDatabase() {
    $.ajax({
      url: 'https://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/recipe/getMeals',
      type: 'GET',
      headers: { 'token': token },  // Token im Header hinzufügen
      success: function(response){
        // Angenommen, response ist ein Array von Mahlzeiten
        response.forEach(meal => {
          calendar.addEvent({
            id: meal.id,
            title: meal.mealName,
            start: meal.date + 'T' + meal.time + ':00',
            allDay: true
          });
        });
      },
      error: function(xhr, status, error) {
        console.error('Fehler beim Laden der Mahlzeiten:', error);
      }
    });
  }

  loadMealsFromDatabase();
});
