exports.index = (req, res, next) => {

    //const products=productModel.list();
    res.render('accounts', {title:'Accounts'});
}