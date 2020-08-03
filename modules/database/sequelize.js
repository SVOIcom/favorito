/**
 * Favorito Framework
 * Sequelize database connector
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

const {Sequelize} = require('sequelize');
const fs = require('fs');

class SequelizeDB {
    constructor(dbPath = 'sqlite::memory:', config = {}) {

        this.config = config;

        //Initialize databases
        this.db = new Sequelize(dbPath);

        this._models = [];

        //Initialize models
        let models = fs.readdirSync(process.cwd() + '/models');
        for (let model of models) {
            if(model.substr(0, 1) !== '.' && model.substr(0, 1) !== '_') {
                let modelClass = require(process.cwd() + '/models/' + model);
                /**
                 * @type {_sequelizeModel}
                 */
                let loadedModel = new (modelClass)(this.db, this.config, this);
                //Check is sequelize model
                if(loadedModel.TYPE === 'sequelize') {
                    this[loadedModel.CLASS_NAME] = loadedModel;
                    this._models.push(loadedModel);
                }
            }
        }

    }

    /**
     * Init database
     * @return {Promise<void>}
     */
    async init() {
        /**
         * @type {_sequelizeModel} model
         */
        for (let model of this._models) {
            await model.init();
        }

        //Syncronize Sequelize
        await this.db.sync();
    }
}


module.exports = SequelizeDB;