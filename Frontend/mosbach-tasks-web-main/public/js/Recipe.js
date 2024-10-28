
const tokenValue = '123';
localStorage.setItem('token', tokenValue);
console.log('Token set:', tokenValue);

$(document).ready(function() {
  $('#recipe-form').on('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const token = localStorage.getItem('token');
    console.log('Token retrieved:', token); // Log the retrieved token

    if (!token) {
      alert('Es gibt kein Rezept-Token.');
      return;
    }

    // Gather recipe data
    const recipeName = $('#recipe-name').val();
    const recipeDescription = $('#recipe-description').val();
    const ingredients = [];

    // Collect ingredients
    $('#ingredient-fields-container .ingredient-fields').each(function() {
      const ingredientName = $(this).find('input[name="ingredient_name[]"]').val();
      const ingredientAmount = $(this).find('input[name="ingredient_amount[]"]').val();
      const ingredientUnit = $(this).find('select[name="ingredient_unit[]"]').val();

      ingredients.push({
        name: ingredientName,
        unit: ingredientUnit,
        amount: parseFloat(ingredientAmount) // Convert amount to a number
      });
    });

    // Prepare the recipe data as JSON
    const recipeData = {
      name: recipeName,
      ingredients: ingredients,
      description: recipeDescription
    };

    // AJAX request to create the recipe
    $.ajax({
      url: 'https://mealybackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/recipe',
      type: 'POST',
      contentType: 'application/json', // Set content type to JSON
      data: JSON.stringify(recipeData), // Convert the recipe data to JSON
      headers: {
        'token': token // Include the token in the header
      },
      success: function(data) {
        console.log("Antwort von der API erhalten:", data);

        // Überprüfe, ob die API eine positive Antwort zurückgegeben hat
        if (data && JSON.stringify(data).includes("Recipe successfully created")) {
          alert('Rezept erfolgreich erstellt!'); // Alert on successful creation
          window.location.href = 'RecipeCollection.html'; // Redirect to recipe collection
        } else {
          console.log("Rezept-Erstellung fehlgeschlagen: ", data.reason || 'Unbekannter Fehler.');
          alert('Fehler beim Erstellen des Rezepts: ' + (data.reason || 'Bitte versuche es später erneut.'));
        }
      },
      error: function(xhr, ajaxOptions, thrownError) {
        console.error('Fehler:', thrownError);
        console.error('Status:', xhr.status);
        console.error('Response Text:', xhr.responseText);

        let responseMessage = 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';
        try {
          const responseData = JSON.parse(xhr.responseText);
          if (responseData && responseData.reason) {
            responseMessage = responseData.reason; // Verwende den Grund aus der Antwort, falls verfügbar
          }
        } catch (e) {
          console.error('Fehler beim Parsen der Antwort:', e);
        }

        alert(responseMessage); // Alert bei AJAX-Fehler mit detaillierter Nachricht
      }
    });
  });
});

// Function to add a new ingredient
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
  $('#ingredient-fields-container').append(newIngredient); // Append new ingredient fields
}

// Function to remove an ingredient
function removeIngredient(button) {
  $(button).closest('.ingredient-fields').remove(); // Remove the closest ingredient fields container
}
