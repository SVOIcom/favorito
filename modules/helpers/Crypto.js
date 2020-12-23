/**
 * Favorito Framework
 * Crypto helper
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */


const crypto = require('crypto');

const CIPER = 'aes-256-ctr';
const IV_LENGTH = 16; // For AES, this is always 16
const IV = crypto.randomBytes(IV_LENGTH); //Generate IV

module.exports = {
    /**
     * Generates SHA256 hash
     * @param data
     * @return {PromiseLike<ArrayBuffer>}
     */
    sha256: (data) => {
        return crypto.createHash('sha256').update(data).digest('hex');
    },

    /**
     * Generates MD5 hash
     * @param data
     * @return {PromiseLike<ArrayBuffer>}
     */
    md5: (data) => {
        return crypto.createHash('md5').update(data).digest('hex');
    },
    /**
     * Encrypts data
     * @param {string} data
     * @param {string} password
     * @param {Buffer} IVv
     * @return {string}
     */
    encrypt: (data, password, IVv = IV) => {
        let cipher = crypto.createCipheriv(CIPER, password, IVv);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    },

    /**
     * Decrypts data
     * @param {string} data
     * @param {string} password
     * @param {Buffer} IVv
     * @return {*}
     */
    decrypt: (data, password, IVv = IV) => {
        let decipher = crypto.createDecipheriv(CIPER, password, IVv);
        let dec = decipher.update(data, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
};