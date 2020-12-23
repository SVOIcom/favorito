/**
 * Favorito Framework
 * Session controller
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

const SESSION_COOKIE_NAME = 'session';
const SESSION_TIMEOUT = 900000; //15 minutes

const {decrypt, encrypt, md5} = require('./Crypto');

class Session {
    constructor(req, res, favoritoApp, config = {}) {
        this.favoritoApp = favoritoApp;
        this.config = config;

        //Express vars
        this.express = {req, res};

        //Session data
        this.sessionData = {};

        this.sessionData._sessionUpdated = false;

        this.IV = Buffer.from(this.CIPER_SECRET, 'hex');
    }

    /**
     * Returns password
     * @return {string}
     */
    get CIPER_SECRET() {
        if(this.config.secret) {
            return this.config.secret;
        }

        return 'NO_CIPER_SECRET_PLEASE_SET_SECRET';
    }

    /**
     * Gets session cookie name
     * @return {string|*}
     * @constructor
     */
    get SESSION_COOKIE_NAME() {
        if(this.config.sessionCookieName) {
            return this.config.sessionCookieName;
        }

        return SESSION_COOKIE_NAME;
    }

    /**
     * Gets session timeout
     * @return {number|*}
     * @constructor
     */
    get SESSION_TIMEOUT() {
        if(this.config.sessionTimeout) {
            return this.config.sessionTimeout;
        }

        return SESSION_TIMEOUT;
    }

    /**
     * Load and parse session string
     * @return {Promise<Session>}
     */
    async load() {
        try {
            this.sessionData = JSON.parse(decrypt(this.express.req.cookies[this.SESSION_COOKIE_NAME], md5(this.CIPER_SECRET), this.IV));
        } catch (e) {
        }
        return this;
    }

    /**
     * Read key from session
     * @param {string} key
     * @param {string|number|array|boolean} defaultValue
     * @return {Promise<string|number|array|boolean>}
     */
    async read(key, defaultValue = false) {
        if(typeof this.sessionData[key] === 'undefined') {
            return defaultValue;
        }

        return this.sessionData[key];
    }

    /**
     * Write data to session ONLY SERIALIZABLE VALUES
     * @param {string} key
     * @param {string|array|number|boolean} value
     * @return {Promise<void>}
     */
    async write(key, value) {
        this.sessionData[key] = value;
        await this.updateSession();
    }

    /**
     * Get data by key or get all storage
     * @param key
     * @return {Promise<{}|string|number|Array|boolean>}
     */
    async get(key) {
        if(typeof key !== "undefined") {
            return await this.read(key)
        }

        return this.sessionData;
    }

    /**
     * Gets is active session
     * @return {Promise<boolean>}
     */
    async isActive() {
        if(!this.sessionData._sessionUpdated) {
            return false;
        }

        return (+new Date() - this.sessionData._sessionUpdated) <= this.SESSION_TIMEOUT;
    }

    /**
     * Update session cookie
     * @return {Promise<void>}
     */
    async updateSession() {
        this.sessionData._sessionUpdated = +new Date();
        try {
            this.express.res.cookie(this.SESSION_COOKIE_NAME, encrypt(JSON.stringify(this.sessionData), md5(this.CIPER_SECRET), this.IV));
        } catch (e) {
        }
    }

    /**
     * Clears session
     * @return {Promise<void>}
     */
    async clear() {
        this.sessionData = {};
        try {
            this.express.res.cookie(this.SESSION_COOKIE_NAME, encrypt(JSON.stringify(this.sessionData), md5(this.CIPER_SECRET), this.IV));
        } catch (e) {
        }
    }


}


module.exports = Session;