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
                <span>${recipe.name}</span>
                <button class="view-recipe-btn">Anzeigen</button>
            </div>`;
            $('#recipe-list').append(recipeItem);
        });

        $('.view-recipe-btn').on('click', function() {
            const recipeId = $(this).closest('.recipe-item').data('id');
            viewRecipeDetails(recipeId);
        });
    }

    // Funktion, um Rezeptdetails anzuzeigen
    function viewRecipeDetails(recipeId) {
        $.ajax({
            url: `${apiUrl}/${recipeId}`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            success: function(recipe) {
                $('#modal-recipe-name').text(recipe.name);
                $('#modal-recipe-description').text(recipe.description);
                $('#modal-ingredient-list').empty();
                recipe.ingredients.forEach(ingredient => {
                    $('#modal-ingredient-list').append(`<li>${ingredient.name} (${ingredient.amount} ${ingredient.unit})</li>`);
                });
                $('#recipe-modal').show();
            },
            error: function(xhr) {
                console.error('Fehler beim Abrufen des Rezepts:', xhr);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        });
    }

    $('#recipe-modal .close-btn').on('click', function() {
        $('#recipe-modal').hide();
    });

    $('#delete-recipe-btn').on('click', function() {
        const recipeId = $('#modal-recipe-name').data('id');
        $.ajax({
            url: `${apiUrl}/${recipeId}`,
            type: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            success: function() {
                alert('Rezept erfolgreich gelöscht!');
                $('#recipe-modal').hide();
                fetchRecipes();
            },
            error: function(xhr) {
                console.error('Fehler beim Löschen des Rezepts:', xhr);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        });
    });

    // Funktion, um ausgewählte Rezepte einem Ordner hinzuzufügen
    $('#add-to-folder-btn').on('click', function() {
        const selectedRecipes = [];
        $('.select-recipe-checkbox:checked').each(function() {
            const recipeId = $(this).closest('.recipe-item').data('id');
            selectedRecipes.push(recipeId);
        });

        const folderTitle = prompt('Bitte gib eine Überschrift für den Ordner an:');
        if (!folderTitle) {
            alert('Überschrift ist erforderlich.');
            return;
        }

        addToFolder(selectedRecipes, folderTitle);
    });

    // Funktion zur Speicherung von Rezepten in einem Ordner
    function addToFolder(recipeIds, folderTitle) {
        $.ajax({
            url: `${apiUrl}/folder`,
            type: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            contentType: 'application/json',
            data: JSON.stringify({
                title: folderTitle,
                recipes: recipeIds
            }),
            success: function() {
                alert(`Rezepte wurden erfolgreich in den Ordner "${folderTitle}" gespeichert.`);
            },
            error: function(xhr) {
                console.error('Fehler beim Hinzufügen zum Ordner:', xhr);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        });
    }
});
