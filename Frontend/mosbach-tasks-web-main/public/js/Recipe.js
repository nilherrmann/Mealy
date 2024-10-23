const apitoken = "123";

// EventListener für das Absenden des Formulars
document.getElementById('recipe-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Verhindert die Standardformularübermittlung

  // Rezeptdaten erfassen
  const recipeName = document.getElementById('recipe-name').value;
  const recipeDescription = document.getElementById('recipe-description').value;

  // Zutaten erfassen
  const ingredientNames = document.querySelectorAll('input[name="ingredient_name[]"]');
  const ingredientAmounts = document.querySelectorAll('input[name="ingredient_amount[]"]');
  const ingredientUnits = document.querySelectorAll('select[name="ingredient_unit[]"]');

  const ingredients = [];

  for (let i = 0; i < ingredientNames.length; i++) {
    ingredients.push({
      name: ingredientNames[i].value,
      amount: parseFloat(ingredientAmounts[i].value),
      unit: ingredientUnits[i].value
    });
  }

  // API-Anfrage mit fetch() senden
  fetch( 'http://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      token: token,
      recipe: {
        name: recipeName,
        ingredients: ingredients,
        description: recipeDescription
      }
    })
  })
  .then(response => response.json())
  .then(result => {
    if (result.message === "Recipe successfully created") {
      alert('Rezept erfolgreich erstellt!');
      window.location.href = 'RecipeCollection.html'; // Weiterleitung nach erfolgreicher Erstellung
    } else {
      alert(result.reason || 'Fehler beim Erstellen des Rezepts');
    }
  })
  .catch(error => {
    console.error('Fehler:', error);
    alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
  });
});

// Funktion zum Hinzufügen weiterer Zutatenfelder
function addIngredient(button) {
  const ingredientContainer = document.getElementById('ingredient-fields-container');

  const newIngredient = document.createElement('div');
  newIngredient.classList.add('ingredient-fields');
  newIngredient.innerHTML = `
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
  `;

  ingredientContainer.appendChild(newIngredient);
}

// Funktion zum Entfernen von Zutatenfeldern
function removeIngredient(button) {
  const ingredientContainer = document.getElementById('ingredient-fields-container');
  if (ingredientContainer.children.length > 1) {
    button.parentElement.remove();
  } else {
    alert('Mindestens eine Zutat muss vorhanden sein.');
  }
}
