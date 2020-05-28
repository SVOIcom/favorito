/**
 * Abstract Appliction controller
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */
const {_Controller} = require('../../');


class _App extends _Controller {

    constructor(app, db, config, parent, controllerName) {
        super(app, db, config, parent, controllerName);

        this.layoutName = 'demo/layout.twig';

        this.badgeMessages = [];
        this.subTitle = 'FavoritoDemo';

        this.controllerPageName = '';
        this.controllerIndexPageUrl = '';
        this.actionPageName = '';
    }

    /**
     * Before render
     * @return {Promise<void>}
     * @private
     */
    async _beforeRender() {
        await super._beforeRender();
        this.tset('layoutName', this.layoutName);
    }

    async _beforeAction() {
        await super._beforeAction();
        //Check is session active
        if(!await this.session.isActive()) {
            await this.session.clear();
        }

        this.badgeMessages = await this.session.read('badge', []);
        this._updateBadgesMessages();

    }

    /**
     * Change layout
     * @param newLayout
     */
    changeLayout(newLayout) {
        this.layoutName = newLayout;
    }


    /**
     * Update template badge messages field
     * @private
     */
    _updateBadgesMessages() {
        this.tset('badgeMessages', this.badgeMessages);
    }

    /**
     * Show badge
     * @param {string} type
     * @param {string} message
     * @private
     */
    async _showBadge(type = 'error', message = '') {
        this.badgeMessages.push({type: type, message: message});

        await this.session.write('badge', this.badgeMessages);
        this._updateBadgesMessages();
    }

    /**
     * Show error badge message
     * @param errorMessage
     */
    async showErrorBadge(errorMessage) {
        await this._showBadge('error', errorMessage)
    }

    /**
     * Show ok badge
     * @param message
     */
    async showOkBadge(message) {
        await this._showBadge('ok', message)
    }

    /**
     * Show warning badge
     * @param message
     */
    async showWarningBadge(message) {
        await this._showBadge('warning', message)
    }


    /**
     * @inheritDoc
     */
    async render(template, params) {
        await this._updateBadgesMessages();
        await this.session.write('badge', []);
        return await super.render(template, params);
    }


    /**
     * Set page title
     * @param main
     * @param subTitle
     */
    setTitle(main, subTitle = this.subTitle) {
        this.tset('title', main + ' — ' + subTitle);
        this.actionPageName = main;
        this.tset('actionPageName', this.actionPageName);
    }

    /**
     * Set breadcrumbs config
     * @param {string} pageName
     * @param {string} indexPageUrl
     */
    setControllerPage(pageName, indexPageUrl) {
        this.controllerPageName = pageName;
        this.controllerIndexPageUrl = indexPageUrl;

        this.tset('controllerPageName', this.controllerPageName);
        this.tset('controllerIndexPageUrl', this.controllerIndexPageUrl);
        this.tset('actionPageName', this.actionPageName);
    }

}

module.exports = _App;