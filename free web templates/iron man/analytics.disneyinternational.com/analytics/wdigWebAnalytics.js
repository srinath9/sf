var dimgdebug = 1
var digWAObj
var digALHost = "http://analytics.disneyinternational.com/analytics/"; //WDIG Analytics Base URL
var digStagingALHost = "http://staging.analytics.disneyinternational.com/analytics/";
var stagingLibVersion = 'default';
var liveLibVersion = 'default';
var stagingUseWebService = 0;
var liveUseWebService = 0;

var _mlc;

function debug(str)
{
	if(!dimgdebug)
		return false
	if(typeof(console)!="undefined" && console.debug)
		console.debug(str)
}

function digIncludeJavaScript(scrpt) 
{
	scrpt = scrpt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
	document.write('<script type="text/javascript" src="' +  scrpt + '"></scr' + 'ipt>' + "\n");
}

digWAUrlSite = window.location.host.toString(); //Sitename
digWAUrlSite = digWAUrlSite.toLowerCase()
digWASiteArray = digWAUrlSite.split(".");
if ((digWASiteArray[0] === "www") || (digWASiteArray[0] === "www2"))
{
	digWASiteArray.shift();
	digWAUrlSite=digWASiteArray.join(".");
}

digIncludeJavaScript(digALHost + 'config/' + digWAUrlSite + '.js');

function digWAObjSubmit()
{
	digWAObj.siteEnv = "live";
	digWALibVersion = liveLibVersion;

	if(digWAObj.bInitialPVTracked)
	{
		debug("#### tracking twice through cto.track(). This should not happen. Maybe a developer issue?");
	}
	digWAObj.bInitialPVTracked = true;

	// (Dario Mannu): Hack against SWFAddress non-standard behaviour
	if(window.location.href.match(/\/#\w*\/?/))
		digWAObj.url = window.location.href.replace(location.protocol+"//"+location.hostname, "");
	else
		digWAObj.url = window.location.pathname.toString(); // default behaviour
	digWAObj.url = digWAObj.url.toLowerCase();

	// (Dario Mannu): Hack against SWFAddress non-standard behaviour
	digWAObj.url = digWAObj.url.replace(/\/#(\w*)/g, '\/$1');

	// (Dario Mannu): Fix against multiple slashes in the URL
	digWAObj.url = digWAObj.url.replace(/\/+/g, '#\/');

	digWAObj.url = unescape(digWAObj.url);
	digWAObj.urlarray = digWAObj.url.split("index.html");
	digWAObj.urlSite = window.location.host.toString(); //Sitename
	if(digWAObj.siteName)
		digWAObj.urlSite = digWAObj.siteName;
	digWAObj.urlSite = digWAObj.urlSite.toLowerCase();
	digWAObj.urlName = digWAObj.urlarray.pop(); //PageName
	digWAObj.urlLength = digWAObj.urlarray.length - 1; //Directory Depth
	digWAObj.urlarray.shift();
	digWAObj.origArray = digWAObj.urlarray;
	digWAObj.urlPath="/" +digWAObj.urlarray.join("index.html") +"/"; //Directory
	if (typeof(digWAObj.urlName) === "undefined" || digWAObj.urlName === "")
		digWAObj.urlName = "index-2.html";

	digWAObj.siteArray = digWAObj.urlSite.split(".");
	/* Discard www|www2 part of the domain name */
	if ((digWAObj.siteArray[0] === "staging") || (digWAObj.siteArray[0] === "dev"))
	{
		digWAObj.useWebService = stagingUseWebService;
		digWAObj.siteEnv = "staging";
		digWALibVersion = stagingLibVersion;
		digALHost = digStagingALHost;
	} else {
                digWAObj.useWebService = liveUseWebService;
		if ((digWAObj.siteArray[0] === "www") || (digWAObj.siteArray[0] === "www2"))
                {
                        digWAObj.siteArray.shift();
                        digWAObj.urlSite=digWAObj.siteArray.join(".");
                }

	}

	digIncludeJavaScript(digALHost + 'lib/' + digWALibVersion + '/wdigWebAnalyticsFunctions.js');
        debug("DimgWebAnalyticsLib version " + digWALibVersion + " loaded");
	if (digWAObj.useWebService) {
		if(window.location.href.match(/\/#\w*\/?/)) {
        		digWAUrl = window.location.href.replace(location.protocol+"//"+location.hostname, "");
		    } else {
	        	digWAUrl = window.location.pathname.toString(); // default behaviour
		    }
		var report = digWAObj;
		digIncludeJavaScript('../analytics.disneyinternational.com/analytics/tags/tagsv26ac6.php?site=' + digWAUrlSite + '&uri=' + digWAUrl + "&hash=" + encodeURIComponent(window.location.hash) + "&search=" + encodeURIComponent(window.location.search));
	} else {
		digIncludeJavaScript(digALHost + 'scripts/' + digWAObj.urlSite + '.js');
	}

	digIncludeJavaScript(digALHost + 'lib/' + digWALibVersion + '/s_code.js');
	digIncludeJavaScript(digALHost + 'lib/' + digWALibVersion + '/error.js');
	digIncludeJavaScript(digALHost + 'lib/' + digWALibVersion + '/post_process.js');
}

function hbflash(p,m,x,d,s,c,f,g)
{
	debug("calling HBFLASH: " +p);
	p = p.toLowerCase();
	var noSlash=p.replace(/\//,""); //XXX DM: replacing the first slash only. Is this correct?

	if(s_account.indexOf("wdgintjp")>=0)
		s_omni.pageName = digWAObj.tmpCat + ":" + noSlash;
	else	s_omni.pageName = s_omni.prop24 + ":" + noSlash;

	s_omni.prop27 = s_omni.prop24 + ":" + noSlash;
	s_omni.eVar16 = s_omni.prop24 + ":" + noSlash;
	s_omni.channel = s_omni.channel;
	s_omni.t();
}

function hbPageView(p,m){hbflash(p,m,"n","n","n","n","n","n")};
function hbExitLink(n){hbflash(_pn,_mlc,n,"n","n","n","n","n")};
function hbDownload(n){hbflash(_pn,_mlc,"n",n,"n","n","n","n")};
function hbVisitorSeg(n,p,m){hbflash(p,m,"n","n",n,"n","n","n")};
function hbCampaign(n,p,m){hbflash(p,m,"n","n","n",n,"n","n")};
function hbFunnel(n,p,m){hbflash(p,m,"n","n","n","n",n,"n")};
function hbGoalPage(n,p,m){hbflash(p,m,"n","n","n","n","n",n)};

function CTO() {
    // Content Tracking Object
    digWAObj = this;
    digWAObj.h = new Object();

    this.trackInitialPV = true;
    this.bInitialPVTracked = false;

    this.track = digWAObjSubmit;
}

function _CTO() {
    // Content Tracking Object
    digWAObj = this;
    digWAObj.h = new Object();

    this.trackInitialPV = true;
    this.bInitialPVTracked = false;

    this.track = digWAObjSubmit;
    this.tracklink = digTrackLink;
    this.MediaOpen = digMediaOpen;
    this.MediaPlay = digMediaPlay;
    this.MediaStop = digMediaStop;
    this.MediaClose = digMediaClose;
    this.ajaxStart = digAjaxStart;
    this.ajaxEnd = digAjaxEnd;
    this.ajaxSubmit = digAjaxEnd;

    this.FlashTrackLink = digFlashTrackLink;
    this.initFlashPV = digAjaxStart;
    this.trackFlashPV = digAjaxEnd;

    this.hbflash = hbflash;
    this.hbPageView = hbPageView;
    this.hbExitLink = hbExitLink;
    this.hbDownload = hbDownload;
    this.hbVisitorSeg = hbVisitorSeg;
    this.hbCampaign = hbCampaign;
    this.hbFunnel = hbFunnel;
    this.hbGoalPage = hbGoalPage;
}

//digIncludeJavaScript(digFunctions);

