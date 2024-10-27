(function() {
  let token = "123"; // Beispiel-Token, sollte dynamisch gesetzt werden

  // EventListener für das Absenden des Formulars
  $('#recipe-form').on('submit', function(event) {
    event.preventDefault(); // Verhindert die Standardformularübermittlung

    // Rezeptdaten erfassen
    const recipeName = $('#recipe-name').val();
    const recipeDescription = $('#recipe-description').val();

    // Zutaten erfassen
    const ingredientNames = $('input[name="ingredient_name[]"]');
    const ingredientAmounts = $('input[name="ingredient_amount[]"]');
    const ingredientUnits = $('select[name="ingredient_unit[]"]');

    const ingredients = [];

    for (let i = 0; i < ingredientNames.length; i++) {
      ingredients.push({
        name: ingredientNames[i].value,
        amount: parseFloat(ingredientAmounts[i].value),
        unit: ingredientUnits[i].value
      });
    }

    // Bild erfassen
    const recipeImage = $('#recipe-image')[0].files[0];

    // FormData erstellen, um Bilddatei und JSON-Daten zu senden
    const formData = new FormData();
    formData.append('token', token);
    formData.append('recipe_image', recipeImage);
    formData.append('recipe', JSON.stringify({
      name: recipeName,
      ingredients: ingredients,
      description: recipeDescription
    }));

    // API-Anfrage mit $.ajax senden
    $.ajax({
      url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/recipe/{recipe_id}',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(result) {
        if (result.message === "Recipe successfully created") {
          alert('Rezept erfolgreich erstellt!');
          window.location.href = 'RecipeCollection.html'; // Weiterleitung nach erfolgreicher Erstellung
        } else {
          alert(result.reason || 'Fehler beim Erstellen des Rezepts');
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        console.error('Fehler:', thrownError);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      }
    });
  });

  // Funktion zum Hinzufügen weiterer Zutatenfelder
  function addIngredient(button) {
    const ingredientContainer = $('#ingredient-fields-container');

    const newIngredient = $(`
      <div class="ingredient-fields">
        <input type="text" name="ingredient_name[]" placeholder="Zutat" class="ingredient-input" required>
        <input type="number" name="ingredient_amount[]" placeholder="Menge" class="ingredient-input" required>
        <select name="ingredient_unit[]" class="ingredient-input" required>
          <option value="g">Gramm (g)</option>
          <option value="kg">Kilogramm (kg)</option>
          <option value="ml">Milliliter (ml)</option>
          <option value="l">Liter (l)</option>
          <option value="stück">Stück</option>
        </select>
        <button type="button" class="add-ingredient-btn" onclick="addIngredient(this)">+</button>
        <button type="button" class="remove-ingredient-btn" onclick="removeIngredient(this)">-</button>
      </div>
    `);

    ingredientContainer.append(newIngredient);
  }

  // Funktion zum Entfernen von Zutatenfeldern
  function removeIngredient(button) {
    const ingredientContainer = $('#ingredient-fields-container');
    if (ingredientContainer.children().length > 1) {
      $(button).parent().remove();
    } else {
      alert('Mindestens eine Zutat muss vorhanden sein.');
    }
  }
})();
