function SceneAudioMenu() {}

SceneAudioMenu.prototype.initialize = function () {
    this.pos = 0;
    this.waiting = false;
}

SceneAudioMenu.prototype.handleShow = function (streamcount) {
    this.initialize();
    
    document.getElementById('OverlayAudioMenu').style.visibility = "hidden";
    document.getElementById('OverlayPlayerMenuInfo').style.visibility = "hidden";

    var audiomenulist = document.getElementById('audiomenulist');
    audiomenulist.style.top = 'initial';
    widgetAPI.putInnerHTML(audiomenulist, "");

    for(var i=0; i<streamcount; i++) {    
        var listitem = document.createElement('li');
        var aitem = document.createElement('a');
        if (i == 0) {
            aitem.className = "active";
        } else {
            aitem.className = "";
        }

        widgetAPI.putInnerHTML(aitem, (i+1) + '. ' + audioStreamText[lang][0]);
        
        listitem.appendChild(aitem);
        audiomenulist.appendChild(listitem);
    }

    if (streamcount > 0) {
        if (streamcount < 5) {
            document.getElementById('OverlayAudioMenu').style.height = ((streamcount - 1) * 46) + 46;
            document.getElementById('OverlayPlayerMenuInfo').style.top = ((streamcount - 1) * 46) + 56;
        } else {
            document.getElementById('OverlayAudioMenu').style.height = ((5 - 1) * 46) + 46;
            document.getElementById('OverlayPlayerMenuInfo').style.top = ((5 - 1) * 46) + 56;
        }
        document.getElementById('OverlayAudioMenu').style.visibility = "visible";
        widgetAPI.putInnerHTML(document.getElementById('playermenuinfo'), "1 / " + streamcount);
        document.getElementById('OverlayPlayerMenuInfo').style.visibility = "visible";
    }    
}

SceneAudioMenu.prototype.handleHide = function () {
    document.getElementById('OverlayAudioMenu').style.visibility = "hidden";
    document.getElementById('OverlayPlayerMenuInfo').style.visibility = "hidden";
};

SceneAudioMenu.prototype.handleFocus = function () {};

SceneAudioMenu.prototype.handleBlur = function () {};

SceneAudioMenu.prototype.handleKeyDown = function (keyCode) {
    currentkeytime = new Date();
    if (currentkeytime - lastkeytime > keytimeout) {
        lastkeytime = currentkeytime;
        switch (keyCode) {
            case sf.key.ENTER:
                if (this.waiting == false) {
        	        var audiomenulist = document.getElementById('audiomenulist').getElementsByTagName("li");
                    for(var i=0; i<audiomenulist.length; i++) {
                        if (audiomenulist[i].children[0].className == 'active') {
                            this.waiting = true;
                            widgetAPI.putInnerHTML(audiomenulist[i].children[0], audioStreamText[lang][1]);
                            sf.scene.get('PlayerPage').setAudioStreamID(i);
                            setTimeout(function(){
                                widgetAPI.putInnerHTML(audiomenulist[i].children[0], (i+1) + '. ' + audioStreamText[lang][0]);
                                this.waiting = false;
                            }.bind(this), 500);
                            break;
                        }
                    }
                }
    	        break;
            case sf.key.RETURN:
            	sf.key.preventDefault();
            	sf.scene.hide('AudioMenu');
            	sf.scene.focus('PlayerPage');
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
                var audiomenulist = document.getElementById('audiomenulist').getElementsByTagName("li");
                for(var i=0; i<audiomenulist.length; i++) {
                    if (audiomenulist[i].children[0].className == 'active') {
                        audiomenulist[i].children[0].className = "";
                        if (this.pos > 0) {
                            this.pos--;
                            i--;
                        } else {
                            if (i > 0) {
                                var nameul = document.getElementById('audiomenulist');
                                nameul.style.top = nameul.offsetTop + 46;
                                i--;
                            }
                        }
                        audiomenulist[i].children[0].className = 'active';
                        widgetAPI.putInnerHTML(document.getElementById('playermenuinfo'), (i +  1) + " / " + audiomenulist.length);
                    }
                }
                break;
            case sf.key.DOWN:
                var audiomenulist = document.getElementById('audiomenulist').getElementsByTagName("li");
                for(var i=0; i<audiomenulist.length; i++) {
                    if (audiomenulist[i].children[0].className == 'active') {
                        audiomenulist[i].children[0].className = "";
                        if (this.pos < 4 && this.pos < (audiomenulist.length - 1)) {
                            this.pos++;
                            i++;
                        } else {
                            if (i < audiomenulist.length - 1) {
                                var nameul = document.getElementById('audiomenulist');
                                nameul.style.top = nameul.offsetTop - 46;
                                i++;
                            }
                        }
                        audiomenulist[i].children[0].className = 'active';
                        widgetAPI.putInnerHTML(document.getElementById('playermenuinfo'), (i +  1) + " / " + audiomenulist.length);
                    }
                }
                break;             
        }
    }
};

SceneAudioMenu.prototype.SetZIndex = function(state, number) {
    document.getElementById("OverlayVideoHeader").style.zIndex = number;
    document.getElementById("VideoHeader").style.zIndex = number;
    document.getElementById("OverlayVideoFooter").style.zIndex = number;
    document.getElementById("VideoFooter").style.zIndex = number;
    document.getElementById("waitscreen").style.visibility = state;
};