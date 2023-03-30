"use strict"

import DatabaseFactory from "../database.js";
import {ObjectId} from "mongodb";

/**
 * Geschäftslogik zur Verwaltung von Adressen. Diese Klasse implementiert die
 * eigentliche Anwendungslogik losgelöst vom technischen Übertragungsweg.
 * Die Adressen werden der Einfachheit halber in einer MongoDB abgelegt.
 */
export default class TeilnehmerService {
    /**
     * Konstruktor.
     */
    constructor() {
        this._teilnehmer = DatabaseFactory.database.collection("teilnehmer");
    }

    /**
     * Adressen suchen. Unterstützt wird lediglich eine ganz einfache Suche,
     * bei der einzelne Felder auf exakte Übereinstimmung geprüft werden.
     * Zwar unterstützt MongoDB prinzipiell beliebig komplexe Suchanfragen.
     * Um das Beispiel klein zu halten, wird dies hier aber nicht unterstützt.
     *
     * @param {Object} query Optionale Suchparameter
     * @return {Promise} Liste der gefundenen Adressen
     */
    async search(query) {
        let cursor = this._teilnehmer.find(query, {
            sort: {
                first_name: 1,
                last_name: 1,
            }
        });

        return cursor.toArray();
    }

    /**
     * Speichern einer neuen Adresse.
     *
     * @param {Object} teilnehmer Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten
     */
    async create(teilnehmer) {
        teilnehmer = teilnehmer || {};

        let newTeilnehmer = {
            first_name: teilnehmer.first_name || "",
            last_name:  teilnehmer.last_name  || "",
            mitgliedsnummer:      teilnehmer.mitgliedsnummer      || "",
        };

        let result = await this._teilnehmer.insertOne(newTeilnehmer);
        return await this._teilnehmer.findOne({_id: result.insertedId});
    }

    /**
     * Auslesen einer vorhandenen Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Gefundene Adressdaten
     */
    async read(id) {
        let result = await this._teilnehmer.findOne({_id: new ObjectId(id)});
        return result;
    }

    /**
     * Aktualisierung einer Adresse, durch Überschreiben einzelner Felder
     * oder des gesamten Adressobjekts (ohne die ID).
     *
     * @param {String} id ID der gesuchten Adresse
     * @param {[type]} address Zu speichernde Adressdaten
     * @return {Promise} Gespeicherte Adressdaten oder undefined
     */
    async update(id, teilnehmer) {
        let oldTeilnehmer = await this._teilnehmer.findOne({_id: new ObjectId(id)});
        if (!oldTeilnehmer) return;

        let updateDoc = {
            $set: {},
        }

        if (teilnehmer.first_name) updateDoc.$set.first_name = teilnehmer.first_name;
        if (teilnehmer.last_name)  updateDoc.$set.last_name  = teilnehmer.last_name;
        if (teilnehmer.mitgliedsnummer)      updateDoc.$set.mitgliedsnummer      = teilnehmer.mitgliedsnummer;
       
        await this._teilnehmer.updateOne({_id: new ObjectId(id)}, updateDoc);
        return this._teilnehmer.findOne({_id: new ObjectId(id)});
    }

    /**
     * Löschen einer Adresse anhand ihrer ID.
     *
     * @param {String} id ID der gesuchten Adresse
     * @return {Promise} Anzahl der gelöschten Datensätze
     */
    async delete(id) {
        let result = await this._teilnehmer.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount;
    }
}
