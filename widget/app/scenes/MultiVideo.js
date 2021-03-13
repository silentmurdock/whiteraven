function SceneMultiVideo() {}

SceneMultiVideo.prototype.initialize = function () {
    this.pos = 0;
    this.videodata = [];
    this.langpos = languageListText['shortcode'].indexOf(saveSettings['subtitlelang']);
    this.prevtop = document.getElementById('OverlayMenuInfo').style.top;
    this.prevdata = document.getElementById('menuinfo').innerHTML;
}

SceneMultiVideo.prototype.handleShow = function (videodata) {
    this.initialize();
    this.videodata = videodata;
    this.SetZIndex("visible", 100);

    var thevideolist = document.getElementById('videolist');
    thevideolist.style.top = 'initial';
    widgetAPI.putInnerHTML(thevideolist, "");

    for(var i=0; i<videodata.videos.length; i++) {    
        var listitem = document.createElement('li');
        var aitem = document.createElement('a');
        if (i == 0) {
            aitem.className = "active";
        } else {
            aitem.className = "";
        }
        widgetAPI.putInnerHTML(aitem, videodata.videos[i].name);
        listitem.appendChild(aitem);
        thevideolist.appendChild(listitem);
    }

    if (videodata.videos.length > 0) {
        if (videodata.videos.length < 8) {
            document.getElementById('OverlayMultiVideo').style.height = ((videodata.videos.length - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((videodata.videos.length - 1) * 46) + 80;
        } else {
            document.getElementById('OverlayMultiVideo').style.height = ((8 - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((8 - 1) * 46) + 80;
        }
        document.getElementById('OverlayMultiVideo').style.visibility = "visible";
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), "1 / " + videodata.videos.length);
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
    }
};

SceneMultiVideo.prototype.handleHide = function () {
    $.ajax({ url: 'http://' + serverIP + ':9000/api/deleteall', success: function(result) {}});

	document.getElementById('OverlayMultiVideo').style.visibility = "hidden";
    document.getElementById('OverlayMultiVideo').style.height = 0;

    if (this.videodata.caller == "ReceiverPage") {
        widgetAPI.putInnerHTML(document.getElementById("noConnection"), receiverText[lang] + "HTTP://" + serverIP + ":9000");
        document.getElementById("noConnection").style.visibility = "visible";
        document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
    } else if (this.videodata.caller == "HostsMenu") {
        document.getElementById('OverlayHostsMenu').style.visibility = "visible";
        document.getElementById('OverlayMenuInfo').style.top = this.prevtop;
        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), this.prevdata);
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
    }
    
    widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);
};

SceneMultiVideo.prototype.handleFocus = function () {};

SceneMultiVideo.prototype.handleBlur = function () {};

SceneMultiVideo.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.RETURN:
            	sf.key.preventDefault();
                if (haveMultiVideo == false) {
                	sf.scene.hide('MultiVideo');
                    if (this.videodata.caller == "ReceiverPage") {
                	   sf.scene.focus('ReceiverPage');
                    } else if (this.videodata.caller == "HostsMenu") {
                       sf.scene.focus('HostsMenu');
                    }
                }
            	break;
            case sf.key.ENTER:
                var videolist = document.getElementById('videolist').getElementsByTagName("li");
                for(var i=0; i<videolist.length; i++) {
                    if (videolist[i].children[0].className == 'active') {
                        document.getElementById('OverlayMultiVideo').style.visibility = "hidden";
                        document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
                        
                        haveMultiVideo = true;
                        resume['index'] = i;

                        document.getElementById("loaDing").className = "loaderon";
                        document.getElementById("loaDing").style.visibility = "visible";
                        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), loadingText[lang]);

                        if (this.videodata.caller == "ReceiverPage") {
                            sf.scene.get('ReceiverPage').StartPlayback(this.videodata.videos[i].url, this.videodata.videos[i].name, this.langpos, this.videodata.videos[i].name);
                        } else if (this.videodata.caller == "HostsMenu") {
                            sf.scene.get('HostsMenu').StartPlayback(this.videodata.videos[i].url, this.videodata.videos[i].name, this.langpos, this.videodata.videos[i].name);
                        }
                        break;
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
        case sf.key.DOWN:
                var videolist = document.getElementById('videolist').getElementsByTagName("li");
                for(var i=0; i<videolist.length; i++) {
                    if (videolist[i].children[0].className == 'active') {
                        videolist[i].children[0].className = "";
                        if (this.pos < 7 && this.pos < (videolist.length - 1)) {
                            this.pos++;
                            i++;
                        } else {
                            if (i < videolist.length - 1) {
                                var genreul = document.getElementById('videolist');
                                genreul.style.top = genreul.offsetTop - 46;
                                i++;
                            }
                        }
                        videolist[i].children[0].className = 'active';
                        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + videolist.length);
                    }
                }
                break;
        case sf.key.UP:
            var videolist = document.getElementById('videolist').getElementsByTagName("li");
            for(var i=0; i<videolist.length; i++) {
                if (videolist[i].children[0].className == 'active') {
                    videolist[i].children[0].className = "";
                    if (this.pos > 0) {
                        this.pos--;
                        i--;
                    } else {
                        if (i > 0) {
                            var genreul = document.getElementById('videolist');
                            genreul.style.top = genreul.offsetTop + 46;
                            i--;
                        }
                    }
                    videolist[i].children[0].className = 'active';
                    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + videolist.length);
                }
            }
            break;            
    }
};

SceneMultiVideo.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};