const accountModel = require('../models/accountModel');

exports.index = async (req, res, next) => {

    var pageNumber = req.query.page || 1;
    const filter = {};

    var searchName = "";
    if (req.query.q != undefined) {
        searchName = req.query.q;
    }

    filter.username = { $regex: searchName, $options: "$i" };

    const nPerPage = 6;
    let totalAccount = 0;

    const accounts = await accountModel.paging(filter, pageNumber, nPerPage);

    totalAccount = await accountModel.count(filter);

    let pagination = {
        page: pageNumber, // The current page the user is on
        pageCount: Math.ceil(totalAccount / nPerPage) // The total number of available pages
    }
    
    console.log(accounts);

    res.render('accounts', {title:'Accounts', accounts, pagination});
}