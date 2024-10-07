module.exports = (query) => {
    let objectSearch = {
        keyword: "",
        regex: ""
    }

    if (query.keyword) {
        //thêm vào object
        objectSearch.keyword = query.keyword

        const regex = new RegExp(objectSearch.keyword, "i"); //i là ko phan biet hoa thương
        objectSearch.regex = regex
    }

    return objectSearch
}