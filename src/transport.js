const varint = require('varint');
const { Transform } = require('stream');
const log = require('debug')('rpc:transport');

/**
 * Copies data from a region of source to a region in target.
 * 
 * @param {Buffer|Array} source A Buffer or Array to copy from.
 * @param {Buffer|Array} target A Buffer or Array to copy into.
 * @param {number} targetStart The offset within target at which to begin copying to.
 * @param {number} sourceStart The offset within buf at which to begin copying from.
 * @param {number} sourceEnd The offset within buf at which to stop copying (not inclusive).
 */
function copy(source, target, targetStart, sourceStart, sourceEnd) {
    targetStart = targetStart || 0;
    sourceStart = sourceStart || 0;
    sourceEnd = sourceEnd || source.length;
    while (sourceStart < sourceEnd) { target[targetStart++] = source[sourceStart++]; }
}

const Transport = {};

/**
 * 
 * @param {*} data 
 * @param {net.Socket|stream.Writable|stream.Duplex} stream
 * @param {number=} trx transaction identifier
 * @returns {number} trx number assigned for this packet 
 */
Transport.pack = function pack(data, stream, trx) {
    if (!(data instanceof Buffer)) {
        throw Error('illegal buffer for data argument');
    }

    trx = trx || Transport.trxId();
    var trxRaw = varint.encode(trx);
    var trxBytes = varint.encode.bytes;
    var sizeRaw = varint.encode(trxBytes + data.length);
    var sizeBytes = varint.encode.bytes;
    var headerRaw = Buffer.alloc(trxBytes + sizeBytes);

    log('pack: trx %d, trxBytes: %d, sizeBytes: %d, messageBytes %d', trx, trxBytes, sizeBytes, data.length);

    copy(sizeRaw, headerRaw);
    copy(trxRaw, headerRaw, sizeBytes);

    stream.write(headerRaw);
    stream.write(data);

    return trx;
};

/**
 * Callback for Transport.unpack
 * 
 * @callback {Transport~Unpacked}
 * @param {number} trx
 * @param {Object} message
 */

/**
 * 
 * @param {Buffer} packet
 * @param {Transport~Unpacked} cb 
 * @returns {Buffer} the message inside the packet
 */
Transport.unpack = function unpack(packet, cb) {
    if (!(packet instanceof Buffer)) {
        throw Error('illegal buffer for data argument');
    }

    var trx = varint.decode(packet);
    var trxBytes = varint.decode.bytes;
    var message = Buffer.alloc(packet.length - trxBytes);

    log('unpack: trx: %d, trxBytes: %d', trx, trxBytes);
    packet.copy(message, 0, trxBytes);

    cb(trx, message);
    return trx;
}

/**
 * 
 * @returns {number} an radom number used as transaction
 */
Transport.trxId = function trxId() {
    return Math.abs(Date.now() | Math.random());
}

const SYM_REMNANT = Symbol('remnant');

class UnpackStream extends Transform {
    /**
     * 
     * @param {Marshaler} $marshaler 
     */
    constructor($marshaler) {
        super({
            readableObjectMode: true
        });
        this.$marshaler = $marshaler;
        this.$unmarshal = this.unmarshal.bind(this);
    }

    _transform(chunk, encoding, callback) {
        var remnant = this[SYM_REMNANT];
        if( remnant ) {
            log('Update buffer with remnant');
            chunk = Buffer.concat([remnant, chunk]);
        }

        var chunkLength = chunk.length;
        var offset = 0;
        try {
            while( offset < chunkLength ) {
                let size = varint.decode(chunk, offset);
                let sizeBytes = varint.decode.bytes;

                log('Size %d, Size Bytes %d, Offset %s, Chunk Bytes %d', size, sizeBytes, offset, chunkLength);

                if( (sizeBytes + size) > chunkLength )
                    break;

                //TODO: Add Logic to prevent buffer overflow attacks
                if( size < 1 && size > Number.MAX_SAFE_INTEGER ) {
                    log('UnpackStream._transform: Probably an buffer overflow attack, Size %d', size);
                    return callback();
                }

                let payLoad = Buffer.alloc(size);

                chunk.copy(payLoad, 0, offset + sizeBytes);
                offset += (size + sizeBytes);

                Transport.unpack(payLoad, this.$unmarshal);
            }
        } catch (err) { console.info(err); }

        if( offset < chunkLength ) {
            remnant = Buffer.alloc(chunkLength - offset);
            log('remnant size %d', remnant.length);
            chunk.copy(remnant, 0, offset);
            this[SYM_REMNANT] = remnant;
        } else { remnant = undefined; }

        this[SYM_REMNANT] = remnant;
        callback();
    }

    unmarshal(trx, message) {
        var messageObj = this.$marshaler.unmarshal(message);
        this.push({trx: trx, message: messageObj});
        this.emit(trx, messageObj);
    }
}

module.exports = {
    Transport: Transport,
    UnpackStream: UnpackStream
}