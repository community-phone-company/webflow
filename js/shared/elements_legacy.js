$(document).ready(function () {

    console.log("elements_legacy.js blocked");
    return;

    // TODO: REMOVE WHEN FINISHED WITH TESTING!
    if (!IS_PRODUCTION) {
        console.log("elements_legacy.js blocked");
        return;
    }

    let handset_is_selected = false
    let insuarance_is_selected = false
    let cp_order_summary = { "handset_is_selected": false, "insuarance_is_selected": false, "phone_service": "New Number", "plan_type": "Monthly" }
    localStorage.setItem("cp_addons", JSON.stringify(cp_order_summary))

    $(".links-right-bar-active-normal").css("cursor", "auto")
    //    $(".links-right-bar-active-normal").on("click", function(e) {
    //        e.preventDefault()
    //     //    window.location.href = "#"
    //    })

    var text_on_tab = $("#monthly-plan").data("plantype")
    localStorage.setItem("cp_selected_plan", text_on_tab)


    $("#monthly-plan").on("click", function (e) {
        e.preventDefault()
        logger.print("*********************************M")
        var current_selection = localStorage.getItem("cp_selected_plan")
        var text_on_tab = $(this).data("plantype")
        logger.print(text_on_tab, "----")

        localStorage.setItem("cp_selected_plan", text_on_tab)
    })

    $("#annual-plan").on("click", function (e) {
        e.preventDefault()
        logger.print("*********************************A")

        var text_on_tab = $(this).data("plantype")
        logger.print(text_on_tab, "00000000")

        localStorage.setItem("cp_selected_plan", text_on_tab)

    })

    $("#monthly-plan-p").on("click", function (e) {
        e.preventDefault()
        logger.print("*********************************M")
        var current_selection = localStorage.getItem("cp_selected_plan")
        var text_on_tab = $(this).data("plantype")
        logger.print(text_on_tab, "----")

        localStorage.setItem("cp_selected_plan", text_on_tab)


    })

    $("#annual-plan-p").on("click", function (e) {
        e.preventDefault()
        logger.print("*********************************A")

        var text_on_tab = $(this).data("plantype")
        logger.print(text_on_tab, "00000000")

        localStorage.setItem("cp_selected_plan", text_on_tab)

    })

    $(".card-handset").on("click", function (e) {
        e.preventDefault();
        handset_is_selected = !handset_is_selected
        cp_order_summary["handset_is_selected"] = handset_is_selected
        localStorage.setItem("cp_addons", JSON.stringify(cp_order_summary))

        total_cost = $(".device-")
        logger.print("clicked handset", handset_is_selected)
    })


    $(".card-addon-insuarance").on("click", function (e) {
        e.preventDefault();
        insuarance_is_selected = !insuarance_is_selected
        cp_order_summary["insuarance_is_selected"] = insuarance_is_selected
        localStorage.setItem("cp_addons", JSON.stringify(cp_order_summary))
        logger.print("clicked insuarance", insuarance_is_selected)
    });
})