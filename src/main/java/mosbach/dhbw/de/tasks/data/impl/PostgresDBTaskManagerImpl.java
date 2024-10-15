package mosbach.dhbw.de.tasks.data.impl;

import mosbach.dhbw.de.tasks.data.api.Task;
import mosbach.dhbw.de.tasks.data.api.TaskManager;
import org.apache.commons.dbcp.BasicDataSource;
import org.hibernate.Session;

import java.net.URI;
import java.net.URISyntaxException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class PostgresDBTaskManagerImpl implements TaskManager {

    String databaseConnectionnUrl = "postgresql://mhartwig:WRONG@dda9630d-af85-4f1f-9e98-c779f92f682f.postgresql.eu01.onstackit.cloud:5432/stackit";
    URI dbUri;
    String username = "";
    String password = "";
    String dbUrl = "";
    // BasicDataSource basicDataSource;


    // Singleton
    static PostgresDBTaskManagerImpl postgresDBTaskManager = null;
    private PostgresDBTaskManagerImpl() {
        // basicDataSource = new BasicDataSource();
        // basicDataSource.setUrl(databaseURL);
        // basicDataSource.setUsername(username);
        // basicDataSource.setPassword(password);
        try {
            dbUri = new URI(databaseConnectionnUrl);
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
        username = dbUri.getUserInfo().split(":")[0];
        password = dbUri.getUserInfo().split(":")[1];
        dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath() + "?sslmode=require";
    }
    public static PostgresDBTaskManagerImpl getTaskManagerImpl() {
        if (postgresDBTaskManager == null)
            postgresDBTaskManager = new PostgresDBTaskManagerImpl();
        return postgresDBTaskManager;
    }

    public void createTaskTable() {

        // Be carefull: It deletes data if table already exists.
        Statement stmt = null;
        Connection connection = null;

        try {
            connection = DriverManager.getConnection(dbUrl, username, password);
            stmt = connection.createStatement();
            String dropTable = "DROP TABLE IF EXISTS group24tasks";
            stmt.executeUpdate(dropTable);

            String createTable = "CREATE TABLE group24tasks (" +
                    "id SERIAL PRIMARY KEY, " +
                    "name varchar(100) NOT NULL, " +
                    "priority int NOT NULL)";

            stmt.executeUpdate(createTable);
            stmt.close();
            connection.close();

        } catch (Exception e) {
            // TODO: Add a proper printout of the error
            e.printStackTrace();
        }
    }

    public List<Task> getAllTasks() {

        final Logger readTaskLogger = Logger.getLogger("ReadTaskLogger");
        readTaskLogger.log(Level.INFO,"Start reading tasks ");

        List<Task> tasks = new ArrayList<>();
        Statement stmt = null;
        Connection connection = null;

        try {
            connection = DriverManager.getConnection(dbUrl, username, password);
            stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT * FROM group24tasks");

            while (rs.next()) {
                tasks.add(
                        new TaskImpl(
                                rs.getString("module"),
                                Double.parseDouble(rs.getString("grade")),
                                Integer.parseInt(rs.getString("dateasnumber")),
                                rs.getString("studentid")
                                )
                );
            }
            stmt.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return
                tasks;
    }


    @Override
    public void addTask(Task task) {

        final Logger createTaskLogger = Logger.getLogger("CreateTaskLogger");
        createTaskLogger.log(Level.INFO,"Start creating task " + task.getModule());

        Statement stmt = null;
        Connection connection = null;

        try {
            connection = DriverManager.getConnection(dbUrl, username, password);
            stmt = connection.createStatement();
            String udapteSQL = "INSERT into group24tasks (module, grade, dateasnumber, studentid) VALUES (" +
                    "'" + task.getModule() + "', " +
                    "'" + task.getGrade() + "', " +
                    "'" + task.getDateAsNumber() + "', " +
                    "'" + task.getStudentId() + "')";

            stmt.executeUpdate(udapteSQL);     // Nicht ganz nach Vorschrift, synchron.

            stmt.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}
