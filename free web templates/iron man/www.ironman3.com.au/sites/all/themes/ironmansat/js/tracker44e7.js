var _gaq = _gaq || [];
function Tracker(code, events, debug) {
    this.code = code;
    this.events = events;
    this.debug = true;
    
    if (this.debug) console.log('Using code ' + this.code);
    
    _gaq.push(['_setAccount', this.code],
    		  ['_setDomainName', 'ironman3.com.au'],
              ['_trackPageview']);
    
    var e = document.createElement('script'); e.type = 'text/javascript'; e.async = true;
    e.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(e, s);
    
    if (this.debug) console.log('Analytics script added');
    
    this.log = function(e, opt_data) {    	
        if (this.debug) console.log('log event [%s]', e);
        if (this.debug) console.log('optional data? '+opt_data);
        var p = null;
        var key = e.replace(/ /g, '_');
        
        for(var i in this.events) {
            if (i == key) {
            	//Slice the array to make sure we aren't modifying the original one
                p = eval('this.events.' + i).slice();
                //Replace the dynamic data in the last element of the array
                p[3] = p[3].replace('{{DATA}}', opt_data);
                break;
            }
        }        
        
        if (p) {
            _gaq.push(p);           
            if (this.debug) console.log('Event '+ e +' logged');
        } else if (this.debug) {
            alert('Event not defined.');
        }     
    }
};

window.onload = function() { ga = new Tracker('UA-39858123-1', events); }