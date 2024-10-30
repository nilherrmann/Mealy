package mosbach.dhbw.de.tasks.data.impl;

import mosbach.dhbw.de.tasks.data.api.UserIF;
import mosbach.dhbw.de.tasks.model.TokenConv;
import mosbach.dhbw.de.tasks.model.UserConv;
import mosbach.dhbw.de.tasks.data.basis.User;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UserManager {

    private static UserManager userManager = null;
    String userdata = "UserData.properties";
    String tokendata = "token.properties";

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

        try (FileOutputStream out = new FileOutputStream(userdata)) {
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
                .getResourceAsStream(userdata)) {
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
            e.printStackTrace();
        }

        return users;
    }

    public boolean checkUser(UserConv user) {
        Properties properties = new Properties();

        try (InputStream resourceStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(userdata)) {
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
            e.printStackTrace();
        }

        return false; // Keine gültige Kombination gefunden
    }

    public List<TokenConv> readAllToken() {
        Properties properties = new Properties();
        List<TokenConv> tokens = new ArrayList<>();
        int i = 1;

        try (InputStream resourceStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(tokendata)) {
            properties.load(resourceStream);

            while (properties.containsKey("Auth." + i + ".Email")) {
                String username = properties.getProperty("Auth." + i + ".Email");
                String email = properties.getProperty("Auth." + i + ".Token");

                i++;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return tokens;
    }


    public void createToken (User u){
        Properties properties = new Properties();
        Random r = new Random();

        long token = r.nextLong(999999999);
        String Token = Long.toString(token);
        TokenConv t = new TokenConv(u.getEmail(),Token);
        List<TokenConv> tokens = readAllToken();
        tokens.add(t);

        int i = 1;

        for (TokenConv ToKeN : tokens) {
            properties.setProperty("Auth." + i + ".Email", t.getEmail());
            properties.setProperty("Auth." + i + ".Token", t.getToken());
            i++;
        }

        try (FileOutputStream out = new FileOutputStream(tokendata)) {
            properties.store(out, null);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public boolean checkToken(TokenConv token) {
        Properties properties = new Properties();

        try (InputStream resourceStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(tokendata)) {
            properties.load(resourceStream);
            String Token = token.getToken();

            for (String key : properties.stringPropertyNames()) {

                if (key.matches("Auth\\.\\d+\\.Token")) {
                    String id = key.split("\\.")[1];
                    String storedToken = properties.getProperty("Auth." + id + ".Token");


                    if (Token.equals(storedToken)){
                        return true;
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return false;
    }

    public UserConv TokenToUser(String token) {
        Properties properties = new Properties();
        try (InputStream resourceStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(tokendata)) {
            properties.load(resourceStream);

            for (String key : properties.stringPropertyNames()) {
                if (key.matches("Auth\\.\\d+\\.Token")) {
                    String id = key.split("\\.")[1];
                    String storedToken = properties.getProperty("Auth." + id + ".Token");
                    if (token.equals(storedToken)) {
                        String storedEmail = properties.getProperty("Auth." + id + ".Email");
                        return searchUserByEmail(storedEmail);  // E-Mail des Besitzers abrufen
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;  // Bei ungültigem Token zurückgeben
    }

    public UserConv searchUserByEmail(String email) {
        Properties properties = new Properties();

        try (InputStream resourceStream = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(userdata)) {
            properties.load(resourceStream);

            for (String key : properties.stringPropertyNames()) {
                if (key.matches("User\\.\\d+\\.Email")) {
                    String id = key.split("\\.")[1];
                    String storedEmail = properties.getProperty("User." + id + ".Email");

                    // Prüfen, ob die E-Mail übereinstimmt
                    if (storedEmail != null && storedEmail.equals(email)) {
                        String storedUser = properties.getProperty("User." + id + ".Username");
                        String storedPasswort = properties.getProperty("User." + id + ".Passwort");

                        return new UserConv(storedUser, storedEmail, storedPasswort);
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Rückgabe, falls kein Benutzer mit der angegebenen E-Mail gefunden wurde
        return new UserConv("User", "not", "found");
    }


}

