"use strict";function eBaEvent(category,action,opt_label,opt_value,opt_noninteraction){var trackers,i,tracker={ga:void 0,ua:void 0};category=String(category),action=String(action),void 0!==opt_label&&(opt_label=String(opt_label)),void 0!==opt_value&&(opt_value=parseInt(opt_value)),void 0!==opt_noninteraction&&!0!==opt_noninteraction&&!1!==opt_noninteraction&&(opt_noninteraction=void 0);var _gat=window._gat||{};if(void 0!==_gat&&"function"==typeof _gat._getTrackers)for(i=(trackers=_gat._getTrackers()).length-1;i>=0;i--)trackers[i]._getAccount(),tracker.ga=trackers[i],trackers[i]._trackEvent(category,action,opt_label,opt_value,opt_noninteraction);var ga=window[window.GoogleAnalyticsObject];if(void 0!==ga&&"function"==typeof ga.getAll)for(i=(trackers=ga.getAll()).length-1;i>=0;i--)trackers[i].get("trackingId"),tracker.ua=trackers[i],tracker.ua.send("event",category,action,opt_label,opt_value,{nonInteraction:opt_noninteraction,transport:"beacon"})}