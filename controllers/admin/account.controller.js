const md5 = require("md5")
const Account = require("../../models/account.model")
const Role = require("../../models/role.model")

const generate = require("../../helpers/generate")
const systemConfig = require("../../config/system")

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Account.find(find).select("-password -token")

    for (const record of records) {
        const role = await Role.findOne({
            deleted: false,
            _id: record.role_id
        })
        record.role = role
    }

    res.render('admin/pages/accounts/index', {
        pageTitle: "Trang tài khoản",
        records: records
    })
}

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({ deleted: false })

    res.render('admin/pages/accounts/create', {
        pageTitle: "Trang thêm mới tài khoản",
        roles: roles
    })
}

// [POSt] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    })

    if (emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`)
        res.redirect("back")
    } else {
        req.body.password = md5(req.body.password)
        const record = new Account(req.body)
        await record.save()

        req.flash("success", `Thêm mới tài khoản thành công`)
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }


}

// [GET] /admin/accounts/edit
module.exports.edit = async (req, res) => {
    let find = {
        deleted: false,
        _id: req.params.id
    }

    try {
        const data = await Account.findOne(find)

        const roles = await Role.find({
            deleted: false
        })

        res.render('admin/pages/accounts/edit', {
            pageTitle: "Trang Chỉnh sửa tài khoản",
            roles: roles,
            data: data
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id
        const emailExist = await Account.findOne({
            _id: { $ne: id},
            email: req.body.email,
            deleted: false
        })
        
        if(emailExist) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`)
            res.redirect("back")
        } else {
            if (req.body.password) {
                req.body.password = md5(parseInt(req.body.pasword))
            } else {
                delete req.body.password
            }
        
            await Account.updateOne({_id: id}, req.body)
            req.flash("success", "Cập nhật thành công")
            res.redirect("back")
        }
    } catch (error) {
        console.log(error)
        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}