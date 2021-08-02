
$(document).ready(function () {

    let handset_is_selected = false
    let insuarance_is_selected = false
   let cp_order_summary = {"handset_is_selected": false, "insuarance_is_selected": false, "phone_service": "New Number", "plan_type": "Monthly"}
   localStorage.setItem("cp_addons", JSON.stringify(cp_order_summary))

   $(".links-right-bar-active-normal").css("cursor", "auto")
//    $(".links-right-bar-active-normal").on("click", function(e) {
//        e.preventDefault()
//     //    window.location.href = "#"
//    })

var text_on_tab = $("#monthly-plan").data("plantype")
localStorage.setItem("cp_selected_plan", text_on_tab)


$("#monthly-plan").on("click", function(e) {
    e.preventDefault()
    logger.print("*********************************M")
    var current_selection = localStorage.getItem("cp_selected_plan")
    var text_on_tab = $(this).data("plantype")
    logger.print(text_on_tab, "----")
        
    localStorage.setItem("cp_selected_plan", text_on_tab)
    
    
})

$("#annual-plan").on("click", function(e) {
    e.preventDefault()
    logger.print("*********************************A")
    
    var text_on_tab = $(this).data("plantype")
    logger.print(text_on_tab, "00000000")
        
    localStorage.setItem("cp_selected_plan", text_on_tab)
    
})

$("#monthly-plan-p").on("click", function(e) {
    e.preventDefault()
    logger.print("*********************************M")
    var current_selection = localStorage.getItem("cp_selected_plan")
    var text_on_tab = $(this).data("plantype")
    logger.print(text_on_tab, "----")
        
    localStorage.setItem("cp_selected_plan", text_on_tab)
    
    
})

$("#annual-plan-p").on("click", function(e) {
    e.preventDefault()
    logger.print("*********************************A")
    
    var text_on_tab = $(this).data("plantype")
    logger.print(text_on_tab, "00000000")
        
    localStorage.setItem("cp_selected_plan", text_on_tab)
    
})

    $(".card-handset").on("click", function(e) {
        e.preventDefault();
        handset_is_selected = !handset_is_selected
        cp_order_summary["handset_is_selected"] = handset_is_selected
        localStorage.setItem("cp_addons", JSON.stringify(cp_order_summary))

        total_cost = $(".device-")
        logger.print("clicked handset", handset_is_selected)
    })


    $(".card-addon-insuarance").on("click", function(e) {
        e.preventDefault();
        insuarance_is_selected = !insuarance_is_selected
        cp_order_summary["insuarance_is_selected"] = insuarance_is_selected
        localStorage.setItem("cp_addons", JSON.stringify(cp_order_summary))
        logger.print("clicked insuarance", insuarance_is_selected)
    })

    
    $("#zipcode-check-1").on("click", function(e) {
        e.preventDefault()
        let zip_code = $("#zipcode-2").val();
        
        if (zip_code.length == 5) {
            $(this).val("Please wait...")

            $.ajax({
                method: "GET",
                url: `https://landline.phone.community/api/v1/coverage/${zip_code}/check`,
                success: function(resp) {
                    
                    if (resp.message) {
                        $(".zip-check").html("We have coverage in your area! Click below to get started, or give us a call to talk to one of our landline specialists.")
                        $(".zipcode-container").css("display", "none")
                        $(".zip-check").append('<br><a href="/checkout-landline/choose-a-plan"><button class="primary-button" style="top: auto; right: auto;">Start my landline service</button></a>')
                    } else {
                        $(".zip-check").html("We might have coverage at your address! Call us at <a href='tel:8885824177'>888-582-4177</a> so we can check our coverage at your address.")
                        $(".start-landline-btn").attr("data-wait", "Check coverage")
                        $(".start-landline-btn").val("Check coverage")
                    }
                    $(".coverage_response").css("font-size", "12px")
                    $(".coverage_response").css("line-height", "0")
                    $(".coverage_response").css("margin-top", "0")
                },
                error: function(error) {
                    logger.print("************************************")
                    logger.print(error)
                }
            })
            // $.ajax({
            //     method: "GET",
            //     url: `https://www.silvacode.com/clients/community/fn_ajax.php?callback=jQuery110007498869777800927_1623945075974&z=${zip_code}&_=1623945075978`,
                
            //     crossDomain: true,
            //     dataType: 'jsonp',

            //     success: function(resp) {
                    
            //         if (resp.toString(resp).includes("It will work!")) {
            //             $(".zip-check").html("Great news! We do have coverage in your area. Click below to choose your landline service plan, or give us a call at (855) 615-0667.")
            //             $(".zipcode-container").css("display", "none")
            //             $(".zip-check").append('<br><a href="/checkout-landline/choose-a-plan"><button class="primary-button" style="top: auto; right: auto;">Start your landline service</button></a>')

            //         } else {
            //             $(".zip-check").html(resp)
            //             $(".start-landline-btn").attr("data-wait", "Start my landline service")
            //             $(".start-landline-btn").val("Start my landline service")
            //         }
            //         $(".coverage_response").css("font-size", "12px")
            //         $(".coverage_response").css("line-height", "0")
            //         $(".coverage_response").css("margin-top", "0")
            //     },
            //     error: function(error) {
            //         logger.print("************************************")
            //         logger.print(error)
            //     }
            // })
        } else {
            //$(".start-landline-btn").val("Start my landline service")
            $(".zip-check").html('<p style="color: #ff0000">Please type your zip code<p>')

        }
        
    })

    $("#zipcode-check-2").on("click", function(e) {
        e.preventDefault()
        let zip_code = $("#zipcode-bottom").val();
        
        if (zip_code.length == 5) {
            $(this).val("Please wait...")

            $.ajax({
                method: "GET",
                url: `https://landline.phone.community/api/v1/coverage/${zip_code}/check`,
                success: function(resp) {
                    
                    if (resp.message) {
                        $(".zip-check").html("We have coverage in your area! Click below to get started, or give us a call to talk to one of our landline specialists.")
                        $(".zipcode-container").css("display", "none")
                        $(".zip-check").append('<br><a href="/checkout-landline/choose-a-plan"><button class="primary-button" style="top: auto; right: auto;">Start my landline service</button></a>')

                    } else {
                        $(".zip-check").html("We might have coverage at your address! Call us at <a href='tel:8885824177'>888-582-4177</a> so we can check our coverage at your address.")
                        $(".start-landline-btn").attr("data-wait", "Check coverage")
                        $(".start-landline-btn").val("Check coverage")
                    }
                    $(".coverage_response").css("font-size", "12px")
                    $(".coverage_response").css("line-height", "0")
                    $(".coverage_response").css("margin-top", "0")
                },
                error: function(error) {
                    logger.print("************************************")
                    logger.print(error)
                }
            })
            // $.ajax({
            //     method: "GET",
            //     url: `https://www.silvacode.com/clients/community/fn_ajax.php?callback=jQuery110007498869777800927_1623945075974&z=${zip_code}&_=1623945075978`,
                
            //     crossDomain: true,
            //     dataType: 'jsonp',

            //     success: function(resp) {
                    
            //         if (resp.toString(resp).includes("It will work!")) {
            //             $("#zip-check-bottom").html("Great news! We do have coverage in your area. Click below to choose your landline service plan, or give us a call at (855) 615-0667.")
            //             $(".zipcode-container").css("display", "none")
            //             $("#zip-check-bottom").append('<br><a href="/checkout-landline/choose-a-plan"><button class="primary-button" style="top: auto; right: auto;">Start your landline service</button></a>')

            //         } else {
            //             $("#zip-check-bottom").html(resp)
            //             $(".start-landline-btn").attr("data-wait", "Start my landline service")
            //             $(".start-landline-btn").val("Start my landline service")
            //         }
            //         $(".coverage_response").css("font-size", "12px")
            //         $(".coverage_response").css("line-height", "0")
            //         $(".coverage_response").css("margin-top", "0")
            //     },
            //     error: function(error) {
            //         logger.print("************************************")
            //         logger.print(error)
            //     }
            // })
        } else {
            //$(".start-landline-btn").val("Start my landline service")
            $("#zip-check-bottom").html('<p style="color: #ff0000">Please type your zip code<p>')

        }
        
    })
})