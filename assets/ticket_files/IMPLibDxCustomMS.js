/**
 * @class
 * Airline specific library
 *
 * @author: 1A xHTML Implementation team
 * @version 1.28
 *
 *2021-12-07 - WO 22266424 - Stop force servicing currency USD when initial office is BAHMS08AA, and add new currency to currency/OID mapping
 *2021-08-11 - WO 21666429 - Stop sales on SAHMS08AA
 *2021-03-08 - WO 20667298 - OID mapping for us market only NYCMS08AA
 *2021-02-21 - WO 20145433 - Hide additional service button if flight status is not HK or KK
 *2021-02-19 - WO 20730695 - adding notes to error box displayed at RTPL - see updateDomIfNotFound
 *2020-11-20 - WO 20256714 - hide Amex if less than 24 hrs
 *2020-11-07 - IR 20233180 - hide "modify flight" in case of partially flown. see function hideChangeFlightButtonIfPartial
 *2020-10-23 - IR 20195309 - fix encode characters on fn customizeCountryNames
 *2020-09-22 - IR 19909999
 *2020-04-28 - WO 18345379
 *2020-04-10 - IR 18708619 Pixels
 *2020-03-31- IR 18958293 Nationality & Issuing country discrepancies
 *2020-02-24 - WO 18597090 - Remove fictitious points
 *2020-02-19 SC: IR 18597078 / PTR 18669075 / PTR 18494324
 *2019-12-20:: SC WO 17938648: updates for destination address
 *2019-12-10: SC: WO 17539959 - Others GDS AAAS and ATC
 *2019-11-29: SC: WO 17938648 - APIS country
 *2019-10-21 SC: WO 17796045  - atc mapping
 *2019-10-14 SC - WO 17424623 - tkt nb
 *2019-09-24 SC- WO 17633671 - meda
 *2019-05-13 SC - IR 16920332 seats and IE
 *2019-04-14 SC - IR 16853265 - Lebanon
 *2019-03-20: SC - IR 16636207
 *2019-02-12: SC - IR 16473295
 *2019-02-12: SC avail warning removal
 *2019-01-29: SC WO PTR 16049275 ATC
 *2018-11-28: SC 1.12 WO 15965734 group
 *2018-11-21: SC: 1.11 WO 16040361 -prevent contact details update
 *2018-10-29: SC 1.10.1 - WO 15947243 texts
 *2018-10-22: SC 1.10 - WO 15947243 office ID & Retrieve
 *2018-10-19: SC 1.9 - WO 15935359: Pixel
 *2018-03-05: SC 1.8 - WO 14798541: Important configurations in ATC and Ancillaru services
 *2017-10-18: SC - Visa message on conf/rtpl pages (1.7.1)
 *2017-08-29: SC updates for Facebook pixel
 *2017-08-07: SC updates for analytics
 *2017-05-09: SC WO 12664613 - fb code on payment page
 *2017-03-27: SC - 13146533 ATC office IDs restriction  + Fawry email address change
 *2017-02-14: SC Bagg allowance for LIGHT
 *2017-02-01: SC - Bagg allowance msg
 *2017-01-06: BB - Allow services selection for offline PNRs.
 *2017-01-04: BB - Updating on line 384 the test performed to check that a PNR is an online or not.
 *2016-12-20: BB - Adding the FB tracking code , WO 12664613
 *2015-09-28: IE - creation (1.0)
 *
 */
function IMPLibDxCustom(libraries) {
	var self = this;

	for (var i = 0; i < libraries.length; i++) {
		document.writeln("<script src='" + libraries[i] + "'><" + "/script>");
	};

	/**
	 * Google analytics script loading depending on the environment
	 */
	/** Temporarily removed */
	if (window.location.hostname.indexOf("wav.") >=0){
		var gaUrl = "https://www.egyptair.com/Style%20Library/LINKDev/JS/tagManager.debug.js";
	} else {
		var gaUrl = "https://www.egyptair.com/Style%20Library/LINKDev/JS/tagManager.js"
	}
	document.writeln("<script src='" + gaUrl + "'><" + "/script>");


	/**
	 * Version of the library: 1.2
	 */
	this.VERSION = "1.2";

	/** PCC 186 */
	this.number_of_attempts = 0;

	this.officeIdMap = {
 	  'EGP': 'CAIMS08AA',
		'EUR': 'PARMS08AA', /*to be modified with WO 17996833 */
		'CNY': 'BJSMS08AA',
		'THB': 'BKKMS08AA',
		'DKK': 'CPHMS08AA',
		'SYP': 'DAMMS08AA',
		'QAR': 'DOHMS08AA',
		'AED': 'DXBMS08AA',
		'CHF': 'GVAMS08AA',
		'HKD': 'HKGMS08AA',
		'SAR': 'JEDMS08AA',
		'ZAR': 'JNBMS08AA',
		'USD': 'LAXMS08AA', /* WO 17796045 new mapping */
		'GBP': 'LONMS08AA',
		'YER': 'LAXMS08AA', /* WO 21666429 stop sales on SAHMS08AA*/
		'JPY': 'TYOMS08AA',
		'INR': 'BOMMS08AA',
		'CAD': 'YULMS08AA',
		'RUB': 'MOWMS08AA',
		'BHD': 'BAHMS08AA', /* WO 22266424 new mapping */
		'OMR': 'MCTMS08AA', /* WO 22266424 new mapping */
		'KWD': 'KWIMS08AA', /* WO 22266424 new mapping */
		'TND': 'TUNMS08AA' /* WO 22266424 new mapping */
	};

 	// WO 13146533
	this.restrictedOfficeIdForATC = [ 'CAIMS00OT' ];

	// WO 15947243
	this.restrictedOfficeIdForRetrieve = [ 'CAIMS0111' ];

	this.fallbackOfficeId = 'LAXMS08AA'; // WO 17539959

	this.RetrieveRestrictedPNRErrorText = {
			"AR" : "&#1582;&#1591;&#1571; &#8211; &#1604;&#1575; &#1610;&#1605;&#1603;&#1606; &#1575;&#1587;&#1578;&#1593;&#1585;&#1575;&#1590; &#1607;&#1584;&#1575; &#1575;&#1604;&#1581;&#1580;&#1586; &#1575;&#1608;&#1606;&#1604;&#1575;&#1610;&#1606;",
			"CN" : "&#26412;&#39044;&#35746;&#26080;&#27861;&#22312;&#32447;&#26174;&#31034;",
			"DE" : "Diese Reservierung kann online nicht dargestellt werden",
			"FR" : "Cette r&#233;servation ne peut pas &#234;tre affich&#233;e en ligne",
			"GB" : "This reservation cannot be displayed online",
			"IT" : "Questa prenotazione non pu&#242; essere visualizzata online",
			"ES" : "Esta reserva no se puede mostrar en l&#237;nea"
	};

	this.posMap = {
	};


	/**
	 *	ATC Eligibility
	 *	returns true if the PNR was booked at least 24h before the retrieve date
	 */
	this.isBooked24hAgo = function() {
		var bookingDateStr = implibdx.core.getJson().pnr_creation_date;
		if (bookingDateStr) {

			var bookingDate = new Date(bookingDateStr);
			var bookingDatetime = bookingDate.getTime();
			var timeLimit = bookingDatetime + 24*3600*1000;

			var nowDate = new Date();
			var nowDatetimeUtc = nowDate.getTime();

			return timeLimit < nowDatetimeUtc;
		}
		return true;
	};


	this.isCandidateForAtc = function() {
		var m_isAirlineOffice = implibdx.core.getInitialOfficeId().indexOf("MS0") >= 0

		return m_isAirlineOffice;
	};


	/*WO 20145433 - Hide additional service button if flight status is not HK or KK*/
	this.HideAaasIfFlightUnconfirmed = function() {
		
		for (var i = 0; i < eBaDataLayer.bound.length; i++){
			for (var j = 0; j < eBaDataLayer.bound[i].flights.length; j++){
				
				var ConfirmedFlightCode = ["HK","KK"];
				var FlightStatus = plnextv2.utils.context.AppContext.getPageData().business.ItineraryList.listItinerary[i].listSegment[j].statusCode;
				if (jQuery.inArray(FlightStatus,ConfirmedFlightCode) == -1){
					implibdx.aaas.hideModifyButton();
				}
			}
		}
	};


	this.addFBtrackingcode = function(pageCode) {
		if (pageCode == "PURC" || pageCode == "CONF") {
      /* IR 18708619 */
			// !function(f,b,e,v,n,t,s){
      		//
			// 	if(f.fbq) return;
			// 	n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      		//
			// 	if(!f._fbq) f._fbq=n;
			// 	n.push=n;
			// 	n.loaded=!0;
			// 	n.version='2.0';
			// 	n.queue=[];
			// 	t=b.createElement(e);
			// 	t.async=!0;
			// 	t.src=v;
			// 	s=b.getElementsByTagName(e)[0];
			// 	s.parentNode.insertBefore(t,s)
      		//
			// } (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
			fbq('init', '530883397062247');
			fbq('track', 'PageView');
			if (pageCode == "CONF") {
				fbq('track', 'Purchase', {value: eBaDataLayer.price_details.total_price, currency: eBaDataLayer.currency});
			}
			$('head').append("<img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=530883397062247&ev=PageView&noscript=1'/>");
		}
	};

	/** New Pixel on all pages, WO august 2017 */
	this.addFBtrackingcodeAll = function(pageCode) {
		!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
		n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
		n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
		t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
		document,'script','https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '111843336154668');
		fbq('track', 'PageView');

		$('head').append("<img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=111843336154668&ev=PageView&noscript=1'/>");
	}

	/** New Pixel on all pages, WO Oct 2018 */
	this.addFBtrackingcodeConfBRU = function(pageCode) {
    /* IR 18708619 */
		// !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
		// n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
		// n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
		// t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
		// document,'script','https://connect.facebook.net/en_US/fbevents.js');
		fbq('init', '1544370482330503');
		fbq('track', 'PageView');
		fbq('track', 'Purchase', {value: '1.00', currency: 'USD'});
		$('head').append("<img height='1' width='1' style='display:none' src='https://www.facebook.com/tr?id=1544370482330503&ev=PageView&noscript=1'/>");
	}

	//Update DOM if element not found
	this.updateDomIfNotFound = function(element, callback, timeout, max_trials, trials) {
		var m_timeout = timeout || 1000;
		var m_max_trials = max_trials || 5;
		var m_trials = trials || 0;


		if (jQuery(element).length > 0) {
			implibdx.core.debug("Element " + element + " found on the page");
		}
		else {
			if (m_trials < m_max_trials) {
				implibdx.core.debug("Wait for loading of " + element);
				setTimeout(function() {
					self.updateDomIfNotFound(element, callback, m_timeout, m_max_trials, m_trials + 1);
				}, m_timeout);
			}
			else {
				callback();
			}
		}
	}

	/**
	 *  To be removed after PCP - 189 : ALLOW_REFUND_STOP in ATC flow
	 *  YY-ECO-B2C-PCP-76 ATC for non-netting sites
	 */
	this.performOnNetting = function() {
		var NotEligibleToRefundMessages = {
			"GB": "This selected fare doesn't match your purchase conditions. Please choose a different fare type.",
			"AR": "&#1610;&#1585;&#1580;&#1609; &#1575;&#1582;&#1578;&#1610;&#1575;&#1585; &#1601;&#1574;&#1577; &#1571;&#1582;&#1585;&#1609; &#1605;&#1606; &#1601;&#1574;&#1575;&#1578; &#1575;&#1604;&#1571;&#1587;&#1593;&#1575;&#1585; (157009)",
			"FR": "Le tarif s&eacute;lectionn&eacute; ne correspond pas &agrave; vos conditions d&apos;achat. Veuillez choisir un type de tarif diff&eacute;rent.",
			"ES": "La tarifa seleccionada no coincide con sus condiciones de compra. Por favor, seleccione un tipo de tarifa diferente.",
			"IT": "La tariffa selezionata non corrisponde alle vostre condizioni di acquisto. Siete pregati di scegliere una tariffa di tipo diverso",
			"DE": "Der ausgew&auml;hlte Tarif nicht entsprechen Ihren Einkaufskonditionen. Bitte w&auml;hle eine ",
			"CN": "&#25152;&#36873;&#36153;&#29992;&#19982;&#24744;&#30340;&#36141;&#20080;&#26465;&#20214;&#19981;&#31526;&#12290;&#35831;&#36873;&#25321;&#20854;&#23427;&#36153;&#29992;&#31867;&#22411;&#12290; (157009)"
		};

		implibdx.temp.atcRefundStop(NotEligibleToRefundMessages);
	};


	this.errorEmail = function() {
		if (document.getElementById("widget-group-travellerList-contactInformation-EmailConfirm").getElementsByClassName("help-block")[0].innerText.includes("4080")){
			document.getElementById("widget-group-travellerList-contactInformation-Email").className = "form-group has-feedback has-error";
			document.getElementById("tpl15_error-message-travellerList-contactInformation-Email-icon").className = "form-control-feedback icon-exclamation-sign";
			document.getElementById("tpl15_widget-input-travellerList-contactInformation-Email").setAttribute("aria-invalid", "true");
			document.getElementById("tpl15_error-message-travellerList-contactInformation-Email-tooltip-icon").getElementById("tpl29_error-message-travellerList-contactInformation-Email-icon").style.display = "block";
		}
	}

	/** Additional message in terms and conditions  */
	this.termsAndCond = function() {
		var jSONData = implibdx.core.getJson();
		if (jSONData) {
			var bound = jSONData.bound;
			if(bound) {
				for (var boundIndex=0; boundIndex<bound.length; boundIndex++) {
					var flights = bound[boundIndex].flights;
					if (flights) {
						for (var flightIndex=0; flightIndex<flights.length; flightIndex++) {
							if (flights[flightIndex].fare_family_code == "BASIC" || flights[flightIndex].fare_family_code == "LIGHT") {
								implibdx.core.updateDom("#terms-and-cond-ff", function() {
										jQuery("#terms-and-cond-ff").show();
								});
								break;
							}
						}
					}
				}
			}
		}
	}



	var visaDestinations = new Array ('DXB', 'AUH', 'SHJ');
	/**
	 * Visa message when travelling to some destinations
	 */
	this.visaMessage = function (visaDestinations) {
		var boundsNb = eBaDataLayer.bound.length;
		var messageToBeDisplayed = false;
		for (var i = 0; i < boundsNb; i++){
			if (visaDestinations.indexOf(eBaDataLayer.bound[i].arr_city /*or arr_airport*/) > -1 ) {
				messageToBeDisplayed = true;
			}
		}
		if (messageToBeDisplayed) {
			jQuery(document.body).append(
				"<style id = 'customStyleVisa'>.custom-visa-rtpl,.custom-visa-conf{display:block !important;font-weight:bold}</style>"
			);
		}
	}

  	var ctaDestinations = new Array ('CA');
	/**
	* Visa message when travelling to some destinations
	*/
  	this.ctaMessage = function (visaDestinations) {
	    var boundsNb = eBaDataLayer.bound.length;
	    var messageToBeDisplayed = false;
	    for (var i = 0; i < boundsNb; i++){
	      if (ctaDestinations.indexOf(eBaDataLayer.bound[i].arr_country) > -1 ) {
	        messageToBeDisplayed = true;
	      }
	    }
	    if (messageToBeDisplayed) {
	      jQuery(document.body).append(
	        "<style id = 'customStyleCTA'>.custom-cta-rtpl,.custom-can-conf{display:block !important;font-weight:bold}</style>"
	      );
    	}
  	}


	this.isGroupPNR = function() {
		var morethanNinePax = (eBaDataLayer.passengers.length > 9);
		var containsGroupRBD = false;
			for (key in eBaDataLayer.fare_basis) {
				if (eBaDataLayer.fare_basis.hasOwnProperty(key)) {
					var fareBasis = eBaDataLayer.fare_basis[key];
					if (fareBasis && fareBasis.indexOf('G')==0 ) {
						containsGroupRBD = true;
					}
				}
			}
		 return morethanNinePax || containsGroupRBD;
	}


	this.adjustRetrievePage = function(errorText) {

		plnextv2.utils.ImplementationUtils.addError("",errorText, "E");
		implibdx.core.updateDom("#flight-notes", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleFlightNotesHide'>#flight-notes{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".send-email", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleSendEmailHide'>.send-email{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".custom-links-car-hotel-bag", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleCarHotelBagHide'>.custom-links-car-hotel-bag{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".flight-timeline-status-panel", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleFlightsTimelineHide'>.flight-timeline-status-panel{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".confirm-banner", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleModifyPaxHide'>.confirm-banner{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".plnext-dropdown.dropdown-container.reservation-dropdown", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleModifyPaxHide'>.plnext-dropdown.dropdown-container.reservation-dropdown{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".travellers-panel-footer.panel-footer", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleModifyPaxDetailsHide'>.travellers-panel-footer.panel-footer{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".servicesbreakdown-footer.panel-footer.hidden-print", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleServicesHide'>.servicesbreakdown-footer.panel-footer.hidden-print{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".insurance-buttons-container.hidden-print.insurance-add-button", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleInsuranceHide'>.insurance-buttons-container.hidden-print.insurance-add-button{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".travreview-review-banner", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleTravReviewHide'>.travreview-review-banner{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".heading.uppercase.flight-status-warning-panel.panel.onHold", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleOnHoldHide'>.heading.uppercase.flight-status-warning-panel.panel.onHold{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".plnext-widget-btn.btn.btn-secondary.reservation-btn.print-doc", function() {
			jQuery(document.body).append(
				"<style id = 'customStylePrintHide'>.plnext-widget-btn.btn.btn-secondary.reservation-btn.print-doc{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".plnext-widget-btn.btn.btn-secondary.reservation-btn.new-search", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleNewSearchHide'>.plnext-widget-btn.btn.btn-secondary.reservation-btn.new-search{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".plnext-widget-btn.btn.btn-secondary.reservation-btn.go-home", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleHomeHide'>.plnext-widget-btn.btn.btn-secondary.reservation-btn.go-home{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".reservation-info-wrapper", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleReservationInfoHide'>.reservation-info-wrapper{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".farereview-price", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleFarereviewPriceHide'>.farereview-price{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".farereview-bounds", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleFarereviewBoundHide'>.farereview-bounds{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".farereview-travellers-horizontal", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleFarereviewTravellersHide'>.farereview-travellers-horizontal{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".insurance", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleInsuranceHide'>.insurance{display:none}</style>"
			);
		});
		implibdx.core.updateDom("#baggages-details", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleBaggageHide'>#baggages-details{display:none}</style>"
			);
		});
		implibdx.core.updateDom("#before-departure", function() {
			jQuery(document.body).append(
				"<style id = 'customStyleBeforeDepartureHide'>#before-departure{display:none}</style>"
			);
		});
		implibdx.core.updateDom(".servicesbreakdown-container", function() {
			jQuery(document.body).append(
				"<style id = 'customServicesHide'>.servicesbreakdown-container{display:none}</style>"
			);
		});
	};

	// WO -16040361  On MALPI, prevent modification of contact information except if they are empty
	this.preventContactModification = function() {
		implibdx.core.updateDom(".traveller-contact-information-panel-body", function() {
			if ($("input[id$='contactInformation-Email']")[0].value) {
					$("input[id$='contactInformation-Email']").attr("disabled", "disabled");
					$("input[id$='contactInformation-EmailConfirm']").attr("disabled", "disabled");
			}
			if ($("input[id$='contactInformation-PhoneHome']")[0].value) {
				$("input[id$='contactInformation-PhoneHome']").attr("disabled", "disabled");
			}
			if ($("input[id$='contactInformation-PhoneMobile']")[0].value) {
				$("input[id$='contactInformation-PhoneMobile']").attr("disabled", "disabled");
			}
			if ($("input[id$='contactInformation-PhoneSmsNotif']")[0].value) {
					$("input[id$='contactInformation-PhoneSmsNotif']").attr("disabled", "disabled");
			}
		});
	};

  	// WO 17633671
  	var medaDestinations = new Array ('JFK', 'IAD');
  	this.customizeDFSR = function() {
	    var boundsNb = eBaDataLayer.bound.length;
	    var messageToBeDisplayed = false;
	    for (var i = 0; i < boundsNb; i++){
	      if (medaDestinations.indexOf(eBaDataLayer.bound[i].arr_airport /*arr_city*/) > -1 ) {
	        messageToBeDisplayed = true;
	      }
	    }
	    if (messageToBeDisplayed) {
	       jQuery(document.body).append(
	        "<style id = 'customStyleMeda'>.custom-meda {display:block !important;font-weight:bold}</style>"
	      );
	    }
  	};

  	/* WO 17424623 - Block based on ticket number */
	this.blockNonMSTickets = function() {
		  var arr = ["077"];
			implibdx.core.updateDom("#RTPL-page-content .pnrd-view .btn", function(){
				if((eBaDataLayer.passengerList[0].etkt_numbers  != undefined) && (jQuery.inArray(eBaDataLayer.passengerList[0].etkt_numbers[0].split("-")[0],arr) == -1)){
					//jQuery("#RTPL-page-content .pnrd-view .btn").hide();
					implibdx.aaas.hideModifyButton();
          			implibdx.atc.hideChangeFlightButton();
				}
			});
	};

 	/* IR 20233180 - hide "modify flight" if partially flown. */
	this.hideChangeFlightButtonIfPartial = function() {		
		if(plnextv2.utils.context.AppContext.getPageData().business.ItineraryList.listItinerary[0].flown == true){
			implibdx.atc.hideChangeFlightButton();
		}	
	};

		/* WO 20256714 - hide Amex if less than 24 hrs */
	this.hideAmex24Hr = function() {
		var DepartureDate = new Date(eBaDataLayer.bound[0].flights[0].departure.date_time);
		var BookingDate = new Date();
		var CompareDate = (DepartureDate - BookingDate) / 1000 / 60 / 60; //Compare and convert into number of hours
		if (CompareDate < 24) {
			implibdx.core.updateDom("div.radio", function() {
				jQuery("span:contains('American Express')").parents('div.radio').hide();
				//jQuery("div.radio:contains('American Express')").hide();
			});
		}
	};

	this.customizeCountryNames = function() {
		var tw_cn = "&#20013;&#22269;&#21488;&#28286;";
		var mo_cn = "&#20013;&#22269;&#28595;&#38376;&#29305;&#21035;&#34892;&#25919;&#21306;";
	    implibdx.core.updateDom(".traveller-panel-body-identity", function() {
	        var translations = {
	          TW:{CN:"\u4e2d\u56fd\u53f0\u6e7e", GB: "Taiwan (China)", FR: "Chine (Chine)", AR:"\u062a\u0627\u064a\u0648\u0627\u0646 \u060c \u0627\u0644\u0635\u064a\u0646",
	            SP:"Taiw\u00e1n, China",IT:"Taiwan, Cina", DE:"Taiwan, China"},
	          MO:{CN:"\u4e2d\u56fd\u6fb3\u95e8\u7279\u522b\u884c\u653f\u533a", GB:"Macao (SAR of China)", FR:"R\u00e9gion Administrative Sp\u00e9ciale de Macao (Chine)", AR:"\u0645\u0646\u0637\u0642\u0629 \u0645\u0627\u0643\u0627\u0648 \u0627\u0644\u0625\u062f\u0627\u0631\u064a\u0629 \u0627\u0644\u062e\u0627\u0635\u0629 \u0644\u0644\u0635\u064a\u0646",
	            SP:"Regi\u00f3n Administrativa Especial de Macao (China)",IT:"Regione amministrativa speciale di Macao (Cina)", DE:"Sonderverwaltungsregion Macau der Volksrepublik China"},
	          HK:{CN:"\u4e2d\u56fd\u9999\u6e2f\u7279\u522b\u884c\u653f\u533a",  GB: "Hong Kong (SAR of China)", FR: "R\u00e9gion Administrative Sp\u00e9ciale de Hong Kong (Chine)", AR:"\u0645\u0646\u0637\u0642\u0629 \u0647\u0648\u0646\u062c \u0643\u0648\u0646\u062c \u0627\u0644\u0625\u062f\u0627\u0631\u064a\u0629 \u0627\u0644\u062e\u0627\u0635\u0629 \u0644\u0644\u0635\u064a\u0646"
	            , SP:"Regi\u00f3n Administrativa Especial de Hong Kong (China)",IT:"Regione amministrativa speciale di Hong Kong (Cina)", DE:"Sonderverwaltungsregion Hongkong der Volksrepublik China"}
	        }
	        var language = eBaDataLayer.language;
	        if (language == "") {
	          language = 'GB';
	        }
	        for (countryCode in translations) {
	  			if (translations.hasOwnProperty(countryCode)) {
	              $("select[id$=-PSPT_DocumentIssuingCountry] option[value='"+countryCode+"']").prop("text", translations[countryCode][language] );
	              $("select[id$=-REDN_DocumentApplicableCountry] option[value='"+countryCode+"']").prop("text", translations[countryCode][language] );
	              $("select[id$=-IDEN_Nationality] option[value='"+countryCode+"']").prop("text", translations[countryCode][language]);
	              $("select[id$=-AddressCountry] option[value='"+countryCode+"']").prop("text", translations[countryCode][language]); // udpate 20dec WO 17938648
	          	}
	        }
	        /* WO 18597090 - Remove fictious points - IR 18958293  */
	        $("select[id$=-PSPT_DocumentIssuingCountry] option[value='ZZ']").hide().prop('disabled',true);
	        $("select[id$=-REDN_DocumentApplicableCountry] option[value='ZZ']").hide().prop('disabled',true);
	        $("select[id$=-IDEN_Nationality] option[value='ZZ']").hide().prop('disabled',true);
	        $("select[id$=-AddressCountry] option[value='ZZ']").hide().prop('disabled',true);
	  	});

  	};

	/**
	 * Method that is executed when the Json eBaDataLayer object is ready
	 */
	this.onJsonReady = function() {
		implibdx.core.debug("Json is ready");

		var currentPage = implibdx.core.getPage().toUpperCase();

		self.addFBtrackingcodeAll(currentPage);

	    // Hide 7127 warning message on FlexPricer Avail pages
	    if (currentPage.match(/fpow|rfpow|fdffcpx|fdcs|rfdcs|fdcscpx|fdct/gi)) {
	    	implibdx.core.hideWarning7127();
	    }

		if (implibdx.core.getPage().match(/purc/gi)) {
			/* Baggage policy message for ff specific FF */
			this.termsAndCond();
			/* 12664613 FB code on payment page */
			self.addFBtrackingcode(currentPage);
			this.hideAmex24Hr();
		}

		if (implibdx.core.getPage().match(/rpurc|mpurc/gi)) {
			this.hideAmex24Hr();
		}


    	if (implibdx.core.getPage().match(/aas|dfsr|mdfsr/gi)) {
       		this.customizeDFSR();
    	}

		// Modify passengers page
		if (currentPage == "MALPI") {
			this.preventContactModification();
		}

	    if (implibdx.core.getPage().match(/apis/gi)) {
	      // WO 17938648
	      this.customizeCountryNames();
	    }

		// if we are on conf page and the payment is confirmed
	  	if (currentPage == "CONF" && eBaDataLayer.payment_method!='PLCC'){
			self.addFBtrackingcode(currentPage);
			/* 15935359 */
			self.addFBtrackingcodeConfBRU(currentPage);
		}

		if (currentPage == "CONF" || currentPage == "RTPL" || currentPage == "MCONF")  {
			this.visaMessage(visaDestinations);
      		this.ctaMessage(ctaDestinations);
      		this.HideAaasIfFlightUnconfirmed();
		}

		if (currentPage == "SDAI"){ /** avail Schedule  */
		} else if (currentPage == "FDCT"){ /** calendar */
		} else if (currentPage == "FPOW"){ /** flexpricer */
		} else if (implibdx.core.getPage().match(/purc/gi)) { /** Purchase */

			//Send email in CC for Call me - Fawry - Bee
			/*plnextv2.utils.ImplementationUtils.addActionFilters({
				action : "BookTripPlan",
				newAction: "Override",
				filterData: function(data) {
					// Add the override parameters
					if (data.PAYMENT_TYPE == "CON") {
						data.ACTION = "HOLD";
						data.SO_SITE_PNR_ADD_EMAIL2 = "Fawry.EgyptAir@fawry-eg.com"; // WO //"Fawry.egyptair@fawry.com";
						data.SO_SITE_SEND_PNR_ADD_EMAIL2 = "Y";
					}

					// Add the embedded transaction
					data.UI_EMBEDDED_TRANSACTION = "BookTripPlan";
					// Add the version of the library
					data.implibdx = JSON.stringify(implibdx.core.getDeployedLibs());
					return data;
	            }
	        });*/

			//Promotion code workaround applied in Current UI - replicated in DX
			if (eBaDataLayer.pe_variable_5 && eBaDataLayer.pe_variable_5 != "") {
				$('input[name=promotion_code]').val(eBaDataLayer.pe_variable_5);
				$('.promotion-code-button button').click();
			}
		}

		//Show Pay Now for NYCMS08AA and update action
		if (implibdx.core.getPage().match(/rtpl/gi) && implibdx.core.getInitialOfficeId() === "NYCMS08AA" )  {
			implibdx.core.updateDom(".pay-now-btn", function() {
					jQuery(".pay-now-btn").show();
			});
			plnextv2.utils.ImplementationUtils.addActionFilters({
				action : "OnHoldModifyDispatcher",
				newAction: "Override",
				filterData: function(data) {
					// Add the override parameters (IR 19909999)
					data.SO_SITE_OFFICE_ID = "LAXMS08AA";
					data.SO_SITE_ISSUANCE_OFFICE_ID = "LAXMS08AA";
					// Add the embedded transaction
					data.UI_EMBEDDED_TRANSACTION = "OnHoldModifyDispatcher";
					// Add the version of the library
					data.implibdx = JSON.stringify(implibdx.core.getDeployedLibs());
					return data;
	            }
	        });
		}
		//Remove Pay Now button for Fawry and Pay Later
		else  if (implibdx.core.getPage().match(/conf|rtpl/gi))  {
			implibdx.core.updateDom(".pay-now-btn", function() {
					jQuery(".pay-now-btn").remove();
			});
		}

		// RTPL and MCONF : Hide Price for Offline PNRs
		implibdx.fare.hidePriceForOfflinePnrs();

		//Retrieve page : ATC + AAAS customization
		if (implibdx.core.isRetrievePage()) {
      		this.blockNonMSTickets();
      		this.hideChangeFlightButtonIfPartial();

			var initialOfficeID = implibdx.core.getInitialOfficeId();
      		var officeIDtoUse = undefined;

			// WO restrict some PNR from retrieve
			if (this.restrictedOfficeIdForRetrieve.indexOf(initialOfficeID) > -1 || this.isGroupPNR()) {
				self.adjustRetrievePage(implibdx.core.i18n(self.RetrieveRestrictedPNRErrorText));
			}
			else {
				if (implibdx.core.getPage().match(/rtpl/gi)) {
					//Modify button is not available in CONF page, raising a warning is not required for CONF page
					//If Change Flights button does NOT exist, add the warning text
					self.updateDomIfNotFound(".modify-boundsATC-button", function() {
						var NotEligibleToChangeMessages = {
							"GB" : "This booking can't be changed online. If you would like to change your flight date and time, Please contact our call center or your nearest EGYPTAIR office.<br> N.B. (if your ticket is already checked, please cancel check-in first and retry to manage your booking through our website )",
							"AR" : "&#1610;&#1605;&#1603;&#1606;&#1578;&#1594;&#1610;&#1610;&#1585; &#1575;&#1604;&#1581;&#1580;&#1586;&#1593;&#1576;&#1585; &#1575;&#1604;&#1573;&#1606;&#1578;&#1585;&#1606;&#1578;.<span class=GramE>&#1573;&#1584;&#1575;</span> &#1603;&#1606;&#1578;&#1578;&#1585;&#1594;&#1576; &#1601;&#1610; &#1578;&#1594;&#1610;&#1610;&#1585;&#1605;&#1608;&#1593;&#1583; &#1585;&#1581;&#1604;&#1577;&#1575;&#1604;&#1591;&#1610;&#1585;&#1575;&#1606;&#1575;&#1604;&#1582;&#1575;&#1589;&#1577; &#1576;&#1603;,&#1610;&#1585;&#1580;&#1609; &#1575;&#1604;&#1575;&#1578;&#1589;&#1575;&#1604;&#1576;&#1600; 1717 &#1583;&#1575;&#1582;&#1604; &#1605;&#1589;&#1585;&#1571;&#1608; &#1576;&#1571;&#1602;&#1585;&#1576; &#1605;&#1603;&#1578;&#1576;&#1604;&#1605;&#1589;&#1585; &#1604;&#1604;&#1591;&#1610;&#1585;&#1575;&#1606;."
						};
						plnextv2.utils.ImplementationUtils.addError("",implibdx.core.i18n(NotEligibleToChangeMessages), "W");
					});
				}
				//Show Fawry information when payment method is CON (Call Me = Fawry)
				if (eBaDataLayer.payment_method != null && eBaDataLayer.payment_method.match(/con/gi)) {
						jQuery(document.body).append(
							"<style id = 'customStyleFawry'>.custom-fawry-rtpl,.custom-fawry-conf{display:block !important;font-weight:bold}</style>"
						);
				}
				var thepe_variable1 = null;
				if (eBaDataLayer != null && eBaDataLayer.pe_variable_1 != null) {
					thepe_variable1 = eBaDataLayer.pe_variable_1.toUpperCase();
				}

				// WO restrict ATC from some office IDs (based on initial office ID)
				if (this.restrictedOfficeIdForATC.indexOf(initialOfficeID) > -1) {
					implibdx.atc.hideChangeFlightButton();
				}
				// Set the correct settings to override the Office ID in ATC flow
				implibdx.core.initOfficeIdMapping(self.officeIdMap);
				var overrideAttributes = new Object();
				overrideAttributes.office = implibdx.core.BY_CURRENCY;

				//Get Office ID based on Currency
				var overrideParameters = implibdx.core.getOverrideParameterValues(overrideAttributes);
				var bookingCurrency = implibdx.core.getCurrency();
				var officeFromCurrency = self.officeIdMap[bookingCurrency];

        		// WO other GDS
				var overrideParametersModifyServicesBtn = [],  modifyServicesOverriden = false;

		        if (implibdx.core.isOnlinePnr() ) {
			      	// problem when the currency is not returned
			        officeIDtoUse = initialOfficeID; // by default
			        /* WO 17796045 new mapping */
				    if (initialOfficeID && initialOfficeID.substr(3,4) == "MS08") {
				        officeIDtoUse = initialOfficeID.substr(0,3) + "MS08AA";
			            // special case for LCAMS08MB
			            if (initialOfficeID =='LCAMS08MB') {
			            	officeIDtoUse = 'NICMS08AA' ;
				        }
			        }
		        } else {
		          if (officeFromCurrency && officeFromCurrency != null) {
		            officeIDtoUse = officeFromCurrency;
		          } else {
								// WO 17539959
								officeIDtoUse = this.fallbackOfficeId;
		            overrideParametersModifyServicesBtn["SO_SITE_CSSR_PRICINGCURRENCY"] = "USD";
		            overrideParametersModifyServicesBtn["SO_SITE_ISSUANCE_OFFICE_ID"] = this.fallbackOfficeId;
		            overrideParametersModifyServicesBtn["SO_SITE_OFFICE_ID"] = this.fallbackOfficeId;
		            overrideParametersModifyServicesBtn["SO_SITE_RUI_AAS_PAID_SVC_EN"] = "TRUE";
		            overrideParametersModifyServicesBtn["SO_SITE_RUI_AAS_SVC_SUMMARY"] = "TRUE";
		          }
		        }

        		// Special case for Lebanon market, for online and offline PNRs =
				if (bookingCurrency == 'USD') {
          			var eRetailCityPattern = initialOfficeID.substr(0, 3);
					//Check if the initial OID was in Lebanon
          			var LBCityList = {BEY:0, KYE:0, QJN:0, QJQ:0, QSQ:0, QZQ:0}; // IR 16853265
					if (eRetailCityPattern && LBCityList.hasOwnProperty(eRetailCityPattern)){
						overrideParameters["SO_SITE_OFFICE_ID"] = 'BEYMS08AA';
						officeIDtoUse = overrideParameters["SO_SITE_OFFICE_ID"];
					}
					else {
			            /* WO 17796045 new mapping - even for online */
			            officeIDtoUse = "LAXMS08AA";
		          	}
				} else if (bookingCurrency == 'EUR') {
		          /* WO 17796045 new mapping */
		            officeIDtoUse = "PARMS08AA";
        		}

        		//WO 20667298 - OID mapping for us market only NYCMS08AA
        		if (initialOfficeID =='NYCMS08AA') {
			            	officeIDtoUse = 'NYCMS08AA' ;
				        }

				//EXT PSP
				var varEXT_PSPURL = null;
				if (eBaDataLayer != null) {
					varEXT_PSPURL = eBaDataLayer.pe_variable_2;
				}
				if (varEXT_PSPURL != null) {
					var prodinfoPattern = varEXT_PSPURL.substr(7, 11);
					if (prodinfoPattern != "productinfo") {
						if (varEXT_PSPURL.slice(-1) != "=") { /* if last char is not '=' we need to add it */
							varEXT_PSPURL = varEXT_PSPURL + "=";
						}
						varEXT_PSPURL = varEXT_PSPURL + officeIDtoUse;///overrideParameters["SO_SITE_OFFICE_ID"];
					}
				}

				// If we are not specifically in the ATC FLOW and the Change Flights button exists, remove the Change Flights button
				if (thepe_variable1 != "ATC FLOW") {
					implibdx.atc.hideChangeFlightButton();
				}
				else if (thepe_variable1 == "ATC FLOW") {
					// If a corresponding OID was allocated and the Change Flights button exists, add the OID information to the call
					//IR 08017935 [Serious]: MASTER Incident on MUCRTP53 - int Po13 MUCFWP210A output drops - Logic replicated to DX
					if (typeof(officeIDtoUse) != 'undefined') {
	  					//EXT PSP
	  					if (varEXT_PSPURL != null) {
	  						overrideParameters["SO_SITE_EXT_PSPURL"] = varEXT_PSPURL;
	  					}
				            overrideParameters["SO_SITE_OFFICE_ID"] = officeIDtoUse;
				        	overrideParameters["SO_SITE_ISSUANCE_OFFICE_ID"] = officeIDtoUse; // IR 16636207
	  					// Override the change flight button
	  					implibdx.atc.overrideChangeFlightButtonWithValues(overrideParameters);
					}
					// Before WO 17539959 If NO corresponding OID (unsupported currency) was allocated and the Change Flights button exists, remove the Change Flights button
					// // WO 17539959 : fallback to USD and LAX office ID
					if (typeof(officeIDtoUse) == 'undefined') {
						//implibdx.atc.hideChangeFlightButton();
						// WO 17539959
						officeIDtoUse = this.fallbackOfficeId;
						overrideParametersModifyServicesBtn["SO_SITE_CSSR_PRICINGCURRENCY"] = "USD";
			            overrideParametersModifyServicesBtn["SO_SITE_ISSUANCE_OFFICE_ID"] = this.fallbackOfficeId;
			            overrideParametersModifyServicesBtn["SO_SITE_AAS_PAID_SVC_EN"] = "TRUE";
			            overrideParametersModifyServicesBtn["SO_SITE_SVC_SUMMARY"] = "TRUE";
					}
				}


				/** AAAS - Begin **/
				var modifyPassengerLink;
				modifyPassengerLink = "javascript:void(0)";

				var servicesMissingEmailMessages = { "GB" : "Services can be modified online, but a valid email address is required. Please update your traveller profile <a href = '"+modifyPassengerLink+"' class = 'custom-AAAS-Warning-No-Email'><b>here</b></a>.",
				"FR" : "Les services peuvent &ecirc;tre modifi&eacute;s en ligne, mais une adresse email valide est n&eacute;cessaire. S'il vous pla&icirc;t, mettez &agrave; jour votre profil <a href = '"+modifyPassengerLink+"' class = 'custom-AAAS-Warning-No-Email'><b>ici</b></a>.",
				"DE": "Eine Online-&Auml;nderung des Service ist m&ouml;glich;  wir ben&ouml;tigen jedoch eine g&uuml;ltige E-Mail-Adresse. Bitte aktualisieren Sie Ihr Reiseprofil <a href = '"+modifyPassengerLink+"' class = 'custom-AAAS-Warning-No-Email'><b>hier</b></a>.",
				"IT": "Il servizio pu&ograve; essere modificato online; ma &egrave; richiesto un valido indirizzo di posta elettronica;  gentilmente aggiornare qui il vostro profilo <a href = '"+modifyPassengerLink+"' class = 'custom-AAAS-Warning-No-Email'><b>di viaggio</b></a>.",
				"ES": "El servicio puede ser modificado en l&iacute;nea, pero se necesita una direcci&oacute;n v&aacute;lida de correo electr&oacute;nico, por favor actualice su perfil de viajero <a href = '"+modifyPassengerLink+"' class = 'custom-AAAS-Warning-No-Email'><b>aqu&iacute;</b></a>.",
				"AR": "&#1578;&#1593;&#1583;&#1610;&#1604; &#1575;&#1604;&#1582;&#1583;&#1605;&#1577; &#1593;&#1576;&#1585; &#1575;&#1604;&#1573;&#1606;&#1578;&#1585;&#1606;&#1578;&#1548; &#1608;&#1604;&#1603;&#1606; &#1610;&#1588;&#1578;&#1585;&#1591; &#1578;&#1608;&#1601;&#1585; &#1593;&#1606;&#1608;&#1575;&#1606; &#1576;&#1585;&#1610;&#1583; &#1573;&#1604;&#1603;&#1578;&#1585;&#1608;&#1606;&#1610; &#1589;&#1575;&#1604;&#1581;. &#1610;&#1615;&#1585;&#1580;&#1609; &#1578;&#1581;&#1583;&#1610;&#1579; &#1605;&#1604;&#1601; &#1575;&#1604;&#1587;&#1601;&#1585; &#1575;&#1604;&#1582;&#1575;&#1589; &#1576;&#1603; <a href = '"+modifyPassengerLink+"' class = 'custom-AAAS-Warning-No-Email'><b>&#1607;&#1606;&#1575;</b></a>.",
				"CN": "&#26381;&#21153;&#21487;&#20197;&#22312;&#32593;&#19978;&#20462;&#25913; &#35831;&#25552;&#20379;&#26377;&#25928;&#30340;&#30005;&#23376;&#37038;&#20214;&#22320;&#22336; &#35831;&#28857;&#20987;&#36825;&#37324;&#26356;&#26032;&#24744;&#30340;&#26053;&#34892;&#20449;<a href = '"+modifyPassengerLink+"' class = 'custom-AAAS-Warning-No-Email'><b>&#24687;</b></a>",
				};
				//In CONF page, in eBaDataLayer, primeEmail is not available. The following if statement is required to avoid
				//to have a warning in CONF page due to the fact that email is not available in eBaDataLayer
				if (implibdx.core.getPage().match(/rtpl/gi)) {
					implibdx.aaas.hideModifyButtonIfNoMail(servicesMissingEmailMessages);

					implibdx.core.updateDom(".modify-passengers-button", function() {
							$('.custom-AAAS-Warning-No-Email').attr("href",  "javascript:$('.modify-passengers-button').click()");
					});
				}

				if (varEXT_PSPURL != null) {
						overrideParametersModifyServicesBtn["SO_SITE_EXT_PSPURL"] = varEXT_PSPURL;
						modifyServicesOverriden = true;
				}
				/** force the USD currency in specific case of OFFICE BAHMS08AA */
				//if (initialOfficeID == "BAHMS08AA") {
					//overrideParametersModifyServicesBtn["SO_SITE_CSSR_PRICINGCURRENCY"] = "USD";
					//modifyServicesOverriden = true;
				//}

				if (typeof(officeIDtoUse) != 'undefined')  {
					// IR 16473295 [Medium]: WWW-AeRE: Ancillary seat failure
					//overrideParametersModifyServicesBtn["SO_SITE_USE_PAYMENT_ACTION"] = "FALSE";
					overrideParametersModifyServicesBtn["SO_SITE_OFFICE_ID"] = officeIDtoUse;
        			overrideParametersModifyServicesBtn["SO_SITE_ISSUANCE_OFFICE_ID"] = officeIDtoUse; //IR 16636207 and 18494324
	        		modifyServicesOverriden = true;
				}

				/*if (!implibdx.core.isOnlinePnr()){ /** For Offline PNR - not Online Or Mobile PNR
					implibdx.aaas.hideModifyButton();WO 12765162: Disable prebooking for offline PNRS + Allow services for offline
				}*/

				if (modifyServicesOverriden) {
					implibdx.aaas.overrideModifyButtonWithValues(overrideParametersModifyServicesBtn);
				}
				/** AAAS - End **/
			}
		}

		// To be removed after PCP - 189 : ALLOW_REFUND_STOP in ATC flow - Begin
		if (implibdx.core.getPage().match(/rfare/gi)) {
			self.performOnNetting();
		}
	}
};

// CREATE THE OBJECT.
// As parameter, you must put all the generic libraries (except the Core one) that must be loaded.
var implibdx = implibdx || {};
implibdx.custom = new IMPLibDxCustom(["./css/IMPLibDxCore.js", "./css/IMPLibDxFare.js", "./css/IMPLibDxAtc.js","./css/IMPLibDxAaas.js","./css/IMPLibDxGoogleAnalytics.js", "./css/IMPLibDxTemp.js"]);