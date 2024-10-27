$(document).ready(function() {
    const apiUrl = 'https://MealyBackend-fearless-bushbuck-kc.apps.01.cf.eu01.stackit.cloud/api/recipe'; // Replace with your actual API URL
    const token = localStorage.getItem('authToken'); // Get the token from localStorage

    if (!token) {
        alert('Bitte melde dich zuerst an.');
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    // Fetch recipes when the page loads
    fetchRecipes();

    // Event listener for adding a new recipe
    $('#add-recipe-btn').on('click', function() {
        window.location.href = 'RecipeCreate.html'; // Redirect to the recipe creation page
    });

    // Function to fetch recipes
    function fetchRecipes() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }, // Assuming your API uses Bearer token authentication
            success: function(response) {
                const recipes = response.recipes; // Assuming the response has a 'recipes' array
                displayRecipes(recipes);
            },
            error: function(xhr) {
                console.error('Fehler beim Abrufen der Rezepte:', xhr);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        });
    }

    // Function to display recipes
    function displayRecipes(recipes) {
        recipes.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
        $('#recipe-list').empty(); // Clear the recipe list

        recipes.forEach(recipe => {
            const recipeItem = `<div class="recipe-item" data-id="${recipe.plan_id}">
                <span>${recipe.name}</span>
                <button class="view-recipe-btn">Anzeigen</button>
            </div>`;
            $('#recipe-list').append(recipeItem);
        });

        // Add event listener for view buttons
        $('.view-recipe-btn').on('click', function() {
            const recipeId = $(this).closest('.recipe-item').data('id');
            viewRecipeDetails(recipeId);
        });
    }

    // Function to view recipe details
    function viewRecipeDetails(recipeId) {
        $.ajax({
            url: `${apiUrl}/${recipeId}`,
            type: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
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

    // Event listener for closing the modal
    $('#recipe-modal .close-btn').on('click', function() {
        $('#recipe-modal').hide();
    });

    // Event listener for deleting a recipe
    $('#delete-recipe-btn').on('click', function() {
        const recipeId = $('#modal-recipe-name').data('id');
        $.ajax({
            url: `${apiUrl}/${recipeId}`,
            type: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
            success: function() {
                alert('Rezept erfolgreich gelöscht!');
                $('#recipe-modal').hide();
                fetchRecipes(); // Refresh the recipe list
            },
            error: function(xhr) {
                console.error('Fehler beim Löschen des Rezepts:', xhr);
                alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
            }
        });
    });
});
