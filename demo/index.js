/**
 * Favorito demo application
 */

const {FavoritoApp} = require('../');

(async () => {
    const App = new FavoritoApp(false, 'Favorito Demo App');
    await App.init();
    await App.start();
})()
