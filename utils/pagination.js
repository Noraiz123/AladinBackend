const paginationHandler = (req) => {
  const { page, limit } = req.query;

  const perPage = parseInt(limit) || 30;
  const pageNo = parseInt(page) || 1;
  const startIndex = (pageNo - 1) * perPage;

  return { perPage, pageNo, startIndex };
};

module.exports = paginationHandler
