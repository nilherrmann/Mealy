package mosbach.dhbw.de.tasks.data.impl;

import mosbach.dhbw.de.tasks.model.MealplanConv;
import mosbach.dhbw.de.tasks.model.TimeConv;
import mosbach.dhbw.de.tasks.model.UserConv;

import java.io.*;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MealManager {

    private static MealManager mealManager = null;
    private final String mealplanFile = "mealplan.properties"; // Dateiname für die mealplan-Eigenschaften

    public static MealManager getMealManager() {
        if (mealManager == null) {
            mealManager = new MealManager();
        }
        return mealManager;
    }

    public List<MealplanConv> readAllMeals() {
        Properties properties = new Properties();
        List<MealplanConv> meals = new ArrayList<>();
        int i = 1;

        try (InputStream resourceStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(mealplanFile)) {
            if (resourceStream == null) {
                throw new FileNotFoundException("mealplan.properties file not found in the classpath.");
            }
            properties.load(resourceStream);

            while (properties.containsKey("Meal." + i + ".meal_id")) {
                int meal_id = Integer.parseInt(properties.getProperty("Meal." + i + ".meal_id"));
                String owner = properties.getProperty("Meal." + i + ".Owner");
                String day = properties.getProperty("Meal." + i + ".day");
                String time = properties.getProperty("Meal." + i + ".time");
                String ID = properties.getProperty("Meal." + i + ".ID");

                meals.add(new MealplanConv(meal_id, owner, day, time, ID));
                i++;
            }
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error loading mealplan properties file.");
        }

        return meals;
    }

    private int getNextmeal_id(List<MealplanConv> meals) {
        int maxId = 0;
        for (MealplanConv meal : meals) {
            if (meal.getMealId() > maxId) {
                maxId = meal.getMealId();
            }
        }
        return maxId + 1;
    }

    public void saveMeals(MealplanConv meal, UserConv User) {
        List<MealplanConv> allMeals = readAllMeals(); // Alle bestehenden Meals laden

        meal.setMealId(getNextmeal_id(allMeals)); // ID setzen
        meal.setOwner(User.getEmail()); // Owner setzen
        allMeals.add(meal);

        Properties properties = new Properties();
        int i = 1;

        for (MealplanConv m : allMeals) {
            properties.setProperty("Meal." + i + ".meal_id", String.valueOf(m.getMealId()));
            properties.setProperty("Meal." + i + ".Owner", m.getOwner());
            properties.setProperty("Meal." + i + ".day", m.getDay());
            properties.setProperty("Meal." + i + ".time", m.getTime());
            properties.setProperty("Meal." + i + ".ID", m.getId());
            i++;
        }

        try (FileOutputStream out = new FileOutputStream("src/main/resources/" + mealplanFile)) {
            properties.store(out, null);
            System.out.println("Mealplan saved successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<TimeConv> readTime(UserConv user) {
        Properties properties = new Properties();
        List<TimeConv> times = new ArrayList<>();

        try (InputStream resourceStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(mealplanFile)) {
            if (resourceStream == null) {
                throw new FileNotFoundException("mealplan.properties file not found in the classpath.");
            }
            properties.load(resourceStream);

            int i = 1;
            while (properties.containsKey("Meal." + i + ".meal_id")) {
                String owner = properties.getProperty("Meal." + i + ".Owner");
                System.out.println("Checking Meal entry with owner: " + owner);

                if (user.getEmail().equals(owner)) {
                    String day = properties.getProperty("Meal." + i + ".day");
                    String time = properties.getProperty("Meal." + i + ".time");
                    times.add(new TimeConv(day, time));
                    System.out.println("Added TimeConv for day: " + day + ", time: " + time);
                }
                i++;
            }

        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Error loading mealplan properties file.");
        }

        System.out.println("Total times added: " + times.size());
        return times;
    }
}
