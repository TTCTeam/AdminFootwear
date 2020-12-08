const { ObjectID } = require('mongodb');
const { db } = require('../dal/db');
var assert = require('assert')



exports.list = async() => {
    const productCollection = db().collection('Procduct');
    const product = await productCollection.find({}).toArray();
    console.log(product);
    return product;
}

exports.paging = async(filter, pageNumber, nPerPage) => {

    const product = await db().collection('Procduct').find(filter)
        .limit(nPerPage)
        .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
        .toArray();

    return product;
}
exports.count = async(filter) => {
    const productCollection = db().collection('Procduct');
    return await productCollection.find(filter).count();
}

exports.delete = async(id) => {
    const productCollection = db().collection('Procduct');
    await productCollection.deleteOne({ _id: ObjectID(id) }, function(err, result) {
        assert.strictEqual(null, err);
        console.log('Delete successful');
    });
}


exports.add = async(item) => {
    const productCollection = db().collection('Procduct');
    await productCollection.insertOne(item, function(err, result) {
        assert.strictEqual(null, err);
        console.log('Add successful');
    });
}

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
            brand: footwear.brand,
            gender: footwear.gender,
            size: footwear.size,
            images: footwear.images,
            discription: footwear.discription,
            manufacturer: footwear.manufacturer
        }
    });
}

exports.delete = async(id) => {
    const productCollection = db().collection('Procduct');
    await productCollection.deleteOne({ _id: ObjectID(id) }, function(err, result) {
        assert.strictEqual(null, err);
        console.log('Delete successful');
    });
}