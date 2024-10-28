package mosbach.dhbw.de.tasks.model;

import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "id",
        "name",
        "ingredients",
        "description"
})
public class RecipeConv {

    @JsonProperty("id")
    private int id; // Neue ID-Eigenschaft für jedes Rezept

    @JsonProperty("name")
    private String name;

    @JsonProperty("ingredients")
    private List<IngredientConv> ingredients = new ArrayList<>();

    @JsonProperty("description")
    private String description;

    // Konstruktoren, Getter und Setter
    public RecipeConv() {
    }

    public RecipeConv(int id, String name, List<IngredientConv> ingredients, String description) {
        this.id = id;
        this.name = name;
        this.ingredients = ingredients;
        this.description = description;
    }

    @JsonProperty("id")
    public int getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(int id) {
        this.id = id;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }

    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("ingredients")
    public List<IngredientConv> getIngredients() {
        return ingredients;
    }

    @JsonProperty("ingredients")
    public void setIngredients(List<IngredientConv> ingredients) {
        this.ingredients = ingredients;
    }

    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    @JsonProperty("description")
    public void setDescription(String description) {
        this.description = description;
    }
}

