/**
 * @class
 * Library for the ATC management
 *
 * @author: 1A xHTML Implementation team
 *
 * @version
 *  <li>2015-07-02: RF: Creation of the file from the old UI version (1.0)</li>
 *	<li>2015-09-28: RF: Add method overrideChangeFlightButtonWithValues (1.1)</li>
 *	<li>2015-10-08: RF: Add method hideChangeFlightButtonIfNoMail (1.2)</li>
 *	<li>2015-10-09: RF: Add additional check in the hide* methods to verify that we are on the retrieve pages (1.3)</li>
 *
 */
function IMPLibDxAtc() {
	var self = this;

	/**
	 * Version of the library: 1.3<br />
	 * Require Core >= 1.6
	 */
	this.VERSION = "1.3";



	/**
	 * Override the Change flight buttons depending on the methods of override provided as input.
	 * Please note that concerning the office Id override, if the PNR was initially booked in an online office Id,
	 * the office Id of the prime booking will be reused.
	 * @param {object}overrideAttributes describes the underlying logic that is applied to do the overrides. Be careful that
	 * the object does not expects to have the actual value of the office or the point of sale to use. It just requires
	 * some tags to indicate if you want to override based on Currency, Point of departure, ...<br />
	 * + If you want to override the office ID, you need to define an `office` attribute to this object.<br />
	 *	Possible values: `implibdx.core.BY_DEPARTURE_COUNTRY`, `implibdx.core.BY_CURRENCY`, `implibdx.core.BY_INITIAL_OFFICE_CITY`,
	 *  `implibdx.core.BY_INITIAL_OFFICE_ID`<br />
	 *  If you just need to apply ATC online PNR and reuse the initial booking office ID, you can use one or the other
	 *  value<br />
	 *  For offline PNR, if there is no office mapping the inputs, no office override will be performed.
	 * + If you want to override the point of sale / ticketing, you need to define a `pos` attribute to this object.<br />
	 * Possible values: `implibdx.core.BY_DEPARTURE_COUNTRY`, `implibdx.core.BY_CURRENCY`, `implibdx.core.BY_INITIAL_OFFICE_CITY`,
	 * 	`implibdx.core.BY_INITIAL_OFFICE_ID`,<br />
	 * If there is no office mapping the inputs, no pos/pot override will be performed.
	 * + If you want to override additional parameters, you can define a `other` attribute to the object with an associative
	 * array key => value with key = the SO_SITE_ parameter, and value, the actual value to override
	 *
	 *
	 * @example
	 * 		var overrideAttributes = new Object();
	 *		overrideAttributes.office = implibdx.core.BY_DEPARTURE_COUNTRY;
	 *		overrideAttributes.pos = implibdx.core.BY_CURRENCY;
	 *		overrideAttributes.other = {
	 *			"SO_SITE_OTHER_ATTR" : "OTHER_VALUE"
	 *		};
	 *		implibdx.atc.overrideChangeFlightButton(overrideAttributes);
	 *
	 * @example
	 * 		// A more complete example
	 * 		var officeIdMap = {
	 *			"DZ": "ALG6X08IB",
	 *			"AR": "BUE6X08IB",
	 *			"AU": "SYD6X08IB"
	 *		};
	 *		implibdx.core.initOfficeIdMapping(officeIdMap);
	 *
	 * 		var posMap = {
	 * 			"USD": "NYC",
	 *			"EUR": "PAR",
	 *			"GBP": "LON"
	 *		};
	 *		implibdx.core.initPosMapping(posMap);
	 *
	 * 		var overrideAttributes = new Object();
	 *		overrideAttributes.office = IMPLibCore.BY_DEPARTURE_COUNTRY;
	 *		overrideAttributes.pos = IMPLibCore.BY_CURRENCY;
	 *		overrideAttributes.other = {
	 *			"SO_SITE_OTHER_ATTR" : "OTHER_VALUE"
	 *		};
	 *		implibdx.atc.overrideChangeFlightButton(overrideAttributes);
	 */
	this.overrideChangeFlightButton = function(overrideAttributes) {

		if (implibdx.core.isRetrievePage()) {
			var overrideParameters = implibdx.core.getOverrideParameterValues(overrideAttributes);
			self.overrideChangeFlightButtonWithValues(overrideParameters);
		}
	};


	/**
	 * Override the Change flight button with the parameters provided in input
	 * @param {object}overrideParameters an associative array with key = parameter name, value = parameter value	 *
	 *
	 * @example
	 * 		var overrideParameters = {
	 *			"SO_SITE_OFFICE_ID" : "PARYY08AA",
	 *			"SO_SITE_POINT_OF_SALE" : "PAR"
	 *		};
	 *		implibdx.atc.overrideChangeFlightButtonWithValues(overrideParameters);
	 *
	 * @example
	 * 		var overrideParameters = [];
	 *		overrideParameters["SO_SITE_OFFICE_ID"] = "PARYY08AA";
	 *		overrideParameters["SO_SITE_POINT_OF_SALE"] = "PAR";
	 *		implibdx.atc.overrideChangeFlightButtonWithValues(overrideParameters);
	 */
	this.overrideChangeFlightButtonWithValues = function(overrideParameters) {

		if (implibdx.core.isRetrievePage()) {

			plnextv2.utils.ImplementationUtils.addActionFilters({
				action : "RebookingAirSearchDispatcher",
				newAction: "Override",
				filterData: function(data) {

					// Add the override parameters
					for (key in overrideParameters) {
						if (overrideParameters.hasOwnProperty(key)) {
							data[key] = overrideParameters[key];
						}
					}

					// Add the embedded transaction
					data.UI_EMBEDDED_TRANSACTION = "RebookingAirSearchDispatcher";

					// Add the version of the library
					data.implibdx = JSON.stringify(implibdx.core.getDeployedLibs());
					return data;
	            }
	        });
		}
	};




	/**
	 Hide the ATC change flight buttons in the fare review and the right side menu
	 Technically, it add a custom CSS style that is hiding the buttons

	   @example
	   		implibdx.atc.hideChangeFlightButton();

	 */
	this.hideChangeFlightButton = function() {
		if (implibdx.core.isRetrievePage()) {
			jQuery(document.body).append(
				"<style id = 'customStyleAtcHide'>.modify-boundsATC-button,.farereview-vertical .footer:nth-child(2),.farereview-container-dialog-horizontal .bounds-panel-footer{display:none}</style>"
			);
		}
	};




	/**
	   Show the change flight buttons (do the opposite of hideChangeFlightButton)<br />
	   Technically, it removes the custom styles that was added by the hideChangeFlightButton method
	   
	   @example
	   		implibdx.atc.showChangeFlightButton();

	 */

	this.showChangeFlightButton = function() {
		jQuery("#customStyleAtcHide").remove();	
	};




	/**
	 * Check that the mail is set for the user. This email is mandatory of the external payment flow.
	 * If not displays a warning message
	 * @param {array}messages the messages by language to display.
	 * @example
	 var messages = {
	 	"GB" : "The flights can be changed online, but a valid email address is required.",
	 	"AR" : "&#1610;&#1605;&#1603;&#1606; &#1578;&#1594;&#1610;&#1610;&#1585; &#1575;&#1604;&#1585;&#1581;&#1604;&#1575;&#1578; &#1608;&#1604;&#1603;&#1606; &#1610;&#1580;&#1576; &#1578;&#1608;&#1601;&#1610;&#1585; &#1593;&#1606;&#1608;&#1575;&#1606; &#1576;&#1585;&#1610;&#1583; &#1573;&#1604;&#1603;&#1578;&#1585;&#1608;&#1606;&#1610; &#1589;&#1581;&#1610;&#1581;."
	 };

	 implibdx.atc.hideChangeFlightButtonIfNoMail(messages);
	 */
	this.hideChangeFlightButtonIfNoMail = function(messages) {
		if (implibdx.core.isRetrievePage()) {
			var email = implibdx.core.getEmail();

			if (email == "") {
				// We don't have any email. So we need need to remove the ATC button + display a warning message
				implibdx.core.updateDom(".modify-boundsATC-button", function() {

					// We found the button. So this means that it is eligible to ATC
					self.hideChangeFlightButton();

					plnextv2.utils.ImplementationUtils.addError("",implibdx.core.i18n(messages), "W");
				});


			}
		}


	};


};




// Instantiate the object to access the class properties
var implibdx = implibdx || {};
implibdx.atc = new IMPLibDxAtc();