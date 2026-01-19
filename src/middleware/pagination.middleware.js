const paginationMiddleware = (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);

    const page_size = Math.max(1, parseInt(req.query.page_size) || 10);

    req.pagination = {
        page, page_size, skip: (page -1) * page_size, limit: page_size
    };

    next();
}

module.exports = paginationMiddleware;

//req = {
//   user: { id, admin },
//   query: { page, page_size },
//   pagination: {
//     page: 2,
//     page_size: 5,
//     skip: 5,
//     limit: 5
//   }
// }