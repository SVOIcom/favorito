/**
 * Favorito Framework
 * Main file
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */


//**************************************************
const getid = () => (Math.random() * (new Date().getTime())).toString(36).replace(/[^a-z]+/g, '');
const fs = require('fs');
const express = require('express');
//const expressApp = express();
const bodyParser = require('body-parser');

const EventEmitter = require('events');


/*

(async () => {

    console.log('Initialize database');
    await db.init();

    console.log('Initialize router');
    let router = new Router(expressApp, db, config);
    await router.init();

    try {
        let userId = await db.users.createNewUser('admin@twister-vl.ru', '', {name: 'Андрей Недобыльский'});
        await db.users.changeUserType(userId, db.users.USER_TYPES.admin);
        await db.users.changeStatus(userId, db.users.USER_STATUSES.active);
    } catch (e) {

    }


    expressApp.use(async (req, res, next) => {
        res.status(404);
        res.render('404');
    });

    expressApp.use(async (err, req, res, next) => {
        res.status(err.status || 500);
        res.render('500', {
            message: err.message,
            error: {}
        });
    });

    expressApp.listen(BINDING_PORT, function () {
        console.log(`HomeOffice control panel at ${BINDING_PORT}`);
    });


})();*/

/*
process.on('unhandledRejection', error => {
    console.log('HI LEVEL ERROR', error);
});

process.on('uncaughtException', error => {
    console.log('HI LEVEL ERROR2', error);
});
*/

module.exports = {
    FavoritoApp: class Favorito extends EventEmitter {
        constructor(config, appName = '') {
            super();
            this.logger = require('./modules/Logger')(appName);

            //If config is path to config file
            if(typeof config === 'string' && config.length !== 0) {
                try {
                    config = require(config);
                } catch (e) {
                    this.logger.fatalFall(`Config ${config} load failed`);
                }
            } else if((typeof config === 'string' && config.length === 0) || config === false) {
                try {
                    config = require(process.cwd() + '/config.js');
                } catch (e) {
                    this.logger.fatalFall(`Config ${process.cwd() + '/config.js'} load failed`);
                }
            }

            this.config = config;
            this.expressApp = null;

            this.db = {};
        }

        async init() {
            this.logger.info('Starting APP');

            this.expressApp = express();
            this.expressApp.use(bodyParser.json());
            this.expressApp.use(bodyParser.urlencoded({
                extended: true
            }));

            this.expressApp.use(require('cookie-parser')());

            const twig = require('twig');
            this.expressApp.set('view engine', 'twig');

            this.expressApp.set('view options', {layout: false});

            this.expressApp.use(express.static('public'));
            this.expressApp.set('views', process.cwd() + '/views');
            this.expressApp.set('twig options', {
                namespaces: {'core': __dirname + '/views'}
            });

            this.logger.info('Initialize Router');
            const Router = require('./modules/Router');
            let router = new Router(this.expressApp, this, this.config);
            await router.init();


            if(this.config.databases) {
                this.logger.info('Initialize databases');
                for (let dbConf of this.config.databases) {
                    switch (dbConf.type) {
                        case "sqlite":
                            this.db[dbConf.name] = new (require('./modules/database/sqlite'))(dbConf.config.path, this.config);
                            await this.db[dbConf.name].init();
                            break;
                    }
                }
            }

            this.logger.info('Initialized');


        }

        /**
         * Start expressApp
         * @async
         * @return {Promise<unknown>}
         */
        start() {
            let that = this;

            process.on('unhandledRejection', error => {
                that.logger.error(error);
                that.emit('error', error);
            });

            process.on('uncaughtException', error => {
                that.logger.error(error);
                that.emit('error', error);
            });

            return new Promise((resolve, reject) => {
                that.expressApp.use(async (req, res, next) => {
                    res.status(404);
                    res.render('404');
                });

                that.expressApp.use(async (err, req, res, next) => {
                    res.status(err.status || 500);
                    res.render('500', {
                        message: err.message,
                        error: {}
                    });
                });
                that.expressApp.listen(that.config.bindPort, function () {
                    that.logger.info(`App started at ${that.config.bindPort}`);
                });
            });


        }
    },
    _Controller: require('./controllers/_Controller'),
    _SqliteModel: require('./modules/database/models/_sqliteModel'),

}