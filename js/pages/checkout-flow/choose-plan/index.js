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

const choosePlanVM = new Vue({
    data: {
        allProducts: []
    },
    methods: {
    },
    watch: {
        allProducts(newValue) {
            logger.print(`Updated products: `, newValue);
        }
    }
});

$(document).ready(() => {

    const formData = {
        monthly: $("#monthly-plan").hasClass("w--current"),
        getNewNumber: $(".tabs_phonenumber_service .tab-new-number").hasClass("w--current"),
        addHandset: false,
        addInsurance: false,
    };

    ProductStore.getDefault().loadProducts(error => {
        choosePlanVM.allProducts = ProductStore.getDefault().getAllProducts();
    });

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
            logger.print("Active Campaign");
        }
    );
});