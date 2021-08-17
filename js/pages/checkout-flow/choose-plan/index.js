console.log(`VERSION: `, 1);

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

/**
 * @param {Product} product Product.
 * @returns {string}
 */
const getAddonCardHtmlLayout = (product) => {
    return `
        <a href="#" class="addons-card-bg w-inline-block">
            <div id="handset_addon_div" class="w-layout-grid card-addon-handset-phone card-handset">
                <div id="w-node-da018f8a-8d6d-a283-942a-ee673cd84d89-81c6a2a0" style="opacity: 1;" class="div-block-6">
                    <div class="text-block-9">
                        Add ${product.id}
                    </div>
                    <div class="text-block-10">
                        Subtitle
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

    console.log(`HTML: ${html}`);
    return html;
};

if (router.isTestEnvironment()) {
    const choosePlanVM = new Vue({
        data: {
            allProducts: []
        },
        methods: {
        },
        watch: {
            allProducts(newValue) {
                console.log(`Updated products: `, newValue);
                
                const addons = newValue.filter(product => product.isAddon);
                $("div.addons").html(
                    getAddonSectionInternalHtmlLayout(
                        addons
                    )
                );
            }
        }
    });

    ProductStore.getDefault().loadProducts(error => {
        choosePlanVM.allProducts = ProductStore.getDefault().getAllProducts();
    });
} else {
    $(document).ready(() => {

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