"use strict"

import { MongoClient } from "mongodb";

/**
 * Singleton-Klasse zum Zugriff auf das MongoDB-Datenbankobjekt, ohne dieses
 * ständig als Methodenparameter durchreichen zu müssen. Stattdessen kann
 * einfach das Singleton-Objekt dieser Klasse importiert und das Attribut
 * `mongodb` oder `database` ausgelesen werden.
 */
class DatabaseFactory {
    /**
     * Ersatz für den Konstruktor, damit aus dem Hauptprogramm heraus die
     * Verbindungs-URL der MongoDB übergeben werden kann. Hier wird dann
     * auch gleich die Verbindung hergestellt.
     *
     * @param {String} connectionUrl URL-String mit den Verbindungsdaten
     */
    async init(connectionUrl) {
        // Datenbankverbindung herstellen
        this.client = new MongoClient(connectionUrl);
        await this.client.connect();
        this.database = this.client.db("adressbook");

        await this._createDemoData();
    }

    /**
     * Hilfsmethode zum Anlegen von Demodaten. Würde man so in einer
     * Produktivanwendung natürlich nicht machen, aber so sehen wir
     * wenigstens gleich ein paar Daten.
     */
    async _createDemoData() {
        let teilnehmer = this.database.collection("teilnehmer");

        if (await teilnehmer.estimatedDocumentCount() === 0) {
            teilnehmer.insertMany([
                {
                    first_name: "Willy",
                    last_name: "Tanner",
                    mitgliedsnummer: "4121",
                },
                {
                    first_name: "Michael",
                    last_name: "Knight",
                    mitgliedsnummer: "4194",
                },
                {
                    first_name: "Fox",
                    last_name: "Mulder",
                    mitgliedsnummer: "3181",
                },
                {
                    first_name: "Dana",
                    last_name: "Scully",
                    mitgliedsnummer: "2287",
                },
                {
                    first_name: "Elwood",
                    last_name: "Blues",
                    mitgliedsnummer: "7338",
                },
            ]);
        }
    }
}

export default new DatabaseFactory();
