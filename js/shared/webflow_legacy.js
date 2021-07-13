
	$(document).ready(function () {

        prepopulateShippingAddress() // prepopulate shipping info
        // handlePlanPeriod() // handle plan period tab
        handlePhonenumberService()
        let use_shipping_address = true
        $(".handle").on("click", function() {
            use_shipping_address = !use_shipping_address
            console.log("==============")
            console.log(use_shipping_address)
        })

        function cc_format(value) {
            var v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
            var matches = v.match(/\d{4,16}/g);
            var match = matches && matches[0] || ''
            var parts = []
        
            for (i=0, len=match.length; i<len; i+=4) {
                parts.push(match.substring(i, i+4))
            }
        
            if (parts.length) {
                return parts.join(' ')
            } else {
                return value
            }
        }

        
      
        function handleCardNumber() {
            
            $("#card_number").on("keyup", function() {
                this.value = this.value.replace(/\D/g,'')
                this.value = cc_format(this.value)
               
    
                
                if($("#card_number").val().length == 0 ) {
                    $(".buy_now_checkout").css("background-color", "#D8DAE1")
                    $(".buy_now_checkout").attr("disabled", true)
                } else {
                    $(".buy_now_checkout").css("background-color", "#0019f9")
                    $(".buy_now_checkout").attr("disabled", false)
                }
            })
          }

          handleCardNumber()
        
          function handleCardExpiry() {
            
            $("#card_expiry").on("keyup", function() {
                this.value = this.value.replace(/\D/g,'')
                this.value = this.value.substring(0, 2) + 
                (this.value.length > 2 ? '/' : '') + 
                this.value.replace(/\//g, "").substring(2, 4);
               
    
                
                if($("#card_expiry").val().length == 0 ) {
                    $(".buy_now_checkout").css("background-color", "#D8DAE1")
                    $(".buy_now_checkout").attr("disabled", true)
                } else {
                    $(".buy_now_checkout").css("background-color", "#0019f9")
                    $(".buy_now_checkout").attr("disabled", false)
                }
            })
          }

          handleCardExpiry()


          function handleCardCvv() {
            
            $("#card_cvv").on("keyup", function() {
                this.value = this.value.replace(/\D/g,'')
                this.value = this.value.substring(0, 3) 
               
    
                
                if($("#card_cvv").val().length == 0 ) {
                    $(".buy_now_checkout").css("background-color", "#D8DAE1")
                    $(".buy_now_checkout").attr("disabled", true)
                } else {
                    $(".buy_now_checkout").css("background-color", "#0019f9")
                    $(".buy_now_checkout").attr("disabled", false)
                }
            })
          }

          handleCardCvv()

        
        
        $(".buy_now_checkout").on("click", function(e) {
            e.preventDefault()
            let s_first_name = $(".shipping_first_name").val()
            let s_last_name = $(".shipping_last_name").val()
            let s_address_1 = $(".shipping_address_1").val()
            let s_address_2 = $(".shipping_address_2").val()
            let s_city = $(".shipping_city").val()
            let s_zip_code = $(".shipping_zip").val()
            let s_state = $(".shipping_state").val()

            let first_name = $(".billing_first_name").val()
            let last_name = $(".billing_last_name").val()
            let address_1 = $(".billing_address_1").val()
            let address_2 = $(".billing_address_2").val()
            let city = $(".billing_city").val()
            let zip_code = $(".billing_zip").val()
            let state = $(".billing_state").val()
            let card_number = $("#card_number").val()
            let card_cvv = $("#card_cvv").val()
            let card_expiry = $("#card_expiry").val()
            

            let card_expiry_month = card_expiry.substr(0, card_expiry.indexOf('/')); 
            let card_expiry_year = card_expiry.substr(-2, card_expiry.indexOf('/')); 

            

            $(".buy_now_checkout").css("background-color", "#D8DAE1")
            $(".buy_now_checkout").attr("disabled", true)
            $(".buy_now_checkout").val("Please wait....")
            

            let is_valid = handleValidateCheckoutForm(first_name, last_name, address_1, city, zip_code, s_first_name, s_last_name, s_address_1, s_city, s_zip_code, card_number, card_expiry, card_cvv)  

            if (is_valid) {
                let cp_checkout_payload = localStorage.getItem("cp_checkout_payload")

                if (cp_checkout_payload != null) {
                    let current_payload = JSON.parse(cp_checkout_payload)
                    let shipping_address = {}
                    let billing_address = {}
                    let card ={}

                    card["card_number"] = card_number
                    card["card_cvv"] = card_cvv
                    card["card_expiry_month"] = card_expiry_month
                    card["card_expiry_year"]= card_expiry_year

                    shipping_address["first_name"] = s_first_name,
                    shipping_address["last_name"] = s_last_name,
                    shipping_address["email"] = current_payload.email,
                    shipping_address["phone"] = current_payload.phonenumber,
                    shipping_address["line1"] = s_address_1,
                    shipping_address["line2"] = s_address_2,
                    shipping_address["state"] = s_state,
                    shipping_address["city"] = s_city,
                    shipping_address["zip"] = s_zip_code,
                    current_payload["shipping_address"] = shipping_address

                    billing_address["first_name"] = first_name,
                    billing_address["last_name"] = last_name,
                    billing_address["email"] = current_payload.email,
                    billing_address["phone"] = current_payload.phonenumber,
                    billing_address["line1"] = address_1,
                    billing_address["line2"] = address_2,
                    billing_address["state"] = state,
                    billing_address["city"] = city,
                    // billing_address["city"] = city,
                    billing_address["zip"] = zip_code,
                    current_payload["billing_address"] = billing_address
                    current_payload["card"] = card

                    localStorage.setItem("cp_checkout_payload", JSON.stringify(current_payload))
                    
                    $.ajax({
                    method: "POST",
                    // url: "https://staging-landline.phone.community/api/v1/chargebee/checkout/",
                    url: "https://landline.phone.community/api/v1/chargebee/checkout/",
                    data: JSON.stringify(current_payload),
                    contentType: "application/json; charset=utf-8",
                    success: function(resp) {
                        console.log(resp)
                        
                        if (resp.message == "failed") {
                            alert("A problem was detected. Please call us at (855) 615-0667 to complete your order")
                            $(".buy_now_checkout").css("background-color", "#0019f9")
                            $(".buy_now_checkout").attr("disabled", false)
                            $(".buy_now_checkout").val("Buy Now")
                            // window.location.href = "/checkout-landline/thank-you"
                        } else {
                            window.location.href = "/checkout-landline/thank-you"
                        }
                    },
                    error: function(error) {
                        console.log(error.responseJSON)
                        message = error.responseJSON.message
                        alert(`${message} OR call us at (855) 615-0667 to complete your order`)
                        $(".buy_now_checkout").css("background-color", "#0019f9")
                        $(".buy_now_checkout").attr("disabled", false)
                        $(".buy_now_checkout").val("Buy Now")
                    }
                    })

                    // window.location.href = "/checkout-landline/checkout-step"
                } else {
                    // must have skipped first step
                    alert("Please select your plan")
                    window.location.href = "/checkout-landline/choose-a-plan"
                }
            } else {
                $(".buy_now_checkout").css("background-color", "#0019f9")
                $(".buy_now_checkout").attr("disabled", false)
                $(".buy_now_checkout").val("Buy Now")
            }

            })

        // handleBuyNow(cardComponent) // handle buy now button in checkout view 
        
        
       
      
      
      // handle phonenumber service 
      
      handleShippingFirstName() // handle checkout first name
      handleShippingLastName() // handle checkout last name
      handleShippingAddress1() // handle checkout address
      handleShippingCityInput() // handle city input in checkout
      handleShippingZipInput() // handle zip input in checkout
      handleShippingStateInput()

      handleCheckoutFirstName() // handle checkout first name
      handleCheckoutLastName() // handle checkout last name
      handleCheckoutAddress1() // handle checkout address
      handleCheckoutCityInput() // handle city input in checkout
      handleCheckoutZipInput() // handle zip input in checkout
      
      handlePlanSelectionContinue() // handle plan selection continue button
      handleOrderSummaryView() // handle the order summary section
      handleAccountCountinue() // handle continue button in account view
      handleFirstNameInput () // handle first name input in account view
      handleLastNameInput() // handle last name input in account view
      handlePhonenumberInput() // handle phonenumber input in account view
      handleEmailInput() // handle email input in account 
      
   
      

      function handleStylingContinueButton(first_name, last_name, email, phonenumber){
        if(first_name.length == 0 || last_name.length == 0 || phonenumber.length == 0 || email.length == 0) {
            $(".continue_account").css("background-color", "#D8DAE1")
        } else {
            $(".continue_account").css("background-color", "#0019f9")
        }
      }

      
      
      function getPhonenumberService(text_phonenumber_service) {
        //Get a new number
        //Keep your existing number
      	if (text_phonenumber_service == "Get a new number") {
			selected_phonenumber_service = "New Number"
            return selected_phonenumber_service
		} else if (text_phonenumber_service == "Keep your existing number") {
        	selected_phonenumber_service = "Port Existing Number"
            return selected_phonenumber_service
        }
      }
      
      function handlePhonenumberService() {
        // handles the PLAN PERIOD tab
         
        var text_on_tab_ = $(".tabs_phonenumber_service").find(".w--current").text()
        
		$(".tabs_phonenumber_service").on("click", function() {
            text_on_tab_ = $(".tabs_phonenumber_service").find(".w--current").text()
            console.log(";;:::::::::::::")
            console.log(text_on_tab_)
        })
        
        return text_on_tab_
	  }
      
      function handlePlanPeriod() {
        // handles the PLAN PERIOD tab
        // var tabs_plan_period = $("#tabs-period")
        
        var text_on_tab = $(".tabs_plan_period").find(".w--current").data("plantype")
       
		// $(".tabs_plan_period").on("click", function() {
        //     text_on_tab = $(".tabs_plan_period").find(".w--current").data("plantype")
        //     console.log("*********************************544444")
        //     console.log(text_on_tab)
        // })

        // $(".w-tabs").on("click", function() {
        //     text_on_tab = $(".w-tabs").find(".w--current").data("plantype")
        //     console.log("*********************************544444")
        //     console.log(text_on_tab)
        // })

        var text_on_tab = $("#monthly-plan").data("plantype")

        
       
		// $("#w-tabs-2-data-w-tab-0").on("click", function() {
        //     text_on_tab = $("#id_tabs_period").find(".w--current").data("plantype")
        //     console.log("*********************************544444")
        //     console.log(text_on_tab)
        // })

        $("#monthly-plan").on("click", function() {
            if ($("#monthly-plan").hasClass("w--current") == true) {
                text_on_tab = $("#monthly-plan").data("plantype")
                console.log("*********************************544444")
                console.log(text_on_tab)
                return text_on_tab
            }
            
            
        })

        $("#annual-plan").on("click", function() {
            if ($("#annual-plan").hasClass("w--current") == true) {
                text_on_tab = $("#annual-plan").data("plantype")
                console.log("*********************************544444")
                console.log(text_on_tab)
                return text_on_tab
            }
            
            
        })

        return text_on_tab
        
        
        
      }
      
      
      
      
      function handlePlanSelectionContinue(){
        // handles the CONTINUE button in plan selection page
        // var selected_plan = handlePlanPeriod()
        var text_phonenumber_service = handlePhonenumberService()
          $(".continue_choose_plan").on("click", function(e){
            e.preventDefault()
            
            let cp_checkout_payload = {}
            // selected_plan = handlePlanPeriod() // handle plan period tab
            let selected_plan = localStorage.getItem("cp_selected_plan")
            text_phonenumber_service = handlePhonenumberService() // handle phonenumber service 
            selected_phonenumber_service = getPhonenumberService(text_phonenumber_service)
             
            cp_checkout_payload["phonenumber_service"] = selected_phonenumber_service

            var plan_id = ""

            let cp_addons = localStorage.getItem("cp_addons")
            let order_summary = {"handset_is_selected": false, "insuarance_is_selected": false}

            if (cp_addons != null) {
                order_summary = JSON.parse(cp_addons)
            }

            let insuarance_is_selected = order_summary["insuarance_is_selected"]
            let handset_is_selected = order_summary["handset_is_selected"]
            

            order_summary["phone_service"] = selected_phonenumber_service
            console.log("============================================")
            console.log(selected_plan)
            
            if (selected_plan == "Monthly") {
                plan_id = "landline-phone-service-monthly"
            } else if (selected_plan == "Annual") {
                plan_id = "landline-phone-service-annually"
            }

            order_summary["plan_type"] = selected_plan;
            localStorage.setItem("cp_order_summary", JSON.stringify(order_summary))

            let subscription_plans = [
                {
                    "item_price_id": plan_id,
                },
                {
                    "item_price_id": "landline-base",
                },
            ]

            if (insuarance_is_selected != true && handset_is_selected == true) {
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "landline-handset",
                    }
                ]
            }
            

            if (selected_plan == "Monthly" && insuarance_is_selected == true && handset_is_selected == true) {
                
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "insurance-",
                    }, 
                    {
                        "item_price_id": "landline-handset",
                    }
                ]
                
            } else if (selected_plan == "Annual" && insuarance_is_selected == true && handset_is_selected == true) {
                
                // $(".in-service-price-new-number-y").css("display", "none");
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "insurance-yearly",
                    }, 
                    {
                        "item_price_id": "landline-handset",
                    }
                ]
            } else if (selected_plan == "Monthly" && insuarance_is_selected == true && handset_is_selected !== true) {
                
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "insurance-",
                    }
                ]
                
            }else if (selected_plan == "Annual" && insuarance_is_selected == true && handset_is_selected !== true) {
                
                // $(".in-service-price-new-number-y").css("display", "none");
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "insurance-yearly",
                    }
                ]
            } 
            
            if (selected_phonenumber_service == "Port Existing Number" && selected_plan == "Annual" && insuarance_is_selected == true && handset_is_selected !== true) {
                
                // $(".in-service-price-new-number-y").css("display", "none");
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "insurance-yearly",
                    }, 
                    {
                        "item_price_id": "porting-landline-number-annually",
                    }
                ]
            } else if (selected_phonenumber_service == "Port Existing Number" && selected_plan == "Annual" && insuarance_is_selected !== true && handset_is_selected == true) {
                
                // $(".in-service-price-new-number-y").css("display", "none");
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "landline-handset",
                    }, 
                    {
                        "item_price_id": "porting-landline-number-annually",
                    }
                ]
            }else if (selected_phonenumber_service == "Port Existing Number" && selected_plan == "Annual" && insuarance_is_selected !== true && handset_is_selected !== true) {
                
                // $(".in-service-price-new-number-y").css("display", "none");
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "porting-landline-number-annually",
                    }
                ]
            }else if (selected_phonenumber_service == "Port Existing Number" && selected_plan == "Annual" && insuarance_is_selected == true && handset_is_selected == true) {
                
                // $(".in-service-price-new-number-y").css("display", "none");
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "landline-handset",
                    }, 
                    {
                        "item_price_id": "insurance-yearly",
                    }, 
                    {
                        "item_price_id": "porting-landline-number-annually",
                    }
                ]
            } else if (selected_phonenumber_service == "Port Existing Number" && selected_plan == "Monthly" && insuarance_is_selected == true && handset_is_selected !== true) {
                
                // $(".in-service-price-new-number-y").css("display", "none");
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "insurance-yearly",
                    }, 
                    {
                        "item_price_id": "porting-landline-number-monthly",
                    }
                ]
            } else if (selected_phonenumber_service == "Port Existing Number" && selected_plan == "Monthly" && insuarance_is_selected !== true && handset_is_selected == true) {
                
                // $(".in-service-price-new-number-y").css("display", "none");
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "landline-handset",
                    }, 
                    {
                        "item_price_id": "porting-landline-number-monthly",
                    }
                ]
            } else if (selected_phonenumber_service == "Port Existing Number" && selected_plan == "Monthly" && insuarance_is_selected !== true && handset_is_selected != true) {
                
                // $(".in-service-price-new-number-y").css("display", "none");
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "porting-landline-number-monthly",
                    }
                ]
            }
            else if (selected_phonenumber_service == "Port Existing Number" && selected_plan == "Monthly" && insuarance_is_selected == true && handset_is_selected == true) {
                
                // $(".in-service-price-new-number-y").css("display", "none");
                subscription_plans = [
                    {
                        "item_price_id": plan_id,
                    },
                    {
                        "item_price_id": "landline-base",
                    },
                    {
                        "item_price_id": "landline-handset",
                    }, 
                    {
                        "item_price_id": "insurance-",
                    }, 
                    {
                        "item_price_id": "porting-landline-number-monthly",
                    }
                ]
            }
            


            cp_checkout_payload["subscription_plans"] = subscription_plans
            let stringified_payload = JSON.stringify(cp_checkout_payload)
            localStorage.setItem("cp_checkout_payload", stringified_payload)
            
            window.location.href = "/checkout-landline/account"
           })
      }
      
      function validateEmail($email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,10})?$/;
        return emailReg.test( $email );
      }
      
      
      function handleValidateForm(first_name, last_name, email, phonenumber) {
      	if (first_name.length == 0) {
        	let name_error_section_el = $(".name_error_section")
            name_error_section_el.text("")
            name_error_section_el.text("Please type your first name")
            return false
        }else if (last_name.length == 0) {
        	let name_error_section_el = $(".name_error_section")
            name_error_section_el.text("")
            name_error_section_el.text("Please type your last name")
            return false
        } else if (phonenumber.length <14) {
        	let phonenumber_error_section_el = $(".phonenumber_error_section")
            phonenumber_error_section_el.text("")
            phonenumber_error_section_el.text("Please type your phonenumber")
            return false
        } else if (!validateEmail(email)) {
        	let email_error_section_el = $(".email_error_section")
            email_error_section_el.text("")
            email_error_section_el.text("Please type your email")
            return false
        }
        
        else {
        	return true
        }
      }
      
      
      function handleFirstNameInput() {
        let name_error_section_el = $(".name_error_section")
      	$(".first_name").on("keyup", function () {
          name_error_section_el.text("")
        
        if($(".first_name").val().length == 0 ) {
            $(".continue_account").css("background-color", "#D8DAE1")
        } else {
            $(".continue_account").css("background-color", "#0019f9")
        }
          
        })
      }
      
      function handleLastNameInput() {
        let name_error_section_el = $(".name_error_section")
      	$(".last_name").on("keyup", function () {
          
          name_error_section_el.text("")
          if($(".last_name").val().length == 0 ) {
            $(".continue_account").css("background-color", "#D8DAE1")
        } else {
            $(".continue_account").css("background-color", "#0019f9")
        }
        })
      }

      function handlePhonenumberInput() {
        let phonenumber_error_section_el = $(".phonenumber_error_section")
        $(".phonenumber").attr('maxlength', '14');
        $(".phonenumber").on("keyup", function() {
            this.value = this.value.replace(/\D/g,'');
            this.value = this.value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")

            phonenumber_error_section_el.text("")
            if($(".phonenumber").val().length == 0 ) {
                $(".continue_account").css("background-color", "#D8DAE1")
            } else {
                $(".continue_account").css("background-color", "#0019f9")
            }
        })
      }

      function handleEmailInput() {
        let email_error_section_el = $(".email_error_section")
          $(".email").on("keyup", function () {
            
            email_error_section_el.text("")
            if($(".email").val().length == 0 ) {
                $(".continue_account").css("background-color", "#D8DAE1")
            } else {
                $(".continue_account").css("background-color", "#0019f9")
            }
            
          })
      }

      

      function handleSummaryDisplay (order_summary_obj) {
        let insuarance_is_selected = order_summary_obj["insuarance_is_selected"]
        let handset_is_selected = order_summary_obj["handset_is_selected"]
        let phone_service = order_summary_obj["phone_service"]
        let plan_type = order_summary_obj["plan_type"]

        let payload = JSON.parse(localStorage.cp_checkout_payload)
        let subscription = payload.subscription_plans
        
        let insurance_ids = []
        subscription.forEach(function(sub) {
            
            if (sub.item_price_id == "insurance-") {
                console.log("----")
                console.log(sub.item_price_id)
                insurance_ids.push(sub.item_price_id)
            } else if (sub.item_price_id == "insurance-yearly") {
                console.log("8*****")
                console.log(sub.item_price_id)
                insurance_ids.push(sub.item_price_id)
            } 
            
        })
        console.log(subscription)
        console.log("===================")
        console.log(insurance_ids)
        

        if (insuarance_is_selected !== true) {
            $(".list-item-insurance").css("display", "none");
        }

        if (insurance_ids[0] == "insurance-") {
            $(".list-item-insurance-a").css("display", "none");
        } else if(insurance_ids[0] == "insurance-yearly") {
            $(".list-item-insurance-m").css("display", "none");
        } else {
            $(".list-item-insurance-m").css("display", "none");
            $(".list-item-insurance-a").css("display", "none");
        }

        
        
        if (handset_is_selected !== true) {
            $(".list-item-handset-phone").css("display", "none");
            $(".device-price-with-handset").css("display", "none")
        }

        if (!window.location.href.indexOf("choose-a-plan") > -1 && handset_is_selected !==true){
            $(".device-price-with-handset").css("display", "none")
        } else if (window.location.href.indexOf("choose-a-plan") > -1 && handset_is_selected ==true){
            $(".device-price-with-handset").css("display", "none")
        } else if (!window.location.href.indexOf("choose-a-plan") > -1 && handset_is_selected ==true){
            $(".device-price-without-handset").css("display", "none")
        }
        // $("#service-price-new-number-m").css("display", "none");
        //     // $("#service-price-new-number-y").css("display", "none");
        //     $("#service-price-porting-m").css("display", "none");
        //     $("#service-price-porting-y").css("display", "none"); 
        if (phone_service == "New Number" && plan_type == "Monthly") {
            
            $(".list-item-new-number-y").css("display", "none");
            $(".list-item-port-number-m").css("display", "none");
            $(".list-item-port-number-y").css("display", "none");
        } else if (phone_service == "New Number" && plan_type == "Annual") {
            // $(".list-item-new-number-y").css("display", "none");
            $(".list-item-new-number-m").css("display", "none");
            $(".list-item-port-number-m").css("display", "none");
            $(".list-item-port-number-y").css("display", "none");
        } else if (phone_service == "Port Existing Number" && plan_type == "Monthly") {
            $(".list-item-new-number-m").css("display", "none");
            $(".list-item-new-number-y").css("display", "none");
            
            $(".list-item-port-number-y").css("display", "none");
        } else if (phone_service == "Port Existing Number" && plan_type == "Annual") {
            $(".list-item-new-number-m").css("display", "none");
            $(".list-item-new-number-y").css("display", "none");
            
            $(".list-item-port-number-m").css("display", "none");
        } 

        if (phone_service == "New Number" && plan_type == "Monthly" && insuarance_is_selected == true) {
            $(".service-price-new-number-m").css("display", "none");
            $(".service-price-new-number-y").css("display", "none");
            $(".service-price-porting-m").css("display", "none");
            $(".service-price-porting-y").css("display", "none");
            // $(".in-service-price-new-number-m").css("display", "none");
            $(".in-service-price-new-number-y").css("display", "none");
            $(".in-service-price-porting-m").css("display", "none");
            $(".in-service-price-porting-y").css("display", "none");

        } else if (phone_service == "New Number" && plan_type == "Monthly" && insuarance_is_selected != true) {
            // $(".service-price-new-number-m").css("display", "none");
            $(".service-price-new-number-y").css("display", "none");
            $(".service-price-porting-m").css("display", "none");
            $(".service-price-porting-y").css("display", "none");
            $(".in-service-price-new-number-m").css("display", "none");
            $(".in-service-price-new-number-y").css("display", "none");
            $(".in-service-price-porting-m").css("display", "none");
            $(".in-service-price-porting-y").css("display", "none");
        } else if (phone_service == "New Number" && plan_type == "Annual" && insuarance_is_selected == true) {
            $(".service-price-new-number-m").css("display", "none");
            $(".service-price-new-number-y").css("display", "none");
            $(".service-price-porting-m").css("display", "none");
            $(".service-price-porting-y").css("display", "none");
            $(".in-service-price-new-number-m").css("display", "none");
            // $(".in-service-price-new-number-y").css("display", "none");
            $(".in-service-price-porting-m").css("display", "none");
            $(".in-service-price-porting-y").css("display", "none");
        } else if (phone_service == "New Number" && plan_type == "Annual" && insuarance_is_selected != true) {
            $(".service-price-new-number-m").css("display", "none");
            // $(".service-price-new-number-y").css("display", "none");
            $(".service-price-porting-m").css("display", "none");
            $(".service-price-porting-y").css("display", "none");
            $(".in-service-price-new-number-m").css("display", "none");
            $(".in-service-price-new-number-y").css("display", "none");
            $(".in-service-price-porting-m").css("display", "none");
            $(".in-service-price-porting-y").css("display", "none");
        } else if (phone_service == "Port Existing Number" && plan_type == "Monthly" && insuarance_is_selected == true) {
            $(".service-price-new-number-m").css("display", "none");
            $(".service-price-new-number-y").css("display", "none");
            $(".service-price-porting-m").css("display", "none");
            $(".service-price-porting-y").css("display", "none");
            $(".in-service-price-new-number-m").css("display", "none");
            $(".in-service-price-new-number-y").css("display", "none");
            // $(".in-service-price-porting-m").css("display", "none");
            $(".in-service-price-porting-y").css("display", "none");
        } else if (phone_service == "Port Existing Number" && plan_type == "Monthly" && insuarance_is_selected != true) {
            $(".service-price-new-number-m").css("display", "none");
            $(".service-price-new-number-y").css("display", "none");
            // $(".service-price-porting-m").css("display", "none");
            $(".service-price-porting-y").css("display", "none");
            $(".in-service-price-new-number-m").css("display", "none");
            $(".in-service-price-new-number-y").css("display", "none");
            $(".in-service-price-porting-m").css("display", "none");
            $(".in-service-price-porting-y").css("display", "none");
        } else if (phone_service == "Port Existing Number" && plan_type == "Annual" && insuarance_is_selected == true) {
            $(".service-price-new-number-m").css("display", "none");
            $(".service-price-new-number-y").css("display", "none");
            $(".service-price-porting-m").css("display", "none");
            $(".service-price-porting-y").css("display", "none");
            $(".in-service-price-new-number-m").css("display", "none");
            $(".in-service-price-new-number-y").css("display", "none");
            $(".in-service-price-porting-m").css("display", "none");
            // $(".in-service-price-porting-y").css("display", "none");
        } else if (phone_service == "Port Existing Number" && plan_type == "Annual" && insuarance_is_selected != true) {
            $(".service-price-new-number-m").css("display", "none");
            $(".service-price-new-number-y").css("display", "none");
            $(".service-price-porting-m").css("display", "none");
            // $(".service-price-porting-y").css("display", "none");
            $(".in-service-price-new-number-m").css("display", "none");
            $(".in-service-price-new-number-y").css("display", "none");
            $(".in-service-price-porting-m").css("display", "none");
            $(".in-service-price-porting-y").css("display", "none");
        }
        
      }

      
            
      

      function handleOrderSummaryView() {
        
        let cp_order_summary = localStorage.getItem("cp_order_summary")
        // what if the user comes to this url directly?
        if (cp_order_summary != null) {
            let order_summary_obj = JSON.parse(cp_order_summary)
            handleSummaryDisplay(order_summary_obj)
        } else {
            let order_summary_obj = {"handset_is_selected": false, "insuarance_is_selected": false, "phone_service": "New Number", "plan_type": "Annual"}
            handleSummaryDisplay(order_summary_obj)
        }
      }
      
      function handleAccountCountinue() {
        
        let name_error_section_el = $(".name_error_section")
        name_error_section_el.text("") // clear error msg if any
        
        let first_name = $(".first_name").val()
        let last_name = $(".last_name").val()
        let email = $(".email").val()
        let phonenumber = $(".phonenumber").val()

        handleStylingContinueButton(first_name, last_name, email, phonenumber)
        
      	$(".continue_account").on("click", function(e) {
        	e.preventDefault()
            first_name = $(".first_name").val()
            last_name = $(".last_name").val()
            email = $(".email").val()
            phonenumber = $(".phonenumber").val()
            
            var is_valid = handleValidateForm(first_name, last_name, email, phonenumber)
            
            if(is_valid) {
                // update payload persistent in localstorage
                let cp_checkout_payload = localStorage.getItem("cp_checkout_payload")

                if (cp_checkout_payload != null) {
                    let current_payload = JSON.parse(cp_checkout_payload)
                    current_payload["first_name"] = first_name
                    current_payload["last_name"] = last_name
                    current_payload["phonenumber"] = phonenumber
                    current_payload["email"] = email
                    localStorage.setItem("cp_checkout_payload", JSON.stringify(current_payload))

                    window.location.href = "/checkout-landline/checkout-step"
                } else {
                    // must have skipped first step
                    alert("Please select your plan")
                    window.location.href = "/checkout-landline/choose-a-plan"
                }
                
            }
        })
      }


      function handleSetShippingAddressName(first_name, last_name) {
        
        let first_name_el = $(".shipping_first_name")
        let last_name_el = $(".shipping_last_name")
        first_name_el.val(first_name)
        last_name_el.val(last_name)
        
        return
      }

      function handleSetBillingAddressName(first_name, last_name) {
        
        let first_name_el = $(".billing_first_name")
        let last_name_el = $(".billing_last_name")
        first_name_el.val(first_name)
        last_name_el.val(last_name)
        
        return
      }

      function prepopulateShippingAddress() {
        $("#card-combined").css("margin-top", "-40px")
        // get first and last name from current payload
        let cp_checkout_payload = localStorage.getItem("cp_checkout_payload")
        
        if (cp_checkout_payload != null) {
            let current_payload = JSON.parse(cp_checkout_payload)
            let first_name = current_payload.first_name
            let last_name = current_payload.last_name

            handleSetShippingAddressName(first_name, last_name)
            handleSetBillingAddressName(first_name, last_name)
        }
      }

      function handleShippingFirstName() {
        let checkout_name_error_section_el = $(".shipping_name_error_section")
        $(".shipping_first_name").on("keyup", function() {
            checkout_name_error_section_el.text("")
            $(".billing_first_name").val($(".shipping_first_name").val())
            if($(".shipping_first_name").val().length == 0 ) {
                $(".buy_now_checkout").css("background-color", "#D8DAE1")
            } else {
                $(".buy_now_checkout").css("background-color", "#0019f9")
            }
            
        })
      }

      function handleShippingLastName() {
        
        let checkout_name_error_section_el = $(".shipping_name_error_section")

        $(".shipping_last_name").on("keyup", function() {
            $(".billing_last_name").val($(".shipping_last_name").val())
            checkout_name_error_section_el.text("")
            if($(".shipping_last_name").val().length == 0 ) {
                $(".buy_now_checkout").css("background-color", "#D8DAE1")
            } else {
                $(".buy_now_checkout").css("background-color", "#0019f9")
            }
        })
      }

      function handleShippingAddress1() { 
        let checkout_address_1_error_section_el = $(".shipping_address_1_error_section")
        
        $(".shipping_address_1").on("keyup", function () {
        $(".billing_address_1").val($(".shipping_address_1").val())
        checkout_address_1_error_section_el.text("")
        if($(".shipping_address_1").val().length == 0 ) {
            $(".buy_now_checkout").css("background-color", "#D8DAE1")
        } else {
            $(".buy_now_checkout").css("background-color", "#0019f9")
        }
        })
      }

      function handleShippingCityInput() {
        let checkout_city_zip_error_section_el = $(".shipping_city_zip_error_section")
        $(".shipping_city").on("keyup", function() {
            $(".billing_city").val($(".shipping_city").val())
            checkout_city_zip_error_section_el.text("")
            if($(".shipping_city").val().length == 0 ) {
                $(".buy_now_checkout").css("background-color", "#D8DAE1")
            } else {
                $(".buy_now_checkout").css("background-color", "#0019f9")
            }
        })
      }

      function handleShippingZipInput() {
        let checkout_city_zip_error_section_el = $(".shipping_city_zip_error_section")
        $(".shipping_zip").on("keyup", function() {
            $(".billing_zip").val($(".shipping_zip").val())
            checkout_city_zip_error_section_el.text("")
            if($(".shipping_zip").val().length == 0 ) {
                $(".buy_now_checkout").css("background-color", "#D8DAE1")
            } else {
                $(".buy_now_checkout").css("background-color", "#0019f9")
            }
        })
      }

      function handleShippingStateInput() {
        
        $(".shipping_state").on("change", function() {
            let selected_state = $(".shipping_state").val()
            
            $(`.billing_state option[value=${selected_state}]`).attr('selected','selected');
        })
      }


      function handleCheckoutFirstName() {
        let checkout_name_error_section_el = $(".checkout_name_error_section")
        $(".billing_first_name").on("keyup", function() {
            checkout_name_error_section_el.text("")
            if($(".billing_first_name").val().length == 0 ) {
                $(".buy_now_checkout").css("background-color", "#D8DAE1")
            } else {
                $(".buy_now_checkout").css("background-color", "#0019f9")
            }
            
        })
      }

      function handleCheckoutLastName() {
        
        let checkout_name_error_section_el = $(".checkout_name_error_section")

        $(".billing_last_name").on("keyup", function() {
            checkout_name_error_section_el.text("")
            if($(".billing_last_name").val().length == 0 ) {
                $(".buy_now_checkout").css("background-color", "#D8DAE1")
            } else {
                $(".buy_now_checkout").css("background-color", "#0019f9")
            }
        })
      }

      function handleCheckoutAddress1() { 
        let checkout_address_1_error_section_el = $(".checkout_address_1_error_section")
        
        $(".billing_address_1").on("keyup", function () {
        checkout_address_1_error_section_el.text("")
        if($(".billing_address_1").val().length == 0 ) {
            $(".buy_now_checkout").css("background-color", "#D8DAE1")
        } else {
            $(".buy_now_checkout").css("background-color", "#0019f9")
        }
        })
      }

      function handleCheckoutCityInput() {
        let checkout_city_zip_error_section_el = $(".checkout_city_zip_error_section")
        $(".billing_city").on("keyup", function() {
            checkout_city_zip_error_section_el.text("")
            if($(".billing_city").val().length == 0 ) {
                $(".buy_now_checkout").css("background-color", "#D8DAE1")
            } else {
                $(".buy_now_checkout").css("background-color", "#0019f9")
            }
        })
      }

      function handleCheckoutZipInput() {
        let checkout_city_zip_error_section_el = $(".checkout_city_zip_error_section")
        $(".billing_zip").on("keyup", function() {
            checkout_city_zip_error_section_el.text("")
            
            if($(".billing_zip").val().length == 0 ) {
                $(".buy_now_checkout").css("background-color", "#D8DAE1")
            } else {
                $(".buy_now_checkout").css("background-color", "#0019f9")
            }
        })
      }

      function handleValidateCheckoutForm(first_name, last_name, address_1, city, zip_code, s_first_name, s_last_name, s_address_1, s_city, s_zip_code, card_number, card_expiry, card_cvv) {
        if (s_first_name.length == 0) {
        	let shipping_name_error_section_el = $(".shipping_name_error_section")
            shipping_name_error_section_el.text("")
            shipping_name_error_section_el.text("Please type your first name")
            return false
        }else if (s_last_name.length == 0) {
        	let shipping_name_error_section_el = $(".shipping_name_error_section")
            shipping_name_error_section_el.text("")
            shipping_name_error_section_el.text("Please type your last name")
            return false
        } else if (s_address_1.length == 0) {
        	let shipping_address_1_error_section_el = $(".shipping_address_1_error_section")
            shipping_address_1_error_section_el.text("")
            shipping_address_1_error_section_el.text("Please type your address")
            return false
        }  else if (s_city.length == 0) {
        	let shipping_city_zip_error_section_el = $(".shipping_city_zip_error_section")
            shipping_city_zip_error_section_el.text("")
            shipping_city_zip_error_section_el.text("Please type your city")
            return false
        } else if (s_zip_code.length == 0) {
        	let shipping_city_zip_error_section_el = $(".shipping_city_zip_error_section")
            shipping_city_zip_error_section_el.text("")
            shipping_city_zip_error_section_el.text("Please type your zip")
            return false
        } else if (first_name.length == 0) {
        	let checkout_name_error_section_el = $("#checkout_name_error_section")
            checkout_name_error_section_el.text("")
            checkout_name_error_section_el.text("Please type your first name")
            return false
        }else if (last_name.length == 0) {
        	let checkout_name_error_section_el = $("#checkout_name_error_section")
            checkout_name_error_section_el.text("")
            checkout_name_error_section_el.text("Please type your last name")
            return false
        } else if (address_1.length == 0) {
        	let checkout_address_1_error_section_el = $("#checkout_address_1_error_section")
            checkout_address_1_error_section_el.text("")
            checkout_address_1_error_section_el.text("Please type your address")
            return false
        }  else if (city.length == 0) {
        	let checkout_city_zip_error_section_el = $("#checkout_city_zip_error_section")
            checkout_city_zip_error_section_el.text("")
            checkout_city_zip_error_section_el.text("Please type your city")
            return false
        } else if (zip_code.length == 0) {
        	let checkout_city_zip_error_section_el = $("#checkout_city_zip_error_section")
            checkout_city_zip_error_section_el.text("")
            checkout_city_zip_error_section_el.text("Please type your zip")
            return false
        
         }  else if (card_number.length < 19) {
        	let card_error_section_el = $("#card_error_section")
            card_error_section_el.text("")
            card_error_section_el.text("Please type a valid card number")
            return false
         }else if (card_expiry.length < 5) {
        	let card_error_section_el = $("#card_error_section")
            card_error_section_el.text("")
            card_error_section_el.text("Please type a valid card expiry date e.g 02/26")
            return false
         } else if (card_cvv.length < 3) {
        	let card_error_section_el = $("#card_error_section")
            card_error_section_el.text("")
            card_error_section_el.text("Please type a valid card cvv")
            return false
         }
         
         else {
        	return true
        }
      }


      
    })
    
    
    