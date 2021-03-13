function SceneReceiverPage() {}

SceneReceiverPage.prototype.initialize = function () {
    this.titletext = '';
    this.playurl = '';
    this.filetitle = '';
    this.videolist =  [];
    this.langpos = languageListText['shortcode'].indexOf(saveSettings['subtitlelang']);
    this.caller = '';
    //alert("ERROR: " + Object.getOwnPropertyNames(window.webapis.oci));
    //alert("ERROR: " + window.webapis.oci.destroy.toString());
}

SceneReceiverPage.prototype.handleShow = function (arguments) {
    this.caller = arguments.caller;
    this.prevtop = document.getElementById('OverlayMenuInfo').style.top;
    this.prevdata = document.getElementById('menuinfo').innerHTML;

    receiverWaiting = false;
    haveMultiVideo = false;

	if (this.caller == "MainMenu") {
        document.getElementById('OverlayVideoMenu').style.visibility = "hidden";
    } else if (this.caller == "LoadScreen") {
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
    }

    widgetAPI.putInnerHTML(document.getElementById("noConnection"), receiverText[lang] + "HTTP://" + serverIP + ":9000");
    document.getElementById("noConnection").style.visibility = "visible";

    $.ajax({ url: "http://" + serverIP + ":9000/api/receivemagnet/start", success: function(result) {}});
    receivingProgress = true;
    this.CheckReceivedTorrent();
};

SceneReceiverPage.prototype.handleHide = function () {
    receivingProgress = false;
    $.ajax({ url: "http://" + serverIP + ":9000/api/receivemagnet/stop", success: function(result) {}});

	if (this.caller == "MainMenu") {
        document.getElementById('noConnection').style.visibility = "hidden";
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
        document.getElementById('OverlayVideoMenu').style.visibility = "visible";
        
        document.getElementById('OverlayMenuInfo').style.top = this.prevtop;
        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), this.prevdata);
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
        sf.scene.focus('MainMenu');
    } else if (this.caller == "LoadScreen") {
        widgetAPI.putInnerHTML(document.getElementById("noConnection"), noConnectionText[lang]);
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), justexitText[lang]);
        sf.scene.focus('Main');
    }
};

SceneReceiverPage.prototype.handleFocus = function () {
    receiverWaiting = false;
    haveMultiVideo = false;
    receivingProgress = true;

    $.ajax({ url: "http://" + serverIP + ":9000/api/receivemagnet/start", success: function(result) {}});
    this.CheckReceivedTorrent();
};

SceneReceiverPage.prototype.handleBlur = function () {};

SceneReceiverPage.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
                sf.key.preventDefault();
                if (receiverWaiting == false && haveMultiVideo == false) {
                	sf.scene.hide('ReceiverPage');
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
};

SceneReceiverPage.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};

SceneReceiverPage.prototype.CheckReceivedTorrent = function() {
    $.ajax({
        url: "http://" + serverIP + ":9000/api/receivemagnet/check",
        type: "GET",
        dataType: "json",
        timeout: 25000,
        success: function(data) {
            if (receivingProgress == true && data && data.infohash != "") {
                receivingProgress = false;
                receiverWaiting = true;

                if (SERVER_OK == true) {
                    widgetAPI.putInnerHTML(document.getElementById("noConnection"), receiverMessageText[lang]);
                    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), loadingText[lang]);
                    
                    setTimeout(function() {
                        document.getElementById("noConnection").style.visibility = "hidden";
                    }, 3650);

                    setTimeout(function() {
                        document.getElementById("noConnection").style.visibility = "hidden";
                        document.getElementById("loaDing").className = "loaderon";
                        document.getElementById("loaDing").style.visibility = "visible";

                        $.ajax({ url: "http://" + serverIP + ":9000/api/receivemagnet/stop", success: function(result) {}});

                        resume['hash'] = data.infohash;
                        resume['imdb'] = '';
                        resume['season'] = 0;
                        resume['episode'] = 0;
                        resume['index'] = -1;
                        resume['time'] = 0;

                        SceneReceiverPage.prototype.StartTorrentDownload("", data.infohash);
                    }, 4000);
                }
            }
        }.bind(this),
        complete: function() {
            // Run on succes and error to
            if (receivingProgress == true) {
                this.CheckReceivedTorrent();
            }
        }.bind(this)
    });
}

SceneReceiverPage.prototype.StartTorrentDownload = function(titletext, torrenthash) {
    var reqStartSuccess = false;
    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), loadingText[lang]);

    if (torrenthash != '') {
        this.titletext = titletext;
        this.videolist = [];
        this.langpos = languageListText['shortcode'].indexOf(saveSettings['subtitlelang']);

        var videofiles = ["3g2", "3gp", "aaf", "asf", "avchd", "avi", "drc", "flv", "m2v", "m4p", "m4v", "mkv", "mng", "mov", "mp2", "mp4", "mpe", "mpeg", "mpg", "mpv", "mxf", "nsv", "ogg", "ogv", "qt", "rm", "rmvb", "roq", "svi", "vob", "webm", "wmv", "yuv"];
        var playlength = 0;

        var xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
          if (xhr.readyState == 4) {
            reqStartSuccess = true;
            //receiverWaiting = false;

            if (xhr.status == 200) {
                //widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
                
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

                    sf.scene.show('MultiVideo', {videos: this.videolist, caller: "ReceiverPage"});
                    sf.scene.focus('MultiVideo');
                } else {
                    this.StartPlayback(this.playurl, this.titletext, this.langpos, this.filetitle);
                }
            } else {
                // Prevent stucked torrent
                $.ajax({ url: 'http://' + serverIP + ':9000/api/deleteall', success: function(result) {}});
                
                document.getElementById("loaDing").style.visibility = "hidden";
                document.getElementById("loaDing").className = "loaderoff";
                widgetAPI.putInnerHTML(document.getElementById("noConnection"), cantPlayReceivedMagnetText[lang]);
                document.getElementById("noConnection").style.visibility = "visible";

                // Automatic stepback instead of pressing return
                setTimeout(function() {
                    sf.scene.focus('ReceiverPage');
                    widgetAPI.putInnerHTML(document.getElementById("noConnection"), receiverText[lang] + "HTTP://" + serverIP + ":9000");
                    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);                
                }, 4000);
            }

            if (xhr.destroy) { xhr.destroy(); }
          }
        }.bind(this));

        
        xhr.open("GET", 'http://' + serverIP + ':9000/api/add/' + torrenthash);
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
            widgetAPI.putInnerHTML(document.getElementById("noConnection"), cantPlayReceivedMagnetText[lang]);
            document.getElementById("noConnection").style.visibility = "visible";
            
            reqStartSuccess = true;
            // Automatic stepback instead of pressing return
            setTimeout(function() {
                sf.scene.focus('ReceiverPage');
                widgetAPI.putInnerHTML(document.getElementById("noConnection"), receiverText[lang] + "HTTP://" + serverIP + ":9000");                
                widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
            }, 4000);
        }
    }.bind(this), 40000);
}

SceneReceiverPage.prototype.StartPlayback = function(url, titletext, langpos, filetitle) {
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

    resume['season'] = s;
    resume['episode'] = e;

    infoHash = this.playurl.replace("get", "stats");
    n = infoHash.lastIndexOf("/");
    infoHash = infoHash.substr(0, n);
    
    issubtitle = false;
    if (saveSettings['issubtitleenabled'] == "true") {
        this.SearchSubtitlesByText(this.titletext, this.filetitle, languageListText['longcode'][this.langpos], s, e);                             
    } else {
        this.PlayMovieUrl(this.playurl, this.titletext);
    }
}

SceneReceiverPage.prototype.PlayMovieUrl = function(url, title) {    
    if (url != '') {
        if (this.videolist.length == 1) {
            var resumetime = this.GetResumeTime("single");
            if (resumetime != 0) {
                sf.scene.show('ResumeMenu', {url: url, title: title, filetitle: this.filetitle, caller: "ReceiverPage"});
                sf.scene.focus('ResumeMenu');
            } else {
                sf.scene.show('PlayerPage', {url: url, title: title, filetitle: this.filetitle, caller: "ReceiverPage"});
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

SceneReceiverPage.prototype.GetResumeTime = function(type) {
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

SceneReceiverPage.prototype.SearchSubtitlesByText = function(title, filetitle, language, season, episode) {
    //alert("ERROR: " + title + " " + filetitle + " " + language + " " + season + " " + episode);
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

SceneReceiverPage.prototype.DownloadSubtitle = function(zipdownload) {
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