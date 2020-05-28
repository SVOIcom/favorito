/**
 * Favorito Framework
 * Model abstract
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

/**
 * @abstract
 */
class _sqliteModel {

    /**
     * Table class name
     * @type {string}
     */
    get CLASS_NAME() {
        return '_model'
    }

    /**
     * Table name
     * @type {string}
     */
    get TABLE() {
        return '_invalid'
    }

    /**
     * Model type
     * @return {string}
     * @constructor
     */
    get TYPE(){
        return 'sqlite3';
    }

    /**
     * Model constructor
     * @param {sqlite3} permamentDb Permament database
     * @param {object} config Configure obj
     * @param {Database} parent Database object
     */
    constructor(permamentDb,  config = {}, parent = undefined) {
        this.pdb = permamentDb;
        this.mainDB = this.pdb;
        this.config = config;
        this.parent = parent;
    }

    /**
     * Model init
     */
    async init() {

    }

    /**
     * Change database
     * @param {object} databaseObject
     */
    use(databaseObject) {
        this.mainDB = databaseObject;
    }

    /**
     * Generate random id
     * @return {string}
     */
    getid() {
        return (Math.random() * (new Date().getTime())).toString(36).replace(/[^a-z]+/g, '');
    }

    /**
     * Get element from table
     * @param {number} id
     * @param {string} msg Exception message
     * @return {Promise<*>}
     */
    async get(id, msg = `id ${id} not found in ${this.TABLE}`) {
        let rows = (await this.query(`SELECT * FROM ${this.TABLE} WHERE id = ?`, [id]))[0];
        if(!rows) {
            throw this.notFoundException(msg);
        }
        return rows;
    }

    /**
     * All records
     * @return {Promise<Array|Object>}
     */
    async all() {
        return await this.query(`SELECT * FROM ${this.TABLE}`);
    }

    /**
     * Delete record
     * @param {number} id
     * @return {Promise<void>}
     */
    async delete(id) {
        await this.get(id);
        await this.query(`DELETE FROM ${this.TABLE} WHERE id = ?`, [id]);
    }

    /**
     * Not found exception
     * @param msg
     * @return {Error}
     */
    notFoundException(msg = 'Records not found') {
        return new Error(msg);
    }

    /**
     * Already exists exception
     * @param msg
     * @return {Error}
     */
    alreadyExistsException(msg = 'Records already exists') {
        return new Error(msg);
    }

    /**
     * Async query
     * @async
     * @param {string} sql
     * @param {array|object} params
     * @param {sqlite3} db
     * @return {Promise<array|object>}
     */
    query(sql, params = [], db = this.mainDB) {
        return new Promise((resolve, reject) => {
            let stmt = db.prepare(sql, params, (err) => {
                if(err) {
                    return reject(err);
                }
                stmt.all([], (err, values) => {
                    if(err) {
                        return reject(err);
                    }

                    return resolve(values);
                })
            });

        });
    }


}

module.exports = _sqliteModel;