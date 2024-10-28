$(document).ready(function() {
    const apiUrl = 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/plan';

    // Zentrales Tokenhandling
    function getToken() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Bitte melde dich zuerst an.');
            window.location.href = 'Login.html';
            return null;
        }
        return token;
    }

    // Rezepte beim Laden der Seite abrufen
    const token = getToken();
    if (token) {
        fetchRecipes();
    }

    $('#add-recipe-btn').on('click', function() {
        window.location.href = 'RecipeCreate.html';
    });

    // Funktion, um Rezepte abzurufen
    function fetchRecipes() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            success: function(response) {
                displayRecipes(response.recipes);
            },
            error: function(xhr) {
                console.error('Fehler beim Abrufen der Rezepte:', xhr);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        });
    }

    // Funktion, um Rezepte anzuzeigen
    function displayRecipes(recipes) {
        $('#recipe-list').empty();
        recipes.sort((a, b) => a.name.localeCompare(b.name));

        recipes.forEach(recipe => {
            const recipeItem = `<div class="recipe-item" data-id="${recipe.plan_id}">
                <input type="checkbox" class="select-recipe-checkbox">
                <span class="recipe-name">${recipe.name}</span>
            </div>`;
            $('#recipe-list').append(recipeItem);
        });

        $('.recipe-item').on('click', function() {
            const recipeId = $(this).data('id');
            window.location.href = `RecipeDetail.html?id=${recipeId}`;
        });
    }




