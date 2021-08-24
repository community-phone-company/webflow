/**
 * @param {Product} product Product.
 * @returns {string}
 */
const getAddonCardHtmlLayout = (product) => {
    return `
        <a
            data-w-id="da018f8a-8d6d-a283-942a-ee673cd84d87"
            href="#"
            class="addons-card-bg w-inline-block addon-card"
            addon-card-product-id="${product.id}"
            addon-card-is-selected="false"
        >
            <div class="w-layout-grid card-addon-handset-phone card-handset">
                <div id="w-node-da018f8a-8d6d-a283-942a-ee673cd84d89-5c39eb21" style="opacity: 1;" class="div-block-6 addon-card-opacity">
                    <div class="text-block-9">
                        ${product.addonInformation.title}
                    </div>
                    <div class="text-block-10">
                        ${product.addonInformation.subtitle}
                    </div>
                </div>
                <img
                    src="https://assets.website-files.com/60c30ab447d78d3beb1f6c82/60c73b174b03cb6cee00203a_img-phone.svg"
                    loading="lazy"
                    alt=""
                    class="image-6"
                >
                <img
                    src="https://assets.website-files.com/60c30ab447d78d3beb1f6c82/60c73b6e068386753c1fe7da_ic-add.svg"
                    loading="lazy"
                    style="transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;"
                    id="w-node-da018f8a-8d6d-a283-942a-ee673cd84d8f-5c39eb21"
                    alt=""
                    class="image-7 addon-card-add-button"
                >
            </div>
        </a>
    `;
};

/**
 * @param {HTMLElement} card 
 * @returns {string}
 */
const getAddonCardProductIdentifier = (card) => {
    return $(card).attr("addon-card-product-id");
};

/**
 * @param {HTMLElement} card 
 * @returns {boolean}
 */
const isAddonCardSelected = (card) => {
    return $(card).attr("addon-card-is-selected") === "true";
};

/**
 * @param {HTMLElement} card 
 * @param {boolean} selected 
 */
const setAddonCardSelected = (card, selected) => {
    $(card).attr("addon-card-is-selected", `${selected}`);
    $(card).find(".addon-card-opacity").css("opacity", selected ? 0.5 : 1);
    $(card).find(".addon-card-add-button").css({
        "transform": `translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(${selected ? "45deg" : "0deg"}) skew(0deg, 0deg)`,
        "transform-style": "preserve-3d"
    });
};

/**
 * 
 * @param {HTMLElement} card 
 * @param {(productIdentifier: string) => void} handler 
 */
const onAddonCardClicked = (card, handler) => {
    $(card).off().on("click", (event) => {
        event.preventDefault();
    });
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

/**
 * @param {(productIdentifier: string, isSelected: boolean) => void} handler 
 */
const setupAddonCardClickHandlers = (handler) => {
    $("div.addons .addon-card").off().on("click", (event) => {
        event.preventDefault();
        const card = event.currentTarget;
        const productIdentifier = getAddonCardProductIdentifier(
            card
        );
        const isSelected = isAddonCardSelected(
            card
        );
        const newSelectedState = !isSelected;
        setAddonCardSelected(
            card,
            newSelectedState
        );

        if (handler) {
            handler(
                productIdentifier,
                newSelectedState
            );
        }
    });
};

if (router.isTestEnvironment()) {
    const billingAddress = (() => {
        if (router.isTestEnvironment) {
            return new ProductCartBillingAddress(
                "New York",
                "NY",
                "10008"
            );
        } else {
            return new ProductCartBillingAddress(
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
        }
    })();
    const formData = {
        monthly: true,
        getNewNumber: true,
        insuranceAdded: false,
        productStore: undefined,
        productCart: (() => {
            const cart = new ProductCart();
            cart.setBillingAddress(
                billingAddress
            );
            return cart;
        })()
    };

    /**
     * @returns {Product[]}
     */
    getAddonsForCurrentPlan = () => {
        const productStore = formData.productStore;

        if (!productStore) {
            return [];
        }

        const requiredSubscriptionPeriod = formData.monthly
            ? ProductSubscriptionPricePeriod.month
            : ProductSubscriptionPricePeriod.year;

        return productStore.getStructure().addons
            .map(productId => {
                return productStore.getProductById(
                    productId
                );
            })
            .filter(product => {
                return product.pricing.isSubscription
                    ? product.pricing.subscriptionPrice.period === requiredSubscriptionPeriod
                    : true;
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
            const newNumberAnnualPlan_priceForYear = newNumberAnnualPlan.pricing.subscriptionPrice.annually;
            const newNumberAnnualPlan_priceForMonth = Math.roundUp(
                newNumberAnnualPlan.pricing.subscriptionPrice.annually / 12,
                2
            );
            $("#new-number-annual-price-text").html(`$${newNumberAnnualPlan_priceForMonth} / month *`);
            $("#new-number-annual-price-subtitle").html(`* Billed annually at $${newNumberAnnualPlan_priceForYear}`);

            const keepNumberMonthlyPlan = productStore.getProductById(
                productStore.getStructure().plans.keepNumber.monthlyPlanId
            );
            const keepNumberMonthlyPlan_priceForMonth = keepNumberMonthlyPlan.pricing.subscriptionPrice.monthly
                + newNumberMonthlyPlan.pricing.subscriptionPrice.monthly;
            $("#keep-existing-number-monthly-price-text").html(`$${keepNumberMonthlyPlan_priceForMonth} / month`);

            const keepNumberAnnualPlan = productStore.getProductById(
                productStore.getStructure().plans.keepNumber.yearlyPlanId
            );
            const keepNumberAnnualPlan_priceForYear = keepNumberAnnualPlan.pricing.subscriptionPrice.annually
                + newNumberAnnualPlan.pricing.subscriptionPrice.annually;
            const keepNumberAnnualPlan_priceForMonth = Math.roundUp(
                (keepNumberAnnualPlan.pricing.subscriptionPrice.annually + newNumberAnnualPlan.pricing.subscriptionPrice.annually) / 12,
                2
            );
            $("#keep-existing-number-annual-price-text").html(`$${keepNumberAnnualPlan_priceForMonth} / month *`);
            $("#keep-existing-number-annual-price-subtitle").html(`* Billed annually at $${keepNumberAnnualPlan_priceForYear}`);

            const addons = getAddonsForCurrentPlan();
            $("div.addons").html(
                getAddonSectionInternalHtmlLayout(
                    addons
                )
            );
            setupAddonCardClickHandlers((productIdentifier, isSelected) => {
                console.log(`Clicked on addon card: ${productIdentifier}, selected: ${isSelected}`);

                const isInsurance = [
                    formData.productStore.getStructure().insurance.monthlyId,
                    formData.productStore.getStructure().insurance.yearlyId
                ].includes(productIdentifier);

                if (isInsurance) {
                    formData.insuranceAdded = isSelected;
                }

                updateProductCart();
            });
        }
    };

    /**
     * @param {() => void} onFinished Function that is called when the product cart is updated.
     */
    updateProductCart = (onFinished) => {
        const productCart = formData.productCart;
        const structure = formData.productStore.getStructure();

        const allPlans = [
            structure.plans.newNumber.monthlyPlanId,
            structure.plans.newNumber.yearlyPlanId,
            structure.plans.keepNumber.monthlyPlanId,
            structure.plans.keepNumber.yearlyPlanId
        ];
        allPlans.forEach(planIdentifier => {
            productCart.removeProductIdentifier(
                planIdentifier
            );
        });
        
        var newPlanIdentifiers = [
            formData.monthly
                ? structure.plans.newNumber.monthlyPlanId
                : structure.plans.newNumber.yearlyPlanId
        ];
        
        if (!formData.getNewNumber) {
            newPlanIdentifiers.push(
                formData.monthly
                    ? structure.plans.keepNumber.monthlyPlanId
                    : structure.plans.keepNumber.yearlyPlanId
            );
        }

        newPlanIdentifiers.forEach(planIdentifier => {
            productCart.addProductIdentifier(
                planIdentifier
            );
        });
        
        const allInsuranceIdentifiers = [
            structure.insurance.monthlyId,
            structure.insurance.yearlyId
        ];
        allInsuranceIdentifiers.forEach(id => productCart.removeProductIdentifier(id));

        if (formData.insuranceAdded) {
            productCart.addProductIdentifier(
                formData.monthly ? structure.insurance.monthlyId : structure.insurance.yearlyId
            );
        }

        productCart.updatePrices((error) => {
            if (onFinished) {
                onFinished();
            }
        });
    };

    const tabs = Object.freeze({
        newNumber: {
            plan: document.getElementById("tab-new-number"),
            periods: {
                month: document.getElementById("tab-new-number-monthly-plan"),
                year: document.getElementById("tab-new-number-annual-plan")
            }
        },
        keepNumber: {
            plan: document.getElementById("tab-keep-existing-number"),
            periods: {
                month: document.getElementById("tab-keep-existing-number-monthly-plan"),
                year: document.getElementById("tab-keep-existing-number-annual-plan")
            }
        }
    });
    const allTabs = [
        tabs.newNumber.plan,
        tabs.newNumber.periods.month,
        tabs.newNumber.periods.year,
        tabs.keepNumber.plan,
        tabs.keepNumber.periods.month,
        tabs.keepNumber.periods.year
    ];

    const isTabSelected = (tab) => {
        return $(tab).hasClass("w--current");
    };

    const orderSummaryPanel = new OrderSummaryPanel(
        document.querySelectorAll(".right-panel")[0]
    );

    $(tabs.newNumber.plan).on("click", () => {
        formData.getNewNumber = true;
        formData.monthly = isTabSelected(tabs.newNumber.periods.month);
        updateStructure();
        updateProductCart();
    });

    $(tabs.newNumber.periods.month).on("click", () => {
        formData.getNewNumber = isTabSelected(tabs.newNumber.plan);
        formData.monthly = true;
        updateStructure();
        updateProductCart();
    });

    $(tabs.newNumber.periods.year).on("click", () => {
        formData.getNewNumber = isTabSelected(tabs.newNumber.plan);
        formData.monthly = false;
        updateStructure();
        updateProductCart();
    });

    $(tabs.keepNumber.plan).on("click", () => {
        formData.getNewNumber = false;
        formData.monthly = isTabSelected(tabs.keepNumber.periods.month);
        updateStructure();
        updateProductCart();
    });

    $(tabs.keepNumber.periods.month).on("click", () => {
        formData.getNewNumber = isTabSelected(tabs.newNumber.plan);
        formData.monthly = true;
        updateStructure();
        updateProductCart();
    });

    $(tabs.keepNumber.periods.year).on("click", () => {
        formData.getNewNumber = isTabSelected(tabs.newNumber.plan);
        formData.monthly = false;
        updateStructure();
        updateProductCart();
    });

    const productStore = ProductStore.getDefault();
    productStore.loadProducts(error => {
        formData.productStore = productStore;
        updateStructure();
        
        formData.productCart.addProductIdentifier(
            productStore.getStructure().landlineBaseProductId
        );
        formData.productCart.addProductIdentifier(
            productStore.getStructure().plans.newNumber.monthlyPlanId
        );
        formData.productCart.onPricesUpdated((error) => {
            orderSummaryPanel.update(
                productStore,
                formData.productCart
            );
        });
        updateProductCart();
    });

    /**
     * Here we handle submit button click.
     */
    const submitButton = document.querySelectorAll(".continue_choose_plan")[0];

    $(submitButton).on("click", (event) => {
        event.preventDefault();

        Store.local.write(
            Store.keys.checkoutFlow.getNewNumber,
            formData.getNewNumber
        );
        Store.local.write(
            Store.keys.checkoutFlow.selectedProductIdentifiers,
            formData.productCart.getProductIdentifiers()
        );

        router.open(
            RouterPath.checkoutLandline_account,
            router.getParameters(),
            router.isTestEnvironment()
        );
    });

    /**
     * Send user's data to Active Campaign.
     */
    exportCheckoutFlowDataToActiveCampaign(
        (response, error, success) => {
            console.log("Active Campaign");
        }
    );
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