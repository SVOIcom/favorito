/**
 * Favorito Framework
 * Email module
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */


const NodeMailer = require('nodemailer');

class Email {
    constructor(config = {}) {
        this.config = config;
        this.emailTransports = {};
        if(config.emailTransports) {
            this.emailTransports = config.emailTransports;
        }

    }

    /**
     * Returns transport config
     * @param {string} name
     * @return {*}
     */
    getTransport(name = 'default') {
        if(typeof this.emailTransports[name] === 'undefined') {
            throw new Error('No transport config with name: ' + name);
        }
        return this.emailTransports[name];
    }

    /**
     * Add transport config
     * @param {string} transportName
     * @param {object} config
     */
    addTransportConfig(transportName, config) {
        this.emailTransports[transportName] = config;
    }


    /**
     * Sends email async
     * @param {object} options
     * @param {string} transport
     * @return {Promise<*>}
     * @async
     */
    send(options, transport = 'default') {
        let that = this;
        return new Promise(((resolve, reject) => {
            let transportConfig = that.getTransport(transport);
            let transporter = NodeMailer.createTransport(transportConfig);
            if(transportConfig.debug) {
                console.log('Sending email', options.subject, 'to', options.to, 'using transport', transport);
            }
            transporter.sendMail(options, function (error, info) {
                if(error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        }));
    }

    /**
     * Send plain text
     * @param {string} to
     * @param {string} subject
     * @param {string} text
     * @param {string} from
     * @param {string} transport
     * @return {Promise<*>}
     */
    async sendPlain(to, subject = '', text = '', from = this.getTransport('default').from, transport = 'default') {
        return await this.send({to, from, subject, text}, transport);
    }

    /**
     * Send HTML text
     * @param {string} to
     * @param {string} subject
     * @param {string} html
     * @param {string} from
     * @param {string} transport
     * @return {Promise<*>}
     */
    async sendHtml(to, subject = '', html = '', from = this.getTransport('default').from, transport = 'default') {
        return await this.send({to, from, subject, html}, transport);
    }
}

module.exports = Email;