const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt');
const { db } = require('../../dal/db');
const { paging } = require('../productModel');

exports.isCorrectPassword = async(password, id) => {
    const accountCollection = db().collection('Account');
    const account = await accountCollection.findOne({
        _id: ObjectID(id)
    });
    if (account) {
        const check = await bcrypt.compareSync(password, account.password);
        if (check) {
            return true;
        }
    }
    return false;
}

exports.checkCredential = async(usernameOrEmail, password) => {
    const accountCollection = db().collection('Account');
    let err = 1;
    const hasEmail = await accountCollection.findOne({
        email: usernameOrEmail,
        type: "admin"
    });
    const hasUsername = await accountCollection.findOne({
        username: usernameOrEmail,
        type: "admin"
    });
    let user = hasEmail || hasUsername;
    if (user) {
        const check = await bcrypt.compareSync(password, user.password);
        if (!check) {
            return err = 0;
        } else if (user.status == "blocked") {
            return err = -1;
        }
    }
    return user;
}

exports.isUsernameExist = async(username) => {
    const accountCollection = db().collection('Account');
    const account = await accountCollection.findOne({
        username: username
    });
    return (account == undefined) ? false : true;
}

exports.isEmailExist = async(email) => {
    const accountCollection = db().collection('Account');
    const account = await accountCollection.findOne({
        email: email
    });
    return (account == undefined) ? false : true;
}

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