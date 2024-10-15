
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
public class Task {

    @JsonProperty("module")
    private String module;
    @JsonProperty("grade")
    private Double grade;
    @JsonProperty("date-as-number")
    private Integer dateAsNumber;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new LinkedHashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public Task() {
    }

    /**
     * 
     * @param dateAsNumber
     * @param module
     * @param grade
     */
    public Task(String module, Double grade, Integer dateAsNumber) {
        super();
        this.module = module;
        this.grade = grade;
        this.dateAsNumber = dateAsNumber;
    }

    @JsonProperty("module")
    public String getModule() {
        return module;
    }

    @JsonProperty("module")
    public void setModule(String module) {
        this.module = module;
    }

    @JsonProperty("grade")
    public Double getGrade() {
        return grade;
    }

    @JsonProperty("grade")
    public void setGrade(Double grade) {
        this.grade = grade;
    }

    @JsonProperty("date-as-number")
    public Integer getDateAsNumber() {
        return dateAsNumber;
    }

    @JsonProperty("date-as-number")
    public void setDateAsNumber(Integer dateAsNumber) {
        this.dateAsNumber = dateAsNumber;
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
