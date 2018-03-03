const { createHash } = require('crypto');
const traverse = require('traverse');
const log = require('debug')('rpc:marshaler');

const PATH_DELM = '.';
const HASH_TYPE = 'sha256';
const HASH_DIGEST = 'hex';
const HASH_SIZE = 32;
const TYPE_STRING = 'string';
const STR_NESTED = 'nested';
const STR_NESTEDARRAY = '_nestedArray';

/**
 * Checks if value is classified as a Function object.
 * 
 * @param {*} value The value to check
 * @returns {boolean} Returns true if value is a function, else false
 */
function isFunction(value) {
    return typeof (value) === 'function';
}

class Marshaler {
    constructor($root) {
        var index = { types: [], ids: [] }
        var cjsRoot = !isFunction($root.load);

        traverse((cjsRoot && $root) || $root.nested).forEach((function (node) {
            if ((cjsRoot || Marshaler.isValidPath(this.path)) && !this.circular && Marshaler.isType(node)) {

                let nodePath = this.path.join(PATH_DELM);
                let nodeId = Marshaler.createHash(nodePath);

                index.types.push(node);
                index.ids.push(nodeId);

                log('Added %s with Id %s', nodePath, nodeId);
            }
        }));

        this.ids = index.ids;
        this.types = index.types;
    }

    getId(type) {
        if (!isFunction(type) && !type.name) {
            type = type.$type || type.__proto__.constructor;
        }
        return this.ids[this.types.indexOf(type)];
    }

    getType(typeId) {
        if (typeof typeId === TYPE_STRING) {
            return this.types[this.ids.indexOf(typeId)];
        }

        return (typeId.$type || typeId.__proto__.constructor) || undefined;
    }

    encode(source) {
        var type = this.getType(source);
        return type.encode(source).finish();
    }

    marshal(srouce) {
        if( !srouce ) {
            throw Error('illegal type for srouce')
        }

        var typeId = this.getId(srouce);

        if( !typeId ) {
            throw Error('could not determine typeId')
        }

        var content = this.encode(srouce);
        var contentBytes = content.length;
        var bytes = Buffer.alloc(HASH_SIZE + contentBytes);

        log('marshal: Data Bytes %d', contentBytes);

        bytes.write(typeId, 0, HASH_DIGEST);
        content.copy(bytes, HASH_SIZE);

        return bytes;
    }

    unmarshal(data) {
        if (!(data instanceof Buffer)) {
            throw Error('illegal buffer for data argument');
        }

        var typeId = data.toString(HASH_DIGEST, 0, HASH_SIZE);
        var type = this.getType(typeId);
        var dataBytes = data.length;

        log('unmarshal: Data Bytes %d', dataBytes);

        if (type) {
            let rawContent = new Uint8Array(dataBytes - HASH_SIZE);
            data.copy(rawContent, 0, HASH_SIZE);
            return type.decode(rawContent);
        }
    }

    /**
     * Create a hash for the give value
     * 
     * @param {string} value 
     * @returns {string} sha256 hashed value
     */
    static createHash(value) {
        return createHash(HASH_TYPE).update(value).digest(HASH_DIGEST);
    }

    static isValidPath(path) {
        return !~path.indexOf(STR_NESTEDARRAY) && (!~path.lastIndexOf(STR_NESTED, 1) ||
            ((path.lastIndexOf(STR_NESTED) - path.indexOf(STR_NESTED)) === 1));
    }

    /**
     * Checks if value is classified as a Type instance.
     * 
     * @param {Object} value 
     */
    static isType(value) {
        return value && isFunction(value.create);
    }
}

module.exports = {
    Marshaler: Marshaler
}