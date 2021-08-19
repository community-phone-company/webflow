/**
 * @param {Product} product Product.
 * @returns {string}
 */
 const getProductCardHtmlLayout = (product) => {
    return `
        <div class="div-product">
            <div class="devider-16px">
            </div>
            <div class="row-product">
                <img
                    src="https://assets.website-files.com/60c30ab447d78d3beb1f6c82/60d0a444c31f1bc77f528588_img-placeholder.svg"
                    loading="lazy"
                    width="68"
                    alt=""
                    class="product-image"
                >
                <div class="_w-20">
                </div>
                <div>
                    <div data-w-id="81568857-5b33-574b-942a-b85d060aa2a9" class="product-title">
                        ${product.name}
                        <span class="tooltip-trigger">?</span>
                    </div>
                    <div class="product-description">
                        ${product.descriptionShort}
                    </div>
                </div>
                <div class="_w-24">
                </div>
                <div class="product-price">
                    $${product.pricing.getPrice()}
                </div>
            </div>
            <div class="devider-16px">
            </div>
            <div class="devider-grey-1px">
            </div>
        </div>
    `;
};

/**
 * @param {Product} product Product.
 * @returns {string}
 */
const getAddonCardHtmlLayout = (product) => {
    console.log(`Preparing card for addon: `, product);
    return `
        <a
            href="#"
            class="addons-card-bg w-inline-block"
            community-phone-product-id="${product.id}"
        >
            <div id="handset_addon_div" class="w-layout-grid card-addon-handset-phone card-handset">
                <div id="w-node-da018f8a-8d6d-a283-942a-ee673cd84d89-81c6a2a0" style="opacity: 1;" class="div-block-6">
                    <div class="text-block-9">
                        ${product.addonInformation.title}
                    </div>
                    <div class="text-block-10">
                        ${product.addonInformation.subtitle}
                    </div>
                </div>
                <img
                    src="https://assets.website-files.com/60c30ab447d78d3beb1f6c82/60d0a444c31f1bc77f528588_img-placeholder.svg"
                    loading="lazy"
                    alt=""
                    class="image-6"
                >
                <img
                    src="https://assets.website-files.com/60c30ab447d78d3beb1f6c82/60c73b6e068386753c1fe7da_ic-add.svg"
                    loading="lazy"
                    style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;"
                    alt=""
                    class="image-7"
                >
            </div>
        </a>
    `;
};

/**
 * @param {Product[]} products Products.
 * @returns {string}
 */
const getAddonSectionInternalHtmlLayout = (products) => {
    var html = `
        <div class="devider-24px"></div>
        <div class="devider-grey-1px"></div>
        <div class="devider-24px"></div>
        <h4 class="heading-4">Addons</h4>
        <div class="devider-8px"></div>
    `;

    for (const product of products) {
        html += getAddonCardHtmlLayout(product);
    }

    return html;
};

if (router.isTestEnvironment()) {
    const formData = {
        monthly: true,
        getNewNumber: true,
        addHandset: false,
        addInsurance: false,
        productStore: undefined,
        productCart: new ProductCart()
    };

    /**
     * @returns {string[]}
     */
    const getSelectedProductsId = () => {
        const store = formData.productStore;

        if (!store) {
            return [];
        }
        
        var identifiers = [
            store.getStructure().landlineBaseProductId
        ];

        if (formData.getNewNumber) {
            identifiers.push(
                formData.monthly ? store.getStructure().plans.newNumber.monthlyPlanId : store.getStructure().plans.newNumber.yearlyPlanId
            );
        } else {
            identifiers.push(
                formData.monthly ? store.getStructure().plans.keepNumber.monthlyPlanId : store.getStructure().plans.keepNumber.yearlyPlanId
            );
        }

        /*if (this.addHandset) {
            identifiers.push(
                ProductIdentifier.handset
            );
        }

        if (this.addInsurance) {
            identifiers.push(
                formData.monthly ? ProductIdentifier.insuranceMonthly : ProductIdentifier.insuranceYearly
            );
        }*/

        return identifiers;
    };

    /**
     * @returns {Product[]}
     */
    getAddonsForCurrentPlan = () => {
        const productStore = formData.productStore;

        if (!productStore) {
            return [];
        }

        return productStore.getStructure().addons
            .map(productId => {
                return productStore.getProductById(
                    productId
                );
            })
            .filter(product => {
                const isNotSubscription = !product.pricing.isSubscription;
                const isMonthlySubscriptionForMonthlyPlan = product.pricing.isSubscription
                    && product.pricing.subscriptionPrice.monthly
                    && formData.monthly;
                const isAnnualSubscriptionForAnnualPlan = product.pricing.isSubscription
                    && product.pricing.subscriptionPrice.annually
                    && !formData.monthly;
                return isNotSubscription
                    || isMonthlySubscriptionForMonthlyPlan
                    || isAnnualSubscriptionForAnnualPlan;
            });
    };

    const updateStructure = () => {
        const productStore = formData.productStore;
        
        if (productStore) {
            const newNumberMonthlyPlan = productStore.getProductById(
                productStore.getStructure().plans.newNumber.monthlyPlanId
            );
            $("#new-number-monthly-price-text").html(`$${newNumberMonthlyPlan.pricing.subscriptionPrice.monthly} / month`);

            const newNumberAnnualPlan = productStore.getProductById(
                productStore.getStructure().plans.newNumber.yearlyPlanId
            );
            const newNumberAnnualPlanMonthPrice = newNumberAnnualPlan.pricing.subscriptionPrice.annually / 12;
            $("#new-number-annual-price-text").html(`$${newNumberAnnualPlanMonthPrice} / month *`);
            $("#new-number-annual-price-subtitle").html(`* Billed annually at $${newNumberAnnualPlan.pricing.subscriptionPrice.annually}`);

            const keepNumberMonthlyPlan = productStore.getProductById(
                productStore.getStructure().plans.keepNumber.monthlyPlanId
            );
            $("#keep-existing-number-monthly-price-text").html(`$${keepNumberMonthlyPlan.pricing.subscriptionPrice.monthly} / month`);

            const keepNumberAnnualPlan = productStore.getProductById(
                productStore.getStructure().plans.keepNumber.yearlyPlanId
            );
            const keepNumberAnnualPlanMonthPrice = keepNumberAnnualPlan.pricing.subscriptionPrice.annually / 12;
            $("#keep-existing-number-annual-price-text").html(`$${keepNumberAnnualPlanMonthPrice} / month *`);
            $("#keep-existing-number-annual-price-subtitle").html(`* Billed annually at $${keepNumberAnnualPlan.pricing.subscriptionPrice.annually}`);

            const addons = getAddonsForCurrentPlan();
            $("div.addons").html(
                getAddonSectionInternalHtmlLayout(
                    addons
                )
            );
        }
    };

    /**
     * tab-new-number
     * 
     * tab-new-number-monthly-plan
     * new-number-monthly-price-text
     * 
     * tab-new-number-annual-plan
     * new-number-annual-price-text
     * 
     * tab-keep-existing-number
     * 
     * tab-keep-existing-number-monthly-plan
     * keep-existing-number-monthly-price-text
     * 
     * tab-keep-existing-number-annual-plan
     * keep-existing-number-annual-price-text
     * 
     */

    const productStore = ProductStore.getDefault();
    productStore.loadProducts(error => {
        formData.productStore = productStore;
        updateStructure();
    });
} else {
    $(document).ready(() => {

        $(".order-summary-card .tabs").remove();
        $(".insurance-item").remove();

        const formData = {
            monthly: $("#monthly-plan").hasClass("w--current"),
            getNewNumber: $(".tabs_phonenumber_service .tab-new-number").hasClass("w--current"),
            addHandset: false,
            addInsurance: false,
        };
    
        const getProductIdentifiers = () => {
            var identifiers = [
                ProductIdentifier.landlineBase,
            ];
    
            if (formData.getNewNumber) {
                identifiers.push(
                    formData.monthly ? ProductIdentifier.landlinePhoneServiceMonthly : ProductIdentifier.landlinePhoneServiceYearly,
                );
            } else {
                identifiers.push(
                    formData.monthly ? ProductIdentifier.portingLandlineNumberMonthly : ProductIdentifier.portingLandlineNumberYearly
                );
            }
    
            if (formData.addHandset) {
                identifiers.push(
                    ProductIdentifier.handset
                );
            }
    
            if (formData.addInsurance) {
                identifiers.push(
                    formData.monthly ? ProductIdentifier.insuranceMonthly : ProductIdentifier.insuranceYearly
                );
            }
    
            return identifiers;
        };
    
        $("#tab-new-number").on("click", (event) => {
            formData.getNewNumber = true;
        });
    
        $("#tab-keep-existing-number").on("click", (event) => {
            formData.getNewNumber = false;
        });
    
        $("#monthly-plan").on("click", (event) => {
            formData.monthly = true;
        });
    
        $("#annual-plan").on("click", (event) => {
            formData.monthly = false;
        });
    
        $("#monthly-plan-p").on("click", (event) => {
            formData.monthly = true;
        });
    
        $("#annual-plan-p").on("click", (event) => {
            formData.monthly = false;
        });
    
        $("#handset-addon-card").on("click", (event) => {
            formData.addHandset = !formData.addHandset;
        });
    
        $("#insurance-addon-card").on("click", (event) => {
            formData.addInsurance = !formData.addInsurance;
        });
    
        /**
         * Here we handle submit button click.
         */
        const submitButton = document.querySelectorAll(".continue_choose_plan")[0];
    
        $(submitButton).on("click", (event) => {
            const period = (() => {
                const monthly = $("#monthly-plan").hasClass("w--current");
                const annual = $("#annual-plan").hasClass("w--current");
    
                if (monthly) {
                    return "Monthly";
                } else if (annual) {
                    return "Annual";
                } else {
                    return "";
                }
            })();
    
            Store.local.write(Store.keys.checkoutFlow.getNewNumber, formData.getNewNumber);
            Store.local.write(Store.keys.checkoutFlow.period, period);
            Store.local.write(Store.keys.checkoutFlow.addHandsetPhone, formData.addHandset);
            Store.local.write(Store.keys.checkoutFlow.addInsurance, formData.addInsurance);
            Store.local.write(Store.keys.checkoutFlow.selectedProductIdentifiers, getProductIdentifiers());
        });
    
        /**
         * Send user's data to Active Campaign.
         */
        exportCheckoutFlowDataToActiveCampaign(
            (response, error, success) => {
                console.log("Active Campaign");
            }
        );
    });
}