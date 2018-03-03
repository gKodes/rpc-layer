const assert = require('chai').assert;
const path = require('path');
const { Marshaler } = require('../src/marshall');
const protobuf = require("protobufjs");

describe('Marshaler with package', function () {

    describe('protobufjs runtime', function () {
        var marshaler;
        var Sample;

        before(() => {
            var $root = protobuf.loadSync(path.resolve(__dirname, './assets/marshall.with.package.proto'));
            marshaler = new Marshaler($root);
            Sample = $root.lookupType('sample.Sample');
        })

        it('has ids', () => assert.isNotEmpty(marshaler.ids));

        it('has only one id', () => assert.lengthOf(marshaler.ids, 1));

        it('has types', () => assert.isNotEmpty(marshaler.types));

        it('has only one type', () => assert.lengthOf(marshaler.types, 1));

        it('has Sample type', () => assert.include(marshaler.types, Sample));

        it('get typeId using Type', () => assert.isString(marshaler.getId(Sample)))

        it('get typeId using Type Instance', () => assert.isString(marshaler.getId(Sample.create({ uid: 1928 }))))

        it('isType should return true when passed in type', () => assert.isTrue(Marshaler.isType(Sample)));

        it('isType should return false when passed in Type instance ', () => assert.isFalse(Marshaler.isType(Sample.create({ uid: 1928 }))));

        describe('Type Sample', () => {
            let instance, rawBytes, trx = 998182;
            before(() => instance = Sample.create({ uid: 9219 }))

            it('encode', () => assert.isNotEmpty(marshaler.encode(instance)));

            it('marshal', () => assert.isNotEmpty(rawBytes = marshaler.marshal(instance, 998182)));

            it('unmarshal is same as original', () => assert.deepEqual(instance, marshaler.unmarshal(rawBytes)));
        })
    });


    describe('protobufjs commonjs', function () {
        var marshaler;
        var Sample;

        before(() => {
            var $root = require('./assets/marshall.with.package');
            marshaler = new Marshaler($root);
            Sample = $root.sample.Sample;
        })

        it('has ids', () => assert.isNotEmpty(marshaler.ids));

        it('has only one id', () => assert.lengthOf(marshaler.ids, 1));

        it('has types', () => assert.isNotEmpty(marshaler.types));

        it('has only one type', () => assert.lengthOf(marshaler.types, 1));

        it('has Sample type', () => assert.include(marshaler.types, Sample));

        it('get typeId using Type', () => assert.isString(marshaler.getId(Sample)))

        it('get typeId using Type Instance', () => assert.isString(marshaler.getId(Sample.create({ uid: 1928 }))))

        it('isType should return true when passed in type', () => assert.isTrue(Marshaler.isType(Sample)));

        it('isType should return false when passed in Type instance ', () => assert.isFalse(Marshaler.isType(Sample.create({ uid: 1928 }))));

        describe('Type Sample', () => {
            let instance, rawBytes, trx = 998182;
            before(() => instance = Sample.create({ uid: 9219 }))

            it('encode', () => assert.isNotEmpty(marshaler.encode(instance)));

            it('marshal', () => assert.isNotEmpty(rawBytes = marshaler.marshal(instance, 998182)));

            it('unmarshal is same as original', () => assert.deepEqual(instance, marshaler.unmarshal(rawBytes)));
        })
    });
});