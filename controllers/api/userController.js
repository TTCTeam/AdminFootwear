const userServices = require('../../models/user/userServices');

exports.checkValidPassword = async(req, res, next) => {

    res.json(await userServices.isCorrectPassword(req.query.password, req.user._id));
}

exports.accountExist_Username = async(req, res, next) => {
    res.json(await userServices.isUsernameExist(req.query.username));

}

exports.accountExist_Email = async(req, res, next) => {
    res.json(await userServices.isEmailExist(req.query.email));

}

exports.productsPaging = async(req, res, next) => {
    var pageNumber = req.query.page || 1;
    //ten color brand style material price
    const filter = req.query.filter || {};
    let sort = req.query.sort || 1;
    sort = parseInt(sort);
    console.log(filter);
    console.log("Gia tri sort nhan vao ne: ");
    console.log(sort);

    var searchName = "";
    if (req.query.q != undefined) {
        searchName = req.query.q;
    }

    filter.name = { $regex: searchName, $options: "$i" };


    const nPerPage = 9;


    let totalProduct = await userServices.count(filter);
    let totalPage = Math.ceil(totalProduct / nPerPage);
    pageNumber = (pageNumber > totalPage) ? totalPage : pageNumber;
    pageNumber = parseInt(pageNumber);
    //Get footwear from model
    const footwears = await userServices.product_paging(filter, pageNumber, nPerPage, sort);
    //footwears.cover_arr = [];
    footwears.forEach(element => {
        element.cover_arr = [];
        element.cover_arr.push(element.images[0]);

    });
    console.log("footwears");
    console.log(footwears);
    var limit = (totalPage > 5) ? 5 : totalPage;
    //console.log(limit);
    let n = parseInt(pageNumber / limit);
    let page = [];
    console.log(n);
    let mid = (pageNumber % limit == 0) ? limit : (pageNumber - n * limit);
    for (let i = 0; i < mid; i++) {
        if (pageNumber % limit == 0) {
            page.push((n - 1) * limit + 1 + i);
        } else {
            page.push(n * limit + 1 + i);
        }


    }
    console.log(page);

    if (pageNumber % limit != 0) {
        for (let j = pageNumber - n * limit; j < limit; j++) {
            if (n * limit + 1 + j > totalPage) break;
            page.push(n * limit + 1 + j);

        }
    }


    let active = [];
    for (let k = 0; k < page.length; k++) {
        active.push("disable");
    }
    console.log(active);

    let index = page.indexOf(pageNumber);
    console.log(index);
    active[index] = "active";


    let paginate = [];
    let pagination = {};
    for (let h = 0; h < page.length; h++) {
        paginate[h] = {};
        paginate[h].page = page[h];
        paginate[h].active = active[h];
    }

    console.log(paginate);
    pagination.paginate = paginate;
    pagination.previousPage = (pageNumber == 1) ? 1 : pageNumber - 1;
    pagination.nextPage = (pageNumber == totalPage) ? pageNumber : pageNumber + 1;
    pagination.totalPage = totalPage;
    let products = {};
    products.footwears = footwears;
    products.pagination = pagination;

    res.json(products);
}

exports.accountsPaging = async(req, res, next) => {
    var pageNumber = req.query.page || 1;
    const filter = {};

    var searchName = "";
    if (req.query.q != undefined) {
        searchName = req.query.q;
    }

    filter.username = { $regex: searchName, $options: "$i" };

    const nPerPage = 6;
    let totalAccount = await accountModel.count(filter);
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

    let data = {};
    data.pagination = pagination;
    data.accounts = accounts;
    res.json(data);
}