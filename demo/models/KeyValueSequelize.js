/**
 * KeyValue model
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

const {_SequelizeModel} = require('../../');

class KeyValueSequelize extends _SequelizeModel {

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
        await this.initModel({
            key: this._DataTypes.STRING,
            value: this._DataTypes.FJSON
        });
    }

    /**
     * Get value from keyvalue table
     * @param {string} key
     * @param {*} defaultValue
     * @returns {Promise<string|*>}
     */
    async get(key, defaultValue = undefined) {
        let element = await this.findOne({where: {key}});
        if(!element) {
            return defaultValue;
        }

        return element.value;
    }

    /**
     * Put key to keyvalue
     * @param {string} key
     * @param {*} value
     * @returns {Promise<Model<any, TModelAttributes>>}
     */
    async put(key, value) {
        let element = await this.findOne({where: {key}});
        if(element) {
            await this.delete(element.id);
        }
        return await this.model.create({key, value});
    }

}

module.exports = KeyValueSequelize;