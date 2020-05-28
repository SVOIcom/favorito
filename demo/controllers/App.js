/**
 * Application controller
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */
const _App = require('./_App');


class App extends _App {
    constructor(app, db, config, parent, controllerName) {
        super(app, db, config, parent, controllerName);
        console.log('APP CONTROLLER LOADED');
    }
    async index() {
        return await this.render();
    }


}

module.exports = App;