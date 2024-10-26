package mosbach.dhbw.de.tasks.data.impl;

import mosbach.dhbw.de.tasks.data.api.Task;
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

public class UserManager{

    private static UserManager userManager = null;
    String fileName =  "UserData.properties";

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

    public void saveUser(List<UserIF> user){
        Properties properties = new Properties();

        int i = 1;
        for(UserIF u : user){
            properties.setProperty("User." + i + ".Username", u.getUserName());
            properties.setProperty("User." + i + ".Email", u.getEmail());
            properties.setProperty("User." + i + ".Passwort", u.getPassword());
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

    public List<UserIF> readAllUser() {
        Properties properties = new Properties();
        List<UserIF> out = new ArrayList<>();
        int i = 1;

        try {
            ClassLoader loader = Thread.currentThread().getContextClassLoader();
            try (InputStream resourceStream = loader.getResourceAsStream(fileName)) {
                properties.load(resourceStream);
            }

            while (properties.containsKey("UserConv." + i + ".Username")) {
                String username = properties.getProperty("UserConv." + i + ".Username");
                String email = properties.getProperty("UserConv." + i + ".Email");
                String password = properties.getProperty("UserConv." + i + ".Password");

                // Füge ein UserConv-Objekt zur Liste hinzu
                out.add(new UserConv(username, email, password));
                i++;
            }
        } catch (IOException e) {
            Logger.getLogger("Reading Tasks").log(Level.INFO, "File not existing");
        }

        return out;
    }

    public boolean checkUser(UserConv user){
        Properties properties = new Properties();

        try {
            ClassLoader loader = Thread.currentThread().getContextClassLoader();
            try (InputStream resourceStream = loader.getResourceAsStream(fileName)) {
                properties.load(resourceStream);
            }
            String userName = user.getUserName();
            String password = user.getPassword();
            for (String key : properties.stringPropertyNames()) {
                // Prüfe nur Einträge im Format UserConv.<ID>.Username
                if (key.matches("UserConv\\.\\d+\\.Username")) {
                    String id = key.split("\\.")[1];
                    String storedUserName = properties.getProperty("UserConv." + id + ".Username");
                    String storedPassword = properties.getProperty("UserConv." + id + ".Passwort");

                    // Prüfen, ob Benutzername und Passwort übereinstimmen
                    if (userName.equals(storedUserName) && password.equals(storedPassword)) {
                        return true; // Gültige Kombination gefunden
                    }
                }
            }
        } catch (IOException e) {
            Logger.getLogger("Reading Tasks").log(Level.INFO, "File not existing");
        }
        return false; // Keine gültige Kombination gefunden
    }
}
