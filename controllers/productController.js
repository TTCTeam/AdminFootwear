const formidable = require('formidable');
const fs = require('fs');
const mv = require('mv');

const productModel = require('../models/productModel');
const accountModel = require('../models/accountModel');
const cloudinary = require('../cloudinary/index');

exports.index = async(req, res, next) => {
    var pageNumber = req.query.page || 1;
    const filter = {};

    var searchName = "";
    if (req.query.q != undefined) {
        searchName = req.query.q;
    }

    filter.name = { $regex: searchName, $options: "$i" };

    const nPerPage = 6;
    let totalAccount = await accountModel.count({});
    let totalProduct = await productModel.count(filter);
    let totalPage = Math.ceil(totalProduct / nPerPage);
    pageNumber = (pageNumber > totalPage) ? totalPage : pageNumber;
    pageNumber = parseInt(pageNumber);
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
        active.push("");
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

    res.render('products', { title: 'Products', products, pagination, totalProduct, totalAccount });
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
    form.parse(req, async(err, fields, files) => {
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
            //var fileName = imagesfile0.path.split('\\').pop() + '.' + imagesfile0.name.split('.').pop();
            images[0] = await productModel.uploadImageGetURL(imagesfile0.path);
        }
        if (imagesfile1 && imagesfile1.size > 0) {
            images[1] = await productModel.uploadImageGetURL(imagesfile1.path);
        }
        if (imagesfile2 && imagesfile2.size > 0) {
            images[2] = await productModel.uploadImageGetURL(imagesfile2.path);
        }
        if (imagesfile3 && imagesfile3.size > 0) {
            images[3] = await productModel.uploadImageGetURL(imagesfile3.path);
        }

        delete fields.images0;
        delete fields.images1;
        delete fields.images2;
        delete fields.images3;

        fields.images = images;

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