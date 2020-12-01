const productModel = require('../models/productModel');

exports.index = async(req, res, next) => {

    const products = await productModel.list();
    //footwears.cover_arr = [];
    products.forEach(element => {
        element.cover_arr = [];
        element.cover_arr.push(element.images[0]);
    });
    /*  console.log(products);
     console.log(products.cover_arr); */
    res.render('products', { title: 'Products', products });
}

exports.editrender = async(req, res, next) => {
    const id = req.params.id;
    const product = await productModel.findById(id);
    console.log(product);
    const size = product.size;
    var sizestr = size.join(",");
    /*  console.log(size);
     console.log(sizestr); */
    let men;
    let women;
    if (product.gender == "male") {
        men = "checked";
    } else {
        women = "checked";
    }
    res.render('products/update', { title: product.name, product, women, men, sizestr });
}

exports.upadate = async(req, res, next) => {
    var name = req.body.name;
    var sizestr = req.body.size;
    var price = req.body.price;
    var publisher = req.body.publisher;
    var gender = req.body.gridRadios;
    var images = req.body.images;
    var amount = req.body.amount;
    console.log(name);
    console.log(sizestr);
    console.log(price);
    console.log(publisher);
    console.log(gender);
    console.log(images);
    let men;
    let women;
    if (gender == "male" || gender == "men") {
        men = "checked";
    } else {
        women = "checked";
    }

    var footwear = {};
    var sizes = sizestr.split(',');
    footwear.name = name;
    footwear.amount = amount;
    footwear.size = sizes;
    footwear.price = price;
    footwear.publisher = publisher;
    footwear.images = images;
    footwear.gender = gender;

    console.log("Footwear");
    console.log(footwear);
    const id = req.params.id;

    await productModel.updateOne(footwear, id);

    const product = await productModel.findById(id);
    console.log(product);
    const size = product.size;
    var sizestr = size.join(",");
    res.render('products/update', { title: product.name, product, women, men, sizestr });
}