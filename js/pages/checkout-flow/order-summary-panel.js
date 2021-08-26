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

    /**
     * @param {boolean} active
     * @param {boolean} animated
     * @param {(() => void) | undefined} callback 
     */
    setActive = (active, animated, callback) => {
        const targetValue = active ? 1 : 0.5;
        $(this.container).stop();

        if (animated) {
            $(this.container).fadeTo(
                500,
                targetValue,
                () => {
                    if (callback) {
                        callback();
                    }
                }
            );
        } else {
            $(this.container).css(
                "opacity",
                targetValue
            );

            if (callback) {
                callback();
            }
        }
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
        const productsHTML = products
            .map(product => {
                return new OrderSummaryPanelCardProduct(
                    product
                ).toHTML();
            })
            .reduce(
                (previous, current) => `${previous}${current}`,
                ""
            );
        $(this.container).find(".list-item-landline-base").html(productsHTML);
        const taxBreakdownHTML = price.taxBreakdown
            .map(taxBreakdownItem => {
                return new OrderSummaryPanelCardTaxBreakdownItem(
                    taxBreakdownItem
                ).toHTML();
            })
            .reduce(
                (previous, current) => `${previous}${current}`,
                ""
            );
        $(this.container).find(".div-sub-tax").html(taxBreakdownHTML);

        $(this.container).find(".zip-link").html(zip ?? "00000");
        $(this.container).find(".taxes-and-fees-value").html(`$${Math.formatPrice(price.taxes, true)}`);
        $(this.container).find(".total-price").html(`$${Math.formatPrice(price.total, true)}`);
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
                        $${Math.formatPrice(this.product.pricing.getPrice(), true)}
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

class OrderSummaryPanelCardTaxBreakdownItem {

    /**
     * @constructor
     * @param {ProductCartPriceTaxBreakdownItem} priceTaxBreakdownItem 
     */
    constructor(priceTaxBreakdownItem) {
        this.priceTaxBreakdownItem = priceTaxBreakdownItem;
    }

    /**
     * @returns {string}
     */
    toHTML = () => {
        return `
            <div class="sub-tax">
                <div class="caption-1">
                    ${this.priceTaxBreakdownItem.name}
                </div>
                <div class="_w-8">
                </div>
                <div class="caption-1 service-tax-value">
                    $${Math.formatPrice(this.priceTaxBreakdownItem.amount, true)}
                </div>
            </div>
            <div class="devider-8px">
            </div>
        `;
    }
}

/**
 * @returns {HTMLElement}
 */
const findOrderSummaryPanelContainer = () => {
    return document.querySelectorAll(".right-panel")[0];
};

const findAndUpdateOrderSummaryPanel = () => {
    const productIdentifiers = Store.local.read(
        Store.keys.checkoutFlow.selectedProductIdentifiers
    );
    
    const orderSummaryPanel = new OrderSummaryPanel(
        findOrderSummaryPanelContainer()
    );

    const billingAddress = new ProductCartBillingAddress(
        Store.local.read(
            Store.keys.checkoutFlow.shippingAddress_city
        ) ?? "",
        Store.local.read(
            Store.keys.checkoutFlow.shippingAddress_state
        ) ?? "",
        Store.local.read(
            Store.keys.checkoutFlow.shippingAddress_zip
        ) ?? ""
    );

    const productCart = new ProductCart();
    productCart.setBillingAddress(
        billingAddress
    );
    productIdentifiers.forEach(productId => {
        productCart.addProductIdentifier(
            productId
        );
    });

    orderSummaryPanel.setActive(false, true);

    const productStore = ProductStore.getDefault();
    productStore.loadProducts((error) => {
        productCart.updatePrices((error) => {
            orderSummaryPanel.update(
                productStore,
                productCart
            );
            orderSummaryPanel.setActive(true, true);
        });
    });
};