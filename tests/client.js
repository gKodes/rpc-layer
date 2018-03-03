const assert = require('chai').assert;
const path = require('path');
const protobuf = require("protobufjs");
const streams = require("memory-streams");
const net = require('net');
const { Client } = require('../src/client');

describe('Client', function() {
    var server, instance, writer, $root, Sample;

    before(() => {
        let port = 1000 + Math.round(Math.random() * 1000);
        server = net.createServer((socket) => {
            socket.on('data', function(data) {
                socket.write(data);
            });
        });

        server.listen(port);
        writer = net.createConnection(port);

        $root = protobuf.loadSync(path.resolve(__dirname, './assets/marshall.proto'))
        Sample = $root.lookupType('Sample');
        instance = new Client($root);
    });

    after(() => {
        writer.destroy();
        server.close();
    });

    
    it('sends the message and recive the same message back', (done) => {
        let sample = Sample.create({uid: 2813});
        instance.connect(writer);
        var trx = instance.request(sample, (bounce) => {
            assert.deepEqual(sample, bounce);
            done();
        });
    });
});