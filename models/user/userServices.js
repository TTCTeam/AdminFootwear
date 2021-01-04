const { ObjectID } = require('mongodb');
//const bcrypt = require('bcrypt');
const { db } = require('../../dal/db');
const { paging } = require('../productModel');

exports.count = async(filter) => {
    const productCollection = db().collection('Procduct');
    return await productCollection.find(filter).count();
}

exports.findById = async(id) => {

    const accountCollection = db().collection('Account');
    const account = await accountCollection.findOne({
        _id: ObjectID(id)
    });
    return account;
}
exports.product_paging = async(filter, pageNumber, nPerPage, sort) => {

    sort = sort || 1;
    sort = parseInt(sort);

    const product = await db().collection('Procduct').find(filter).sort({ name: sort })
        .limit(nPerPage)
        .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
        .toArray();

    return product;
}