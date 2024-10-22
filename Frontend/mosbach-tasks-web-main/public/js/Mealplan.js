<script>
  $(document).ready(function() {
    const token = '123';  // Verwendet den festgelegten Token

    // Mealplan abrufen (GET Request)
    $.ajax({
        url: 'http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/recipe/getMeals',
        method: 'GET',
        data: JSON.stringify({ token: token }),
        contentType: 'application/json',
        success: function(response) {
            // Mahlzeiten in den Plan eintragen
            response.meals.forEach(function(meal) {
                const [day, time] = meal.time.split('-');
                const mealType = time; // Frühstück, Mittag, Abend
                $(`input[name=${mealType}-${day}]`).val(meal.name);
                $(`#${mealType}-nutrition-${day}`).text(`Nährwerte: ${meal['nutrition values']}`);
            });
        },
        error: function(xhr) {
            alert('Fehler beim Abrufen der Mahlzeiten: ' + xhr.responseJSON.reason);
        }
    });

    // Mealplan speichern (POST Request)
    $('#mealplan-form').on('submit', function(e) {
        e.preventDefault();
        const formData = $(this).serializeArray();

        formData.forEach(function(item) {
            const [mealType, day] = item.name.split('-');
            const recipeName = item.value;

            // Hier eine Funktion zum Abrufen der Rezept-ID basierend auf dem Rezeptnamen
            const recipeId = getRecipeIdByName(recipeName);  // Muss implementiert werden

            if (recipeId) {
                $.ajax({
                    url: 'http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/recipe/linkRecipeToMealplan',
                    method: 'POST',
                    data: JSON.stringify({
                        token: token,
                        day: day,
                        time: mealType,
                        recipe_id: recipeId
                    }),
                    contentType: 'application/json',
                    success: function(response) {
                        alert('Mahlzeit erfolgreich zum Plan hinzugefügt: ' + response.message);
                    },
                    error: function(xhr) {
                        alert('Fehler beim Hinzufügen der Mahlzeit: ' + xhr.responseJSON.reason);
                    }
                });
            }
        });
    });

    // Funktion zum Abrufen der Rezept-ID
    function getRecipeIdByName(recipeName) {
        // Hier sollte die Logik implementiert werden, um die Rezept-ID basierend auf dem Rezeptnamen abzurufen
        // Zum Beispiel könnte hier ein API-Call erfolgen, um alle Rezepte zu durchsuchen und die ID des Rezepts zu finden
        return "dummyRecipeId"; // Temporärer Rückgabewert
    }

    // Änderung des Mealplans (PUT Request)
    function updateMealPlan(field, value) {
        $.ajax({
            url: 'http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/recipe/updateMealPlan',
            method: 'PUT',
            data: JSON.stringify({
                token: token,
                field: field,
                value: value
            }),
            contentType: 'application/json',
            success: function(response) {
                alert('Mealplan aktualisiert: ' + response.message);
            },
            error: function(xhr) {
                alert('Fehler beim Aktualisieren des Mealplans: ' + xhr.responseJSON.reason);
            }
        });
    }

    // Meal aus Mealplan entfernen (DELETE Request)
    function removeMeal(day, time) {
        $.ajax({
            url: 'http://MealyBackend-fealess-bushbuck-kcapps.01.cf.eu01.stackit.cloud/recipe/removeMeal',
            method: 'DELETE',
            data: JSON.stringify({
                token: token,
                day: day,
                time: time
            }),
            contentType: 'application/json',
            success: function(response) {
                alert('Mahlzeit erfolgreich entfernt: ' + response.message);
                $(`input[name=${time}-${day}]`).val('');
                $(`#${time}-nutrition-${day}`).text('');
            },
            error: function(xhr) {
                alert('Fehler beim Entfernen der Mahlzeit: ' + xhr.responseJSON.reason);
            }
        });
    }
  });
</script>