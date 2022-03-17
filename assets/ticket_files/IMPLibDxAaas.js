/**
 * @class
 * Library for the Aaas management
 *
 * @author: 1A xHTML Implementation team
 *
 * @version
 *  <li>2015-10-09: RF: Creation of the file from the old UI version (1.0)</li>
 *
 */
function IMPLibDxAaas() {
	var self = this;

	/**
	 * Version of the library: 1.0
	 */
	this.VERSION = "1.0";

	/**
	 * Override the Modify button in order to apply some extra override, in particular the office ID override
	 * @param {object}overrideAttributes describes the underlying logic that is applied to do the overrides. Be careful that
	 * the object does not expects to have the actual value of the office or the point of sale to use. It just requires
	 * some tags to indicate if you want to override based on Currency, Point of departure, ...<br />
	 * + If you want to override the office ID, you need to define an `office` attribute to this object.<br />
	 *	Possible values: `implibdx.core.BY_DEPARTURE_COUNTRY`, `implibdx.core.BY_CURRENCY`, `implibdx.core.BY_INITIAL_OFFICE_CITY`,
	 * `implibdx.core.BY_INITIAL_OFFICE_ID`<br />
	 *  If you just need to override the office of the online PNRs, you can use one or the other value<br />
	 *  For offline PNR, if there is no office mapping the inputs, no office override will be performed.
	 *  + If you want to override additional parameters, you can define a `other` attribute to the object with an associative
	 * array key => value with key = the SO_SITE_ parameter, and value, the actual value to override
	 * @example
	 * 		var overrideAttributes = new Object();
	 * 		overrideAttributes.office = implibdx.core.BY_DEPARTURE_COUNTRY;
	 *		overrideAttributes.other = {
 *			"SO_SITE_OTHER_ATTR" : "OTHER_VALUE"
 *		};
	 *		implibdx.aaas.overrideModifyButton(overrideAttributes);
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
	 * 		var overrideAttributes = new Object();
	 *		overrideAttributes.office = IMPLibCore.BY_DEPARTURE_COUNTRY;
	 *		overrideAttributes.other = {
 *			"SO_SITE_OTHER_ATTR" : "OTHER_VALUE"
 *		};
	 *		implibdx.aaas.overrideModifyButton(overrideAttributes);
	 */
	this.overrideModifyButton = function(overrideAttributes) {

		if (implibdx.core.isRetrievePage()) {
			var overrideParameters = implibdx.core.getOverrideParameterValues(overrideAttributes);
			self.overrideModifyButtonWithValues(overrideParameters);
		}

	};



	/**
	 * Override the Modify buttons with the parameters provided in input
	 * @param {object}overrideParameters an associative array with key = parameter name, value = parameter value	 *
	 *
	 * @example
	 * 		var overrideParameters = {
	 *			"SO_SITE_OFFICE_ID" : "PARYY08AA",
	 *			"SO_SITE_POINT_OF_SALE" : "PAR"
	 *		};
	 *		implibdx.aaas.overrideModifyButtonWithValues(overrideParameters);
	 *
	 * @example
	 * 		var overrideParameters = [];
	 *		overrideParameters["SO_SITE_OFFICE_ID"] = "PARYY08AA";
	 *		overrideParameters["SO_SITE_POINT_OF_SALE"] = "PAR";
	 *		implibdx.aaas.overrideModifyButtonWithValues(overrideParameters);
	 */
	this.overrideModifyButtonWithValues = function(overrideParameters) {

		if (implibdx.core.isRetrievePage()) {

			plnextv2.utils.ImplementationUtils.addActionFilters({
				action : "RetrievePNRServices",
				newAction: "Override",
				filterData: function(data) {

					// Add the override parameters
					for (key in overrideParameters) {
						if (overrideParameters.hasOwnProperty(key)) {
							data[key] = overrideParameters[key];
						}
					}

					// Add the embedded transaction
					data.UI_EMBEDDED_TRANSACTION = "RetrievePNRServices";

					// Add the version of the library
					data.implibdx = JSON.stringify(implibdx.core.getDeployedLibs());
					return data;
				}
			});
		}

	};




	/**
	 * Check that the mail is set for the user. This email is mandatory of the external payment flow.
	 * If not displays a warning message
	 * @param {array}messages the messages by language to display.
	 * @example
	 * 	var messages = {
		"GB" : "Services can be modified online, but a valid email address is required.<br />Please update your traveller profile <a href = '##link##'><b>here</b></a>.",
		"FR" : "Les services peuvent être modifiés en ligne, mais une adresse email valide est nécessaire.<br />S'il vous plaît, mettez à jour votre profil <a href = '##link##'><b>ici</b></a>.",
	};

	 implibdx.aaas.hideModifyButtonIfNoMail(messages);
	 */
	this.hideModifyButtonIfNoMail = function(messages) {
		if (implibdx.core.isRetrievePage()) {
			var email = implibdx.core.getEmail();
			if (email == "") {
				// We don't have any email. So we need need to remove the modify button + display a warning message
				implibdx.core.updateDom(".modify-services-button", function () {

					// We found the button. So this means that it is eligible to servicing
					self.hideModifyButton();
					plnextv2.utils.ImplementationUtils.addError("", implibdx.core.i18n(messages), "W");
				});


			}
		}

	};



	/**
	 * Hide the modify service buttons (additional services). It technically add a CSS style that hide the buttons.
	 * @example
	 * 	implibdx.aaas.hideModifyButton();
	 */
	this.hideModifyButton = function() {
		if (implibdx.core.isRetrievePage()) {
			jQuery(document.body).append(
				"<style id = 'customStyleAaasHide'>.modify-services-button,.servicesbreakdown-footer .btn{display:none}</style>"
			);
		}
	};



	/**
	 * Show the modify service buttons (additional services). It technically remove the CSS style that was added by the hideModifyButton
	 * @example
	 * 	implibdx.aaas.showModifyButton();
	 */
	this.showModifyButton = function() {
		jQuery("#customStyleAaasHide").remove();
	};

};




// Instantiate the object to access the class properties
var implibdx = implibdx || {};
implibdx.aaas = new IMPLibDxAaas();