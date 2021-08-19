class OrderSummaryPanel {

    /**
     * @param {string} selector 
     */
    constructor(selector) {
        this.container = document.querySelectorAll(selector)[0];
        this.allCards =
        this.cards = {
            dueToday: new OrderSummaryPanelCard(
                "#due-today-card"
            ),
            sercice: new OrderSummaryPanelCard(
                "#in-15-days-card"
            )
        };
    }

    /**
     * @param {ProductStore} productStore Product store.
     * @param {ProductCart} productCart Product cart.
     */
    update = (productStore, productCart) => {
    }
}

class OrderSummaryPanelCard {

    constructor(selector) {
        this.container = document.querySelectorAll(selector)[0];
        this._products = [];
    }

    /**
     * @param {Product[]} products 
     */
    setProducts = (products) => {
        this._products = Array.from(
            products
        );

        const html = products
            .map(product => {
                return new OrderSummaryPanelCardProduct(
                    product
                ).toHTML();
            })
            .reduce(
                (previous, current) => `${previous}${current}`,
                ""
            );
        $(this.container).find(".list-item-landline-base").html(html);
    }
}

class OrderSummaryPanelCardProduct {

    /**
     * @constructor
     * @param {Product} product Product.
     */
    constructor(product) {
        this.product = product;
    }

    toHTML = () => {
        return `
            <div class="div-product">
                <div class="devider-16px">
                </div>
                <div class="row-product">
                    <img
                        src="https://assets.website-files.com/60c30ab447d78d3beb1f6c82/60d0b05962306f63feda5374_img-device.jpg"
                        loading="lazy"
                        width="68"
                        alt=""
                        class="product-image"
                    >
                    <div class="_w-20">
                    </div>
                    <div>
                        <div data-w-id="81568857-5b33-574b-942a-b85d060aa2a9" class="product-title">
                            ${this.product.name}
                        </div>
                        <div class="product-description">
                            ${this.product.descriptionShort}
                        </div>
                    </div>
                    <div class="_w-24">
                    </div>
                    <div class="product-price">
                        $${this.product.pricing.getPrice()}
                    </div>
                </div>
                <div class="devider-16px">
                </div>
                <div class="devider-grey-1px">
                </div>
            </div>
        `;
    }
}