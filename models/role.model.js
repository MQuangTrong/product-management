const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        permissions: {
            type: Array,
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    }, {
    timestamps: true
}
);
const Role = mongoose.model('Role', roleSchema, "roles"); //Biến 3 là tên bảng trong sql

module.exports = Role