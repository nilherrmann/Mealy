(function() {
  let token = "123"; // Beispiel-Token, sollte dynamisch gesetzt werden

  // Funktion zur Bildkompression
  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 800; // Maximalbreite nach der Kompression
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/jpeg', 0.7); // Qualität auf 70%
        };
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  // EventListener für das Absenden des Formulars
  $('#recipe-form').submit(async function(event) {
    event.preventDefault(); // Verhindert die Standardformularübermittlung

    // Bild komprimieren
    const recipeImage = document.getElementById('recipe-image').files[0];
    const compressedImage = await compressImage(recipeImage);

    // FormData erstellen, um Bilddatei und JSON-Daten zu senden
    const formData = new FormData(this);
    formData.append('token', token);
    formData.append('recipe_image', compressedImage); // Komprimiertes Bild hinzufügen

    // API-Anfrage mit AJAX senden
    $.ajax({
      url: 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/recipe',
      method: 'POST',
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
      error: function(xhr, status, error) {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      }
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
})();
