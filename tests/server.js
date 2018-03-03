const assert = require('chai').assert;
const path = require('path');
const protobuf = require("protobufjs");
const streams = require("memory-streams");
const net = require('net');
const { Client } = require('../src/client');
const { Server } = require('../src/server');

describe('Server', function() {
    var server, client, instance, writer, $root, Sample;

    before(() => {
        let port = 1000 + Math.round(Math.random() * 1000);
        server = net.createServer();

        server.listen(port);
        writer = net.createConnection(port);

        $root = protobuf.loadSync(path.resolve(__dirname, './assets/marshall.proto'))
        Sample = $root.lookupType('Sample');
        client = new Client($root);

        instance = new Server($root);
        instance.listen(server);
        instance.handler(Sample, (res, message) => {
            message.uid++;
            res.send(message);
        });
    });

    after(() => {
        writer.destroy();
        server.close();
    });

    
    it('invoke handler and recive response', (done) => {
        let sample = Sample.create({uid: 2813});
        client.connect(writer);
        var trx = client.request(sample, (bounce) => {
            assert.equal(sample.uid + 1, bounce.uid);
            done();
        });
    });
});