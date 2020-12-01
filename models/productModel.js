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

exports.findById = async(id) => {

    const productCollection = db().collection('Procduct');
    const product = await productCollection.findOne({
        _id: ObjectID(id)
    });
    return product;
}

exports.updateOne = async(footwear, id) => {
    const productCollection = db().collection('Procduct');
    await productCollection.updateOne({ _id: ObjectID(id) }, {
        $set: {
            name: footwear.name,
            price: footwear.price,
            amount: footwear.amount,
            publisher: footwear.publisher,
            gender: footwear.gender,
            size: footwear.size,
            images: footwear.images
        }
    });

}}