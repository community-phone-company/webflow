class Paging {

    /**
     * @param {number} pageIndex 
     * @param {number} itemsPerPage 
     */
    constructor(pageIndex, itemsPerPage) {
        this.pageIndex = pageIndex;
        this.itemsPerPage = itemsPerPage;
    }

    /**
     * @returns {any}
     */
    toJSON() {
        return {
            page: this.pageIndex,
            numberPerPage: this.itemsPerPage
        };
    }
}