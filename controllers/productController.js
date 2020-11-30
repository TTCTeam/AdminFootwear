//const productModel=require('../models/productModel');

exports.index = (req, res, next) => {

    //const products=productModel.list();
    res.render('products', {title:'Products'});
}