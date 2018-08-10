# sse-js
Server-Sent Events JavaScript Library

This is a small JavaScript client to handle Server-Sent Events. It is not the server, only the client.
This singleton class exposes a few methods to subscribe to events, unsubscribe, and close an active connection.
Additional methods to enable/disable debug mode are available. In debug mode, some information will be output to the console.

See below instructions to install and use the library.

# Installation
```
npm i --save sse-js
```

# Examples and Documentation

#### Node.js
```
const SSE = require('sse-js');

const client = new SSE(url);
Object.freeze(client);

export default client;
```

#### Browser
```
<script src="dist/sse-js.min.js"></script>
<script>
    const sseClient = new SSE(url);
    Object.freeze(sseClient);

    export default sseClient;
</script>
```

#### constructor
```
const sseClient = new SSE(url, withCredentials, debug);
```
Parameters:
- url: {string} an URL or path to the server sending the events. The client will establish a connection to this url.
- withCredentials: {boolean} indicates wheter to use credentials or not
- debug: {boolean} a boolean indicating whether to enable debug mode or not

#### close connection
```
close();
```

#### subscribe to an event
```
const subscriberId = subscribe(cb, event, error);
```
The subscribe method will return a unique ID (a string). This ID can be used later to call the unsubscribe mehtod.
Parameters:
- cb: {function} a callback function that will be run when an event is matched - required
- event: {string|null} the name of the event or `null` to subscribe to all events
- error: {function} a callback function that will be run when an error occurs

#### unsubscribe from events
```
unsubscribe(subscriberId);
```
Parameters:
- subscriberId: {string} a unique subscriber ID (returned from the subscribe method)

#### enable debug
```
enableDebug();
```

#### disable debug
```
disableDebug();
```

# Contributing
All PRs are welcome :)

# LICENSE
MIT
