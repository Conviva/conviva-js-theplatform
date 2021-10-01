/*! (C) 2020 Conviva, Inc. All rights reserved. Confidential and proprietary. */
"use strict";function ConvivaPDKPlugin(){return{initialize:function(a){this.convivaIntegration||(this.convivaIntegration=new ConvivaPdkIntegration(a))}}}if($pdk){var controller=$pdk.controller
;controller&&"function"==typeof controller.plugInLoaded&&controller.plugInLoaded(ConvivaPDKPlugin())}var thePlatformPlugin={};thePlatformPlugin.version="4.0.3";var ConvivaPdkIntegration=function(a){
var b=this;this._customData=a.vars,this._customData.enableAdExperience&&"true"===this._customData.enableAdExperience?this._isAdExperienceEnabled=!0:this._isAdExperienceEnabled=!1,
window.videoController=a.controller;var b=this;this._videoAnalytics=null,this._adAnalytics=null,this._width=-1,this._height=-1,this._playerState=Conviva.Constants.PlayerState.UNKNOWN,this.podIndex=1,
this.podStartSent=!1,this.isAd=!1,this.playBackRequested=!1,this.adPlayBackRequested=!1,this.convivaCustomEvent="OnConvivaCustomEvent",this._videoController=a.controller,this._eventListeners=[],
this._scopes=this._videoController.scopes,this._initConvivaClient=function(){if(void 0===this._customData.customerId)return void b._log("CUSTOMER_KEY is not present in the plugin configuration!")
;this.TEST_CUSTOMER_KEY=this._customData.customerId;var c={}
;this._customData.gatewayUrl?c[Conviva.Constants.GATEWAY_URL]=this._customData.gatewayUrl:b._log("gatewayUrl is not present in the plugin configuration");var d=a.vars.toggleTraces
;void 0!==d&&"true"===d&&(c[Conviva.Constants.LOG_LEVEL]=Conviva.Constants.LogLevel.DEBUG),Conviva.Analytics.init(this.TEST_CUSTOMER_KEY,null,c),
Conviva.Analytics.setDeviceMetadata(this.getDeviceMetadata())},this.parseConvivaTags=function(){this.parseParametersArray(this.convivaPlayerTags,"playerTag.")},this.parseParametersArray=function(a,b){
for(var c in this._customData){var d=c.match("^"+b+"(.*)");d&&""!=d[1]&&(a[d[1]]=this._customData[c])}},this.setPlayerNameTags=function(a,b){var c=null;b&&b.releaseURL&&(c=b.releaseURL)
;var d=this.fetchPlayerName(c);d&&(a["ext.thePlatform.player"]||(a["ext.thePlatform.player"]=d))},this.fetchPlayerName=function(a){if(this._playerName)return this._playerName;if(a){
var b=this.getParameterValueFromUrl(a,"player",!0);if(b)return this._playerName=b,this._playerName}return null},this.getParameterValueFromUrl=function(a,b,c){if(a&&b){
var d=a.split("#")[0].split("?")[1];if(d){var e=d.split("&");for(var f in e){var g=e[f],h=g.split("="),i=h[0],j=h[1];if(i==b&&j)return c&&(j=decodeURIComponent(j)),j}}}return null},
this.buildConvivaContentInfoFromClip=function(a,c){var d;d=a&&a.title?a.title:c.title;var e="assetName",f=this.convivaPlayerTags?this.convivaPlayerTags:{};if(this.setPlayerNameTags(f,c),
null!=c.customData){var g=[];if("function"==typeof c.customData.keys)g=c.customData.keys();else for(var h in c.customData)Object.prototype.hasOwnProperty.call(c.customData,h)&&g.push(h)
;if(this._log("buildConvivaContentInfoFromClip | customKeys: "+g.join(",")),this._customData.hasOwnProperty("metadataKeys")&&null!=c.customData){var i=this._customData.metadataKeys.split(",")
;for(var j in i){var k=c.customData[i[j]];k&&(f[i[j]]=k)}}}a.hasOwnProperty("id")&&(f["tp.clip.id"]=a.id,f["ext.thePlatform.id"]=a.id),
a.hasOwnProperty("contentID")&&(f["tp.clip.contentID"]=a.contentID,f["ext.thePlatform.contentID"]=a.contentID),a.hasOwnProperty("guid")&&(f["tp.clip.guid"]=a.guid,f["ext.thePlatform.guid"]=a.guid)
;try{if(a&&a.categories){var l=a.categories;for(var m in l){var n=l[m];if(n.name){f[["ext.thePlatform.categories","[",m,"]"].join("")]=n.name}}}}catch(r){}if(this._customData.assetName){
if(e=this._customData.assetName,
e=e.split("{id}").join(f["ext.thePlatform.id"]).split("{guid}").join(f["ext.thePlatform.guid"]).split("{contentID}").join(f["ext.thePlatform.contentID"]).split("{title}").join(d),
-1!=e.lastIndexOf("{metadataKeys."))for(var o in f)e=e.split("{metadataKeys."+o+"}").join(f[o])}else e="["+(a.contentID?a.contentID:"noID")+"] "+(d||"noTitle");var p={}
;p[Conviva.Constants.ASSET_NAME]=e,
void 0!==b._customData.playerName?p[Conviva.Constants.PLAYER_NAME]=b._customData.playerName:void 0!==f["ext.thePlatform.player"]&&(p[Conviva.Constants.PLAYER_NAME]=f["ext.thePlatform.player"]),
void 0!==b._customData.viewerId&&(p[Conviva.Constants.VIEWER_ID]=b._customData.viewerId),p[Conviva.Constants.DURATION]=c.release.length/1e3,
void 0!==this._customData.defaultResource&&(p[Conviva.Constants.DEFAULT_RESOURCE]=this._customData.defaultResource),
!0===a.isLive?p[Conviva.Constants.IS_LIVE]=Conviva.Constants.StreamType.LIVE:p[Conviva.Constants.IS_LIVE]=Conviva.Constants.StreamType.VOD,p[Conviva.Constants.MODULE_NAME]="thePlatform",
p[Conviva.Constants.MODULE_VERSION]=thePlatformPlugin.version,a.URL?p[Conviva.Constants.STREAM_URL]=a.URL:a.url&&(p[Conviva.Constants.STREAM_URL]=a.url);for(var q in f)p[q]=f[q];return p},
this.getDeviceMetadata=function(){var a={};return a[Conviva.Constants.DeviceMetadata.CATEGORY]=Conviva.Constants.DeviceCategory.WEB,a},this._addEventListener=function(a,c){
b._eventListeners.push([a,c]),b._videoController.addEventListener(a,c)},this._stopMonitoringAd=function(){this.podStartSent&&(b._videoAnalytics.reportAdBreakEnded(),this.podIndex++,
this.podPosition=null,this.podStartSent=!1)},this._removeEventListener=function(a,c,d){b._videoController.removeEventListener(a,c)},this._registerVideoEventListeners=function(){
b._addEventListener("OnReleaseStart",function(a){var c=a.data.clips,d=null;for(var e in c)if(0==c[e].isAd){d=c[e];break}var f=b.buildConvivaContentInfoFromClip(d,a.data),g={}
;g[Conviva.Constants.FRAMEWORK_NAME]="thePlatformPlayer",g[Conviva.Constants.FRAMEWORK_VERSION]=$pdk.version.major+"."+$pdk.version.minor+"."+$pdk.version.revision,
null==b._videoAnalytics&&(b._videoAnalytics=Conviva.Analytics.buildVideoAnalytics(),window.convivaVideoAnalytics=b._videoAnalytics),b._videoAnalytics.setPlayerInfo(g),
b._videoAnalytics.setContentInfo(f),b._videoAnalytics.reportPlaybackRequested(),b.playBackRequested=!0}),b._addEventListener("OnMediaEnd",function(a){
a.data.isAd&&b._isAdExperienceEnabled&&b._adAnalytics.reportAdEnded()}),b._addEventListener("OnMediaLoadStart",function(a){var c=a.data;if(c.isAd&&b._isAdExperienceEnabled){var d={}
;c.URL?d[Conviva.Constants.STREAM_URL]=c.URL:c.url&&(d[Conviva.Constants.STREAM_URL]=c.url),d[Conviva.Constants.IS_LIVE]=Conviva.Constants.StreamType.VOD;var e,f=c.adType
;e="preroll"===f?"Pre-roll":"postroll"===f?"Post-roll":"Mid-roll",d["c3.ad.system"]="NA",c.sequence?d["c3.ad.sequence"]=""+c.sequence:d["c3.ad.sequence"]=""+(c.index+1),
"application/javascript"===c.type?(d["c3.ad.mediaFileApiFramework"]="VPAID",d["c3.ad.technology"]="Client Side"):(d["c3.ad.mediaFileApiFramework"]="NA",d["c3.ad.technology"]="Client Side"),
d["c3.ad.position"]=e,c.creativeId&&(d["c3.ad.creativeId"]=""+c.creativeId),null==b._adAnalytics&&(b._adAnalytics=Conviva.Analytics.buildAdAnalytics(b._videoAnalytics)),
d[Conviva.Constants.MODULE_NAME]="thePlatform",d[Conviva.Constants.MODULE_VERSION]=thePlatformPlugin.version;var g={};g[Conviva.Constants.FRAMEWORK_NAME]="thePlatformPlayer",
g[Conviva.Constants.FRAMEWORK_VERSION]=$pdk.version.major+"."+$pdk.version.minor+"."+$pdk.version.revision,b._adAnalytics.setAdPlayerInfo(g),b._adAnalytics.setAdInfo(d)}
0==c.index&&b._updateConvivaPlayerState(Conviva.Constants.PlayerState.BUFFERING)}),b._addEventListener("OnMediaStart",function(a){var c=a.data;if(b.isAd=c.isAd,b.isAd){if(!b.podStartSent){
var d=c.adType;b.podPosition="preroll"===d?"Pre-roll":"postroll"===d?"Post-roll":"Mid-roll";var e={};e[Conviva.Constants.POD_POSITION]=b.podPosition,e[Conviva.Constants.POD_DURATION]=0,
e[Conviva.Constants.POD_INDEX]=b.podIndex,b._videoAnalytics.reportAdBreakStarted(Conviva.Constants.AdType.CLIENT_SIDE,Conviva.Constants.AdPlayer.CONTENT,e),b.podStartSent=!0}
if(b._isAdExperienceEnabled){var f={};f[Conviva.Constants.ASSET_NAME]=c.title,c.URL?f[Conviva.Constants.STREAM_URL]=c.URL:c.url&&(f[Conviva.Constants.STREAM_URL]=c.url),
f[Conviva.Constants.DURATION]=c.mediaLength/1e3;var g,h,i;if(c.contentCustomData&&c.contentCustomData["vast:wrapperAdIds"]&&0!==c.contentCustomData["vast:wrapperAdIds"].length){
var j=c.contentCustomData["vast:wrapperAdIds"].length;g="NA",h=c.contentCustomData["vast:wrapperAdIds"][j-1],i=c.contentCustomData["vast:wrapperCreativeIds"][j-1]
}else if(c.customData&&c.customData["vast:wrapperAdIds"]&&0!==c.customData["vast:wrapperAdIds"].length){var j=c.customData["vast:wrapperAdIds"].length;g="NA",h=c.customData["vast:wrapperAdIds"][j-1],
i=c.customData["vast:wrapperCreativeIds"][j-1]}else g="NA",h=c.guid,i="NA";f["c3.ad.id"]=""+c.guid;var k=c.contentCustomData||c.customData
;if(k)for(var l in k)l.includes("advertiser_name")&&(f["c3.ad.advertiser"]=k[l]),l.includes("industry")&&(f["c3.ad.advertiserCategory"]=k[l]);f["c3.ad.firstAdSystem"]=""+g,f["c3.ad.firstAdId"]=""+h,
f["c3.ad.firstCreativeId"]=""+i,(c.contentCustomData&&c.contentCustomData.dayPart||c.customData&&c.customData.dayPart)&&(f["c3.ad.dayPart"]=c.contentCustomData.dayPart||c.customData.dayPart),
(c.contentCustomData&&c.contentCustomData.externalAdvertiserId||c.customData&&c.customData.externalAdvertiserId)&&(f["c3.ad.advertiserId"]=c.contentCustomData.externalAdvertiserId||c.customData.externalAdvertiserId),
b._adAnalytics.reportAdStarted(f),window.convivaAdAnalytics=b._adAnalytics,b.adPlayBackRequested=!0,b._setAdProperties(a.data)}}else b._stopMonitoringAd(),b._setVideoProperties(a.data)
;b._updateConvivaPlayerState(Conviva.Constants.PlayerState.PLAYING)}),b._addEventListener("OnMediaPause",function(a){b._updateConvivaPlayerState(Conviva.Constants.PlayerState.PAUSED)}),
b._addEventListener("OnMediaPlaying",function(a){
b.isAd?b._isAdExperienceEnabled&&b._adAnalytics.reportAdMetric(Conviva.Constants.Playback.PLAY_HEAD_TIME,a.data.currentTime,"CONVIVA"):b._videoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.PLAY_HEAD_TIME,a.data.currentTimeAggregate,"CONVIVA"),
b._updateConvivaPlayerState(Conviva.Constants.PlayerState.PLAYING)}),b._addEventListener("OnMediaBufferStart",function(a){b._updateConvivaPlayerState(Conviva.Constants.PlayerState.BUFFERING)}),
b._addEventListener("OnMediaError",function(a){
var c=a.data,d=(""!==c.message?"Error Message["+c.message+"]":"")+(""!==c.friendlyMessage?" Friendly Message["+c.friendlyMessage+"]":"")+(""!==c.code?" Error Code["+c.code+"]":"")
;c.clip.isAd?b._isAdExperienceEnabled&&(null==b._adAnalytics&&(b._adAnalytics=Conviva.Analytics.buildAdAnalytics()),
b._adAnalytics.reportAdFailed(d)):(null==b._videoAnalytics&&(b._videoAnalytics=Conviva.Analytics.buildVideoAnalytics()),b._videoAnalytics.reportPlaybackFailed(d))}),
b._addEventListener("OnRenditionSwitched",function(a){var c=a.data,d=c.newRendition;b.isAd?b._isAdExperienceEnabled&&b._setAdProperties(d):b._setVideoProperties(d)}),
b._addEventListener("OnMediaSeekStart",function(a){$pdk.version.major>=6&&(b.isAd||b._videoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.SEEK_STARTED,"CONVIVA"))}),
b._addEventListener("OnMediaSeek",function(a){$pdk.version.major<6&&(b.isAd||b._videoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.SEEK_STARTED,"CONVIVA"))}),
b._addEventListener("OnMediaSeekComplete",function(a){b.isAd||b._videoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.SEEK_ENDED,"CONVIVA")}),b._addEventListener("OnReleaseEnd",function(a){
void 0!==b._videoAnalytics&&null!==b._videoAnalytics&&(b._stopMonitoringAd(),b._videoAnalytics.reportPlaybackEnded(),b._updateConvivaPlayerState(Conviva.Constants.PlayerState.STOPPED),
b.playBackRequested=!1,b.podIndex=1,b._videoAnalytics.release(),b._videoAnalytics=null,window.convivaVideoAnalytics=null),null!==b._adAnalytics&&(b._adAnalytics.release(),b._adAnalytics=null)}),
b._addEventListener("OnReleaseError",function(a){b._stopMonitoringAd()
;var c=a.data,d=(""!==c.message?"Error Message["+c.message+"]":"")+(""!==c.friendlyMessage?" Friendly Message["+c.friendlyMessage+"]":"")+(""!==c.code?" Error Code["+c.code+"]":"")
;null==b._videoAnalytics&&(b._videoAnalytics=Conviva.Analytics.buildVideoAnalytics()),b._videoAnalytics.reportPlaybackFailed(d),b.podIndex=1,b._videoAnalytics.release(),b._cleanup(),
b._videoAnalytics=null,window.convivaVideoAnalytics=null,null!==b._adAnalytics&&(b._adAnalytics.release(),b._adAnalytics=null)}),b._addEventListener("OnPlayerDestroyed",function(a){
console.log("OnPlayerDestroyed",a),void 0!==b._videoAnalytics&&null!==b._videoAnalytics&&(b._videoAnalytics.release(),b._videoAnalytics=null,window.convivaVideoAnalytics=null),
null!==b._adAnalytics&&(b._adAnalytics.release(),b._adAnalytics=null),Conviva.Analytics.release()}),b._addEventListener("OnReleaseSelected",function(a){}),
b._addEventListener("OnReleaseRequested",function(a){}),b._addEventListener("OnMediaTime",function(a){}),b._addEventListener("OnMediaLoading",function(a){}),
b._addEventListener("OnMediaUnpause",function(a){}),b._addEventListener("OnMediaSeek",function(a){}),b._addEventListener(this.convivaCustomEvent,b.onConvivaCustomEvent)},
this._setVideoProperties=function(a){if(a){var c=a.height,d=a.width,e=a.bitrate
;(!isNaN(d)&&d>0||!isNaN(c)&&c>0)&&b._videoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.RESOLUTION,d,c,"CONVIVA"),
!isNaN(e)&&e>0&&b._videoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.BITRATE,e/1e3,"CONVIVA")}},this._setAdProperties=function(a){if(a){var c=a.height,d=a.width,e=a.bitrate
;(!isNaN(d)&&d>0||!isNaN(c)&&c>0)&&b._adAnalytics.reportAdMetric(Conviva.Constants.Playback.RESOLUTION,d,c,"CONVIVA"),
!isNaN(e)&&e>0&&b._adAnalytics.reportAdMetric(Conviva.Constants.Playback.BITRATE,e/1e3,"CONVIVA")}},this._removeVideoEventHandlers=function(){for(var a=0;a<b._eventListeners.length;a++){
var c=b._eventListeners[a];b._removeEventListener(c[0],c[1])}b._eventListeners=[]},this._updateConvivaPlayerState=function(a){b._playerState=a,
b.isAd?b._isAdExperienceEnabled&&b._adAnalytics.reportAdMetric(Conviva.Constants.Playback.PLAYER_STATE,b._playerState,"CONVIVA"):b._videoAnalytics.reportPlaybackMetric(Conviva.Constants.Playback.PLAYER_STATE,b._playerState,"CONVIVA")
},this._log=function(a){(new Conviva.Impl.Html5Logging).consoleLog(a,Conviva.SystemSettings.LogLevel.DEBUG)},this._cleanup=function(){b._log("thePlatformPlugin.cleanup()"),
b._removeVideoEventHandlers()},this.onConvivaCustomEvent=function(a){var c=a.data.name,d=a.data.attributes
;c&&""!=c?Conviva.Analytics.reportAppEvent(c,d):b._log("onConvivaCustomEvent | invalid eventName")},this._initConvivaClient(),this.parseConvivaTags(),this._registerVideoEventListeners()};