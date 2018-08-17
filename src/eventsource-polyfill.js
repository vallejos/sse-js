
class EventSourcePolyfill {
    constructor(url, auth) {

    }

    close() {

    }
}

const EventSource = (typeof EventSource === 'undefined') ? EventSourcePolyfill : EventSource;

export { EventSource }
