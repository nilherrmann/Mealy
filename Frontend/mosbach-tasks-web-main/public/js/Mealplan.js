$(document).ready(function() {
    const apiUrl = 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/mealplan';

    function getToken() {
        const token = localStorage.getItem('token');
        console.log('Token retrieved:', token);
        return token;
    }

    const token = getToken();
    if (token) {
        fetchRecipes();
    } else {
        console.warn('Kein Token gefunden');
        alert('Bitte melden Sie sich an, um Rezepte anzuzeigen.');
    }

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'de',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        editable: true,
        events: [],
        dateClick: function(info) {
            $('#mealForm').show();
            $('#selectedDate').text(info.dateStr);

            $('#mealAddForm').off('submit').on('submit', function(e) {
                e.preventDefault();
                const mealTime = $('#mealTime').val();
                const recipeId = $('#meal').val();
                const selectedDate = info.dateStr;

                const nutritionalInfo = {
                    calories: $('#calories').val(),
                    protein: $('#protein').val(),
                    carbs: $('#carbs').val(),
                    fats: $('#fats').val()
                };

                calendar.addEvent({
                    title: `${mealTime}: ${recipeId}`,
                    start: selectedDate,
                    allDay: true,
                    extendedProps: {
                        mealType: mealTime,
                        mealName: recipeId
                    }
                });

                $.ajax({
                    url: apiUrl + '/recipe/linkRecipeToMealplan',
                    method: 'POST',
                    headers: { 'token': token },
                    data: JSON.stringify({
                        day: selectedDate,
                        time: mealTime,
                        recipe: recipeId
                    }),
                    contentType: 'application/json',
                    success: function(response) {
                        alert('Mahlzeit erfolgreich gespeichert');
                        $('#mealForm').hide();
                        updateNutritionalInfo(selectedDate, mealTime, recipeId);
                    },
                    error: function(xhr) {
                        const errorMessage = xhr.responseJSON && xhr.responseJSON.reason ? xhr.responseJSON.reason : 'Ein unbekannter Fehler ist aufgetreten.';
                        alert('Fehler beim Hinzufügen der Mahlzeit: ' + errorMessage);
                    }
                });
            });
        },
        eventClick: function(info) {
            if (confirm("Möchten Sie diese Mahlzeit löschen?")) {
                info.event.remove();
                removeMealFromDatabase(info.event.startStr, info.event.extendedProps.mealType);
            }
        }
    });

    function removeMealFromDatabase(day, time) {
        $.ajax({
            url: apiUrl + '/recipe/unlinkRecipe',
            type: 'DELETE',
            headers: { 'token': token },
            data: JSON.stringify({
                day: day,
                time: time
            }),
            contentType: 'application/json',
            success: function(response) {
                alert('Mahlzeit erfolgreich entfernt');
            },
            error: function(xhr) {
                const errorMessage = xhr.responseJSON && xhr.responseJSON.reason ? xhr.responseJSON.reason : 'Ein unbekannter Fehler ist aufgetreten.';
                alert('Fehler beim Entfernen der Mahlzeit: ' + errorMessage);
            }
        });
    }

    function loadMealsFromDatabase() {
        $.ajax({
            url: apiUrl + '/recipe/getMeals',
            type: 'GET',
            headers: { 'token': token },
            success: function(response) {
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

    calendar.render();
    loadMealsFromDatabase();
});
