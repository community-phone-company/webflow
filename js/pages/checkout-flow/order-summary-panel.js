class OrderSummaryPanel {

    /**
     * @param {string | HTMLDivElement} container Selector or `HTMLDivElement` instance.
     */
    constructor(container) {
        if (typeof container === "string") {
            this.container = document.querySelectorAll(container)[0];
        } else if (container instanceof HTMLDivElement) {
            this.container = container;
        } else {
            throw new Error("Container not found");
        }

        this.cards = {
            dueToday: new OrderSummaryPanelCard(
                this.container.querySelectorAll("#due-today-card")[0]
            ),
            service: new OrderSummaryPanelCard(
                this.container.querySelectorAll("#in-15-days-card")[0]
            )
        };
    }

    /**
     * @param {ProductStore} productStore Product store.
     * @param {ProductCart} productCart Product cart.
     */
    update = (productStore, productCart) => {
        const allProducts = productCart.getProductIdentifiers().map(productId => {
            return productStore.getProductById(
                productId
            );
        });
        const zip = (() => {
            const billingAddress = productCart.getBillingAddress();
            return billingAddress.zip;
        })();

        const oneTimeChargeProducts = allProducts.filter(product => !product.pricing.isSubscription);
        this.cards.dueToday.update(
            oneTimeChargeProducts,
            productCart.amounts.dueToday,
            zip
        );

        const subscriptionProducts = allProducts.filter(product => product.pricing.isSubscription);
        this.cards.service.update(
            subscriptionProducts,
            productCart.amounts.subscription,
            zip
        );
    }
}

class OrderSummaryPanelCard {

    /**
     * @constructor
     * @param {HTMLDivElement} container 
     */
    constructor(container) {
        this.container = container;
    }

    /**
     * @param {Product[]} products Products.
     * @param {ProductCartPrice} price Price.
     * @param {string | undefined} zip Zip code.
     */
    update = (products, price, zip) => {
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

        $(this.container).find(".zip-link").html(zip ?? "00000");
        $(this.container).find(".taxes-and-fees-value").html(`$${price.taxes}`);
        $(this.container).find(".service-tax-value").html(`$${price.taxes}`);
        $(this.container).find(".total-price").html(`$${price.total}`);
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