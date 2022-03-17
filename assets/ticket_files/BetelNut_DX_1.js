/**
 * 2016-10-07 LGC. Added CustomVar 4 for Internal Promotional tracking
 * 2016-10-27 Added workaround to track CP trip flow. 
 * 2016-11-03 Added workaround to track AMOP code(to track BOLETO) and payment reference ID to transaction ID. 
 * 2016-12-19 Added CN fix and Upsell fix to RT
 * 2017-06-13 added Distil Fix
 * 2017-09-28 adding APIM, DFSR, AAS, GERR
 * 2018-09-11 DIA-859: AA - Issue with PNRs with 0 revenue
 * 2019-08-12 Gustavo: Fix for PTR 17361862 [Serious]: AA:WWW-AeRE:Duplicated analytic script in header tag when changing date with back button enabled
 */
function launchGlobalTracking(){
	try{
		// FOR NEW UI : use a custom var (page level) for airline code if we have it
		/**
		 * JSON serialization / deserialization
		 * basic implementation for older browsers (IE6-7): http://caniuse.com/json
		 */
		if (typeof JSON === "undefined") {
			window.JSON = {
				parse: function(str) {
					return eval("(" + str + ")");
				},
				stringify: function(obj) {
					if (obj instanceof Object) {
						var str = "";
						if (obj.constructor === Array) {
							for (var k = 0; k < obj.length; str += this.stringify(obj[k]) + ",", k++);
							return "[" + str.slice(0, -1) + "]";
						}
						if (obj.toString !== Object.prototype.toString) {
							return "\"" + obj.toString().replace(/"/g, "\\$&") + "\"";
						}
						for (var key in obj) {
							str += "\"" + key.replace(/"/g, "\\$&") + "\":" + this.stringify(obj[key]) + ",";
						}
						return "{" + str.slice(0, -1) + "}";
					}
					return (typeof obj === "string") ? "\"" + obj.replace(/"/g, "\\$&") + "\"" : String(obj);
				}
			};
		}

		/*****
		** global variables
		******/
		gaEnvVar = {
			currdomain : document.domain,
			refurl : document.referrer.toString().replace("http://","").replace("https://",""),
			
			bflown : 0, //
			BEpageName : "", //
			pageName : (eBaDataLayer['page_code'] != undefined) ? ''+eBaDataLayer['page_code'] : '', //
			tripFlow : (eBaDataLayer['trip_flow'] != undefined) ? ''+eBaDataLayer['trip_flow'] : 'REVENUE', //fix BI missing tripFlow
			wt_env : eBACustomer.env,
			wt_sitecode : (eBaDataLayer['site_code'] != undefined) ? ''+eBaDataLayer['site_code'] : '',
			wt_office : (eBaDataLayer['office_id'] != undefined) ? ''+eBaDataLayer['office_id'] : '',
			wt_language : (eBaDataLayer['language'] != undefined) ? ''+eBaDataLayer['language'] : '',
			// The airline must override the market id in the call to BE : SO_SITE_MARKET_ID
			wt_market : (eBaDataLayer['market'] != undefined) ? ''+eBaDataLayer['market'] : '',
			wt_nbPax : (eBaDataLayer['nb_trav'] != undefined) ? ''+eBaDataLayer['nb_trav'] : '' //
		}
		wt_finalCurrency = '';

		/*****
		** Global initialisation
		******/
		isUsingDoubleClick = false;
		isErrorManaging = false;
		isFuelSurchageCalculate = false;
		isIframedSite = false;
		isFFNameEnglish = false;
		isUsingSameUrl = false;
		isSessionIdSkipped = true;
		isUsingExternalId = false;
		isUsingCnFix = false;
		gaAccountABT = '';
		isUsingAnonymizeIp = false;
		isUsingCampaignCookieTimeout = false;
		
		if(eBACustomer["modules"]){
			if(eBACustomer.modules["doubleClick"]){
				isUsingDoubleClick = true;
			}
			if(eBACustomer.modules["errorManage"]){
				isErrorManaging = true;
			}
			if(eBACustomer.modules["fuelCharge"]){
				isFuelSurchageCalculate = true;
			}
			if(eBACustomer.modules["ffnameEnglish"]){
				isFFNameEnglish = eBACustomer.modules.ffnameEnglish;
			}
			if(eBACustomer.modules["sessionIdSkipp"]){
				isSessionIdSkipped = eBACustomer.modules.sessionIdSkipp;
			}
			if(eBACustomer.modules.gaABTesting && eBACustomer.modules.gaABTesting != ''){
				gaAccountABT = eBACustomer.modules.gaABTesting;
			}
			if(eBACustomer.modules.externalId){
				isUsingExternalId = true;
			}
			if(eBACustomer.modules["cnFix"]){
				isUsingCnFix = true;
			}
			if(eBACustomer.modules["anonymizeIp"]){
				isUsingAnonymizeIp = true;
			}
			if(eBACustomer.modules["campaignCookieTimeout"]){
				isUsingCampaignCookieTimeout = true;
			}
		}

		if (eBACustomer.trackURL && eBACustomer.trackURL != ""){
			isIframedSite = true;
		}

		if (eBACustomer.sameUrlUsed && eBACustomer.sameUrlUsed == true){
			isUsingSameUrl = true;
		}

		/*****
		** Initialisation and flow detection
		******/
		setBEpage();//set bflown & BEpageName;
		var refdomain = gaEnvVar.refurl.slice(0,gaEnvVar.refurl.indexOf("/"));
		// By default, websites are using a subdomain for their BE pages, so, the isSearchResultPage will be calculated it in this way
		isSearchResultPage = (gaEnvVar.currdomain != refdomain &&(gaEnvVar.bflown==1 || gaEnvVar.bflown==2 || gaEnvVar.bflown==3));
		if(isUsingSameUrl){
			// For websites which are using the same URL all across the website both o Portal & IBE
			isSearchResultPage = gaEnvVar.bflown==1 || gaEnvVar.bflown==2 || gaEnvVar.bflown==3;
		}
		// isConfirmationPage = (gaEnvVar.pageName == "CONF" || gaEnvVar.pageName == "MCONF" || gaEnvVar.pageName == "COFS" || gaEnvVar.pageName == "COFR");
		isConfirmationPage = (gaEnvVar.pageName == "CONF");

		// Launch appropriate tracking flow
		if (gaEnvVar.tripFlow.toLowerCase() == 'car'){
			// carTracking(); Not yet implemented for Aster.
		}else if (gaEnvVar.tripFlow.toLowerCase()=='revenue' || gaEnvVar.tripFlow.toLowerCase()=='award'){	
			
			airBookingTracking(eBACustomer);
			
		}
				
	}catch(e){
		console.log(e);
	}
}

/*****
** Main function to track booking flows
******/

function airBookingTracking(eBACustomer){
	/*****
	** Initialisation of variables used all the file
	******/
	var ga_dep_search = (eBaDataLayer['city_search_out'] != undefined) ? ''+eBaDataLayer['city_search_out'] : '';
	var ga_arr_search = (eBaDataLayer['city_search_in'] != undefined) ? ''+eBaDataLayer['city_search_in'] : '';
	//var citiesSearched = (eBaDataLayer.bound != undefined) ? eBaDataLayer.bound[0].route : ga_dep_search + "-" + ga_arr_search;
	var citiesSearched = '';
    if(ga_dep_search && ga_arr_search)
		citiesSearched = ga_dep_search + "-" + ga_arr_search;
	else if(eBaDataLayer.bound != undefined)
		citiesSearched = eBaDataLayer.bound[0].route;
	//var citiesSearched = ga_dep_search + "-" + ga_arr_search;
	var rtowin = (eBaDataLayer['trip_type'] != undefined) ? ''+eBaDataLayer['trip_type'] : '';
	var bound_length = (eBaDataLayer.bound)? eBaDataLayer.bound.length : 0;
	//if(bound_length>=2 && (eBaDataLayer.bound[0]["dep_city"]!=eBaDataLayer.bound[1]["arr_city"])){
	//below workaround for trip_type fix due to missing trip_type in eBaDataLayer
	if(rtowin==""){
		if(bound_length<2){
			rtowin = "OW";
		} else if((eBaDataLayer.bound[0]["dep_city"]==eBaDataLayer.bound[1]["arr_city"])&&(eBaDataLayer.bound[0]["arr_city"]==eBaDataLayer.bound[1]["dep_city"])){
			rtowin = "RT";
		} else {
			rtowin = "CP";
			 citiesSearched = eBaDataLayer.bound[0]["dep_city"]+"-"+eBaDataLayer.bound[0]["arr_city"];
			 for (i=1;i<bound_length;i++){ 
					citiesSearched = citiesSearched + "|" + eBaDataLayer.bound[i]["dep_city"]+"-"+eBaDataLayer.bound[i]["arr_city"];	
			 }
		}
	} else if(bound_length>=2 && rtowin!="RT"){
		 rtowin = "CP";
		 citiesSearched = eBaDataLayer.bound[0]["dep_city"]+"-"+eBaDataLayer.bound[0]["arr_city"];
		 for (i=1;i<bound_length;i++){ 
				citiesSearched = citiesSearched + "|" + eBaDataLayer.bound[i]["dep_city"]+"-"+eBaDataLayer.bound[i]["arr_city"];	
		 }
	} 
	//end of workaround for trip_type
	/*****
	** code for page views : get informations
	******/
	// NotBookingEngine
	if (!eBaDataLayer || !eBaDataLayer['page_code'] || eBaDataLayer['page_code']==''){
		tag = "NotBookingEngine";
	} 
	else {tag = eBaDataLayer['page_code'];}

	// Remove the jsession Id
	var urlPage = document.location.href;
	if(isSessionIdSkipped){
		if (urlPage.indexOf(';')>0){
			urlPage = urlPage.substr(0,document.location.href.indexOf(';'));
		}
	}

	// Remove parameters (override parameters sent to the BE via GET method)
	if ( urlPage.indexOf('?') != -1 ){
		urlPage = urlPage.substr(0, urlPage.indexOf('?'));
	}

	// URL format - in order to add our parameters to the new url
	urlPage += (urlPage.indexOf('?') == -1) ? '?' : '';
	urlPage += (urlPage.indexOf('?') > 0 && urlPage.indexOf('&') > 0) ? '&' : '';
	if 	(isSearchResultPage && (urlPage.indexOf('#')>0)){
			urlPage = urlPage.replace('#','');
	}

	
	gaURL = urlPage +
			'wt_company=' + eBACustomer.company +
			'&wt_flow=' + gaEnvVar.tripFlow +
			'&wt_market=' + gaEnvVar.wt_market +
			'&wt_language=' + gaEnvVar.wt_language +
			'&wt_env=' + gaEnvVar.wt_env +
			'&wt_domain=' + gaEnvVar.currdomain +
			'&wt_office=' + gaEnvVar.wt_office +
			'&wt_page=' + gaEnvVar.BEpageName +
			'&wt_pagecode=' + gaEnvVar.pageName +
			'&wt_sitecode=' + gaEnvVar.wt_sitecode;

	if 	(isSearchResultPage){
		var cabin = (eBaDataLayer.bound && eBaDataLayer.bound[0] && eBaDataLayer.bound[0].cabin != undefined) ? '' + eBaDataLayer.bound[0].cabin : 
		((eBaDataLayer.pnr_cabin && eBaDataLayer.pnr_cabin != undefined)? '' + eBaDataLayer.pnr_cabin : '');
		//on first page of BE we are tracking site search
		gaURL = gaURL +
			'&wt_search2=' + encodeURI(cabin) + //encode to avoid special char issues
			'&wt_search=' + citiesSearched + '_' + rtowin +
			//'&search=' + citiesSearched + '_' + rtowin +
			'&wt_spax=' + gaEnvVar.wt_nbPax +
			'&wt_sflow=' + gaEnvVar.tripFlow +
			'&wt_soffice=' + gaEnvVar.wt_office +
			'&wt_ssitecode=' + gaEnvVar.wt_sitecode ;
	}else if (tag == "NotBookingEngine") {
		gaURL = urlPage + "?company=" + eBACustomer.company;
	}
	
	//Function to convert date in dd/mm/yyyy format
	function convertDate(dep_date) {
		if(!validateDate(dep_date))
			{
					function pad(s) { return (s < 10) ? '0' + s : s; }
					var d = new Date(dep_date);
					return[pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
			}
			else
				return dep_date;
		}
		
		
	//Function to check if date is in dd/mm/yyyy format	
	function validateDate(dep_date){
		var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
		if (dep_date.match(reg)) {
				return true;
			}
		else
			return false;
	}

	// Calculation of the sunday rule
	// As the calculation is on the first page, date are not yet valid (customer can change them on calendar page or upsell page)
	// So, the calculation will be done on search dates.
	var ddate = "";
	var rdate = "";
	var wt_sunRule = 'N/A (One Way flight)';
	var nb_bound = (eBaDataLayer.bound)? eBaDataLayer.bound.length : 0;

	if(eBaDataLayer.bound && eBaDataLayer.bound[0]){
		// Calculation of departure date and arrival date from bound object
		ddate = reverseDate((eBaDataLayer.bound[0].dep_date != undefined) ? ''+eBaDataLayer.bound[0].dep_date : '');
		// If it is a one way, no returne date
		if(rtowin =='RT'){
			rdate = reverseDate((eBaDataLayer.bound[1].dep_date != undefined) ? ''+eBaDataLayer.bound[1].dep_date : '');
		}
		else{
			if(rtowin == 'CP')
			{
					ddate = reverseDate((eBaDataLayer.bound[0]["dep_date"] != undefined) ? ''+convertDate(eBaDataLayer.bound[0]["dep_date"]) : '');
					rdate = reverseDate((eBaDataLayer.bound[nb_bound-1]["dep_date"] != undefined) ? ''+convertDate(eBaDataLayer.bound[nb_bound-1]["dep_date"]) : '');
			}
		}
	}else{
		ddate = reverseDate((eBaDataLayer['date_search_out'] != undefined) ? ''+eBaDataLayer['date_search_out'] : '');
		rdate = reverseDate((eBaDataLayer['date_search_in'] != undefined) ? ''+eBaDataLayer['date_search_in'] : '');
	}
	
	if (rtowin !='OW'){
		if(ddate && rdate){
			wt_sunRule = sundayRule(ddate, rdate); 
		}
	}
	
/*	// Manage errors 
	var ibe_errors = "";
	if (isErrorManaging){
		var errObj = plnextv2.utils.pageProvider.PlnextPageProvider._params.pageEngine._pageConfigs[eBaDataLayer.page_code]["pageComposition"]["pageData"]["errorList"]["globalErrors"]["E"];
		if (errObj){
		var errObjLength = errObj.length;
		for(i=0;i<errObjLength;i++){
		ibe_errors+="&wt_E"+i+"="+errObj[i].type+errObj[i].code;}
		gaURL += ibe_errors;
		}
	}*/
	
	// Manage errors 
	var ibe_errors = "";
	if (isErrorManaging){
		var errObj = plnextv2.utils.pageProvider.PlnextPageProvider._pageDefinitionConfig.pageData.errorList.globalErrors["E"];
		if (errObj){
		var errObjLength = errObj.length;
		for(i=0;i<errObjLength;i++){
		ibe_errors+="&wt_E"+i+"="+((errObj[i].type != undefined) ? errObj[i].type : '')+errObj[i].code;}
		gaURL += ibe_errors;
		}
	}

	/*****
	** code for confirmation page - Ecommerce tracking
	******/
	if 	(isConfirmationPage){
		
		//Date Calculations : we can use now real dates of journey, in the bound
		var todaydate = new Date();				 
		
		if(eBaDataLayer.advance_purchase==null && eBaDataLayer.bound !=null){
			var e = gaDateDayMonthYear(eBaDataLayer.bound[0].dep_date);
			var t = new Date();
			eBaDataLayer.advance_purchase = Math.round((e - t) / 864e5);
		}
		var ga_advance = eBaDataLayer.advance_purchase;
		//var ga_advance = (eBaDataLayer.advance_purchase != undefined) ? eBaDataLayer.advance_purchase : 0;
		var wt_adPurch = timeCategorization(ga_advance);//for adv purchase
		var wt_jLength = 'N/A (One Way flight)';
		 
		if (rtowin !='OW'){
			wt_jLength = timeCategorization(days_between(new Date(ddate), new Date(rdate)));
		}
		
		nssret = 0;
		var nb_pax = 1;
		if(eBaDataLayer.nb_trav != null){
			nb_pax = eBaDataLayer.nb_trav;
		}else if(eBaDataLayer.passengerList !=null){
			nb_pax = eBaDataLayer.passengerList.length;
		}
		if (rtowin == "RT"){
			nss = nb_pax * 2; 
			nssret = nb_pax;
		} else {nss = nb_pax;}

		wt_selectedCurrency = (eBaDataLayer.currency != undefined) ? ""+eBaDataLayer.currency : "";
		
		//var convertToCurr = '';
		var convertToCurr = wt_selectedCurrency;
		//if (eBACustomer.compcur != wt_selectedCurrency){
		//	convertToCurr = wt_selectedCurrency;
		//}
		
		var tax_amount = (eBaDataLayer.tax_amount != undefined) ? eBaDataLayer.tax_amount : 0;
		var pnr_fee = (eBaDataLayer.service_fee != undefined) ? eBaDataLayer.service_fee : 0;
		wt_tax = convertFormatPrice(tax_amount,convertToCurr);		 
		wt_fee= convertFormatPrice(pnr_fee,convertToCurr);
		
		//fuel surcharge in shipping - Air Mauritius
		if (isFuelSurchageCalculate){
			//retrieve fuelSurcharge
			wt_fee ='0.00';
			if (Get_Cookie('YACQ')) {
				YACQ = Get_Cookie('YACQ');
				wt_fee = convertFormatPrice(YACQ,convertToCurr);
			}
			Delete_Cookie('YACQ', '/', '');
		}

		var wt_ttc = 0;
		if(eBaDataLayer.total_price){
			wt_ttc = convertFormatPrice(eBaDataLayer.total_price,convertToCurr);			
		}
		else{
			// Compute the total price from the price details
			if(eBaDataLayer.price_details && eBaDataLayer.price_details.total_price){
				wt_ttc= convertFormatPrice(eBaDataLayer.price_details.total_price,convertToCurr);
			}
			else{
				wt_ttc = convertFormatPrice(0,convertToCurr);
			}			
		}


		
		tmppricewotax = wt_ttc - wt_tax - wt_fee; 
		pricepax = tmppricewotax/nb_pax;
		
		wt_netpax = convertFormatPrice(pricepax,wt_finalCurrency);//final currency to not convert it again
		//wt_netpax = pricepax;
		wt_city = (eBaDataLayer.payment_cc_city != undefined) ? ""+eBaDataLayer.payment_cc_city : "";
		wt_country = (eBaDataLayer.payment_cc_country != undefined) ? ""+eBaDataLayer.payment_cc_country : "";

		// Take a look deeper to know if we really need the snippet of code below (until ***)
		deferred = "TRUE";
		fullHTML = document.body.innerHTML;
		var deferred_index2 = fullHTML.indexOf('paymentExternalPayment');
		if(deferred_index2 >= 0){deferred = "FALSE";}
		// *****
		
		// Calculate the upsell
		var upsellOutboundString = "OUP NONE";
		var upsellInboundString = "IUP NONE";
		var lowestOutboundFF = (eBaDataLayer.bound[0].lowest_ff_code != undefined) ? ""+eBaDataLayer.bound[0].lowest_ff_code : (eBaDataLayer.lowest_ff_code != undefined ? eBaDataLayer.lowest_ff_code : "");
		var lowestInboundFF = "";
		var selectedOutboundFF = (eBaDataLayer.bound[0].selected_ff_code != undefined) ? ""+eBaDataLayer.bound[0].selected_ff_code : (eBaDataLayer.selected_ff_code != undefined ? eBaDataLayer.selected_ff_code : "");
		var selectedInboundFF = "";
		
		// We use first FF code and if ff name are in English for all languages, then, we can use FF name.
		if(isFFNameEnglish)
		{
			lowestOutboundFF = (eBaDataLayer.bound[0].lowest_ff_name != undefined) ? ""+eBaDataLayer.bound[0].lowest_ff_name : (eBaDataLayer.lowest_ff_name != undefined ? eBaDataLayer.lowest_ff_name : "");
			selectedOutboundFF = (eBaDataLayer.bound[0].selected_ff_name != undefined) ? ""+eBaDataLayer.bound[0].selected_ff_name : (eBaDataLayer.selected_ff_name != undefined ? eBaDataLayer.selected_ff_name : "");

			if (rtowin =="RT")
			{
				lowestInboundFF = (eBaDataLayer.bound[nb_bound-1].lowest_ff_name != undefined) ? ""+eBaDataLayer.bound[nb_bound-1].lowest_ff_name : (eBaDataLayer.lowest_ff_name != undefined ? eBaDataLayer.lowest_ff_name : "");
				selectedInboundFF = (eBaDataLayer.bound[nb_bound-1].selected_ff_name != undefined) ? ""+eBaDataLayer.bound[nb_bound-1].selected_ff_name : (eBaDataLayer.selected_ff_name != undefined ? eBaDataLayer.selected_ff_name : "");
				////upsell capture RT
				if (lowestOutboundFF != selectedOutboundFF)
				upsellOutboundString = 'OUP '+ lowestOutboundFF + ' - ' + selectedOutboundFF;
				if (lowestInboundFF != selectedInboundFF)
				upsellInboundString = 'IUP '+ lowestInboundFF + ' - ' + selectedInboundFF;
				////
			} else if (rtowin =="CP"){
				// Complex flight, I add all information in the outbound values
				for(var i=1; i < nb_bound; i++){
					if( i!=1 ){
						lowestOutboundFF += " ";
						selectedOutboundFF += " ";
					}
					lowestOutboundFF += (eBaDataLayer.bound[i].lowest_ff_name != undefined) ? ""+eBaDataLayer.bound[i].lowest_ff_name : "";
					selectedOutboundFF += (eBaDataLayer.bound[i].selected_ff_name != undefined) ? ""+eBaDataLayer.bound[i].selected_ff_name : "";
				}
			}
		}else{
			// FFname are localised, we use fare family code
			if (rtowin =="RT")
			{
				lowestInboundFF = (eBaDataLayer.bound[nb_bound-1].lowest_ff_code != undefined) ? ""+eBaDataLayer.bound[nb_bound-1].lowest_ff_code : (eBaDataLayer.lowest_ff_code != undefined ? eBaDataLayer.lowest_ff_code : "");
				selectedInboundFF = (eBaDataLayer.bound[nb_bound-1].selected_ff_code != undefined) ? ""+eBaDataLayer.bound[nb_bound-1].selected_ff_code : (eBaDataLayer.selected_ff_code != undefined ? eBaDataLayer.selected_ff_code : "");
				////upsell capture RT
					if (lowestOutboundFF != selectedOutboundFF)
					upsellOutboundString = 'OUP '+ lowestOutboundFF + ' - ' + selectedOutboundFF;
					if (lowestInboundFF != selectedInboundFF)
					upsellInboundString = 'IUP '+ lowestInboundFF + ' - ' + selectedInboundFF;
				////
			} else if (rtowin =="CP"){
				// Complex flight, I add all information in the outbound values
				upsellOutboundString = "NO UPSELL";
				for(var i=1; i < nb_bound; i++){
					if( i!=1 ){
						lowestOutboundFF += " ";
						selectedOutboundFF += " ";
					}
					lowestOutboundFF += (eBaDataLayer.bound[i].lowest_ff_code != undefined) ? ""+eBaDataLayer.bound[i].lowest_ff_code : "";
					selectedOutboundFF += (eBaDataLayer.bound[i].selected_ff_code != undefined) ? ""+eBaDataLayer.bound[i].selected_ff_code : "";
				}
				if (lowestOutboundFF != selectedOutboundFF)
				upsellOutboundString = "CP "+ lowestOutboundFF + ' - ' + selectedOutboundFF;
			}
		}
				
		// Route data (airport codes) and flight data (airlines code)
		var wt_airrouteob =(eBaDataLayer.bound[0].route != undefined) ? ""+eBaDataLayer.bound[0].route : ""; // Outbound
		var wt_flightob = (eBaDataLayer.bound[0].flight_numbers != undefined) ? ""+eBaDataLayer.bound[0].flight_numbers : ""; // Outbound
		var wt_carrierCodeob = (eBaDataLayer.bound[0].airlines_code != undefined) ? ""+eBaDataLayer.bound[0].airlines_code : ""; // Outbound;
		var wt_airrouteret = ""; // Inbound
		var wt_flightret = ""; // Inbound
		var wt_carrierCoderet = ""; // Inbound

		if (rtowin=='CP'){
			for(var i=1; i < nb_bound; i++){
				wt_carrierCodeob += '|' + ((eBaDataLayer.bound[i].airlines_code != undefined) ? ""+eBaDataLayer.bound[i].airlines_code : ""); // Outbound
				wt_airrouteob += '|' + ((eBaDataLayer.bound[i].route != undefined) ? ""+eBaDataLayer.bound[i].route : ""); // Outbound
				wt_flightob += '|' + ((eBaDataLayer.bound[i].flight_numbers != undefined) ? ""+eBaDataLayer.bound[i].flight_numbers : ""); // Outbound
			}
				wt_airrouteret = (eBaDataLayer.bound[nb_bound-1].route != undefined) ? ""+eBaDataLayer.bound[nb_bound-1].route : ""; //Inbound
				wt_flightret = (eBaDataLayer.bound[nb_bound-1].flight_numbers != undefined) ? ""+eBaDataLayer.bound[nb_bound-1].flight_numbers : ""; //Inbound
				wt_carrierCoderet = (eBaDataLayer.bound[nb_bound-1].airlines_code != undefined) ? ""+eBaDataLayer.bound[nb_bound-1].airlines_code : "";
		}else if (rtowin=='RT'){
			wt_airrouteret = (eBaDataLayer.bound[1].route != undefined) ? ""+eBaDataLayer.bound[1].route : "";
			wt_flightret = (eBaDataLayer.bound[1].flight_numbers != undefined) ? ""+eBaDataLayer.bound[1].flight_numbers : "";
			wt_carrierCoderet = (eBaDataLayer.bound[1].airlines_code != undefined) ? ""+eBaDataLayer.bound[1].airlines_code : "";
		}
		
		var ga_lang = (eBaDataLayer.language != undefined) ? ""+eBaDataLayer.language : "";
		var ga_office_id = (eBaDataLayer.office_id != undefined) ? ""+eBaDataLayer.office_id : "";
		var ga_pnr_number = (eBaDataLayer.pnr_nbr != undefined) ? ""+eBaDataLayer.pnr_nbr : "";
		var wt_countryob = (eBaDataLayer.bound[0].dep_country != undefined) ? ""+eBaDataLayer.bound[0].dep_country : "";
		var wt_countryret = (eBaDataLayer.bound[0].arr_country != undefined) ? ""+eBaDataLayer.bound[0].arr_country : "";
		var wt_mop = (eBaDataLayer.payment_method != undefined) ? ""+eBaDataLayer.payment_method : "";
		var wt_cctype = (eBaDataLayer.payment_cc_name != undefined) ? ""+eBaDataLayer.payment_cc_name : "";
		var wt_cabin = (eBaDataLayer.bound && eBaDataLayer.bound[0] && eBaDataLayer.bound[0].cabin != undefined) ? '' + eBaDataLayer.bound[0].cabin : 
		((eBaDataLayer.pnr_cabin && eBaDataLayer.pnr_cabin != undefined)? '' + eBaDataLayer.pnr_cabin : '');
		//var wt_cabin = (eBaDataLayer.pnr_cabin != undefined) ? ""+eBaDataLayer.pnr_cabin : "";
		var wt_dep = (eBaDataLayer.bound[0].dep_airport != undefined) ? ""+eBaDataLayer.bound[0].dep_airport : "";
		var wt_arr = (eBaDataLayer.bound[0].arr_airport != undefined) ? ""+eBaDataLayer.bound[0].arr_airport : "";
		var wt_cityPair = wt_dep + "-" + wt_arr;
		var wt_campaign = (eBaDataLayer.external_id != undefined) ? ""+eBaDataLayer.external_id : "";
		// AMOP values
		var wt_amopcode = (plnextv2.utils.context.AppContext.getPageData().business.RESERVATION_INFO.paymentInformation.AMOPConfirmation.code != undefined) ? ""+plnextv2.utils.context.AppContext.getPageData().business.RESERVATION_INFO.paymentInformation.AMOPConfirmation.code : "";
		var wt_paymentid = (plnextv2.utils.context.AppContext.getPageData().business.RESERVATION_INFO.paymentInformation.AMOPConfirmation.asyncReference != undefined) ? ""+plnextv2.utils.context.AppContext.getPageData().business.RESERVATION_INFO.paymentInformation.AMOPConfirmation.asyncReference.id : "";
		
		wt_transID= 'wt_company=' + eBACustomer.company +
					'&wt_country=' + wt_country +
					'&wt_language=' + ga_lang +
					'&wt_env=' + gaEnvVar.wt_env +
					'&wt_domain=' + gaEnvVar.currdomain +
					'&wt_office=' + ga_office_id +
					'&wt_flow=' + gaEnvVar.tripFlow +
					'&wt_cpair=' + citiesSearched +
					'&wt_rtowin=' + rtowin +
					'&wt_pnrloc=' + ga_pnr_number +
					'&wt_dateob=' + ddate +
					'&wt_dateret=' + rdate +
					'&wt_countryob=' + wt_countryob +
					'&wt_countryret=' + wt_countryret +
					'&wt_mop=' + wt_mop +
					'&wt_cctype=' + wt_cctype +
					'&wt_cabin=' + wt_cabin +
					'&wt_apurchcat=' + wt_adPurch +
					'&wt_defpay=' + deferred +
					'&wt_market=' + gaEnvVar.wt_market +
					'&wt_sunRule=' + wt_sunRule +
					'&wt_selectedCurrency=' + wt_selectedCurrency +
					'&wt_finalCurrency=' + wt_finalCurrency +
					'&wt_jLength=' + wt_jLength + ibe_errors;

		wt_sku = 'wt_company=' + eBACustomer.company +
  		'&wt_country=' + wt_country +
  		'&wt_market=' + gaEnvVar.wt_market +
  		'&wt_language=' + ga_lang +
  		'&wt_office=' + ga_office_id+
  		'&wt_flow=' + gaEnvVar.tripFlow +
  		'&wt_itemtype=aircomppax';

		wt_productName = '&wt_cpair='+ citiesSearched +
				'&wt_rtowin=' + rtowin +
				'&wt_airrouteob=' + wt_airrouteob +
				'&wt_airrouteret=' + wt_airrouteret+
				'&wt_flightob=' + wt_flightob+
				'&wt_flightret=' + wt_flightret+
				'&wt_carrierCodeob=' + wt_carrierCodeob+
				'&wt_carrierCoderet=' + wt_carrierCoderet;
		
		wt_category = '&wt_pax=' + nb_pax +
				'&wt_dateob=' + ddate +
				'&wt_dateret=' + rdate +					
				'&wt_countryob=' + wt_countryob +
				'&wt_countryret=' + wt_countryret +
				'&wt_mop=' + wt_mop +
				'&wt_cctype=' + wt_cctype +
				'&wt_lwfarefamob=' + lowestOutboundFF +
				'&wt_lowfarefamret=' + lowestInboundFF +
				'&wt_selfarefamob=' + selectedOutboundFF + 
				'&wt_selfarefamret=' + selectedInboundFF +
				'&wt_cabin=' + wt_cabin +
				'&wt_nssob=' + nb_pax +
				'&wt_nssret=' + nssret +
				'&wt_nss=' + nss +
				'&wt_upsellob=' + upsellOutboundString +
				'&wt_upsellret=' + upsellInboundString; 		
		
		if(wt_mop == "AMOP"){ ///// AMOP code & Payment reference ID tracking for O6 to track BOLETO
			wt_transID = wt_transID + 
						'&wt_amopcode=' + wt_amopcode + 
						'&wt_paymentid=' + wt_paymentid;
		}
		
		if(isUsingExternalId){///// External_ID tracking for TG to track internal campaigns
				// It will append external_id value to transactionID if enabled
				wt_transID = wt_transID + '&wt_campaign=|' + wt_campaign;
		}
	}

	/*****
	** Tracking part
	******/
  var opt_scope = {"visitor": 1, "session": 2, "page": 3};
	if (!isIframedSite){
		var loadedGoogleAnalytics = 0; // fix CnAA
		var gaClone; // fix CnAA
		_gaq = window._gaq || [];
		for(i=0;i<eBACustomer.ga.length;i++){
			/*****
			** track page views
			******/
			if(eBACustomer.ga[i] != ""){
				var tracker = "track"+i;	
				_gaq.push([tracker+'._setAccount', eBACustomer.ga[i]]);
				if(gaEnvVar.wt_env=='production' || gaEnvVar.wt_env=='SA'){
					_gaq.push([tracker+'._setDomainName', eBACustomer.gaDomain]);
				}		
				//Integrating the Distil Force Identification Referrer
				// Start - Referrer issue fix - caused by Distil
				try {
					if (typeof sessionStorage !== 'undefined'){
					_gaq.push([tracker+'._setReferrerOverride', (sessionStorage.getItem('distil_referrer') || document.referrer) ]);       
					sessionStorage.removeItem('distil_referrer');
					}
				} catch (e){}
				// end of fix
				_gaq.push([tracker+'._setAllowLinker', eBACustomer.setAllowLinker]);
				_gaq.push([tracker+'._set', 'page', gaURL]);
				if (isSearchResultPage){
					//custom variable for Sunday Rule available on the first page
					_gaq.push([tracker+'._setCustomVar',5, 'Sunday Rule', wt_sunRule, opt_scope.session ]);
				}
        if (isUsingExternalId){
          //custom variable for internal promotion
          var wt_campaign = (eBaDataLayer.external_id != undefined) ? ""+eBaDataLayer.external_id : "";
          _gaq.push([tracker+'._setCustomVar',4, 'Internal promotion', wt_campaign, opt_scope.session ]);
        }
				if(eBACustomer.homeDomain){
					for(j=0;j<eBACustomer.homeDomain.length;j++){
						_gaq.push([tracker+'._addIgnoredRef', eBACustomer.homeDomain[j]]);
					}
				}
	if (isUsingAnonymizeIp){
          _gaq.push (['_gat._anonymizeIp']);
        }
		if (isUsingCampaignCookieTimeout){
           _gaq.push([tracker+'._setCampaignCookieTimeout', eBACustomer.setCampaignCookieTimeout]);
        }
        /**
         * _addOrganic search engines
         */
       //  var organicSearchEngines = [
       //    {d:'aol.com', p:'query', o:true},
       //    {d:'ask.com', p:'q', o:true},
       //    {d:'baidu.com', p:'wd', o:true},
       //    {d:'bing.com', p:'q', o:true},
       //    {d:'lycos.com', p:'query', o:true},
       //    {d:'msn.com', p:'q', o:true},
       //    {d:'yahoo.com', p:'p', o:true},
       //    {d:'es.search.yahoo.com', p:'p', o:true},
       //    {d:'fr.search.yahoo.com', p:'p', o:true},
       //    {d:'yandex.com', p:'text', o:true}
       //  ];
       // for (var k = organicSearchEngines.length - 1; k >= 0; k--) {
       //    _gaq.push([tracker+'_addOrganic', organicSearchEngines[k].d, organicSearchEngines[k].p, organicSearchEngines[k].o]);
       //  }
        var siteSpeedSampleRateDefault = 50;
	eBACustomer.siteSpeedSampleRate = (eBACustomer.siteSpeedSampleRate !== undefined) ? eBACustomer.siteSpeedSampleRate : siteSpeedSampleRateDefault;
	_gaq.push([tracker+'._setSiteSpeedSampleRate', eBACustomer.siteSpeedSampleRate]);
	_gaq.push([tracker+'._trackPageview']);
								
			}
			
			// AB Testing
			if(gaAccountABT != '' && i==0){
						_gaq.push(['inn._setAccount', gaAccountABT]);
						_gaq.push(['inn._setDomainName', eBACustomer.gaDomain]);
						_gaq.push(['inn._setAllowLinker', eBACustomer.setAllowLinker]);
						_gaq.push(['inn._trackPageview']);
			}
	
			/*****
			** track ecommerce
			******/
			if (isConfirmationPage){
				// Transaction tracking
				if(gaEnvVar.tripFlow.toLowerCase() == 'award'){//AWARD
					if (launchTracking(tracker+gaEnvVar.tripFlow+ga_pnr_number)){
						//we create two transactions. 1 for cash(fees and taxes) and 1 for points
						 wt_transIDAWCash = wt_transID+'&wt_transType=awardCASH';
						 wt_transIDAWPoints = wt_transID+'&wt_transType=awardPoints';
						 
						var wt_miles = (eBaDataLayer.points != undefined) ? eBaDataLayer.points : 0;

						var wt_milesPerPax = wt_miles/nb_pax;
						var wt_formattedMilesPerPax = wt_milesPerPax;
						
						//cash tracking 
						_gaq.push([tracker+'._addTrans',wt_transIDAWCash, ga_office_id, wt_ttc, wt_tax, wt_fee, "paymentcccity", "NA", "paymentcccountry"]);
						_gaq.push([tracker+'._addItem',wt_transIDAWCash, wt_sku, wt_productName, wt_category, '0.00', nb_pax]);
						_gaq.push([tracker+'._set', 'currencyCode', wt_finalCurrency]);
						_gaq.push([tracker+'._trackTrans']);
						
						//New tracker for points (needed) to avoid a GA bug
						var trackerPoint = "trackPoints"+i;	
						_gaq.push([trackerPoint+'._setAccount', eBACustomer.ga[i]]);
						if(gaEnvVar.wt_env=='production'){
							_gaq.push([trackerPoint+'._setDomainName', eBACustomer.gaDomain]);
						}		
						_gaq.push([trackerPoint+'._setAllowLinker', eBACustomer.setAllowLinker]);
						_gaq.push([trackerPoint+'._set', 'page', gaURL]);
						//points tracking						
						_gaq.push([trackerPoint+'._addTrans',wt_transIDAWPoints, ga_office_id, wt_miles, '0.00', '0.00', '', '', '']);
						_gaq.push([trackerPoint+'._addItem',wt_transIDAWPoints, wt_sku, wt_productName, wt_category, wt_formattedMilesPerPax, nb_pax]);
						_gaq.push([trackerPoint+'._set', 'currencyCode', '']);
						_gaq.push([trackerPoint+'._trackTrans']);
					}
				} 
				
				else{//REVENUE
					if (launchTracking(tracker+gaEnvVar.tripFlow+ga_pnr_number+eBaDataLayer.payment_method)){
						_gaq.push([tracker+'._addTrans',wt_transID, ga_office_id, wt_ttc, wt_tax, wt_fee, "paymentcccity", "NA", "paymentcccountry"]);
						_gaq.push([tracker+'._addItem',wt_transID, wt_sku, wt_productName, wt_category, wt_netpax, nb_pax]);
						_gaq.push([tracker+'._set', 'currencyCode', wt_finalCurrency]);
						_gaq.push([tracker+'._trackTrans']);
					}
				}
			}
		}

/*if(eBaDataLayer['page_code']=='ALPI'){
		for(var k=0;k<bound_length;k++){
		//eBaEvent('BkgPgAvail','Upgrade',InitialOB_ff:InitialOB_fp-SelectedOB_ff:SelectedOB_fp);
		InitialIB_ff = (eBaDataLayer.bound[k].lowest_ff_code != undefined) ? ''+eBaDataLayer.bound[k].lowest_ff_code : '';
		InitialIB_fp = (eBaDataLayer.bound[k].lowest_ff_price != undefined) ? ''+eBaDataLayer.bound[k].lowest_ff_price : '';
		SelectedIB_ff = (eBaDataLayer.bound[k].selected_ff_code != undefined) ? ''+eBaDataLayer.bound[k].selected_ff_code : '';
		SelectedIB_fp = (eBaDataLayer.bound[k].selected_ff_price != undefined) ? ''+eBaDataLayer.bound[k].selected_ff_price : '';
		if(parseInt(SelectedIB_fp)>parseInt(InitialIB_fp)){
			eBaEvent('BkgPgAvail','Upgrade','Bound'+k+'-'+InitialIB_ff+':'+InitialIB_fp+'-'+SelectedIB_ff+':'+SelectedIB_fp);
		}
	}
}*/

if(eBaDataLayer['page_code']=='ALPI'||eBaDataLayer['page_code']=='APIM'){
		//eBaEvent('BkgPgAvail','Upgrade',InitialOB_ff:InitialOB_fp-SelectedOB_ff:SelectedOB_fp);
		InitialIB_ff = (eBaDataLayer.bound[0].lowest_ff_code != undefined) ? ''+eBaDataLayer.bound[0].lowest_ff_code : '';
		InitialIB_fp = (eBaDataLayer.bound[0].lowest_ff_price != undefined) ? ''+eBaDataLayer.bound[0].lowest_ff_price : '';
		SelectedIB_ff = (eBaDataLayer.bound[0].selected_ff_code != undefined) ? ''+eBaDataLayer.bound[0].selected_ff_code : '';
		SelectedIB_fp = (eBaDataLayer.bound[0].selected_ff_price != undefined) ? ''+eBaDataLayer.bound[0].selected_ff_price : '';
		if(eBaDataLayer.bound[1] != undefined){
					InitialOB_ff = (eBaDataLayer.bound[1].lowest_ff_code != undefined) ? ''+eBaDataLayer.bound[1].lowest_ff_code : '';
					InitialOB_fp = (eBaDataLayer.bound[1].lowest_ff_price != undefined) ? ''+eBaDataLayer.bound[1].lowest_ff_price : '';
					SelectedOB_ff = (eBaDataLayer.bound[1].selected_ff_code != undefined) ? ''+eBaDataLayer.bound[1].selected_ff_code : '';
					SelectedOB_fp = (eBaDataLayer.bound[1].selected_ff_price != undefined) ? ''+eBaDataLayer.bound[1].selected_ff_price :'';
		}
		if((parseInt(SelectedIB_fp)>parseInt(InitialIB_fp)) && (rtowin == 'OW')){		//eBaEvent('BkgPgAvail','Upgrade','Bound'+k+'-'+InitialIB_ff+':'+InitialIB_fp+'-'+SelectedIB_ff+':'+SelectedIB_fp);
		eBaEvent('BkgPgAvail','FareSelection',rtowin+'|'+ga_dep_search+'|'+ga_arr_search+'|Bound0|'+InitialIB_ff+'|'+InitialIB_fp+'|'+SelectedIB_ff+'|'+SelectedIB_fp);
		}
		if((rtowin == 'RT') && ((parseInt(SelectedIB_fp)>parseInt(InitialIB_fp)) || (parseInt(SelectedOB_fp)>parseInt(InitialOB_fp)))){
		//eBaEvent('BkgPgAvail','FareSelection','Bound'+k+'-'+InitialIB_ff+':'+InitialIB_fp+'-'+SelectedIB_ff+':'+SelectedIB_fp);
		eBaEvent('BkgPgAvail','FareSelection',rtowin+'|'+ga_dep_search+'|'+ga_arr_search+'|Bound0|'+InitialIB_ff+'|'+InitialIB_fp+'|'+SelectedIB_ff+'|'+SelectedIB_fp+'|Bound1|'+InitialOB_ff+'|'+InitialOB_fp+'|'+SelectedOB_ff+'|'+SelectedOB_fp);
		}
}
		// aa fix
		_gaq.push(function() {
					loadedGoogleAnalytics = 1;
					console.log('GA Actualy executed!');
		});
				// aa fix

		/*****
		** call to ga.js
		******/
		(function() {
			if (typeof window._gat === "undefined") {
        //if (typeof _gat._getTrackers !== 'function'){
					var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
					ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
					if(isUsingDoubleClick){
						// If the customer want to have interest of their users, we need to use double click code.
						// It will replace the ga.src if enabled
						ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
					}
					var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
					gaClone = ga; // Cnaa fix
				//}
    	}
		})();
		// aa fix	
		if(isUsingCnFix){	
					if(gaEnvVar.wt_market == "CHINA" || ga_office_id=="BJSAA18AA"||ga_office_id=="BJSAA18AB"||ga_office_id=="BJSAA18AC"){
						setTimeout(function() {
							if (loadedGoogleAnalytics != 1) {
								gaClone.parentNode.removeChild(gaClone); 
								console.log('GA timeout fired');
							}
						}, 6000);
					// aa fix	
					}
		}
	}else{
		/*****
		** IFrame tracking
		******/
		//Transform url and utm transaction and item using -SEP- for separator
		gaURL = gaURL.replace(/&/g,"-SEP-");
			
		var transStringFinal="";
		var itemStringFinal = "";
		//code for the confirmation page revenue
		if (pageName== "CONF" && wt_flow=='revenue'){
			transStringFinal = wt_transID+","+ ga_office_id +","+ wt_ttc +","+ wt_tax +","+ wt_fee +","+ "paymentCCCity, NA, paymentCCCountry";
			itemStringFinal = wt_transID +","+ wt_sku +","+ wt_productName +","+ wt_category +","+ wt_netpax +","+ nb_pax;
			
			transStringFinal = transStringFinal.replace(/&/g,"-SEP-");
			itemStringFinal = itemStringFinal.replace(/&/g,"-SEP-");
		}
		utmparams = "";
		//Redirect cookie information if available in the page url
		var curl = document.location.toString();
		val1 = curl.lastIndexOf("__utma");
		if (val1 != "-1"){
			utmparams = curl.slice(val1,curl.length) + "&";
		}
		
		// TODO a finir en simplifiant le code (si si c'est possible!!)
		
	}
}

function setBEpage(){
// TODO : One list for each web site (at least, one for DDS (each DDS customer) and one for XHTML) with a common part because there are difference between them
  switch (gaEnvVar.pageName){
    //List of pages for DDS and new UI
    case "ADVS": gaEnvVar.BEpageName = "1-AirSearch"      ;gaEnvVar.bflown=1;break;
    case "MODS": gaEnvVar.BEpageName = "1-ModifySearch"     ;gaEnvVar.bflown=1;break;
    case "FFCR": gaEnvVar.BEpageName = "2-Calendar"       ;gaEnvVar.bflown=2;break;
      case "OCCL": gaEnvVar.BEpageName = "2-Calendar"         ;gaEnvVar.bflown=2;break; //JL
    case "FDCS": gaEnvVar.BEpageName = "2-FlexPricerCalendar-ITI";gaEnvVar.bflown=2;break;
    case "FDCSCPX": gaEnvVar.BEpageName = "2-FlexPricerCalendar-Complex" ;gaEnvVar.bflown=2;break;
    case "ITCL": gaEnvVar.BEpageName = "2-FlexPricerCalendar-ITI";gaEnvVar.bflown=2;break;
    case "FDCT": gaEnvVar.BEpageName = "2-FlexPricerCalendar-OWD";gaEnvVar.bflown=2;break;
    case "FFCC": gaEnvVar.BEpageName = "2-ComplexFlexCalendar"  ;gaEnvVar.bflown=2;break;
    case "OWDA": gaEnvVar.BEpageName = "3-Upsell-OWD"     ;gaEnvVar.bflown=3;break;
    case "OWDO": gaEnvVar.BEpageName = "3-Upsell-OWD OW"    ;gaEnvVar.bflown=3;break;
    case "OWCO": gaEnvVar.BEpageName = "3-Upsell-OWC"     ;gaEnvVar.bflown=3;break;
    case "FFPR": gaEnvVar.BEpageName = "3-Upsell"       ;gaEnvVar.bflown=3;break;
    case "FFCO": gaEnvVar.BEpageName = "3-Upsell-OW"      ;gaEnvVar.bflown=3;break; //AY
    case "ODUP": gaEnvVar.BEpageName = "3-FlexPricerUpsell-OWD" ;gaEnvVar.bflown=3;break;
    case "OCUP": gaEnvVar.BEpageName = "3-AirAvailability-OWD"  ;gaEnvVar.bflown=3;break; //JL
    case "FFPC": gaEnvVar.BEpageName = "3-ComplexFlexAvailability";gaEnvVar.bflown=3;break;
    case "SDAI": gaEnvVar.BEpageName = "3-AirAvailability-SD" ;gaEnvVar.bflown=3;break;
    case "FDFF": gaEnvVar.BEpageName = "3-AirAvailability-FPC-ITI";gaEnvVar.bflown=3;break;
    case "FDFFCPX": gaEnvVar.BEpageName = "3-AirAvailability-Complex";gaEnvVar.bflown=3;break;
    case "FPC":  gaEnvVar.BEpageName = "3-AirAvailability-FPC-OW";gaEnvVar.bflown=3;break;
    case "FPOW": gaEnvVar.BEpageName = "3-AirAvailability-FPC-OWD";gaEnvVar.bflown=3;break;
    case "AVAI": gaEnvVar.BEpageName = "3-Availability-ScheduleDriven MultiCity";gaEnvVar.bflown=3;break;
    case "FPRM": gaEnvVar.BEpageName = "3-AirAvailability-FPPremium";gaEnvVar.bflown=3;break;
    case "FARE": gaEnvVar.BEpageName = "4-Fare-Pricing"     ;gaEnvVar.bflown=4;break;
    case "ALPI": gaEnvVar.BEpageName = "5-Passenger-Info"   ;gaEnvVar.bflown=5;break;
    case "APIM": gaEnvVar.BEpageName = "5-Passenger-And-Additional-Passenger-info";gaEnvVar.bflown=5;break;
    case "APIS": gaEnvVar.BEpageName = "5b-Additional-Passenger-Info";gaEnvVar.bflown=5;break;
    case "PAXS": gaEnvVar.BEpageName = "5b-Passenger-Servicing" ;gaEnvVar.bflown=5;break;
    case "SEAT": gaEnvVar.BEpageName = "5b-SeatMap-MealSelection";gaEnvVar.bflown=5;break;
    case "FSR":  gaEnvVar.BEpageName = "5c-Additional-Services" ;gaEnvVar.bflown=5;break;
    case "DFSR": gaEnvVar.BEpageName = "5c-D-Additional-Services";gaEnvVar.bflown=5;break;
    case "AAS":  gaEnvVar.BEpageName = "5c-D-Additional-Services";gaEnvVar.bflown=5;break;
    case "PURC": gaEnvVar.BEpageName = "6-Purchase"       ;gaEnvVar.bflown=6;break;
    case "CONF": gaEnvVar.BEpageName = "7-Reservation"      ;gaEnvVar.bflown=7;break;
    case "CPNR": gaEnvVar.BEpageName = "8-Cancellation"     ;gaEnvVar.bflown=8;break;
    case "TIMS": gaEnvVar.BEpageName = "Timetable Search Page"  ;gaEnvVar.bflown=0;break;
    case "TIMR": gaEnvVar.BEpageName = "Timetable Results Page" ;gaEnvVar.bflown=0;break;
    case "TLIST": gaEnvVar.BEpageName = "Trip list"       ;gaEnvVar.bflown=0;break;
    case "GENERR": gaEnvVar.BEpageName = "BE Generric Error Page";gaEnvVar.bflown=0;break;
    case "GERR": gaEnvVar.BEpageName = "General error page"   ;gaEnvVar.bflown=0;break;
    case "MPURC": gaEnvVar.BEpageName = "6-Purchase servicing"  ;gaEnvVar.bflown=6;break;
    case "MCONF": gaEnvVar.BEpageName = "7-Reservation servicing";gaEnvVar.bflown=7;break;
    case "BKGD": gaEnvVar.BEpageName = "Booking details"    ;gaEnvVar.bflown=0;break;
    case "BKGS": gaEnvVar.BEpageName = "Booking Modifications"  ;gaEnvVar.bflown=0;break;
    case "OWRO": gaEnvVar.BEpageName = "One Way Rebooking"    ;gaEnvVar.bflown=2;break;
    case "FARR": gaEnvVar.BEpageName = "4-Fare-Rebooking"   ;gaEnvVar.bflown=2;break;
    case "PURR": gaEnvVar.BEpageName = "6-Purchase-Rebooking" ;gaEnvVar.bflown=6;break;
    case "VERI": gaEnvVar.BEpageName = "6-Purchase-Verification";gaEnvVar.bflown=6;break;
    case "COFR": gaEnvVar.BEpageName = "7-Reservation Rebooking";gaEnvVar.bflown=6;break;
    case "PNRS": gaEnvVar.BEpageName = "Passenger modification" ;gaEnvVar.bflown=1;break; //CZ
    case "COFS": gaEnvVar.BEpageName = "Servicing Confirmation" ;gaEnvVar.bflown=4;break; //CZ
    case "HTLA": gaEnvVar.BEpageName = "Hotel"          ;gaEnvVar.bflown=4;break;
    case "CARA": gaEnvVar.BEpageName = "Car"          ;gaEnvVar.bflown=4;break;
    default: gaEnvVar.BEpageName = gaEnvVar.pageName; gaEnvVar.bflown=0;
  }
}

/****
** dataLayerDate : MON AUG 11 12:00:00 GMT 2014 (example of expected format)
** Return date in string format yyyy/MM/dd
****/
function gaStringDate(dataLayerDate){
	var dateString ="";
	if (dataLayerDate){
		var ddateumt = gaDate(dataLayerDate);
		if (ddateumt != 'Invalid Date') {
			var day = ddateumt.getDate();
			var month = ddateumt.getMonth() + 1;
			var year = ddateumt.getFullYear();
			dateString = year + '/' + month + '/' + day;
		} 
	}
	return dateString;
}

/****
**	Reverse the date, in order to use any date function in the code
**  Format of date expected : DD/MM/YYYY
**  Return date with the format : YYYY/MM/DD
****/
function reverseDate(date) {
	if(date && date.length==10 && date.indexOf("/") == 2){
		date=date.substring(6)+"/"+date.substring(3,5)+"/"+date.substring(0,2);
	}
	return date;
}

/****
**	Return number of days between two object Date
****/
function days_between(date1_ms, date2_ms) {
	var ONE_DAY = 1000 * 60 * 60 * 24;
	var difference_ms = Math.abs(date1_ms - date2_ms);
	return Math.round(difference_ms/ONE_DAY);
}

/****
**	Return date in DATE object 
**	param = date string in yyyyMMdd or yyyyMMddhhmm or long date string UTC
****/
function gaDate(dataLayerDate){
	var gaObjDate="";
	if (dataLayerDate){
		if (dataLayerDate.length==12 || dataLayerDate.length==8){
			dataLayerDate=dataLayerDate.substring(0,4)+"/"+dataLayerDate.substring(4,6)+"/"+dataLayerDate.substring(6,8);
		}
		gaObjDate = new Date(dataLayerDate);
		if (gaObjDate == 'Invalid Date' || isNaN(gaObjDate.getDate())) {
			//case of IE9 or IE8
			var dateFix = dataLayerDate.replace('+','UTC+');
			dateFix = dateFix.replace('-','UTC-');
			gaObjDate= new Date(dateFix);
		}
	}
	return gaObjDate;
}
function gaDateDayMonthYear(dataLayerDate){
	var gaObjDate="";
	if (dataLayerDate){
		if (dataLayerDate.length==10){
			dataLayerDate=dataLayerDate.substring(6,10)+"/"+dataLayerDate.substring(3,5)+"/"+dataLayerDate.substring(0,2);
		}
		gaObjDate = new Date(dataLayerDate);
		if (gaObjDate == 'Invalid Date' || isNaN(gaObjDate.getDate())) {
			//case of IE9 or IE8
			var dateFix = dataLayerDate.replace('+','UTC+');
			dateFix = dateFix.replace('-','UTC-');
			gaObjDate= new Date(dateFix);
		}
	}
	return gaObjDate;
}

/****
**	Calculate the sunday rule (if the saturday night is in the journey)
**  Format date required : YYYY/MM/DD
****/
function sundayRule(sRStartDate, sREndate) {
	
	jLength = days_between(new Date(sRStartDate), new Date(sREndate));
		
	// Sunday Rule
	var dDay = gaDate(sRStartDate).getDay(); // departure day - number of the day in week 0-6
	var sunRule = '';
	if(sRStartDate){
	var rDATE = gaDate(sREndate);	
		if(jLength <7)
		{
			var diffDays = 6 - dDay; // number of days till next saturday
			//document.write("Days till saturday is" + ":" + diffDays);
			if(diffDays == 0 && jLength >0){ // if departure is saturday & return is not on same day...length of journey >=1 day.
				if((rDATE.getDay() == 6) && (jLength == 1)){ // if departure and return on same day saturday and journey time is more than 12 hours
					sunRule = 'Business';
			
				}else if((rDATE.getDay() == 0) && (rDATE.getHours() >= 4)){ // if return day is sunday and time is >= 4am.
					sunRule = 'Leisure'; //departure saturday and return sunday on/after 4am.
				}else{
					sunRule = 'Leisure'; //departure saturday & return not on same day or sunday. length of journey > 1 day.
				}
			}else if(jLength >= (diffDays + 1)){ // If Departure date is not a saturday & a saturday night stay is included in journey
				if((rDATE.getDay() == 0) && (rDATE.getHours() >= 4)){ // if return day is sunday and time is >= 4am.
					sunRule = 'Leisure';
				}else { // if return not a sunday 
					sunRule = 'Leisure';
				}
			}else{ // If a saturday night stay is NOT included in journey		
				sunRule = 'Business';			
			}
		} else{ // Journey length more >= 7 so obvious that there will be a saturday night stay
			sunRule = 'Leisure';
		} 
	}else{
		sunRule = '';
	}
	
	return sunRule;
			
// End of Sunday Rule
}

/****
**	Return the category of days for the number of days in parameter
*/
function timeCategorization(days){
var res;
	for(i=0;i<=151;i=i+30){
		j=i+30;
		if (days <= 3) {res = days +" day(s)"; break;}
		if (days > 3 && days <= 7) {res = "4 to 7 days "; break;}
		if (days > 7 && days <= 14) {res = "7 to 14 days"; break;}
		if (days > 14 && days <= 21) {res = "15 to 21 days"; break;}
		if (days > 21 && days <= 30) {res = "22 to 30 days"; break;}
		else if (days > i && days <= j) {res = (i+1) + " to " + j + " days"; break;}
	}
	if (days > 180) res = "more than 180 days";
	return res;
}

/****
**	This function avoid to have several tracking for the same PNR (if the user does not clean their cookies)
*/
function launchTracking(flowAndPnrValue){
	var ckExpiration = 60*24*365;//cookies expiration time set to one year.
	if ( Get_Cookie(flowAndPnrValue) ) {
		return false;//PNR already tracked
	}
	//if all is ok we store pnr in a cookie:
	Set_Cookie(flowAndPnrValue, '1', ckExpiration, '/', '', '');
	return true;
}

/****
**	This function create a cookie using data in parameter
*/
function Set_Cookie( name, value, expires, path, domain, secure ){
	var today = new Date();
	today.setTime( today.getTime() );
	if (expires ){
		expires = expires * 1000 * 60;//translate in ms
	}
	var expires_date = new Date( today.getTime() + (expires) );
	document.cookie = name + "=" +escape( value ) +
		( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
		( ( path ) ? ";path=" + path : "" ) +
		( ( domain ) ? ";domain=" + domain : "" ) +
		( ( secure ) ? ";secure" : "" );
}

/****
**	This function get a cookie value (the name of the cookie is the parameter)
*/
function Get_Cookie( check_name ) {
	// first we'll split this cookie up into name/value pairs
	// note: document.cookie only returns name=value, not the other components
	var a_all_cookies = document.cookie.split( ';' );
	var a_temp_cookie = '';
	var cookie_name = '';
	var cookie_value = '';
	var b_cookie_found = false; // set boolean t/f default f
	for ( i = 0; i < a_all_cookies.length; i++ ){
		// now we'll split apart each name=value pair
		a_temp_cookie = a_all_cookies[i].split( '=' );
		// and trim left/right whitespace while we're at it
		cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');
		// if the extracted name matches passed check_name
		if ( cookie_name == check_name ){
			b_cookie_found = true;
			// we need to handle case where cookie has no value but exists (no = sign, that is):
			if ( a_temp_cookie.length > 1 )	{
				cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
			}
			// note that in cases where cookie is initialized but no value, null is returned
			return cookie_value; 
			break;
		}
		a_temp_cookie = null;
		cookie_name = '';
	}
	if ( b_cookie_found ){
		return null;
	}
}

/****
**	This function delete a cookie - give a past date to the cookie = delete it
*/
function Delete_Cookie( name, path, domain ) {
	if ( Get_Cookie( name ) ) document.cookie = name + "=" +
	( ( path ) ? ";path=" + path : "") +
	( ( domain ) ? ";domain=" + domain : "" ) +
	";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

/****
**	This function for price format required by GA
**  Set pCurrency to '' for no convertion
*/
function convertFormatPrice(amount,pCurrency){
	//currencyConvertions.
	var s = "0.00";
	var i = parseFloat(amount);
	if(!isNaN(i)) { 
		if (pCurrency!=''){
			i = convert(i,pCurrency);
		}
		var minus = '';
		if(i < 0) { 
			minus = '-'; 
		}
		i = Math.abs(i); 
		i = parseInt((i + .005) * 100);
		i = i / 100; 
		s = new String(i);
		if(s.indexOf('.') < 0) {
			s += '.00'; 
		}
		if(s.indexOf('.') == (s.length - 2)) {
			s += '0'; 
		}
		s = minus + s;  
	}		
	return s;
}

/****
**	This function convert an amount in another currency
*/
function convert(pAmount,pCurrency){
	var newAmount = pAmount;
	wt_finalCurrency = pCurrency;
	
	//if(typeof currMultConv !== "undefined" && 
	//	currMultConv[eBACustomer.compcur] != undefined && 
	//	currMultConv[eBACustomer.compcur][pCurrency] != undefined &&
	//	currMultConv[eBACustomer.compcur][pCurrency] != null){
	//	
	//	newAmount = pAmount * currMultConv[eBACustomer.compcur][pCurrency];
	//	wt_finalCurrency = eBACustomer.compcur;
	//}else{
	if (currFinalConv[pCurrency]!=undefined && currFinalConv[pCurrency]!=null){
				// If the currMultConv is not available, we use the array defined in the account file
				newAmount = pAmount * currFinalConv[pCurrency];
				wt_finalCurrency = currBase; //eBACustomer.compcur; 
	}
	//}
	
	return newAmount;				
}

// Function called by popin for track page views
function eBaPvPopin(popinCode){

	gaEnvVar.pageName = gaEnvVar.pageName || "";
	gaEnvVar.pageName = popinCode;
	
	setBEpage();
	
	// Call the main function
	airBookingTracking(eBACustomer);
}



/*Cross-browser version to Add an event*/
function addEvent( obj, type, fn ) {
	  if ( obj.attachEvent ) {
	    //obj['e'+type+fn] = fn;
	    //obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
	    obj.attachEvent( 'on'+type, fn );
	  } else
	    obj.addEventListener( type, fn, false );
}
/*Detect IE8*/
if(document.all && typeof document.addEventListener == "undefined"){
	addEvent(document, "readystatechange", launchGlobalTracking);
	
}
else{
	launchGlobalTracking();
}