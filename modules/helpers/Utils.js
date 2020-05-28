/**
 * Favorito Framework
 * Utility functions
 * @author Andrey Nedobylsky (admin@twister-vl.ru)
 */


module.exports = {

    /**
     * Converts throwable promise to logical promise
     * @param {Promise} promise
     * @param {*} falseValue Value, returned if promise falls
     * @return {Promise<null|*>}
     * @async
     */
    ifex: (promise, falseValue = null) => {
        return new Promise(resolve => {
            promise.then(resolve).catch(() => {
                resolve(falseValue)
            });
        })
    },
    /**
     * Trying to parse JSON. If not, just return value
     * @param input
     * @return {any}
     */
    jobject: (input) => {
        try {
            return JSON.parse(input);
        } catch (e) {
            return input;
        }
    },
    /**
     * Generates random string
     */
    getid: () => {
        (Math.random() * (new Date().getTime())).toString(36).replace(/[^a-z]+/g, '')
    }
};