const formidable = require('formidable');
const fs = require('fs');
const mv = require('mv');

const productModel = require('../models/productModel');


exports.index = async(req, res, next) => {
    var pageNumber = req.query.page || 1;
    const filter = {};

    var searchName = "";
    if (req.query.q != undefined) {
        searchName = req.query.q;
    }

    filter.name = { $regex: searchName, $options: "$i" };

    const nPerPage = 10;
    let totalProduct = 0;
    console.log(filter);
    console.log(pageNumber);
    console.log(nPerPage);

    const products = await productModel.paging(filter, pageNumber, nPerPage);
    //footwears.cover_arr = [];
    products.forEach(element => {
        element.cover_arr = [];
        try {
            element.cover_arr.push(element.images[0]);
        } catch (error) {
            console.log(error);
        }
    });

    totalProduct = await productModel.count(filter);


    let pagination = {
            page: pageNumber, // The current page the user is on
            pageCount: Math.ceil(totalProduct / nPerPage) // The total number of available pages
        }
        /*  console.log(products);
         console.log(products.cover_arr); */
    res.render('products', { title: 'Products', products, pagination });
}

exports.add_get = (req, res, next) => {

    res.render('addproduct', {});
}

exports.delete = async(req, res, next) => {
    var id = req.params.id;

    await productModel.delete(id);
    res.redirect('/products');
}

exports.add = async(req, res, next) => {
    const item = {
        name: req.body.name,
        price: req.body.price,
        publisher: req.body.publisher
    };

    productModel.add(item);
    //res.render('addproduct', {});
    res.redirect('/products');
}
exports.editrender = async(req, res, next) => {
    const id = req.params.id;
    const product = await productModel.findById(id);

    const discription = product.description.p;
    const arr = [];
    discription.forEach(element => {
        arr.push(element);
    });
    const predescription = arr.join("");
    console.log(predescription);

    console.log(product.manufacturer);
    const manufacturer = product.manufacturer.p;
    const arr1 = [];
    manufacturer.forEach(element => {
        arr1.push(element);
    });
    const premanufacturer = arr1.join("");

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
    res.render('products/update', { title: product.name, product, women, men, sizestr, predescription, premanufacturer });
}

exports.upadate = async(req, res, next) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        var p1 = [];
        p1 = fields.discription.split(".");
        fields.discription = {};
        fields.discription.p = p1;

        var p2 = [];
        p2 = fields.manufacturer.split(".");
        fields.manufacturer = {};
        fields.manufacturer.p = p2;

        var size = [];
        size = fields.size.split(",");
        fields.size = [];
        fields.size = size;

        var images = [];

        images.push(fields.images0);
        images.push(fields.images1);
        images.push(fields.images2);
        images.push(fields.images3);

        const imagesfile0 = files.imagesfile0;
        const imagesfile1 = files.imagesfile1;
        const imagesfile2 = files.imagesfile2;
        const imagesfile3 = files.imagesfile3;
        if (imagesfile0 && imagesfile0.size > 0) {
            var fileName = imagesfile0.path.split('\\').pop() + '.' + imagesfile0.name.split('.').pop();
            console.log(fileName);

            mv(imagesfile0.path, process.env.FOOTWEAR_FOLDER_IMAGES + '\\' + fileName, function(error) {
                if (error) throw error;

            });
            /* mv(imagesfile0.path, process.env.ADMINFOOTWEAR_FOLDER_IMAGES + '\\' + fileName, function(error) {
                if (error) throw error;

            }); */
            images[0] = '/images/Footwear/' + fileName;
            console.log(images[0]);
        }
        if (imagesfile1 && imagesfile1.size > 0) {
            var fileName = imagesfile1.path.split('\\').pop() + '.' + imagesfile1.name.split('.').pop();
            mv(imagesfile1.path, process.env.FOOTWEAR_FOLDER_IMAGES + '\\' + fileName, function(error) {
                if (error) throw error;

            });
            /* mv(imagesfile1.path, process.env.ADMINFOOTWEAR_FOLDER_IMAGES + '\\' + fileName, function(error) {
                if (error) throw error;

            }); */
            images[1] = '/images/Footwear/' + fileName;
            console.log(images[1]);
        }
        if (imagesfile2 && imagesfile2.size > 0) {
            var fileName = imagesfile2.path.split('\\').pop() + '.' + imagesfile2.name.split('.').pop();
            mv(imagesfile2.path, process.env.FOOTWEAR_FOLDER_IMAGES + '\\' + fileName, function(error) {
                if (error) throw error;

            });
            /* mv(imagesfile2.path, process.env.ADMINFOOTWEAR_FOLDER_IMAGES + '\\' + fileName, function(error) {
                if (error) throw error;

            }); */
            images[2] = '/images/Footwear/' + fileName;
            console.log(images[2]);
        }
        if (imagesfile3 && imagesfile3.size > 0) {
            var fileName = imagesfile3.path.split('\\').pop() + '.' + imagesfile3.name.split('.').pop();
            mv(imagesfile3.path, process.env.FOOTWEAR_FOLDER_IMAGES + '\\' + fileName, function(error) {
                if (error) throw error;

            });
            /*  mv(imagesfile3.path, process.env.ADMINFOOTWEAR_FOLDER_IMAGES + '\\' + fileName, function(error) {
                 if (error) throw error;

             }); */
            images[3] = '/images/Footwear/' + fileName;
            console.log(images[3]);
        }



        delete fields.images0;
        delete fields.images1;
        delete fields.images2;
        delete fields.images3;

        fields.images = images;

        console.log("Oh la la");
        console.log(fields);

        const id = req.params.id;
        productModel.updateOne(fields, id).then(() => {
            productModel.findById(id).then((product) => {
                console.log(product);
                const size = product.size;
                console.log(size);
                var sizestr = "";
                sizestr = size.join(",");
                let men;
                let women;
                if (product.gender == "male" || product.gender == "men") {
                    men = "checked";
                } else {
                    women = "checked";
                }

                const discription = product.description.p;
                const arr = [];
                discription.forEach(element => {
                    arr.push(element);
                });
                const predescription = arr.join("");
                console.log(predescription);

                console.log(product.manufacturer);
                const manufacturer = product.manufacturer.p;
                const arr1 = [];
                manufacturer.forEach(element => {
                    arr1.push(element);
                });
                const premanufacturer = arr1.join("");
                res.render('products/update', { title: product.name, product, women, men, sizestr, premanufacturer, predescription });
            });
        });

    });
}

exports.delete = async(req, res, next) => {
    var id = req.params.id;

    await productModel.delete(id);
    res.redirect('/products');
}