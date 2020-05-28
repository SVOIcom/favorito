/**
 * Favorito Framework
 * Controller router
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

const fs = require('fs');

class Router {
    constructor(expressApp, favoritoApp, config = {}) {
        this.expressApp = expressApp;
        this.app = favoritoApp;
        this.config = config;

        this._controllers = [];
        this._controllersMap = {};

        //Initialize models
        let controllers = fs.readdirSync(process.cwd() + '/controllers');
        for (let controller of controllers) {
            if(controller.substr(0, 1) !== '.' && controller.substr(0, 1) !== '_') {
                let controllerClass = require(process.cwd() + '/controllers/' + controller);
                let className = controller.toLowerCase().replace('.js', '');
                /**
                 * @type {_Controller}
                 */
                let loadedController = new (controllerClass)(expressApp, favoritoApp, this.config, this, className);
                this._controllersMap[className] = loadedController;
                this._controllers.push(loadedController);
            }
        }
    }

    /**
     * Init
     * @return {Promise<void>}
     */
    async init() {
        let that = this;
        /**
         * @type {_Controller} model
         */
        for (let controller of this._controllers) {
            await controller.init();
        }

        /**
         * Connects action to path
         * @param req
         * @param res
         * @param next
         * @return {Promise<*>}
         */
        const connectAction = async (req, res, next) => {
            if(req.params.controllerName) {
                let controller = req.params.controllerName.toLowerCase().trim();

                if(typeof that._controllersMap[controller] === 'undefined') {
                    return next();
                }

                let action;
                if(typeof req.params.action === 'undefined') {
                    action = 'index';
                } else {
                    action = req.params.action.toLowerCase().trim();
                }


                if(!await that._controllersMap[controller].hasAction(action)) {
                    return next();
                }

                //Has subparams string
                let attrs = [];
                if(req.params['0']) {
                    attrs = req.params['0'].split('/');
                }

                //Apply request to controller
                await that._controllersMap[controller].applyRequest(req, res, next, action, attrs);
                //Calls action
                //await that._controllersMap[controller][action](req, res, next);
            } else {
                next();
            }
        };

        //Map controllers and actions
        this.expressApp.all('/:controllerName/:action', connectAction);
        this.expressApp.all('/:controllerName', connectAction);
        this.expressApp.all('/:controllerName/:action/(*)', connectAction);

        //Setup index controller
        if(this.config.indexController) {
            this.expressApp.all('/', async (req, res, next) => {
                req.params.controllerName = this.config.indexController;
                req.params.action = 'index';
                return await connectAction(req, res, next);
            });
        }
    }

}

module.exports = Router;