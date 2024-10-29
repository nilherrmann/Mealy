package mosbach.dhbw.de.tasks.data.impl;

import mosbach.dhbw.de.tasks.model.IngredientConv;
import mosbach.dhbw.de.tasks.model.RecipeConv;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

public class RecipeManager {

    private static RecipeManager recipeManager = null;
    private final String recipeData = "RecipeData.properties";

    // Privater Konstruktor für das Singleton-Pattern
    private RecipeManager() {}

    public static RecipeManager getRecipeManager() {
        if (recipeManager == null) {
            recipeManager = new RecipeManager();
        }
        return recipeManager;
    }

    // Methode zur Berechnung der nächsten ID
    private int getNextRecipeId(List<RecipeConv> recipes) {
        int maxId = 0;
        for (RecipeConv recipe : recipes) {
            if (recipe.getId() > maxId) {
                maxId = recipe.getId();
            }
        }
        return maxId + 1;
    }

    // Methode zum Speichern eines Rezepts
    public void saveRecipe(RecipeConv recipe) {
        List<RecipeConv> allRecipes = readAllRecipes(); // Alle bestehenden Rezepte laden

        // ID für das neue Rezept setzen
        recipe.setId(getNextRecipeId(allRecipes));
        allRecipes.add(recipe); // Neues Rezept am Ende hinzufügen

        Properties properties = new Properties();
        int recipeIndex = 1;

        // Alle Rezepte in den Properties speichern
        for (RecipeConv rec : allRecipes) {
            properties.setProperty("Recipe." + recipeIndex + ".ID", String.valueOf(rec.getId())); // ID speichern
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

        // Speichern der Properties in der Datei
        try (FileOutputStream writer = new FileOutputStream(recipeData)) {
            properties.store(writer, "Recipe Data");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Methode zum Laden aller Rezepte mit vollständigen Details (ID, Name, Zutaten, Beschreibung)
    public List<RecipeConv> readAllRecipes() {
        Properties properties = new Properties();
        List<RecipeConv> recipes = new ArrayList<>();

        try (FileInputStream reader = new FileInputStream(recipeData)) {
            properties.load(reader);

            int recipeIndex = 1;
            while (properties.containsKey("Recipe." + recipeIndex + ".ID")) { // Überprüfen auf die ID
                int id = Integer.parseInt(properties.getProperty("Recipe." + recipeIndex + ".ID"));
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

                recipes.add(new RecipeConv(id, name, ingredients, description)); // Rezept mit ID hinzufügen
                recipeIndex++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return recipes;
    }

    // Methode zum Laden von Rezept-IDs und Namen aus der Properties-Datei
    public Map<Integer, String> readRecipeNames() {
        Properties properties = new Properties();
        Map<Integer, String> recipes = new LinkedHashMap<>(); // Map für ID und Name

        try (FileInputStream reader = new FileInputStream(recipeData)) {
            properties.load(reader);

            int recipeIndex = 1;
            while (properties.containsKey("Recipe." + recipeIndex + ".ID")) {
                // ID und Name aus den Properties laden
                int id = Integer.parseInt(properties.getProperty("Recipe." + recipeIndex + ".ID"));
                String name = properties.getProperty("Recipe." + recipeIndex + ".Name");

                // ID und Name zur Map hinzufügen
                recipes.put(id, name);
                recipeIndex++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return recipes;
    }
}

