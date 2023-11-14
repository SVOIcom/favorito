module.exports = {
    bindPort: 3001,
    indexController: 'App',
    publicPath: 'public',
    databases: [
        {type: 'sequelize', name: 'default', config: {path: 'sqlite:database.db'}}
    ],
    routes: [
        {path: '/hello', controller: 'App', action: 'hello'},
        {path: '/redirectToGoogle', redirect: 'https://google.com'},
        {path: '/someFile', file: 'moreStatic/test.json', filename: 'test!!!.json'},
        {
            path: '/fn', fn: async (req, res, next) => {
                res.send('Hello from function');
            }
        },
    ],
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
            "debug": true
        }
    },
    "secret": "5f0239f8f8ad284983c11ee815874562",
    "appUrl": "https://favorito",
    "salt": "19d62fc823eb117f148b61110e08fba7a",
    "arbitratorSecret": "secretPasswordTwo"
}
