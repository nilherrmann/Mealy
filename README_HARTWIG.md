Diese Readme wurde nach der Abgabe Erstellt und dient lediglich zur Inforamtion für M.H.

StackIT applications wurden zum sparen von Ressourcen gestoppt.

Standard Login Daten: 
Username: Max
Passwort: 123

Bekannte Fehler in dieser Version:
Recipe.js --> Lösung: Fehlende Klammer zwischen Zeile 74 und 75
AccountErstellen.js --> Flsche Reihenfolge der gesendeten Daten führt zu Fehler in Backend --> Richtige Reihenfolge:
{
  "userName": "Test",
  "email": "test@example.com",
  "password": "password123"
}
