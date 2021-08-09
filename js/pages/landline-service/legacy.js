$(document).ready(() => {

    $("#zipcode-check-1").on("click", function (e) {
        e.preventDefault()
        let zip_code = $("#zipcode-2").val();
    
        if (zip_code.length == 5) {
            $(this).val("Please wait...")
    
            $.ajax({
                method: "GET",
                url: `https://landline.phone.community/api/v1/coverage/${zip_code}/check`,
                success: function (resp) {
    
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
                error: function (error) {
                    logger.print("************************************")
                    logger.print(error)
                }
            })
        } else {
            //$(".start-landline-btn").val("Start my landline service")
            $(".zip-check").html('<p style="color: #ff0000">Please type your zip code<p>')
        }
    })
    
    $("#zipcode-check-2").on("click", function (e) {
        e.preventDefault()
        let zip_code = $("#zipcode-bottom").val();
    
        if (zip_code.length == 5) {
            $(this).val("Please wait...")
    
            $.ajax({
                method: "GET",
                url: `https://landline.phone.community/api/v1/coverage/${zip_code}/check`,
                success: function (resp) {
    
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
                error: function (error) {
                    logger.print("************************************")
                    logger.print(error)
                }
            })
        } else {
            //$(".start-landline-btn").val("Start my landline service")
            $("#zip-check-bottom").html('<p style="color: #ff0000">Please type your zip code<p>')
        }
    });
});