const { ObjectID } = require('mongodb');
const { db } = require('../dal/db');
var assert = require('assert')

exports.list = async() => {
    const accountCollection = db().collection('Account');
    const account = await accountCollection.find({}).toArray();
    return account;
}

exports.paging = async(filter, pageNumber, nPerPage) => {

    const account = await db().collection('Account').find(filter)
        .limit(nPerPage)
        .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0)
        .toArray();

    return account;
}

exports.count = async(filter) => {
    const accountCollection = db().collection('Account');
    return await accountCollection.find(filter).count();
}