package mosbach.dhbw.de.tasks.data.impl;

import mosbach.dhbw.de.tasks.data.api.Task;
import mosbach.dhbw.de.tasks.data.api.TaskManager;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TaskManagerImpl implements TaskManager {

    private static TaskManagerImpl taskManagerImpl = null;
    String fileName =  "tasks.properties";

    private TaskManagerImpl() { }
    public static TaskManagerImpl getTaskManagerImpl() {
        if (taskManagerImpl == null) {
            taskManagerImpl = new TaskManagerImpl();
        }
        return taskManagerImpl;
    }

    @Override
    public void addTask(Task task) {
        List<Task> tasks = getAllTasks();
        tasks.add(task);
        setAllTasks(tasks);
    }

    @Override
    public List<Task> getAllTasks() {

        Properties properties = new Properties();
        List<Task> tempTasks = new ArrayList<>();
        int i = 1;

        try {

            ClassLoader loader = Thread.currentThread().getContextClassLoader();
            try(InputStream resourceStream = loader.getResourceAsStream(fileName)) {
                properties.load(resourceStream);
            }

            Logger
                    .getLogger("TaskManager")
                    .log(Level.INFO, "Loaded the file");

            while (properties.containsKey("Task." + i + ".Module")) {
                String module = properties.getProperty("Task." + i + ".Module");
                Double grade =  Double.parseDouble(properties.getProperty("Task." + i + ".Grade"));
                Integer dateAsNumber  = Integer.parseInt(properties.getProperty("Task." + i + ".DateAsNumber"));
                String studentId  = properties.getProperty("Task." + i + ".StudentId");

                Logger
                        .getLogger("TaskManager")
                        .log(Level.INFO, "Found a task");

                tempTasks.add(new TaskImpl(module, grade, dateAsNumber, studentId));
                i++;
            }
        } catch (IOException e) {
            Logger
                    .getLogger("Reading Tasks")
                    .log(Level.INFO, "File not exising");
        }

        return tempTasks;
    }

    @Override
    public void createTaskTable() {
    }

    public void setAllTasks(List<Task> tasks) {

        Properties properties = new Properties();

        int i = 1;
        for(Task t : tasks){
            properties.setProperty("Task." + i + ".Module", t.getModule());
            properties.setProperty("Task." + i + ".Grade", t.getGrade() + "");
            properties.setProperty("Task." + i + ".DateAsNumber", t.getDateAsNumber() + "");
            properties.setProperty("Task." + i + ".StudentId", t.getStudentId());
            i++;
        }

        try {
            properties.store(new FileOutputStream(fileName), null);
        } catch (IOException e) {
            Logger
                    .getLogger("Writing Tasks")
                    .log(Level.INFO, "File cannot be written");
        }
    }

}
