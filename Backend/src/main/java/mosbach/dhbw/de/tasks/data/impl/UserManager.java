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

public class UserManager implements UserIF {

    String fileName =  "UserData.properties";

    public void saveUser(List<UserConv> user){
        Properties properties = new Properties();

        int i = 1;
        for(UserConv u : user){
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

    public List<UserIF> readUser() {
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

}
