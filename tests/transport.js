const assert = require('chai').assert;
const path = require('path');
const { Transport } = require('../src/transport');
const varint = require('varint');
const streams = require("memory-streams");

describe('Transport', function () {
    var data = Buffer.from('test message');
    var packedBytes, trx, sizeBytes, messageSize;

    describe('pack', () => {
        before(() => {
            var writer = new streams.WritableStream();
            trx = Transport.pack(data, writer);
            packedBytes = writer.toBuffer();
            messageSize = varint.decode(packedBytes);
            sizeBytes = varint.decode.bytes;
        });

        it('message exists in the packet', () => assert.isTrue(packedBytes.includes(data), 'content is not a part of the packet'));

        it('message is part of the packet', () => assert.isAbove(varint.decode(packedBytes), data.length));

        it('trx is followed by payload size', () => assert.equal(varint.decode(packedBytes, sizeBytes), trx));
    });

    describe('unpack', () => {
        let unpacked, untrx;
        before((done) => {
            let messageRaw = Buffer.alloc(messageSize);
            packedBytes.copy(messageRaw, 0, sizeBytes);
            Transport.unpack(messageRaw, (trx, message) => {
                unpacked = message;
                untrx = trx;
                done();
            });
        });

        it('content is same as orginal', () => assert.equal(0, data.indexOf(unpacked)));

        it('content size is same as orginal size', () => assert.equal(data.length, unpacked.length));

        it('trx is same as orginal', () => assert.equal(trx, untrx));
    });
});