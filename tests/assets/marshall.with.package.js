/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots.pkgs || ($protobuf.roots.pkgs = {});

$root.sample = (function() {

    /**
     * Namespace sample.
     * @exports sample
     * @namespace
     */
    var sample = {};

    sample.Sample = (function() {

        /**
         * Properties of a Sample.
         * @memberof sample
         * @interface ISample
         * @property {number|null} [uid] Sample uid
         */

        /**
         * Constructs a new Sample.
         * @memberof sample
         * @classdesc Represents a Sample.
         * @implements ISample
         * @constructor
         * @param {sample.ISample=} [properties] Properties to set
         */
        function Sample(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Sample uid.
         * @member {number} uid
         * @memberof sample.Sample
         * @instance
         */
        Sample.prototype.uid = 0;

        /**
         * Creates a new Sample instance using the specified properties.
         * @function create
         * @memberof sample.Sample
         * @static
         * @param {sample.ISample=} [properties] Properties to set
         * @returns {sample.Sample} Sample instance
         */
        Sample.create = function create(properties) {
            return new Sample(properties);
        };

        /**
         * Encodes the specified Sample message. Does not implicitly {@link sample.Sample.verify|verify} messages.
         * @function encode
         * @memberof sample.Sample
         * @static
         * @param {sample.ISample} message Sample message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Sample.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.uid != null && message.hasOwnProperty("uid"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.uid);
            return writer;
        };

        /**
         * Encodes the specified Sample message, length delimited. Does not implicitly {@link sample.Sample.verify|verify} messages.
         * @function encodeDelimited
         * @memberof sample.Sample
         * @static
         * @param {sample.ISample} message Sample message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Sample.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Sample message from the specified reader or buffer.
         * @function decode
         * @memberof sample.Sample
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {sample.Sample} Sample
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Sample.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.sample.Sample();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.uid = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Sample message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof sample.Sample
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {sample.Sample} Sample
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Sample.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Sample message.
         * @function verify
         * @memberof sample.Sample
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Sample.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.uid != null && message.hasOwnProperty("uid"))
                if (!$util.isInteger(message.uid))
                    return "uid: integer expected";
            return null;
        };

        /**
         * Creates a Sample message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof sample.Sample
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {sample.Sample} Sample
         */
        Sample.fromObject = function fromObject(object) {
            if (object instanceof $root.sample.Sample)
                return object;
            var message = new $root.sample.Sample();
            if (object.uid != null)
                message.uid = object.uid | 0;
            return message;
        };

        /**
         * Creates a plain object from a Sample message. Also converts values to other types if specified.
         * @function toObject
         * @memberof sample.Sample
         * @static
         * @param {sample.Sample} message Sample
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Sample.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.uid = 0;
            if (message.uid != null && message.hasOwnProperty("uid"))
                object.uid = message.uid;
            return object;
        };

        /**
         * Converts this Sample to JSON.
         * @function toJSON
         * @memberof sample.Sample
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Sample.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Sample;
    })();

    return sample;
})();

module.exports = $root;
