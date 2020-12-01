const { ObjectID } = require('mongodb');
const { db } = require('../dal/db');
var assert = require('assert')


exports.list = async () => {
    const productCollection = db().collection('Procduct');
    const product = await productCollection.find({}).toArray();
    console.log(product);
    return product;
}


exports.add = async (item) => {
    const productCollection = db().collection('Procduct');
    await productCollection.insertOne(item, function (err, result) {
        assert.strictEqual(null, err);
        console.log('Add successful');
    });

}