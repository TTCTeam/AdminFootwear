const bcrypt = require('bcrypt');

const accountModel = require('../models/accountModel');
const productModel = require('../models/productModel');

exports.addNewAccount = async(req, res, next) => {
    const { displayname, username, email, password, type } = req.body;

    const newUser = {
        username,
        email,
        password,
        type
    }
    newUser.fullname = displayname;

    const saltRounds = 18;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(newUser.password, salt);
    newUser.password = hash;
    newUser.age = "2000";
    newUser.telephone = "+84..";
    newUser.gender = "";
    newUser.address = "";
    newUser.avatar = "/images/users/user.png";
    newUser.status = "active";
    newUser.code = 0;
    newUser.time = new Date();
    console.log(newUser);

    await accountModel.addNewAccount(newUser);

    res.render('user/add_user', { title: "Add Account", message: "This account was added successfully! Continue to add another account." })

}

exports.index = async(req, res, next) => {
    var pageNumber = req.query.page || 1;
    const filter = {};

    var searchName = "";
    if (req.query.q != undefined) {
        searchName = req.query.q;
    }

    filter.username = { $regex: searchName, $options: "$i" };

    const nPerPage = 6;
    let totalAccount = await accountModel.count({});
    let totalProduct = await productModel.count({});
    let totalPage = Math.ceil(totalAccount / nPerPage);
    pageNumber = (pageNumber > totalPage) ? totalPage : pageNumber;
    pageNumber = parseInt(pageNumber);

    const accounts = await accountModel.paging(filter, pageNumber, nPerPage);

    var limit = (totalPage > 5) ? 5 : totalPage;
    //console.log(limit);
    let n = parseInt(pageNumber / limit);
    let page = [];

    let mid = (pageNumber % limit == 0) ? limit : (pageNumber - n * limit);
    for (let i = 0; i < mid; i++) {
        if (pageNumber % limit == 0) {
            page.push((n - 1) * limit + 1 + i);
        } else {
            page.push(n * limit + 1 + i);
        }


    }


    if (pageNumber % limit != 0) {
        for (let j = pageNumber - n * limit; j < limit; j++) {
            if (n * limit + 1 + j > totalPage) break;
            page.push(n * limit + 1 + j);

        }
    }


    let active = [];
    for (let k = 0; k < page.length; k++) {
        active.push("");
    }
    console.log(active);

    let index = page.indexOf(pageNumber);

    active[index] = "active";


    let paginate = [];
    let pagination = {};
    for (let h = 0; h < page.length; h++) {
        paginate[h] = {};
        paginate[h].page = page[h];
        paginate[h].active = active[h];
    }


    pagination.paginate = paginate;
    pagination.previousPage = (pageNumber == 1) ? 1 : pageNumber - 1;
    pagination.nextPage = (pageNumber == totalPage) ? pageNumber : pageNumber + 1;
    pagination.totalPage = totalPage;

    res.render('accounts', { title: 'Accounts', accounts, pagination, totalProduct, totalAccount });
}