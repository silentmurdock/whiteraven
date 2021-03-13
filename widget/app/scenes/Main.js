// Created by SilentMurdock
// Websites: https://github.com/silentmurdock

// Common settings
var serverIP = "127.0.0.1";

// Current version
var version = "0.4.2";

// Detect TV IP address
var network = document.getElementById('networkplugin');
var activetype = network.GetActiveType();
var TVIP = network.GetIP(activetype);
if (TVIP != "") {
    serverIP = TVIP;
}

var widgetAPI = new Common.API.Widget();

// Need for root detect
var isRooted = false;
var isSupported = false;

// Service for receive torrent
var receivingProgress = false;
var receiverWaiting = false;

// Torrent have multiple video files
var haveMultiVideo = false;

// Need for root and tv type detection
var filePlugin = document.getElementById("pluginFileSystem");

var waiting = false;
var justexit = false;
var inforeturn = false;
var nohostreturn = false;
var searcherror = false;
var isrunning = false;
var findserver = false;
var lastsearch = "";
var issubtitle = false;
var subtitledata = [];
var subtitleslist = [];
var subtitlepos = 0;

var faverror = false;

var noTryAgain = false;

var genretype = 'all';
var sortby = 'popularity.desc';

var type = '';

// Language variables
var lang = sf.core.getEnvValue('lang');
var saveSettings = {};
var storedSettings = {};

// Wrap data variables
var wrapData = [];
var position = 0;
var querytype = "movie";
var page = 1;
var totalpages = 1;
var ssindex = 2;
var episodeobject = [];
var mccount = 0;

// Save previous values in search session
var save_mainWrap = "";
var save_mainWrapTop = 0;
var save_wrapData = [];
var save_position = 0;
var save_querytype = "";
var save_page = 1;
var save_totalpages = 1;
var save_mccount = 0;
// Save mc_selected_id because search error return
var save_mcselected_id = "moviecards0";
var save_mvc_id = [];
var save_mvc_state = [];

var w185src = "http://image.tmdb.org/t/p/w185";
var w780src = "http://image.tmdb.org/t/p/w780";

// Server main variables
var SERVER_OK = false;

var lastkeytime = new Date();
var currentkeytime = lastkeytime;
var keytimeout = 100;
var mainkeytimeout = 200;

// Subtitle Token
var OSToken = "";
var OSObject = {};

// Get current date
var today = new Date();
var tyear = today.getFullYear();
var tmonth = today.getMonth() + 1;
var tday = today.getDate();
if (tmonth < 10) {
    tmonth = "0" + tmonth;
}
if (tday < 10) {
    tday = "0" + tday;
}
var ptoday = tyear + "-" + tmonth + "-" + tday;

var torrenturls = [];

var infoHash = '';

var downloadprogress = false;

var resume = {};
resume['hash'] = '';
resume['imdb'] = '';
resume['season'] = 0;
resume['episode'] = 0;
resume['index'] = -1;
resume['time'] = 0; // In millisseconds

var resumeMenuText = {};
resumeMenuText['name'] = ['resume', 'startover'];

// Multilanguage variables
var mainMenuText = {};
mainMenuText['name'] = ['movies', 'shows', 'favourites', 'search', 'settings', 'about', 'exit'];

var additionalMenuText = {};
additionalMenuText['name'] = 'receive';

var languageListText = {};                      
languageListText['shortcode'] = ['auto',
                            'ar', 'bg', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fi',
                            'fr', 'de', 'el', 'he', 'hu', 'id', 'it', 'ko', 'lv',
                            'lt', 'no', 'fa', 'pl', 'pt', 'pb', 'ro', 'ru', 'sr',
                            'sk', 'es', 'sw', 'sv', 'th', 'tr', 'ur', 'vi'];
languageListText['tmdbcode'] = ['auto',
                            'ar', 'bg', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fi',
                            'fr', 'de', 'el', 'he', 'hu', 'id', 'it', 'ko', 'lv',
                            'lt', 'no', 'fa', 'pl', 'pt-PT', 'pt-BR', 'ro', 'ru', 'sr',
                            'sk', 'es', 'sw', 'sv', 'th', 'tr', 'ur', 'vi'];
languageListText['longcode'] = ['auto',
                            'ara', 'bul', 'hrv,srp,bos', 'cze,ces', 'dan', 'dut,nld', 'eng', 'est', 'fin',
                            'fre,fra', 'ger,deu', 'gre,ell', 'heb', 'hun', 'ind', 'ita', 'kor', 'lav',
                            'lit', 'nor', 'per,fas', 'pol', 'por', 'pob', 'rum,ron', 'rus', 'hrv,srp,bos',
                            'slo,slk', 'spa', 'swa', 'swe', 'tha', 'tur', 'urd', 'vie'];

var interfaceLangText = {};
interfaceLangText['shortcode'] = ['auto', 'bg', 'hr', 'en', 'hu', 'es', 'sk', 'it'];

var movieSourceListText = {};
movieSourceListText['name'] = ['pt', 'yts', 'rarbg', '1337x', 'pto', 'itorrent'];

var tvSourceListText = {};
tvSourceListText['name'] = ['pt', 'eztv', 'rarbg', '1337x'];

var subtitleModeListText = {};
subtitleModeListText['name'] = ['imdb', 'hash'];

var downSpeedListText = {};
downSpeedListText['name'] = ['128', '256', '512', '1024', '2048', '4096', '8192', '0'];

var upSpeedListText = {};
upSpeedListText['name'] = ['128', '256', '512', '1024', '2048', '4096', '8192', '0'];

var genresMovieMenuText = {};
genresMovieMenuText['genre'] = ['all', '28', '12', '16', '35', '80', '99', '18', '10751', '14', '36', '27', '10402', '9648', '10749', '878', '53', '10752', '37'];

var genresTVMenuText = {};
genresTVMenuText['genre'] = ['all', '10759', '16', '35', '80', '99', '18', '10751', '10762', '9648', '10763', '10764', '10765', '10766', '10767', '10768', '37'];

var genresMenuText = {};

var sortMovieMenuText = {};
sortMovieMenuText['name'] = ['popularity.desc', 'release_date.desc', 'vote_count.desc'];

var sortTVMenuText = {};
sortTVMenuText['name'] = ['popularity.desc', 'first_air_date.desc', 'vote_average.desc'];

var sortMenuText = {};

var settingsMainMenuText = {};
settingsMainMenuText['name'] = ['interface', 'database', 'moviesource', 'tvsource', 'issubtitleenabled', 'subtitlelang', 'subtitlemode', 'downspeed', 'upspeed', 'islogenabled', 'save', 'restore'];

var subtitleMenuText = {};
subtitleMenuText['name'] = ['hide' ,'sync', 'load', 'search', 'style']; // Planned options: ['position', 'colors'];

var subtitleLoadText = {};
subtitleLoadText['name'] = ['wait', 'ok', 'error'];

var subtitleStyleText = {};

// Polyfill bind function if not supported
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

// Override date function to get current tv time
(function (OldDate) {
    // Get a reference to Samsung's TIME API
    var time = document.createElement('object');
    time.setAttribute('classid', 'clsid:SAMSUNG-INFOLINK-TIME');
    document.body.appendChild(time);

    // Replace the existing Date() constructor
    window.Date = function (a, b, c, d, e, f, g) {
        switch (arguments.length) {
            case 0:
                return new OldDate(time.GetEpochTime() * 1000);

            case 1: return new OldDate(a);
            case 2: return new OldDate(a, b);
            case 3: return new OldDate(a, b, c);
            case 4: return new OldDate(a, b, c, d);
            case 5: return new OldDate(a, b, c, d, e);
            case 6: return new OldDate(a, b, c, d, e, f);
            case 7: return new OldDate(a, b, c, d, e, f, g);
        }
    };

    // Copy static function properties
    Date.now   = function () { return time.GetEpochTime() * 1000; };
    Date.UTC   = OldDate.UTC;
    Date.parse = OldDate.parse;
})(Date);

// Override alert function when logging enabled
var islogenabled = "false";
window.onerror = function(msg, url, line, col, error) {
    var extra = !col ? '' : '\ncolumn: ' + col;
    extra += !error ? '' : '\nerror: ' + error;
    alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
}
var originalAlert = window.alert;
window.alert = function(text) {
    if (islogenabled == "true") {
        WriteToLogFile(text);
    } else {
        originalAlert(text);
    }
}

// toCapitalize prototype
String.prototype.toCapitalize = function() { 
   return this.toLowerCase().replace(/^.|\s\S/g, function(a) { return a.toUpperCase(); });
}

// toMilliSeconds prototype
String.prototype.toMilliSeconds = function () {
    if (!this) return null;
    var hms = this.split(':');
    return ((+hms[0]) * 60 * 60 + (+hms[1]) * 60 + (+hms[2] || 0)) * 1000;
}

// Destroy any object in memory - i hope :)
function DestroyObject(obj) {
    for(var prop in obj){
        var property = obj[prop];
        if(property != null && typeof(property) == 'object') {
            DestroyObject(property);
        }
        else {
            obj[prop] = null;
        }
    }
}

// Compare subtitle names similarity
function SimilarText(first, second, percent) {
  if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
    return 0;
  }

  first += '';
  second += '';

  var pos1 = 0,
    pos2 = 0,
    max = 0,
    firstLength = first.length,
    secondLength = second.length,
    p, q, l, sum;

  max = 0;

  for (p = 0; p < firstLength; p++) {
    for (q = 0; q < secondLength; q++) {
        for (l = 0; (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++) {
          if (l > max) {
            max = l;
            pos1 = p;
            pos2 = q;
          }
        }
    }
  }

  sum = max;

  if (sum) {
    if (pos1 && pos2) {
      sum += SimilarText(first.substr(0, pos2), second.substr(0, pos2));
    }

    if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
      sum += SimilarText(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
    }
  }

  if (!percent) {
    return sum;
  } else {
    return (sum * 200) / (firstLength + secondLength);
  }
}

// Thanks to emby.media community and forum for Parse Srt Subtitle
function ParseSrtSubtitle(data) {
    var regex = /(\d+)(\r?\n|\r)(\d{2}:\d{2}:\d{2},\d+) --> (\d{2}:\d{2}:\d{2},\d+)/g;
    data = data.split(regex);
    data.shift();

    var items = [];
    for (var i = 0; i < data.length; i += 5) {
        var tmp = data[i + 4].replace(/\r?\n$|\r$/,'')
        tmp = tmp.replace(/(<([^>]+)>)/ig,'');
        tmp = tmp.replace(/\s+$/, '');
        tmp = tmp.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br />$2');
        tmp = tmp.replace(/^<br \/>/, '');
        tmp = tmp.replace(/<br \/>$/, '');
        items.push({
            id: data[i],
            startTime: timeToMs(data[i + 2]),
            endTime: timeToMs(data[i + 3]),
            text: tmp
        });
    }

    items.sort(function(a, b) {
        return a.startTime - b.startTime;
    });
    return items;
}

var timeToMs = function(val) {
    var regex = /(\d+):(\d{2}):(\d{2}),(\d{3})/;
    var parts = regex.exec(val);

    if (parts === null) {
        return 0;
    }

    for (var i = 1; i < 5; i++) {
        parts[i] = parseInt(parts[i], 10);
        if (isNaN(parts[i])) parts[i] = 0;
    }

    // hours + minutes + seconds + ms
    return parts[1] * 3600000 + parts[2] * 60000 + parts[3] * 1000 + parts[4];
};

// Update current time in headers
function StartTimeInHeaders() {
    var today = new Date();
    var h = CheckTime(today.getHours());
    var m = CheckTime(today.getMinutes());
    widgetAPI.putInnerHTML(document.getElementById("TimeInfoInHeader"), h + ":" + m);
    sf.scene.get('PlayerPage').SetCurrentTime(h + ":" + m);
    t = setTimeout(function () {
        StartTimeInHeaders();
    }, 60000);
}

function CheckTime(i) {
    return (i < 10) ? "0" + i : i;
}

// Convert hex color to RGBA color and add opacity
function ColorToRGBA(hex, opacity){
    hex = hex.replace('#','');
    var r = parseInt(hex.substring(0,2), 16);
    var g = parseInt(hex.substring(2,4), 16);
    var b = parseInt(hex.substring(4,6), 16);
    return 'rgba('+r+','+g+','+b+','+opacity+')';
}

// Try to find local White Raven server
function FindLocalServer(fn) {
    var networkAddress = serverIP.match(/[0-9]+\.[0-9]+\.[0-9]+\./)[0];
    var xhttpArray = [];
    var detectedIP = "";
    var checkedAll = 0;

    var savedAddress = saveSettings['serverip'].match(/[0-9]+\.[0-9]+\.[0-9]+\./)[0];
    var savedHost = 1;
    var hostsArray = [];

    var returned = false;

    if (savedAddress == networkAddress) {
        savedHost = saveSettings['serverip'].match(/[0-9]+\.[0-9]+\.[0-9]+\.([0-9]+)/)[1];
    }

    hostsArray.push(savedHost);

    for (var i = 1; i < 255; i++) {
        if (i != savedHost) {
            hostsArray.push(i);
        }
    }
    
    for (var i = 0; i < 254; i++) {
        var xhttp = new XMLHttpRequest();
        xhttp.hostId = hostsArray[i];
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                if (detectedIP == "") {
                    for (var j = 0; j < xhttpArray.length; j++) {
                        xhttpArray[j].abort();
                    }
                    
                    findserver = false;
                    returned = true;
                    // Get the IP address
                    detectedIP = networkAddress + this.hostId;
                    fn(detectedIP);
                }
            }
        }

        xhttp.ontimeout = function (e) {
            this.abort();
            checkedAll++;
            if (checkedAll == 254) {
                returned = true;
                fn(detectedIP);
            }
        }

        xhttp.onerror = function (e) {
            this.abort();
            checkedAll++;
            if (checkedAll == 254) {
                returned = true;
                fn(detectedIP);
            }
        }

        xhttp.open("GET", "http://" + networkAddress + hostsArray[i] + ":9000/api/about", true);
        xhttp.send();
        xhttpArray.push(xhttp);
    }

    setTimeout(function() {
        if (!returned) {
            returned = true;

            for (var j = 0; j < xhttpArray.length; j++) {
                xhttpArray[j].abort();
            }
            
            fn(detectedIP);
        }
    }, 120000);
}

// Start or stop White Raven server
function StartStopWRServer(command) {
    SERVER_OK = false;
    document.getElementById("playbutton").style.width = 210;
    widgetAPI.putInnerHTML(document.getElementById("playbutton"), noServerButtonText[lang]);

    var reqSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
            reqSuccess = true;
            if (command == "start") {
                setTimeout(function(){ IsTheServerStarted(); }, 6000);                
            }
        }
      }
    });

    // if (command == "osstop") // Set command check value to "osstop" to request os.SIGINT server stop
    if (command == "stop") {
        alert("[White Raven] EXIT key pressed and stopped the application.");
        xhr.open("GET", "http://" + serverIP + ":9000/api/stop");
        xhr.send();
    } else if (command == "test") {
    	//SetWaitAndZIndex("visible", 100);
    	reqSuccess = true;
    	StartOrStopWithLogo("start");

        setTimeout(function(){ IsTheServerStarted(); }, 6000);
    } else {
    	//SetWaitAndZIndex("visible", 100);
    	StartOrStopWithLogo("start");

        // Detect root and type on H, F, E series
        var detectedValues = DetectRoot();
        isRooted = detectedValues.isRooted;
        isSupported = detectedValues.isSupported;

        if (isRooted == true && isSupported == true) {            
            alert("[White Raven] Trying to start the server: http://" + serverIP + ":1080/cgi-bin/test.cgi?/mtd_rwcommon/widgets/user/WhiteRaven/server/server.init+" + command + " " + saveSettings['downspeed'] + " " + saveSettings['upspeed']);
            xhr.open("GET", "http://" + serverIP + ":1080/cgi-bin/test.cgi?/mtd_rwcommon/widgets/user/WhiteRaven/server/server.init+" + command + " " + saveSettings['downspeed'] + " " + saveSettings['upspeed']);
            xhr.send();
        } else {
            reqSuccess = true;
            FindLocalServer(function(detectedIP) {
            	if (detectedIP != "") {
            		serverIP = detectedIP;
                    SaveServerIP();
            		setTimeout(function(){ IsTheServerStarted(); }, 2000);
            	} else {
		            document.getElementById("loaDing").style.visibility = "hidden";
		            document.getElementById("loaDing").className = "loaderoff";
		            StopRavenEyeAnimation();
		            widgetAPI.putInnerHTML(document.getElementById("noConnection"), serverNotFoundText[lang]);
		            document.getElementById("noConnection").style.visibility = "visible";
		        
		            justexit = true;
		            noTryAgain = true;
		            if (isRooted == true && isSupported == true) {                
		                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), noTryAgainText[lang]);
		            } else {
		                findserver = true;
		                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), tryAgainOrExitText[lang]);
		            }
            	}
            });
        }
    }

    // Can't start server
    setTimeout(function() {
        if (!reqSuccess) {
            xhr.abort();
            reqSuccess = true;

    		document.getElementById("loaDing").style.visibility = "hidden";
            document.getElementById("loaDing").className = "loaderoff";
            widgetAPI.putInnerHTML(document.getElementById("noConnection"), notRootedText[lang]);
            document.getElementById("noConnection").style.visibility = "visible";
        
            justexit = true;
            noTryAgain = true;
            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), noTryAgainText[lang]);
        }
    }, 10000);
}

// Is the White Raven server started?
function IsTheServerStarted() {
    var reqStartSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
            reqStartSuccess = true;
            var dataobject = JSON.parse(this.responseText);
            if ((dataobject) && (dataobject.message.indexOf("White Raven Server v" + version) != -1)) {
                alert("[White Raven] Server started: " + dataobject.message);
                SERVER_OK = true;
                widgetAPI.putInnerHTML(document.getElementById("playbutton"), playButtonText[lang]);

                // Try to update favourites
                CheckFavouritesData();

                if (isRooted == true && isSupported == true) {
                    GetMovieInfo(querytype,"first", page, "");
                } else {
                    RestartServer("silent");
                }

                widgetAPI.putInnerHTML(document.getElementById("VersionInfoInHeader"), "V" + version);
                document.getElementById("VersionInfoInHeader").style.visibility = "visible";

                if (document.getElementById("TimeInfoInHeader").innerHTML != "") {
                    document.getElementById("TimeInfoInHeader").style.visibility = "visible";
                    StartTimeInHeaders();
                }
            } else {                
                document.getElementById("loaDing").style.visibility = "hidden";
                document.getElementById("loaDing").className = "loaderoff";
                StopRavenEyeAnimation();
                if (isRooted == true) {
                    widgetAPI.putInnerHTML(document.getElementById("noConnection"), serverNotStartedText[lang]);
                } else {
                    widgetAPI.putInnerHTML(document.getElementById("noConnection"), serverNotFoundText[lang]);
                }
                document.getElementById("noConnection").style.visibility = "visible";
            
                justexit = true;
                noTryAgain = true;
                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), noTryAgainText[lang]);
            }
        }
      }
    });

    alert("[White Raven] Check if the server started: http://" + serverIP + ":9000/api/about");
    xhr.open("GET", "http://" + serverIP + ":9000/api/about");
    xhr.send();

    setTimeout(function() {
        if (!reqStartSuccess) {
            xhr.abort();
            reqStartSuccess = true;
            
            document.getElementById("loaDing").style.visibility = "hidden";
            document.getElementById("loaDing").className = "loaderoff";
            StopRavenEyeAnimation();
            if (isRooted == true) {
                widgetAPI.putInnerHTML(document.getElementById("noConnection"), serverNotStartedText[lang]);
            } else {
                widgetAPI.putInnerHTML(document.getElementById("noConnection"), serverNotFoundText[lang]);
            }
            document.getElementById("noConnection").style.visibility = "visible";
        
            justexit = true;
            noTryAgain = true;
            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), noTryAgainText[lang]);
        }
    }, 10000);
}

// Is the White Raven server still running? Silent test.
function IsTheServerStillRunning(fn) {
    var reqStartSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
            reqStartSuccess = true;
            var dataobject = JSON.parse(this.responseText);
            if ((dataobject) && (dataobject.message.indexOf("White Raven Server v" + version) != -1)) {
                fn(true);
            } else {
                fn(false);
            }
        }
      }
    });

    xhr.open("GET", "http://" + serverIP + ":9000/api/about");
    xhr.send();

    setTimeout(function() {
        if (!reqStartSuccess) {
            xhr.abort();
            reqStartSuccess = true;            
            fn(false);
        }
    }, 2000);
}

// Restart server's inner torrent client
function RestartServer(state) {
    // Need to rewrite later
    SetWaitAndZIndex("visible", 100);
    if (state == "loud") {
    	widgetAPI.putInnerHTML(document.getElementById("SettingsText"), restartServerText[lang]);
    }

    var reqStartSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
            reqStartSuccess = true;
            setTimeout(function(){ ShowMoviesMenu('all', 'popularity.desc'); }, 2000);
        }
      }
    });

    xhr.open("GET", "http://" + serverIP + ":9000/api/restart/downrate/" + saveSettings['downspeed'] + "/uprate/" + saveSettings['upspeed']);
    xhr.send();

    setTimeout(function() {
        if (!reqStartSuccess) {
            xhr.abort();
            reqStartSuccess = true;
            ShowMoviesMenu('all', 'popularity.desc');
        }
    }, 5000);
}

function DetectRoot() {
    var rootCheck = false;
    var supportCheck = false;
    // Detect root on H, F, E type
    if (IsExists("/mnt/etc/init.d") == 1) {
        rootCheck = true;
    }
    // Detect H, F, E type
    if (IsExists("/mtd_rwcommon/widgets/user") == 1) {
        supportCheck = true;            
    }

    return { isRooted: rootCheck, isSupported: supportCheck }
}

function IsExists(path) {
    var command = "filePlugin.IsExistedPath('" + path + "')";
    var result = eval(command);
    return result;
}

function SaveDefaultTemp() {
    lang = sf.core.getEnvValue('lang');

    if ((lang == 'en') || (lang == 'bg') || (lang == 'hr') || (lang == 'hu') ||
        (lang == 'es') || (lang == 'sk') || (lang == 'it')) {
        saveSettings['interface'] = lang;
        saveSettings['database'] = lang;
        saveSettings['moviesource_pt'] = "true";
        saveSettings['moviesource_yts'] = "true";
        saveSettings['moviesource_rarbg'] = "false";
        saveSettings['moviesource_1337x'] = "true";
        saveSettings['moviesource_pto'] = "false";
        saveSettings['moviesource_itorrent'] = "false";
        saveSettings['tvsource_pt'] = "true";
        saveSettings['tvsource_eztv'] = "true";
        saveSettings['tvsource_rarbg'] = "false";
        saveSettings['tvsource_1337x'] = "true";
        saveSettings['issubtitleenabled'] = "true";
        saveSettings['subtitlelang'] = lang;
        saveSettings['subtitlemode'] = subtitleModeListText['name'][0];
        saveSettings['downspeed'] = downSpeedListText['name'][6];
        saveSettings['upspeed'] = upSpeedListText['name'][2];
        saveSettings['islogenabled'] = "false";
        saveSettings['subtitlesize'] = "34";
        saveSettings['subtitleposition'] = "441";
        saveSettings['subtitlecolor'] = "#FFFFFF";
        saveSettings['subtitlebgcolor'] = "#000000";
        saveSettings['subtitleopacity'] = "0.48";
        saveSettings['version'] = version;
        saveSettings['serverip'] = serverIP;
    } else {
        saveSettings['interface'] = "en";
        saveSettings['database'] = "en";
        saveSettings['moviesource_pt'] = "true";
        saveSettings['moviesource_yts'] = "true";
        saveSettings['moviesource_rarbg'] = "false";
        saveSettings['moviesource_1337x'] = "true";
        saveSettings['moviesource_pto'] = "false";
        saveSettings['moviesource_itorrent'] = "false";
        saveSettings['tvsource_pt'] = "true";
        saveSettings['tvsource_eztv'] = "true";
        saveSettings['tvsource_rarbg'] = "false";
        saveSettings['tvsource_1337x'] = "true";
        saveSettings['issubtitleenabled'] = "true";
        saveSettings['subtitlelang'] = "en";
        saveSettings['subtitlemode'] = subtitleModeListText['name'][0];
        saveSettings['downspeed'] = downSpeedListText['name'][6];
        saveSettings['upspeed'] = upSpeedListText['name'][2];
        saveSettings['islogenabled'] = "false";
        saveSettings['subtitlesize'] = "34";
        saveSettings['subtitleposition'] = "441";
        saveSettings['subtitlecolor'] = "#FFFFFF";
        saveSettings['subtitlebgcolor'] = "#000000";
        saveSettings['subtitleopacity'] = "0.48";
        saveSettings['version'] = version;
        saveSettings['serverip'] = serverIP;
    }

    for (var key in saveSettings) {
        if (typeof storedSettings[key] === "undefined" || typeof storedSettings[key] === "object" || key == "version") {
            sf.core.localData(key, saveSettings[key]);
        } else {
            sf.core.localData(key, storedSettings[key]);
        }
    }    
    storedSettings = {};

    lang = sf.core.localData('interface');
    islogenabled = sf.core.localData('islogenabled');
}

function CreateOrLoadTemp() {
    var fileSystemObj = new FileSystem();

    if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
        fileSystemObj.createCommonDir(curWidget.id);
        // Autodetect languages.        
        SaveDefaultTemp();
    } else {
        saveSettings['interface'] = sf.core.localData('interface');
        saveSettings['database'] = sf.core.localData('database');
        saveSettings['moviesource_pt'] = sf.core.localData('moviesource_pt');
        saveSettings['moviesource_yts'] = sf.core.localData('moviesource_yts');
        saveSettings['moviesource_rarbg'] = sf.core.localData('moviesource_rarbg');
        saveSettings['moviesource_1337x'] = sf.core.localData('moviesource_1337x');
        saveSettings['moviesource_pto'] = sf.core.localData('moviesource_pto');
        saveSettings['moviesource_itorrent'] = sf.core.localData('moviesource_itorrent');
        saveSettings['tvsource_pt'] = sf.core.localData('tvsource_pt');
        saveSettings['tvsource_eztv'] = sf.core.localData('tvsource_eztv');
        saveSettings['tvsource_rarbg'] = sf.core.localData('tvsource_rarbg');
        saveSettings['tvsource_1337x'] = sf.core.localData('tvsource_1337x');
        saveSettings['issubtitleenabled'] = sf.core.localData('issubtitleenabled');
        saveSettings['subtitlelang'] = sf.core.localData('subtitlelang');
        saveSettings['subtitlemode'] = sf.core.localData('subtitlemode');
        saveSettings['downspeed'] = sf.core.localData('downspeed');
        saveSettings['upspeed'] = sf.core.localData('upspeed');
        saveSettings['islogenabled'] = sf.core.localData('islogenabled');
        saveSettings['subtitlesize'] = sf.core.localData('subtitlesize');
        saveSettings['subtitleposition'] = sf.core.localData('subtitleposition');
        saveSettings['subtitlecolor'] = sf.core.localData('subtitlecolor');
        saveSettings['subtitlebgcolor'] = sf.core.localData('subtitlebgcolor');
        saveSettings['subtitleopacity'] = sf.core.localData('subtitleopacity');
        saveSettings['version'] = sf.core.localData('version');
        saveSettings['serverip'] = sf.core.localData('serverip');

        var isundefined = false;
        for (var key in saveSettings) {
            if (typeof saveSettings[key] === "undefined" || typeof saveSettings[key] === "object") {
                isundefined = true;
            } else {
                storedSettings[key] = saveSettings[key];
            }
        }

        if (isundefined == false && saveSettings['version'] != version) {
            isundefined = true;
        }
        
        if (isundefined) {
            SaveDefaultTemp();
        } else {
            lang = saveSettings['interface'];
            islogenabled = saveSettings['islogenabled'];
        }
    }
}

function SaveTemp() {
    var fileSystemObj = new FileSystem();

    if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
        fileSystemObj.createCommonDir(curWidget.id);
        sf.core.localData('interface', saveSettings['interface']);
        sf.core.localData('database', saveSettings['database']);
        sf.core.localData('moviesource_pt', saveSettings['moviesource_pt']);
        sf.core.localData('moviesource_yts', saveSettings['moviesource_yts']);
        sf.core.localData('moviesource_rarbg', saveSettings['moviesource_rarbg']);
        sf.core.localData('moviesource_1337x', saveSettings['moviesource_1337x']);
        sf.core.localData('moviesource_pto', saveSettings['moviesource_pto']);
        sf.core.localData('moviesource_itorrent', saveSettings['moviesource_itorrent']);        
        sf.core.localData('tvsource_pt', saveSettings['tvsource_pt']);
        sf.core.localData('tvsource_eztv', saveSettings['tvsource_eztv']);
        sf.core.localData('tvsource_rarbg', saveSettings['tvsource_rarbg']);
        sf.core.localData('tvsource_1337x', saveSettings['tvsource_1337x']);
        sf.core.localData('issubtitleenabled', saveSettings['issubtitleenabled']);
        sf.core.localData('subtitlelang', saveSettings['subtitlelang']);
        sf.core.localData('subtitlemode', saveSettings['subtitlemode']);
        sf.core.localData('downspeed', saveSettings['downspeed']);
        sf.core.localData('upspeed', saveSettings['upspeed']);
        sf.core.localData('islogenabled', saveSettings['islogenabled']);
        sf.core.localData('subtitlesize', saveSettings['subtitlesize']);
        sf.core.localData('subtitleposition', saveSettings['subtitleposition']);
        sf.core.localData('subtitlecolor', saveSettings['subtitlecolor']);
        sf.core.localData('subtitlebgcolor', saveSettings['subtitlebgcolor']);
        sf.core.localData('subtitleopacity', saveSettings['subtitleopacity']);
        sf.core.localData('version', saveSettings['version']);
        sf.core.localData('serverip', saveSettings['serverip']);
    } else {
        sf.core.localData('interface', saveSettings['interface']);
        sf.core.localData('database', saveSettings['database']);
        sf.core.localData('moviesource_pt', saveSettings['moviesource_pt']);
        sf.core.localData('moviesource_yts', saveSettings['moviesource_yts']);
        sf.core.localData('moviesource_rarbg', saveSettings['moviesource_rarbg']);
        sf.core.localData('moviesource_1337x', saveSettings['moviesource_1337x']);
        sf.core.localData('moviesource_pto', saveSettings['moviesource_pto']);
        sf.core.localData('moviesource_itorrent', saveSettings['moviesource_itorrent']);        
        sf.core.localData('tvsource_pt', saveSettings['tvsource_pt']);
        sf.core.localData('tvsource_eztv', saveSettings['tvsource_eztv']);
        sf.core.localData('tvsource_rarbg', saveSettings['tvsource_rarbg']);
        sf.core.localData('tvsource_1337x', saveSettings['tvsource_1337x']);
        sf.core.localData('issubtitleenabled', saveSettings['issubtitleenabled']);
        sf.core.localData('subtitlelang', saveSettings['subtitlelang']);
        sf.core.localData('subtitlemode', saveSettings['subtitlemode']);
        sf.core.localData('downspeed', saveSettings['downspeed']);
        sf.core.localData('upspeed', saveSettings['upspeed']);
        sf.core.localData('islogenabled', saveSettings['islogenabled']);
        sf.core.localData('subtitlesize', saveSettings['subtitlesize']);
        sf.core.localData('subtitleposition', saveSettings['subtitleposition']);
        sf.core.localData('subtitlecolor', saveSettings['subtitlecolor']);
        sf.core.localData('subtitlebgcolor', saveSettings['subtitlebgcolor']);
        sf.core.localData('subtitleopacity', saveSettings['subtitleopacity']);
        sf.core.localData('version', saveSettings['version']);
        sf.core.localData('serverip', saveSettings['serverip']);
    }

    lang = saveSettings['interface'];
    islogenabled = saveSettings['islogenabled'];
}

function RestoreDefaultTemp() {
    var fileSystemObj = new FileSystem();

    if (fileSystemObj.isValidCommonPath(curWidget.id) == 1) {
        lang = sf.core.getEnvValue('lang');

        if ((lang == 'en') || (lang == 'bg') || (lang == 'hr') || (lang == 'hu') ||
            (lang == 'es') || (lang == 'sk') || (lang == 'it')) {
            saveSettings['interface'] = lang;
            saveSettings['database'] = lang;
            saveSettings['moviesource_pt'] = "true";
            saveSettings['moviesource_yts'] = "true";
            saveSettings['moviesource_rarbg'] = "false";
            saveSettings['moviesource_1337x'] = "true";
            saveSettings['moviesource_pto'] = "false";
            saveSettings['moviesource_itorrent'] = "false";
            saveSettings['tvsource_pt'] = "true";
            saveSettings['tvsource_eztv'] = "true";
            saveSettings['tvsource_rarbg'] = "false";
            saveSettings['tvsource_1337x'] = "true";
            saveSettings['issubtitleenabled'] = "true";
            saveSettings['subtitlelang'] = lang;
            saveSettings['subtitlemode'] = subtitleModeListText['name'][0];
            saveSettings['downspeed'] = downSpeedListText['name'][6];
            saveSettings['upspeed'] = upSpeedListText['name'][2];
            saveSettings['islogenabled'] = "false";
            saveSettings['subtitlesize'] = "34";
            saveSettings['subtitleposition'] = "441";
            saveSettings['subtitlecolor'] = "#FFFFFF";
            saveSettings['subtitlebgcolor'] = "#000000";
            saveSettings['subtitleopacity'] = "0.48";
            saveSettings['version'] = version;
            saveSettings['serverip'] = serverIP;
        } else {
            saveSettings['interface'] = "en";
            saveSettings['database'] = "en";
            saveSettings['moviesource_pt'] = "true";
            saveSettings['moviesource_yts'] = "true";
            saveSettings['moviesource_rarbg'] = "false";
            saveSettings['moviesource_1337x'] = "true";
            saveSettings['moviesource_pto'] = "false";
            saveSettings['moviesource_itorrent'] = "false";
            saveSettings['tvsource_pt'] = "true";
            saveSettings['tvsource_eztv'] = "true";
            saveSettings['tvsource_rarbg'] = "false";
            saveSettings['tvsource_1337x'] = "true";
            saveSettings['issubtitleenabled'] = "true";
            saveSettings['subtitlelang'] = "en";
            saveSettings['subtitlemode'] = subtitleModeListText['name'][0];
            saveSettings['downspeed'] = downSpeedListText['name'][6];
            saveSettings['upspeed'] = upSpeedListText['name'][2];
            saveSettings['islogenabled'] = "false";
            saveSettings['subtitlesize'] = "34";
            saveSettings['subtitleposition'] = "441";
            saveSettings['subtitlecolor'] = "#FFFFFF";
            saveSettings['subtitlebgcolor'] = "#000000";
            saveSettings['subtitleopacity'] = "0.48";
            saveSettings['version'] = version;
            saveSettings['serverip'] = serverIP;
        }

        for (var key in saveSettings) {
            sf.core.localData(key, saveSettings[key]);
        }    
        storedSettings = {};

        lang = sf.core.localData('interface');
        islogenabled = sf.core.localData('islogenabled');
    }
}

function SaveServerIP() {
    var fileSystemObj = new FileSystem();

    saveSettings['serverip'] = serverIP;

    if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
        fileSystemObj.createCommonDir(curWidget.id);
        sf.core.localData('serverip', saveSettings['serverip']);
    } else {
        sf.core.localData('serverip', saveSettings['serverip']);
    }
}

function SaveFavouritesToLocal(jsondata) {
    waiting = true;

    var tempText = document.getElementById("SettingsText").innerHTML;
    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), favouriteSaveText[lang]);

    var jsonsaved = ReadFavouritesFromLocal();
    var jsonArray = [];
    var match = false;

    if (jsonsaved != "") {
        var jsonObj = JSON.parse(jsonsaved);
        for (var i=0; i<jsonObj.length; i++) {
            jsonArray.push(jsonObj[i]);
            if (jsonObj[i].id == jsondata.id) {
                match = true;
            }
        }
    }

    if (match == false) {
        jsonArray.push(jsondata);

        var fileSystemObj = new FileSystem();

        if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
            fileSystemObj.createCommonDir(curWidget.id);
            var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/favdata.json', 'w');
            fileObj.writeAll(JSON.stringify(jsonArray));
            fileSystemObj.closeCommonFile(fileObj);
        } else {
            var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/favdata.json', 'w');
            fileObj.writeAll(JSON.stringify(jsonArray));
            fileSystemObj.closeCommonFile(fileObj);
        }
    }

    setTimeout(function(){
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), tempText);
        waiting = false;
    }, 500);
}

function UpdatePosterAndBackdropPath(tempId, tempType) {
    var dbpos = languageListText['shortcode'].indexOf(saveSettings['database']);
    
    $.ajax({
        url: "http://" + serverIP + ":9000/api/tmdbinfo/type/" + tempType + "/tmdbid/" + tempId + "/lang/" + languageListText['tmdbcode'][dbpos],
        type: "GET",
        dataType: "json",
        timeout: 5000,
        success: function(data) {
            if (data && data.poster_path && data.backdrop_path) {
                UpdateFavouritesInLocal(tempId, data.poster_path, data.backdrop_path);
            }
        }
    });
}

function UpdateFavouritesInLocal(favid, favposter, favbackdrop) {
    waiting = true;

    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), favouriteSaveText[lang]);

    var jsonsaved = ReadFavouritesFromLocal();
    var jsonArray = [];

    if (jsonsaved != "") {
        var jsonObj = JSON.parse(jsonsaved);
        for (var i=0; i<jsonObj.length; i++) {
            if (jsonObj[i].id == favid) {
                jsonObj[i].poster_path = favposter;
                jsonObj[i].backdrop_path = favbackdrop;
            }
            jsonArray.push(jsonObj[i]);
        }

        var fileSystemObj = new FileSystem();

        if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
            fileSystemObj.createCommonDir(curWidget.id);
            var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/favdata.json', 'w');
            fileObj.writeAll(JSON.stringify(jsonArray));
            fileSystemObj.closeCommonFile(fileObj);
        } else {
            var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/favdata.json', 'w');
            fileObj.writeAll(JSON.stringify(jsonArray));
            fileSystemObj.closeCommonFile(fileObj);
        }
    }

    setTimeout(function(){
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), favouritesettingsText[lang]);
        waiting = false;
    }, 500);
}

function RemoveFavouritesFromLocal(jsondata) {
    waiting = true;

    var jsonsaved = ReadFavouritesFromLocal();
    var jsonArray = [];

    var jsonObj = JSON.parse(jsonsaved);
    for (var i=0; i<jsonObj.length; i++) {        
        if (jsonObj[i].id != jsondata.id) {
            jsonArray.push(jsonObj[i]);
        }
    }

    var fileSystemObj = new FileSystem();

    if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
        fileSystemObj.createCommonDir(curWidget.id);
        var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/favdata.json', 'w');
        fileObj.writeAll(JSON.stringify(jsonArray));
        fileSystemObj.closeCommonFile(fileObj);
    } else {
        var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/favdata.json', 'w');
        fileObj.writeAll(JSON.stringify(jsonArray));
        fileSystemObj.closeCommonFile(fileObj);
    }

    waiting = false;
}

function ReadFavouritesFromLocal() {
    var fileSystemObj = new FileSystem();

    var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/favdata.json', 'r');
    if (fileObj) {
        var jsondata = fileObj.readAll();
        fileSystemObj.closeCommonFile(fileObj);
        return jsondata;
    } else {
        return '[]';
    }
}

function DeleteAllFavouritesFromLocal() {
    var fileSystemObj = new FileSystem();
    var fileObj = fileSystemObj.deleteCommonFile(curWidget.id + '/favdata.json');
}

function SaveResumeToLocal(jsondata) {
    var jsonsaved = ReadResumeFromLocal();
    var jsonArray = [];
    var match = false;

    if (jsonsaved != "") {
        var jsonObj = JSON.parse(jsonsaved);
        for (var i=0; i<jsonObj.length; i++) {
            if (((jsonObj[i].imdb != "" && jsonObj[i].imdb == jsondata.imdb) || jsonObj[i].hash == jsondata.hash) &&
                jsonObj[i].season == jsondata.season && jsonObj[i].episode == jsondata.episode && jsonObj[i].index == jsondata.index) {
                jsonObj[i].time = jsondata.time;
                match = true;
            }
            jsonArray.push(jsonObj[i]);
        }
    }

    if (match == false && jsondata.time != 0) {
        if (jsonObj.length < 50) {
            jsonArray.push(jsondata);
        } else {
            jsonArray = [];
            for (var i=1; i<jsonObj.length; i++) {
                jsonArray.push(jsonObj[i]);
            }
            jsonArray.push(jsondata);
        }
    }

    var fileSystemObj = new FileSystem();

    if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
        fileSystemObj.createCommonDir(curWidget.id);
        var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/resume.json', 'w');
        fileObj.writeAll(JSON.stringify(jsonArray));
        fileSystemObj.closeCommonFile(fileObj);
    } else {
        var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/resume.json', 'w');
        fileObj.writeAll(JSON.stringify(jsonArray));
        fileSystemObj.closeCommonFile(fileObj);
    }
}

function ReadResumeFromLocal() {
    var fileSystemObj = new FileSystem();

    var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/resume.json', 'r');
    if (fileObj) {
        var jsondata = fileObj.readAll();
        fileSystemObj.closeCommonFile(fileObj);
        return jsondata;
    } else {
        return '[]';
    }
}

function CreateLogFile() {
    var fileSystemObj = new FileSystem();

    if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
        fileSystemObj.createCommonDir(curWidget.id);
        var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/log.txt', 'w');
        fileObj.writeAll("[White Raven] Log file created.\n");
        fileSystemObj.closeCommonFile(fileObj);
    } else {
        var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/log.txt', 'w');
        fileObj.writeAll("[White Raven] Log file created.\n");
        fileSystemObj.closeCommonFile(fileObj);
    }

    // Must get fixed date and time
    var today = new Date();
    tyear = today.getFullYear();
    tmonth = today.getMonth() + 1;
    tday = today.getDate();
    if (tmonth < 10) {
        tmonth = "0" + tmonth;
    }
    if (tday < 10) {
        tday = "0" + tday;
    }
    ptoday = tyear + "-" + tmonth + "-" + tday;
    var h = CheckTime(today.getHours());
    var m = CheckTime(today.getMinutes());
    widgetAPI.putInnerHTML(document.getElementById("TimeInfoInHeader"), h + ":" + m);
    sf.scene.get('PlayerPage').SetCurrentTime(h + ":" + m);
}

function WriteToLogFile(text) {
    var fileSystemObj = new FileSystem();

    if (fileSystemObj.isValidCommonPath(curWidget.id) == 0) {
        fileSystemObj.createCommonDir(curWidget.id);
        var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/log.txt', 'a');
        fileObj.writeAll(text + "\n");
        fileSystemObj.closeCommonFile(fileObj);
    } else {
        var fileObj = fileSystemObj.openCommonFile(curWidget.id + '/log.txt', 'a');
        fileObj.writeAll(text + "\n");
        fileSystemObj.closeCommonFile(fileObj);
    }
}

function bytesToSize(bytes) {
   var sizes = ['Byte', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

function SetWaitAndZIndex(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    if (state == "visible") {
        document.getElementById("loaDing").className = "loaderon";
    }
    document.getElementById("loaDing").style.visibility = state;
    if (state == "hidden") {
        document.getElementById("loaDing").className = "loaderoff";
    }
    document.getElementById("noConnection").style.visibility = "hidden";
    document.getElementById("waitscreen").style.visibility = state;
    if (state == "visible") {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), loadingText[lang]);
        waiting = true;
    } else {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), "");
        waiting = false;
    }
}

function SetZIndex(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
}

function StopRavenEyeAnimation() {
	var raveneye = document.getElementById("raveneye");
	raveneye.style.animation = "none";
	raveneye.style.webkitAnimation = "none";
}

function StartOrStopWithLogo(state) {
    if (state == "start") {
        waiting = true;
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), loadingText[lang]);

        var imgBackground = document.createElement("img");
        imgBackground.onload = function() {
            document.getElementById("OverlayVideoPlayerFull").style.backgroundImage = "url('images/splash.jpg')";
            document.getElementById("raveneye").style.visibility = "visible";
            widgetAPI.putInnerHTML(document.getElementById("splashtext"), splashText[lang]);
            document.getElementById("splashtitle").style.visibility = "visible";
            document.getElementById("OverlayVideoPlayerFull").style.visibility = "visible";
            document.getElementById("SceneVideoPlayerFull").style.visibility = "visible";
        }
        imgBackground.setAttribute("src", "images/splash.jpg");

        var preloadImgBackground = document.createElement("img");
        preloadImgBackground.setAttribute("src", "images/background.jpg");
    } else if (state == "refresh") {
        waiting = true;
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), loadingText[lang]);

        var raveneye = document.getElementById("raveneye");
        raveneye.style.animation = "none";
        raveneye.style.webkitAnimation = "none";
        raveneye.offsetHeight; // trigger reflow
        raveneye.style.animation = null;
        raveneye.style.webkitAnimation = null;
        raveneye.style.visibility = "visible";
    } else {
        var raveneye = document.getElementById("raveneye");
        raveneye.style.animation = "none";
        raveneye.style.webkitAnimation = "none";
        raveneye.style.visibility = "hidden";
        document.getElementById("splashtitle").style.visibility = "hidden";
        document.getElementById("OverlayVideoPlayerFull").style.backgroundImage = "url('images/background.jpg')";
    }
}

function GetMovieInfo(qtype, type, cpage, typedtext) {
    var reqSuccess = false;
    justexit = false;
    if (type == "first") {
        SetWaitAndZIndex("visible", 100);
        lastsearch = typedtext;
    }

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
            reqSuccess = true;
            alert("[White Raven] Tmdb data received");
            
            var dataobject = JSON.parse(this.responseText.replace(/\"name\"/g,"\"title\"")).results[0];
            
            var maxIndex = 0;
            if (dataobject.results) {
                maxIndex = dataobject.results.length;
            }

            if (maxIndex > 0) {
                totalpages = dataobject.total_pages;
                for(var i=0; i<maxIndex; i++) {
                    var duplicated = false;
                    if (dataobject.results[i].poster_path != undefined) {
                        for (var j=0; j<wrapData.length; j++) {
                            if (dataobject.results[i].poster_path == wrapData[j].poster_path) {
                                duplicated = true;
                                break;
                            }

                            if (dataobject.results[i].poster_path == '') {
                                duplicated = true;
                                break;
                            }

                            if (dataobject.results[i].poster_path == undefined) {
                                duplicated = true;
                                break;
                            }

                            if (dataobject.results[i].poster_path.indexOf(".jpg") == -1) {
                                duplicated = true;
                                break;
                            }
                        }

                        if (!duplicated) {
                            if (dataobject.results[i].title.length >= 55) {
                                dataobject.results[i].title = dataobject.results[i].title.substring(0, 52) + "..."
                            }
                            // A big fat wrap object
                            wrapData.push(dataobject.results[i]);

                            // Preload all images
                            var imgX = document.createElement("img");
                            imgX.setAttribute("src", w185src + dataobject.results[i].poster_path);
                            //new Image().src = w185src + dataobject.results[i].poster_path; // Memory issues on Samsung
                            
                            if (mccount < 10) {
                                var movieCard = document.getElementsByClassName("moviecards_image");

                                movieCard[mccount].parentElement.id = "moviecards" + mccount;
                                if (mccount < 5) {
                                    movieCard[mccount].parentElement.style.top = "43px";
                                } else {
                                    movieCard[mccount].parentElement.style.top = "277px";
                                }
                                movieCard[mccount].children[0].src = w185src + dataobject.results[i].poster_path;
                                movieCard[mccount].children[0].onerror = function () { this.src = "images\\empty.png"; }
                                movieCard[mccount].children[1].textContent = dataobject.results[i].title;
                                movieCard[mccount].parentElement.style.visibility = "inherit";
                            }

                            mccount++;

                            if (mccount == 10) {
                                setTimeout(function() {
                                    StartOrStopWithLogo("stop");
                                    document.getElementsByClassName('newwrap')[0].style.visibility = "visible";
                                    SetWaitAndZIndex("hidden", 5);
                                    document.getElementById("moviecards0").className = "mc_selected";
                                    if (qtype == "search") {
                                        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsTextNoGenres[lang]);
                                    } else {
                                        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsText[lang]);
                                    }
                                }.bind(this), 700);
                            }
                            
                        }
                    }
                }

                // Need to rewrite the data reading later to avoid this situation
                if (mccount > 0 && mccount < 10) {
                    //console.log(mccount, ' - ', document.getElementsByClassName('newwrap')[0].style.visibility);
                    var movieCard = document.getElementsByClassName("moviecards_image");
                    for (var m = mccount;m < 10;m++) {
                        movieCard[m].parentElement.style.visibility = "hidden";
                    }
                    setTimeout(function() {
                        StartOrStopWithLogo("stop");
                        document.getElementsByClassName('newwrap')[0].style.visibility = "visible";
                        SetWaitAndZIndex("hidden", 5);
                        document.getElementById("moviecards0").className = "mc_selected";
                        if (qtype == "search") {
                            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsTextNoGenres[lang]);
                        } else {
                            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsText[lang]);
                        }
                    }.bind(this), 700);
                }

                if (qtype == "search" && type == "first") {
                    GetMovieInfo(qtype, "silent", cpage, typedtext);
                }

            } else if (maxIndex == 0) {
                if (qtype == "search") {
                    if (type == "first") {
                        //reqSuccess = true;
                        GetMovieInfo(qtype, "silent", cpage, typedtext);
                    } else {
                        if (mccount == 0) {
                            //document.getElementsByClassName('wrap').visibility = "hidden";
                            //SetWaitAndZIndex("hidden", 5);
                            document.getElementById("loaDing").style.visibility = "hidden";
                            document.getElementById("loaDing").className = "loaderoff";
                            widgetAPI.putInnerHTML(document.getElementById("noConnection"), noSearchResultText[lang]);
                            document.getElementById("noConnection").style.visibility = "visible";
                            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), searchMissingSettingsText[lang]);
                            searcherror = true; waiting = false;
                            //alert("ERROR: NO ITEM!");
                        }
                    }
                } else {
                    if (type == "first") {
                        IsTheServerStillRunning(function(stillrunning) {
                            isrunning = stillrunning;
                            if (isrunning == true) {
                                widgetAPI.putInnerHTML(document.getElementById("noConnection"), noConnectionText[lang]);
                                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), justexitText[lang]);
                            } else {
                                widgetAPI.putInnerHTML(document.getElementById("noConnection"), noConnectionTryToRefreshText[lang]);
                                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), tryAgainOrExitText[lang]);
                            }
                            document.getElementById("loaDing").style.visibility = "hidden";
                            document.getElementById("loaDing").className = "loaderoff";
                            StopRavenEyeAnimation();
                            document.getElementById("noConnection").style.visibility = "visible";

                            //reqSuccess = true;
                            justexit = true;
                        });
                    }
                    //alert("ERROR: NO ITEM!");
                }
            }
        }

      }
    });

    var dbpos = languageListText['shortcode'].indexOf(saveSettings['database']);

    if (qtype != "search") {
        alert("[White Raven] Tmdb request: http://" + serverIP + ":9000/api/tmdbdiscover/type/" + qtype + "/genretype/" + genretype + "/sort/" + sortby + "/date/" + ptoday + "/lang/" + languageListText['tmdbcode'][dbpos] + "/page/" + cpage);
        xhr.open("GET", "http://" + serverIP + ":9000/api/tmdbdiscover/type/" + qtype + "/genretype/" + genretype + "/sort/" + sortby + "/date/" + ptoday + "/lang/" + languageListText['tmdbcode'][dbpos] + "/page/" + cpage);
    } else {
        if (type == "first") {
            xhr.open("GET", "http://" + serverIP + ":9000/api/tmdbsearch/type/movie/lang/" + languageListText['tmdbcode'][dbpos] + "/page/" + cpage + "/text/" + typedtext);
        } else {
            xhr.open("GET", "http://" + serverIP + ":9000/api/tmdbsearch/type/tv/lang/" + languageListText['tmdbcode'][dbpos] + "/page/" + cpage + "/text/" + typedtext);
        }
    }

    xhr.send();

    // No internet connection or connection timeout handling
    setTimeout(function() {
        if (!reqSuccess) {
            xhr.abort();

            reqSuccess = true;

            if (type == "first") {    
                IsTheServerStillRunning(function(stillrunning) {
                    isrunning = stillrunning;
                    if (isrunning == true) {
                        widgetAPI.putInnerHTML(document.getElementById("noConnection"), noConnectionText[lang]);
                        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), justexitText[lang]);
                    } else {
                        widgetAPI.putInnerHTML(document.getElementById("noConnection"), noConnectionTryToRefreshText[lang]);
                        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), tryAgainOrExitText[lang]);
                    }
                    document.getElementById("loaDing").style.visibility = "hidden";
                    document.getElementById("loaDing").className = "loaderoff";
                    StopRavenEyeAnimation();
                    document.getElementById("noConnection").style.visibility = "visible";

                    //reqSuccess = true;
                    justexit = true;
                });
            }
            //alert("ERROR: Timeout!")
        }
    }, 20000);
}

function ImageExists(data) {
    var params = {
        itemId : data.id,
        itemType : "tv"
    }

    if (data.release_date != undefined) {
        params.itemType = "movie";
    }

    var img = document.createElement("img");
    img.onerror = function() { UpdatePosterAndBackdropPath(params.itemId, params.itemType); }.bind(params);
    img.setAttribute("src", w185src + data.poster_path);
}

function CheckFavouritesData() {
    var dataobject = JSON.parse(ReadFavouritesFromLocal());
    var maxIndex = dataobject.length;

    if (maxIndex > 0) {
        for(var i=0; i<maxIndex; i++) {
            ImageExists(dataobject[i]);
        }
    }
}

function GeFavouritesInfo() {
    justexit = false;
    faverror = false;
    
    SetWaitAndZIndex("visible", 100);

    var dataobject = JSON.parse(ReadFavouritesFromLocal());
    var maxIndex = dataobject.length;

    if (maxIndex > 0) {
        totalpages = 1;
        for(var i=0; i<maxIndex; i++) {
            var duplicated = false;
            if (dataobject[i].poster_path != undefined) {
                for (var j=0; j<wrapData.length; j++) {
                    if (dataobject[i].poster_path == wrapData[j].poster_path) {
                        duplicated = true;
                        break;
                    }

                    if (dataobject[i].poster_path == '') {
                        duplicated = true;
                        break;
                    }

                    if (dataobject[i].poster_path == undefined) {
                        duplicated = true;
                        break;
                    }

                    if (dataobject[i].poster_path.indexOf(".jpg") == -1) {
                        duplicated = true;
                        break;
                    }
                }

                if (!duplicated) {
                    if (dataobject[i].title.length >= 55) {
                        dataobject[i].title = dataobject[i].title.substring(0, 52) + "..."
                    }
                    // A big fat wrap object
                    wrapData.push(dataobject[i]);

                    // Preload all images
                    var imgX = document.createElement("img");
                    imgX.setAttribute("src", w185src + dataobject[i].poster_path);
                    //new Image().src = w185src + dataobject[i].poster_path; // Memory issues on Samsung
                    
                    if (mccount < 10) {
                        var movieCard = document.getElementsByClassName("moviecards_image");

                        movieCard[mccount].parentElement.id = "moviecards" + mccount;
                        if (mccount < 5) {
                            movieCard[mccount].parentElement.style.top = "43px";
                        } else {
                            movieCard[mccount].parentElement.style.top = "277px";
                        }
                        movieCard[mccount].children[0].src = w185src + dataobject[i].poster_path;
                        movieCard[mccount].children[0].onerror = function () { this.src = "images\\missing.png"; }
                        movieCard[mccount].children[1].textContent = dataobject[i].title;
                        movieCard[mccount].parentElement.style.visibility = "inherit";
                    }

                    mccount++;

                    if (mccount == 10) {
                        setTimeout(function() {
                            StartOrStopWithLogo("stop");
                            document.getElementsByClassName('newwrap')[0].style.visibility = "visible";
                            SetWaitAndZIndex("hidden", 5);
                            document.getElementById("moviecards0").className = "mc_selected";
                            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), favouritesettingsText[lang]);
                        }.bind(this), 700);
                    }
                }
            }
        }

        // Need to rewrite the data reading later to avoid this situation
        if (mccount > 0 && mccount < 10) {
            //console.log(mccount, ' - ', document.getElementsByClassName('newwrap')[0].style.visibility);
            var movieCard = document.getElementsByClassName("moviecards_image");
            for (var m = mccount;m < 10;m++) {
                movieCard[m].parentElement.style.visibility = "hidden";
            }
            setTimeout(function() {
                StartOrStopWithLogo("stop");
                document.getElementsByClassName('newwrap')[0].style.visibility = "visible";
                SetWaitAndZIndex("hidden", 5);
                document.getElementById("moviecards0").className = "mc_selected";
                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), favouritesettingsText[lang]);
            }.bind(this), 700);
        }

    } else if (maxIndex == 0) {
        document.getElementById("loaDing").style.visibility = "hidden";
        document.getElementById("loaDing").className = "loaderoff";
        widgetAPI.putInnerHTML(document.getElementById("noConnection"), noFavouritesResultText[lang]);
        document.getElementById("noConnection").style.visibility = "visible";
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), searchMissingSettingsText[lang]);
        searcherror = true; faverror = true; waiting = false;          
    }
}

function ShowMoviesMenu(gen, sort) {
    querytype = "movie";
    waiting = false;
    justexit = false;
    searcherror = false;
    genretype = gen;
    sortby = sort;
    wrapData = [];
    position = 0;
    page = 1;
    totalpages = 1;
    mccount = 0;
    document.getElementsByClassName('newwrap')[0].style.visibility = "hidden";
    if (document.getElementsByClassName('mc_selected')[0] != undefined) {
        document.getElementsByClassName('mc_selected')[0].className = "";
    }
    var movieCard = document.getElementsByClassName("moviecards_image");
    for (var m = 0;m < 15;m++) {
        movieCard[m].parentElement.id = "moviecards" + m;
        movieCard[m].parentElement.style.visibility = "hidden";
    }
    
    GetMovieInfo(querytype,"first", page, "");

    document.getElementById('OverlayVideoMenu').style.visibility = "hidden";
    document.getElementById('OverlayVideoMenu').style.top = 0;
    document.getElementById('OverlayVideoMenu').style.height = 0;
    if (document.getElementsByClassName('active')[0]) {
        document.getElementsByClassName('active')[0].className = "";
    }       
}

function ShowShowsMenu(gen, sort) {
    querytype = "tv";
    waiting = false;
    justexit = false;
    searcherror = false;
    genretype = gen;
    sortby = sort;
    wrapData = [];
    position = 0;
    page = 1;
    totalpages = 1;
    mccount = 0;
    document.getElementsByClassName('newwrap')[0].style.visibility = "hidden";
    if (document.getElementsByClassName('mc_selected')[0] != undefined) {
        document.getElementsByClassName('mc_selected')[0].className = "";
    }
    var movieCard = document.getElementsByClassName("moviecards_image");
    for (var m = 0;m < 15;m++) {
        movieCard[m].parentElement.id = "moviecards" + m;
        movieCard[m].parentElement.style.visibility = "hidden";
    }

    GetMovieInfo(querytype,"first", page, "");

    document.getElementById('OverlayVideoMenu').style.visibility = "hidden";
    document.getElementById('OverlayVideoMenu').style.top = 0;
    document.getElementById('OverlayVideoMenu').style.height = 0;    
    if (document.getElementsByClassName('active')[0]) {
        document.getElementsByClassName('active')[0].className = "";
    }
    
}

function ShowFavouritesMenu() {
    // Save previous variable states
    save_wrapData = wrapData;
    save_position = position;
    save_querytype = querytype;
    save_page = page;
    save_totalpages = totalpages;
    save_mccount = mccount;

    querytype = "favourites";
    waiting = false;
    justexit = false;
    searcherror = false;
    wrapData = [];
    position = 0;
    page = 1;
    totalpages = 1;
    mccount = 0;
    document.getElementsByClassName('newwrap')[0].style.visibility = "hidden";
    if (document.getElementsByClassName('mc_selected')[0] != undefined) {
        save_mcselected_id = document.getElementsByClassName('mc_selected')[0].id;
        document.getElementsByClassName('mc_selected')[0].className = "";
    }
    var movieCard = document.getElementsByClassName("moviecards_image");
    for (var m = 0;m < 15;m++) {
        save_mvc_id[m] = movieCard[m].parentElement.id;
        save_mvc_state[m] = movieCard[m].parentElement.style.visibility;
        movieCard[m].parentElement.id = "moviecards" + m;
        movieCard[m].parentElement.style.visibility = "hidden";
    }

    GeFavouritesInfo();

    document.getElementById('OverlayVideoMenu').style.visibility = "hidden";
    document.getElementById('OverlayVideoMenu').style.top = 0;
    document.getElementById('OverlayVideoMenu').style.height = 0;
    if (document.getElementsByClassName('active')[0]) {
        document.getElementsByClassName('active')[0].className = "";
    }
}

function ShowSearchMenu(typedtext) {
    // Save previous variable states
    save_wrapData = wrapData;
    save_position = position;
    save_querytype = querytype;
    save_page = page;
    save_totalpages = totalpages;
    save_mccount = mccount;

    querytype = "search";
    waiting = false;
    justexit = false;
    searcherror = false;
    wrapData = [];
    position = 0;
    page = 1;
    totalpages = 1;
    mccount = 0;
    document.getElementsByClassName('newwrap')[0].style.visibility = "hidden";
    if (document.getElementsByClassName('mc_selected')[0] != undefined) {
        save_mcselected_id = document.getElementsByClassName('mc_selected')[0].id;
        document.getElementsByClassName('mc_selected')[0].className = "";
    }
    var movieCard = document.getElementsByClassName("moviecards_image");
    for (var m = 0;m < 15;m++) {
        save_mvc_id[m] = movieCard[m].parentElement.id;
        save_mvc_state[m] = movieCard[m].parentElement.style.visibility;
        movieCard[m].parentElement.id = "moviecards" + m;
        movieCard[m].parentElement.style.visibility = "hidden";
    }

    GetMovieInfo(querytype,"first", page, typedtext.replace(/ /g, "+"));

    document.getElementById('OverlayVideoMenu').style.visibility = "hidden";
    document.getElementById('OverlayVideoMenu').style.top = 0;
    document.getElementById('OverlayVideoMenu').style.height = 0;
    if (document.getElementsByClassName('active')[0]) {
        document.getElementsByClassName('active')[0].className = "";
    }    
}

function ShowSettingsPage() {
    settingspage = true;
    document.getElementById('OverlayVideoMenu').style.visibility = "hidden";
    document.getElementById('OverlayVideoMenu').style.top = 0;
    document.getElementById('OverlayVideoMenu').style.height = 0;
    /*document.getElementsByClassName('active')[0].className = "";*/
    document.getElementsByClassName('keybuttonset')[25].className = "keybuttonset activekey";
    document.getElementById('OverlaySettingsPage').style.visibility = "visible";    
}

String.prototype.ucfirst = function()
{
    return this.charAt(0).toUpperCase() + this.substr(1);
}

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

function SceneMain(options) {
    this.options = options;
}

SceneMain.prototype.initialize = function(){
    // Create or load settings
    CreateOrLoadTemp();
    // Create empty log.txt file
    CreateLogFile();

    sf.core.loadJS('lang/' + lang + '.js', function () {
        // Start the server
        StartStopWRServer("start");
        
        widgetAPI.putInnerHTML(document.getElementById("MoviesInfoInHeader"), headerText[lang]);
        widgetAPI.putInnerHTML(document.getElementById("playbutton"), waitForServerButtonText[lang]);
    });
}

SceneMain.prototype.handleShow = function(){
    //alert("SceneMain.handleShow()");
}

SceneMain.prototype.handleHide = function(){
    // SMART HUB, SOURCE or EXIT key pressed so need to stop the server.    
    alert("[White Raven] SMART HUB, SOURCE or EXIT key pressed and stopped the application.");
    var imgStop = document.createElement("img");
    imgStop.setAttribute("src", "http://" + serverIP + ":9000/api/stop");

    // Save resume data
    resume['time'] = sf.scene.get('PlayerPage').GetResumeTime();
    if (resume['time'] != 0) {
        SaveResumeToLocal(resume);
    }

    sf.core.exit(false);
}

SceneMain.prototype.handleFocus = function(){
    //alert("SceneMain.handleFocus()");
}

SceneMain.prototype.handleBlur = function(){
    //alert("SceneMain.handleBlur()");
    // this function will be called when the scene manager move focus to another scene from this scene
  $("#MainListBox").sfList('blur');
}

SceneMain.prototype.handleKeyDown = function(keyCode){
    //alert("SceneMain.handleKeyDown(" + keyCode + ")");
    // TODO : write an key event handler when this scene get focued
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > mainkeytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.DOWN:
                if (!searcherror) {
                    if (waiting == false) {
                        waiting = true;
                        var mcClass = document.getElementsByClassName("mc_selected")[0];
                        var wp = parseInt(mcClass.id.slice(-1));
                        var offset = (position % 5);
                        
                        if (wp < 5 && wrapData[position + 5] != undefined) {
                            wp = wp + 5;
                            position = position + 5;
                            var nextPosition = "moviecards" + wp;
                            
                            mcClass.className = "";
                            document.getElementById(nextPosition).className = "mc_selected";

                            for (var m = 10;m < 15;m++) {
                              document.getElementById("moviecards" + m).style.top = "514px";
                            }

                            waiting = false;
                        } else if (wp < 5 && wrapData[position + 5] == undefined) {
                            waiting = false;
                        } else if (wp > 4 && wrapData[position - offset + 5] != undefined){
                            //var offset = (position % 5);
                            if (wrapData[position - offset + 9 + 5] == undefined) {
                                if (querytype != "search") {
                                    if (page < totalpages) {
                                        page = page + 1;
                                        GetMovieInfo(querytype, "silent", page, "");
                                    }
                                }
                            }

                            if (wrapData[position - offset + 5] != undefined) {

                                // Card modifications from here                                
                                position = position + 5;

                                for (var m = 10;m < 15;m++) {
                                  document.getElementById("moviecards" + (m - 10)).style.top = "-191px";
                                  document.getElementById("moviecards" + (m - 5)).style.top = "43px";

                                  if (wrapData[position - offset + m - 10] != undefined) {
                                    var thisCard = document.getElementById("moviecards" + m);
                                    thisCard.children[0].children[0].src = w185src + wrapData[position - offset + m - 10].poster_path;
                                    thisCard.children[0].children[1].textContent = wrapData[position - offset + m - 10].title;
                                    thisCard.style.visibility = "inherit";
                                    
                                    thisCard.style.top = "277px";
                                  }
                                }

                                mcClass.className = "";

                                setTimeout(function(){
                                  for (var m = 0;m < 5;m++) {
                                    var thisCard = document.getElementById("moviecards" + m);
                                    thisCard.style.visibility = "hidden";
                                    thisCard.style.top = "514px";
                                  }
                                  // !!! Save data !!!
                                  var mvc = [];
                                  for (var m = 0;m < 15;m++) {
                                    mvc[m] = document.getElementById("moviecards" + m);
                                  }
                                  // Modify first line
                                  for (var m = 5;m < 10;m++) {
                                    mvc[m].id = "moviecards" + (m - 5);
                                  }
                                  // Modify second line
                                  for (var m = 10;m < 15;m++) {
                                    mvc[m].id = "moviecards" + (m - 5);
                                  }
                                  // Modify third line
                                  for (var m = 0;m < 5;m++) {
                                    mvc[m].id = "moviecards" + (m + 10);
                                  }

                                  var nextPosition = "moviecards" + wp;
                                
                                  if (document.getElementById(nextPosition).style.visibility != "hidden") {
                                      document.getElementById(nextPosition).className = "mc_selected";
                                  } else {
                                      position = position - offset;
                                      document.getElementById("moviecards5").className = "mc_selected";
                                  }
                                  
                                  setTimeout(function(){ waiting = false; }, 200);

                                }, 300);                                                                            
                            }
                        } else if (wp > 4 && wrapData[position - offset + 5] == undefined) {
                            waiting = false;
                        }                  
                    }
                }
                break;
            case sf.key.UP:
                if (!searcherror) {
                    if (waiting == false) {
                        waiting = true;
                        var mcClass = document.getElementsByClassName("mc_selected")[0];
                        var wp = parseInt(mcClass.id.slice(-1));

                        if (wp > 4) {
                            wp = wp - 5;
                            position = position - 5;
                            var nextPosition = "moviecards" + wp;
                            
                            mcClass.className = "";
                            document.getElementById(nextPosition).className = "mc_selected";

                            for (var m = 10;m < 15;m++) {
                              document.getElementById("moviecards" + m).style.top = "-191px";
                            }
                            waiting = false;
                        } else {
                            var offset = (position % 5);
                            if (wrapData[position - offset - 5]) {
                                
                                position = position - 5;

                                for (var m = 10;m < 15;m++) {
                                  document.getElementById("moviecards" + (m - 5)).style.top = "514px";
                                  document.getElementById("moviecards" + (m - 10)).style.top = "277px";

                                  var thisCard = document.getElementById("moviecards" + m);
                                  thisCard.children[0].children[0].src = w185src + wrapData[position - offset + m - 10].poster_path;
                                  thisCard.children[0].children[1].textContent = wrapData[position - offset + m - 10].title;
                                  thisCard.style.visibility = "inherit";
                                  
                                  thisCard.style.top = "43px";                                  
                                }

                                mcClass.className = "";

                                setTimeout(function(){
                                  for (var m = 5;m < 10;m++) {
                                    var thisCard = document.getElementById("moviecards" + m);
                                    thisCard.style.visibility = "hidden";
                                    thisCard.style.top = "-191px";
                                  }
                                  // !!! Save data !!!
                                  var mvc = [];
                                  for (var m = 0;m < 15;m++) {
                                    mvc[m] = document.getElementById("moviecards" + m);
                                  }
                                  // Modify first line
                                  for (var m = 5;m < 10;m++) {
                                    mvc[m].id = "moviecards" + (m + 5);
                                  }
                                  // Modify second line
                                  for (var m = 10;m < 15;m++) {
                                    mvc[m].id = "moviecards" + (m - 10);
                                  }
                                  // Modify third line
                                  for (var m = 0;m < 5;m++) {
                                    mvc[m].id = "moviecards" + (m + 5);
                                  }

                                  var nextPosition = "moviecards" + wp;
                                
                                  if (document.getElementById(nextPosition).style.visibility != "hidden") {
                                      document.getElementById(nextPosition).className = "mc_selected";
                                  } else {
                                      position = position - offset;
                                      document.getElementById("moviecards5").className = "mc_selected";
                                  }
                                  
                                  setTimeout(function(){ waiting = false; }, 200);

                                }, 300);                                                         
                            } else {
                                waiting = false;
                            }
                        }
                        
                    }
                }
                break;
            case sf.key.ENTER:
                if (!searcherror) {
                    if (waiting == false) {
                        sf.scene.show('InfoPage', querytype);
                        sf.scene.focus('InfoPage');
                    } else if (justexit == true && noTryAgain == false) {
                        GetMovieInfo(querytype,"first", page, lastsearch);
                    } else if (justexit == true && noTryAgain == true && findserver == true) {
                        justexit = false;
                        noTryAgain = false;
                        findserver = false;
                        document.getElementById("noConnection").style.visibility = "hidden";
                        StartOrStopWithLogo("refresh");
                        FindLocalServer(function(detectedIP) {
			            	if (detectedIP != "") {
			            		serverIP = detectedIP;
                                SaveServerIP();
			            		setTimeout(function(){ IsTheServerStarted(); }, 2000);
			            	} else {
					            document.getElementById("loaDing").style.visibility = "hidden";
					            document.getElementById("loaDing").className = "loaderoff";
					            StopRavenEyeAnimation();
					            widgetAPI.putInnerHTML(document.getElementById("noConnection"), serverNotFoundText[lang]);
					            document.getElementById("noConnection").style.visibility = "visible";
					        
					            justexit = true;
					            noTryAgain = true;
					            if (isRooted == true && isSupported == true) {                
					                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), noTryAgainText[lang]);
					            } else {
					                findserver = true;
					                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), tryAgainOrExitText[lang]);
					            }
			            	}
			            });
                    }
                }
                break;
            case sf.key.RETURN:
                if (!searcherror) {
                    if (waiting == false) {
                        sf.key.preventDefault();
                    } else if (justexit == true) {
                        StartStopWRServer("stop");
                        sf.core.exit(false);
                    } else {
                        sf.key.preventDefault();
                    }
                } else {
                    sf.key.preventDefault();
                    wrapData = save_wrapData;
                    position = save_position;
                    querytype = save_querytype;
                    page = save_page;
                    totalpages = save_totalpages;
                    mccount = save_mccount;
                    searcherror = false;
                    
                    var movieCard = document.getElementsByClassName("moviecards_image");
                    for (var m = 0;m < 15;m++) {
                        movieCard[m].parentElement.id = save_mvc_id[m];
                        movieCard[m].parentElement.style.visibility = save_mvc_state[m];
                    }

                    document.getElementsByClassName('newwrap')[0].style.visibility = "visible";
                    document.getElementById(save_mcselected_id).className = "mc_selected";
                    SetWaitAndZIndex("hidden", 5);
                    //alert('ERROR: ' + querytype);
                    if (querytype == 'search') {
                        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsTextNoGenres[lang]);
                    } else if (querytype == 'favourites') {
                        if (faverror == true) {
                            faverror = false;
                            ShowMoviesMenu('all', 'popularity.desc');
                        } else {
                            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), favouritesettingsText[lang]);
                        }
                    } else {
                        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), mainsettingsText[lang]);
                    }
                }
                break;
            case sf.key.TOOLS:
                if (!searcherror) {
                    if (waiting == false) {
                        sf.scene.show('MainMenu');
                        sf.scene.focus('MainMenu');
                    } else if (justexit == true && noTryAgain == false && isrunning == true) {
                        sf.scene.show('ReceiverPage', { caller: "LoadScreen" });
                        sf.scene.focus('ReceiverPage');
                    }
                }
                break;
            case sf.key.RED:
                if (querytype != 'search') {
                    if (!searcherror) {
                        if (waiting == false) {
                            if (querytype == "movie") {
                                sortMenuText = sortMovieMenuText;
                                sf.scene.show('SortMenu');
                                sf.scene.focus('SortMenu');
                            } else if (querytype == "tv") {
                                sortMenuText = sortTVMenuText;
                                sf.scene.show('SortMenu');
                                sf.scene.focus('SortMenu');
                            }                            
                        }
                    }
                }
                break;
            case sf.key.GREEN:
                if (querytype != 'search') {
                    if (!searcherror) {
                        if (waiting == false) {
                            if (querytype == "movie") {
                                genresMenuText = genresMovieMenuText;
                                sf.scene.show('GenresMenu');
                                sf.scene.focus('GenresMenu');
                            } else if (querytype == "tv") {
                                genresMenuText = genresTVMenuText;
                                sf.scene.show('GenresMenu');
                                sf.scene.focus('GenresMenu');
                            }
                        }
                    }
                }
                break;
            case sf.key.YELLOW:
                if (!searcherror) {
                    if (waiting == false) {
                        if (querytype != 'favourites') {
                            delete wrapData[position].overview;
                            SaveFavouritesToLocal(wrapData[position]);
                        } else {
                            RemoveFavouritesFromLocal(wrapData[position]);
                            ShowFavouritesMenu();
                        }
                    }
                }
                break;
            case sf.key.BLUE:
                if (!searcherror) {
                    if (waiting == false) {
                        if (querytype == 'favourites') {
                            DeleteAllFavouritesFromLocal();
                            ShowFavouritesMenu();
                        }
                    }
                }
                break;
            case sf.key.EXIT:
                sf.key.preventDefault();
                StartStopWRServer("stop");
                sf.core.exit(false);
                break;
        }
    }
    lastkeytime = currentkeytime;
    sf.key.preventDefault();
    switch (keyCode) {
        case sf.key.RIGHT:
                if (!searcherror) {
                    if (waiting == false) {
                        var mcClass = document.getElementsByClassName("mc_selected")[0];
                        var wp = parseInt(mcClass.id.slice(-1));
                        
                        if (wp != 4 && wp != 9 && wrapData[position + 1] != undefined) {
                            ++wp;
                            ++position;
                        }
                        var nextPosition = "moviecards" + wp;
                        
                        mcClass.className = "";
                        document.getElementById(nextPosition).className = "mc_selected";

                    }
                }
                break;
        case sf.key.LEFT:
            if (!searcherror) {
                if (waiting == false) {
                    var mcClass = document.getElementsByClassName("mc_selected")[0];
                    var wp = parseInt(mcClass.id.slice(-1));
                    
                    if (wp != 0 && wp != 5) {
                        --wp;
                        --position;
                    }
                    var nextPosition = "moviecards" + wp;
                    
                    mcClass.className = "";
                    document.getElementById(nextPosition).className = "mc_selected";
                }
            }
            break;
    }
}

SceneMain.prototype.printEvent = function(msg){
  //alert("SceneMain.prototype.printEvent("+msg+")");
}