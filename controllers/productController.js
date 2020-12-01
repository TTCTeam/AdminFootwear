const productModel = require('../models/productModel');

exports.index = async (req, res, next) => {

    const products = await productModel.list();
    //footwears.cover_arr = [];
    products.forEach(element => {
        element.cover_arr = [];
        try {
            element.cover_arr.push(element.images[0]);
        } catch (error) {
            
        }
    });
    console.log(products);
    console.log(products.cover_arr);
    res.render('products', { title: 'Products', products });
}


exports.add_get = (req, res, next) => {

    res.render('addproduct', {});
}

exports.add = async (req, res, next) => {
    const item = {
        name: req.body.name,
        price: req.body.price,
        publisher: req.body.publisher
    };

    productModel.add(item);
    //res.render('addproduct', {});
    res.redirect('/products');
}
