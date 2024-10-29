package mosbach.dhbw.de.tasks.data.impl;

import mosbach.dhbw.de.tasks.model.IngredientConv;
import mosbach.dhbw.de.tasks.model.RecipeConv;
import mosbach.dhbw.de.tasks.model.UserConv;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

public class RecipeManager {

    private static RecipeManager recipeManager = null;
    private final String recipeData = "RecipeData.properties";

    private RecipeManager() {}

    public static RecipeManager getRecipeManager() {
        if (recipeManager == null) {
            recipeManager = new RecipeManager();
        }
        return recipeManager;
    }

    private int getNextRecipeId(List<RecipeConv> recipes) {
        int maxId = 0;
        for (RecipeConv recipe : recipes) {
            if (recipe.getId() > maxId) {
                maxId = recipe.getId();
            }
        }
        return maxId + 1;
    }

    public void saveRecipe(RecipeConv recipe, UserConv User) {
        List<RecipeConv> allRecipes = readAllRecipes(); // Alle bestehenden Rezepte laden

        recipe.setId(getNextRecipeId(allRecipes));
        recipe.setOwner(User.getEmail()); // Owner-Email zum Rezept hinzufügen
        allRecipes.add(recipe);

        Properties properties = new Properties();
        int recipeIndex = 1;

        for (RecipeConv rec : allRecipes) {
            properties.setProperty("Recipe." + recipeIndex + ".ID", String.valueOf(rec.getId()));
            properties.setProperty("Recipe." + recipeIndex + ".Owner", rec.getOwner()); // Owner hinzufügen
            properties.setProperty("Recipe." + recipeIndex + ".Name", rec.getName());

            int ingredientIndex = 1;
            for (IngredientConv ingredient : rec.getIngredients()) {
                properties.setProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Name", ingredient.getName());
                properties.setProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Unit", ingredient.getUnit());
                properties.setProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Amount", ingredient.getAmount());
                ingredientIndex++;
            }
            properties.setProperty("Recipe." + recipeIndex + ".Description", rec.getDescription());
            recipeIndex++;
        }

        try (FileOutputStream writer = new FileOutputStream(recipeData)) {
            properties.store(writer, "Recipe Data");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<RecipeConv> readAllRecipes() {
        Properties properties = new Properties();
        List<RecipeConv> recipes = new ArrayList<>();

        try (FileInputStream reader = new FileInputStream(recipeData)) {
            properties.load(reader);

            int recipeIndex = 1;
            while (properties.containsKey("Recipe." + recipeIndex + ".ID")) {
                int id = Integer.parseInt(properties.getProperty("Recipe." + recipeIndex + ".ID"));
                String owner = properties.getProperty("Recipe." + recipeIndex + ".Owner");
                String name = properties.getProperty("Recipe." + recipeIndex + ".Name");
                String description = properties.getProperty("Recipe." + recipeIndex + ".Description");

                List<IngredientConv> ingredients = new ArrayList<>();
                int ingredientIndex = 1;
                while (properties.containsKey("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Name")) {
                    String ingredientName = properties.getProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Name");
                    String unit = properties.getProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Unit");
                    String amount = properties.getProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Amount");

                    ingredients.add(new IngredientConv(ingredientName, unit, amount));
                    ingredientIndex++;
                }

                RecipeConv recipe = new RecipeConv(id, name, ingredients, description);
                recipe.setOwner(owner); // Owner setzen
                recipes.add(recipe);
                recipeIndex++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return recipes;
    }

    public Map<Integer, String> readRecipeNames(UserConv user) {
        Properties properties = new Properties();
        Map<Integer, String> recipes = new LinkedHashMap<>();

        try (FileInputStream reader = new FileInputStream(recipeData)) {
            properties.load(reader);

            int recipeIndex = 1;
            while (properties.containsKey("Recipe." + recipeIndex + ".ID")) {
                String owner = properties.getProperty("Recipe." + recipeIndex + ".Owner");
                if (user.getEmail().equals(owner)) {
                    int id = Integer.parseInt(properties.getProperty("Recipe." + recipeIndex + ".ID"));
                    String name = properties.getProperty("Recipe." + recipeIndex + ".Name");
                    recipes.put(id, name);
                }
                recipeIndex++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return recipes;
    }

    public RecipeConv readRecipeById(int recipeId) {
        Properties properties = new Properties();

        try (FileInputStream reader = new FileInputStream(recipeData)) {
            properties.load(reader);

            int recipeIndex = 1;
            while (properties.containsKey("Recipe." + recipeIndex + ".ID")) {
                int id = Integer.parseInt(properties.getProperty("Recipe." + recipeIndex + ".ID"));
                if (id == recipeId) {
                    String owner = properties.getProperty("Recipe." + recipeIndex + ".Owner");
                    String name = properties.getProperty("Recipe." + recipeIndex + ".Name");
                    String description = properties.getProperty("Recipe." + recipeIndex + ".Description");

                    List<IngredientConv> ingredients = new ArrayList<>();
                    int ingredientIndex = 1;
                    while (properties.containsKey("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Name")) {
                        String ingredientName = properties.getProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Name");
                        String unit = properties.getProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Unit");
                        String amount = properties.getProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Amount");

                        ingredients.add(new IngredientConv(ingredientName, unit, amount));
                        ingredientIndex++;
                    }

                    RecipeConv recipe = new RecipeConv(id, name, ingredients, description);
                    return recipe; // ohne Owner zurückgeben
                }
                recipeIndex++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null; // falls kein Rezept mit dieser ID gefunden wird
    }
}
