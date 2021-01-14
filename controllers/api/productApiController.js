const productModel = require('../../models/productModel');

exports.restoreProduct = async(req, res, next) => {
    const id = req.query.id;

    res.json(await productModel.restoreProduct(id));
}

exports.deleteProduct = async(req, res, next) => {
    const id = req.query.id;

    res.json(await productModel.delete(id));
}