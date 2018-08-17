import { expect } from 'chai';
import { SSE } from './sse-js';

describe('SSE class', () => {
    test('should have all methods defined', () => {
        const client = new SSE('stream');

        expect(typeof client.close).to.equal('function');
        expect(typeof client.subscribe).to.equal('function');
        expect(typeof client.unsubscribe).to.equal('function');
        expect(typeof client.enableDebug).to.equal('function');
        expect(typeof client.disableDebug).to.equal('function');
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
    test('should close the connection', () => {
        const client = () => new SSE('/stream');
        const result = client.close();
        expect(result).to.equal(true);
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
