package mosbach.dhbw.de.tasks.data.api;

import java.util.List;

public interface TaskManager {

    void addTask(Task task);
    List<Task> getAllTasks();

    void createTaskTable();

    // TODO deleteTask, getTaskById, ByName, ByDate, ..

}
