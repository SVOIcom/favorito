/**
 * Favorito Framework
 * Sequelize Model abstract
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

const {Sequelize, Model, DataTypes} = require('sequelize');

/**
 * @abstract
 */
class _sequelizeModel {

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
    get TYPE() {
        return 'sequelize';
    }

    /**
     * Sequelize Data types + additional data types
     * @public
     */
    get _DataTypes() {
        let additionalDataTypes = {
            /**
             * Favorito JSON (support for all pseudo-json storage)
             */
            FJSON: function (name, type = DataTypes.STRING) {
                return {
                    type: DataTypes.STRING,
                    get: function () {
                        return JSON.parse(this.getDataValue(name));
                    },
                    set: function (value) {
                        this.setDataValue(name, JSON.stringify(value));
                    },
                }
            }
        };
        return {...DataTypes, ...additionalDataTypes};
    }

    /**
     * Model constructor
     * @param {Sequelize} sequelize Permament database
     * @param {object} config Configure obj
     * @param {Database} parent Database object
     */
    constructor(sequelize, config = {}, parent = undefined) {
        //super({});
        this.sequelize = sequelize;
        this.config = config;
        this.parent = parent;

        class CurrentModel extends Model {
        }

        this.model = CurrentModel;
    }

    /**
     * Model init
     */
    async init() {

    }

    /**
     * Initilize model
     * @param {object} fields Sequelize fields
     * @param {object} options
     * @returns {Promise<Model<any, TModelAttributes>>}
     */
    async initModel(fields, options = {}) {
        return this.model.init(fields, {...options, sequelize: this.sequelize, modelName: this.TABLE});
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
        let element = await this.model.findOne({
            where: {
                id: id
            }
        });
        if(!element) {
            this.notFoundException(msg);
        }
        return element;
    }

    /**
     * Find All records
     * @return {Promise<Array|Object>}
     */
    async all(options = {}) {
        return await this.model.findAll(options);
    }

    /**
     * findAll alias
     * @param options
     * @returns {Promise<Array|Object>}
     */
    async find(options = {}) {
        return await this.all(options);
    }

    /**
     * Find one row
     * @param options
     * @returns {Promise<Sequelize>}
     */
    async findOne(options = {}) {
        return await this.model.findOne(options);
    }

    /**
     * Delete record
     * @param {number} id
     * @return {Promise<number>}
     */
    async delete(id) {
        return await this.model.destroy({
            where: {
                id
            }
        });
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
     * Raw query to database
     * @param sql
     * @param options
     * @returns {Promise<[undefined, number]>}
     */
    async query(sql = '', options = {}) {
        return await this.sequelize.query(sql, options);
    }

    /**
     * Raw query with params
     * @param {string} sql
     * @param {array} binds
     * @returns {Promise<(undefined|number)[]>}
     */
    async bindQuery(sql, binds = []) {
        return await this.query(sql, {bind: binds});
    }

    /**
     * Alias bindQuery()[0]
     * @param  {string} sql
     * @param {array} binds
     * @returns {Promise<undefined|number>}
     */
    async bindQueryFirst(sql, binds = []) {
        return (await this.bindQuery(sql, binds))[0];
    }

    /**
     * JSON2Object auto
     * @param {array} data
     * @param {array} fieldsNames
     * @returns {*}
     */
    jsonFields(data, fieldsNames = []) {
        for (let i in data) {
            if(data.hasOwnProperty(i)) {
                for (let field of fieldsNames) {
                    try {
                        data[i][field] = JSON.parse(data[i][field]);
                    } catch (e) {
                    }
                }
            }
        }

        return data;
    }

}

module.exports = _sequelizeModel;