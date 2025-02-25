const ProductCategory = require("../../models/product-category.model")
const createTreeHelper = require("../../helpers/create-tree")


module.exports.category = async (req, res, next) => {
    const productsCategory = await ProductCategory.find({deleted: false})
    const newProductsCategory = createTreeHelper.tree(productsCategory)
    
    res.locals.layoutProductCategory = newProductsCategory

    next();
}