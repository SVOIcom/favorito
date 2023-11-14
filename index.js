/**
 * Favorito Framework
 * Main file
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */


//**************************************************
const getid = () => (Math.random() * (new Date().getTime())).toString(36).replace(/[^a-z]+/g, '');
const fs = require('fs');
const express = require('express');

const bodyParser = require('body-parser');
const EventEmitter = require('events');


module.exports = {
    FavoritoApp: class Favorito extends EventEmitter {
        constructor(config, appName = '') {
            super();
            this.logger = require('./modules/Logger')(appName);

            //If config is path to config file
            if (typeof config === 'string' && config.length !== 0) {
                try {
                    config = require(config);
                } catch (e) {
                    this.logger.fatalFall(`Config ${config} load failed`);
                }
            } else if ((typeof config === 'string' && config.length === 0) || config === false) {
                try {
                    config = require(process.cwd() + '/config.js');
                } catch (e) {
                    this.logger.fatalFall(`Config ${process.cwd() + '/config.js'} load failed`);
                }
            }

            this.config = config;
            this.expressApp = null;

            /**
             * Database holder. Returns default DB as get
             * @type {DBHolder}
             */
            this.db = new (class DBHolder {
                get() {
                    if (typeof this['default'] !== "undefined") {
                        return this['default'];
                    }

                    return null;
                }

            });
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

            if (this.config.publicPath) {
                this.expressApp.use(express.static(this.config.publicPath));
            } else {
                this.expressApp.use(express.static('public'));
            }

            this.expressApp.set('views', process.cwd() + '/views');
            this.expressApp.set('twig options', {
                namespaces: {'core': __dirname + '/views'}
            });

            this.logger.info('Initialize Router');
            const Router = require('./modules/Router');
            let router = new Router(this.expressApp, this, this.config);
            await router.init();


            if (this.config.databases) {
                this.logger.info('Initialize databases');
                for (let dbConf of this.config.databases) {
                    switch (dbConf.type) {
                        case "sqlite":
                            this.db[dbConf.name] = new (require('./modules/database/sqlite'))(dbConf.config.path, {
                                ...this.config,
                                app: this
                            });
                            await this.db[dbConf.name].init();
                            break;
                        case "sequelize":
                            this.db[dbConf.name] = new (require('./modules/database/sequelize'))(dbConf.config.path, {
                                ...this.config,
                                app: this
                            });
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

                    //If it already 500 send to 500 handler
                    if (res.statusCode === 500) {
                        return handler500(null, req, res, next);
                    }

                    //If code ok or 404
                    if (res.statusCode !== 404 && res.statusCode !== 200) {
                        return next();
                    }
                    res.status(404);
                    res.render('404');
                });

                const handler500 = async (err, req, res, next) => {
                    console.log('500');
                    err = err || {};
                    if (!err.status) {
                        err.status = 500;
                    }
                    res.status(err.status || 500);
                    res.render('500', {
                        message: err.message,
                        error: {}
                    });
                };

                that.expressApp.use(handler500);
                that.expressApp.listen(that.config.bindPort, function () {
                    that.logger.info(`App started at ${that.config.bindPort}`);
                    resolve();
                });
            });


        }
    },
    _Controller: require('./controllers/_Controller'),
    _SqliteModel: require('./modules/database/models/_sqliteModel'),
    _SequelizeModel: require('./modules/database/models/_sequelizeModel'),
    Utils: require('./modules/helpers/Utils'),
    Crypto: require('./modules/helpers/Crypto'),
    Session: require('./modules/helpers/Session'),
    Email: require('./modules/Email'),
    _Logger: require('./modules/Logger'),

}
