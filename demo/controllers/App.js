/**
 * Application controller
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */
const _App = require('./_App');


class App extends _App {
    constructor(app, db, config, parent, controllerName) {
        super(app, db, config, parent, controllerName);
    }
    async index() {
        await this.app.db.get().keyvalue.put('test', Math.random());
        console.log('DB', await this.app.db.get().keyvalue.get('test'));
        return await this.render();
    }

    async hello(){
        return "Hello world!";
    }

    async bad(){
        throw new Error('Bad request');
    }


}

module.exports = App;
