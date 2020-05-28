/**
 * KeyValue model
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

const {_SqliteModel} = require('../../');


class KeyValue extends _SqliteModel {

    /**
     * Table class name
     * @type {string}
     */
    get CLASS_NAME() {
        return this.TABLE;
    }

    /**
     * Table name
     * @type {string}
     */
    get TABLE() {
        return 'keyvalue';
    }

    /**
     * Initialization
     * @return {Promise<void>}
     */
    async init() {
        super.init();
        await this.pdb.exec("CREATE TABLE IF NOT EXISTS `" + this.TABLE + "` (\n" +
            "\t`id`\tINTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\n" +
            "\t`key`\tTEXT NOT NULL UNIQUE,\n" +
            "\t`value`\tTEXT NOT NULL,\n" +
            "\t`created`\tINTEGER NOT NULL,\n" +
            "\t`modified`\tINTEGER NOT NULL\n" +
            ");");
    }

    /**
     * get row by key
     * @param key
     * @return {Promise<Record<string, any>>}
     */
    async getByKey(key) {
        const row = (await this.query(`SELECT id, key, value, created, modified FROM ${this.TABLE} WHERE key = ?`, [key]))[0];
        return row;
    }

    /**
     * get value by key
     * @param key
     * @return {Promise<any>}
     */
    async get(key, defaultValue) {
        const row = await this.getByKey(key);
        let res = defaultValue;
        if (row && row.value) {
            try {
                res = JSON.parse(row.value);
            } catch {
            }
        }
        return res;
    }

    /**
     * Creates new row or updates existed
     * @param {string} key
     * @param {any} value
     * @return {Promise<Record<string,any>>}
     */
    async put(key, value) {
        const now = +new Date();
        const rowId = await this.key(key);

        //save only in string format
        const curValue = JSON.stringify(value);

        // create new value or update if it is already exists
        if (rowId === null) {
            await this.query(`INSERT INTO ${this.TABLE} ('key', 'value','created', 'modified') VALUES(?,?,?,?)`, [key, curValue, now, now]);

        } else {
            await this.query(`UPDATE ${this.TABLE} SET value = ?, modified = ? WHERE id = ?`, [curValue, now, rowId]);
        }
        const newRow = await this.getByKey(key);
        return newRow;
    }

    /**
     * Return id by key
     * @param {string} key
     * @return {Promise<number | null>}
     */
    async key(key) {
        const row = await this.getByKey(key);
        return row ? row.id : null;
    }

    /**
     * delete row by key
     * @param {string} key
     * @return {Promise<boolean>}
     */
    async delete(key) {
        const rowId = await this.key(key);
        if (rowId !== null) {
            await this.query(`DELETE FROM ${this.TABLE} WHERE key = ?`, [key]);
            return true;
        } else {
            return false;
        }
    }

}

module.exports = KeyValue;