/**
 * @class
 * Library of temporary code.
 *
 * @author: 1A xHTML Implementation team
 *
 * @version
 *  <li>2015-07-02: RF: addIgnoreChangeButton (1.0)</li>
 *  <li>2015-11-13: RF: check if the ignore change button is already present or not(1.1)</li>
 *  <li>2015-12-29: RF: add refund stop method (PCP 189 / 76) (1.2)</li>
 *  <li>2016-01-19: RF: Review the atcRefundStop method (1.3)</li>
 *  <li>2016-03-24: DB: Put back addError in atcRefundStop method (1.4)</li>
 *  <li>2016-03-30: DB: update path in customStyleAtcRefundStop (1.5)</li>
 *  <li>2016-04-11: RF: Remove the addIgnoreChangeButton method (2.0)</li>
 *  <li>2016-04-28: DB: update again path in customStyleAtcRefundStop (2.1)</li>
 *  <li>2016-07-12: DB: update again path in customStyleAtcRefundStop (2.1)</li>
 *
 */
function IMPLibDxTemp() {
	var self = this;

	/**
	 * Version of the library: 2.0<br />
     * Require Core >= 1.9
	 */
	this.VERSION = "2.1.EDG";





    /**
     * REQUIRE: core >= 1.9
     *
     *  To be removed after
     *  <li>PCP - 189 : ALLOW_REFUND_STOP in ATC flow</li>
     *  <li>YY-ECO-B2C-PCP-76 ATC for non-netting sites</li>
     *  To be reviewed end of Q1-2016
     *
     *  The method permits to stop the rebooking flow in case of refund during the ATC shopper flow.
     *  This is normally handled by the parameter ALLOW_REFUND_STOP but this feature will be implemented with PCP 76
     *
     *  @example
     *
     *  var NotEligibleToRefundMessages = {
     *       "GB": "This selected fare doesn't match your purchase conditions. Please choose a different fare type.",
     *       "AR": "&#1610;&#1585;&#1580;&#1609; &#1575;&#1582;&#1578;&#1610;&#1575;&#1585; &#1601;&#1574;&#1577; &#1571;&#1582;&#1585;&#1609; &#1605;&#1606; &#1601;&#1574;&#1575;&#1578; &#1575;&#1604;&#1571;&#1587;&#1593;&#1575;&#1585; (157009)",
     *       "FR": "Le tarif s&eacute;lectionn&eacute; ne correspond pas &agrave; vos conditions d&apos;achat. Veuillez choisir un type de tarif diff&eacute;rent.",
     *       "ES": "La tarifa seleccionada no coincide con sus condiciones de compra. Por favor, seleccione un tipo de tarifa diferente.",
     *       "IT": "La tariffa selezionata non corrisponde alle vostre condizioni di acquisto. Siete pregati di scegliere una tariffa di tipo diverso",
     *       "DE": "Der ausgew&auml;hlte Tarif nicht entsprechen Ihren Einkaufskonditionen. Bitte w&auml;hle eine ",
     *       "CN": "&#25152;&#36873;&#36153;&#29992;&#19982;&#24744;&#30340;&#36141;&#20080;&#26465;&#20214;&#19981;&#31526;&#12290;&#35831;&#36873;&#25321;&#20854;&#23427;&#36153;&#29992;&#31867;&#22411;&#12290; (157009)"
     *  };
     *  implibdx.temp.atcRefundStop(NotEligibleToRefundMessages);
     *
     */
    this.atcRefundStop = function(NotEligibleToRefundMessages) {

        if (implibdx.core.getPage().match(/rfare/gi)) {		
		
            var pageData = implibdx.core.getPageData();
            if (pageData.business.Price &&
                pageData.business.Price.totalRefund &&
                pageData.business.Price.totalRefund.amount &&
                pageData.business.Price.totalRefund.amount > 0) {

				// Debug Mode Refund
				plnextv2.utils.requestManager.PlnextRequestManager.sendJSON({
                    url : "AffinityKeepAliveSession.action",
                    method : "POST",
                    data: {
                        implibdx : JSON.stringify(implibdx.core.getDeployedLibs()),
                        amount : pageData.business.Price.totalRefund.amount
                    }
                });


                plnextv2.utils.ImplementationUtils.addError("", implibdx.core.i18n(NotEligibleToRefundMessages), "E");

                jQuery(document.body).append("<style id = 'customStyleAtcRefundStop'>.tripsummary-section-btn .tripsummary-btn-validate{display:none}</style>");
            }else {
				if (pageData) {
					if (pageData.business) {
						if (pageData.business.Price) {
							
							var totalCollectBalance="N/A";
							var totalRefund="N/A";
							var collectBalance="N/A";
							var nonRefundable="N/A";
							var oldPrice="N/A";
							var rebookingFees="N/A";
							var rebookingTotal="N/A";
							var totalAirlineCharges="N/A";
							var totalAirlineChargesPerPax="N/A";
							var totalAmount="N/A";
							var totalAmountPerPax="N/A";
							var totalFeesPerPax="N/A";
							var totalMilesPerPax="N/A";
							var totalOtherTaxes="N/A";
							var totalOtherTaxesPerPax="N/A";
							var totalTaxes="N/A";
							var totalTaxesPerPax="N/A";
							
							if (pageData.business.Price.totalCollectBalance) { totalCollectBalance= pageData.business.Price.totalCollectBalance.amount;}
							if (pageData.business.Price.totalRefund) { totalRefund= pageData.business.Price.totalRefund.amount;}
							if (pageData.business.Price.collectBalance) { collectBalance= pageData.business.Price.collectBalance.amount;}
							if (pageData.business.Price.nonRefundable) { nonRefundable= pageData.business.Price.nonRefundable.amount;}
							if (pageData.business.Price.oldPrice) { oldPrice= pageData.business.Price.oldPrice.amount;}
							if (pageData.business.Price.rebookingFees) { rebookingFees= pageData.business.Price.rebookingFees.amount;}
							if (pageData.business.Price.rebookingTotal) { rebookingTotal= pageData.business.Price.rebookingTotal.amount;}
							if (pageData.business.Price.totalAirlineCharges) { totalAirlineCharges= pageData.business.Price.totalAirlineCharges.amount;}
							if (pageData.business.Price.totalAirlineChargesPerPax) { totalAirlineChargesPerPax= pageData.business.Price.totalAirlineChargesPerPax.amount;}
							if (pageData.business.Price.totalAmount) { totalAmount= pageData.business.Price.totalAmount.amount;}
							if (pageData.business.Price.totalAmountPerPax) { totalAmountPerPax= pageData.business.Price.totalAmountPerPax.amount;}
							if (pageData.business.Price.totalFeesPerPax) { totalFeesPerPax= pageData.business.Price.totalFeesPerPax.amount;}
							if (pageData.business.Price.totalMilesPerPax) { totalMilesPerPax= pageData.business.Price.totalMilesPerPax.amount;}
							if (pageData.business.Price.totalOtherTaxes) { totalOtherTaxes= pageData.business.Price.totalOtherTaxes.amount;}
							if (pageData.business.Price.totalOtherTaxesPerPax) { totalOtherTaxesPerPax= pageData.business.Price.totalOtherTaxesPerPax.amount;}
							if (pageData.business.Price.totalTaxes) { totalTaxes= pageData.business.Price.totalTaxes.amount;}
							if (pageData.business.Price.totalTaxesPerPax) { totalTaxesPerPax= pageData.business.Price.totalTaxesPerPax.amount;}
																		
							if (pageData.business.Price.totalRefund) {
								// Debug Mode Refund
								plnextv2.utils.requestManager.PlnextRequestManager.sendJSON({
									url : "AffinityKeepAliveSession.action",
									method : "POST",
									data: {
										implibdx : JSON.stringify(implibdx.core.getDeployedLibs()),
										totalRefund : totalRefund,
										totalCollectBalance : totalCollectBalance,
										nonRefundable:nonRefundable,
										oldPrice:oldPrice,
										rebookingFees:rebookingFees,
										rebookingTotal:rebookingTotal,
										totalAirlineCharges:totalAirlineCharges,
										totalAirlineChargesPerPax:totalAirlineChargesPerPax,
										totalAmount:totalAmount,
										totalAmountPerPax:totalAmountPerPax,
										totalFeesPerPax:totalFeesPerPax,
										totalMilesPerPax: totalMilesPerPax,
										totalOtherTaxes:totalOtherTaxes,
										totalOtherTaxesPerPax:totalOtherTaxesPerPax,
										totalTaxes:totalTaxes,
										totalTaxesPerPax:totalTaxesPerPax
									}
								});
							}else{
								// Debug Mode Refund
								plnextv2.utils.requestManager.PlnextRequestManager.sendJSON({
									url : "AffinityKeepAliveSession.action",
									method : "POST",
									data: {
										implibdx : JSON.stringify(implibdx.core.getDeployedLibs()),
										totalRefund : totalRefund,
										totalCollectBalance : totalCollectBalance,
										nonRefundable:nonRefundable,
										oldPrice:oldPrice,
										rebookingFees:rebookingFees,
										rebookingTotal:rebookingTotal,
										totalAirlineCharges:totalAirlineCharges,
										totalAirlineChargesPerPax:totalAirlineChargesPerPax,
										totalAmount:totalAmount,
										totalAmountPerPax:totalAmountPerPax,
										totalFeesPerPax:totalFeesPerPax,
										totalMilesPerPax: totalMilesPerPax,
										totalOtherTaxes:totalOtherTaxes,
										totalOtherTaxesPerPax:totalOtherTaxesPerPax,
										totalTaxes:totalTaxes,
										totalTaxesPerPax:totalTaxesPerPax
									}
								});
							}
						}else{
							// Debug Mode Refund
							plnextv2.utils.requestManager.PlnextRequestManager.sendJSON({
								url : "AffinityKeepAliveSession.action",
								method : "POST",
								data: {
									implibdx : JSON.stringify(implibdx.core.getDeployedLibs()),
									amount : "no amount Business",
								}
							});
						}
					}else{
						// Debug Mode Refund
						plnextv2.utils.requestManager.PlnextRequestManager.sendJSON({
							url : "AffinityKeepAliveSession.action",
							method : "POST",
							data: {
								implibdx : JSON.stringify(implibdx.core.getDeployedLibs()),
								amount : "no amount PageData",
							}
						});
					}
				}else{
					// Debug Mode Refund
					plnextv2.utils.requestManager.PlnextRequestManager.sendJSON({
						url : "AffinityKeepAliveSession.action",
						method : "POST",
						data: {
							implibdx : JSON.stringify(implibdx.core.getDeployedLibs()),
							amount : "no PageData",
						}
					});
				}
			}
        }

    };

};




// Instantiate the object to access the class properties
var implibdx = implibdx || {};
implibdx.temp = new IMPLibDxTemp();