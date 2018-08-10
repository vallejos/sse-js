/**
 * Class SSE
 * Server-Sent Events JavaScript Client
 * https://github.com/vallejos/sse-js
 *
 * Usage example:
 *
 * const sseClient = new SSE();
 * Object.freeze(sseClient);
 * export default sseClient;
 */
class SSE {

    /**
     * Create singleton and establish a connection
     *
     * @constructor
     * @param {string} url
     * @param {boolean} withCredentials
     * @param {boolean} debug
     * @returns {*}
     */
    constructor (url, withCredentials = false, debug = false) {
        if (!this._isSupported()) {
            throw new Error('EventSource not supported by your browser/system');
        }

        // handle singleton
        if (!SSE.instance) {
            // this could be redundant if we're using const and freeze but just in case
            SSE.instance = this;
        }

        if (!url) {
            throw new Error('A valid URL is required to open the EventSource connection');
        }

        this.url = url;
        this.subscribers = [];
        this.debug = debug;
        this.withCredentials = withCredentials;

        try {
            this.evtSource = new EventSource(this.url, {withCredentials: this.withCredentials});

            // if a message was received
            this.evtSource.onmessage = event => {
                this.subscribers.forEach(handler => {
                    if ( (typeof handler.callbackFn === 'function') && 
                        (handler.eventName === event.event || handler.eventName === null) ) {
                            if (this.debug) {
                                console.log('Calling callback id: ', handler.id);
                            }
            
                            // call the custom event handler
                            handler.callbackFn(event);
                    }
                });

                if (this.debug) {
                    console.log('Received Event: ', event);
                }
            };
                
            // error received
            this.evtSource.onerror = err => {
                this.subscribers.forEach(handler => {
                    if (typeof handler.errorFn === 'function') {
                        // call the custom event error handler
                        handler.callbackFn(err);
                    }
                });

                if (this.debug) {
                    console.error('Received Error: ', err);
                }
            };

        } catch (err) {
            if (this.debug) {
                console.error('Exception: ', err);
            }
            return err
        }

        return SSE.instance;
    }

    /**
     * Close connection
     *
     * @returns {boolean}
     */
    close () {
        if (this.evtSource) {
            this.evtSource.close();
            this.subscribers = [];

            if (this.debug) {
                console.log('SSE: Connection closed');
            }
    
            return true;
        }

        if (this.debug) {
            console.log('SSE: Connection not opened');
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
    subscribe (cb, event = null, error = null) {
        let id = this._id(16);

        this.subscribers.push({
            'id': id,
            'eventName': event,
            'callbackFn': cb,
            'errorFn': error                
        });

        if (this.debug) {
            console.log(`SSE: ${id} subscribed`);
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
    unsubscribe (id) {
        let idx = this.evtSubscribers.filter(handler => id === handler.id);

        if (idx >= 0) {
            this.subscribers.splice(idx, 1);

            if (this.debug) {
                console.log(`SSE: ${id} unsubscribed`);
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
    enableDebug () {
        this.debug = true;
        return this.debug;
    }

    /**
     * Disable debug
     *
     * @returns {boolean}
     */
    disableDebug () {
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
    _id (size = 8) {
        return Math.random().toString(36).substring(2, size) + Math.random().toString(36).substring(2, size);
    }

    /**
     * Return whether EventSource is supported or not
     *
     * @returns {boolean}
     * @private
     */
    _isSupported () {
        return !!EventSource;
    }

}
