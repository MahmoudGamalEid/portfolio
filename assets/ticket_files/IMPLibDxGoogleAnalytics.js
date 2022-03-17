jQuery(document).on("plnext:customData:ready", initiateTracking);

/*(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-5079893-1', 'auto');
ga('send', 'pageview');
*/


function initiateTracking() {

WB_page = document.body.id.toUpperCase();
    if (implibdx.core.getPage().match('conf')) //if ( WB_page == "CONF")
    {
    var google_conversion_id = 1042148602;
var google_conversion_language = "en";
var google_conversion_format = "3";
var google_conversion_color = "666666";
var google_conversion_label = "htE0CMjS-gEQ-tn38AM";
var google_conversion_value = eBaDataLayer.total_price ;
var google_conversion_currency = "USD";
var google_remarketing_only = false;

var scriptTag = document.createElement('script');
scriptTag.setAttribute('src','https://www.googleadservices.com/pagead/conversion.js');
document.body.appendChild(scriptTag );
  
  /*var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-5079893-1']);
  _gaq.push(['_trackPageview']);
_gaq.push(['_addTrans',
   '1042148602',           // transaction ID - required
   eBaDataLayer.office_id, // affiliation or store name
   eBaDataLayer.total_price,          // total - required
   eBaDataLayer.tax_amount,           // tax
   '',          // shipping
   '',       // city
   '',     // state or province
   ''             // country
]);
_gaq.push(['_addItem',
   '1234',           // transaction ID - necessary to associate item with transaction
   eBaDataLayer.city_search_out,           // SKU/code - required
   '',        // product name
   '',   // category or variation
   eBaDataLayer.total_price ,          // unit price - required
   eBaDataLayer.nb_trav               // quantity - required
]);



   _gaq.push(['_trackTrans']); //submits transaction to the Analytics servers

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();*/


}
};