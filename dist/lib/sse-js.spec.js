'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _chai = require('chai');

var _sseJs = require('./sse-js');

describe('SSE class', function () {
    test('should have all methods defined', function () {
        var client = new _sseJs.SSE('stream');

        (0, _chai.expect)(_typeof(client.close)).to.equal('function');
        (0, _chai.expect)(_typeof(client.subscribe)).to.equal('function');
        (0, _chai.expect)(_typeof(client.unsubscribe)).to.equal('function');
        (0, _chai.expect)(_typeof(client.enableDebug)).to.equal('function');
        (0, _chai.expect)(_typeof(client.disableDebug)).to.equal('function');
    });

    // it ('should throw a proper error if no url is specified to the constructor', () => {
    //     expect(() => new SSE()).to.throw(Error, 'A valid URL is required to open the EventSource connection');
    //     expect(() => new SSE('/stream')).to.not.throw(Error);
    // });
    //
    // it ('should enable debug mode in constructor', () => {
    //     const client = () => new SSE('/stream', false, true);
    //     expect(client).to.not.throw(Error);
    // });
    //
    test('should close the connection', function () {
        var client = function client() {
            return new _sseJs.SSE('/stream');
        };
        var result = client.close();
        (0, _chai.expect)(result).to.equal(true);
    });
    //
    // it ('should close the connection', () => {
    //     const client = () => new SSE();
    //     const result = client.close();
    //     expect(result).to.equal(false);
    // });
    //
    // it ('should enable debug mode', () => {
    //     const client = () => new SSE('/stream');
    //     const result = client.enableDebug;
    //     expect(result).to.equal(true);
    // });
    //
    // it ('should disable debug mode', () => {
    //     const client = () => new SSE('/stream', false, true);
    //     const result = client.disableDebug;
    //     expect(result).to.equal(false);
    // });
});