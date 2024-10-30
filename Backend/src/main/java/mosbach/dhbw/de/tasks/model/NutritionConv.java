package mosbach.dhbw.de.tasks.model;

import java.util.LinkedHashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "Calories_(kcal)",
        "Total_Fat_(g)",
        "Saturated_Fat_(g)",
        "Cholesterol_(mg)",
        "Sodium_(mg)",
        "Total_Carbohydrates_(g)",
        "Dietary_Fiber_(g)",
        "Sugars_(g)",
        "Protein_(g)"
})
public class NutritionConv {

    @JsonProperty("Calories_(kcal)")
    private double caloriesKcal;

    @JsonProperty("Total_Fat_(g)")
    private double totalFatG;

    @JsonProperty("Saturated_Fat_(g)")
    private double saturatedFatG;

    @JsonProperty("Cholesterol_(mg)")
    private double cholesterolMg;

    @JsonProperty("Sodium_(mg)")
    private double sodiumMg;

    @JsonProperty("Total_Carbohydrates_(g)")
    private double totalCarbohydratesG;

    @JsonProperty("Dietary_Fiber_(g)")
    private double dietaryFiberG;

    @JsonProperty("Sugars_(g)")
    private double sugarsG;

    @JsonProperty("Protein_(g)")
    private double proteinG;

    @JsonIgnore
    private Map<String, Object> additionalProperties = new LinkedHashMap<>();

    // No-args constructor for use in serialization
    public NutritionConv() {
    }

    // All-args constructor
    public NutritionConv(double caloriesKcal, double totalFatG, double saturatedFatG, double cholesterolMg, double sodiumMg,
                         double totalCarbohydratesG, double dietaryFiberG, double sugarsG, double proteinG) {
        this.caloriesKcal = caloriesKcal;
        this.totalFatG = totalFatG;
        this.saturatedFatG = saturatedFatG;
        this.cholesterolMg = cholesterolMg;
        this.sodiumMg = sodiumMg;
        this.totalCarbohydratesG = totalCarbohydratesG;
        this.dietaryFiberG = dietaryFiberG;
        this.sugarsG = sugarsG;
        this.proteinG = proteinG;
    }

    @JsonProperty("Calories_(kcal)")
    public double getCaloriesKcal() {
        return caloriesKcal;
    }

    @JsonProperty("Calories_(kcal)")
    public void setCaloriesKcal(double caloriesKcal) {
        this.caloriesKcal = caloriesKcal;
    }

    @JsonProperty("Total_Fat_(g)")
    public double getTotalFatG() {
        return totalFatG;
    }

    @JsonProperty("Total_Fat_(g)")
    public void setTotalFatG(double totalFatG) {
        this.totalFatG = totalFatG;
    }

    @JsonProperty("Saturated_Fat_(g)")
    public double getSaturatedFatG() {
        return saturatedFatG;
    }

    @JsonProperty("Saturated_Fat_(g)")
    public void setSaturatedFatG(double saturatedFatG) {
        this.saturatedFatG = saturatedFatG;
    }

    @JsonProperty("Cholesterol_(mg)")
    public double getCholesterolMg() {
        return cholesterolMg;
    }

    @JsonProperty("Cholesterol_(mg)")
    public void setCholesterolMg(double cholesterolMg) {
        this.cholesterolMg = cholesterolMg;
    }

    @JsonProperty("Sodium_(mg)")
    public double getSodiumMg() {
        return sodiumMg;
    }

    @JsonProperty("Sodium_(mg)")
    public void setSodiumMg(double sodiumMg) {
        this.sodiumMg = sodiumMg;
    }

    @JsonProperty("Total_Carbohydrates_(g)")
    public double getTotalCarbohydratesG() {
        return totalCarbohydratesG;
    }

    @JsonProperty("Total_Carbohydrates_(g)")
    public void setTotalCarbohydratesG(double totalCarbohydratesG) {
        this.totalCarbohydratesG = totalCarbohydratesG;
    }

    @JsonProperty("Dietary_Fiber_(g)")
    public double getDietaryFiberG() {
        return dietaryFiberG;
    }

    @JsonProperty("Dietary_Fiber_(g)")
    public void setDietaryFiberG(double dietaryFiberG) {
        this.dietaryFiberG = dietaryFiberG;
    }

    @JsonProperty("Sugars_(g)")
    public double getSugarsG() {
        return sugarsG;
    }

    @JsonProperty("Sugars_(g)")
    public void setSugarsG(double sugarsG) {
        this.sugarsG = sugarsG;
    }

    @JsonProperty("Protein_(g)")
    public double getProteinG() {
        return proteinG;
    }

    @JsonProperty("Protein_(g)")
    public void setProteinG(double proteinG) {
        this.proteinG = proteinG;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }
}
