'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SSEClient = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Class SSEClient
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Server-Sent Events JavaScript Client
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * https://github.com/vallejos/sse-js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Usage example:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * const sseClient = new SSEClient();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Object.freeze(sseClient);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * export default sseClient;
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _eventsourcePolyfill = require('./eventsource-polyfill');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

'use strict';

var SSEClient = exports.SSEClient = function () {

    /**
     * Create singleton and establish a connection
     *
     * @constructor
     * @param {string} url
     * @param {boolean} withCredentials
     * @param {boolean} debug
     * @returns {*}
     */
    function SSEClient(url) {
        var _this = this;

        var withCredentials = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var debug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        _classCallCheck(this, SSEClient);

        if (!this._isSupported()) {
            throw new Error('EventSource not supported by your browser/system');
        }

        // handle singleton
        if (!SSEClient.instance) {
            // this could be redundant if we're using const and freeze but just in case
            SSEClient.instance = this;
        }

        if (!url) {
            throw new Error('A valid URL is required to open the EventSource connection');
        }

        this.url = url;
        this.subscribers = [];
        this.debug = debug;
        this.withCredentials = withCredentials;

        try {
            this.evtSource = new _eventsourcePolyfill.EventSource(this.url, { withCredentials: this.withCredentials });

            // if a message was received
            this.evtSource.onmessage = function (event) {
                // @todo: check origin for security https://www.html5rocks.com/en/tutorials/eventsource/basics/
                _this.subscribers.forEach(function (handler) {
                    if (typeof handler.callbackFn === 'function' && (handler.eventName === event.event || handler.eventName === null)) {
                        if (_this.debug) {
                            console.log('Calling callback id: ', handler.id);
                        }

                        // call the custom event handler
                        handler.callbackFn(event);
                    }
                });

                if (_this.debug) {
                    console.log('Received Event: ', event);
                }
            };

            // error received
            this.evtSource.onerror = function (err) {
                _this.subscribers.forEach(function (handler) {
                    if (typeof handler.errorFn === 'function') {
                        // call the custom event error handler
                        handler.callbackFn(err);
                    }
                });

                if (_this.debug) {
                    console.error('Received Error: ', err);
                }
            };
        } catch (err) {
            if (this.debug) {
                console.error('Exception: ', err);
            }
            return err;
        }

        return SSEClient.instance;
    }

    /**
     * Close connection
     *
     * @returns {boolean}
     */


    _createClass(SSEClient, [{
        key: 'close',
        value: function close() {
            if (this.evtSource) {
                this.evtSource.close();
                this.subscribers = [];

                if (this.debug) {
                    console.log('SSEClient: Connection closed');
                }

                return true;
            }

            if (this.debug) {
                console.log('SSEClient: Connection not opened');
            }

            return false;
        }

        /**
         * Subscribe a callback function to events
         * if event is null, the callback subscribes to all events
         * if error is passed, the callback subscribes to errors
         *
         * @param {function} cb
         * @param {string} event
         * @param {function} error
         * @returns {*}
         */

    }, {
        key: 'subscribe',
        value: function subscribe(cb) {
            var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var error = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            var id = this._id(16);

            this.subscribers.push({
                'id': id,
                'eventName': event,
                'callbackFn': cb,
                'errorFn': error
            });

            if (this.debug) {
                console.log('SSEClient: ' + id + ' subscribed');
            }

            return id;
        }

        /**
         * Unsubscribe an ID
         * Returns true if found and removed from subscribers list, false if not found
         *
         * @param {string} id
         * @returns {boolean}
         */

    }, {
        key: 'unsubscribe',
        value: function unsubscribe(id) {
            var idx = this.evtSubscribers.filter(function (handler) {
                return id === handler.id;
            });

            if (idx >= 0) {
                this.subscribers.splice(idx, 1);

                if (this.debug) {
                    console.log('SSEClient: ' + id + ' unsubscribed');
                }

                return true;
            }

            return false;
        }

        /**
         * Enable debug
         *
         * @returns {boolean}
         */

    }, {
        key: 'enableDebug',
        value: function enableDebug() {
            this.debug = true;
            return this.debug;
        }

        /**
         * Disable debug
         *
         * @returns {boolean}
         */

    }, {
        key: 'disableDebug',
        value: function disableDebug() {
            this.debug = false;
            return this.debug;
        }

        /**
         * Generates a unique string id of the given size, example: size(15) => "iy9rfyrr17pe8hbqffwma"
         * based on: https://gist.github.com/6174/6062387
         *
         * @param {number} size (default:8)
         * @returns {string}
         * @private
         */

    }, {
        key: '_id',
        value: function _id() {
            var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;

            return Math.random().toString(36).substring(2, size) + Math.random().toString(36).substring(2, size);
        }

        /**
         * Return whether EventSource is supported or not
         *
         * @returns {boolean}
         * @private
         */

    }, {
        key: '_isSupported',
        value: function _isSupported() {
            return typeof _eventsourcePolyfill.EventSource !== 'undefined';
        }
    }]);

    return SSEClient;
}();