const productModel = require('../models/productModel');

exports.index = async(req, res, next) => {

    const products = await productModel.list();
    //footwears.cover_arr = [];
    products.forEach(element => {
        element.cover_arr = [];
        element.cover_arr.push(element.images[0]);
    });
    console.log(products);
    console.log(products.cover_arr);
    res.render('products', { title: 'Products', products });
}