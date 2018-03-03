const varint = require('varint');
const { Marshaler } = require('./marshall');
const { Transport, UnpackStream } = require('./transport');
const log = require('debug')('rpc:client');

class Client {
    constructor($root) {
        this.$marshaler = new Marshaler($root);
    }

    connect(stream) {
        this.$stream = stream;
        this.$handler = new UnpackStream(this.$marshaler);
        return stream.pipe(this.$handler);
    }

    request(message) {
        var trx = Transport.pack(this.$marshaler.marshal(message), this.$stream);
        for(let idx = 1; idx < arguments.length; idx++) {
            this.$handler.on(trx, arguments[idx]);
        }
        return trx;
    }
}

module.exports = {
    Client: Client
}