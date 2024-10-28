$(document).ready(function() {
    const apiUrl = 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/collection';

    // Zentrales Tokenhandling
    function getToken() {
            const token = localStorage.getItem('token');
            console.log('Token retrieved:', token);
            return token;
        }

    // Rezept-ID aus der URL abrufen
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        fetchRecipeDetails(recipeId);
    } else {
        alert('Rezept-ID nicht gefunden.');
        window.location.href = 'RecipeCollection.html';
    }

    // Funktion, um Rezeptdetails abzurufen
    function fetchRecipeDetails(id) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'GET',
            headers: { 'token': getToken() }, // Token im Header hinzufügen
            success: function(recipe) {
                displayRecipeDetails(recipe);
            },
            error: function(xhr) {
                console.error('Fehler beim Abrufen des Rezepts:', xhr);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
                window.location.href = 'RecipeCollection.html';
            }
        });
    }

    // Funktion, um Rezeptdetails anzuzeigen
    function displayRecipeDetails(recipe) {
        $('#recipe-name').text(recipe.name);
        $('#recipe-image').attr('src', recipe.image);
        $('#recipe-description').text(recipe.description);
        $('#ingredient-list').empty();
        recipe.ingredients.forEach(ingredient => {
            $('#ingredient-list').append(`<li>${ingredient.name} (${ingredient.amount} ${ingredient.unit})</li>`);
        });
    }

    // Funktion zum Löschen des Rezepts
    $('#delete-recipe-btn').on('click', function() {
        const confirmDelete = confirm('Möchten Sie dieses Rezept wirklich löschen?');
        if (confirmDelete) {
            deleteRecipe(recipeId);
        }
    });

    // Funktion zum Löschen eines Rezepts
    function deleteRecipe(id) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'DELETE',
            headers: { 'token': getToken() }, // Token im Header hinzufügen
            success: function() {
                alert('Rezept erfolgreich gelöscht!');
                window.location.href = 'RecipeCollection.html';
            },
            error: function(xhr) {
                console.error('Fehler beim Löschen des Rezepts:', xhr);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        });
    }
});
