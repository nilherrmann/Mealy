package mosbach.dhbw.de.tasks.data.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import mosbach.dhbw.de.tasks.model.*;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class RecipeManager {

    private static RecipeManager recipeManager = null;
    private final String recipeData = "RecipeData.properties";

    // API-Konstanten für die Anfrage
    private static final String API_URL = "https://gustar-io-deutsche-rezepte.p.rapidapi.com/nutrition";
    private static final String API_KEY = "db917e920bmsh067c4d1236079dap146053jsn8f6624c6fa5d"; // hier API-Key einsetzen
    private static final String API_HOST = "gustar-io-deutsche-rezepte.p.rapidapi.com";

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

    public void saveRecipe(RecipeConv recipe, UserConv user) {
        List<RecipeConv> allRecipes = readAllRecipes(); // Alle bestehenden Rezepte laden

        recipe.setId(getNextRecipeId(allRecipes));
        recipe.setOwner(user.getEmail()); // Owner-Email zum Rezept hinzufügen
        allRecipes.add(recipe);

        Properties properties = new Properties();
        int recipeIndex = 1;

        for (RecipeConv rec : allRecipes) {
            properties.setProperty("Recipe." + recipeIndex + ".ID", String.valueOf(rec.getId()));
            properties.setProperty("Recipe." + recipeIndex + ".Owner", rec.getOwner());
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
            properties.store(writer, null);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String createIngredientsJson(RecipeConv recipe) {
        List<Map<String, Object>> ingredientList = new ArrayList<>();
        for (IngredientConv ingredient : recipe.getIngredients()) {
            Map<String, Object> ingredientMap = new HashMap<>();
            ingredientMap.put("name", ingredient.getName());
            ingredientMap.put("amount", ingredient.getAmount());
            ingredientMap.put("unit", "grams");
            ingredientList.add(ingredientMap);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("ingredients", ingredientList);
        payload.put("portions", 1);

        try {
            return new ObjectMapper().writeValueAsString(payload);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
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

    public List<Integer> readRecipeIDs(UserConv user) {
        Properties properties = new Properties();
        List<Integer> IDs = new ArrayList<>();

        try (FileInputStream reader = new FileInputStream(recipeData)) {
            properties.load(reader);

            int recipeIndex = 1;
            while (properties.containsKey("Recipe." + recipeIndex + ".ID")) {
                String owner = properties.getProperty("Recipe." + recipeIndex + ".Owner");
                if (user.getEmail().equals(owner)) {
                    int id = Integer.parseInt(properties.getProperty("Recipe." + recipeIndex + ".ID"));
                    IDs.add(id);
                }
                recipeIndex++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return IDs;
    }

    public List<String> readRecipeName(UserConv user) {
        Properties properties = new Properties();
        List<String> names = new ArrayList<>();

        try (FileInputStream reader = new FileInputStream(recipeData)) {
            properties.load(reader);

            int recipeIndex = 1;
            while (properties.containsKey("Recipe." + recipeIndex + ".ID")) {
                String owner = properties.getProperty("Recipe." + recipeIndex + ".Owner");
                if (user.getEmail().equals(owner)) {
                    String name = properties.getProperty("Recipe." + recipeIndex + ".Name");
                    names.add(name);
                }
                recipeIndex++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return names;
    }

    public List<String> readRecipeIngredientName(int id) {
        Properties properties = new Properties();
        List<String> names = new ArrayList<>();
        String ID = String.valueOf(id);

        try (FileInputStream reader = new FileInputStream(recipeData)) {
            properties.load(reader);

            int recipeIndex = 1;
            while (properties.containsKey("Recipe." + recipeIndex + ".ID")) {
                String Id = properties.getProperty("Recipe." + recipeIndex + ".ID");
                if (ID.equals(Id)) {
                    int ingredientIndex = 1;
                    while (properties.containsKey("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Name")) {
                        String ingredientName = properties.getProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Name");


                        names.add(ingredientName);
                        ingredientIndex++;
                    }
                }
                recipeIndex++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return names;
    }

    public List<Double> readRecipeIngredientAmount(int id) {
        Properties properties = new Properties();
        List<Double> mass = new ArrayList<>();
        String ID = String.valueOf(id);

        try (FileInputStream reader = new FileInputStream(recipeData)) {
            properties.load(reader);

            int recipeIndex = 1;
            while (properties.containsKey("Recipe." + recipeIndex + ".ID")) {
                String Id = properties.getProperty("Recipe." + recipeIndex + ".ID");
                if (ID.equals(Id)) {
                    int ingredientIndex = 1;
                    while (properties.containsKey("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Name")) {
                        Double ingredientamount = Double.parseDouble(properties.getProperty("Recipe." + recipeIndex + ".Ingredient." + ingredientIndex + ".Amount"));


                        mass.add(ingredientamount);
                        ingredientIndex++;
                    }
                }
                recipeIndex++;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return mass;
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

    public String generateIngredientString(List<String> names, List<Double> amounts) {
        // Überprüfung, dass beide Listen die gleiche Länge haben
        if (names.size() != amounts.size()) {
            throw new IllegalArgumentException("Beide Listen müssen die gleiche Länge haben.");
        }

        // StringBuilder zum effizienten Bauen des Strings
        StringBuilder jsonBuilder = new StringBuilder();
        jsonBuilder.append("{\"ingredients\":[");

        // Schleife über alle Einträge in den Listen und erstellen der JSON-Objekte
        for (int i = 0; i < names.size(); i++) {
            jsonBuilder.append("{")
                    .append("\"name\":\"").append(names.get(i)).append("\",")
                    .append("\"amount\":").append(amounts.get(i)).append(",")
                    .append("\"unit\":\"grams\"")
                    .append("}");

            // Komma hinzufügen, außer beim letzten Eintrag
            if (i < names.size() - 1) {
                jsonBuilder.append(",");
            }
        }

        // JSON-String abschließen und Portionsangabe hinzufügen
        jsonBuilder.append("],\"portions\":4}");

        return jsonBuilder.toString();
    }

    public NutritionConv sendNutritionRequest(String ingredientsJson) {
        try {
            URL url = new URL(API_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("x-rapidapi-key", API_KEY);
            connection.setRequestProperty("x-rapidapi-host", API_HOST);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            // JSON-Daten senden
            try (DataOutputStream outputStream = new DataOutputStream(connection.getOutputStream())) {
                outputStream.writeBytes(ingredientsJson);
                outputStream.flush();
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = in.readLine()) != null) {
                        response.append(line);
                    }

                    ObjectMapper objectMapper = new ObjectMapper();
                    return objectMapper.readValue(response.toString(), NutritionConv.class);
                }
            } else {
                Logger.getLogger(RecipeManager.class.getName()).log(Level.SEVERE, "Fehlerhafte API-Antwort: Code " + responseCode);
                return null;
            }
        } catch (IOException e) {
            Logger.getLogger(RecipeManager.class.getName()).log(Level.SEVERE, "Verbindungsfehler zur Nährwert-API", e);
            return null;
        }
    }



}
