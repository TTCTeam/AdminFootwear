const bcrypt = require('bcrypt');
const { disabled } = require('../app');

const accountModel = require('../models/accountModel');
const productModel = require('../models/productModel');
const userServices = require('../models/user/userServices');


exports.updatePassword = async(req, res, next) => {
    const { password, newpassword } = req.body;
    const user = req.user;
    let check = await userServices.isCorrectPassword(password, user._id);
    const saltRounds = 5;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password_hash = bcrypt.hashSync(newpassword, salt);
    console.log(user);
    console.log(password);
    console.log(newpassword);
    console.log(password_hash);
    if (check) {
        await accountModel.updatePassword(password_hash, user._id);
        res.redirect('/login');
    } else {
        res.render('user/change_password', { title: "Admin Area | Change Pasowrd", message: "Wrong password.Please try again" })
    }

}

exports.editupadate = async(req, res, next) => {
    const id = req.params.id;
    let yourseflt = (id == req.user._id);
    const { displayname, type, gender, age, telephone, address, status } = req.body;
    if (yourseflt == true) {
        const newUser = {
            type,
            gender,
            age,
            telephone,
            address
        }
        newUser.fullname = displayname;
        console.log(newUser);
        await accountModel.updateOne(newUser, id);
    } else {
        await accountModel.updateStatus(id, status);
    }
    res.redirect('/accounts');
}

exports.editrender = async(req, res, next) => {
    const id = req.params.id;
    let yourseflt = (id == req.user._id);
    let edit = true;
    if (yourseflt == false) {
        yourseflt = "readonly";
        edit = false;
    } else {
        yourseflt = "";
    }

    console.log(id);
    const account = await userServices.findById(id);
    let user = "user",
        admin = "admin";
    let female = "",
        male = "";
    let type = "",
        gender = "";
    let blocked = "",
        active = "",
        actived = "";
    if (account.status == "blocked") {
        blocked = "checked";
    } else if (account.status == "active") {
        active = "checked";
    } else {
        actived = "checked";
    }
    if (yourseflt == "readonly") {
        type = gender = "disabled";
    }
    if (account.type == admin) {
        admin = "checked";
    } else {
        user = "checked";
    }
    if (account.gender == "men" || account.gender == "male") {
        male = "checked";
    } else {
        female = "checked";
    }
    let default_render = "disabled";
    console.log(account);

    res.render('user/add_user', { title: "Admin Area | Account Detail", account, edit, user, admin, male, female, gender, type, yourseflt, default_render, blocked, active, actived });
}


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