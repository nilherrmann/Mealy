package mosbach.dhbw.de.tasks.data.impl;

import mosbach.dhbw.de.tasks.data.api.UserIF;
import mosbach.dhbw.de.tasks.model.UserConv;
import mosbach.dhbw.de.tasks.data.basis.User;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UserManager {

    private static UserManager userManager = null;
    String fileName = "UserData.properties";

    public static UserManager getUserManager() {
        if (userManager == null) {
            userManager = new UserManager();
        }
        return userManager;
    }

    public void addUser(UserIF user) {
        List<UserIF> users = readAllUser();
        users.add(user);
        saveUser(users);
    }

    public void saveUser(List<UserIF> users) {
        Properties properties = new Properties();
        int i = 1;

        for (UserIF user : users) {
            properties.setProperty("User." + i + ".Username", user.getUserName());
            properties.setProperty("User." + i + ".Email", user.getEmail());
            properties.setProperty("User." + i + ".Passwort", user.getPassword());
            i++;
        }

        try (FileOutputStream out = new FileOutputStream(fileName)) {
            properties.store(out, null);
        } catch (IOException e) {
            Logger.getLogger("Writing Tasks")
                    .log(Level.INFO, "File cannot be written", e);
        }
    }

    public List<UserIF> readAllUser() {
        Properties properties = new Properties();
        List<UserIF> users = new ArrayList<>();
        int i = 1;

        try (InputStream resourceStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(fileName)) {
            properties.load(resourceStream);

            while (properties.containsKey("User." + i + ".Username")) {
                String username = properties.getProperty("User." + i + ".Username");
                String email = properties.getProperty("User." + i + ".Email");
                String password = properties.getProperty("User." + i + ".Passwort");

                // Füge ein UserConv-Objekt zur Liste hinzu
                users.add(new UserConv(username, email, password));
                i++;
            }
        } catch (IOException e) {
            Logger.getLogger("Reading Tasks")
                    .log(Level.INFO, "File not existing", e);
        }

        return users;
    }

    public boolean checkUser(UserConv user) {
        Properties properties = new Properties();

        try (InputStream resourceStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(fileName)) {
            properties.load(resourceStream);
            String userName = user.getUserName();
            String password = user.getPassword();

            for (String key : properties.stringPropertyNames()) {
                // Prüfe nur Einträge im Format User.<ID>.Username
                if (key.matches("User\\.\\d+\\.Username")) {
                    String id = key.split("\\.")[1];
                    String storedUserName = properties.getProperty("User." + id + ".Username");
                    String storedPassword = properties.getProperty("User." + id + ".Passwort");

                    // Prüfen, ob Benutzername und Passwort übereinstimmen
                    if (userName.equals(storedUserName) && password.equals(storedPassword)) {
                        return true; // Gültige Kombination gefunden
                    }
                }
            }
        } catch (IOException e) {
            Logger.getLogger("Reading Tasks")
                    .log(Level.INFO, "File not existing", e);
        }

        return false; // Keine gültige Kombination gefunden
    }
}

