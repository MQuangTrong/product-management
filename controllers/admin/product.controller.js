const Product = require("../../models/product.model")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const systemConfig = require("../../config/system")

// [GET] /admin/products
module.exports.index = async (req, res) => {

    let find = {
        deleted: false
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
        .sort({ position: "desc" })
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render('admin/pages/products/index', {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })

}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    //params lấy biến động
    const status = req.params.status
    const id = req.params.id
    try {
        await Product.updateOne({ _id: id }, { status: status })
        req.flash('success', 'Cập nhật trạng thái thành công!');
    } catch (error) {
        req.flash('success', 'Cập nhật trạng thái thất bại!');
    }


    res.redirect("back")
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type
    const ids = req.body.ids.split(', ')
    switch (type) {
        case "active":
            try {
                await Product.updateMany({ _id: { $in: ids } }, { $set: { status: "active" } })
                req.flash('success', `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`);
            } catch (error) {
                req.flash('error', `Cập nhật trạng thái thất bại!`);
            }
            break;
        case "inactive":
            try {
                await Product.updateMany({ _id: { $in: ids } }, { $set: { status: "inactive" } })
                req.flash('success', `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`);
            } catch (error) {
                req.flash('error', `Cập nhật trạng thái thất bại!`);
            }
            break;
        case "delete-all":
            try {
                await Product.updateMany({ _id: { $in: ids } }, { $set: { deleted: true, deletedAt: new Date() } })
                req.flash('success', `Đã xóa thành công ${ids.length} sản phẩm!`);
            } catch (error) {
                req.flash('error', `Đã xóa thất bại!`);
            }
            break;
        case "change-position":
            try {
                for (const item of ids) {
                    let [id, position] = item.split(" - ")
                    position = parseInt(position)
                    await Product.updateOne({ _id: id }, {
                        position: position
                    })
                }
                req.flash('success', `Đã đổi vị trí thành công ${ids.length} sản phẩm!`);
            } catch (error) {
                req.flash('error', `Đã đổi vị trí thất bại!`);
            }
            break;
        default:
            break;
    }
    res.redirect("back")
}


// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id
    //xóa vĩnh viễn
    // await Product.deleteOne({_id: id})
    //Xóa mềm
    try {
        await Product.updateOne({ _id: id }, {
            deleted: true,
            deletedAt: new Date()
        })
        req.flash('success', `Đã xóa sản phẩm thành công!`);
    } catch {
        req.flash('error', `Đã xóa sản phẩm thất bại!`);
    }

    res.redirect("back")
}

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm"
    })
}

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments()
        req.body.position = countProducts + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }

    //Dùng trong file uplaod
    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }

    const product = new Product(req.body)
    await product.save()

    req.flash('success', `Tạo mới sản phẩm thành công`);
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);

        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
        })
    } catch (error) {
        req.flash('error', `Không tồn tại sản phẩm này!`);
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}

//[POST] /admin/products/create
module.exports.editPatch = async (req, res) => {
    const id = req.params.id
    req.body.price = parseInt(req.body.price)
    req.body.discountPercentage = parseInt(req.body.discountPercentage)
    req.body.stock = parseInt(req.body.stock)
    req.body.position = parseInt(req.body.position)

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        await Product.updateOne({ _id: id }, req.body)
        req.flash('success', `Cập nhật sản phẩm thành công!`);
    } catch (error) {
        req.flash('error', `Cập nhật sản phẩm thất bại!`);
    }

    res.redirect("back")
}

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);

        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        req.flash('error', `Không tồn tại sản phẩm này!`);
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}