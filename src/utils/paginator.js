export const paginate = (page, currentPageCount, totalCount) => {
    const perPage = 100;

    page = Number(page);
    const offset = (page - 1) * perPage;
    return {
        total: totalCount,
        lastPage: Math.ceil(totalCount / perPage),
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page * perPage < totalCount ? page + 1 : null,
        perPage,
        currentPage: page,
        from: offset,
        to: offset + currentPageCount
    };
}
