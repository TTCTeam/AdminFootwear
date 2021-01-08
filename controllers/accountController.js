const accountModel = require('../models/accountModel');
const productModel = require('../models/productModel');

// exports.index = async(req, res, next) => {

//     var pageNumber = req.query.page || 1;
//     const filter = {};

//     var searchName = "";
//     if (req.query.q != undefined) {
//         searchName = req.query.q;
//     }

//     filter.username = { $regex: searchName, $options: "$i" };

//     const nPerPage = 6;
//     let totalAccount = 0;

//     const accounts = await accountModel.paging(filter, pageNumber, nPerPage);

//     totalAccount = await accountModel.count(filter);

//     let pagination = {
//         page: pageNumber, // The current page the user is on
//         pageCount: Math.ceil(totalAccount / nPerPage) // The total number of available pages
//     }

//     console.log(accounts);

//     res.render('accounts', { title: 'Accounts', accounts, pagination });
// }

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

    res.render('accounts', { title: 'Products', accounts, pagination, totalProduct, totalAccount });
}