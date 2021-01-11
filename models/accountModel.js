const { ObjectID } = require('mongodb');
const { db } = require('../dal/db');
var assert = require('assert')

exports.updateStatus = async(id, status_string) => {
    const accountCollection = db().collection('Account');
    await accountCollection.updateOne({ _id: ObjectID(id) }, {
        $set: {
            status: status_string
        }
    });
}


exports.updatePassword = async(newpassword, id) => {
    const productCollection = db().collection('Account');
    await productCollection.updateOne({ _id: ObjectID(id) }, {
        $set: {
            password: newpassword
        }
    });
}

exports.updateOne = async(account, id) => {
    const productCollection = db().collection('Account');
    await productCollection.updateOne({ _id: ObjectID(id) }, {
        $set: {
            fullname: account.fullname,
            telephone: account.telephone,
            age: account.age,
            address: account.address,
            gender: account.gender,
            type: account.type
        }
    });
}

exports.addNewAccount = async(newUser) => {
    const accountCollection = db().collection('Account');

    await accountCollection.insertOne(newUser, function(err, result) {
        assert.strictEqual(null, err);
        console.log('Add successful');
    });

}

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