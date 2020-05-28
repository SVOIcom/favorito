# Favorito Framework - Lightweight Node.js web framework

## Concept

MVC pattern in core.

### Requests
All request go thru Router class and routes to specified Controller to internal action. For ex:

GET http://somesite.com/ControllerName/ActionName

This request calls method "ActionName" from controller "ControllerName"

Empty action interprets as "index" action

GET http://somesite.com/Admin/

Calls method "index" from controller "Admin".

### Database
For now framework works only with integrated Sqlite DB. It's temporary.

Put Model class into "model" folder and It's loads automatically.

Create queries by using model in controller:

await this.app.db.get().tableModel.query('SELECT * FROM table');

Also you can use external databases.

## Usage

``
npm install --save favorito
``


```javascript
const {FavoritoApp} = require('favorito');

(async () => {
    //First argument - config object
    //  false - try load config from config.js
    //  string - path to config file
    const App = new FavoritoApp(false, 'Favorito Demo App');

    //Init app
    await App.init();

    //Start app
    await App.start();
})()
``` 

Config example:

```javascript
module.exports = {
 
    //HTTP binding port
    bindPort: 3001,

    //Base URL for current application
    "appUrl": "https://favorito",

    //Main controller for / path
    indexController: 'App',
    
    //Databases list (sqlite3 only for now)
    databases: [
        {type: 'sqlite', name: 'default', config: {path: 'database.db'}}
    ],

    //Configured Email transports
    "emailTransports": {
        "default": {
            "host": "STMP.COM",
            "port": 465,
            "secure": true,
            "auth": {
                "user": "SMTP-USER",
                "pass": "SMTP-PASSWORD"
            },
            "from": "Favorito Framework <info@expressApp.biz>",
            "debug": true //Log all Emails
        }
    },

    //Cryptography secret
    "secret": "5f0239f8f8ad284983c11ee815874562",

    //Cryptography salt (for passwords, etc.)
    "salt": "19d62fc823eb117f148b61110e08fba7a",
}

```

## Examples
Complete example see in [/demo](/demo).
