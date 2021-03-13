function SceneHostsMenu() {}

SceneHostsMenu.prototype.initialize = function () {
    this.waiting = false;
    this.titletext = '';
    this.magneturl = '';
    this.notorrent = false;
    this.playurl = '';
    this.filetitle = '';
    this.imdbid = '';
    this.season = 0;
    this.episode = 0;
    this.pos = 0;
    this.langpos = languageListText['shortcode'].indexOf(saveSettings['subtitlelang']);
}

SceneHostsMenu.prototype.handleShow = function () {
    this.initialize();
    haveMultiVideo = false;

    this.SetZIndex("visible", 100);

    var thehostlist = document.getElementById('hostlist');
    thehostlist.style.top = 'initial';
    widgetAPI.putInnerHTML(thehostlist, "");

    // Sort magnet links by languages: 1. By database language
    var worklist = [];
    for(var i=0; i<torrenturls.length; i++) {
        if (torrenturls[i].shortlang == saveSettings['database'] && torrenturls[i].title.toLowerCase().indexOf("h265") == -1 && torrenturls[i].title.toLowerCase().indexOf("x265") == -1) {
            worklist.push(torrenturls[i]);
        }
    }

    // Sort magnet links by languages: 2. The fallback language always english
    if (saveSettings['database'] != 'en') {
        for(var i=0; i<torrenturls.length; i++) {
            if (torrenturls[i].shortlang == 'en' && torrenturls[i].title.toLowerCase().indexOf("h265") == -1 && torrenturls[i].title.toLowerCase().indexOf("x265") == -1) {
                worklist.push(torrenturls[i]);
            }
        }
    }

    // Sort magnet links by languages: 3. Push without modification
    for(var i=0; i<torrenturls.length; i++) {
        if (torrenturls[i].shortlang != saveSettings['database'] && torrenturls[i].shortlang != 'en' && torrenturls[i].title.toLowerCase().indexOf("h265") == -1 && torrenturls[i].title.toLowerCase().indexOf("x265") == -1) {
            worklist.push(torrenturls[i]);
        }
    }

    torrenturls = worklist;

    for(var i=0; i<torrenturls.length; i++) {    
        var listitem = document.createElement('li');
        var aitem = document.createElement('a');
        if (i == 0) {
            aitem.className = "active";
        } else {
            aitem.className = "";
        }
        var torrentinfo = torrenturls[i].title + '</BR>' + torrenturls[i].provider + ' | ' + torrenturls[i].resolution + ' | ' + torrenturls[i].language;

        if (torrenturls[i].size != "0") {
            torrentinfo = torrentinfo + ' | ' + bytesToSize(torrenturls[i].size);
        } 

        if (torrenturls[i].seeds != "0" || torrenturls[i].peers != "0") {
            torrentinfo = torrentinfo + ' | SEEDS: ' + torrenturls[i].seeds + ' | PEERS: ' + torrenturls[i].peers;
        }

        widgetAPI.putInnerHTML(aitem, torrentinfo);

        listitem.appendChild(aitem);
        thehostlist.appendChild(listitem);
    }

    if (torrenturls.length > 0) {
        if (torrenturls.length < 5) {
            document.getElementById('OverlayHostsMenu').style.height = ((torrenturls.length - 1) * 70) + 70;
            document.getElementById('OverlayMenuInfo').style.top = ((torrenturls.length - 1) * 70) + 104;
        } else {
            document.getElementById('OverlayHostsMenu').style.height = ((5 - 1) * 70) + 70;
            document.getElementById('OverlayMenuInfo').style.top = ((5 - 1) * 70) + 104;
        }

        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
        document.getElementById('OverlayHostsMenu').style.visibility = "visible";

        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), "1 / " + torrenturls.length);
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
    }
};

SceneHostsMenu.prototype.handleHide = function () {
    document.getElementById('playbutton').className = "activepb";
    document.getElementById('OverlayHostsMenu').style.visibility = "hidden";
    document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
    this.SetWaitAndZIndex("hidden", 5);
    document.getElementById('hostlist').style.height = 0;
    document.getElementById('poster').className = "posterInfo";
    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
};

SceneHostsMenu.prototype.handleFocus = function () {
    this.waiting = false;
    haveMultiVideo = false;

    document.getElementById('poster').className = "posterBasic";
    document.getElementById('poster').style.display = "initial";
    document.getElementById('movieinfo').style.display = "initial";
    document.getElementById('posterblur').style.display = "initial";
    document.getElementById("waitscreen").style.display = "initial";
};

SceneHostsMenu.prototype.handleBlur = function () {};

SceneHostsMenu.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};

SceneHostsMenu.prototype.SetWaitAndZIndex = function(state, number) {
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
        this.waiting = true;
    } else {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), "");
        this.waiting = false;
    }
};

SceneHostsMenu.prototype.StartTorrentDownload = function(titletext, torrenturl) {
    var reqStartSuccess = false;
    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), loadingText[lang]);

    if (torrenturl != '') {
        this.titletext = titletext;
        this.videolist = [];

        var torrenthash = torrenturl.match(/btih:([^&]+)/);
        var videofiles = ["3g2", "3gp", "aaf", "asf", "avchd", "avi", "drc", "flv", "m2v", "m4p", "m4v", "mkv", "mng", "mov", "mp2", "mp4", "mpe", "mpeg", "mpg", "mpv", "mxf", "nsv", "ogg", "ogv", "qt", "rm", "rmvb", "roq", "svi", "vob", "webm", "wmv", "yuv"];
        var playlength = 0;

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
          if (xhr.readyState == 4) {
            reqStartSuccess = true;
            //this.waiting = false;

            if (xhr.status == 200) {
                //widgetAPI.putInnerHTML(document.getElementById("SettingsText"), loadingText[lang]);
                
                var dataobject = JSON.parse(xhr.responseText).results;
                //alert("ERROR: " + xhr.responseText);
                          
                // Find longest video file
                for (var i=0; i<dataobject.length; i++) {
                    for (var j=0; j<videofiles.length; j++) {
                        if ((dataobject[i].name.slice(-videofiles[j].length)) == videofiles[j]) {
                            if (playlength < parseInt(dataobject[i].length)) {
                                playlength = parseInt(dataobject[i].length);
                                this.playurl = dataobject[i].url;
                                //this.filetitle = dataobject[i].name.substr(0, dataobject[i].name.lastIndexOf("."));
                                this.filetitle = dataobject[i].name;
                            }
                        }
                    }
                }

                for (var i=0; i<dataobject.length; i++) {
                    for (var j=0; j<videofiles.length; j++) {
                        if ((dataobject[i].name.slice(-videofiles[j].length)) == videofiles[j]) {
                            if ((parseInt(dataobject[i].length) / playlength) * 100 > 20) {
                                this.videolist.push(dataobject[i]);
                            }
                        }
                    }
                }

                if (this.videolist.length > 1) {
                    document.getElementById("loaDing").style.visibility = "hidden";
                    document.getElementById("loaDing").className = "loaderoff";

                    sf.scene.show('MultiVideo', {videos: this.videolist, caller: "HostsMenu"});
                    sf.scene.focus('MultiVideo');
                } else {
                    infoHash = this.playurl.replace("get", "stats");
	                n = infoHash.lastIndexOf("/");
	                infoHash = infoHash.substr(0, n);

	                this.notorrent = false;

	                issubtitle = false;
	                if (saveSettings['issubtitleenabled'] == "true" && saveSettings['subtitlemode'] == "imdb") {
	                    this.SearchSubtitles(this.imdbid, this.titletext, this.filetitle, languageListText['longcode'][this.langpos], this.season, this.episode);                              
	                } else if (saveSettings['issubtitleenabled'] == "true" && saveSettings['subtitlemode'] == "hash") {
	                    this.SearchSubtitlesByFile(this.playurl.replace("get", "subtitlesbyfile"), this.titletext, languageListText['longcode'][this.langpos]);                              
	                } else {
	                    this.PlayMovieUrl(this.playurl, this.titletext);
	                }
                }
            } else {
                // Prevent stucked torrent
                $.ajax({ url: 'http://' + serverIP + ':9000/api/deleteall', success: function(result) {}});
                
                document.getElementById("loaDing").style.visibility = "hidden";
                document.getElementById("loaDing").className = "loaderoff";
                widgetAPI.putInnerHTML(document.getElementById("noConnection"), cantPlayVideoText[lang]);
                document.getElementById("waitscreen").style.display = "initial";
                document.getElementById("noConnection").style.visibility = "visible";
                
                this.waiting = false;
                this.notorrent = true;
                
                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
            }

            if (xhr.destroy) { xhr.destroy(); }
          }
        }.bind(this));

        
        xhr.open("GET", 'http://' + serverIP + ':9000/api/add/' + torrenthash[1]);
        xhr.send();

    }

    setTimeout(function() {
        if (!reqStartSuccess) {
            if (xhr) {
                xhr.abort();
                if (xhr.destroy) { xhr.destroy(); }
            }

            // Prevent stucked torrent
            $.ajax({ url: 'http://' + serverIP + ':9000/api/deleteall', success: function(result) {}});

            document.getElementById("loaDing").style.visibility = "hidden";
            document.getElementById("loaDing").className = "loaderoff";
            widgetAPI.putInnerHTML(document.getElementById("noConnection"), cantPlayVideoText[lang]);
            document.getElementById("waitscreen").style.display = "initial";
            document.getElementById("noConnection").style.visibility = "visible";
            
            reqStartSuccess = true;
            this.waiting = false;
            this.notorrent = true;
            
            widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
        }
    }.bind(this), 40000);
}

SceneHostsMenu.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
                if (this.waiting == false && this.notorrent == false) {
                	sf.key.preventDefault();
                	sf.scene.hide('HostsMenu');
                	sf.scene.focus('InfoPage');
                } else if (this.waiting == false && this.notorrent == true) {
                    sf.key.preventDefault();
                    document.getElementById("noConnection").style.visibility = "hidden";
                    
                    document.getElementById('OverlayHostsMenu').style.visibility = "visible";
                    document.getElementById('OverlayMenuInfo').style.visibility = "visible";

                    document.getElementById('poster').style.display = "initial";
                    document.getElementById('movieinfo').style.display = "initial";
                    document.getElementById('posterblur').style.display = "initial";
                    document.getElementById("waitscreen").style.display = "initial";

                    this.waiting = false;
                    this.notorrent = false;
                } else if (this.waiting == true) {                    
                    sf.key.preventDefault();
                }
            	break;
            case sf.key.ENTER:
                if (this.waiting == false && this.notorrent == false) {
                    if (SERVER_OK == true) {
                        var menulist = document.getElementById('hostlist').getElementsByTagName("li");
                        for(var i=0; i<menulist.length; i++) {
                            if (menulist[i].children[0].className == 'active') {
                                //alert(torrenturls[i].embedurl);
                                document.getElementById('OverlayHostsMenu').style.visibility = "hidden";
                                document.getElementById('OverlayMenuInfo').style.visibility = "hidden";

                                document.getElementById('poster').style.display = "none";
                                document.getElementById('movieinfo').style.display = "none";
                                document.getElementById('posterblur').style.display = "none";
                                document.getElementById("waitscreen").style.display = "none";

                                document.getElementById("loaDing").className = "loaderon";
                                document.getElementById("loaDing").style.visibility = "visible";
                                this.waiting = true;
                                infoHash = '';
                                this.titletext = torrenturls[i].title;
                                this.magneturl = torrenturls[i].magneturl;
                                this.imdbid = torrenturls[i].imdbid;
                                this.season = torrenturls[i].season;
                                this.episode = torrenturls[i].episode;

                                resume['hash'] = this.magneturl.match(/btih:([^&]+)/)[1];
                                resume['imdb'] = this.imdbid;
                                resume['season'] = this.season;
                                resume['episode'] = this.episode;
                                resume['index'] = -1;
                                resume['time'] = 0;
                                
                                this.StartTorrentDownload(this.titletext, this.magneturl);
                                break;
                            }
                        }
                    }
                }
                break;
            case sf.key.EXIT:
                sf.key.preventDefault();
                if (this.waiting == false) {
                    StartStopWRServer("stop");
                    sf.core.exit(false);
                } else {
                    StartStopWRServer("stop");
                    sf.core.exit(false);                                    
                }
                break;
        }
    }
    lastkeytime = currentkeytime;
    sf.key.preventDefault();
    switch (keyCode) {
        case sf.key.DOWN:
                if (this.waiting == false && this.notorrent == false) {
                    var menulist = document.getElementById('hostlist').getElementsByTagName("li");
                    for(var i=0; i<menulist.length; i++) {
                        if (menulist[i].children[0].className == 'active') {
                            menulist[i].children[0].className = "";
                            if (this.pos < 4 && this.pos < (menulist.length - 1)) {
                                this.pos++;
                                i++;
                            } else {
                                if (i < menulist.length - 1) {
                                    var nameul = document.getElementById('hostlist');
                                    nameul.style.top = nameul.offsetTop - 70;
                                    i++;
                                }
                            }
                            menulist[i].children[0].className = 'active';
                            widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + menulist.length);
                        }
                    }
                }
                break;
        case sf.key.UP:
            if (this.waiting == false && this.notorrent == false) {
                var menulist = document.getElementById('hostlist').getElementsByTagName("li");
                for(var i=0; i<menulist.length; i++) {
                    if (menulist[i].children[0].className == 'active') {
                        menulist[i].children[0].className = "";
                        if (this.pos > 0) {
                            this.pos--;
                            i--;
                        } else {
                            if (i > 0) {
                                var nameul = document.getElementById('hostlist');
                                nameul.style.top = nameul.offsetTop + 70;
                                i--;
                            }
                        }
                        menulist[i].children[0].className = 'active';
                        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + menulist.length);
                    }
                }
            }
            break;
    }
};

// Start playback for multiple video file torrents
SceneHostsMenu.prototype.StartPlayback = function(url, titletext, langpos, filetitle) {
    this.playurl = url;
    this.titletext = titletext;
    this.langpos = langpos;
    this.filetitle = filetitle.replace(/\-|\.|\+/gi, " ");

    var s = 0;
    var e = 0;
    var res = this.filetitle.match(/(.+[^s]+)s([0-9]+)(|[\s\S]+)e([0-9]+)/i);
    if (res) {
        this.titletext = res[1].trim();
        this.titletext = this.titletext.replace(/\b(((?:19[0-9]|20[0-9])[0-9]))\b/, "");
        s = parseInt(res[2]);
        e = parseInt(res[4]);
    } else {
        if (this.titletext == "") {
            this.titletext = filetitle.replace(/\-|\.|\+/gi, " ");
        }
    }

    infoHash = this.playurl.replace("get", "stats");
    n = infoHash.lastIndexOf("/");
    infoHash = infoHash.substr(0, n);
    
    issubtitle = false;
    if (saveSettings['issubtitleenabled'] == "true") {
        if (this.imdbid != "") {
            this.SearchSubtitles(this.imdbid, this.titletext, this.filetitle, languageListText['longcode'][this.langpos], s, e);
        } else {
            this.SearchSubtitlesByText(this.titletext, this.filetitle, languageListText['longcode'][this.langpos], s, e);
        }
    } else {
        this.PlayMovieUrl(this.playurl, this.titletext);
    }
}

SceneHostsMenu.prototype.PlayMovieUrl = function(url, title) {
    if (url != '' && this.waiting == true) {
        if (this.videolist.length == 1) {
            var resumetime = this.GetResumeTime("single");
            if (resumetime != 0) {
                sf.scene.show('ResumeMenu', {url: url, title: title, filetitle: this.filetitle, caller: "HostsMenu"});
                sf.scene.focus('ResumeMenu');
            } else {
                sf.scene.show('PlayerPage', {url: url, title: title, filetitle: this.filetitle, caller: "HostsMenu"});
            	sf.scene.focus('PlayerPage');
            }
        } else {
            var resumetime = this.GetResumeTime("multi");
            if (resumetime != 0) {
                sf.scene.show('ResumeMenu', {url: url, title: title, filetitle: this.filetitle, caller: "MultiVideo"});
                sf.scene.focus('ResumeMenu');
            } else {
                sf.scene.show('PlayerPage', {url: url, title: title, filetitle: this.filetitle, caller: "MultiVideo"});
                sf.scene.focus('PlayerPage');
            }
        }
    }
    haveMultiVideo = false;
}

SceneHostsMenu.prototype.GetResumeTime = function(type) {
    var resumedata = JSON.parse(ReadResumeFromLocal());
    if (type == "single") {
        for(var i=0; i<resumedata.length; i++) {
            if (((resumedata[i].imdb != "" && resumedata[i].imdb == resume['imdb']) || resumedata[i].hash == resume['hash']) &&
                resumedata[i].season == resume['season'] && resumedata[i].episode == resume['episode'] && resumedata[i].time != 0) {
                resume['index'] = resumedata[i].index;
                resume['time'] = resumedata[i].time;
                return resumedata[i].time;
            }
        }
    } else if (type == "multi") {
        for(var i=0; i<resumedata.length; i++) {
            if (((resumedata[i].imdb != "" && resumedata[i].imdb == resume['imdb']) || resumedata[i].hash == resume['hash']) &&
                resumedata[i].season == resume['season'] && resumedata[i].episode == resume['episode'] && resumedata[i].index == resume['index'] && resumedata[i].time != 0) {
                resume['time'] = resumedata[i].time;
                return resumedata[i].time;
            }
        }
    }
    resume['time'] = 0;
    return 0
}

SceneHostsMenu.prototype.SearchSubtitles = function(imdbid, title, filetitle, language, season, episode) {
    document.getElementById('poster').className = "posterDownload";
    document.getElementById("ProgressPercent").style.width = 0;
    widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleSearchText[lang][0]);
    document.getElementById("ProgressBar").style.visibility = 'visible';

    var reqSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      	if (xhr.readyState == 4) {
      		if (xhr.status == 200) {
	            reqSuccess = true;
	            //alert("SUBTITLE SEARCH: " + xhr.responseText);
	            var dataobject = JSON.parse(xhr.responseText).results;
	            if (dataobject) {
                    subtitleslist = dataobject;

                    var similar = 0;
                    var p = -1;

                    for(var i=0; i<subtitleslist.length; i++) {
                    	if (subtitleslist[i].lang.toLowerCase() == languageListText['shortcode'][this.langpos]) {
	                        var sc = SimilarText(subtitleslist[i].releasename.toLowerCase(), filetitle.toLowerCase(), 1);
	                        if (similar < sc) {
	                        	similar = sc;
	                            p = i;
	                        }
	                    }
                    }

                    if (p == -1) {
	                    for(var i=0; i<subtitleslist.length; i++) {
	                        var sc = SimilarText(subtitleslist[i].releasename.toLowerCase(), filetitle.toLowerCase(), 1);
	                        if (similar < sc) {
	                        	similar = sc;
	                            p = i;
	                        }
	                    }
	                }
	                    
                    if (p != -1) {
                    	//SaveErrorToLocal(p + ": " + subtitleslist[p].subformat + " - " + subtitleslist[p].subencoding);
                        subtitlepos = p;
                        this.DownloadSubtitle(subtitleslist[p].subdata);
                    } else {
                        subtitlepos = 0;
                        this.DownloadSubtitle(subtitleslist[0].subdata);
                    }
                } else {
                    widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleNotFoundText[lang]);
	            	this.PlayMovieUrl(this.playurl, this.titletext);
	            }
	        } else {
	        	reqSuccess = true;
                widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleNotFoundText[lang]);
	        	this.PlayMovieUrl(this.playurl, this.titletext);
	        }

            if (xhr.destroy) { xhr.destroy(); }            
      	}
    }.bind(this));

    xhr.open("GET", "http://" + serverIP + ":9000/api/subtitlesbyimdb/" + imdbid + "/lang/" + language + "/season/" + season + "/episode/" + episode);
    xhr.send();

    setTimeout(function() {
        if (!reqSuccess) {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }
            reqSuccess = true;
            widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleNotFoundText[lang]);
        }
    }, 20000);
}

SceneHostsMenu.prototype.SearchSubtitlesByText = function(title, filetitle, language, season, episode) {
    document.getElementById('poster').className = "posterDownload";
    document.getElementById("ProgressPercent").style.width = 0;
    widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleSearchText[lang][0]);
    document.getElementById("ProgressBar").style.visibility = 'visible';

    var reqSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                reqSuccess = true;
                //alert("SUBTITLE SEARCH: " + xhr.responseText);
                var dataobject = JSON.parse(xhr.responseText).results;
                if (dataobject) {
                    subtitleslist = dataobject;

                    var similar = 0;
                    var p = -1;

                    for(var i=0; i<subtitleslist.length; i++) {
                        if (subtitleslist[i].lang.toLowerCase() == languageListText['shortcode'][this.langpos]) {
                            var sc = SimilarText(subtitleslist[i].releasename.toLowerCase(), filetitle.toLowerCase(), 1);
                            if (similar < sc) {
                                similar = sc;
                                p = i;
                            }
                        }
                    }

                    if (p == -1) {
                        for(var i=0; i<subtitleslist.length; i++) {
                            var sc = SimilarText(subtitleslist[i].releasename.toLowerCase(), filetitle.toLowerCase(), 1);
                            if (similar < sc) {
                                similar = sc;
                                p = i;
                            }
                        }
                    }
                        
                    if (p != -1) {
                        //SaveErrorToLocal(p + ": " + subtitleslist[p].subformat + " - " + subtitleslist[p].subencoding);
                        subtitlepos = p;
                        this.DownloadSubtitle(subtitleslist[p].subdata);
                    } else {
                        subtitlepos = 0;
                        this.DownloadSubtitle(subtitleslist[0].subdata);
                    }
                } else {
                    widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleNotFoundText[lang]);
                    this.PlayMovieUrl(this.playurl, this.titletext);
                }
            } else {
                reqSuccess = true;
                widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleNotFoundText[lang]);
                this.PlayMovieUrl(this.playurl, this.titletext);
            }

            if (xhr.destroy) { xhr.destroy(); }            
        }
    }.bind(this));

    xhr.open("GET", "http://" + serverIP + ":9000/api/subtitlesbytext/" + title + "/lang/" + language + "/season/" + season + "/episode/" + episode);
    xhr.send();

    setTimeout(function() {
        if (!reqSuccess) {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }
            reqSuccess = true;
            widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleNotFoundText[lang]);
        }
    }, 20000);
}

SceneHostsMenu.prototype.SearchSubtitlesByFile = function(path, title, language) {
    document.getElementById('poster').className = "posterDownload";
    document.getElementById("ProgressPercent").style.width = 0;
    widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleSearchText[lang][0]);
    document.getElementById("ProgressBar").style.visibility = 'visible';

    var reqSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                reqSuccess = true;
                //alert("ERROR SUBTITLE SEARCH: " + xhr.responseText);
                var dataobject = JSON.parse(xhr.responseText).results;
                if (dataobject) {
                    subtitleslist = dataobject;
                    
                    var p = -1;

                    for(var i=0; i<subtitleslist.length; i++) {
                        if (subtitleslist[i].lang.toLowerCase() == languageListText['shortcode'][this.langpos]) {
                            p = i;
                            break;
                        }
                    }
                    
                    if (p != -1) {
                        this.DownloadSubtitle(subtitleslist[p].subdata);
                    } else {
                        this.DownloadSubtitle(subtitleslist[0].subdata);
                    }
                } else {
                    widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleNotFoundText[lang]);
                    this.PlayMovieUrl(this.playurl, this.titletext);
                }
            } else {
                reqSuccess = true;
                widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleNotFoundText[lang]);
                this.PlayMovieUrl(this.playurl, this.titletext);
            }

            if (xhr.destroy) { xhr.destroy(); }            
        }
    }.bind(this));

    xhr.open("GET", path + "/lang/" + language);
    xhr.send();

    setTimeout(function() {
        if (!reqSuccess) {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }
            reqSuccess = true;
            widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleNotFoundText[lang]);
        }
    }, 20000);
}

SceneHostsMenu.prototype.DownloadSubtitle = function(zipdownload) {
    widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleSearchText[lang][1]);

    var reqSuccess = false;

    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      	if (xhr.readyState == 4) {
      		if (xhr.status == 200) {
	            reqSuccess = true;
	            //alert("SUBTITLE DOWNLOAD: " + xhr.responseText);
                widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleLoadText[lang][1]);

	            issubtitle = true;
                subtitledata = ParseSrtSubtitle(xhr.responseText);
				this.PlayMovieUrl(this.playurl, this.titletext);
			} else {
				reqSuccess = true;
                widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleLoadText[lang][2]);
	        	this.PlayMovieUrl(this.playurl, this.titletext);
			}

            if (xhr.destroy) { xhr.destroy(); }           
        }
    }.bind(this));

    xhr.open("GET", zipdownload);
    xhr.send();

    setTimeout(function() {
        if (!reqSuccess) {
            xhr.abort();
            if (xhr.destroy) { xhr.destroy(); }
            reqSuccess = true;
            widgetAPI.putInnerHTML(document.getElementById("ProgressBarText"), subtitleLoadText[lang][2]);
        }
    }, 20000);
}