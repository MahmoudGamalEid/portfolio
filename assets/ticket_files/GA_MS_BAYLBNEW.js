/*********
Configuration File for:
Egypt Air - BAYLBNEW - DX web site
*********/
//Customer parameters
try{	
var  eBACustomer = {
	version : "BetelNut_DX_1.3",
	ga : ["UA-5079893-1"], // Prod
	company : "Egypt Air",
	compcur: "EUR",
	gaDomain :".egyptair.com",
	setAllowLinker : true,
	trackURL : "",
	env:'production',
	tool:'GA',
	siteSpeedSampleRate:50,
	homeDomain:["egyptair.com"],
	//sameUrlUsed : true, // If the same URL is used for all the website (BE pages and portal pages)
	modules: {'car':'',//set it to '' to desactivate carTracking
	'hotel':'',//set it to '' to desactivate hotelTracking
	'errorManage': false,//set it to true to use error manage code (example on AA code)
	'fuelCharge': false,
	'doubleClick': false,
	'gaABTesting': ''} // only one account for ABTesting
};

//Site Acceptance parameters override 
var gaAccountSA =["UA-4413832-2"];
var versionSA = "BetelNut_DX_1.3";
var useDebugCDN = false;//set it to true for debug phase on site acceptance
var gaDomainSA = '.amadeus.com';

if(document.domain.match('wav.eu1.amadeus.com') || document.domain.match('pcm.uat01.amadeus.com')){
	gaDomainSA = '.amadeus.com';
} else if(document.domain.match('amadeus.net')){
	gaDomainSA = '.amadeus.net';
} 
//CDN configuration
var hostCDN = 'http://digital-analytics.amadeus.com';
var hostCDNssl = 'https://digital-analytics.amadeus.com';
var dirCDN = '/fastTrack/common';
var dirLib = '/fastTrack/lib';
var dirCDNEvent = dirCDN+'/event/';

if (document.domain.match('siteacceptance') || document.domain.match('amadeus.net') || document.domain.match('wav.eu1.amadeus.com') || document.domain.match('pcm.uat01.amadeus.com')){
	eBACustomer.env ='SA';
	eBACustomer.ga=gaAccountSA;
	eBACustomer.version = versionSA;
	eBACustomer.gaDomain = gaDomainSA;
	dirCDN =dirCDN+'SA';
	dirCDNEvent = dirCDN+'/event/';
	if (useDebugCDN){//not working outside 1A
		hostCDN='http://nceetvsta06.etv.nce.amadeus.net';
		hostCDNssl='https://nceetvsta06.etv.nce.amadeus.net';
	}
}

//call to event code
(function() {
	var gaCM = document.createElement('script'); gaCM.type = 'text/javascript';
	gaCM.src =('https:'==document.location.protocol?hostCDNssl: hostCDN)+dirCDNEvent+'/eBaEvent.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gaCM, s);
  })();

//call to currency converter code
(function() {
	var gaCM = document.createElement('script'); gaCM.type = 'text/javascript';
	gaCM.src =('https:'==document.location.protocol?hostCDNssl: hostCDN)+dirLib+'/currConv.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gaCM, s);
  })();
  
//call to common code
(function() {
	var gaCM = document.createElement('script'); gaCM.type = 'text/javascript';
	gaCM.src =('https:'==document.location.protocol?hostCDNssl: hostCDN)+dirCDN+'/'+eBACustomer.version+'.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gaCM, s);
  })();

}catch(err){
//avoid any break of BE
}