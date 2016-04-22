function switchContent(element) {
	
	// Get the element containing the necessary data based on Membership Level Passed in. 
	$c = $('div[name="'+element+'"]');
	
	// Variable Declarations.
	imagesrc = $c.find('img').attr("src");		
	oneyear = $c.find($('span.one-year')).text();
	twoyear = $c.find($('span.two-year')).text();
	notice = $c.find($('span.notice')).html();
	desc = $c.find('.description');
	benefits_var = $c.find('.benefits').html();

	$calc = true; 
	
	// get the cost and remove the dollar sign
	$cost = oneyear.replace('$','');

	if ( twoyear == "" || twoyear == undefined ) { setDuration(false); } else { setDuration(true); }

    if ($('input[name="Membership Type"]').is(':radio'))
    {
        var radios = $('input[name="Membership Type"]');
        radios.filter('[value="' + element + '"]').prop('checked', true);
    }
    else
    {
        $('#Membership_Type').val(element);
    }
  
	$('#pricing').fadeOut(100, 0, function() {						
		$p = $('#pricing'); 	
		$p.find('div.one-year span.cost').text(oneyear);
		if (twoyear == "") { $p.find('div.two-year').hide(); $p.find('div.one-year').addClass('solo'); }
		else { $p.find('div.two-year span.cost').text(twoyear); $p.find('div.one-year').removeClass('solo'); $p.find('div.two-year').show(); }
		
		if(typeof notice !== "undefined"){
			$p.find('div.notice').html(notice).show();
		}
		else{
			$p.find("div.notice").html("").hide();
		}

		$p.find('.description span').text(desc.text());	
	});
	
	// enable recurring payments for specific levels. 
	if ( $c.hasClass('monthly') ) {
		$('#Recurring_PaymentDiv').show(); 
		var $radios = $('input:radio[name="Recurring Payment"]');
		$radios.filter('[value=N]').prop('checked', true);
	} else {
		$('#Recurring_PaymentDiv').hide();
		$('input:radio[name="Recurring Payment"]').prop('checked', false);
	}
	
	if ( $c.hasClass('patron') ) {
		$redirect = $c.find( $('.redirect') );
		$('#pricing-detail a.view-benefits').hide();
		$('#pricing-detail a.learn-more').attr('href',$redirect.text());
		$('#pricing-detail a.learn-more').show();
		$('#membership_form').hide();
		$('input.eaSubmitButton').prop('disabled', true);
		$calc = false;
	}	else {
		$('#pricing-detail a.view-benefits').show();
		$('#pricing-detail a.learn-more').hide();
		$('#membership_form').show();
		$('input.eaSubmitButton').prop('disabled', false);
	}
	
	$('#details').fadeTo('fast', 0, function()
	{	
		$d = $('#details');
		$d.find('#benefits div').html(benefits_var);
		$(this).css('background-image', 'url(' + imagesrc + ')');
	
	}).delay(100).fadeTo('fast', 1, function() {		
		$('#pricing').fadeIn('fast');		
	});
	
	return $calc;
}

function calcTotal() {
	
	var $total; 
	var today = new Date();

	// Find Active
	var $active = $('div.content ul li.active');
	var $divname = $active.data("content");

	// Get Data
	var $c = $('div[name="'+$divname+'"]');
	var $oneyear = $c.find($('span.one-year')).text();
	var $twoyear = $c.find($('span.two-year')).text();
	
	// Test Duration
	var $duration = ($('input[name="Membership Term"]:checked').val());
	
	if ($duration == "730") {
		$total = Number($twoyear.replace('$',''));
	}	else {
		$total = Number($oneyear.replace('$',''));
	}
		
	if ($override && !$extend) { $total = $override; }
	
	$('#Membership_Cost').val( $total );
	
	// Test Optional
	var $donation = ($('#Optional_Donation').val()).replace('$','');
	if ($donation.toString().toLowerCase() == "other") {
		$donation = $("#Optional_DonationInput").val();
	}

	// Recurring Setting
	var $recurring = $('input[name="Recurring Payment"]:checked').val(); 
	
	// Check the split
	var $split = $('input[name="Membership Term"]:checked').val(); 
	
	if (Number($split) == 365) {
		$split = 12;
	} else {
		$split = 24;
	}
	// Get the Total Value with Donation
	$total = Number($total) + Number($donation.replace('$',''));
	
	if ($extend) { $('input[name="Membership Term"]').val($extend); }
		
	// Check for Recurring 
	if ( $recurring == "Y" ) { 
		$('.monthlytext').show();
		$total = $total / Number($split);
		$("#Donation_Amount").val($total.toFixed(2));				
	} else {
		$('.monthlytext').hide();		
	}
	
	// Display the Result	
	$("#Donation_Amount").val($total.toFixed(2));

}

function showCards( $m, $c ) {
	
	if (typeof($m) != "undefined") {	
		if ( $m.toString() == "true" ) { $(".member_two").show(); } else { $(".member_two").hide(); }	
	} else {
		$(".member_two").hide();
	}
	
	if (typeof($c) != "undefined") {	
		if ( $c.toString() == "true" ) { $(".member_three").show(); } else { $(".member_two").hide(); }
	} else {
		$(".member_three").hide();		
	}
	
	return;
}

function setDuration( $extend ) {
	
	var $twoyear = $('<span class="eaFormRadio"><input id="Membership_Term730" type="radio" name="Membership Term" value="730" onblur="validatefield(this);" onclick="checkdep(this);"><label for="Membership_Term730">2 years</label></span>');
	
	if ($extend == true) {
		$('#Membership_Term730').parent().remove();
		$('#Membership_TermField').append($twoyear);
	}	else {
		$('#Membership_Term730').parent().remove();
	}
	
	$('input:radio[name="Membership Term"]:first').attr('checked', true);
	$('input:radio[name="Membership Term"]:first').prop('checked', true);
}

$current_level = null;
$override = null;
$extend = null;

$(document).ready(function() {	  
	
	var $promos = {
    'AIA' : {
        'Individual' : 87,
        'Family Dual' : 129,
        'Rom Social' : 129
	},
    'CPAC' : {
        'Individual' : 87,
        'Family Dual' : 129,
		'Rom Social': 129,
        'Senior Family' : 127,
		'Senior Family Two' : 127
    },
    'REJOIN' : {
        'Student' : 54,
		'Individual' : 97,
		'Non-Resident' : 102,
        'Family Dual' : 149,
		'Rom Social': 149,
        'Senior Family' : 145,
		'Senior Family Two' : 145,
	    'Curators Circle': 189,
        'Museum Circle' : 323,
		'Directors Circle': 626
	},
    'FNL16' : {
        'Individual' : 77,
        'Rom Social' : 129,
        'Student' : 34
    },  
    'VIRGINMOBILE' : {
        'Family Dual' : 85
	},  
    'FAMMEM' : {
        'Family Dual' : 95,
        'Rom Social' : 95
   }, 
    'SENMEM' : {
        'Senior Family' : 94,
        'Senior Family Two' : 94
    }, 
    'INDMEM' : {
        'Individual' : 82
    }, 
    'TA16RM' : {
        'Family Dual' : 129
    }, 
    'MUSKOKA16' : {
        'Family Dual' : 129
    },
    'KURIOS' : {
        'Individual' : 87,
        'Family Dual' : 129,
        'Rom Social' : 129      
    },
    'GOOGLE' : {
        'Individual' : 87,
        'Family Dual' : 129,
        'Rom Social' : 129      
    },
    'ROMSOC' : {
        'Rom Social' : 129      
   	},
    'CIRCLE' : {
        'Individual' : 97,
        'Family Dual' : 149,
        'Rom Social' : 149,
        'Senior Family' : 145,
        'Senior Family Two' : 145
    },
    'MEMBER' : {
        'Individual' : 97,
        'Family Dual' : 149,
        'Rom Social' : 149,
        'Senior Family' : 145,
        'Senior Family Two' : 145
    },
    'ACCE' : {
        'Individual' : 87,
        'Family Dual' : 129,
        'Rom Social' : 129,
        'Senior Family' : 127,
        'Senior Family Two' : 127   
    },
    'CPAC' : {
        'Individual' : 87,
        'Family Dual' : 129,
        'Rom Social' : 129,
        'Senior Family' : 127,
        'Senior Family Two' : 127
    },
    'ROMINK' : {
        'Individual' : 87,
        'Family Dual' : 129,
        'Rom Social' : 129,
        'Senior Family' : 127,
        'Senior Family Two' : 127
	},
    'PERKS' : {
        'Individual' : 87,
        'Family Dual' : 129,
        'Rom Social' : 129,
        'Senior Family' : 127,
        'Senior Family Two' : 127
	},
    'CAP2016' : {
        'Family Dual' : 100
    },
    'LCBO' : {
        'Family Dual' : 113
	},
    'PERKOPOLIS' : {
        'Family Dual' : 113	
	},
    'ESERVUS' : {
        'Family Dual' : 113
	},
    'OXFORD' : {
        'Family Dual' : 113
	},
    'METROLANDWEST' : {
        'Family Dual' : 113
    },
    'MEMGIFT' : {
        'Individual' : 87,
        'Family Dual' : 129,
        'Rom Social' : 129,
        'Senior Family' : 127,
        'Senior Family Two' : 127,
        'Non-Resident' : 92
   },
    'CAPERS' : {
        'Individual' : 87,
        'Family Dual' : 129,
        'Rom Social' : 129
   },
    'ROMGS' : {
        'Individual' : 87,
        'Family Dual' : 129,
		'Rom Social': 129,
        'Senior Family' : 127,
		'Senior Family Two' : 127
   },
    'MOM16' : {
        'Individual' : 87,
        'Family Dual' : 129,
        'Rom Social' : 129,
        'Senior Family' : 127,
        'Senior Family Two' : 127,
        'Non-Resident' : 92
   },
    'TIFF' : {
        'Family Dual' : 112,
        'Rom Social' : 112
  	}
	};
	
	/* EN IU 190614 */
	var $extensions = {
		'telephone1010' : 450,
		'CIRCLE': 425,
		'MEMBER': 395
	};
	
	$("#Appeal_Code").keyup( function() {

		var $code = $(this).val();

    var $amount = "";
  
    if ( typeof $promos[$code] !== 'undefined') {
    	if ( typeof $promos[$code][$current_level] !== 'undefined') {
      	$(this).css('background','#d8ffd3');      
				$override = $promos[$code][$current_level];				
				
				/* EN IU 190614 */
				if ($extensions[$code]) {
					$extend = $extensions[$code];
				} else {
					$extend = false;
				}
				
				calcTotal();
				setDuration(false);
				
			}
		} else {
	    $(this).css('background','#ffffff');
	    $override = null;
	    $extend = null;
			calcTotal();
			setDuration(false);
		}
		
	});
	
	if ($('#memDiv').length > 0) {
		$('#member_select_tool').hide();
		return;
	}
	
	// Sort the Form into columns	
	formfix();
	
	// Membership Level Select 
	$('div.content ul li').click( function() {
		
		$current_level = $(this).data("content");
		
		// If its already selected, just leave. 
		if ($(this).hasClass('active')) return;
		
		$("#Appeal_Code").val("");
		$("#Appeal_Code").css('background', 'white');
    $override = null;

		// Otherwise remove all active elements. 
		$('div.content ul li').removeClass('active');

		// Add the active class to the current element. 
		$(this).addClass('active');
		
		// Fade out the benefits in case its selected. 
		$('#benefits').fadeOut(200);
		
		// Show the necessary cards for this Level
		showCards( $(this).data("showcard2"), $(this).data("showcard3") );
		
		// Set Recurring Payment
		$('input[name="Recurring Payment"]').change( function() {
			calcTotal();
		});
		
		// Switch the content based upon level. 
		if ( switchContent( $(this).data("content") ) == true ) {
			// All is good, calc the total. 
			calcTotal();
		} else {
			// Something wrong, pass a zero to the Donation.
			$("#Donation_Amount").val("0");
		}
		 
	});
	
	// Fade Benefits Events
	$('a.view-benefits,a.close-benefits').click( function() {	
		$('#benefits').fadeToggle(200);		
	});
	
	// Set Gift Membership
	$('input[name="Gift Membership"]').click( function() {
		if (this.checked) {
			$(".member_four").show();
			$("#giftoptions").show();
		} else {
			$(".member_four").hide();
			$("#giftoptions").hide();
		}		
	});
	
	$('#Donation_AmountField').prepend('<span class="cursymbol">$</span>');
	$('#Donation_AmountField').append('<span class="monthlytext">per<br />month</span>');

	// Calculate a new total when anything changes
	$('form').change(function() {
    calcTotal();
  });
  
  // Select the default Membership Level
	$('div.content ul li').filter( function() { return $(this).hasClass('active'); } ).removeClass('active').trigger('click');
	
});

function formfix() {
	
	var row = "<div class='row'/>";
	var six = "<div class='six columns'></div>";
	var twelve = "<div class='twelve columns'></div>";
	
	$("#Billing_InformationDiv").addClass('headline');
	$("#Payment_InformationDiv").addClass('headline');
	$("#Optional_Donation_TitleDiv").addClass('headline');
	$("#Member_Ship_Card_NameDiv").addClass('headline');
	$("#Purchase_Total_TitleDiv").addClass('headline');
	$("#SubscriptionsDiv").addClass('headline');
	$("#membership_intro").html( $("#membership_page_introDiv") );
	
	var $mem = $('<div class="row"/>').append($("#Card_First_NameDiv").addClass("six columns")).append($("#Card_Last_NameDiv").addClass("six columns"));
	var $alt = $('<div class="row"/>').append($("#2nd_Card_First_NameDiv").addClass("six columns")).append($("#2nd_Card_Last_NameDiv").addClass("six columns"));
	var $care = $('<div class="row"/>').append($("#Caregiver_First_NameDiv").addClass("six columns")).append($("#Caregiver_Last_NameDiv").addClass("six columns"));

	var $inf1 =  $('<div class="row"/>').append($("#Inform_NameDiv").addClass("six columns")).append($("#Inform_EmailDiv").addClass("six columns"));
	var $inf2 =  $('<div class="row"/>').append($("#Inform_AddressDiv").addClass("twelve columns"));		
	
	var $gopt = $('<div id="giftoptions"/>').append($("#Gift_RecognitionField")).append($("#Tribute_OptionsField"));
	var $opt = $('<div class="row"/>').append($("#Gift_MembershipDiv").addClass("twelve columns"));
	var $gicon = $('<div id="gift-icon"/>');

	$gift = $('<div class="gift_option four columns"/>').append($gicon, $opt, $gopt );
	
	$card1 = $('<div class="twelve columns" />').append( $('#membership_card_detailsDiv') );
	$card2 = $('<div class="twelve columns" />').append( $('#membership_card_2_detailsDiv') );
	$card3 = $('<div class="twelve columns" />').append( $('#caregiver_detailsDiv') );
	$card4 = $('<div class="twelve columns" />').append( $('#recipient_detailsDiv') );
	
	$member1 = $('<div class="member_one six columns"/>').append($card1, $mem);
	$member2 = $('<div class="member_two six columns"/>').append($card2, $alt);
	$member3 = $('<div class="member_three six columns end"/>').append($card3, $care);
	$member4 = $('<div class="member_four six columns"/>').append($card4, $inf1, $inf2);
	
	$membercards = $('<div class="eight columns"/>').append( $('<div class="row"/>').append($member1, $member2, $member4, $member3) ); 
	
	$("#Member_Ship_Card_NameDiv").wrap('<div class="additionalopt romform row"/>').after( $gift, $membercards );

	var $promo = $('<div class="row"/>').append($("#Appeal_CodeDiv").addClass("six columns end"));

	var $name = $('<div class="row"/>').append($("#TitleDiv").addClass("three columns")).append($("#First_NameDiv").addClass("four columns")).append($("#Last_NameDiv").addClass("five columns"));
	var $addr = $('<div class="row"/>').append($("#AddressDiv").addClass("six columns")).append($("#Address_2Div").addClass("six columns"));
	var $addr2 = $('<div class="row"/>').append($("#CityDiv").addClass("six columns")).append($("#RegionDiv").addClass("six columns"));
	var $addr3 = $('<div class="row"/>').append($("#Postal_CodeDiv").addClass("six columns")).append($("#CountryDiv").addClass("six columns"));
	var $addr4 = $('<div class="row"/>').append($("#Home_PhoneDiv").addClass("six columns")).append($("#Business_PhoneDiv").addClass("six columns"));
	var $email = $('<div class="row"/>').append($("#Email_AddressDiv").addClass("six columns end"));
	var $dur = $('<div class="row"/>').append($("#Membership_TermDiv").addClass("six columns")).append($('#Recurring_PaymentDiv').addClass("six columns"));
	 
	var $cc1 = $('<div class="row"/>').append($("#Payment_TypeDiv").addClass("six	columns")).append($("#Credit_Card_NumberDiv").addClass("six columns"));
	var $cc2 = $('<div class="row"/>').append($("#Credit_Card_ExpirationDiv").addClass("six columns end")).append($("#CVV_CodeDiv").addClass("six columns"));
	var $don = $('<div class="row"/>').append($("#Optional_DonationDiv").addClass("seven columns")).append($("#Direct_My_GiftDiv").addClass("five columns"));

	var $tot = $('<div class="row"/>').append($("#Donation_AmountDiv").addClass("six columns")).append($(".eaSubmitResetButtonGroup").addClass("six columns"));
	
	var $sub1 = $('<div class="row"/>').append($('#Childrens_Programming_Opt-InDiv').addClass("twelve columns"));
	var $sub2 = $('<div class="row"/>').append($('#Seniors_Programming_Opt-InDiv').addClass("twelve columns"));
	var $sub3 = $('<div class="row"/>').append($('#ROM_Will_Opt-InDiv').addClass("twelve columns"));
	
	$("#Billing_InformationDiv").wrap("<div class='rompersonal six columns'>").after($name,$addr,$addr2,$addr3,$addr4,$email,$("#SubscriptionsDiv"),$sub1,$sub2,$sub3)
	$("#Optional_Donation_TitleDiv").wrap("<div class='rompayment six columns'>").after($don,$("#Payment_InformationDiv"),$dur,$cc1,$cc2,$promo,$("#Purchase_Total_TitleDiv"),$tot);	
	
	$('.rompersonal').wrap('<div class="paymentdetails romform row"/>').after( $('.rompayment') );		
	$('.headline').wrap('<div class="twelve columns"/>');

	return; 
}
// Adding a comment
