package mosbach.dhbw.de.tasks.model;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class SortedTasks {

    @JsonProperty("sort-order")
    private String sortOrder;
    @JsonProperty("tasks")
    private List<Task> tasks;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new LinkedHashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     *
     */
    public SortedTasks() {
    }

    /**
     *
     * @param sortOrder
     * @param tasks
     */
    public SortedTasks(String sortOrder, List<Task> tasks) {
        super();
        this.sortOrder = sortOrder;
        this.tasks = tasks;
    }

    @JsonProperty("sort-order")
    public String getSortOrder() {
        return sortOrder;
    }

    @JsonProperty("sort-order")
    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    @JsonProperty("tasks")
    public List<Task> getTasks() {
        return tasks;
    }

    @JsonProperty("tasks")
    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
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
