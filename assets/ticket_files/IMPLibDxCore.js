/**
 * @class
 * Implementation team core library.
 * The core library is made to be used by all the sites and provides very
 * generic methods. This library is usable with the e-Retail DX product.
 *
 * @author: 1A xHTML Implementation team
 *
 * @version
 * 	<li>2014-12-29: RF: portage of the IMPLibCore file for the e-Retail DX (1.0)</li>
 * 	<li>2014-12-29: RF: add the session Id (1.1)</li>
 * 	<li>2014-01-19: RF: add analytics (1.2)</li>
 * 	<li>2014-02-03: RF: Add method to hide the shift calendar warning (1.3)</li>
 * 	<li>2014-02-20: RF: Remove the internal tracking (1.4)</li>
 *	<li>2015-08-27: RF: IR10322945 (1.4.1)</li>
 *	<li>2015-09-01: RF: Helper for DOm modification (1.5)</li>
 *	<li>2015-09-01: RF: ATC support (1.6)</li>
 *	<li>2015-09-01: RF: Retrieve the page code from the application data if not present in the json (1.7)</li>
 *	<li>2015-09-15: RF: Get the external id (1.8)</li>
 *  <li>2015-01-19: RF: Add method to get plnext business data (1.9)</li>
 *
 * @example
 *		// Example of usage of the library
 *		implibdx.core.debug("this is an example of usage");
 */
function IMPLibDxCore() {
	var self = this;


	/***********************************************************************
	 *
	 * 		CONSTANTS
	 *
	 **********************************************************************/

	/**
	 * Version of the library: 1.9
	 */
	this.VERSION = "1.9";

	/**
	 * The name of the event that is raised when the eBaDataLayer object is ready
	 */
	this.JSON_READY_EVENT = "plnext:customData:ready";

	/**
	 * To be used in order to indicate that the override has to be done by Departure country code
	 */
	this.BY_DEPARTURE_COUNTRY = "BY_DEPARTURE_COUNTRY";
	/**
	 * To be used in order to indicate that the override has to be done by currency
	 */
	this.BY_CURRENCY = "BY_CURRENCY";
	/**
	 * To be used in order to indicate that the override has to be done by office city (the 3 first letter of the initial
	 * office ID)
	 */
	this.BY_INITIAL_OFFICE_CITY = "BY_INITIAL_OFFICE_CITY";
	/**
	 * To be used in order to indicate that the override has to be done by
	 * office (the complete initial office ID)
	 */
	this.BY_INITIAL_OFFICE_ID = "BY_INITIAL_OFFICE_ID";



	/***********************************************************************
	 *
	 * 		VARIABLES
	 *
	 **********************************************************************/


	/**
	 * The array that maps one value (departure country code, currency, ...) to an office Id
	 * @private
	 */
	this.officeIdMapping = new Array();

	/**
	 * The array that maps one value (departure country code, currency, ...) to an point of sale
	 * @private
	 */
	this.posMapping = new Array();

	/**
	 *	Cache containing the version of the deployed libraries
	 */
	this.deployedLibs = null;



	/***********************************************************************
	 *
	 * 		GENERIC UTILS
	 *
	 **********************************************************************/


	/**
	 * Log a message in the console, if the console is present and activated
	 * @param {string}mess the message to log as debug mode
	 */
	this.debug = function (mess) {
		if (window.console && window.console.log) {
			window.console.log(mess);
		}
	};

	/**
	 * Log a message in the console with a warning flag, if the console is present
	 * and activated, as a WARN message
	 * @param {string}mess the message to log in the console as warning
	 */
	this.warn = function (mess) {
		if (window.console && window.console.warn) {
			window.console.warn(mess);
		}
	};


	/**
	 *
	 * @param array_str_per_lang an array with the strings hashed by languages.
	 * The language code must be provoded in uppercase.
	 * @returns the value of the string in the language used by the site or in
	 * english if the translation was not supported
	 *
	 *
	 * @example
	 * var tx = {
	 * 	"GB" : "my string in english",
	 * 	"FR" : "my string in french"
	 * };
	 *
	 * var myStringTranslated = implibdx.core.i18n(tx);
	 *
	 */
	this.i18n = function(array_str_per_lang) {
		var language = self.getLanguage();
		if (language == "") {
			language = "GB";
		}

		if (language in array_str_per_lang) {
			return array_str_per_lang[language];
		}

		return array_str_per_lang["GB"];
	};




	/**
	 *
	 * @param element the query selector to the element we want to modify.
	 * @param callback the callback method that will be executed as soon as the element is loaded on the page
	 * @param timeout (optional) the time in millisecond to wait for the load of the element. If not loaded yet, the method will wait for the given time before to try again. Default = 1000ms
	 * @param max_trials (optional) the number of time the method will look for the element. Default = 5
	 * @param trials (private) the current iteration number
	 * 
	 *
	 * @example
	 * 	implibdx.core.updateDom(".farereview .pnr-btn-section .icon-plane", function() {
			jQuery(".farereview .pnr-btn-section .icon-plane").parent().hide();
		});

	 * @example
		// tries 2 times and wait 5s between each trial.
	  	implibdx.core.updateDom(".farereview .pnr-btn-section .icon-plane", function() {
			jQuery(".farereview .pnr-btn-section .icon-plane").parent().hide();
		}, 5000, 2);

	 *
	 */
	this.updateDom = function(element, callback, timeout, max_trials, trials) {
		var m_timeout = timeout || 1000;
		var m_max_trials = max_trials || 5;
		var m_trials = trials || 0;


		if (jQuery(element).length > 0) {
			if (typeof(callback) == "function") {
				callback();
			}
		}
		else {
			if (m_trials < m_max_trials) {
				self.debug("Wait for loading of " + element);
				setTimeout(function() {
					self.updateDom(element, callback, m_timeout, m_max_trials, m_trials + 1);
				}, m_timeout);
			}
			else {
				self.debug("Maximum iteration reached but element " + element + " not loaded on the page");
			}
		}


	}


	/**
	 * @returns {boolean} true if the custom javascript should be executed.
	 * @example
	 * 	var isCustomJsEnabled = implibdx.core.isCustomJavascriptEnabled();
	 */
	this.isCustomJavascriptEnabled = function() {

		var enableCustomJs = true;
		try {

			if (window.location.href.match(/(\?|&)enableCustomJs=true(&|$)/i)) {
				enableCustomJs = true;
				sessionStorage.setItem("implibdx.core.enableCustomJs", true);
			}
			else if (window.location.href.match(/(\?|&)enableCustomJs=false(&|$)/i)) {
				enableCustomJs = false;
				sessionStorage.setItem("implibdx.core.enableCustomJs", false);
			}
			else if (sessionStorage.getItem("implibdx.core.enableCustomJs")) {
				enableCustomJs = sessionStorage.getItem("implibdx.core.enableCustomJs");
			}

		}
		catch (e) {
			self.debug("session storage not available");
		}
		

		return enableCustomJs;
	};




	/**
	 * Get the version of all the deployed libraries
	 */
	this.getDeployedLibs = function() {
		if (self.deployedLibs == null) {
			self.deployedLibs = {};
			for (key in implibdx) {
				if (implibdx.hasOwnProperty(key)) {
					if (implibdx[key].VERSION) {
						self.deployedLibs[key] = implibdx[key].VERSION;
					}
				}
			}
		}

		return self.deployedLibs;
	};




	/***********************************************************************
	 *
	 * 		COMMON FUNCTIONAL METHODS TO BE REUSED BY EVERYONE
	 *
	 **********************************************************************/


	/**
	 * Hide the warning #7127 from the avail pages.
	 */
	this.hideWarning7127 = function() {
		if (plnextv2.utils.ImplementationUtils.removeError) {
			plnextv2.utils.ImplementationUtils.removeError(7127, "W");
		}
	};





	/***********************************************************************
	 *
	 * 		WRAPPERS ON TOP OF APPLICATION TO RETRIEVE DATA OF THE BOOKING
	 *
	 **********************************************************************/


	/**
	 * @returns {string} the external id
	 */
	this.getExternalId = function() {

		// Try to get the information from the dataLayer
		var json = this.getJson();
		if (json != null) {
			if (typeof(json.external_id) != "undefined") {
				return json.external_id;
			}
		}

		// Try to get it from the plnextv2
		try {
			var requestParameters = plnextv2.utils.context.AppContext.getAppData().requestParameters;
			if (typeof(requestParameters.EXTERNAL_ID) != "undefined") {
				return requestParameters.EXTERNAL_ID;
			}
		}
		catch (e) {
			// something went wrong
		}


		return "";

	};

	/**
	 * @returns {string} the session id
	 */
	this.getSessionId = function() {
		return plnextv2.utils.requestManager.PlnextRequestManager.getSessionId();
	};

	/**
	 * Return the eBaDataLayer object or null if not defined
	 */
	this.getJson = function() {
		if (typeof(eBaDataLayer) != "undefined") {
			return eBaDataLayer;
		}

		return null;
	};


	/**
	  @returns the language code of the page from the eBaDataLayer object
	*/
	this.getLanguage = function() {
		var json = this.getJson();
		if (json != null && json.language) {
			return json.language.toUpperCase();
		}

		return "";
	};


	/**
	  @returns the page code from the eBaDataLayer object
	*/
	this.getPage = function() {
		var json = this.getJson();
		if (json != null && json.page_code) {
			return json.page_code.toLowerCase();
		}

		try {
			return plnextv2.utils.context.AppContext.getPageId().toLowerCase();
		}
		catch (e) {
			self.warn("something goes wrong");
		}

		return "";
	};


	/**
	 @returns the primary email of the booking
	 */
	this.getEmail = function() {
		var json = this.getJson();
		if (json != null && json.primeEmail) {
			return json.primeEmail;
		}

		return "";
	};


	/**
	 * The retrieve page template can be served via several page codes.
	 * The methods help to encapsulate the different cases.
	 * @returns {boolean} true if the we are on one of the following pages: rtpl, conf, rconf, mconf
	 */
	this.isRetrievePage = function() {
		var page = self.getPage();
		return page.match(/rtpl|conf|rconf|mconf/gi);
	};

	/**
	 * @returns {boolean} true if the PNR was booked on an online office id
	 */
	this.isOnlinePnr = function() {
		return new RegExp(/(^.{5}08[A-Z]{2})/gi).test(self.getInitialOfficeId());
	};


	/**
	 * @returns {string} the 2 letter code of the departure country of the itinerary
	 */
	this.getDepartureCountryCode = function() {
		try {
			return self.getJson().bound[0].dep_country;
		}
		catch (e) {
			self.warn("Departure country code not found")
		}

		return "";
			
	};

	/**
	 * @returns {string} office ID used during the prime booking.
	 */
	this.getInitialOfficeId = function() {
		if (typeof(self.getJson().initial_office_id) != "undefined") {
			return self.getJson().initial_office_id;
		}
		else {
			self.warn("Initial office Id not found");
		}

		return "";


	};

	/**
	 * @returns {string} the currency used during the prime booking.
	 */
	this.getCurrency = function() {
		if (typeof(self.getJson().currency != "undefined")) {
			return self.getJson().currency;
		}
		else {
			self.warn("Initial office Id")
		}

		return "";
	};

	this.getInitialOfficeCity = function() {
		var officeId = self.getInitialOfficeId();
		if (officeId.length > 3) {
			return officeId.substr(0, 3).toUpperCase();
		}

		return "";
	};





	/***********************************************************************
	 *
	 * 		METHODS USED FOR OFFICE ID OVERRIDE
	 *
	 **********************************************************************/



	/**
	 * The methods initialize the array that is mapping one value to officeId
	 * @param {array}officeIdMap an associative array that maps a key (departure country, currency, ...) to one currency
	 *
	 * @example
	 *	var officeIdMap = {
			"DZ": "ALGQR08IB",
			"AR": "BUEQR08IB",
			"AU": "SYDQR08IB"
		};
		implibdx.core.initOfficeIdMapping(officeIdMap);

	 */
	this.initOfficeIdMapping = function(officeIdMap) {
		this.officeIdMapping = officeIdMap;
	};


	/**
	 * @private
	 */
	this._getOfficeId = function(input) {
		if (self.isOnlinePnr()) {
			return self.getInitialOfficeId();
		}

		if (self.officeIdMapping.length == 0) {
			self.warn("The office Id mapping is not defined");
			return null;
		}

		if (!input in this.officeIdMapping) {
			self.warn("The key " + input + " is not present in the mapping");
			return null;
		}

		return self.officeIdMapping[input];
	};


	/**
	 * As a prerequisite, you must have called the {@link IMPLibDxCore#initOfficeIdMapping} to init the map.
	 * @returns {string}the office ID of the prime booking in case the PNR was booked online, and if not, the office ID
	 * that was associated to the booking departure country code using the {@link IMPLibDxCore#initOfficeIdMapping} method.<br/>
	 * For offline PNR, if there is no office ID matching the departure country code, null is returned.
	 * @example
	 *	var officeIdMap = {
			"US": "NYCQR08IB",
			"QR": "DOHQR08IB",
			"FR": "PARQR08IB"
		};
		implibdx.core.initOfficeIdMapping(officeIdMap);
		var newOffice = implibdx.core.getOfficeIdByDepartureCountry();
	 */
	this.getOfficeIdByDepartureCountry = function() {
		return self._getOfficeId(self.getDepartureCountryCode());
	};

	/**
	 * As a prerequisite, you must have called the {@link IMPLibDxCore#initOfficeIdMapping} to init the map.
	 * @returns {string}the office ID of the prime booking in case the PNR was booked online, and if not, the office ID
	 * that was associated to the booking currency using the {@link IMPLibDxCore#initOfficeIdMapping} method.<br/>
	 * For offline PNR, if there is no office ID matching the currency, null is returned.
	 * @example
	 *	var officeIdMap = {
			"USD": "NYCQR08IB",
			"QAR": "DOHQR08IB",
			"EUR": "PARQR08IB"
		};
		implibdx.core.initOfficeIdMapping(officeIdMap);
		var newOffice = implibdx.core.getOfficeIdByCurrency();
	 */
	this.getOfficeIdByCurrency = function() {
		return self._getOfficeId(self.getCurrency());
	};



	/**
	 * As a prerequisite, you must have called the {@link IMPLibDxCore#initOfficeIdMapping} to init the map.
	 * @returns {string}the office ID of the prime booking in case the PNR was booked online, and if not, the office ID
	 * that was associated to the city of the booking office using the {@link IMPLibDxCore#initOfficeIdMapping} method.<br/>
	 * For offline PNR, if there is no office ID matching city, null is returned.
	 * @example
	 *	var officeIdMap = {
			"KEF": "KEFFI08AA",
			"PAR": "PARFI08AA"
		};
		implibdx.core.initOfficeIdMapping(officeIdMap);
		var newOffice = implibdx.core.getOfficeIdByInitialOfficeCity();
	 */
	this.getOfficeIdByInitialOfficeCity = function() {
		return self._getOfficeId(self.getInitialOfficeCity());
	};



	/**
	 * As a prerequisite, you must have called the {@link IMPLibDxCore#initOfficeIdMapping} to init the map.
	 * @returns {string}the office ID of the prime booking in case the PNR was booked online, and if not, the office ID
	 * that was associated to the office ID of the booking office using the {@link IMPLibDxCore#initOfficeIdMapping} method.<br/>
	 * For offline PNR, if there is no office ID matching the office, null is returned.
	 * @example
	 *	var officeIdMap = {
			"PAR6X0123": "PAR6X08AA",
			"LON6X0101": "LON6X08AA"
		};
		implibdx.core.initOfficeIdMapping(officeIdMap);
		var newOffice = implibdx.core.getOfficeIdByInitialOfficeCity();
	 */
	this.getOfficeIdByInitialOfficeId = function() {
		return self._getOfficeId(self.getInitialOfficeId());
	};


	/***********************************************************************
	 *
	 * 		METHODS USED FOR POS / POT OVERRIDE
	 *
	 **********************************************************************/


	/**
	 * The methods initialize the array that is mapping one value to point of sale
	 * @param {array} posMap an associative array that maps a key (departure country, currency, ...) to a point of sale.
	 *
	 * @example
	 *	var posMap = {
			"USD": "NYC",
			"EUR": "PAR",
			"GBP": "LON"
		};
		implibdx.core.initPosMapping(posMap);

	 */
	this.initPosMapping = function(posMap) {
		self.posMapping = posMap;
	};

	/**
	 * @private
	 */
	this._getPos = function(input) {
		if (self.posMapping.length == 0) {
			self.warn("The pos / pot mapping is not defined");
			return null;
		}

		if (!input in self.posMapping) {
			self.warn("The key " + input + " is not present in the pos mapping");
			return null;
		}

		return self.posMapping[input];
	};


	/**
	 * As a prerequisite, you must have called the {@link IMPLibDxCore#initPosMapping} to init the map.
	 * @returns {string} the point of sale that correspond to the currency of the booking.
	 * @example
	 * 	var posMap = {
			"USD": "NYC",
			"EUR": "PAR",
			"GBP": "LON"
		};
		implibdx.core.initPosMapping(posMap);
		var newPos = implibdx.core.getPosByCurrency();
	 */
	this.getPosByCurrency = function() {
		return self._getPos(self.getCurrency());
	};

	/**
	 * As a prerequisite, you must have called the {@link IMPLibDxCore#initPosMapping} to init the map.
	 * @returns {string} the point of sale that correspond to the currency of the booking.
	 * @example
	 * 	var posMap = {
			"US": "NYC",
			"FR": "PAR"
		};
		implibdx.core.initPosMapping(posMap);
		var newPos = implibdx.core.getPosByDepartureCountry();
	 */
	this.getPosByDepartureCountry = function() {
		return self._getPos(self.getDepartureCountryCode());
	};


	/**
	 * As a prerequisite, you must have called the {@link IMPLibDxCore#initPosMapping} to init the map.
	 * @returns {string} the point of sale that correspond to the currency of the booking.
	 * @example
	 * 	var posMap = {
			"PAR": "BRU",
			"NYC": "NYC",
			"LON": "LON"
		};
		implibdx.core.initPosMapping(posMap);
		var newPos = implibdx.core.getPosByInitialOfficeCity();
	 */
	this.getPosByInitialOfficeCity = function() {
		return this._getPos(self.getInitialOfficeCity());
	};



	/**
	 * As a prerequisite, you must have called the {@link IMPLibDxCore#initPosMapping} to init the map.
	 * @returns {string} the point of sale that correspond to the initial office Id
	 * used during the booking.
	 * @example
	 * 	var posMap = {
			"PAR6X0101": "PAR",
			"NYC6X0191": "NYC",
			"LON6X0133": "LON"
		};
		implibdx.core.initPosMapping(posMap);
		var newPos = implibdx.core.getPosByInitialOfficeId();
	 */
	this.getPosByInitialOfficeId = function() {
		return self._getPos(self.getInitialOfficeId());
	};







	/**
	 * Wrapper on top of the low level getOffice / getPos methods that permits
	 * to retrieve the right parameter override values from just 1 object in
	 * input.
	 *
	 * @param {object}pAttributes an object that provides the methods of override depending on the field and an additional
	 * other array in order to allow to provide additional parameters / values that are not part of the standard override
	 * methods
	 * @returns {array} an associative array with key = the parameter name, value = the parameter value
	 */
	this.getOverrideParameterValues = function(pAttributes) {
		var extraParams = {};

		if (typeof(pAttributes) != "undefined") {

			if (pAttributes.office) {
				var newOffice = null;
				if (pAttributes.office.toUpperCase() == self.BY_DEPARTURE_COUNTRY) {
					newOffice = self.getOfficeIdByDepartureCountry();
				}
				else if (pAttributes.office.toUpperCase() == self.BY_CURRENCY) {
					newOffice = self.getOfficeIdByCurrency();
				}
				else if (pAttributes.office.toUpperCase() == self.BY_INITIAL_OFFICE_CITY) {
					newOffice = self.getOfficeIdByInitialOfficeCity();
				}
				else if  (pAttributes.office.toUpperCase() == self.BY_INITIAL_OFFICE_ID) {
					newOffice = self.getOfficeIdByInitialOfficeId();
				}

				if (newOffice != null) {
					extraParams["SO_SITE_OFFICE_ID"] = newOffice;
				}
			}


			if (pAttributes.pos) {
				var newPos = null;
				if (pAttributes.pos.toUpperCase() == self.BY_DEPARTURE_COUNTRY) {
					newOffice = self.getPosByDepartureCountry();
				}
				else if (pAttributes.pos.toUpperCase() == self.BY_CURRENCY) {
					newPos = self.getPosByCurrency();
				}
				else if (pAttributes.pos.toUpperCase() == self.BY_INITIAL_OFFICE_CITY) {
					newPos = self.getPosByInitialOfficeCity();
				}
				else if  (pAttributes.pos.toUpperCase() == self.BY_INITIAL_OFFICE_ID) {
					newOffice = self.getPosByInitialOfficeId();
				}


				if (newPos != null) {
					extraParams["SO_SITE_POINT_OF_SALE"] = newPos;
					extraParams["SO_SITE_POINT_OF_TICKETING"] = newPos;
				}

			}



			if (pAttributes.other && typeof(pAttributes.other) === "object") {
				for (key in pAttributes.other) {
					if (pAttributes.other.hasOwnProperty(key)) {
						extraParams[key] = pAttributes.other[key];
					}
				};

			}

		}



		return extraParams;

	};


    /**
     * Return the data object used to render the page.
     */
    this.getPageData = function() {
        return plnextv2.utils.context.AppContext.getPageData();
    };


};




// Instantiate the object to access the class properties
var implibdx = implibdx || {};
implibdx.core = new IMPLibDxCore();




// Then DOM is loaded with header and footer (aria app may not have yet been initialized)
// We register all the needed events
jQuery(document).ready(function() {
	if (implibdx.core.isCustomJavascriptEnabled()) {

		if (implibdx.custom) {

			// Launch the user-defined onready page
			if (implibdx.custom.onDomReady) {
				implibdx.custom.onDomReady();
			}


			jQuery(document).on(implibdx.core.JSON_READY_EVENT, function() {

				if (implibdx.custom.onJsonReady) {
					implibdx.custom.onJsonReady();
				}

			});

		}

	}
});

