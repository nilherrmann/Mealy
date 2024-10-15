package mosbach.dhbw.de.tasks.data.impl;

import mosbach.dhbw.de.tasks.data.api.TaskManager;

public class LocalPostgresTest {

    public static void main(String[] args) {

        // TODO
        // Ignore the file, it is for testing the connection to the db locally
        // There are still issues with our setup.
        TaskManager taskManager = PostgresDBTaskManagerImpl.getTaskManagerImpl();
        taskManager.createTaskTable();

    }
}
