/**
 * @class
 * Library for the fare management
 *
 * @author: 1A xHTML Implementation team
 *
 * @version
 *
 *
 */
function IMPLibDxFare() {
	var self = this;

	/**
	 * Version of the library: 1.0
	 */
	this.VERSION = "1.0";

	/**
	 *
	 * Build the content of the fare notes section based on the:
	 * - condition from the SL_FARE_FAMILY_CONDITIONS global list
	 * - the selected fare families from the eBaDataLayer object
	 *
	 * @private
	 */
	this.getFareNotesFromJson = function() {

		var content = "";
		var json = implibdx.core.getJson();

		if (json != null && json.bound) {

			var SL_FARE_FAMILY_CONDITIONS = plnextv2.utils.GlobalLists.getList("SL_FARE_FAMILY_CONDITIONS");

			var map = [];
			for (var i = 0; i < SL_FARE_FAMILY_CONDITIONS.length; i++) {
				map[SL_FARE_FAMILY_CONDITIONS[i][0]] = SL_FARE_FAMILY_CONDITIONS[i][2];
			}


			var bounds = json.bound;
			var alreadyMarked = [];
			for (var i = 0; i < bounds.length; i++) {
				var code = bounds[i].selected_ff_code;
				var name = bounds[i].selected_ff_name;
				var description = map[code] || "";

				if (description.length > 0) {
					if (jQuery.inArray(code, alreadyMarked) < 0) {
						alreadyMarked.push(code);

						if (alreadyMarked.length > 1) {
							content += "<div class = 'clearfix'></div>";
						}

						content += "<div class = 'sb-fare-notes-"+code+"'>";
						content += "<div class = 'sb-fare-notes-title'>" + name + "</div>";
						content += "<div class = 'sb-fare-notes-description'>" + description + "</div>";
						content += "</div>";

					}
				}

			}

		}

		return content;

	};


	/**
	 * Create a fare notes section in the page.
	 * @param {array}tx_fare_notes_title the translations of title used for the
	 * fare notes section.
	 * @param baseSection the selector of the section that will be used as
	 * reference. The fare notes section will be created uppon this section
	 *
	 * @example
	 * 	var tx_fare_notes_title = {
	 * 		'GB': 'Fare notes',
	 *		'FR' : 'Notes tarifaires'
	 * 	};
	 *
	 *	if (implibdx.core.getPage() == "purc") {
			implibdx.fare.createFareNoteSection(tx_fare_notes_title, ".purchase-conditions");
		}
		else if (implibdx.core.getPage() == "conf") {
			implibdx.fare.createFareNoteSection(tx_fare_notes_title, ".flight-notes-section");
		}
	 *
	 *
	 */
	this.createFareNoteSection = function(tx_fare_notes_title, baseSection) {
		implibdx.core.debug("Create fare note section before " + baseSection);
		if (jQuery(baseSection).length == 1) {
			var content = self.getFareNotesFromJson();
			if (content.length > 0) {
				var div = "<div id = 'custom-fare-notes'>";
				div += "<section class = 'panel area row'>";
				div += '<span class="icon-info-sign main-icon col-xs-1"></span>';
				div += '<div class="inline-block col-xs-22"><h4>' + implibdx.core.i18n(tx_fare_notes_title) + '</h4>';
				div += '<div class = "custom-fare-notes-content">';
				div += content;
				div += '</div>';
				div += '</div>';
				div += "</section>";
				div += "</div>";

				jQuery(div).insertBefore(jQuery(baseSection));
			}
		}
		else {
			implibdx.core.debug("Section not available yet available");
			setTimeout(function() {
				self.createFareNoteSection(tx_fare_notes_title, baseSection);
			}, 500);
		}
	};
	
	/**
	 * Hide price section for Offline PNRs (*****08[A-Z](2)) in RTPL and MCONF.
	 *
	 */
	this.hidePriceForOfflinePnrs = function() {
		if (implibdx.core.getPage().match(/rtpl|mconf/gi)) {
			if(! implibdx.core.isOnlinePnr()) {
				self.hidePricesInRetrievePages();
			}
		}
	};
		/**
	 * Hide price sections in RTPL and MCONF.
	 *
	 */
	this.hidePricesInRetrievePages = function() {
		if (implibdx.core.getPage().match(/rtpl|mconf/gi)) {
				//Reservation table on the top - Total amount
				implibdx.core.updateDom(".reservation-amount", function() {
					jQuery(".reservation-amount").hide();
				});
				//Additional Information on the top of the page - Payment paragraph - amount part
				implibdx.core.updateDom(".payment-amount-price", function() {
					jQuery(".payment-amount-text").hide();
					jQuery(".payment-amount-price").hide();
				});				
				//Horizontal Booking Summary
				implibdx.core.updateDom(".farereview-price", function() {
					jQuery(".farereview-price").hide();
				});
				//Vertical Booking Summary
				implibdx.core.updateDom(".farereview-sections", function() {
					jQuery(".farereview-sections.price").hide();
				});
				//Send by mail
				implibdx.core.updateDom(".send-email", function() {
					jQuery(".send-email").hide();
				});
		}
	};

};




// Instantiate the object to access the class properties
var implibdx = implibdx || {};
implibdx.fare = new IMPLibDxFare();