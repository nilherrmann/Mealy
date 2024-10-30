$(document).ready(function() {
    const apiUrl = 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/recipe/detail';

    function getToken() {
        const token = localStorage.getItem('token');
        console.log('Token retrieved:', token);
        return token;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        fetchRecipeDetails(recipeId);
    } else {
        alert('Rezept-ID nicht gefunden.');
        window.location.href = 'RecipeCollection.html';
    }

    function fetchRecipeDetails(id) {
        $.ajax({
            url: `https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/recipe/detail/${id}`,
            type: 'GET',
            headers: { 'token': getToken() },
            success: function(recipe) {
                displayRecipeDetails(recipe);
            },
            error: function(xhr) {
                console.error('Fehler beim Abrufen des Rezepts:', xhr.status, xhr.statusText);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
                window.location.href = 'RecipeCollection.html';
            }
        });
    }

    function displayRecipeDetails(recipe) {
        $('#recipe-name').text(recipe.name);
        $('#recipe-description').text(recipe.description);
        $('#ingredient-list').empty();
        recipe.ingredients.forEach(ingredient => {
            $('#ingredient-list').append(`<li>${ingredient.name} (${ingredient.amount} ${ingredient.unit})</li>`);
        });
    }

    $('#delete-recipe-btn').on('click', function() {
        const confirmDelete = confirm('Möchten Sie dieses Rezept wirklich löschen?');
        if (confirmDelete) {
            deleteRecipe(recipeId);
        }
    });

    function deleteRecipe(id) {
        $.ajax({
            url: `https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/recipe/detail/${id}`,
            type: 'DELETE',
            headers: { 'token': getToken() },
            success: function() {
                alert('Rezept erfolgreich gelöscht!');
                window.location.href = 'RecipeCollection.html';
            },
            error: function(xhr) {
                console.error('Fehler beim Löschen des Rezepts:', xhr.status, xhr.statusText);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        });
    }
});
