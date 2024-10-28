$(document).ready(function() {
  // EventListener für das Rezeptformular
  $('#recipe-form').on('submit', function(event) {
    event.preventDefault(); // Verhindert die Standard-Formularübermittlung

    const token = localStorage.getItem('authToken'); // Token aus localStorage abrufen

    if (!token) {
      alert('Bitte melde dich zuerst an.');
      return;
    }

    // Rezeptdaten sammeln
    const recipeName = $('#recipe-name').val();
    const recipeDescription = $('#recipe-description').val();
    const ingredients = [];

    // Zutaten sammeln
    $('#ingredient-fields-container .ingredient-fields').each(function() {
      const ingredientName = $(this).find('input[name="ingredient_name[]"]').val();
      const ingredientAmount = $(this).find('input[name="ingredient_amount[]"]').val();
      const ingredientUnit = $(this).find('select[name="ingredient_unit[]"]').val();

      ingredients.push({
        name: ingredientName,
        unit: ingredientUnit,
        amount: parseFloat(ingredientAmount) // Menge in eine Zahl umwandeln
      });
    });

    // Bilddatei abrufen
    const recipeImage = $('#recipe-image')[0].files[0];
    const formData = new FormData();
    formData.append('token', token);
    formData.append('recipe', JSON.stringify({
      name: recipeName,
      ingredients: ingredients,
      description: recipeDescription
    }));
    formData.append('recipe_image', recipeImage); // Bilddatei hinzufügen

    // AJAX-Anfrage zum Erstellen des Rezepts
    $.ajax({
      url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/recipe',
      type: 'POST',
      data: formData,
      processData: false, // Verhindert jQuery, die Daten in eine Abfragezeichenfolge umzuwandeln
      contentType: false,
        headers: {
               'token': token // Token im Header hinzufügen
             },
      success: function(response) {
        if (response.message === "Recipe successfully created") {
          alert('Rezept erfolgreich erstellt!');
          window.location.href = 'RecipeCollection.html'; // Weiterleitung zur Rezeptsammlung
        } else {
          alert(response.reason || 'Fehler beim Erstellen des Rezepts.');
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        console.error('Fehler:', thrownError);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      }
    });
  });
});

// Funktion zum Hinzufügen einer neuen Zutat
function addIngredient(button) {
  const newIngredient = `
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
  `;
  $('#ingredient-fields-container').append(newIngredient);
}

// Funktion zum Entfernen einer Zutat
function removeIngredient(button) {
  $(button).closest('.ingredient-fields').remove();
}
