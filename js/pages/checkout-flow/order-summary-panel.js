class OrderSummaryPanel {

    /**
     * @param {string | HTMLDivElement} container Selector or `HTMLDivElement` instance.
     */
    constructor(selector) {
        if (typeof container === "string") {
            this.container = document.querySelectorAll(selector)[0];
        } else if (container instanceof HTMLDivElement) {
            this.container = this.container;
        } else {
            throw new Error("Container not found");
        }

        this.cards = {
            dueToday: new OrderSummaryPanelCard(
                "#due-today-card"
            ),
            service: new OrderSummaryPanelCard(
                "#in-15-days-card"
            )
        };
    }

    /**
     * @param {ProductStore} productStore Product store.
     * @param {ProductCart} productCart Product cart.
     */
    update = (productStore, productCart) => {
        this.cards.dueToday.update(
            productStore,
            productCart.amounts.dueToday
        );
        this.cards.service.update(
            productStore,
            productCart.amounts.subscription
        );
    }
}

class OrderSummaryPanelCard {

    constructor(selector) {
        this.container = document.querySelectorAll(selector)[0];
        this._productIdentifiers = [];
    }

    /**
     * @param {string[]} productIdentifiers 
     */
    setProductIdentifiers = (productIdentifiers) => {
        this._productIdentifiers = Array.from(
            productIdentifiers
        );
    }

    /**
     * @param {ProductStore} productStore Product store.
     * @param {ProductCartPrice} price Price.
     */
    update = (productStore, price) => {
        const html = this._productIdentifiers
            .map(productId => {
                const product = productStore.getProductById(
                    productId
                );
                return new OrderSummaryPanelCardProduct(
                    product
                ).toHTML();
            })
            .reduce(
                (previous, current) => `${previous}${current}`,
                ""
            );
        $(this.container).find(".list-item-landline-base").html(html);

        $(this.container).find(".taxes-fordue-today-price").html(`$${price.taxes}`);
        $(this.container).find(".total-due-today-price, .service-total-price").html(`$${price.total}`);
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