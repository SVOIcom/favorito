/**
 * Favorito Framework
 * Controller abstract
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */

const Session = require('../modules/helpers/Session');

/**
 * @abstract
 */
class _Controller {
    /**
     * Construct controller
     * @param {express} express
     * @param {FavoritoApp} favoritoApp
     * @param {object} config
     * @param {Router} parent
     * @param {string} controllerName
     */
    constructor(express, favoritoApp, config = {}, parent, controllerName = '') {

        /**
         * @type {express}
         */
        this.expressApp = express;

        this.app = favoritoApp;
        this.config = config;

        /**
         * @type {Router}
         */
        this.parent = parent;
        this.controllerName = controllerName;
        this.templateParams = {};

        this.req = null;
        this.res = null;

        //Tools
        this.logger = this.app.logger;

        /**
         * Session
         * @type {Session}
         */
        this.session = null;

        /**
         * Post params
         * @type {{}}
         */
        this.post = {};

        /**
         * Default template
         * @type {string}
         */
        this.template = '';

        this.attributes = [];

        this.action = '';
    }


    /**
     * Initialization
     * @return {Promise<void>}
     */
    async init() {
    }

    /**
     * Apply request
     * @param req
     * @param res
     * @param next
     * @param {string} action
     * @param {[]} attributes
     * @return {Promise<void>}
     */
    async applyRequest(req, res, next, action, attributes = []) {

        let actionMethod = await this.findAction(action);

        //Invalid action
        if(!actionMethod) {
            return next(req);
        }

        /**
         * @type {Session}
         */
        let session = await (new Session(req, res, this.app, this.config)).load();
        await session.updateSession();

        //Setup new controller for isolation
        let actionEnv = new this.constructor(this.expressApp, this.app, this.config, this.parent, this.controllerName);
        await actionEnv.init();

        //Setup props
        actionEnv.session = session;
        actionEnv.req = req;
        actionEnv.res = res;
        actionEnv.post = req.body;
        actionEnv.template = actionMethod;
        actionEnv.attributes = attributes;
        actionEnv.action = actionMethod;

        // this.templateParams = {};



        //Run actions in isolated class
        try {
            //If before action intercepts request
            if(await this._beforeAction.apply(actionEnv, [session, req, res, next]) !== true) {

                //If not, call action
                let result = await this[actionMethod].apply(actionEnv, attributes);
                if(typeof result !== "undefined") {
                    res.send(result);
                } else {

                    /* //Trying to render template
                     try {
                         res.render('login', this.templateParams);
                     } catch (e) {
                     }*/
                }
            }
        } catch (e) {
            console.log('Action call error:', e);
            res.status(500);
            next();
        }
    }


    /**
     * Find action in controller
     * @param {string} action
     * @return {Promise<boolean|*>}
     * @private
     */
    async findAction(action) {
        for (let property of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            if(String(property).toLowerCase().trim() === String(action).toLowerCase().trim() && property !== 'constructor' && property.substr(0, 1) !== '_') {
                return property;
            }
        }

        return false;
    }

    /**
     * Has action
     * @param action
     * @return {Promise<boolean>}
     */
    async hasAction(action) {
        return (await this.findAction(action)) !== false;
    }


    /**
     * Set template variable
     * @param {string} key
     * @param {*} value
     * @return {Promise<void>}
     */
    async tset(key, value) {
        this.templateParams[key] = value;
    }

    /**
     * Render template
     * @param {string} template
     * @param {object} params
     * @return {Promise<void>}
     */
    async render(template = this.template, params = this.templateParams) {
        await this._beforeRender();
        this.res.render(this.controllerName + '/' + template, params);
    }

    /**
     * Redirect
     * @param {string} path
     * @return {Promise<*|void|Response>}
     */
    async redirect(path) {
        this.res.redirect(path);
    }

    /**
     * Calss before action calls
     * @param {Session} session
     * @param req
     * @param res
     * @param next
     * @return {Promise<void>}
     * @private
     */
    async _beforeAction(session, req, res, next) {

    }

    /**
     * Calls before render
     * @return {Promise<void>}
     * @private
     */
    async _beforeRender() {

    }

    /**
     * Is POST method
     * @return {boolean}
     */
    isPost() {
        return this.req.method === 'POST'
    }

    /**
     * Is get method
     * @return {boolean}
     */
    isGet() {
        return this.req.method === 'GET'
    }


}

module.exports = _Controller;
