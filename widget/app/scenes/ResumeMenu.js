function SceneResumeMenu() {}

SceneResumeMenu.prototype.initialize = function () {
    this.pos = 0;
    this.videodata = [];
    this.prevtop = document.getElementById('OverlayMenuInfo').style.top;
    this.prevdata = document.getElementById('menuinfo').innerHTML;
}

SceneResumeMenu.prototype.handleShow = function (resumedata) {
    this.initialize();
    this.resumedata = resumedata;

    document.getElementById("loaDing").className = "loaderoff";
    document.getElementById("loaDing").style.visibility = "hidden";
    document.getElementById("ProgressBar").style.visibility = 'hidden';
    document.getElementById("waitscreen").style.display = "initial";

    var resumelist = document.getElementById('resumelist');
    resumelist.style.top = 'initial';
    widgetAPI.putInnerHTML(resumelist, "");

    for(var i=0; i<resumeMenuText['name'].length; i++) {    
        var listitem = document.createElement('li');
        var aitem = document.createElement('a');
        if (i == 0) {
            aitem.className = "active";
            widgetAPI.putInnerHTML(aitem, resumeMenuText[lang][i] + " " + this.timeToHTML(resume['time']));
        } else {
            aitem.className = "";
            widgetAPI.putInnerHTML(aitem, resumeMenuText[lang][i]);
        }        
        listitem.appendChild(aitem);
        resumelist.appendChild(listitem);
    }

    if (resumeMenuText['name'].length > 0) {
        if (resumeMenuText['name'].length < 8) {
            document.getElementById('OverlayResumeMenu').style.height = ((resumeMenuText['name'].length - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top = ((resumeMenuText['name'].length - 1) * 46) + 80;
        } else {
            document.getElementById('OverlayResumeMenu').style.height = ((8 - 1) * 46) + 46;
            document.getElementById('OverlayMenuInfo').style.top =  ((8 - 1) * 46) + 80;
        }
        document.getElementById('OverlayResumeMenu').style.visibility = "visible";
        widgetAPI.putInnerHTML(document.getElementById("SettingsText"), infoscreenText[lang]);

        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), "1 / " + resumeMenuText['name'].length);
        document.getElementById('OverlayMenuInfo').style.visibility = "visible";
    }
}

SceneResumeMenu.prototype.handleHide = function () {
    document.getElementById('OverlayResumeMenu').style.visibility = "hidden";
    document.getElementById("waitscreen").style.display = "initial";

    if (this.resumedata.caller == "HostsMenu") {
        $.ajax({ url: 'http://' + serverIP + ':9000/api/deleteall', success: function(result) {}});

        document.getElementById('poster').className = "posterBasic";
        document.getElementById('OverlayHostsMenu').style.visibility = "visible";
        document.getElementById('OverlayMenuInfo').style.top = this.prevtop;
        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), this.prevdata);
        sf.scene.focus('HostsMenu');
    } else if (this.resumedata.caller == "ReceiverPage") {
        $.ajax({ url: 'http://' + serverIP + ':9000/api/deleteall', success: function(result) {}});

        widgetAPI.putInnerHTML(document.getElementById("noConnection"), receiverText[lang] + "HTTP://" + serverIP + ":9000");
        document.getElementById("noConnection").style.visibility = "visible";
        sf.scene.focus('ReceiverPage');
    } else if (this.resumedata.caller == "MultiVideo") {
        document.getElementById('OverlayMultiVideo').style.visibility = "visible";
        document.getElementById('OverlayMenuInfo').style.top = this.prevtop;
        widgetAPI.putInnerHTML(document.getElementById('menuinfo'), this.prevdata);
        sf.scene.focus('MultiVideo');
    }
};

SceneResumeMenu.prototype.handleFocus = function () {};

SceneResumeMenu.prototype.handleBlur = function () {};

SceneResumeMenu.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.ENTER:
    	        var resumelist = document.getElementById('resumelist').getElementsByTagName("li");
                for(var i=0; i<resumelist.length; i++) {
                    if (resumelist[i].children[0].className == 'active') {
                        var itemname = resumeMenuText['name'][i];
                        break;
                    }
                }

                if (itemname == "startover") {
                    resume['time'] = 0;
                }

                document.getElementById('OverlayResumeMenu').style.visibility = "hidden";
                document.getElementById('OverlayMenuInfo').style.visibility = "hidden";
                document.getElementById('OverlayMenuInfo').style.top = this.prevtop;
                widgetAPI.putInnerHTML(document.getElementById('menuinfo'), this.prevdata);

                document.getElementById("loaDing").className = "loaderon";
                document.getElementById("loaDing").style.visibility = "visible";

                if (this.resumedata.caller == "HostsMenu") {
                    document.getElementById("waitscreen").style.display = "none";
                }

                sf.scene.show('PlayerPage', {url: this.resumedata.url, title: this.resumedata.title, filetitle: this.resumedata.filetitle, caller: this.resumedata.caller});
                sf.scene.focus('PlayerPage');
    	        break;
            case sf.key.RETURN:
            	sf.key.preventDefault();
            	sf.scene.hide('ResumeMenu');
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
        case sf.key.UP:
            var resumelist = document.getElementById('resumelist').getElementsByTagName("li");
            for(var i=0; i<resumelist.length; i++) {
                if (resumelist[i].children[0].className == 'active') {
                    resumelist[i].children[0].className = "";
                    if (this.pos > 0) {
                        this.pos--;
                        i--;
                    } else {
                        if (i > 0) {
                            var nameul = document.getElementById('resumelist');
                            nameul.style.top = nameul.offsetTop + 46;
                            i--;
                        }
                    }
                    resumelist[i].children[0].className = 'active';
                    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + resumelist.length);
                }
            }
            break;
        case sf.key.DOWN:
            var resumelist = document.getElementById('resumelist').getElementsByTagName("li");
            for(var i=0; i<resumelist.length; i++) {
                if (resumelist[i].children[0].className == 'active') {
                    resumelist[i].children[0].className = "";
                    if (this.pos < 7 && this.pos < (resumelist.length - 1)) {
                        this.pos++;
                        i++;
                    } else {
                        if (i < resumelist.length - 1) {
                            var nameul = document.getElementById('resumelist');
                            nameul.style.top = nameul.offsetTop - 46;
                            i++;
                        }
                    }
                    resumelist[i].children[0].className = 'active';
                    widgetAPI.putInnerHTML(document.getElementById('menuinfo'), (i +  1) + " / " + resumelist.length);
                }
            }
            break;             
    }
};

SceneResumeMenu.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};

// Time in milliseconds to string
SceneResumeMenu.prototype.timeToHTML = function(time) {
    var timeHTML = "";
    var timeHour = 0;
    var timeMinute = 0;
    var timeSecond = 0;

    timeHour = Math.floor(time/3600000);
    timeMinute = Math.floor((time%3600000)/60000);
    timeSecond = Math.floor((time%60000)/1000);
    
    if(timeHour == 0)
        timeHTML += "00:";
    else if(timeHour <10)
        timeHTML += "0" + timeHour + ":";
    else
        timeHTML += timeHour + ":";
    
    if(timeMinute == 0)
        timeHTML += "00:";
    else if(timeMinute <10)
        timeHTML += "0" + timeMinute + ":";
    else
        timeHTML += timeMinute + ":";
        
    if(timeSecond == 0)
        timeHTML += "00";
    else if(timeSecond <10)
        timeHTML += "0" + timeSecond;
    else
        timeHTML += timeSecond;

    return timeHTML;            
}