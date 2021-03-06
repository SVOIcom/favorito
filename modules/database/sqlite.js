/**
 * Favorito Framework
 * Database connector
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */


const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

class Sqlite {
    constructor(dbPath = ':memory:', config = {}) {

        this.config = config;

        //Initialize databases
        this.permamentDB = new sqlite3.Database(dbPath);

        this._models = [];

        //Initialize models
        let models = fs.readdirSync(process.cwd() + '/models');
        for (let model of models) {
            if(model.substr(0, 1) !== '.' && model.substr(0, 1) !== '_' ) {
                let modelClass = require(process.cwd() + '/models/' + model);
                /**
                 * @type {_sqliteModel}
                 */
                let loadedModel = new (modelClass)(this.permamentDB,  this.config, this);
                //Check is SQLITE3 model
                if(loadedModel.TYPE === 'sqlite3') {
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
         * @type {_Model} model
         */
        for (let model of this._models) {
            await model.init();
        }
    }
}


module.exports = Sqlite;