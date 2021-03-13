function SceneLoadSubtitle() {}

SceneLoadSubtitle.prototype.initialize = function () {
    this.pos = 0;
    this.waiting = false;
    this.prevtop = document.getElementById('OverlayPlayerMenuInfo').style.top;
    this.prevdata = document.getElementById('playermenuinfo').innerHTML;
}

SceneLoadSubtitle.prototype.handleShow = function (data) {
    this.initialize();
    this.caller = data.caller;
    
    document.getElementById('OverlaySubtitleMenu').style.visibility = "hidden";

    var filelist = document.getElementById('filelist');
    filelist.style.top = 'initial';
    widgetAPI.putInnerHTML(filelist, "");

    if (issubtitle == true) {

        subtitleslist.splice(99, subtitleslist.length);

        for(var i=0; i<subtitleslist.length; i++) {    
            var listitem = document.createElement('li');
            var aitem = document.createElement('a');
            if (i == 0) {
                aitem.className = "active";
            } else {
                aitem.className = "";
            }

            var pos = languageListText['shortcode'].indexOf(subtitleslist[i].lang);
            if (pos != -1) {
                widgetAPI.putInnerHTML(aitem, subtitleslist[i].subtitlename.substring(0, 70) + " | " + languageListText[lang][pos]);
            } else {
                widgetAPI.putInnerHTML(aitem, subtitleslist[i].subtitlename.substring(0, 70));
            }
            listitem.appendChild(aitem);
            filelist.appendChild(listitem);
        }

        if (subtitleslist.length > 0) {
            if (subtitleslist.length < 5) {
                document.getElementById('OverlayLoadSubtitleMenu').style.height = ((subtitleslist.length - 1) * 46) + 46;
                document.getElementById('OverlayPlayerMenuInfo').style.top = ((subtitleslist.length - 1) * 46) - 54;
            } else {
                document.getElementById('OverlayLoadSubtitleMenu').style.height = ((5 - 1) * 46) + 46;
                document.getElementById('OverlayPlayerMenuInfo').style.top = ((5 - 1) * 46) - 54;
            }
            document.getElementById('OverlayLoadSubtitleMenu').style.visibility = "visible";
            widgetAPI.putInnerHTML(document.getElementById('playermenuinfo'), "1 / " + subtitleslist.length);
            document.getElementById('OverlayPlayerMenuInfo').style.visibility = "visible";
        }
    }
}

SceneLoadSubtitle.prototype.handleHide = function (data) {
    document.getElementById('OverlayLoadSubtitleMenu').style.visibility = "hidden";
    document.getElementById('OverlayPlayerMenuInfo').style.top = this.prevtop;
    widgetAPI.putInnerHTML(document.getElementById('playermenuinfo'), this.prevdata);
      
    if (data.caller == "SubtitleMenu") {
        document.getElementById('OverlaySubtitleMenu').style.visibility = "visible";
    } else if (data.caller == "SubtitleSearch") {
        document.getElementById('OverlayPlayerMenuInfo').style.visibility = "hidden";
    }
}

SceneLoadSubtitle.prototype.handleFocus = function () {};

SceneLoadSubtitle.prototype.handleBlur = function () {};

SceneLoadSubtitle.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.ENTER:
                if (this.waiting == false) {
        	        var filelist = document.getElementById('filelist').getElementsByTagName("li");
                    for(var i=0; i<filelist.length; i++) {
                        if (filelist[i].children[0].className == 'active') {
                            this.waiting = true;
                            sf.scene.get('PlayerPage').DownloadAnotherSubtitle(subtitleslist[i].subdata, filelist[i].children[0], filelist[i].children[0].innerHTML, function(state, menuelement, menuHTML) {
                                if (state == true) {
                                    widgetAPI.putInnerHTML(menuelement, subtitleLoadText[lang][1]); // ok text
                                } else {
                                    widgetAPI.putInnerHTML(menuelement, subtitleLoadText[lang][2]); // error text
                                }
                                setTimeout(function() {
                                    widgetAPI.putInnerHTML(menuelement, menuHTML);
                                    this.waiting = false;
                                }.bind(this), 1000);
                            }.bind(this));
                            break;
                        }
                    }
                }
    	        break;
            case sf.key.RETURN:
            	sf.key.preventDefault();
                if (this.caller == "SubtitleMenu") {
                	sf.scene.hide('LoadSubtitle', {caller: "SubtitleMenu"});
                	sf.scene.focus('SubtitleMenu');
                } else if (this.caller == "SubtitleSearch") {
                    sf.scene.hide('LoadSubtitle', {caller: "SubtitleSearch"});
                    sf.scene.focus('SubtitleSearch');
                }
            	break;
            case sf.key.EXIT:
                sf.key.preventDefault();
                StartStopWRServer("stop");
                sf.core.exit(false);
                break;
            // Comment out this case for real time Player Menu Auto Hide testing
            /*case sf.key.CH_UP:
                sf.scene.get('PlayerPage').playerMenuAutoHideTest();
                break;*/
        }
    }
    lastkeytime = currentkeytime;
    sf.key.preventDefault();
    if (this.waiting == false) {
        switch (keyCode) {
            case sf.key.UP:
                var filelist = document.getElementById('filelist').getElementsByTagName("li");
                for(var i=0; i<filelist.length; i++) {
                    if (filelist[i].children[0].className == 'active') {
                        filelist[i].children[0].className = "";
                        if (this.pos > 0) {
                            this.pos--;
                            i--;
                        } else {
                            if (i > 0) {
                                var nameul = document.getElementById('filelist');
                                nameul.style.top = nameul.offsetTop + 46;
                                i--;
                            }
                        }
                        filelist[i].children[0].className = 'active';
                        widgetAPI.putInnerHTML(document.getElementById('playermenuinfo'), (i +  1) + " / " + filelist.length);
                    }
                }
                break;
            case sf.key.DOWN:
                var filelist = document.getElementById('filelist').getElementsByTagName("li");
                for(var i=0; i<filelist.length; i++) {
                    if (filelist[i].children[0].className == 'active') {
                        filelist[i].children[0].className = "";
                        if (this.pos < 4 && this.pos < (filelist.length - 1)) {
                            this.pos++;
                            i++;
                        } else {
                            if (i < filelist.length - 1) {
                                var nameul = document.getElementById('filelist');
                                nameul.style.top = nameul.offsetTop - 46;
                                i++;
                            }
                        }
                        filelist[i].children[0].className = 'active';
                        widgetAPI.putInnerHTML(document.getElementById('playermenuinfo'), (i +  1) + " / " + filelist.length);
                    }
                }
                break;             
        }
    }
};

SceneLoadSubtitle.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};