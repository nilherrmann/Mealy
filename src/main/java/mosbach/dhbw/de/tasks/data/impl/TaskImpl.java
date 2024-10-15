package mosbach.dhbw.de.tasks.data.impl;

import com.fasterxml.jackson.annotation.JsonProperty;
import mosbach.dhbw.de.tasks.data.api.Task;

public class TaskImpl implements Task {

    private String module;
    private Double grade;
    private Integer dateAsNumber;
    private String studentId;

    public TaskImpl(String module, Double grade, Integer dateAsNumber, String studentId) {
        this.module = module;
        this.grade = grade;
        this.dateAsNumber = dateAsNumber;
        this.studentId = studentId;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public Double getGrade() {
        return grade;
    }

    public void setGrade(Double grade) {
        this.grade = grade;
    }

    public Integer getDateAsNumber() {
        return dateAsNumber;
    }

    public void setDateAsNumber(Integer dateAsNumber) {
        this.dateAsNumber = dateAsNumber;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }
}
