const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")

// [GET] /admin/products/products-deleted
module.exports.productsDeleted = async (req, res) => {
    let find = {
        deleted: true
    }

    //filter status
    const filterStatus = filterStatusHelper(req.query)
    if (req.query.status) {
        //thêm vào object
        find.status = req.query.status
    }

    //search
    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    //pagination
    const countProducts = await Product.countDocuments(find)

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProducts)
    //End pagination

    const products = await Product.find(find)
        .sort({position: "desc"})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render('admin/pages/products/products-deleted', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

// [PATCH] /admin/products/products-deleted/restore/:id
module.exports.restoreItem = async (req, res) => {
    const id = req.params.id
    await Product.updateOne({_id: id}, {deleted: false})
    req.flash('success', `Đã khôi phục sản phẩm thành công!`);
    res.redirect("back")
}

// [PATCH] /admin/products/products-deleted/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(', ')
    switch (type) {
        case "restore-all":
            await Product.updateMany({ _id: { $in: ids } }, { $set: { deleted: "false" } })
            req.flash('success', `Đã khôi phục ${ids.length} sản phẩm thành công!`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, { $set: { deleted: true, deletedAt: new Date() } })
            req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;
        default:
            break;
    }
    res.redirect("back")
}