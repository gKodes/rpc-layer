const varint = require('varint');
const { Marshaler } = require('./marshall');
const { EventEmitter } = require('events');
const { Transport, UnpackStream } = require('./transport');
const log = require('debug')('rpc:server');

const SYM_HANDLER = Symbol('handler');

class Server extends EventEmitter {
    constructor($root) {
        super();
        this.$marshaler = new Marshaler($root);
        this[SYM_HANDLER] = this[SYM_HANDLER].bind(this);
    }

    listen(stream) {
        stream.on('connection', (stream) => {
            stream.pipe(new UnpackStream(this.$marshaler)).on('data', this[SYM_HANDLER].bind(this, stream));
        });
    }

    handler(type, cb) {
        var eventName = this.$marshaler.getId(type);
        this.on(eventName, cb);
    }

    [SYM_HANDLER](stream, req) {
        var trx = req.trx;
        var message = req.message;
        log('debug %s, trx %d', (typeof req), trx)
        var eventName = this.$marshaler.getId(message);
        this.emit(eventName, {
            trx: trx,
            send: (message) => {
                log('response trx %d', trx)
                Transport.pack(this.$marshaler.marshal(message), stream, trx);
            }
        }, message);
    }
}

module.exports = {
    Server: Server
}